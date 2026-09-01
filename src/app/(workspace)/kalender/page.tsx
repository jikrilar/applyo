import type { Metadata } from "next";
import { CalendarView } from "@/components/calendar-view";
import { getCalendarEvents } from "@/backend/services/queries";
import { getPreferences } from "@/backend/services/preferences";
import { monthRangeUtc } from "@/lib/dates";

export const metadata: Metadata = { title: "Kalender | Applyo" };
export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams; const preferences = await getPreferences(); const currentMonth = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: preferences.timezone }).format(new Date()); const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(params.month ?? "") ? params.month! : currentMonth; const { start, end } = monthRangeUtc(month, preferences.timezone); const events = await getCalendarEvents({ start, end });
  return <div className="calendar-page"><header className="workspace-page-header"><div><span>Agenda rekrutmen</span><h1>Kalender</h1><p>Wawancara, asesmen, dan tenggat dalam satu tampilan.</p></div></header><CalendarView events={events} month={month} timezone={preferences.timezone} /></div>;
}
