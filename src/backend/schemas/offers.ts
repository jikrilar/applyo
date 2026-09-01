import { z } from "zod";

export const offerSchema = z.object({
  applicationId: z.uuid(),
  salary: z.preprocess(
    (value) => (value === "" || value == null ? null : value),
    z.coerce.number().nonnegative().finite().nullable(),
  ),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .length(3)
    .nullish()
    .transform((v) => v || null),
  benefits: z
    .string()
    .trim()
    .max(10_000)
    .nullish()
    .transform((v) => v || null),
  startDate: z
    .union([z.iso.date(), z.literal(""), z.null()])
    .optional()
    .transform((v) => v || null),
  offerDeadline: z
    .union([z.iso.datetime({ offset: true }), z.literal(""), z.null()])
    .optional()
    .transform((v) => v || null),
  notes: z
    .string()
    .trim()
    .max(10_000)
    .nullish()
    .transform((v) => v || null),
});
export type OfferInput = z.infer<typeof offerSchema>;
