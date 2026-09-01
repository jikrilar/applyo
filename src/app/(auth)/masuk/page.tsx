import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Masuk | Applyo" };

export default function LoginPage() {
  return (
    <div className="auth-card">
      <div className="auth-heading">
        <span>Selamat datang kembali</span>
        <h1>Lanjutkan pencarian kerjamu.</h1>
        <p>Masuk untuk melihat lamaran dan langkah berikutnya.</p>
      </div>
      <AuthForm mode="login" />
    </div>
  );
}
