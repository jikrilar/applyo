// Generated-shape Supabase types. Regenerate this file with the Supabase CLI once
// the project is linked: supabase gen types typescript --linked > src/types/database.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type Timestamps = { created_at: string; updated_at: string };
type Owned = { user_id: string };

export type ProfileRow = { id: string; display_name: string | null } & Timestamps;
export type PipelineStageRow = Owned & Timestamps & {
  id: string; name: string; slug: string; system_key: string | null; color_key: string;
  position: number; is_closed: boolean; is_visible: boolean;
};
export type ApplicationRow = Owned & Timestamps & {
  id: string; stage_id: string; company: string; position: string; job_url: string | null;
  location: string | null; work_arrangement: string | null; employment_type: string | null;
  source: string | null; applied_at: string | null; salary_min: number | null;
  salary_max: number | null; currency: string | null; job_description: string | null;
  notes: string | null; sort_order: number; closed_at: string | null; archived_at: string | null;
};
export type ApplicationHistoryRow = Owned & {
  id: string; application_id: string; event_type: string; from_stage_id: string | null;
  to_stage_id: string | null; metadata: Json; occurred_at: string; created_at: string;
};
export type RecruitmentEventRow = Owned & Timestamps & {
  id: string; application_id: string; category: string; subtype: string | null; title: string;
  scheduled_at: string | null; deadline_at: string | null; location: string | null;
  url: string | null; notes: string | null; status: string; completed_at: string | null;
};
export type ApplicationOfferRow = Owned & Timestamps & {
  id: string; application_id: string; salary: number | null; currency: string | null;
  benefits: string | null; start_date: string | null; offer_deadline: string | null; notes: string | null;
};
export type ApplicationOutcomeRow = Owned & {
  id: string; application_id: string; outcome_key: string; from_stage_id: string | null;
  outcome_stage_id: string; reason_code: string | null; notes: string | null;
  occurred_at: string; reopened_at: string | null; created_at: string;
};
export type UserPreferencesRow = Owned & Timestamps & {
  id: string; currency: string; date_format: string; timezone: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, { id: string; display_name?: string | null }>;
      pipeline_stages: Table<PipelineStageRow, Omit<PipelineStageRow, "id" | keyof Timestamps> & Partial<Pick<PipelineStageRow, "id">>>;
      applications: Table<ApplicationRow, Omit<ApplicationRow, "id" | keyof Timestamps> & Partial<Pick<ApplicationRow, "id" | "closed_at" | "archived_at">>, Partial<Omit<ApplicationRow, "id" | "user_id" | "created_at">>>;
      application_history: Table<ApplicationHistoryRow, Omit<ApplicationHistoryRow, "id" | "created_at"> & Partial<Pick<ApplicationHistoryRow, "id">>>;
      recruitment_events: Table<RecruitmentEventRow, Omit<RecruitmentEventRow, "id" | keyof Timestamps> & Partial<Pick<RecruitmentEventRow, "id" | "subtype" | "scheduled_at" | "deadline_at" | "location" | "url" | "notes" | "completed_at">>, Partial<Omit<RecruitmentEventRow, "id" | "user_id" | "created_at">>>;
      application_offers: Table<ApplicationOfferRow, Omit<ApplicationOfferRow, "id" | keyof Timestamps> & Partial<Pick<ApplicationOfferRow, "id">>, Partial<Omit<ApplicationOfferRow, "id" | "user_id" | "application_id" | "created_at">>>;
      application_outcomes: Table<ApplicationOutcomeRow, Omit<ApplicationOutcomeRow, "id" | "created_at"> & Partial<Pick<ApplicationOutcomeRow, "id" | "reopened_at">>>;
      user_preferences: Table<UserPreferencesRow, Omit<UserPreferencesRow, "id" | keyof Timestamps> & Partial<Pick<UserPreferencesRow, "id">>, Partial<Omit<UserPreferencesRow, "id" | "user_id" | "created_at">>>;
    };
    Views: Record<never, never>;
    Functions: {
      create_application: { Args: { p_company: string; p_position: string; p_stage_id: string; p_job_url?: string | null; p_location?: string | null; p_work_arrangement?: string | null; p_employment_type?: string | null; p_source?: string | null; p_applied_at?: string | null; p_salary_min?: number | null; p_salary_max?: number | null; p_currency?: string | null; p_job_description?: string | null; p_notes?: string | null }; Returns: ApplicationRow };
      move_application: { Args: { p_application_id: string; p_destination_stage_id: string; p_before_application_id: string | null; p_after_application_id: string | null }; Returns: ApplicationRow };
      close_application: { Args: { p_application_id: string; p_outcome_stage_id: string; p_reason_code: string | null; p_notes: string | null }; Returns: ApplicationRow };
      reopen_application: { Args: { p_application_id: string; p_destination_stage_id: string }; Returns: ApplicationRow };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
