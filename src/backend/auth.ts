import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { BackendError } from "@/backend/errors";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type AuthContext = { client: SupabaseClient<Database>; user: User };
export async function requireAuth(providedClient?: SupabaseClient<Database>): Promise<AuthContext> {
  const client = providedClient ?? await createClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new BackendError("UNAUTHORIZED", "Silakan masuk untuk melanjutkan.", error);
  return { client, user: data.user };
}
