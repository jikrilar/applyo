"use client";

import { FormEvent, KeyboardEvent, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, BriefcaseBusiness, Layers3 } from "lucide-react";
import type { StageDTO } from "@/backend/dto";
import type { ApplicationRow } from "@/types/database";
import { createApplicationAction, updateApplicationAction } from "@/app/(workspace)/aplikasi/actions";
import { ThemedDateOnlyPicker } from "@/components/ui/date-picker";

type Props = { stages: StageDTO[]; application?: ApplicationRow; onSaved?: () => void; onCancel: () => void };

const text = (data: FormData, name: string) => String(data.get(name) ?? "");
const nullable = (data: FormData, name: string) => text(data, name).trim() || null;
const money = (data: FormData, name: string) => text(data, name) ? Number(text(data, name)) : null;

const employmentOptions = [
  ["", "Belum ditentukan"],
  ["full_time", "Penuh waktu"],
  ["part_time", "Paruh waktu"],
  ["contract", "Kontrak"],
  ["temporary", "Sementara"],
  ["internship", "Magang"],
  ["freelance", "Lepas"],
  ["other", "Lainnya"],
] as const;
const workOptions = [["", "Belum ditentukan"], ["onsite", "Di kantor"], ["hybrid", "Hibrida"], ["remote", "Jarak jauh"]] as const;

function ThemedFormDropdown({ name, value, options, label, icon: Icon, onChange }: { name: string; value: string; options: readonly (readonly [string, string])[]; label: string; icon: typeof BriefcaseBusiness; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(([option]) => option === value) ?? options[0];
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = options.findIndex(([option]) => option === value);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const offset = event.key === "ArrowDown" ? 1 : -1;
      onChange(options[(index + offset + options.length) % options.length][0]);
      setOpen(true);
    }
    if (event.key === "Escape") setOpen(false);
  };
  return <div className="form-dropdown" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}><input type="hidden" name={name} value={value} /><button className="form-dropdown-trigger" type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} onKeyDown={keyDown}><Icon aria-hidden="true" /><span>{selected[1]}</span><ChevronDown aria-hidden="true" /></button>{open && <div className="form-dropdown-menu" role="listbox" aria-label={`Pilih ${label.toLowerCase()}`}>{options.map(([option, text]) => <button className={option === value ? "selected" : ""} type="button" role="option" aria-selected={option === value} onClick={() => { onChange(option); setOpen(false); }} key={option}><span>{text}</span>{option === value && <Check aria-hidden="true" />}</button>)}</div>}</div>;
}

