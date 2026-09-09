import { z } from "zod";
import { ASSESSMENT_SUBTYPES, EVENT_CATEGORIES, EVENT_STATUSES, INTERVIEW_SUBTYPES } from "../domain/constants";

const emptyToNull = z.union([z.string(), z.null()]).optional().transform((value) => value === undefined ? undefined : value?.trim() || null);
const timestamp = z.union([z.iso.datetime({ offset: true }), z.literal(""), z.null()]).optional().transform((value) => value === undefined ? undefined : value || null);
const httpUrl = z.url().refine((value) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, "URL harus menggunakan HTTP atau HTTPS");
const optionalUrl = z.union([httpUrl, z.literal(""), z.null()]).optional().transform((value) => value === undefined ? undefined : value || null);

const eventFields = z.object({
  category: z.enum(EVENT_CATEGORIES),
  subtype: emptyToNull,
  title: z.string().trim().min(1).max(200),
  scheduledAt: timestamp,
  deadlineAt: timestamp,
  location: emptyToNull,
  url: optionalUrl,
  notes: emptyToNull,
  status: z.enum(EVENT_STATUSES),
  completedAt: timestamp,
});

function validateEventState(value: Partial<z.infer<typeof eventFields>>, context: z.RefinementCtx) {
  if (value.category === "interview" && value.subtype && !INTERVIEW_SUBTYPES.includes(value.subtype as never)) {
    context.addIssue({ code: "custom", path: ["subtype"], message: "Jenis wawancara tidak valid" });
  }
  if (value.category === "assessment" && value.subtype && !ASSESSMENT_SUBTYPES.includes(value.subtype as never)) {
    context.addIssue({ code: "custom", path: ["subtype"], message: "Jenis asesmen tidak valid" });
  }
  if (value.category && !["interview", "assessment"].includes(value.category) && value.subtype) {
    context.addIssue({ code: "custom", path: ["subtype"], message: "Kategori ini tidak menggunakan subjenis" });
  }
  if (value.status === "completed" && !value.completedAt) {
    context.addIssue({ code: "custom", path: ["completedAt"], message: "Waktu selesai diperlukan" });
  }
  if (value.status && value.status !== "completed" && value.completedAt) {
    context.addIssue({ code: "custom", path: ["completedAt"], message: "Waktu selesai hanya boleh diisi untuk agenda selesai" });
  }
}

export const createEventSchema = eventFields
  .extend({ applicationId: z.uuid(), status: z.enum(EVENT_STATUSES).default("scheduled") })
  .superRefine(validateEventState);

export const updateEventSchema = eventFields.partial()
  .extend({ eventId: z.uuid() })
  .refine((value) => Object.keys(value).some((key) => key !== "eventId"), "Setidaknya satu perubahan diperlukan")
  .superRefine(validateEventState);

export const completeEventSchema = z.object({
  eventId: z.uuid(),
  completed: z.boolean(),
  completedAt: z.iso.datetime({ offset: true }).optional(),
});
export const deleteEventSchema = z.object({ eventId: z.uuid() });
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
