import "server-only";
import { requireAuth } from "@/backend/auth";
import { calculateConversions, waitingState } from "@/backend/calculations";
import {
  EVENT_CATEGORY_LABELS_ID,
  STAGE_LABELS_ID,
  type StageSystemKey,
} from "@/backend/domain/constants";
import { databaseError, validationError } from "@/backend/errors";
import {
  toEventDTO,
  toStageDTO,
  type AnalyticsSummaryDTO,
  type ApplicationCardDTO,
  type ApplicationDetailDTO,
  type ApplicationListItemDTO,
  type CalendarEventDTO,
  type DashboardSummaryDTO,
  type DashboardUpcomingDTO,
  type TimelineItemDTO,
} from "@/backend/dto";
import { calendarRangeSchema, searchFiltersSchema } from "@/backend/schemas/search";
import type {
  ApplicationHistoryRow,
  ApplicationOutcomeRow,
  ApplicationRow,
  PipelineStageRow,
  RecruitmentEventRow,
} from "@/types/database";

type ApplicationCardRow = Pick<
  ApplicationRow,
  | "id"
  | "stage_id"
  | "company"
  | "position"
  | "source"
  | "applied_at"
  | "sort_order"
  | "closed_at"
  | "archived_at"
  | "created_at"
  | "updated_at"
  | "location"
>;

type ApplicationListRow = Pick<
  ApplicationRow,
  | "id"
  | "stage_id"
  | "company"
  | "position"
  | "source"
  | "applied_at"
  | "created_at"
  | "updated_at"
  | "location"
>;
type ApplicationListEventRow = Pick<
  RecruitmentEventRow,
  | "application_id"
  | "scheduled_at"
  | "deadline_at"
  | "status"
  | "completed_at"
  | "created_at"
>;
type ApplicationListHistoryRow = Pick<ApplicationHistoryRow, "application_id" | "occurred_at">;
type ApplicationListStageRow = Pick<
  PipelineStageRow,
  "id" | "name" | "system_key" | "color_key" | "position" | "is_closed" | "is_visible"
>;

function listItem(
  application: ApplicationListRow,
  stage: ApplicationListStageRow,
  events: ApplicationListEventRow[],
  histories: ApplicationListHistoryRow[],
  now = new Date(),
): ApplicationListItemDTO {
  const upcoming =
    events
      .filter((event) => event.status === "scheduled")
      .flatMap((event) => [event.scheduled_at, event.deadline_at])
      .filter((date): date is string => Boolean(date) && new Date(date as string) >= now)
      .sort()[0] ?? null;
  const activityDates = [
    ...events.map(
      (event) => event.completed_at ?? event.scheduled_at ?? event.deadline_at ?? event.created_at,
    ),
    ...histories.map((history) => history.occurred_at),
  ];
  return {
    id: application.id,
    company: application.company,
    position: application.position,
    location: application.location,
    stage: toStageDTO(stage),
    appliedAt: application.applied_at,
    source: application.source,
    upcomingEventAt: upcoming,
    lastActivityAt:
      [...activityDates, application.updated_at, application.applied_at ?? application.created_at]
        .sort()
        .at(-1) ?? application.created_at,
  };
}

async function dashboardRows() {
  const { client, user } = await requireAuth();
  const [applications, stages, events, histories, offers] = await Promise.all([
    client
      .from("applications")
      .select("id,stage_id,company,applied_at,archived_at,created_at,updated_at")
      .eq("user_id", user.id),
    client.from("pipeline_stages").select("id,is_closed").eq("user_id", user.id),
    client
      .from("recruitment_events")
      .select(
        "id,application_id,category,title,scheduled_at,deadline_at,status,completed_at,created_at",
      )
      .eq("user_id", user.id),
    client
      .from("application_history")
      .select("application_id,occurred_at")
      .eq("user_id", user.id),
    client
      .from("application_offers")
      .select("id,application_id,offer_deadline")
      .eq("user_id", user.id),
  ]);
  for (const result of [applications, stages, events, histories, offers])
    if (result.error) throw databaseError("read_dashboard_data", result.error);
  return {
    applications: applications.data ?? [],
    stages: stages.data ?? [],
    events: events.data ?? [],
    histories: histories.data ?? [],
    offers: offers.data ?? [],
  };
}

