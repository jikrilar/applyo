import { z } from "zod";

export const preferencesSchema = z.object({
  currency: z.string().trim().toUpperCase().length(3),
  dateFormat: z.enum(["DD MMM YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]),
  timezone: z.string().trim().min(1).refine((value) => {
    try { new Intl.DateTimeFormat("id-ID", { timeZone: value }); return true; } catch { return false; }
  }, "Zona waktu IANA tidak valid"),
});
export type PreferencesInput = z.infer<typeof preferencesSchema>;
