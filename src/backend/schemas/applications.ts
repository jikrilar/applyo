import { z } from "zod";
import { CLOSED_STAGE_KEYS } from "../domain/constants";

const nullableText = (max: number) => z.string().trim().max(max).nullish().transform((value) => value || null);
const httpUrl = z.url().refine((value) => ["http:", "https:"].includes(new URL(value).protocol), "URL harus menggunakan HTTP atau HTTPS");
const nullableUrl = z.union([httpUrl, z.literal(""), z.null()]).optional().transform((value) => value || null);
const nullableDate = z.union([z.iso.date(), z.literal(""), z.null()]).optional().transform((value) => value || null);
const money = z.coerce.number().nonnegative().finite().nullish().transform((value) => value ?? null);

const applicationFields = z.object({
  company: z.string().trim().min(1).max(200), position: z.string().trim().min(1).max(200),
  jobUrl: nullableUrl, location: nullableText(200), workArrangement: z.enum(["onsite", "hybrid", "remote"]).nullish().transform((value) => value ?? null),
  employmentType: z.enum(["full_time", "part_time", "contract", "temporary", "internship", "freelance", "other"]).nullish().transform((value) => value ?? null), source: nullableText(100), appliedAt: nullableDate,
  salaryMin: money, salaryMax: money, currency: z.string().trim().toUpperCase().length(3).nullish().transform((v) => v || null),
  jobDescription: nullableText(50_000), notes: nullableText(20_000),
});

function salaryRange(data: { salaryMin?: number | null; salaryMax?: number | null }) {
  return data.salaryMin == null || data.salaryMax == null || data.salaryMax >= data.salaryMin;
}

export const createApplicationSchema = applicationFields.extend({ stageId: z.uuid() }).refine(salaryRange, { path: ["salaryMax"], message: "Gaji maksimum tidak boleh lebih kecil dari gaji minimum" });
export const updateApplicationSchema = applicationFields.partial().extend({ applicationId: z.uuid() }).refine((value) => Object.keys(value).some((key) => key !== "applicationId"), { message: "Setidaknya satu perubahan diperlukan" }).refine(salaryRange, { path: ["salaryMax"], message: "Gaji maksimum tidak boleh lebih kecil dari gaji minimum" });
export const moveApplicationSchema = z.object({ applicationId: z.uuid(), destinationStageId: z.uuid(), beforeApplicationId: z.uuid().nullable().default(null), afterApplicationId: z.uuid().nullable().default(null) }).refine((v) => v.beforeApplicationId !== v.applicationId && v.afterApplicationId !== v.applicationId, { message: "Lamaran tidak dapat menjadi tetangganya sendiri" });
export const closeApplicationSchema = z.object({ applicationId: z.uuid(), outcomeStageId: z.uuid(), outcome: z.enum(CLOSED_STAGE_KEYS), reasonCode: nullableText(100), notes: nullableText(5_000) });
export const reopenApplicationSchema = z.object({ applicationId: z.uuid(), destinationStageId: z.uuid() });
export const archiveApplicationSchema = z.object({ applicationId: z.uuid(), archived: z.boolean() });
export const deleteApplicationSchema = z.object({ applicationId: z.uuid() });

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type MoveApplicationInput = z.infer<typeof moveApplicationSchema>;
export type CloseApplicationInput = z.infer<typeof closeApplicationSchema>;