async function analyticsRows() {
  const { client, user } = await requireAuth();
  const [applications, stages, events, histories, outcomes, offers] = await Promise.all([
    client
      .from("applications")
      .select("id,stage_id,source,applied_at,archived_at,created_at")
      .eq("user_id", user.id),
    client
      .from("pipeline_stages")
      .select("id,system_key,is_closed")
      .eq("user_id", user.id),
    client
      .from("recruitment_events")
      .select("application_id,category,status")
      .eq("user_id", user.id),
    client
      .from("application_history")
      .select("application_id,to_stage_id")
      .eq("user_id", user.id),
    client
      .from("application_outcomes")
      .select("application_id,outcome_key")
      .eq("user_id", user.id),
    client.from("application_offers").select("application_id").eq("user_id", user.id),
  ]);
  for (const result of [applications, stages, events, histories, outcomes, offers])
    if (result.error) throw databaseError("read_analytics_data", result.error);
  return {
    applications: applications.data ?? [],
    stages: stages.data ?? [],
    events: events.data ?? [],
    histories: histories.data ?? [],
    outcomes: outcomes.data ?? [],
    offers: offers.data ?? [],
  };
}

function card(
  application: ApplicationCardRow,
  stage: PipelineStageRow,
  events: RecruitmentEventRow[],
  histories: ApplicationHistoryRow[],
  now = new Date(),
): ApplicationCardDTO {
  const relatedEvents = events.filter((event) => event.application_id === application.id);
  const upcoming =
    relatedEvents
      .filter((event) => event.status === "scheduled")
      .flatMap((event) => [event.scheduled_at, event.deadline_at])
      .filter((date): date is string => Boolean(date) && new Date(date as string) >= now)
      .sort()[0] ?? null;
  const activityDates = [
    ...relatedEvents.map(
      (event) => event.completed_at ?? event.scheduled_at ?? event.deadline_at ?? event.created_at,
    ),
    ...histories
      .filter((item) => item.application_id === application.id)
      .map((item) => item.occurred_at),
  ];
  const waiting = waitingState(
    {
      createdAt: application.created_at,
      appliedAt: application.applied_at,
      activityDates,
      isClosed: stage.is_closed,
      isArchived: Boolean(application.archived_at),
    },
    now,
  );
  const lastActivityAt =
    [...activityDates, application.updated_at, application.applied_at ?? application.created_at]
      .sort()
      .at(-1) ?? application.created_at;
  return {
    id: application.id,
    company: application.company,
    position: application.position,
    location: application.location,
    stageId: stage.id,
    stage: toStageDTO(stage),
    appliedAt: application.applied_at,
    source: application.source,
    sortOrder: application.sort_order,
    updatedAt: application.updated_at,
    upcomingEventAt: upcoming,
    lastActivityAt,
    waitingDays: waiting.waitingDays,
    followUpSuggested: waiting.followUpSuggested,
  };
}

export async function getApplicationStages() {
  const { client, user } = await requireAuth();
  const result = await client
    .from("pipeline_stages")
    .select("*")
    .eq("user_id", user.id)
    .order("position");
  if (result.error) throw databaseError("get_application_stages", result.error);
  return (result.data ?? []).map(toStageDTO);
}

export async function getBoard() {
  const { client, user } = await requireAuth();
  const [stageResult, applicationResult, eventResult, historyResult] = await Promise.all([
    client
      .from("pipeline_stages")
      .select(
        "id,user_id,name,slug,system_key,color_key,position,is_closed,is_visible,created_at,updated_at",
      )
      .eq("user_id", user.id)
      .eq("is_closed", false)
      .eq("is_visible", true)
      .order("position"),
    client
      .from("applications")
      .select(
        "id,stage_id,company,position,source,applied_at,sort_order,closed_at,archived_at,created_at,updated_at,location",
      )
      .eq("user_id", user.id)
      .is("archived_at", null)
      .is("closed_at", null)
      .order("sort_order"),
    client
      .from("recruitment_events")
      .select(
        "id,user_id,application_id,category,subtype,title,scheduled_at,deadline_at,location,url,notes,status,completed_at,created_at,updated_at",
      )
      .eq("user_id", user.id),
    client
      .from("application_history")
      .select(
        "id,user_id,application_id,event_type,from_stage_id,to_stage_id,metadata,occurred_at,created_at",
      )
      .eq("user_id", user.id)
      .order("occurred_at", { ascending: false }),
  ]);
  for (const result of [stageResult, applicationResult, eventResult, historyResult])
    if (result.error) throw databaseError("get_board", result.error);
  const stages = stageResult.data ?? [];
  const applications = applicationResult.data ?? [];
  const events = eventResult.data ?? [];
  const histories = historyResult.data ?? [];
  return {
    stages: stages.map(toStageDTO),
    cardsByStage: Object.fromEntries(
      stages.map((stage) => [
        stage.id,
        applications
          .filter((app) => app.stage_id === stage.id)
          .map((app) => card(app, stage, events, histories)),
      ]),
    ),
  };
}

