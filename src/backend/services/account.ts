import "server-only";
import { requireAuth } from "@/backend/auth";
import { BackendError, databaseError, validationError } from "@/backend/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const deleteAccountSchema = z.object({ confirmation: z.literal("HAPUS AKUN") });
const RECENT_AUTH_WINDOW_MS = 10 * 60 * 1000;

export async function getCurrentAccount() { const { client, user } = await requireAuth(); const { data, error } = await client.from("profiles").select("display_name").eq("id", user.id).maybeSingle(); if (error) throw databaseError("get_profile", error); return { userId: user.id, displayName: data?.display_name ?? String(user.user_metadata.display_name ?? user.email?.split("@")[0] ?? "Pengguna Applyo"), email: user.email ?? "" }; }

export async function updateCurrentProfile(raw: unknown) { const parsed = z.object({ displayName: z.string().trim().min(1).max(120) }).safeParse(raw); if (!parsed.success) throw validationError(parsed.error); const { client, user } = await requireAuth(); const { data, error } = await client.from("profiles").update({ display_name: parsed.data.displayName }).eq("id", user.id).select("display_name").single(); if (error) throw databaseError("update_profile", error); return { displayName: data.display_name ?? parsed.data.displayName }; }

export async function deleteCurrentAccount(raw: unknown) {
  const parsed = deleteAccountSchema.safeParse(raw);
  if (!parsed.success) throw validationError(parsed.error);
  const { user } = await requireAuth();
  const lastSignIn = user.last_sign_in_at ? Date.parse(user.last_sign_in_at) : Number.NaN;
  if (!Number.isFinite(lastSignIn) || Date.now() - lastSignIn > RECENT_AUTH_WINDOW_MS) {
    throw new BackendError("FORBIDDEN", "Masuk kembali sebelum menghapus akun.");
  }
  const admin = createAdminClient("delete-account");
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw databaseError("delete_account", error);
  return { userId: user.id };
}
