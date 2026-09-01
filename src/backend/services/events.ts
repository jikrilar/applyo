import "server-only";
import { requireAuth } from "@/backend/auth";
import { validationError } from "@/backend/errors";
import { insertEvent, patchEvent, removeEvent, setEventComplete } from "@/backend/repositories/events";
import { completeEventSchema, createEventSchema, deleteEventSchema, updateEventSchema } from "@/backend/schemas/events";
import { toEventDTO } from "@/backend/dto";

function parse<T>(schema: { safeParse(value: unknown): { success: true; data: T } | { success: false; error: import("zod").ZodError<T> } }, raw: unknown) { const result = schema.safeParse(raw); if (!result.success) throw validationError(result.error); return result.data; }
export async function createEvent(raw: unknown) { const input = parse(createEventSchema, raw); const { client, user } = await requireAuth(); return toEventDTO(await insertEvent(client, user.id, input)); }
export async function updateEvent(raw: unknown) { const input = parse(updateEventSchema, raw); const { client, user } = await requireAuth(); return toEventDTO(await patchEvent(client, user.id, input)); }
export async function completeEvent(raw: unknown) { const input = parse(completeEventSchema, raw); const { client, user } = await requireAuth(); return toEventDTO(await setEventComplete(client, user.id, input.eventId, input.completed, input.completedAt)); }
export async function deleteEvent(raw: unknown) { const input = parse(deleteEventSchema, raw); const { client, user } = await requireAuth(); await removeEvent(client, user.id, input.eventId); return { eventId: input.eventId }; }
