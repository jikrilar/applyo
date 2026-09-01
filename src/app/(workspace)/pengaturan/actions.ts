"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toActionResult, type ActionResult } from "@/backend/errors";
import { deleteCurrentAccount, updateCurrentProfile } from "@/backend/services/account";
import { updatePreferences } from "@/backend/services/preferences";
import { updateStageVisibility } from "@/backend/services/stages";
import { createClient } from "@/lib/supabase/server";

async function result<T>(operation: () => Promise<T>): Promise<ActionResult<T>> { try { const data = await operation(); revalidatePath("/pengaturan"); return { success: true, data }; } catch (error) { return toActionResult<T>(error); } }
export async function updateProfileAction(input: unknown) { const response = await result(() => updateCurrentProfile(input)); if (response.success) revalidatePath("/", "layout"); return response; }
export async function updatePreferencesAction(input: unknown) { return result(() => updatePreferences(input)); }
export async function updateStageVisibilityAction(input: unknown) { const response = await result(() => updateStageVisibility(input)); if (response.success) revalidatePath("/aplikasi"); return response; }
export async function deleteAccountAction(input: unknown) { const response = await result(() => deleteCurrentAccount(input)); if (response.success) { const supabase = await createClient(); await supabase.auth.signOut({ scope: "local" }); redirect("/"); } return response; }
