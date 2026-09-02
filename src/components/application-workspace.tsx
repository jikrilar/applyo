"use client";

import { FormEvent, KeyboardEvent, useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CalendarDays,
  Check,
  ChevronDown,
  EllipsisVertical,
  GripVertical,
  MapPin,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import type { ApplicationCardDTO, BoardDTO, StageDTO } from "@/backend/dto";
import {
  createApplicationAction,
  deleteApplicationAction,
  moveApplicationAction,
  updateApplicationAction,
  upsertOfferAction,
} from "@/app/(workspace)/aplikasi/actions";
import { createEventAction } from "@/app/(workspace)/aplikasi/event-actions";
import { zonedLocalToUtc } from "@/lib/dates";
import { ApplicationForm } from "@/components/application-detail/application-form";
import { ApplicationToolbar } from "@/components/application-toolbar";
import { cn } from "@/components/shared/cn";
import { ThemedDateOnlyPicker, ThemedDatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const stageColor: Record<string, string> = {
  wishlist: "var(--purple)",
  applied: "var(--blue)",
  screening: "var(--yellow)",
  interview: "var(--pink)",
  assessment: "var(--orange)",
  offer: "var(--green)",
};
const color = (stage: StageDTO) => stageColor[stage.systemKey ?? ""] ?? "var(--yellow)";

function cardNote(card: ApplicationCardDTO) {
  if (card.upcomingEventAt)
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
      new Date(card.upcomingEventAt),
    );
  if (card.waitingDays > 0) return `Menunggu ${card.waitingDays} hari`;
  return "Baru diperbarui";
}

function SortableCard({
  application,
  hiddenDuringDrag = false,
  onDelete,
  onEvent,
}: {
  application: ApplicationCardDTO;
  hiddenDuringDrag?: boolean;
  onDelete: (card: ApplicationCardDTO) => void;
  onEvent: (card: ApplicationCardDTO) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("workspace-card", isDragging && "dragging", hiddenDuringDrag && "drag-source")}
      aria-hidden={hiddenDuringDrag ? true : undefined}
    >
      <div className="workspace-card-title">
        <strong>{application.company}</strong>
        <div className="card-controls">
          <button
            className="drag-handle"
            type="button"
            aria-label={`Pindahkan kartu ${application.company}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical />
          </button>
          <div
            className="card-action-menu"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
            }}
          >
            <button
              className="card-menu-trigger"
              type="button"
              aria-label={`Tindakan untuk ${application.company}`}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <EllipsisVertical />
            </button>
            {menuOpen && (
              <div className="card-menu-popover" role="menu">
                <Link role="menuitem" href={`/aplikasi/${application.id}`}>
                  <Pencil /> Edit lamaran
                </Link>
                <button type="button" role="menuitem" onClick={() => onEvent(application)}>
                  <CalendarDays /> Tambah agenda
                </button>
                <button
                  className="delete-menu-item"
                  type="button"
                  role="menuitem"
                  onClick={() => onDelete(application)}
                >
                  <Trash2 /> Hapus lamaran
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Link className="workspace-card-link" href={`/aplikasi/${application.id}`}>
        {application.position}
      </Link>
      <span>
        <MapPin /> {application.location ?? "Lokasi belum diisi"}
      </span>
      <span>
        <CalendarDays /> {cardNote(application)}
      </span>
    </article>
  );
}

function Column({
  stage,
  applications,
  activeId,
  visible,
  onLoadMore,
  onDelete,
  onEvent,
}: {
  stage: StageDTO;
  applications: ApplicationCardDTO[];
  activeId: string | null;
  visible: number;
  onLoadMore: () => void;
  onDelete: (card: ApplicationCardDTO) => void;
  onEvent: (card: ApplicationCardDTO) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const activeApplication = applications.find((card) => card.id === activeId);
  const availableApplications = applications.filter((card) => card.id !== activeId);
  const shown = availableApplications.slice(0, visible);
  const remaining = availableApplications.length - shown.length;
  const sortableCards = [...shown];
  if (activeApplication) {
    const originalIndex = applications.findIndex((card) => card.id === activeApplication.id);
    sortableCards.splice(Math.min(originalIndex, sortableCards.length), 0, activeApplication);
  }
  return (
    <section
      ref={setNodeRef}
      className={cn("workspace-column", isOver && "drop-target")}
      id={stage.id}
    >
      <header style={{ background: color(stage) }}>
        <strong>{stage.name}</strong>
        <span>{availableApplications.length}</span>
      </header>
      <SortableContext
        items={sortableCards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="workspace-card-list">
          {sortableCards.map((card) => (
            <SortableCard
              application={card}
              hiddenDuringDrag={card.id === activeId}
              onDelete={onDelete}
              onEvent={onEvent}
              key={card.id}
            />
          ))}
          {!availableApplications.length && (
            <p className="empty-column">Letakkan lamaran di sini</p>
          )}
          {remaining > 0 && (
            <button className="load-more-button" type="button" onClick={onLoadMore}>
              Muat lebih banyak
              <span>
                {Math.min(3, remaining)} dari {remaining} tersisa
              </span>
            </button>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

const eventCategories = [
  { id: "interview", label: "Wawancara", color: "var(--pink)" },
  { id: "assessment", label: "Asesmen", color: "var(--orange)" },
  { id: "follow_up", label: "Tindak lanjut", color: "var(--blue)" },
  { id: "other", label: "Lainnya", color: "var(--yellow)" },
] as const;
type EventCategory = (typeof eventCategories)[number]["id"];
const eventSubtypes = {
  interview: [
    ["hr", "Wawancara HR"],
    ["user", "Wawancara user"],
    ["technical", "Wawancara teknis"],
    ["final", "Wawancara akhir"],
    ["other", "Wawancara lainnya"],
  ],
  assessment: [
    ["technical_test", "Tes teknis"],
    ["coding_test", "Tes coding"],
    ["psychological_test", "Tes psikologi"],
    ["case_study", "Studi kasus"],
    ["take_home", "Tugas rumah"],
    ["medical_checkup", "Pemeriksaan kesehatan"],
    ["other", "Asesmen lainnya"],
  ],
} as const;

function EventCategoryDropdown({
  value,
  onChange,
}: {
  value: EventCategory;
  onChange: (value: EventCategory) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = eventCategories.find((category) => category.id === value) ?? eventCategories[0];
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = eventCategories.findIndex((category) => category.id === value);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const offset = event.key === "ArrowDown" ? 1 : -1;
      onChange(
        eventCategories[(index + offset + eventCategories.length) % eventCategories.length].id,
      );
      setOpen(true);
    }
    if (event.key === "Escape") setOpen(false);
  };

  return (
    <div
      className="stage-dropdown"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <input type="hidden" name="category" value={value} />
      <button
        className="stage-dropdown-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={keyDown}
      >
        <span className="stage-swatch" style={{ background: selected.color }} />
        <span>{selected.label}</span>
        <ChevronDown />
      </button>
      {open && (
        <div className="stage-dropdown-menu" role="listbox" aria-label="Pilih jenis agenda">
          {eventCategories.map((category) => (
            <button
              className={category.id === value ? "selected" : ""}
              type="button"
              role="option"
              aria-selected={category.id === value}
              onClick={() => {
                onChange(category.id);
                setOpen(false);
              }}
              key={category.id}
            >
              <span className="stage-swatch" style={{ background: category.color }} />
              {category.label}
              {category.id === value && <Check />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ApplicationWorkspace({
  initialBoard,
  timezone,
  currency,
  stages,
}: {
  initialBoard: BoardDTO;
  timezone: string;
  currency: string;
  stages: StageDTO[];
}) {
  const [board, setBoard] = useState(initialBoard);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<ApplicationCardDTO | null>(null);
  const [eventApplication, setEventApplication] = useState<ApplicationCardDTO | null>(null);
  const [contextualEvent, setContextualEvent] = useState(false);
  const [contextual, setContextual] = useState<{
    card: ApplicationCardDTO;
    type: "applied" | "offer";
  } | null>(null);
  const [eventCategory, setEventCategory] = useState<EventCategory>("interview");
  const [eventDateTime, setEventDateTime] = useState("");
  const [visibleByStage, setVisibleByStage] = useState<Record<string, number>>({});
  const [stageFilter, setStageFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const cards = board.stages.flatMap((stage) => board.cardsByStage[stage.id] ?? []);
  const activeCard = activeId ? cards.find((card) => card.id === activeId) : null;
  const locations = [
    ...new Set(cards.map((card) => card.location).filter(Boolean) as string[]),
  ].sort();
  const activeFilters = stageFilter.length + locationFilter.length;
  const filtered = (stage: StageDTO) =>
    (board.cardsByStage[stage.id] ?? []).filter(
      (card) =>
        `${card.company} ${card.position}`.toLowerCase().includes(query.toLowerCase()) &&
        (!stageFilter.length || stageFilter.includes(card.stageId)) &&
        (!locationFilter.length || locationFilter.includes(card.location ?? "")),
    );
  const filteredCount = board.stages.reduce((total, stage) => total + filtered(stage).length, 0);
  const run = (
    action: () => Promise<Awaited<ReturnType<typeof createApplicationAction>>>,
    onSuccess?: () => void,
  ) =>
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        setBoard(result.data);
        setMessage("");
        onSuccess?.();
      } else {
        if (result.board) setBoard(result.board);
        setMessage(result.error.message);
      }
    });
  const afterMove = (applicationId: string, destinationStageId: string) => {
    const card = cards.find((item) => item.id === applicationId);
    const stage = stages.find((item) => item.id === destinationStageId);
    if (!card || !stage || card.stageId === destinationStageId) return;
    requestAnimationFrame(() => {
      if (stage.systemKey === "applied") setContextual({ card, type: "applied" });
      if (stage.systemKey === "interview" || stage.systemKey === "assessment") {
        setEventCategory(stage.systemKey);
        setContextualEvent(true);
        setEventApplication(card);
      }
      if (stage.systemKey === "offer") setContextual({ card, type: "offer" });
    });
  };
  const dragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (pending || !over || active.id === over.id || query || activeFilters) return;
    const sourceStage = board.stages.find((stage) =>
      (board.cardsByStage[stage.id] ?? []).some((card) => card.id === active.id),
    );
    const overCard = cards.find((card) => card.id === over.id);
    const destinationStageId = board.stages.some((stage) => stage.id === over.id)
      ? String(over.id)
      : overCard?.stageId;
    if (!sourceStage || !destinationStageId) return;
    const moved = (board.cardsByStage[sourceStage.id] ?? []).find((card) => card.id === active.id)!;
    const destination = (board.cardsByStage[destinationStageId] ?? []).filter(
      (card) => card.id !== active.id,
    );
    const overIndex = overCard ? destination.findIndex((card) => card.id === overCard.id) : -1;
    const droppedBelow = Boolean(
      overCard &&
      active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height / 2,
    );
    const visibleLimit = visibleByStage[destinationStageId] ?? 3;
    const targetIndex =
      overIndex >= 0
        ? overIndex + (droppedBelow ? 1 : 0)
        : Math.min(visibleLimit, destination.length);
    destination.splice(targetIndex, 0, {
      ...moved,
      stageId: destinationStageId,
      stage: board.stages.find((stage) => stage.id === destinationStageId)!,
    });
    setVisibleByStage((current) => ({
      ...current,
      [destinationStageId]: Math.max(current[destinationStageId] ?? 3, targetIndex + 1),
    }));
    const next = {
      ...board,
      cardsByStage: {
        ...board.cardsByStage,
        [sourceStage.id]: (board.cardsByStage[sourceStage.id] ?? []).filter(
          (card) => card.id !== active.id,
        ),
        [destinationStageId]: destination,
      },
    };
    setBoard(next);
    const index = destination.findIndex((card) => card.id === active.id);
    run(
      () =>
        moveApplicationAction({
          applicationId: String(active.id),
          destinationStageId,
          beforeApplicationId: destination[index - 1]?.id ?? null,
          afterApplicationId: destination[index + 1]?.id ?? null,
        }),
      () => afterMove(String(active.id), destinationStageId),
    );
  };
  const openCreate = () => setDialogOpen(true);
  const closeEventDialog = () => {
    setEventApplication(null);
    setEventDateTime("");
    setContextualEvent(false);
    setMessage("");
  };
  const saveEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!eventApplication) return;
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      const category = String(data.get("category")) as EventCategory;
      const isAssessment = category === "assessment";
      const locationOrUrl = String(data.get("locationOrUrl") ?? "").trim();
      const localTime = String(data.get("eventDateTime") ?? "");
      const isUrl = /^https?:\/\//i.test(locationOrUrl);
      const response = await createEventAction({
        applicationId: eventApplication.id,
        category,
        subtype: data.get("subtype"),
        title: data.get("title"),
        scheduledAt: !isAssessment && localTime ? zonedLocalToUtc(localTime, timezone) : null,
        deadlineAt: isAssessment && localTime ? zonedLocalToUtc(localTime, timezone) : null,
        location: !isAssessment && locationOrUrl && !isUrl ? locationOrUrl : null,
        url: isAssessment || isUrl ? locationOrUrl || null : null,
        notes: data.get("notes"),
        status: "scheduled",
        completedAt: null,
      });
      if (!response.success) setMessage(response.error.message);
      else {
        setBoard(response.data);
        closeEventDialog();
        setMessage("");
      }
    });
  };
  const closeContextualDialog = () => {
    setContextual(null);
    setEventDateTime("");
    setMessage("");
  };
  const saveOffer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contextual || contextual.type !== "offer") return;
    const data = new FormData(event.currentTarget);
    run(
      () =>
        upsertOfferAction({
          applicationId: contextual.card.id,
          salary: data.get("salary"),
          currency: data.get("currency"),
          benefits: data.get("benefits"),
          startDate: data.get("startDate"),
          offerDeadline: data.get("offerDeadline")
            ? zonedLocalToUtc(String(data.get("offerDeadline")), timezone)
            : null,
          notes: data.get("notes"),
        }),
      closeContextualDialog,
    );
  };
  return (
    <>
      <ApplicationToolbar
        query={query}
        stages={board.stages}
        locations={locations}
        stageFilter={stageFilter}
        locationFilter={locationFilter}
        onQueryChange={setQuery}
        onFiltersChange={({ stageIds, locations: selectedLocations }) => {
          setStageFilter(stageIds);
          setLocationFilter(selectedLocations);
        }}
        onAdd={openCreate}
      />
      {message && !eventApplication && !contextual && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}
      {Boolean(query || activeFilters) && (
        <p className="sample-data-note">Drag dinonaktifkan saat pencarian atau filter aktif.</p>
      )}
      {Boolean((query || activeFilters) && filteredCount === 0) ? (
        <div className="calendar-empty">
          <Search />
          <strong>Tidak ada lamaran yang cocok.</strong>
          <p>Ubah pencarian atau hapus filter aktif.</p>
        </div>
      ) : (
        <DndContext
          id="applyo-workspace-board"
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={({ active }: DragStartEvent) => setActiveId(String(active.id))}
          onDragCancel={() => setActiveId(null)}
          onDragEnd={dragEnd}
        >
          <div className="workspace-board">
            {board.stages.map((stage) => (
              <Column
                stage={stage}
                applications={filtered(stage)}
                activeId={activeId}
                visible={visibleByStage[stage.id] ?? 3}
                onLoadMore={() =>
                  setVisibleByStage((current) => ({
                    ...current,
                    [stage.id]: (current[stage.id] ?? 3) + 3,
                  }))
                }
                onDelete={setDeleting}
                onEvent={(card) => {
                  setEventCategory("interview");
                  setContextualEvent(false);
                  setMessage("");
                  setEventApplication(card);
                }}
                key={stage.id}
              />
            ))}
          </div>
          <DragOverlay>
            {activeCard && (
              <div className="workspace-card drag-overlay" aria-hidden="true">
                <div className="workspace-card-title">
                  <strong>{activeCard.company}</strong>
                </div>
                <div className="workspace-card-link">{activeCard.position}</div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
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
              onCancel={() => setDialogOpen(false)}
              onSaved={() => setDialogOpen(false)}
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
              <button className="filter-button" onClick={() => setDeleting(null)}>
                Batal
              </button>
              <button
                className="danger-button"
                disabled={pending}
                onClick={() =>
                  run(
                    () => deleteApplicationAction({ applicationId: deleting.id }),
                    () => setDeleting(null),
                  )
                }
              >
                <Trash2 /> Hapus lamaran
              </button>
            </div>
          </section>
        </div>
      )}
      <Dialog
        open={Boolean(eventApplication)}
        onOpenChange={(open) => {
          if (!open) closeEventDialog();
        }}
      >
        {eventApplication && (
          <DialogContent className="application-dialog contextual-dialog">
            <DialogTitle>
              {contextualEvent
                ? eventCategory === "assessment"
                  ? "Tambahkan detail asesmen?"
                  : "Tambahkan detail wawancara?"
                : "Tambah agenda"}
            </DialogTitle>
            <DialogDescription>
              {eventApplication.company}. Formulir ini dapat dilewati dan dilengkapi nanti.
            </DialogDescription>
            <form onSubmit={saveEvent}>
              {contextualEvent ? (
                <input type="hidden" name="category" value={eventCategory} />
              ) : (
                <div className="field-group">
                  <span>Jenis agenda</span>
                  <EventCategoryDropdown
                    value={eventCategory}
                    onChange={(value) => {
                      setEventCategory(value);
                      setEventDateTime("");
                    }}
                  />
                </div>
              )}
              {(eventCategory === "interview" || eventCategory === "assessment") && (
                <label className="field-group">
                  <span>{eventCategory === "interview" ? "Jenis wawancara" : "Jenis asesmen"}</span>
                  <span className="field-control">
                    <select
                      name="subtype"
                      defaultValue={eventCategory === "interview" ? "hr" : "technical_test"}
                      key={eventCategory}
                    >
                      {eventSubtypes[eventCategory].map(([value, label]) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
              )}
              <label className="field-group">
                <span>Judul</span>
                <span className="field-control">
                  <input
                    name="title"
                    defaultValue={
                      contextualEvent
                        ? eventCategory === "assessment"
                          ? "Asesmen"
                          : "Wawancara"
                        : ""
                    }
                    key={`${eventCategory}-${contextualEvent}`}
                    required
                  />
                </span>
              </label>
              <div className="field-group">
                <span>{eventCategory === "assessment" ? "Tenggat" : "Tanggal dan waktu"}</span>
                <ThemedDatePicker
                  name="eventDateTime"
                  value={eventDateTime}
                  onChange={setEventDateTime}
                  placeholder={
                    eventCategory === "assessment" ? "Pilih tenggat" : "Pilih tanggal dan waktu"
                  }
                />
                <small>Waktu mengikuti zona waktu pada Pengaturan.</small>
              </div>
              <label className="field-group">
                <span>{eventCategory === "assessment" ? "Tautan" : "Lokasi atau tautan"}</span>
                <span className="field-control">
                  <input
                    name="locationOrUrl"
                    type={eventCategory === "assessment" ? "url" : "text"}
                    placeholder={
                      eventCategory === "assessment" ? "https://..." : "Alamat atau https://..."
                    }
                  />
                </span>
              </label>
              <label className="field-group">
                <span>
                  Catatan <small>(opsional)</small>
                </span>
                <span className="field-control field-control-textarea">
                  <textarea name="notes" rows={4} />
                </span>
              </label>
              {message && (
                <p className="form-error" role="alert">
                  {message}
                </p>
              )}
              <div className="dialog-actions">
                <button className="filter-button" type="button" onClick={closeEventDialog}>
                  {contextualEvent ? "Lewati" : "Batal"}
                </button>
                <button className="button" type="submit" disabled={pending || !eventDateTime}>
                  {pending ? "Menyimpan..." : "Simpan agenda"}
                </button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
      <Dialog
        open={Boolean(contextual)}
        onOpenChange={(open) => {
          if (!open) closeContextualDialog();
        }}
      >
        {contextual && (
          <DialogContent className="application-dialog contextual-dialog">
            <DialogTitle>
              {contextual.type === "applied"
                ? "Tambahkan tanggal melamar?"
                : "Lengkapi detail tawaran?"}
            </DialogTitle>
            <DialogDescription>
              {contextual.card.company}. Tahap sudah dipindahkan dan detail ini dapat dilengkapi
              nanti.
            </DialogDescription>
            {contextual.type === "applied" ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const appliedAt = new FormData(event.currentTarget).get("appliedAt");
                  run(
                    () => updateApplicationAction({ applicationId: contextual.card.id, appliedAt }),
                    closeContextualDialog,
                  );
                }}
              >
                <div className="field-group">
                  <span>Tanggal melamar</span>
                  <ThemedDateOnlyPicker
                    name="appliedAt"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                  />
                </div>
                <div className="dialog-actions">
                  <button className="filter-button" type="button" onClick={closeContextualDialog}>
                    Lewati
                  </button>
                  <button className="button" type="submit" disabled={pending}>
                    {pending ? "Menyimpan..." : "Simpan tanggal"}
                  </button>
                </div>
              </form>
            ) : (
              <form className="contextual-offer-form" onSubmit={saveOffer}>
                <div className="contextual-field-grid">
                  <label className="field-group">
                    <span>
                      Gaji <small>(opsional)</small>
                    </span>
                    <span className="field-control">
                      <input name="salary" type="number" min="0" inputMode="numeric" />
                    </span>
                  </label>
                  <label className="field-group">
                    <span>Mata uang</span>
                    <span className="field-control">
                      <input name="currency" defaultValue={currency} maxLength={3} required />
                    </span>
                  </label>
                </div>
                <label className="field-group">
                  <span>
                    Benefit <small>(opsional)</small>
                  </span>
                  <span className="field-control field-control-textarea">
                    <textarea name="benefits" rows={3} />
                  </span>
                </label>
                <div className="field-group">
                  <span>
                    Tanggal mulai <small>(opsional)</small>
                  </span>
                  <ThemedDateOnlyPicker name="startDate" />
                </div>
                <div className="field-group">
                  <span>
                    Tenggat tawaran <small>(opsional)</small>
                  </span>
                  <ThemedDatePicker
                    name="offerDeadline"
                    value={eventDateTime}
                    onChange={setEventDateTime}
                    placeholder="Pilih tenggat tawaran"
                  />
                  <small>Waktu mengikuti zona waktu pada Pengaturan.</small>
                </div>
                <label className="field-group">
                  <span>
                    Catatan <small>(opsional)</small>
                  </span>
                  <span className="field-control field-control-textarea">
                    <textarea name="notes" rows={4} />
                  </span>
                </label>
                {message && (
                  <p className="form-error" role="alert">
                    {message}
                  </p>
                )}
                <div className="dialog-actions">
                  <button className="filter-button" type="button" onClick={closeContextualDialog}>
                    Lewati
                  </button>
                  <button className="button" type="submit" disabled={pending}>
                    {pending ? "Menyimpan..." : "Simpan tawaran"}
                  </button>
                </div>
              </form>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
