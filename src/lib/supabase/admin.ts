import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getServerEnv, getServiceRoleKey } from "@/lib/env/server";
import type { Database } from "@/types/database";

const ADMIN_PURPOSES = ["delete-account"] as const;
export type AdminPurpose = (typeof ADMIN_PURPOSES)[number];

export function createAdminClient(purpose: AdminPurpose) {
  if (!ADMIN_PURPOSES.includes(purpose)) throw new Error("Admin client purpose is not allowed");
  const env = getServerEnv();
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, getServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
