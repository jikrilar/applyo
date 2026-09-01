export function zonedLocalToUtc(local: string, timeZone: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!match) throw new Error("Invalid local datetime");
  const [, year, month, day, hour, minute] = match.map(Number);
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(guess));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const represented = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute));
  return new Date(guess - (represented - guess)).toISOString();
}

export function monthRangeUtc(month: string, timeZone: string) {
  const [year, number] = month.split("-").map(Number);
  const next = number === 12 ? `${year + 1}-01-01T00:00` : `${year}-${String(number + 1).padStart(2, "0")}-01T00:00`;
  return { start: zonedLocalToUtc(`${month}-01T00:00`, timeZone), end: zonedLocalToUtc(next, timeZone) };
}

export function localDay(value: string, timeZone: string) {
  return Number(new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone }).format(new Date(value)));
}