export function ApplicationForm({ stages, application, onSaved, onCancel }: Props) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const visibleActiveStages = stages.filter((stage) => !stage.isClosed && stage.isVisible);
  const defaultStage = visibleActiveStages.find((stage) => stage.systemKey === "wishlist")?.id ?? visibleActiveStages[0]?.id ?? "";
  const [stageId, setStageId] = useState(defaultStage);
  const [employmentType, setEmploymentType] = useState(application?.employment_type ?? "");
  const [workArrangement, setWorkArrangement] = useState(application?.work_arrangement ?? "");
  const [appliedAt, setAppliedAt] = useState(application?.applied_at ?? "");
  const close = () => { if (!dirty || window.confirm("Perubahan belum disimpan. Tutup formulir?")) onCancel(); };
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const salaryMin = money(data, "salaryMin");
    const salaryMax = money(data, "salaryMax");
    if (salaryMin != null && salaryMax != null && salaryMax < salaryMin) { setError("Gaji maksimum tidak boleh lebih kecil dari gaji minimum."); return; }
    const fields = {
      company: text(data, "company"), position: text(data, "position"), jobUrl: nullable(data, "jobUrl"), location: nullable(data, "location"),
      workArrangement: nullable(data, "workArrangement"), employmentType: nullable(data, "employmentType"), source: nullable(data, "source"), appliedAt: nullable(data, "appliedAt"),
      salaryMin, salaryMax, currency: nullable(data, "currency"), jobDescription: nullable(data, "jobDescription"), notes: nullable(data, "notes"),
    };
    startTransition(async () => {
      const result = application ? await updateApplicationAction({ applicationId: application.id, ...fields }) : await createApplicationAction({ stageId: text(data, "stageId"), ...fields });
      if (!result.success) { setError(result.error.message); return; }
      setDirty(false); setError(""); onSaved?.(); router.refresh();
    });
  };

  return <form className="application-full-form" onSubmit={submit} onChange={() => setDirty(true)}>
    <fieldset><legend>Informasi utama</legend><div className="application-form-grid">
      <label className="field-group"><span>Perusahaan *</span><span className="field-control"><input name="company" defaultValue={application?.company} maxLength={200} required /></span></label>
      <label className="field-group"><span>Posisi *</span><span className="field-control"><input name="position" defaultValue={application?.position} maxLength={200} required /></span></label>
       {!application && <div className="field-group"><span>Tahap *</span><ThemedFormDropdown name="stageId" value={stageId} label="Tahap lamaran" icon={Layers3} options={visibleActiveStages.map((stage) => [stage.id, stage.name] as const)} onChange={(value) => { setStageId(value); setDirty(true); }} /></div>}
      <label className="field-group"><span>Lokasi</span><span className="field-control"><input name="location" defaultValue={application?.location ?? ""} maxLength={200} /></span></label>
       <div className="field-group"><span>Pengaturan kerja</span><ThemedFormDropdown name="workArrangement" value={workArrangement} label="pengaturan kerja" icon={BriefcaseBusiness} options={workOptions} onChange={(value) => { setWorkArrangement(value); setDirty(true); }} /></div>
       <div className="field-group"><span>Jenis pekerjaan</span><ThemedFormDropdown name="employmentType" value={employmentType} label="Jenis pekerjaan" icon={BriefcaseBusiness} options={employmentOptions} onChange={(value) => { setEmploymentType(value); setDirty(true); }} /></div>
    </div></fieldset>
    <details><summary>Informasi lowongan <ChevronDown /></summary><div className="application-form-grid">
      <label className="field-group form-wide"><span>Tautan lowongan</span><span className="field-control"><input name="jobUrl" type="url" defaultValue={application?.job_url ?? ""} placeholder="https://" /></span></label>
      <label className="field-group"><span>Sumber</span><span className="field-control"><input name="source" defaultValue={application?.source ?? ""} maxLength={100} /></span></label>
       <div className="field-group"><span>Tanggal melamar</span><ThemedDateOnlyPicker name="appliedAt" value={appliedAt} popoverClassName="application-full-form-date-popover" onChange={(value) => { setAppliedAt(value); setDirty(true); }} /></div>
      <label className="field-group form-wide"><span>Deskripsi pekerjaan</span><span className="field-control"><textarea name="jobDescription" defaultValue={application?.job_description ?? ""} maxLength={50000} rows={7} /></span></label>
    </div></details>
    <details><summary>Kompensasi <ChevronDown /></summary><div className="application-form-grid application-salary-grid">
      <label className="field-group"><span>Gaji minimum</span><span className="field-control"><input name="salaryMin" type="number" min="0" step="1" defaultValue={application?.salary_min ?? ""} /></span></label>
      <label className="field-group"><span>Gaji maksimum</span><span className="field-control"><input name="salaryMax" type="number" min="0" step="1" defaultValue={application?.salary_max ?? ""} /></span></label>
      <label className="field-group"><span>Mata uang</span><span className="field-control"><input name="currency" defaultValue={application?.currency ?? "IDR"} minLength={3} maxLength={3} /></span></label>
    </div></details>
    <details open={Boolean(application?.notes)}><summary>Catatan pribadi <ChevronDown /></summary><label className="field-group"><span>Catatan</span><span className="field-control"><textarea name="notes" defaultValue={application?.notes ?? ""} maxLength={20000} rows={6} /></span></label></details>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="dialog-actions"><button className="filter-button" type="button" onClick={close}>Batal</button><button className="button" type="submit" disabled={pending}>{pending ? "Menyimpan..." : application ? "Simpan perubahan" : "Simpan lamaran"}</button></div>
  </form>;
}
