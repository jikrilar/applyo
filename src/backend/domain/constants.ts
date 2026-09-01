export const STAGE_SYSTEM_KEYS = ["wishlist", "applied", "screening", "interview", "assessment", "offer", "hired", "rejected", "withdrawn", "ghosted"] as const;
export type StageSystemKey = (typeof STAGE_SYSTEM_KEYS)[number];
export const CLOSED_STAGE_KEYS = ["hired", "rejected", "withdrawn", "ghosted"] as const;
export type OutcomeKey = (typeof CLOSED_STAGE_KEYS)[number];

export const STAGE_LABELS_ID: Record<StageSystemKey, string> = {
  wishlist: "Incaran", applied: "Dilamar", screening: "Seleksi Awal", interview: "Wawancara",
  assessment: "Asesmen", offer: "Tawaran", hired: "Diterima", rejected: "Ditolak",
  withdrawn: "Ditarik", ghosted: "Tanpa Kabar",
};

export const EVENT_CATEGORIES = ["interview", "assessment", "recruiter_contact", "follow_up", "offer", "other"] as const;
export const EVENT_STATUSES = ["scheduled", "completed", "cancelled"] as const;
export const INTERVIEW_SUBTYPES = ["hr", "user", "technical", "final", "other"] as const;
export const ASSESSMENT_SUBTYPES = ["technical_test", "coding_test", "psychological_test", "case_study", "take_home", "medical_checkup", "other"] as const;
export const HISTORY_EVENT_TYPES = ["application_created", "stage_changed", "application_closed", "application_reopened", "application_archived", "application_restored"] as const;
export const DEFAULT_FOLLOW_UP_DAYS = 7;
export const DEFAULT_CURRENCY = "IDR";
export const DEFAULT_DATE_FORMAT = "DD MMM YYYY";
export const DEFAULT_TIMEZONE = "Asia/Jakarta";

export const EVENT_CATEGORY_LABELS_ID: Record<(typeof EVENT_CATEGORIES)[number], string> = {
  interview: "Wawancara", assessment: "Asesmen", recruiter_contact: "Kontak perekrut",
  follow_up: "Tindak lanjut", offer: "Tawaran", other: "Lainnya",
};
