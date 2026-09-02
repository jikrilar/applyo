"use client";

import { type KeyboardEvent, useState } from "react";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./menu";

type DatePickerProps = {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  popoverClassName?: string;
};

const isoToday = () => new Date().toISOString().slice(0, 10);

function usePickerValue({
  value,
  defaultValue = "",
  onChange,
}: Pick<DatePickerProps, "value" | "defaultValue" | "onChange">) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const setValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
  };
  return [currentValue, setValue] as const;
}

function monthData(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const monthLabel = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthNumber - 1, 1)));
  return {
    year,
    monthNumber,
    monthLabel,
    cells: Array.from({ length: 42 }, (_, index) => index - firstDay + 1),
    daysInMonth,
  };
}

function adjacentMonth(month: string, offset: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const next = new Date(Date.UTC(year, monthNumber - 1 + offset, 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`;
}

function moveDayFocus(event: KeyboardEvent<HTMLButtonElement>) {
  const offsets: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
    ArrowDown: 7,
  };
  const grid = event.currentTarget.closest(".date-picker-days");
  if (!grid) return;
  const buttons = Array.from(
    grid.querySelectorAll<HTMLButtonElement>("button.date-picker-day:not(:disabled)"),
  );
  const currentIndex = buttons.indexOf(event.currentTarget);
  let nextIndex = currentIndex;
  if (event.key in offsets) nextIndex += offsets[event.key];
  else if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = buttons.length - 1;
  else return;
  event.preventDefault();
  buttons[Math.max(0, Math.min(buttons.length - 1, nextIndex))]?.focus();
}

function DateGrid({
  month,
  value,
  min,
  max,
  onSelect,
}: {
  month: string;
  value: string;
  min?: string;
  max?: string;
  onSelect: (day: number) => void;
}) {
  const { monthLabel, cells, daysInMonth } = monthData(month);
  const today = isoToday();
  const availableDates = Array.from({ length: daysInMonth }, (_, index) => {
    const date = `${month}-${String(index + 1).padStart(2, "0")}`;
    return (min && date < min) || (max && date > max) ? null : date;
  }).filter((date): date is string => Boolean(date));
  const focusDate = availableDates.includes(value)
    ? value
    : availableDates.includes(today)
      ? today
      : availableDates[0];
  return (
    <>
      <div className="date-picker-weekdays" aria-hidden="true">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="date-picker-days" role="grid" aria-label={monthLabel}>
        {cells.map((day, index) => {
          if (day < 1 || day > daysInMonth) {
            return <span className="date-picker-day empty" aria-hidden="true" key={index} />;
          }
          const date = `${month}-${String(day).padStart(2, "0")}`;
          const selected = value === date;
          const isToday = today === date;
          const unavailable = Boolean((min && date < min) || (max && date > max));
          return (
            <button
              className={["date-picker-day", selected ? "selected" : "", isToday ? "today" : ""]
                .filter(Boolean)
                .join(" ")}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-current={isToday ? "date" : undefined}
              disabled={unavailable}
              tabIndex={date === focusDate ? 0 : -1}
              onClick={() => onSelect(day)}
              onKeyDown={moveDayFocus}
              key={date}
            >
              {day}
            </button>
          );
        })}
      </div>
    </>
  );
}

export function ThemedDateOnlyPicker({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "Pilih tanggal",
  disabled = false,
  min,
  max,
  popoverClassName,
}: DatePickerProps) {
  const [value, setValue] = usePickerValue({
    value: controlledValue,
    defaultValue,
    onChange,
  });
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState((value || isoToday()).slice(0, 7));
  const { monthLabel } = monthData(month);

  const close = () => setOpen(false);
  const chooseDate = (day: number) => {
    setValue(`${month}-${String(day).padStart(2, "0")}`);
    close();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="themed-date-picker-wrap date-only-picker">
        <input type="hidden" name={name} value={value} />
        <PopoverTrigger asChild>
          <button
            className={open ? "date-picker-trigger open" : "date-picker-trigger"}
            type="button"
            disabled={disabled}
          >
            <CalendarDays aria-hidden="true" />
            <span>
              {value
                ? new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                    timeZone: "UTC",
                  }).format(new Date(`${value}T00:00:00Z`))
                : placeholder}
            </span>
            <ChevronDown aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          unstyled
          className={[
            "themed-date-picker-popover",
            "date-picker-popover-portal",
            "date-only-picker-popover",
            popoverClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={12}
          avoidCollisions
          sticky="always"
          aria-label={placeholder}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="date-picker-header">
            <button
              type="button"
              onClick={() => setMonth(adjacentMonth(month, -1))}
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <strong>{monthLabel}</strong>
            <button
              type="button"
              onClick={() => setMonth(adjacentMonth(month, 1))}
              aria-label="Bulan berikutnya"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
          <DateGrid month={month} value={value} min={min} max={max} onSelect={chooseDate} />
          {value && (
            <button
              className="date-picker-clear"
              type="button"
              onClick={() => {
                setValue("");
                close();
              }}
            >
              Hapus tanggal
            </button>
          )}
        </PopoverContent>
      </div>
    </Popover>
  );
}

export function ThemedDatePicker({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "Pilih tanggal dan waktu",
  disabled = false,
  min,
  max,
}: DatePickerProps) {
  const [value, setValue] = usePickerValue({
    value: controlledValue,
    defaultValue,
    onChange,
  });
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState((value || isoToday()).slice(0, 7));
  const { monthLabel } = monthData(month);
  const selectedDate = value.slice(0, 10);
  const selectedTime = value.slice(11, 16) || "09:00";

  const close = () => setOpen(false);
  const chooseDate = (day: number) =>
    setValue(`${month}-${String(day).padStart(2, "0")}T${selectedTime}`);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="themed-date-picker-wrap">
        <input type="hidden" name={name} value={value} />
        <PopoverTrigger asChild>
          <button
            className={open ? "date-picker-trigger open" : "date-picker-trigger"}
            type="button"
            disabled={disabled}
          >
            <CalendarDays aria-hidden="true" />
            <span>
              {value
                ? new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(`${value}:00`))
                : placeholder}
            </span>
            <ChevronDown aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          unstyled
          className="themed-date-picker-popover date-picker-popover-portal"
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={12}
          avoidCollisions
          sticky="always"
          aria-label={placeholder}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="date-picker-header">
            <button
              type="button"
              onClick={() => setMonth(adjacentMonth(month, -1))}
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <strong>{monthLabel}</strong>
            <button
              type="button"
              onClick={() => setMonth(adjacentMonth(month, 1))}
              aria-label="Bulan berikutnya"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
          <DateGrid
            month={month}
            value={selectedDate}
            min={min?.slice(0, 10)}
            max={max?.slice(0, 10)}
            onSelect={chooseDate}
          />
          <TimeDropdown
            value={selectedTime}
            onChange={(time) => setValue(`${selectedDate || `${month}-01`}T${time}`)}
          />
          <div className="date-picker-actions">
            {value && (
              <button className="date-picker-clear" type="button" onClick={() => setValue("")}>
                Hapus tanggal
              </button>
            )}
            <button
              className="button date-picker-done"
              type="button"
              disabled={!selectedDate}
              onClick={close}
            >
              Gunakan tanggal
            </button>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}

function TimeDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [hour, minute] = value.split(":");
  return (
    <div className="date-picker-time">
      <span>Waktu</span>
      <div className="time-part-grid">
        <TimePartDropdown
          label="Jam"
          value={hour}
          values={Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"))}
          onChange={(nextHour) => onChange(`${nextHour}:${minute}`)}
        />
        <span className="time-separator" aria-hidden="true">
          :
        </span>
        <TimePartDropdown
          label="Menit"
          value={minute}
          values={Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"))}
          onChange={(nextMinute) => onChange(`${hour}:${nextMinute}`)}
        />
      </div>
    </div>
  );
}

function TimePartDropdown({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="time-part">
      <span className="time-part-label">{label}</span>
      <div
        className="time-dropdown"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <button
          className="time-dropdown-trigger"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <Clock3 aria-hidden="true" />
          <strong>{value}</strong>
          <ChevronDown aria-hidden="true" />
        </button>
        {open && (
          <div
            className="time-dropdown-menu time-part-menu"
            role="listbox"
            aria-label={`Pilih ${label.toLowerCase()}`}
          >
            {values.map((option) => (
              <button
                className={option === value ? "selected" : ""}
                type="button"
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                key={option}
              >
                {option}
                {option === value && <Check aria-hidden="true" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
