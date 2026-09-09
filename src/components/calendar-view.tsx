"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, X } from "lucide-react";
import type { CalendarEventDTO } from "@/backend/dto";

const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const titleFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const categoryClass = (event: CalendarEventDTO) =>
  event.category === "interview"
    ? "event-wawancara"
    : event.category === "assessment"
      ? "event-asesmen"
      : "event-tawaran";

export function CalendarView({
  events,
  month,
  timezone,
}: {
  events: CalendarEventDTO[];
  month: string;
  timezone: string;
}) {
  const [view, setView] = useState<"month" | "agenda">("month");
  const [selected, setSelected] = useState<CalendarEventDTO | null>(null);

  const calendar = useMemo(() => {
    const current = new Date(`${month}-01T00:00:00Z`);
    const year = current.getUTCFullYear();
    const monthIndex = current.getUTCMonth();
    const firstWeekday = (new Date(Date.UTC(year, monthIndex, 1)).getUTCDay() + 6) % 7;
    const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const previousDays = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();

    return {
      current,
      year,
      monthIndex,
      cells: Array.from({ length: 42 }, (_, index) =>
        index < firstWeekday
          ? { day: previousDays - firstWeekday + index + 1, muted: true }
          : index >= firstWeekday + daysInMonth
            ? { day: index - firstWeekday - daysInMonth + 1, muted: true }
            : { day: index - firstWeekday + 1, muted: false },
      ),
    };
  }, [month]);

  const formatters = useMemo(
    () => ({
      day: new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: timezone }),
      time: new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
      }),
      month: new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: timezone }),
      full: new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: timezone,
      }),
    }),
    [timezone],
  );

  const eventsByDay = useMemo(() => {
    const grouped = new Map<number, { event: CalendarEventDTO; time: string }[]>();
    for (const event of events) {
      const date = new Date(event.occursAt);
      const day = Number(formatters.day.format(date));
      const group = grouped.get(day) ?? [];
      group.push({ event, time: formatters.time.format(date) });
      grouped.set(day, group);
    }
    return grouped;
  }, [events, formatters]);

  const agendaEvents = useMemo(
    () =>
      events.map((event) => {
        const date = new Date(event.occursAt);
        return {
          event,
          day: formatters.day.format(date),
          month: formatters.month.format(date).toUpperCase(),
          full: formatters.full.format(date),
        };
      }),
    [events, formatters],
  );

  const monthHref = (offset: number) => {
    const value = new Date(Date.UTC(calendar.year, calendar.monthIndex + offset, 1));
    return `/kalender?month=${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}`;
  };

  return (
    <>
      <div className="calendar-toolbar">
        <div className="month-control">
          <Link aria-label="Bulan sebelumnya" href={monthHref(-1)}>
            <ArrowLeft />
          </Link>
          <strong>{titleFormatter.format(calendar.current)}</strong>
          <Link aria-label="Bulan berikutnya" href={monthHref(1)}>
            <ArrowRight />
          </Link>
        </div>
        <div className="view-switch">
          <button className={view === "month" ? "active" : ""} onClick={() => setView("month")}>
            Bulan
          </button>
          <button className={view === "agenda" ? "active" : ""} onClick={() => setView("agenda")}>
            Agenda
          </button>
        </div>
      </div>

      {view === "month" ? (
        <section className="month-view">
          <div className="weekday-row">
            {weekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {calendar.cells.map((cell, index) => (
              <div className={cell.muted ? "calendar-cell muted-day" : "calendar-cell"} key={index}>
                <span className="calendar-day-number">{cell.day}</span>
                {!cell.muted &&
                  eventsByDay.get(cell.day)?.map(({ event, time }) => (
                    <button
                      className={`calendar-event ${categoryClass(event)}`}
                      onClick={() => setSelected(event)}
                      key={`${event.id}-${event.occurrenceKind}`}
                    >
                      <span>{time}</span>
                      <strong>{event.title}</strong>
                    </button>
                  ))}
              </div>
            ))}
          </div>
          {!events.length && (
            <div className="calendar-empty">
              <CalendarDays />
              <strong>Belum ada agenda bulan ini.</strong>
            </div>
          )}
        </section>
      ) : (
        <section className="agenda-view">
          {agendaEvents.map(({ event, day, month: eventMonth, full }) => (
            <button
              className="agenda-event"
              onClick={() => setSelected(event)}
              key={`${event.id}-${event.occurrenceKind}`}
            >
              <span className={`agenda-date ${categoryClass(event)}`}>
                <strong>{day}</strong>
                <small>{eventMonth}</small>
              </span>
              <span className="agenda-copy">
                <small>{full}</small>
                <strong>{event.title}</strong>
                <span>
                  {event.company} · {event.position}
                </span>
              </span>
            </button>
          ))}
        </section>
      )}

      {selected && (
        <div className="dialog-backdrop" onMouseDown={() => setSelected(null)}>
          <section
            className="event-detail-dialog"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <span className={`event-detail-icon ${categoryClass(selected)}`}>
                <CalendarDays />
              </span>
              <button onClick={() => setSelected(null)} aria-label="Tutup">
                <X />
              </button>
            </header>
            <span className="event-detail-category">
              {selected.occurrenceKind === "deadline" ? "Tenggat" : "Agenda rekrutmen"}
            </span>
            <h2>{selected.title}</h2>
            <p className="event-detail-company">
              {selected.company} · {selected.position}
            </p>
            <dl>
              <div>
                <dt>
                  <Clock3 /> Waktu
                </dt>
                <dd>{formatters.full.format(new Date(selected.occursAt))}</dd>
              </div>
              {(selected.location || selected.url) && (
                <div>
                  <dt>
                    <MapPin /> Lokasi
                  </dt>
                  <dd>
                    {selected.url ? (
                      <a className="text-link" href={selected.url} target="_blank" rel="noreferrer">
                        Buka tautan
                      </a>
                    ) : (
                      selected.location
                    )}
                  </dd>
                </div>
              )}
            </dl>
            {selected.notes && <p>{selected.notes}</p>}
            <Link className="button" href={`/aplikasi/${selected.applicationId}`}>
              Lihat lamaran <ArrowRight />
            </Link>
          </section>
        </div>
      )}
    </>
  );
}
