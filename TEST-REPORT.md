# Applyo Pre-Deployment Test Report — Phase 1: Preflight Audit

> **Fase:** Phase 1 — Preflight Audit (AUDIT ONLY, tidak ada perbaikan source code)
> **Source of truth:** `TESTING.md`
> **Tanggal:** 2026-09-06 (UTC)
> **Tester:** OpenCode agent (Muse Spark)

## Summary

Environment: Local / Development (Windows, Node v24.15.0, npm 11.12.1)
Branch: `main`
Commit: `8d9e557` — "fix: memperbaiki tampilan popup datepicker yang terpotong"
Browser: N/A (tidak ada browser testing pada Phase 1, sesuai instruksi)

Passed: 7
Failed: 0
Blocked: 0
Skipped: 0

Critical: 0
High: 0
Medium: 0
Low: 0

## Release Decision (Phase 1 — Preflight Gate)

**PREFLIGHT GATE: PASS — aman lanjut ke Phase 2: Functional Testing.**

Required Preflight Gate (`TESTING.md` §53):

```text
[x] Lint PASS
[x] Typecheck PASS
[x] Critical tests PASS
[x] Production build PASS
```

Belum diputuskan READY FOR DEPLOYMENT — itu membutuhkan Phase 2–5
(Functional, UI, Security/RLS, Performance) + regression + final smoke.

## Preflight Summary

| Test ID | Nama              | Status | Command              |
|---------|-------------------|--------|----------------------|
| PF-001  | Git Working Tree  | PASS   | `git status`         |
| PF-002  | Dependency Integrity | PASS | `npm ci --dry-run`, `npm ls` |
| PF-003  | Lint              | PASS   | `npm run lint`       |
| PF-004  | Typecheck         | PASS   | `npm run typecheck`  |
| PF-005  | Unit Tests        | PASS   | `npm test`           |
| PF-006  | Integration Tests | PASS   | `npm run test:backend`, `npm run db:test` |
| PF-007  | Production Build  | PASS   | `npm run build`      |

## Detail Hasil

### PF-001 — Git Working Tree

Status: PASS (informasional — tujuan check ini memahami modifikasi eksisting)

Expected: working tree teridentifikasi, tidak ada uncommitted work yang tertimpa audit.
Actual: `git status` berjalan. Ditemukan uncommitted changes **milik developer**,
tidak diubah/diutak-atik selama audit:

- Deleted (staged sebagai penghapusan path lama): `docs/ARCHITECTURE.md`,
  `docs/DESIGN-SYSTEM.md`, `docs/PRD.md`, `docs/ROADMAP.md`, `docs/TASKS.md`
- Untracked (pengganti di root): `ARCHITECTURE.md`, `DESIGN-SYSTEM.md`, `PRD.md`,
  `ROADMAP.md`, `TASKS.md`, `TESTING.md` (tampaknya docs dipindah `docs/` → root, belum di-commit)
- Modified: `src/app/(workspace)/aplikasi/page.tsx`, `src/app/globals.css`,
  `src/components/application-detail/application-form.tsx`,
  `src/components/application-list/application-list.tsx`,
  `src/components/application-workspace.tsx`, `src/components/settings-form.tsx`
- Untracked: `src/components/application-detail/application-form.test.tsx`,
  `src/components/settings-form.test.tsx`

Notes: tidak ada `git reset`/`clean`/commit yang dijalankan. Satu-satunya file baru
dari audit ini adalah `TEST-REPORT.md` (untracked).

### PF-002 — Dependency Integrity

Status: PASS
Severity: N/A

Expected: dependency resolution dan lockfile konsisten.
Actual:

- Package manager: **npm** (`package-lock.json` ada, `node_modules/` terinstal).
- `npm ci --dry-run --no-audit --no-fund` → exit 0.
- `npm ls` → exit 0, tidak ada missing/invalid. Satu-satunya catatan: beberapa
  paket wasm platform (`@emnapi/*`, `@img/sharp-wasm32`, `@napi-rs/wasm-runtime`,
  `@tybys/wasm-util`) terdaftar sebagai `extraneous` — ini transitive optional deps
  normal dari Next.js/sharp di Windows, tidak berdampak (informational, bukan blocker).
- Full `npm ci` (reinstall penuh) sengaja tidak dijalankan agar tidak memutasi
  environment lokal; dry-run + `ls` sudah cukup sebagai sanity check fase audit.

