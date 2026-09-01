import "server-only";
import { requireAuth } from "@/backend/auth";
import { databaseError, validationError } from "@/backend/errors";
import { verifyOwnedApplication } from "@/backend/repositories/events";
import { offerSchema } from "@/backend/schemas/offers";

export async function upsertOffer(raw: unknown) { const parsed = offerSchema.safeParse(raw); if (!parsed.success) throw validationError(parsed.error); const input = parsed.data; const { client, user } = await requireAuth(); await verifyOwnedApplication(client, user.id, input.applicationId); const { data, error } = await client.from("application_offers").upsert({ user_id: user.id, application_id: input.applicationId, salary: input.salary, currency: input.currency, benefits: input.benefits, start_date: input.startDate, offer_deadline: input.offerDeadline, notes: input.notes }, { onConflict: "application_id" }).select().single(); if (error) throw databaseError("upsert_offer", error); return data; }
export async function deleteOffer(applicationId: string) { const parsed = offerSchema.shape.applicationId.safeParse(applicationId); if (!parsed.success) throw validationError(parsed.error); const { client, user } = await requireAuth(); const { error, count } = await client.from("application_offers").delete({ count: "exact" }).eq("application_id", parsed.data).eq("user_id", user.id); if (error) throw databaseError("delete_offer", error); if (!count) throw databaseError("delete_offer", { code: "PGRST116" }); return { applicationId: parsed.data }; }
