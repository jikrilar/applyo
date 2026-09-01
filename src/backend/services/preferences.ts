import "server-only";
import { requireAuth } from "@/backend/auth";
import { databaseError, validationError } from "@/backend/errors";
import { DEFAULT_CURRENCY, DEFAULT_DATE_FORMAT, DEFAULT_TIMEZONE } from "@/backend/domain/constants";
import { preferencesSchema } from "@/backend/schemas/preferences";

export async function getPreferences() { const { client, user } = await requireAuth(); const { data, error } = await client.from("user_preferences").select("currency,date_format,timezone").eq("user_id", user.id).maybeSingle(); if (error) throw databaseError("get_preferences", error); const value = data ?? { currency: DEFAULT_CURRENCY, date_format: DEFAULT_DATE_FORMAT, timezone: DEFAULT_TIMEZONE }; return { currency: value.currency, dateFormat: value.date_format, timezone: value.timezone }; }
export async function updatePreferences(raw: unknown) { const parsed = preferencesSchema.safeParse(raw); if (!parsed.success) throw validationError(parsed.error); const { client, user } = await requireAuth(); const { data, error } = await client.from("user_preferences").update({ currency: parsed.data.currency, date_format: parsed.data.dateFormat, timezone: parsed.data.timezone }).eq("user_id", user.id).select("currency,date_format,timezone").single(); if (error) throw databaseError("update_preferences", error); return data; }
