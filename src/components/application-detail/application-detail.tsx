"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  ExternalLink,
  Pencil,
  RotateCcw,
  Save,
  Send,
  Trash2,
  X,
} from "lucide-react";
import type { ApplicationDetailDTO, PreferencesDTO, RecruitmentEventDTO, StageDTO } from "@/backend/dto";
import { waitingState } from "@/backend/calculations";
import { useDialogA11y } from "@/components/shared/use-dialog-a11y";
import { utcToZonedLocal, zonedLocalToUtc } from "@/lib/dates";
import {
  archiveDetailAction,
  closeDetailAction,
  completeDetailEventAction,
  createDetailEventAction,
  deleteDetailAction,
  deleteDetailEventAction,
  deleteDetailOfferAction,
  reopenDetailAction,
  updateDetailAction,
  updateDetailEventAction,
  upsertDetailOfferAction,
} from "@/app/(workspace)/aplikasi/[id]/actions";
import { ThemedDateOnlyPicker, ThemedDatePicker } from "@/components/ui/date-picker";

const fmt = (value: string | null, timezone: string) => {
  if (!value) return "Belum diisi";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined,
    timeZone: value.includes("T") ? timezone : "UTC",
  }).format(new Date(value.includes("T") ? value : `${value}T00:00:00Z`));
};

