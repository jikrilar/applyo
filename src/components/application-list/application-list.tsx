"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import type { ApplicationListItemDTO, StageDTO } from "@/backend/dto";
import type { ApplicationRow } from "@/types/database";
import {
  ApplicationToolbar,
  type ApplicationFilterSelection,
} from "@/components/application-toolbar";
import { ApplicationForm } from "@/components/application-detail/application-form";
import {
  deleteApplicationAction,
  getApplicationForEditAction,
} from "@/app/(workspace)/aplikasi/actions";

const format = (value: string | null) =>
  value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value)) : "-";
type SearchParam = string | string[];
type ApplicationListParams = Record<string, SearchParam | undefined>;

const values = (value: SearchParam | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

function ApplicationListToolbar({
  query,
  stages,
  locations,
  stageFilter,
  locationFilter,
  onQueryChange,
  onFiltersChange,
  onAdd,
}: {
  query: string;
  stages: StageDTO[];
  locations: string[];
  stageFilter: string[];
  locationFilter: string[];
  onQueryChange: (query: string) => void;
  onFiltersChange: (selection: ApplicationFilterSelection) => void;
  onAdd: () => void;
}) {
  const [localQuery, setLocalQuery] = useState(query);
  return (
    <ApplicationToolbar
      query={localQuery}
      stages={stages}
      locations={locations}
      stageFilter={stageFilter}
      locationFilter={locationFilter}
      onQueryChange={(value) => {
        setLocalQuery(value);
        onQueryChange(value);
      }}
      onFiltersChange={onFiltersChange}
      onAdd={onAdd}
    />
  );
}

export function ApplicationList({
  items,
  total,
  stages,
  currency,
  locations,
  params,
  pageSize,
}: {
  items: ApplicationListItemDTO[];
  total: number;
  stages: StageDTO[];
  currency: string;
  locations: string[];
  params: ApplicationListParams;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serverQuery = values(params.query)[0] ?? "";
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ApplicationRow | null>(null);
  const [deleting, setDeleting] = useState<ApplicationListItemDTO | null>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const sort = values(params.sort)[0] ?? "applied_desc";
  const appliedActive = sort.startsWith("applied_");
  const appliedAscending = sort === "applied_asc";
  const upcomingActive = sort.startsWith("upcoming_");
  const upcomingAscending = sort === "upcoming_asc";
  const page = Math.floor((Number(params.offset) || 0) / pageSize) + 1;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const stageFilter = values(params.stageId);
  const locationFilter = values(params.location);
  const navigate = (update: (query: URLSearchParams) => void) => {
    const query = new URLSearchParams(searchParams.toString());
    update(query);
    query.set("view", "list");
    query.delete("offset");
    router.replace(`${pathname}?${query.toString()}`);
  };
  const updateQuery = (query: string) =>
    navigate((next) => {
      if (query) next.set("query", query);
      else next.delete("query");
    });
  const updateFilters = ({ stageIds, locations: selectedLocations }: ApplicationFilterSelection) =>
    navigate((next) => {
      next.delete("stageId");
      next.delete("location");
      stageIds.forEach((stageId) => next.append("stageId", stageId));
      selectedLocations.forEach((location) => next.append("location", location));
    });
  const updateSort = (sort: string) =>
    navigate((next) => {
      next.set("sort", sort);
    });
  const href = (nextPage: number) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) =>
      values(value).forEach((item) => query.append(key, item)),
    );
    query.set("view", "list");
    query.set("offset", String((nextPage - 1) * pageSize));
    return `/aplikasi?${query.toString()}`;
  };
  const edit = (applicationId: string) =>
    startTransition(async () => {
      const result = await getApplicationForEditAction(applicationId);
      if (result.success) {
        setEditing(result.data);
        setMessage("");
      } else setMessage(result.error.message);
    });
  const remove = () => {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteApplicationAction({ applicationId: deleting.id });
      if (result.success) {
        setDeleting(null);
        setMessage("");
        router.refresh();
      } else setMessage(result.error.message);
    });
  };
  return (
    <div className="application-list-view">
      <ApplicationListToolbar
        key={serverQuery}
        query={serverQuery}
        stages={stages}
        locations={locations}
        stageFilter={stageFilter}
        locationFilter={locationFilter}
        onQueryChange={updateQuery}
        onFiltersChange={updateFilters}
        onAdd={() => setDialogOpen(true)}
      />
      {message && (
        <p className="form-error application-list-error" role="alert">
          {message}
        </p>
      )}
      {items.length ? (
        <>
          <div className="list-result-note">
            <strong>{total} lamaran</strong>
            <span>
              Menampilkan halaman {page} dari {pages}
            </span>
          </div>
          <div className="application-table-wrap">
            <table className="application-table">
              <caption className="sr-only">Daftar lamaran</caption>
              <thead>
                <tr>
                  <th>Perusahaan / posisi</th>
                  <th>Tahap</th>
                  <th>Sumber</th>
                  <th
                    aria-sort={
                      appliedActive ? (appliedAscending ? "ascending" : "descending") : "none"
                    }
                  >
                    <span className="table-heading-sort">
                      Dilamar
                      <button
                        className={appliedActive ? "active" : ""}
                        type="button"
                        aria-label={
                          appliedAscending
                            ? "Urutkan dari terbaru dilamar"
                            : "Urutkan dari terlama dilamar"
                        }
                        aria-pressed={appliedActive}
                        onClick={() =>
                          updateSort(
                            appliedActive && !appliedAscending ? "applied_asc" : "applied_desc",
                          )
                        }
                      >
                        {appliedActive && appliedAscending ? <ArrowUp /> : <ArrowDown />}
                      </button>
                    </span>
                  </th>
                  <th
                    aria-sort={
                      upcomingActive ? (upcomingAscending ? "ascending" : "descending") : "none"
                    }
                  >
                    <span className="table-heading-sort">
                      Agenda berikutnya
                      <button
                        className={upcomingActive ? "active" : ""}
                        type="button"
                        aria-label={
                          upcomingAscending
                            ? "Urutkan agenda dari terjauh"
                            : "Urutkan agenda dari terdekat"
                        }
                        aria-pressed={upcomingActive}
                        onClick={() =>
                          updateSort(
                            upcomingActive && upcomingAscending ? "upcoming_desc" : "upcoming_asc",
                          )
                        }
                      >
                        {!upcomingActive || upcomingAscending ? <ArrowUp /> : <ArrowDown />}
                      </button>
                    </span>
                  </th>
                  <th>Aktivitas terakhir</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link href={`/aplikasi/${item.id}`}>
                        <strong>{item.company}</strong>
                        <span>{item.position}</span>
                        <small>
                          <MapPin aria-hidden="true" /> {item.location ?? "Lokasi belum diisi"}
                        </small>
                      </Link>
                    </td>
                    <td>
                      <span className="list-stage">{item.stage.name}</span>
                    </td>
                    <td>{item.source ?? "-"}</td>
                    <td>{format(item.appliedAt)}</td>
                    <td>{format(item.upcomingEventAt)}</td>
                    <td>{format(item.lastActivityAt)}</td>
                    <td>
                      <div className="application-list-actions">
                        <button
                          type="button"
                          aria-label={`Edit ${item.company}`}
                          disabled={pending}
                          onClick={() => edit(item.id)}
                        >
                          <Pencil />
                        </button>
                        <button
                          className="delete-action"
                          type="button"
                          aria-label={`Hapus ${item.company}`}
                          disabled={pending}
                          onClick={() => setDeleting(item)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="application-mobile-list">
            {items.map((item) => (
              <article className="application-list-card" key={item.id}>
                <div>
                  <span className="list-stage">{item.stage.name}</span>
                  <Link className="application-list-card-title" href={`/aplikasi/${item.id}`}>
                    <strong>{item.company}</strong>
                    <p>{item.position}</p>
                  </Link>
                </div>
                <small>
                  <MapPin aria-hidden="true" /> {item.location ?? "Lokasi belum diisi"}
                </small>
                <small>Sumber: {item.source ?? "Belum dicatat"}</small>
                <small>
                  <CalendarDays aria-hidden="true" />{" "}
                  {item.upcomingEventAt
                    ? `Berikutnya ${format(item.upcomingEventAt)}`
                    : `Aktivitas ${format(item.lastActivityAt)}`}
                </small>
                <div className="application-list-card-footer">
                  <Link className="list-card-cta" href={`/aplikasi/${item.id}`}>
                    Lihat detail <ChevronRight aria-hidden="true" />
                  </Link>
                  <div className="application-list-actions">
                    <button
                      type="button"
                      aria-label={`Edit ${item.company}`}
                      disabled={pending}
                      onClick={() => edit(item.id)}
                    >
                      <Pencil />
                    </button>
                    <button
                      className="delete-action"
                      type="button"
                      aria-label={`Hapus ${item.company}`}
                      disabled={pending}
                      onClick={() => setDeleting(item)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="application-list-empty">
          <Search />
          <strong>Tidak ada lamaran yang cocok.</strong>
          <p>Ubah pencarian atau filter yang aktif untuk melihat hasil lain.</p>
        </div>
      )}
      <nav className="list-pagination" aria-label="Paginasi">
        <Link
          className={page <= 1 ? "disabled" : ""}
          aria-disabled={page <= 1}
          href={href(Math.max(1, page - 1))}
        >
          <ChevronLeft /> Sebelumnya
        </Link>
        <span>
          Halaman {page} dari {pages} · {total} lamaran
        </span>
        <Link
          className={page >= pages ? "disabled" : ""}
          aria-disabled={page >= pages}
          href={href(Math.min(pages, page + 1))}
        >
          Berikutnya <ChevronRight />
        </Link>
      </nav>
      {dialogOpen && (
        <div className="dialog-backdrop">
          <section
            className="application-dialog application-form-dialog"
            role="dialog"
            aria-modal="true"
          >
            <header>
              <div>
                <h2>Tambah lamaran</h2>
                <p>Mulai dari informasi utama, lalu lengkapi seperlunya.</p>
              </div>
            </header>
            <ApplicationForm
              stages={stages}
              currency={currency}
              onCancel={() => setDialogOpen(false)}
              onSaved={() => setDialogOpen(false)}
            />
          </section>
        </div>
      )}
      {editing && (
        <div className="dialog-backdrop">
          <section
            className="application-dialog application-form-dialog"
            role="dialog"
            aria-modal="true"
          >
            <header>
              <div>
                <h2>Edit lamaran</h2>
                <p>
                  {editing.company} · {editing.position}
                </p>
              </div>
            </header>
            <ApplicationForm
              application={editing}
              stages={stages}
              currency={currency}
              onCancel={() => setEditing(null)}
              onSaved={() => setEditing(null)}
            />
          </section>
        </div>
      )}
      {deleting && (
        <div className="dialog-backdrop" onMouseDown={() => setDeleting(null)}>
          <section
            className="delete-dialog"
            role="alertdialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="delete-dialog-icon">
              <Trash2 />
            </span>
            <h2>Hapus lamaran ini?</h2>
            <p>
              Lamaran <strong>{deleting.company}</strong> akan dihapus permanen.
            </p>
            <div className="dialog-actions">
              <button
                className="filter-button"
                type="button"
                disabled={pending}
                onClick={() => setDeleting(null)}
              >
                Batal
              </button>
              <button className="danger-button" type="button" disabled={pending} onClick={remove}>
                <Trash2 /> {pending ? "Menghapus..." : "Hapus lamaran"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
