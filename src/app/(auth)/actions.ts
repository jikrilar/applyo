"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const email = z.email("Masukkan alamat email yang valid.").trim().toLowerCase();
const password = z.string().min(8, "Kata sandi harus berisi minimal 8 karakter.").max(128);
const loginSchema = z.object({ email, password });
const registerSchema = loginSchema.extend({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(120),
  confirmation: z.string(),
}).refine((value) => value.password === value.confirmation, {
  path: ["confirmation"],
  message: "Konfirmasi kata sandi belum sama.",
});

function validationState(error: z.ZodError): AuthActionState {
  return { status: "error", message: "Periksa kembali data yang kamu masukkan.", fieldErrors: z.flattenError(error).fieldErrors };
}

function authMessage(code?: string): string {
  if (code === "invalid_credentials") return "Email atau kata sandi tidak sesuai.";
  if (code === "email_not_confirmed") return "Konfirmasi email terlebih dahulu sebelum masuk.";
  if (code === "user_already_exists") return "Jika alamat email dapat digunakan, instruksi berikutnya akan dikirim.";
  if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit") return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  return "Autentikasi tidak dapat diselesaikan. Coba lagi.";
}

export async function loginAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return validationState(parsed.error);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { status: "error", message: authMessage(error.code) };
  redirect("/dashboard");
}

export async function registerAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({ name: formData.get("name"), email: formData.get("email"), password: formData.get("password"), confirmation: formData.get("confirmation") });
  if (!parsed.success) return validationState(parsed.error);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: parsed.data.name } },
  });
  if (error) return { status: "error", message: authMessage(error.code) };
  if (!data.session) return { status: "success", message: "Akun dibuat. Periksa email untuk mengonfirmasi pendaftaran." };
  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/masuk");
}
