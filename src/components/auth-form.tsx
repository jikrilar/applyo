"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { loginAction, registerAction, type AuthActionState } from "@/app/(auth)/actions";

const initialAuthState: AuthActionState = { status: "idle", message: "" };

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === "register";
  const [state, formAction, pending] = useActionState(isRegister ? registerAction : loginAction, initialAuthState);

  return (
    <form className="auth-form" action={formAction} noValidate>
      {isRegister && (
        <>
          <label className="field-group">
            <span>Nama</span>
            <span className="field-control">
              <UserRound aria-hidden="true" />
              <input name="name" type="text" autoComplete="name" placeholder="Nama lengkap" required />
            </span>
          </label>
          {state.fieldErrors?.name && <p className="field-error">{state.fieldErrors.name[0]}</p>}
        </>
      )}

      <label className="field-group">
        <span>Email</span>
        <span className="field-control">
          <Mail aria-hidden="true" />
          <input name="email" type="email" autoComplete="email" placeholder="nama@email.com" required />
        </span>
      </label>
      {state.fieldErrors?.email && <p className="field-error">{state.fieldErrors.email[0]}</p>}

      <label className="field-group">
        <span>Kata sandi</span>
        <span className="field-control">
          <LockKeyhole aria-hidden="true" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder="Minimal 8 karakter"
            required
          />
          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        </span>
      </label>
      {state.fieldErrors?.password && <p className="field-error">{state.fieldErrors.password[0]}</p>}

      {isRegister && (
        <>
          <label className="field-group">
            <span>Konfirmasi kata sandi</span>
            <span className="field-control">
              <LockKeyhole aria-hidden="true" />
              <input
                name="confirmation"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Ulangi kata sandi"
                required
              />
            </span>
          </label>
          {state.fieldErrors?.confirmation && <p className="field-error">{state.fieldErrors.confirmation[0]}</p>}
        </>
      )}

      {state.message && <p className={state.status === "success" ? "form-success" : "form-error"} role={state.status === "error" ? "alert" : "status"}>{state.message}</p>}

      <button className="button auth-submit" type="submit" disabled={pending}>
        {pending ? "Menyiapkan ruang kerja..." : isRegister ? "Buat akun" : "Masuk"}
        {!pending && <ArrowRight aria-hidden="true" />}
      </button>

      <p className="auth-switch">
        {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
        <Link href={isRegister ? "/masuk" : "/daftar"}>
          {isRegister ? "Masuk" : "Daftar gratis"}
        </Link>
      </p>
    </form>
  );
}
