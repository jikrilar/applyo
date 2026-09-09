import type { ApplicationOfferRow, ApplicationOutcomeRow, ApplicationRow, PipelineStageRow, RecruitmentEventRow } from "@/types/database";

export type StageDTO = { id: string; name: string; systemKey: string | null; colorKey: string; position: number; isClosed: boolean; isVisible: boolean };
export type ApplicationCardDTO = { id: string; company: string; position: string; location: string | null; stageId: string; stage: StageDTO; appliedAt: string | null; source: string | null; sortOrder: number; updatedAt: string; upcomingEventAt: string | null; lastActivityAt: string; waitingDays: number; followUpSuggested: boolean };
export type BoardDTO = { stages: StageDTO[]; cardsByStage: Record<string, ApplicationCardDTO[]> };
export type ApplicationListItemDTO = Pick<ApplicationCardDTO, "id" | "company" | "position" | "location" | "stage" | "appliedAt" | "source" | "upcomingEventAt" | "lastActivityAt">;
export type TimelineItemDTO = { id: string; kind: "history" | "event" | "outcome"; title: string; description: string | null; occurredAt: string; metadata: Record<string, unknown> };
export type ApplicationDetailDTO = { application: ApplicationRow; stage: StageDTO; events: RecruitmentEventDTO[]; offer: ApplicationOfferRow | null; outcomes: ApplicationOutcomeRow[]; timeline: TimelineItemDTO[] };
export type RecruitmentEventDTO = { id: string; applicationId: string; category: string; subtype: string | null; title: string; scheduledAt: string | null; deadlineAt: string | null; location: string | null; url: string | null; notes: string | null; status: string; completedAt: string | null };
export type CalendarEventDTO = RecruitmentEventDTO & { company: string; position: string; occursAt: string; occurrenceKind: "scheduled" | "deadline" | "offer_deadline" };
export type DashboardUpcomingDTO = Pick<CalendarEventDTO, "id" | "applicationId" | "title" | "company" | "occursAt" | "occurrenceKind">;
export type DashboardSummaryDTO = { total: number; active: number; interviews: number; assessments: number; offers: number; upcoming: DashboardUpcomingDTO[]; needsAttention: NeedsAttentionDTO[] };
export type NeedsAttentionDTO = { kind: "upcoming" | "inactive"; applicationId: string; title: string; dueAt: string | null; daysWaiting: number | null };
export type AnalyticsSummaryDTO = { total: number; active: number; interviews: number; assessments: number; offers: number; hired: number; rejected: number; conversions: { appliedToInterview: number; interviewToOffer: number; offerToHired: number }; trend: { date: string; count: number }[]; sources: { source: string; applications: number }[] };
export type PreferencesDTO = { currency: string; dateFormat: string; timezone: string };

export function toStageDTO(row: Pick<PipelineStageRow, "id" | "name" | "system_key" | "color_key" | "position" | "is_closed" | "is_visible">): StageDTO { return { id: row.id, name: row.name, systemKey: row.system_key, colorKey: row.color_key, position: row.position, isClosed: row.is_closed, isVisible: row.is_visible }; }
export function toEventDTO(row: RecruitmentEventRow): RecruitmentEventDTO { return { id: row.id, applicationId: row.application_id, category: row.category, subtype: row.subtype, title: row.title, scheduledAt: row.scheduled_at, deadlineAt: row.deadline_at, location: row.location, url: row.url, notes: row.notes, status: row.status, completedAt: row.completed_at }; }
