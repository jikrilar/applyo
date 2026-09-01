import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Daftar | Applyo" };

export default function RegisterPage() {
  return (
    <div className="auth-card">
      <div className="auth-heading">
        <span>Mulai bersama Applyo</span>
        <h1>Buat pencarianmu lebih teratur.</h1>
        <p>Simpan semua lamaran dan jadwal dalam satu ruang kerja.</p>
      </div>
      <AuthForm mode="register" />
    </div>
  );
}
