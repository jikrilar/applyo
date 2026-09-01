import { z } from "zod";
import { CLOSED_STAGE_KEYS } from "../domain/constants";

export const searchFiltersSchema = z
  .object({
    query: z.string().trim().max(200).optional(),
    stageId: z.union([z.uuid(), z.array(z.uuid()).min(1)]).optional(),
    location: z
      .union([z.string().trim().max(200), z.array(z.string().trim().max(200)).min(1)])
      .optional(),
    outcome: z.enum(CLOSED_STAGE_KEYS).optional(),
    source: z.string().trim().max(100).optional(),
    dateFrom: z.iso.date().optional(),
    dateTo: z.iso.date().optional(),
    archived: z.boolean().default(false),
    sort: z
      .enum(["applied_desc", "applied_asc", "upcoming_asc", "upcoming_desc"])
      .default("applied_desc"),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .refine((v) => !v.dateFrom || !v.dateTo || v.dateFrom <= v.dateTo, {
    path: ["dateTo"],
    message: "Tanggal akhir harus setelah tanggal awal",
  });
export const calendarRangeSchema = z
  .object({ start: z.iso.datetime({ offset: true }), end: z.iso.datetime({ offset: true }) })
  .refine((v) => v.start < v.end, { path: ["end"], message: "Akhir rentang harus setelah awal" });
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