const money = (value: number | null, currency: string) =>
  value == null
    ? "Belum diisi"
    : new Intl.NumberFormat("id-ID", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
const eventLabels: Record<string, string> = { interview: "Wawancara", assessment: "Asesmen", recruiter_contact: "Kontak perekrut", follow_up: "Tindak lanjut", offer: "Tawaran", other: "Lainnya" };
const statusLabels: Record<string, string> = { scheduled: "Terjadwal", completed: "Selesai", cancelled: "Dibatalkan" };

export function ApplicationDetail({
  initialDetail,
  stages,
  preferences,
}: {
  initialDetail: ApplicationDetailDTO;
  stages: StageDTO[];
  preferences: PreferencesDTO;
}) {
  const [detail, setDetail] = useState(initialDetail);
  const [edit, setEdit] = useState(false);
  const [notesEdit, setNotesEdit] = useState(false);
  const [offerEdit, setOfferEdit] = useState(false);
  const [editingEvent, setEditingEvent] = useState<RecruitmentEventDTO | null>(null);
  const [closeOpen, setCloseOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const app = detail.application;
  const activeStages = stages.filter((stage) => !stage.isClosed);
  const closedStages = stages.filter((stage) => stage.isClosed);
  const latestActivity = [...detail.timeline.map((item) => item.occurredAt), app.updated_at].sort().at(-1) ?? app.updated_at;
  const upcomingEvents = detail.events.filter((event) => event.status === "scheduled").sort((a, b) => (a.scheduledAt ?? a.deadlineAt ?? "").localeCompare(b.scheduledAt ?? b.deadlineAt ?? ""));
  const waiting = waitingState({ createdAt: app.created_at, appliedAt: app.applied_at, activityDates: detail.timeline.map((item) => item.occurredAt), isClosed: detail.stage.isClosed, isArchived: Boolean(app.archived_at) });

  const run = (promise: Promise<unknown>, done?: () => void) =>
    startTransition(async () => {
      const response = (await promise) as {
        success: boolean;
        data?: ApplicationDetailDTO | null;
        error?: { message: string };
      };
      if (response.success && response.data) {
        setDetail(response.data);
        setMessage("");
        done?.();
      } else {
        setMessage(response.error?.message ?? "Perubahan tidak dapat disimpan.");
      }
    });

  const saveInfo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    run(
      updateDetailAction(app.id, {
        applicationId: app.id,
        company: data.get("company"),
        position: data.get("position"),
        jobUrl: data.get("jobUrl"),
        location: data.get("location"),
        workArrangement: data.get("workArrangement") || null,
        employmentType: data.get("employmentType") || null,
        source: data.get("source"),
        appliedAt: data.get("appliedAt"),
        salaryMin: data.get("salaryMin"),
        salaryMax: data.get("salaryMax"),
        currency: data.get("currency"),
        jobDescription: data.get("jobDescription"),
      }),
      () => setEdit(false),
    );
  };

  const saveNotes = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run(
      updateDetailAction(app.id, {
        applicationId: app.id,
        notes: new FormData(event.currentTarget).get("notes"),
      }),
      () => setNotesEdit(false),
    );
  };

  const saveEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEvent) return;
    const data = new FormData(event.currentTarget);
    run(
      updateDetailEventAction(app.id, {
        eventId: editingEvent.id,
        category: editingEvent.category,
        subtype: editingEvent.subtype,
        title: data.get("title"),
        scheduledAt: data.get("scheduledAt")
          ? zonedLocalToUtc(String(data.get("scheduledAt")), preferences.timezone)
          : null,
        deadlineAt: data.get("deadlineAt")
          ? zonedLocalToUtc(String(data.get("deadlineAt")), preferences.timezone)
          : null,
        location: data.get("location"),
        url: data.get("url"),
        notes: data.get("notes"),
        status: editingEvent.status,
        completedAt: editingEvent.completedAt,
      }),
      () => setEditingEvent(null),
    );
  };

  const saveOffer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    run(
      upsertDetailOfferAction(app.id, {
        applicationId: app.id,
        salary: data.get("salary"),
        currency: data.get("currency"),
        benefits: data.get("benefits"),
        startDate: data.get("startDate"),
        offerDeadline: data.get("offerDeadline")
          ? zonedLocalToUtc(String(data.get("offerDeadline")), preferences.timezone)
          : null,
        notes: data.get("notes"),
      }),
      () => setOfferEdit(false),
    );
  };

  const recordFollowUp = () =>
    run(
      createDetailEventAction(app.id, {
        applicationId: app.id,
        category: "follow_up",
        subtype: null,
        title: "Tindak lanjut dikirim",
        scheduledAt: null,
        deadlineAt: null,
        location: null,
        url: null,
        notes: null,
        status: "completed",
        completedAt: new Date().toISOString(),
      }),
    );

  return (
    <div className="application-detail-page">
      <Link className="text-link" href="/aplikasi">
        <ArrowLeft /> Kembali ke lamaran
      </Link>

      <header className="detail-hero">
        <div>
          <span className="detail-stage">{detail.stage.name}</span>
          <h1>{app.company}</h1>
          <p>{app.position}</p>
        </div>
        <div className="detail-actions">
          <button className="filter-button" onClick={() => setEdit(true)}>
            <Pencil /> Edit
          </button>
          <button
            className="filter-button"
            onClick={() => run(archiveDetailAction(app.id, !app.archived_at))}
          >
            <Archive /> {app.archived_at ? "Pulihkan" : "Arsipkan"}
          </button>
          {app.closed_at ? (
            <button
              className="button"
              onClick={() => run(reopenDetailAction(app.id, activeStages[0].id))}
            >
              <RotateCcw /> Buka kembali
            </button>
          ) : (
            <button className="button" onClick={() => setCloseOpen(true)}>
              Tutup lamaran
            </button>
          )}
          <button className="danger-button" onClick={() => setDeleteOpen(true)}>
            <Trash2 /> Hapus
          </button>
        </div>
      </header>

      {message && <p className="form-error">{message}</p>}

      <div className="detail-layout">
        <main className="detail-main">
          <section className="detail-section">
            <header><h2>Informasi lowongan</h2></header>
            <div className="detail-facts">
              <Fact label="Lokasi" value={app.location} />
              <Fact label="Sistem kerja" value={app.work_arrangement} />
              <Fact label="Jenis pekerjaan" value={app.employment_type} />
              <Fact label="Sumber" value={app.source} />
              <Fact label="Tanggal melamar" value={fmt(app.applied_at, preferences.timezone)} />
              <Fact
                label="Gaji"
                value={
                  app.salary_min != null || app.salary_max != null
                    ? `${money(app.salary_min, app.currency ?? preferences.currency)} - ${money(app.salary_max, app.currency ?? preferences.currency)}`
                    : null
                }
              />
            </div>
            {app.job_url && (
              <a className="text-link" href={app.job_url} target="_blank" rel="noreferrer">
                Buka lowongan <ExternalLink />
              </a>
            )}
            {app.job_description && (
              <div className="detail-description">
                <h3>Deskripsi</h3>
                <p>{app.job_description}</p>
              </div>
            )}
          </section>

          <section className="detail-section">
            <header>
              <h2>Catatan</h2>
              <button onClick={() => setNotesEdit(true)} aria-label="Edit catatan"><Pencil /></button>
            </header>
            <p className="notes-copy">{app.notes || "Belum ada catatan."}</p>
          </section>

          <section className="detail-section">
            <header><h2>Agenda rekrutmen</h2></header>
            <div className="event-list">
              {detail.events.length ? (
                detail.events.map((event) => (
                  <article className={`detail-event ${event.status}`} key={event.id}>
                    <div>
                      <span>{eventLabels[event.category] ?? "Aktivitas"} · {statusLabels[event.status] ?? event.status}</span>
                      <h3>{event.title}</h3>
                      <p>
                        {fmt(event.completedAt ?? event.scheduledAt ?? event.deadlineAt, preferences.timezone)}
                        {event.location ? ` · ${event.location}` : ""}
                      </p>
                    </div>
                    <div>
                      <button onClick={() => setEditingEvent(event)} aria-label={`Edit ${event.title}`}><Pencil /></button>
                      <button
                        onClick={() =>
                          run(completeDetailEventAction(app.id, event.id, event.status !== "completed"))
                        }
                      >
                        {event.status === "completed" ? "Batalkan selesai" : "Tandai selesai"}
                      </button>
                      <button
                        className="delete-menu-item"
                        onClick={() => run(deleteDetailEventAction(app.id, event.id))}
                        aria-label={`Hapus ${event.title}`}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="empty-column">Belum ada agenda.</p>
              )}
            </div>
          </section>

          <section className="detail-section">
            <header><h2>Timeline</h2></header>
            <ol className="timeline-list">
              {detail.timeline.map((item) => (
                <li className={`timeline-${item.kind}`} key={`${item.kind}-${item.id}`}>
                  <span />
                  <div>
                    <time>{fmt(item.occurredAt, preferences.timezone)}</time>
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </main>

        <aside className="detail-sidebar">
          <section className="detail-section">
            <header><h2>Ringkasan</h2></header>
            <div className="summary-list">
              <p><CalendarDays /> Dilamar: {fmt(app.applied_at, preferences.timezone)}</p>
              <p><Clock3 /> Aktivitas terakhir: {fmt(latestActivity, preferences.timezone)}</p>
              <p><Clock3 /> Menunggu: {waiting.waitingDays} hari</p>
              <p><BriefcaseBusiness /> Tahap: {detail.stage.name}</p>
              {upcomingEvents[0] && <p><CalendarDays /> Berikutnya: {upcomingEvents[0].title}</p>}
            </div>
            {!app.closed_at && (
              <button className="filter-button detail-follow-up" onClick={recordFollowUp} disabled={pending}>
                <Send /> Catat tindak lanjut
              </button>
            )}
          </section>

          <section className="detail-section offer-section">
            <header>
              <h2>Tawaran</h2>
              <button onClick={() => setOfferEdit(true)} aria-label="Edit tawaran"><Pencil /></button>
            </header>
            {detail.offer ? (
              <>
                <strong>{money(detail.offer.salary, detail.offer.currency ?? preferences.currency)}</strong>
                <p>Mulai: {fmt(detail.offer.start_date, preferences.timezone)}</p>
                <p>Tenggat: {fmt(detail.offer.offer_deadline, preferences.timezone)}</p>
                {detail.offer.benefits && <p>{detail.offer.benefits}</p>}
                <button className="delete-menu-item" onClick={() => run(deleteDetailOfferAction(app.id))}>
                  Hapus tawaran
                </button>
              </>
            ) : (
              <p>Belum ada detail tawaran.</p>
            )}
          </section>
        </aside>
      </div>

      {edit && (
        <Modal title="Edit lamaran" onClose={() => setEdit(false)}>
          <form onSubmit={saveInfo} className="detail-form">
            <Field name="company" label="Perusahaan" defaultValue={app.company} required />
            <Field name="position" label="Posisi" defaultValue={app.position} required />
            <Field name="jobUrl" label="URL Lowongan" defaultValue={app.job_url ?? ""} type="url" />
            <Field name="location" label="Lokasi" defaultValue={app.location ?? ""} />
            <SelectField name="workArrangement" label="Sistem kerja" defaultValue={app.work_arrangement ?? ""} options={[["", "Belum diisi"], ["onsite", "Di lokasi"], ["hybrid", "Hibrida"], ["remote", "Jarak jauh"]]} />
            <SelectField name="employmentType" label="Jenis pekerjaan" defaultValue={app.employment_type ?? ""} options={[["", "Belum diisi"], ["full_time", "Penuh waktu"], ["part_time", "Paruh waktu"], ["contract", "Kontrak"], ["internship", "Magang"], ["freelance", "Freelance"], ["other", "Lainnya"]]} />
            <Field name="source" label="Sumber" defaultValue={app.source ?? ""} />
            <Field name="appliedAt" label="Tanggal melamar" defaultValue={app.applied_at ?? ""} type="date" />
            <Field name="salaryMin" label="Gaji minimum" defaultValue={app.salary_min?.toString() ?? ""} type="number" />
            <Field name="salaryMax" label="Gaji maksimum" defaultValue={app.salary_max?.toString() ?? ""} type="number" />
            <Field name="currency" label="Mata uang" defaultValue={app.currency ?? preferences.currency} />
            <label className="field-group detail-form-wide"><span>Deskripsi pekerjaan</span><span className="field-control textarea-control"><textarea name="jobDescription" defaultValue={app.job_description ?? ""} /></span></label>
            <FormActions pending={pending} cancel={() => setEdit(false)} />
          </form>
        </Modal>
      )}

      {notesEdit && (
        <Modal title="Edit catatan" onClose={() => setNotesEdit(false)}>
          <form onSubmit={saveNotes}>
            <label className="field-group"><span>Catatan</span><span className="field-control textarea-control"><textarea name="notes" defaultValue={app.notes ?? ""} /></span></label>
            <FormActions pending={pending} cancel={() => setNotesEdit(false)} />
          </form>
        </Modal>
      )}

      {editingEvent && (
        <Modal title="Edit agenda" onClose={() => setEditingEvent(null)}>
          <form onSubmit={saveEvent} className="detail-form">
            <Field name="title" label="Judul" defaultValue={editingEvent.title} required />
            <Field name="scheduledAt" label="Waktu terjadwal" defaultValue={editingEvent.scheduledAt ? utcToZonedLocal(editingEvent.scheduledAt, preferences.timezone) : ""} type="datetime-local" />
            <Field name="deadlineAt" label="Tenggat" defaultValue={editingEvent.deadlineAt ? utcToZonedLocal(editingEvent.deadlineAt, preferences.timezone) : ""} type="datetime-local" />
            <Field name="location" label="Lokasi" defaultValue={editingEvent.location ?? ""} />
            <Field name="url" label="URL" defaultValue={editingEvent.url ?? ""} type="url" />
            <label className="field-group detail-form-wide"><span>Catatan</span><span className="field-control textarea-control"><textarea name="notes" defaultValue={editingEvent.notes ?? ""} /></span></label>
            <FormActions pending={pending} cancel={() => setEditingEvent(null)} />
          </form>
        </Modal>
      )}

      {offerEdit && (
        <Modal title="Detail tawaran" onClose={() => setOfferEdit(false)}>
          <form onSubmit={saveOffer} className="detail-form">
            <Field name="salary" label="Gaji" defaultValue={detail.offer?.salary?.toString() ?? ""} type="number" />
            <Field name="currency" label="Mata uang" defaultValue={detail.offer?.currency ?? preferences.currency} />
            <Field name="benefits" label="Benefit" defaultValue={detail.offer?.benefits ?? ""} />
            <Field name="startDate" label="Tanggal mulai" defaultValue={detail.offer?.start_date ?? ""} type="date" />
            <Field name="offerDeadline" label="Tenggat tawaran" defaultValue={detail.offer?.offer_deadline ? utcToZonedLocal(detail.offer.offer_deadline, preferences.timezone) : ""} type="datetime-local" />
            <label className="field-group detail-form-wide"><span>Catatan</span><span className="field-control textarea-control"><textarea name="notes" defaultValue={detail.offer?.notes ?? ""} /></span></label>
            <FormActions pending={pending} cancel={() => setOfferEdit(false)} />
          </form>
        </Modal>
      )}

      {closeOpen && (
        <Modal title="Tutup lamaran" onClose={() => setCloseOpen(false)}>
          <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const outcome = String(data.get("outcome")); const stage = closedStages.find((item) => item.systemKey === outcome); if (stage) run(closeDetailAction(app.id, { applicationId: app.id, outcomeStageId: stage.id, outcome, reasonCode: data.get("reasonCode") || null, notes: data.get("notes") || null }), () => setCloseOpen(false)); }}>
            <SelectField name="outcome" label="Hasil akhir" defaultValue="rejected" options={closedStages.map((stage) => [stage.systemKey ?? "", stage.name])} />
            <Field name="reasonCode" label="Alasan singkat" />
            <label className="field-group"><span>Catatan</span><span className="field-control textarea-control"><textarea name="notes" /></span></label>
            <p>Tanpa Kabar hanya dipilih oleh kamu dan dapat dibuka kembali nanti.</p>
            <FormActions pending={pending} cancel={() => setCloseOpen(false)} />
          </form>
        </Modal>
      )}

      {deleteOpen && (
        <Modal title="Hapus lamaran ini?" onClose={() => setDeleteOpen(false)}>
          <p>Tindakan ini tidak dapat dibatalkan. Lamaran <strong>{app.company}</strong> dan seluruh riwayatnya akan dihapus.</p>
          <div className="dialog-actions">
            <button className="filter-button" type="button" onClick={() => setDeleteOpen(false)}>Batal</button>
            <button className="danger-button" type="button" disabled={pending} onClick={() => startTransition(async () => { const response = await deleteDetailAction(app.id); if (!response.success) setMessage(response.error.message); })}>
              <Trash2 /> {pending ? "Menghapus..." : "Hapus permanen"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string | null }) { return <div><span>{label}</span><strong>{value || "Belum diisi"}</strong></div>; }
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { const ref = useDialogA11y<HTMLElement>(true, onClose); return <div className="dialog-backdrop" onMouseDown={onClose}><section ref={ref} className="application-dialog" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><header><h2>{title}</h2><button onClick={onClose} aria-label="Tutup dialog"><X /></button></header>{children}</section></div>; }
function Field({ name, label, defaultValue = "", type = "text", required = false }: { name: string; label: string; defaultValue?: string; type?: string; required?: boolean }) {
  if (type === "date" || type === "datetime-local") {
    return <div className="field-group"><span>{label}</span>{type === "date" ? <ThemedDateOnlyPicker name={name} defaultValue={defaultValue} placeholder={`Pilih ${label.toLowerCase()}`} /> : <ThemedDatePicker name={name} defaultValue={defaultValue} placeholder={`Pilih ${label.toLowerCase()}`} />}</div>;
  }
  return <label className="field-group"><span>{label}</span><span className="field-control"><input name={name} type={type} defaultValue={defaultValue} required={required} min={type === "number" ? 0 : undefined} /></span></label>;
}
function SelectField({ name, label, defaultValue, options }: { name: string; label: string; defaultValue: string; options: string[][] }) { return <label className="field-group"><span>{label}</span><span className="field-control"><select name={name} defaultValue={defaultValue}>{options.map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select></span></label>; }
function FormActions({ pending, cancel }: { pending: boolean; cancel: () => void }) { return <div className="dialog-actions detail-form-wide"><button className="filter-button" type="button" onClick={cancel}>Batal</button><button className="button" type="submit" disabled={pending}><Save /> {pending ? "Menyimpan..." : "Simpan"}</button></div>; }
