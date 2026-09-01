import "server-only";
import { z } from "zod";

const nonEmptyKey = (name: string) => z.string().trim().min(1, `${name} is required`);
const httpUrl = z.url().refine((value) => ["http:", "https:"].includes(new URL(value).protocol), "Supabase URL must use HTTP or HTTPS");
const serviceRoleSchema = nonEmptyKey("SUPABASE_SERVICE_ROLE_KEY");

export function getServerEnv() {
  const publicEnv = z.object({
    NEXT_PUBLIC_SUPABASE_URL: httpUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: nonEmptyKey("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  }).parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  return publicEnv;
}

export function getServiceRoleKey() {
  return serviceRoleSchema.parse(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