export async function searchApplications(raw: unknown = {}) {
  const parsed = searchFiltersSchema.safeParse(raw);
  if (!parsed.success) throw validationError(parsed.error);
  const filters = parsed.data;
  const { client, user } = await requireAuth();
  const listContextPromise = Promise.all([
    client
      .from("pipeline_stages")
      .select("id,name,system_key,color_key,position,is_closed,is_visible")
      .eq("user_id", user.id)
      .order("position"),
    client
      .from("applications")
      .select("location")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .is("closed_at", null),
  ]);
  let outcomeIds: string[] | null = null;
  if (filters.outcome) {
    const outcomeResult = await client
      .from("application_outcomes")
      .select("application_id")
      .eq("user_id", user.id)
      .eq("outcome_key", filters.outcome)
      .is("reopened_at", null);
    if (outcomeResult.error) throw databaseError("filter_outcomes", outcomeResult.error);
    outcomeIds = [...new Set((outcomeResult.data ?? []).map((row) => row.application_id))];
    if (!outcomeIds.length) {
      const [stageResult, locationResult] = await listContextPromise;
      for (const result of [stageResult, locationResult])
        if (result.error) throw databaseError("search_application_context", result.error);
      return {
        items: [],
        total: 0,
        stages: (stageResult.data ?? [])
          .filter((stage) => !stage.is_closed && stage.is_visible)
          .map(toStageDTO),
        locations: [
          ...new Set(
            (locationResult.data ?? []).flatMap((row) => (row.location ? [row.location] : [])),
          ),
        ].sort(),
      };
    }
  }
  let query = client
    .from("applications")
    .select(
      "id,stage_id,company,position,source,applied_at,created_at,updated_at,location",
      { count: "exact" },
    )
    .eq("user_id", user.id);
  query = filters.archived ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  const stageIds = filters.stageId
    ? Array.isArray(filters.stageId)
      ? filters.stageId
      : [filters.stageId]
    : [];
  const locations = filters.location
    ? Array.isArray(filters.location)
      ? filters.location
      : [filters.location]
    : [];
  if (stageIds.length) query = query.in("stage_id", stageIds);
  if (locations.length) query = query.in("location", locations);
  if (filters.source) query = query.ilike("source", filters.source);
  if (filters.dateFrom) query = query.gte("applied_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("applied_at", filters.dateTo);
  if (filters.query) {
    const safeQuery = filters.query.replace(/[%_,()]/g, "");
    query = query.or(`company.ilike.%${safeQuery}%,position.ilike.%${safeQuery}%`);
  }
  if (outcomeIds) query = query.in("id", outcomeIds);
  const upcomingSort = filters.sort === "upcoming_asc" || filters.sort === "upcoming_desc";
  const order =
    filters.sort === "applied_asc"
      ? (["applied_at", true] as const)
      : (["applied_at", false] as const);
  const applicationResult = upcomingSort
    ? await query.order("id")
    : await query
        .order(order[0], { ascending: order[1], nullsFirst: false })
        .range(filters.offset, filters.offset + filters.limit - 1);
  if (applicationResult.error) throw databaseError("search_applications", applicationResult.error);
  const applications = applicationResult.data ?? [];
  const ids = applications.map((app) => app.id);
  const [[stageResult, locationResult], eventResult, historyResult] = await Promise.all([
    listContextPromise,
    ids.length
      ? upcomingSort
        ? client
            .from("recruitment_events")
            .select(
              "application_id,scheduled_at,deadline_at,status,completed_at,created_at",
            )
            .eq("user_id", user.id)
        : client
            .from("recruitment_events")
            .select(
              "application_id,scheduled_at,deadline_at,status,completed_at,created_at",
            )
            .in("application_id", ids)
      : Promise.resolve({ data: [], error: null }),
    ids.length
      ? upcomingSort
        ? client
            .from("application_history")
            .select("application_id,occurred_at")
            .eq("user_id", user.id)
        : client
            .from("application_history")
            .select("application_id,occurred_at")
            .in("application_id", ids)
      : Promise.resolve({ data: [], error: null }),
  ]);
  for (const result of [stageResult, locationResult, eventResult, historyResult])
    if (result.error) throw databaseError("search_application_context", result.error);
  const stageMap = new Map((stageResult.data ?? []).map((stage) => [stage.id, stage]));
  const eventsByApplication = new Map<string, ApplicationListEventRow[]>();
  for (const event of eventResult.data ?? [])
    eventsByApplication.set(event.application_id, [
      ...(eventsByApplication.get(event.application_id) ?? []),
      event,
    ]);
  const historiesByApplication = new Map<string, ApplicationListHistoryRow[]>();
  for (const history of historyResult.data ?? [])
    historiesByApplication.set(history.application_id, [
      ...(historiesByApplication.get(history.application_id) ?? []),
      history,
    ]);
  let items = applications.flatMap((app): ApplicationListItemDTO[] => {
    const stage = stageMap.get(app.stage_id);
    if (!stage) return [];
    return [
      listItem(
        app,
        stage,
        eventsByApplication.get(app.id) ?? [],
        historiesByApplication.get(app.id) ?? [],
      ),
    ];
  });
  if (upcomingSort) {
    const direction = filters.sort === "upcoming_asc" ? 1 : -1;
    items = items
      .sort((a, b) => {
        if (!a.upcomingEventAt) return b.upcomingEventAt ? 1 : a.company.localeCompare(b.company);
        if (!b.upcomingEventAt) return -1;
        return a.upcomingEventAt.localeCompare(b.upcomingEventAt) * direction;
      })
      .slice(filters.offset, filters.offset + filters.limit);
  }
  return {
    items,
    total: applicationResult.count ?? items.length,
    stages: (stageResult.data ?? [])
      .filter((stage) => !stage.is_closed && stage.is_visible)
      .map(toStageDTO),
    locations: [
      ...new Set(
        (locationResult.data ?? []).flatMap((row) => (row.location ? [row.location] : [])),
      ),
    ].sort(),
  };
}

export async function getApplicationDetail(
  applicationId: string,
): Promise<ApplicationDetailDTO | null> {
  const { client, user } = await requireAuth();
  const applicationResult = await client
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (applicationResult.error) throw databaseError("get_application", applicationResult.error);
  if (!applicationResult.data) return null;
  const application = applicationResult.data;
  const [stageResult, eventResult, historyResult, outcomeResult, offerResult] = await Promise.all([
    client
      .from("pipeline_stages")
      .select("*")
      .eq("id", application.stage_id)
      .eq("user_id", user.id)
      .single(),
    client
      .from("recruitment_events")
      .select("*")
      .eq("application_id", applicationId)
      .eq("user_id", user.id),
    client
      .from("application_history")
      .select("*")
      .eq("application_id", applicationId)
      .eq("user_id", user.id),
    client
      .from("application_outcomes")
      .select("*")
      .eq("application_id", applicationId)
      .eq("user_id", user.id),
    client
      .from("application_offers")
      .select("*")
      .eq("application_id", applicationId)
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);
  for (const result of [stageResult, eventResult, historyResult, outcomeResult, offerResult])
    if (result.error) throw databaseError("get_application_detail", result.error);
  if (!stageResult.data) throw databaseError("get_application_stage", { code: "PGRST116" });
  const allStages = await getApplicationStages();
  return {
    application,
    stage: toStageDTO(stageResult.data),
    events: (eventResult.data ?? []).map(toEventDTO),
    offer: offerResult.data,
    outcomes: outcomeResult.data ?? [],
    timeline: normalizeTimeline(
      historyResult.data ?? [],
      eventResult.data ?? [],
      outcomeResult.data ?? [],
      allStages,
    ),
  };
}

export function normalizeTimeline(
  histories: ApplicationHistoryRow[],
  events: RecruitmentEventRow[],
  outcomes: ApplicationOutcomeRow[],
  stages: { id: string; name: string; systemKey: string | null }[] = [],
): TimelineItemDTO[] {
  const stageNames = new Map(
    stages.map((stage) => [
      stage.id,
      stage.systemKey
        ? (STAGE_LABELS_ID[stage.systemKey as StageSystemKey] ?? stage.name)
        : stage.name,
    ]),
  );
  const historyItems: TimelineItemDTO[] = histories.map((item) => ({
    id: item.id,
    kind: "history",
    title: historyTitle(item.event_type),
    description:
      item.event_type === "stage_changed"
        ? [
            item.from_stage_id && stageNames.get(item.from_stage_id),
            item.to_stage_id && stageNames.get(item.to_stage_id),
          ]
            .filter(Boolean)
            .join(" → ") || null
        : null,
    occurredAt: item.occurred_at,
    metadata:
      typeof item.metadata === "object" && item.metadata && !Array.isArray(item.metadata)
        ? item.metadata
        : {},
  }));
  const eventItems: TimelineItemDTO[] = events.map((item) => ({
    id: item.id,
    kind: "event",
    title: item.title,
    description:
      EVENT_CATEGORY_LABELS_ID[item.category as keyof typeof EVENT_CATEGORY_LABELS_ID] ??
      "Aktivitas",
    occurredAt: item.completed_at ?? item.scheduled_at ?? item.deadline_at ?? item.created_at,
    metadata: { category: item.category, subtype: item.subtype, status: item.status },
  }));
  const outcomeItems: TimelineItemDTO[] = outcomes.map((item) => ({
    id: item.id,
    kind: "outcome",
    title: STAGE_LABELS_ID[item.outcome_key as StageSystemKey] ?? "Lamaran ditutup",
    description: item.notes,
    occurredAt: item.occurred_at,
    metadata: {
      outcome: item.outcome_key,
      reasonCode: item.reason_code,
      reopenedAt: item.reopened_at,
    },
  }));
  return [...historyItems, ...eventItems, ...outcomeItems].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  );
}
function historyTitle(type: string) {
  return (
    (
      {
        application_created: "Lamaran ditambahkan",
        stage_changed: "Tahap diubah",
        application_closed: "Lamaran ditutup",
        application_reopened: "Lamaran dibuka kembali",
        application_archived: "Lamaran diarsipkan",
        application_restored: "Lamaran dipulihkan",
      } as Record<string, string>
    )[type] ?? "Lamaran diperbarui"
  );
}

export async function getCalendarEvents(raw: unknown): Promise<CalendarEventDTO[]> {
  const parsed = calendarRangeSchema.safeParse(raw);
  if (!parsed.success) throw validationError(parsed.error);
  const { client, user } = await requireAuth();
  const { start, end } = parsed.data;
  const [eventResult, offerResult] = await Promise.all([
    client
      .from("recruitment_events")
      .select("*")
      .eq("user_id", user.id)
      .or(
        `and(scheduled_at.gte.${start},scheduled_at.lt.${end}),and(deadline_at.gte.${start},deadline_at.lt.${end})`,
      ),
    client
      .from("application_offers")
      .select("*")
      .eq("user_id", user.id)
      .gte("offer_deadline", start)
      .lt("offer_deadline", end),
  ]);
  for (const result of [eventResult, offerResult])
    if (result.error) throw databaseError("get_calendar", result.error);
  const applicationIds = [
    ...new Set([
      ...(eventResult.data ?? []).map((event) => event.application_id),
      ...(offerResult.data ?? []).map((offer) => offer.application_id),
    ]),
  ];
  const appResult = applicationIds.length
    ? await client
        .from("applications")
        .select("id,company,position,archived_at")
        .eq("user_id", user.id)
        .in("id", applicationIds)
    : { data: [], error: null };
  if (appResult.error) throw databaseError("get_calendar_applications", appResult.error);
  const appMap = new Map(
    (appResult.data ?? []).filter((app) => !app.archived_at).map((app) => [app.id, app]),
  );
  const inRange = (date: string | null) => Boolean(date && date >= start && date < end);
  const result: CalendarEventDTO[] = [];
  for (const event of eventResult.data ?? []) {
    const app = appMap.get(event.application_id);
    if (!app) continue;
    for (const [occursAt, occurrenceKind] of [
      [event.scheduled_at, "scheduled"],
      [event.deadline_at, "deadline"],
    ] as const)
      if (inRange(occursAt))
        result.push({
          ...toEventDTO(event),
          company: app.company,
          position: app.position,
          occursAt: occursAt as string,
          occurrenceKind,
        });
  }
  for (const offer of offerResult.data ?? []) {
    const app = appMap.get(offer.application_id);
    if (app && offer.offer_deadline)
      result.push({
        id: `offer-${offer.id}`,
        applicationId: app.id,
        category: "offer",
        subtype: null,
        title: "Batas waktu tawaran",
        scheduledAt: null,
        deadlineAt: offer.offer_deadline,
        location: null,
        url: null,
        notes: null,
        status: "scheduled",
        completedAt: null,
        company: app.company,
        position: app.position,
        occursAt: offer.offer_deadline,
        occurrenceKind: "offer_deadline",
      });
  }
  return result.sort((a, b) => a.occursAt.localeCompare(b.occursAt));
}

export async function getDashboardSummary(now = new Date()): Promise<DashboardSummaryDTO> {
  const rows = await dashboardRows();
  rows.applications = rows.applications.filter((app) => !app.archived_at);
  const stageMap = new Map(rows.stages.map((stage) => [stage.id, stage]));
  const active = rows.applications.filter((app) => !stageMap.get(app.stage_id)?.is_closed);
  const upcoming: DashboardUpcomingDTO[] = [];
  const horizon = new Date(now.getTime() + 7 * 86_400_000).toISOString();
  const nowIso = now.toISOString();
  const appMap = new Map(rows.applications.map((app) => [app.id, app]));
  for (const event of rows.events) {
    const app = appMap.get(event.application_id);
    if (!app || event.status !== "scheduled") continue;
    for (const [occursAt, occurrenceKind] of [
      [event.scheduled_at, "scheduled"],
      [event.deadline_at, "deadline"],
    ] as const)
      if (occursAt && occursAt >= nowIso && occursAt <= horizon)
        upcoming.push({
          id: event.id,
          applicationId: event.application_id,
          title: event.title,
          company: app.company,
          occursAt,
          occurrenceKind,
        });
  }
  for (const offer of rows.offers) {
    const app = appMap.get(offer.application_id);
    if (
      app &&
      offer.offer_deadline &&
      offer.offer_deadline >= nowIso &&
      offer.offer_deadline <= horizon
    )
      upcoming.push({
        id: `offer-${offer.id}`,
        applicationId: app.id,
        title: "Batas waktu tawaran",
        company: app.company,
        occursAt: offer.offer_deadline,
        occurrenceKind: "offer_deadline",
      });
  }
  const inactive = active.flatMap((app) => {
    const stage = stageMap.get(app.stage_id);
    if (!stage) return [];
    const relatedEvents = rows.events.filter((event) => event.application_id === app.id);
    const activityDates = [
      ...relatedEvents.map(
        (event) => event.completed_at ?? event.scheduled_at ?? event.deadline_at ?? event.created_at,
      ),
      ...rows.histories
        .filter((history) => history.application_id === app.id)
        .map((history) => history.occurred_at),
    ];
    const state = waitingState(
      {
        createdAt: app.created_at,
        appliedAt: app.applied_at,
        activityDates,
        isClosed: stage.is_closed,
        isArchived: Boolean(app.archived_at),
      },
      now,
    );
    return state.followUpSuggested
      ? [
          {
            kind: "inactive" as const,
            applicationId: app.id,
            title: `${app.company} belum memiliki kabar baru`,
            dueAt: null,
            daysWaiting: state.waitingDays,
          },
        ]
      : [];
  });
  const soon = upcoming
    .filter((item) => new Date(item.occursAt).getTime() - now.getTime() <= 48 * 3_600_000)
    .map((item) => ({
      kind: "upcoming" as const,
      applicationId: item.applicationId,
      title: item.title,
      dueAt: item.occursAt,
      daysWaiting: null,
    }));
  const includedApplicationIds = new Set(rows.applications.map((app) => app.id));
  return {
    total: rows.applications.length,
    active: active.length,
    interviews: rows.events.filter(
      (event) => includedApplicationIds.has(event.application_id) && event.category === "interview",
    ).length,
    assessments: rows.events.filter(
      (event) =>
        includedApplicationIds.has(event.application_id) && event.category === "assessment",
    ).length,
    offers: rows.offers.filter((offer) => includedApplicationIds.has(offer.application_id)).length,
    upcoming: upcoming.sort((a, b) => a.occursAt.localeCompare(b.occursAt)).slice(0, 10),
    needsAttention: [...soon, ...inactive].slice(0, 10),
  };
}

export async function getAnalytics(): Promise<AnalyticsSummaryDTO> {
  const rows = await analyticsRows();
  rows.applications = rows.applications.filter((app) => !app.archived_at);
  const applicationIds = new Set(rows.applications.map((app) => app.id));
  rows.events = rows.events.filter((event) => applicationIds.has(event.application_id));
  rows.histories = rows.histories.filter((history) => applicationIds.has(history.application_id));
  rows.outcomes = rows.outcomes.filter((outcome) => applicationIds.has(outcome.application_id));
  rows.offers = rows.offers.filter((offer) => applicationIds.has(offer.application_id));
  const stageById = new Map(rows.stages.map((stage) => [stage.id, stage]));
  const applicationById = new Map(rows.applications.map((app) => [app.id, app]));
  const historiesByApplication = new Map<string, typeof rows.histories>();
  for (const history of rows.histories)
    historiesByApplication.set(history.application_id, [
      ...(historiesByApplication.get(history.application_id) ?? []),
      history,
    ]);
  const outcomesByApplication = new Map<string, typeof rows.outcomes>();
  for (const outcome of rows.outcomes)
    outcomesByApplication.set(outcome.application_id, [
      ...(outcomesByApplication.get(outcome.application_id) ?? []),
      outcome,
    ]);
  const reached = (appId: string, key: string) =>
    stageById.get(applicationById.get(appId)?.stage_id ?? "")?.system_key === key ||
    (historiesByApplication.get(appId) ?? []).some(
      (history) => stageById.get(history.to_stage_id ?? "")?.system_key === key,
    ) ||
    (outcomesByApplication.get(appId) ?? []).some((outcome) => outcome.outcome_key === key);
  const counts = {
    applied: rows.applications.filter((app) => app.applied_at || reached(app.id, "applied")).length,
    interview: rows.applications.filter(
      (app) =>
        reached(app.id, "interview") ||
        rows.events.some(
          (event) => event.application_id === app.id && event.category === "interview",
        ),
    ).length,
    offer: rows.applications.filter(
      (app) =>
        reached(app.id, "offer") || rows.offers.some((offer) => offer.application_id === app.id),
    ).length,
    hired: rows.applications.filter((app) => reached(app.id, "hired")).length,
  };
  const trend = new Map<string, number>();
  const sources = new Map<string, number>();
  for (const app of rows.applications) {
    const date = (app.applied_at ?? app.created_at.slice(0, 10)).slice(0, 7);
    trend.set(date, (trend.get(date) ?? 0) + 1);
    const source = app.source ?? "Tidak diketahui";
    sources.set(source, (sources.get(source) ?? 0) + 1);
  }
  return {
    total: rows.applications.length,
    active: rows.applications.filter((app) => !stageById.get(app.stage_id)?.is_closed).length,
    interviews: counts.interview,
    assessments: rows.applications.filter(
      (app) =>
        reached(app.id, "assessment") ||
        rows.events.some(
          (event) =>
            event.application_id === app.id &&
            event.category === "assessment" &&
            event.status !== "cancelled",
        ),
    ).length,
    offers: counts.offer,
    hired: counts.hired,
    rejected: rows.applications.filter((app) => reached(app.id, "rejected")).length,
    conversions: calculateConversions(counts),
    trend: [...trend]
      .map(([date, count]) => ({ date: `${date}-01`, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    sources: [...sources]
      .map(([source, applications]) => ({ source, applications }))
      .sort((a, b) => b.applications - a.applications),
  };
}