Konfigurasi relevan terverifikasi ada: `tsconfig.json` (strict, `noEmit`),
`vitest.config.mjs` (include `src/**/*.test.{ts,tsx}`), `.env.example` +
`.env.local` (ketiga key sesuai contoh: `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — nilai tidak
dibaca/dicetak), `supabase/` (1 migration + `tests/backend_lifecycle.sql` + `seed.sql`).

### PF-003 — Lint

Status: PASS
Severity: N/A

Expected: no lint errors (`TESTING.md` §12).
Actual: `npm run lint` (`eslint .`) → exit 0, tidak ada error/warning yang dilaporkan.

### PF-004 — Typecheck

Status: PASS
Severity: N/A

Expected: 0 TypeScript errors.
Actual: `npm run typecheck` (`tsc --noEmit`) → exit 0, tidak ada error.

### PF-005 — Unit Tests

Status: PASS
Severity: N/A

Expected: semua critical logic tests pass.
Actual: `npm test` (`vitest run`) → **10 test files passed, 46 tests passed, 0 failed**
(durasi ~65 dtk). File yang ter-cover termasuk `calculations`, `schemas`,
`errors`, `logging`, `dates`, `env/server`, `date-picker`, `primitives`,
`application-form`, `settings-form`. Tidak ada test baru yang dibuat pada fase ini.

### PF-006 — Integration Tests

Status: PASS
Severity: N/A

Expected: semua integration/database tests yang tersedia pass.
Actual:

- `npm run test:backend` (`vitest run src/backend`) → **4 files, 33 tests, all passed**.
- `npm run db:test` (`supabase test db`, pgTAP `supabase/tests/backend_lifecycle.sql`)
  terhadap **local Supabase yang sudah running** → **21 tests, Result: PASS**.
  (CLI `supabase` tidak ada di PATH, dijalankan via `npx supabase`; tidak ada
  service/container baru yang di-start oleh audit.)

### PF-007 — Production Build

Status: PASS
Severity: N/A (kegagalan akan menjadi Critical release blocker)

Expected: build succeeds.
Actual: `npm run build` (`next build`, Next.js 16.3.3 Turbopack) → **exit 0,
"Compiled successfully"**, TypeScript pass, 11 routes ter-generate
(`/`, `/daftar`, `/masuk`, `/dashboard`, `/aplikasi`, `/aplikasi/[id]`,
`/analitik`, `/kalender`, `/pengaturan`, `/auth/callback`, `/_not-found`).
Tidak ada build warning yang dilaporkan.

## Failed Tests

Nihil — tidak ada failure pada Phase 1.

## Passed Areas

- Git working tree review
- Dependency/configuration sanity
- Lint
- Typecheck
- Unit tests (46/46)
- Backend integration tests (33/33) + database pgTAP tests (21/21)
- Production build

## Security Notes

Tidak ada security testing pada Phase 1 (jadwal Phase 4: Security/RLS Audit).
Satu observasi non-blocking: `.env.local` ada dan key sesuai `.env.example`
(nilai tidak diinspeksi). Verifikasi `SEC-011` (service role exposure) dilakukan
pada fase browser/security berikutnya.

## Performance Notes

Tidak ada performance testing pada Phase 1. Build production selesai dalam waktu
wajar (kompilasi ~31 dtk). Unit test suite penuh ~65 dtk — dapat diterima.

## Remaining Blockers

Nihil untuk Preflight Gate. Catatan sebelum release (bukan blocker Phase 2):

1. Working tree kotor (docs dipindah `docs/` → root + modifikasi src belum di-commit).
   Disarankan commit/stash sebelum Phase 2 agar baseline fungsional jelas.
2. Fase berikutnya masih terbuka penuh: Functional, UI/Visual, Responsive,
   Accessibility, Security/RLS, Performance, Regression, Final Smoke
   (`TESTING.md` §13–§45).

## Files Created / Changed by This Audit

- Created: `TEST-REPORT.md` (file ini)
- Changed: nihil — tidak ada source code aplikasi yang dimodifikasi manual.
  Side effect otomatis dari `npm run build` yang diwajibkan preflight:
  `next-env.d.ts` (generated path `.next/dev/types` → `.next/types`) dan
  `tsconfig.tsbuildinfo` (build cache). Keduanya file generated Toolchain,
  bukan edit manual.
