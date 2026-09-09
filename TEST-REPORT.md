# Applyo Pre-Deployment Test Report — Phase 1 + Phase 2 + Phase 2B + UI Audit + Performance Audit

> **Source of truth:** `TESTING.md`
> **Tanggal Phase 1:** 2026-09-06 (UTC)
> **Tanggal Phase 2:** 2026-09-06 (UTC)
> **Tanggal Phase 2B:** 2026-09-07 (UTC)
> **Tanggal UI / Visual / Responsive Audit:** 2026-09-08 (UTC)
> **Tanggal Performance Audit:** 2026-09-09 (UTC)
> **Tester:** OpenCode agent (Muse Spark)

## Summary

Environment: Local / Development (Windows, Node v24.15.0, npm 11.12.1)
Branch: `main`
Commit: `38bd638` — "chore: checkpoint before pre-deployment testing"
Browser: Chrome (headed, Playwright MCP, satu session, viewport default desktop)

Phase 1 — Preflight: 7 passed, 0 failed, 0 blocked, 0 skipped.
Phase 2 — Core Functional: 40 passed, 3 failed, 0 blocked, 3 skipped.
Phase 2B — Supporting Functional: 27 passed, 5 failed, 1 blocked, 1 skipped.
UI / Visual / Responsive Audit: 21 areas PASS, 1 issue (UI-001, Medium) → FIXED pending regression.
Accessibility Audit: 10 areas PASS, 5 issues (Medium 2, Low 3) → 5 FIXED pending regression.
Performance Audit final: 13 PASS, 0 FAIL, 0 BLOCKED, 1 SKIPPED.

Critical: 0 (F-02 FIXED)
High: 1 (F-01 remaining; F-06 FIXED)
Medium: 2 (F-03, F-04; UI-001, PERF-ISSUE-001, PERF-ISSUE-003, dan PERF-ISSUE-004 FIXED)
Low: 1 (F-05; A11Y dan PERF-ISSUE-002 FIXED)

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

## Files Created / Changed by Audits (Phase 1 + Phase 2)

- Created (Phase 1): `TEST-REPORT.md` (file ini)
- Changed (Phase 1): nihil — tidak ada source code aplikasi yang dimodifikasi manual.
  Side effect otomatis dari `npm run build` yang diwajibkan preflight:
  `next-env.d.ts` (generated path `.next/dev/types` → `.next/types`) dan
  `tsconfig.tsbuildinfo` (build cache). Keduanya file generated Toolchain,
  bukan edit manual.
- Updated (Phase 2): `TEST-REPORT.md` (section Phase 2 di bawah).
- Test data Phase 2 (dev DB lokal saja, bukan source): user
  `qa-phase2@applyo.test` + 3 aplikasi tersisa (1 Diterima, 1 Ditolak,
  1 Tanpa Kabar; 1 disposable Ditarik telah dihapus via APP-009).
  Tidak ada source code yang diubah pada Phase 2.

---

# Phase 2 — Core Functional Audit

> **Mode:** AUDIT ONLY. Tidak ada perbaikan/refactor source code.
> Dev server yang sudah berjalan dipakai (`http://localhost:3000`, tidak start baru).
> Test account khusus: `qa-phase2@applyo.test` (bukan data pribadi).
> Satu browser session Chrome headed; tidak ada screenshot loop
> (tidak ada screenshot yang diambil — semua evidence berupa teks/network).

## Phase 2 Summary

PASS: 40
FAIL: 3
BLOCKED: 0
SKIPPED: 3

Critical: 1
High: 2
Medium: 1
Low: 0

## Hasil per Test

| Test ID   | Status  | Catatan ringkas |
|-----------|---------|-----------------|
| AUTH-001  | PASS    | Register sukses, redirect `/dashboard` (dengan temuan DASH-001 di bawah) |
| AUTH-005  | PASS    | Login valid → `/dashboard` |
| AUTH-006  | PASS    | Error netral "Email atau kata sandi tidak sesuai.", tetap di `/masuk` |
| AUTH-007  | PASS    | `/dashboard`, `/aplikasi`, `/kalender`, `/analitik` → redirect `/masuk?next=...` saat logged-out |
| AUTH-008  | PASS    | Logout → `/masuk` |
| AUTH-009  | PASS    | Session bertahan setelah reload |
| APP-001   | PASS    | Create minimum (Company/Position/Stage) muncul di Incaran |
| APP-002   | PASS    | Full optional (URL, lokasi, sumber, deskripsi, gaji 8–12jt, catatan) persist, terverifikasi di detail |
| APP-003   | PASS    | Submit kosong ditolak, tidak ada kartu tercipta |
| APP-004   | PASS    | URL invalid ditolak; URL valid diterima (APP-002) |
| APP-005   | PASS    | Gaji max<min ditolak dengan pesan "Gaji maksimum tidak boleh lebih kecil dari gaji minimum." |
| APP-006   | PASS    | Edit posisi/sumber/gaji persist setelah reload |
| APP-007   | PASS    | Archive: hilang dari board, data utuh, history "Lamaran diarsipkan" |
| APP-008   | PASS    | Restore: kembali ke board + history "Lamaran dipulihkan" |
| APP-009   | PASS    | Konfirmasi "Hapus lamaran ini?" → hapus permanen → board + detail bersih |
| DETAIL-001| PASS    | Semua metadata/stage/agenda/timeline/ringkasan benar |
| DETAIL-002| PASS    | UUID tak-ada + ID malformed → "Lamaran tidak ditemukan." yang aman |
| KAN-001   | PASS    | 6 kolom tahap benar, count benar, tanpa duplikat |
| KAN-002   | PASS    | Reorder satu kolom persist setelah reload, tanpa stage-change history |
| KAN-003   | PASS    | Incaran→Dilamar pindah + persist + history "Incaran → Dilamar" |
| KAN-004   | PASS    | Journey Incaran→Dilamar→Seleksi Awal→Wawancara→Asesmen→Tawaran, history berurutan tanpa duplikat |
| KAN-005   | SKIPPED | Di luar minimum scope Phase 2 |
| KAN-006   | SKIPPED | Di luar minimum scope Phase 2 (satu drop luput tercatat sebagai no-op bersih, tanpa rollback/error) |
| KAN-007   | PASS    | Semua perubahan stage/ordering persist di setiap reload |
| KAN-008   | SKIPPED | Tidak ada menu "Ubah Tahap"/non-drag stage-change di menu kartu maupun halaman detail — perubahan tahap aktif hanya via drag (catatan untuk A11Y-004 Phase 3) |
| CTX-001   | PASS    | Prompt "Tambahkan tanggal melamar?" muncul; Lewati tidak membatalkan move |
| CTX-002   | PASS    | Prompt "Tambahkan detail wawancara?" muncul; dapat dilewati |
| CTX-003   | PASS    | Prompt "Tambahkan detail asesmen?" muncul; dapat dilewati |
| CTX-004   | PASS    | Prompt "Lengkapi detail tawaran?" muncul; dapat dilewati |
| EVENT-001 | PASS    | Interview tersimpan; muncul di detail + kalender (10 Sep, 09.00) + indikator di kartu board |
| EVENT-002 | PASS    | HR + Teknis coexist |
| EVENT-003 | PASS    | Assessment "Tes Coding" tersimpan dengan tenggat |
| EVENT-004 | FAIL    | Lihat temuan F-02 (High) |
| EVENT-005 | PASS    | "Tandai selesai" → status Selesai + "Batalkan selesai" tersedia; timeline terupdate |
| EVENT-006 | PASS    | Hapus event: hilang dari agenda/timeline/kalender, tanpa stale state |
| FOLLOW-001| PASS    | "Menunggu: 0 hari" (non-negatif, sensibel) |
| FOLLOW-003| PASS    | "Catat tindak lanjut" mencatat event + timeline |
| FOLLOW-004| PASS    | Tidak ada auto-Ghosted; Ghosted hanya via aksi eksplisit (OUT-004) |
| OFFER-001 | PASS    | Gaji/benefit/catatan tersimpan |
| OFFER-002 | PASS    | Edit gaji persist setelah reload |
| OUT-001   | PASS    | Hired: hilang dari board, badge + timeline + outcome benar |
| OUT-002   | PASS    | Rejected: bahasa netral, tanpa copy menyalahkan |
| OUT-003   | FAIL    | Lihat temuan F-03 (Medium) — PASS tanpa alasan, FAIL dengan alasan |
| OUT-004   | PASS    | Ghosted via aksi eksplisit; hilang dari board aktif, tampil di list |
| OUT-005   | PASS    | Reopen: kembali ke tahap aktif, closed-state bersih, history lama + "Lamaran dibuka kembali" tercatat |
| DASH-001  | FAIL    | Lihat temuan F-01 (High). PASS setelah re-login (count 3 total / 0 aktif / 1-1-1 sesuai DB) |
| Bonus     | PASS    | List view menampilkan 3 closed apps dengan tahap benar + sort + pagination |

## Failed Tests (detail)

### F-01 — DASH-001 Dashboard crash tepat setelah registrasi

Status: STILL FAILING (root cause di level kode aplikasi TIDAK terbukti;
tidak ada perubahan kode pada siklus ini)
Severity: High (blocker dipertahankan)
URL: `/dashboard` (sesi langsung setelah `/daftar`)

Expected: user baru yang baru register langsung melihat dasbor kosong yang valid.
Actual: halaman menampilkan error boundary "Applyo tidak dapat memuat halaman ini."
dengan console error `BackendError: Operasi get_preferences tidak dapat diselesaikan`
(di `DashboardPage` → `getPreferences`). Terjadi 2/2 (load + 1x "Coba lagi").

Isolasi yang dilakukan:

- Trigger DB `on_auth_user_created` berjalan: user baru memiliki 1 profile,
  1 preferences, 10 stages (cek langsung di DB lokal).
- Query REST langsung sebagai user baru ke `user_preferences` + keenam tabel
  `ownedRows()` (`select=*`) semuanya OK (1 baris preferensi terbaca, RLS lolos).
- `/aplikasi` dan `/pengaturan` (yang juga memanggil `getPreferences` via
  `Promise.all` dengan 2–3 client server) normal-normal saja pada sesi yang sama.
- Setelah logout + login ulang (sesi password-grant baru), `/dashboard`
  render sempurna, termasuk setelah reload dan setelah data terisi
  (3 total / 0 aktif / 1 wawancara / 1 asesmen / 1 tawaran — sesuai DB).

Reproduction steps:

1. Buka `/daftar`, isi Nama/Email/Kata sandi + konfirmasi valid, "Buat akun".
2. Redirect ke `/dashboard` → error boundary (bukan dasbor).

Notes: tidak ada console error lain; tidak ada 4xx/5xx jaringan yang relevan.
Kemungkinan root cause: perbedaan state sesi/cookie yang dibuat oleh `signUp`
(Server Action) vs `signInWithPassword` pada path render dashboard
(`Promise.all([getDashboardSummary(), getPreferences()])`).

Recommended next action: periksa server log untuk `cause` asli PostgREST pada
render dashboard pasca-signup; bandingkan cookie/token sesi signup vs login;
pertimbangkan tidak me-redirect ke `/dashboard` sebelum sesi stabil, atau
pastikan `getPreferences` tahan terhadap kondisi tersebut.

#### Investigasi fix-cycle F-01 (2026-09-07) — TIDAK ada perubahan kode

Lifecycle yang ditelusuri: `registerAction` (signUp → cookies → redirect
`/dashboard`) → `proxy.ts`/`updateSession` (`getClaims`, redirect guard) →
`DashboardPage` (`Promise.all([getDashboardSummary(), getPreferences()])` →
`requireAuth` → `createServerClient` + `auth.getUser()` + select RLS).
Jalur ini textbook-correct: tidak ada shared state antar dua client server,
tidak ada dependency yang belum terpenuhi (trigger DB transaksional dengan
signup), tidak ada cache (rute dinamis via `cookies()`).

Hipotesis yang diuji dan hasilnya:

- A (cookie/sesi belum siap): GUGUR — halaman lain (`/aplikasi`,
  `/pengaturan`, termasuk pola 2–3 client konkuren yang sama) normal pada
  sesi yang sama persis.
- B (fetch sebelum auth siap): GUGUR — alasan yang sama; `requireAuth`
  sukses (errornya DATABASE pada select, bukan UNAUTHORIZED).
- C (trigger belum commit): GUGUR — trigger transaksional; data (1 profile,
  1 preferences, 10 stages) terverifikasi ada saat gagal.
- D (race antar query konkuren): GUGUR — `/pengaturan` (3 client konkuren)
  dan `/analitik` (`ownedRows()` yang identik, 6× `select(*)`) tidak pernah
  gagal pada sesi yang sama.
- E (auth state server vs client berbeda): GUGUR — dashboard murni Server
  Component, satu state.
- F (cache basi): GUGUR — rute dinamis.
- I (dependency tersembunyi): tidak ditemukan di kode.

Reproduksi siklus ini: 6 clean signup dev (R1–R6; R4 di bawah load CPU
vitest; R6 tepat setelah restart dev server/cold compile) + 2 signup
production-build lokal (`next start`, tanpa Turbopack) + burst 4 tab
paralel + ±15 revisit — HASIL: 8/8 PASS, 0 reproduksi. Instrumentasi
sementara (`console.error` cause di `databaseError`) tidak pernah terpicu
(0 hits) dan sudah di-revert penuh (diff kosong, `tsc` + `eslint` PASS).

Kesimpulan evidence-backed: ke-4 kegagalan historis (query gagal
bergantian `get_preferences`/`read_domain_data`, pulih sendiri saat
revisit, query identik selalu lolos via REST/supabase-js/halaman lain,
tanpa 4xx/5xx) konsisten dengan **kegagalan fetch transient di level
infrastruktur dev lokal** (jaringan Docker Desktop / cold server), BUKAN
bug logika aplikasi. Tidak ada root cause level kode yang terbukti,
sehingga sesuai aturan tidak ada fix (dilarang: sleep/retry buta,
melemahkan RLS/auth, menelan error).

Rekomendasi: (1) verifikasi ulang di environment production-like/cloud
sebelum release; (2) jika pernah tereproduksi di luar dev, tangkap `cause`
mentah saat itu; (3) pertimbangkan ketahanan baca idempoten dashboard
HANYA bila bukti baru menuntutnya. Blocker F-01 dipertahankan terbuka
sampai verifikasi tersebut — status STILL FAILING.

### F-02 — EVENT-004 Dialog "Edit agenda" merusak zona waktu (kegagalan + korupsi data)

Status: FIXED (confirmed by full regression 2026-09-08)
Severity: Critical (saat ditemukan; fix terverifikasi targeted)
URL: `/aplikasi/[id]` (dialog "Edit agenda")

Expected: edit judul/event tidak mengubah waktu yang tersimpan (zona Asia/Jakarta).
Actual (dua manifestasi, terverifikasi):

1. Assessment ("Tes Coding", tenggat 15 Sep 09.00 WIB): dialog menampilkan
   "15 Sep 2026, 02.00" (waktu UTC, bukan WIB). Simpan gagal 2/2 dengan pesan
   generik "Terjadi kesalahan. Silakan coba lagi."; network response:
   `{"success":false,"error":{"code":"UNEXPECTED",...}}`. Request mengirim
   `deadlineAt: "2026-09-14T19:00:00.000Z"` — mundur 7 jam dari nilai asli
   (`2026-09-15T02:00:00Z`).
2. Interview ("Wawancara HR", 10 Sep 09.00 WIB): dialog menampilkan
   "10 Sep 2026, 02.00". Simpan judul saja BERHASIL tetapi waktu ikut berubah
   menjadi "10 Sep 2026, 02.00" — bukti korupsi senyap 7 jam pada jadwal
   wawancara nyata.

Reproduction steps:

1. Buat interview/assessment dengan waktu 09.00 (WIB).
2. Buka "Edit [event]" → perhatikan tombol waktu menampilkan 02.00.
3. Ubah judul saja → Simpan.
4. Interview: waktu bergeser ke 02.00. Assessment: save gagal total.

Notes: dialog create ("Tambah agenda") menangani waktu dengan benar (09.00
tersimpan sebagai 02.00 UTC dan tampil benar di list/kalender) — bug hanya pada
dialog edit (format UTC lalu diinterpretasi ulang sebagai WIB).

Recommended next action: perbaiki round-trip datetime dialog edit agar selalu
format/parse dalam timezone preferensi user; selidiki crash UNEXPECTED pada
update assessment; tambah regression test edit-tanpa-perubahan untuk interview
dan assessment.

#### Fix record (2026-09-07) — STATUS: FIXED, pending full regression

Root cause (terverifikasi, dua mekanisme independen):

1. Round-trip datetime salah (korupsi −7 jam): dialog edit mengisi
   `ThemedDatePicker` dengan `storedUtcIso.slice(0, 16)` = dinding-jam UTC
   (02.00), lalu saat simpan `new Date(wall).toISOString()` menafsirkan
   dinding-jam itu dalam TZ browser (bukan TZ preferensi aplikasi). Jalur
   create sudah benar (`zonedLocalToUtc` + TZ preferensi); hanya jalur edit
   yang salah di kedua ujungnya.
2. Crash UNEXPECTED: `z.url().refine(v => new URL(v).protocol)` pada Zod v4
   melempar `TypeError: Invalid URL` untuk string kosong/rusak, dan lemparan
   ini lolos dari `safeParse` (terbukti via skrip node + `console.error`
   sementara di server yang mencatat `[diag-unexpected] TypeError: Invalid
   URL`, lalu di-revert). Dialog edit mengirim `url: ""` mentah (form
   aplikasi me-null-kan), sehingga setiap save dengan URL kosong crash —
   inilah diskriminator: edit dengan URL terisi lolos (tapi bergeser),
   edit dengan URL kosong crash.

File yang diubah (minimal):

- `src/lib/dates.ts` — helper baru `utcToZonedLocal(iso, tz)` (cerminan
  `zonedLocalToUtc`, via `Intl.formatToParts`, `hourCycle h23`).
- `src/lib/dates.test.ts` — 2 unit test baru (format per-TZ + round-trip
  tanpa geser).
- `src/components/application-detail/application-detail.tsx` — defaultValue
  edit memakai `utcToZonedLocal(..., preferences.timezone)`; submit memakai
  `zonedLocalToUtc(..., preferences.timezone)` (scheduledAt, deadlineAt,
  dan offerDeadline yang berpola identik).
- `src/backend/schemas/events.ts` + `src/backend/schemas/applications.ts` —
  refine URL dibungkus try/catch (gagal validasi bersih, bukan throw);
  applications.ts pola baris yang sama dan terjangkau via edit lamaran
  (raw `data.get("jobUrl")`), didokumentasikan transparan sebagai
  root-cause yang sama.

Targeted verification (browser Chrome headed + DB):

- A. Interview: create 12 Sep 09.00 → dialog edit tampil 09.00 (dulu 02.00);
  save title-only sukses + dialog tertutup + tetap 09.00; ubah ke 10.30 →
  tersimpan 10.30 (`2026-09-12T03:30:00Z` di DB); reload persist.
- B. Assessment: dialog tampil 09.00; save title-only sukses (dulu crash
  2/2) + dialog tertutup normal; deadline tetap `2026-09-15T02:00:00Z`;
  reload persist. Save dengan URL kosong sukses (skenario crash audit).
- C. Regression event: create/edit/complete/delete tetap normal; kalender
  + dashboard konsisten; 0 console error di seluruh sesi verifikasi.
- D. Timezone: tidak ada double-conversion (satu konversi per arah memakai
  TZ preferensi); unit test round-trip Jakarta + format Makassar PASS.
- Auto: `tsc --noEmit` PASS, `eslint .` PASS, `vitest run` 10 files /
  48 tests PASS (46 lama + 2 baru).

Tidak ada regression yang ditemukan. Data uji repro dibersihkan (interview
repro dihapus; Tes Coding kembali ke judul semula dengan tenggat utuh).
Release readiness tetap NOT READY (High F-01, F-06 + Medium/Low lain masih
terbuka) — dikonfirmasi final pada regression penuh pasca semua fix.

### F-03 — OUT-003 Menutup sebagai "Ditarik" DENGAN alasan selalu gagal diam-diam

Status: FAIL
Severity: Medium (workaround: kosongkan alasan — close tanpa alasan PASS)
URL: `/aplikasi/[id]` (dialog "Tutup lamaran")

Expected: alasan opsional tersimpan sebagai `reason_code`.
Actual: mengisi "Alasan singkat" (mis. "Gaji tidak cocok") lalu Simpan membuat
dialog macet terbuka tanpa pesan error (2/2 deterministik, reload membuktikan
tidak persist). Tanpa alasan: close berhasil (`success:true`, stage Ditarik,
`closed_at` + outcome tercatat). Network response saat gagal:
`{"success":false,"error":{"code":"VALIDATION","message":"Data yang diberikan
tidak valid."}}`; request mengirim `reasonCode: "Gaji tidak cocok"`.

Notes: skema Zod mengizinkan teks bebas ≤100 char, sehingga penolakan
kemungkinan dari constraint DB pada `reason_code` (dipetakan ke VALIDATION),
dan error validasi tidak ditampilkan di dialog (pola menelan error yang sama
dengan F-02).

Recommended next action: selaraskan opsi alasan UI dengan nilai `reason_code`
yang diizinkan DB (mis. dropdown kode valid) dan tampilkan error validasi
server di dalam dialog.

## Console / Network Review

- Error: hanya 2 console error pasca-signup (F-01). Tidak ada React/hydration/
  unhandled-promise error di seluruh sesi.
- Warning: hanya noise dev (React DevTools info, HMR/Fast Refresh logs).
- Jaringan: tidak ada 4xx/5xx HTTP. Tiga respons action-level `success:false`
  sesuai temuan di atas (1x UNEXPECTED F-02, 2x VALIDATION F-03 — satu saat
  eksplorasi awal + satu retest; tidak ada retry loop).
- Observasi minor (bukan failure): delete event langsung tanpa konfirmasi;
  pesan error lama ("Terjadi kesalahan...") sempat persisten hingga re-render;
  "Aktivitas terakhir" menampilkan tanggal event masa depan.

## Security Notes (Phase 2)

Tidak ada security testing khusus (jadwal Phase 4). Observasi insidental:
ID aplikasi orang lain/tak-ada selalu menghasilkan "Lamaran tidak ditemukan."
tanpa bocoran data — isolasi akan diuji sistematis dengan User A/B pada Phase 4.

## Remaining Blockers (fungsional inti)

1. [Critical] F-02 — edit agenda merusak waktu (korupsi senyap + crash).
2. [High] F-01 — dasbor crash untuk setiap user baru pasca-registrasi.
3. [High] F-02 (varian crash) — edit assessment tidak bisa disimpan sama sekali.
4. [Medium] F-03 — close "Ditarik" dengan alasan gagal diam-diam.

## Release Decision (Phase 2)

**NOT READY FOR DEPLOYMENT** — terdapat 1 Critical + 2 High pada core flow
(event edit, first-run dashboard). Di luar itu, core journey
(Auth → CRUD → Kanban → History → Events → Follow-up → Offer → Close → Reopen
→ Archive → Delete) terbukti bekerja dan persist dengan benar.

Aman lanjut ke **Phase 2B: Supporting Functional Testing** (dashboard lanjutan,
search/filter, list, calendar, analytics, settings) — temuan di atas tidak
memblokir pengujian area pendukung.

---

# Phase 2B — Supporting Functional Audit

> **Mode:** AUDIT ONLY. Tidak ada perbaikan/refactor source code.
> Dev server sempat mati pasca-interupsi dan di-start ulang (tidak ada
> duplikat; instance lama sudah tidak merespons). Satu browser session baru.
> Test account: `qa-phase2@applyo.test` + akun kosong kedua
> `qa-phase2b@applyo.test` (untuk empty states + account lifecycle).
> Data uji aktif baru: PT Cari Kerja/Dilamar/LinkedIn/applied 25 Agu 2026,
> PT Sinar Pagi/Wawancara/Glints + interview 8 Sep 09.00,
> PT Maju Mundur/Seleksi Awal/Jobstreet/applied 5 Sep + assessment tenggat 9 Sep.
> Preferensi yang sempat diubah saat testing (USD, format ISO, WITA)
> dikembalikan ke awal (IDR, DD MMM YYYY, Asia/Jakarta) dan terverifikasi.

## Phase 2B Summary

PASS: 27
FAIL: 5
BLOCKED: 1
SKIPPED: 1

## Hasil per Test

| Test ID   | Status  | Catatan ringkas |
|-----------|---------|-----------------|
| SEARCH-001| PASS    | "cari" → hanya PT Cari Kerja |
| SEARCH-002| PASS    | "frontend" → hanya Sinar Pagi |
| SEARCH-003| PASS    | "SINAR PAGI" (uppercase) tetap cocok |
| SEARCH-004| PASS    | "zzz-tidak-ada" → "Tidak ada lamaran yang cocok." |
| FILTER-001| PASS    | Tahap Wawancara → hanya Sinar Pagi |
| FILTER-002| FAIL    | Lihat temuan F-04 (Medium) — tidak ada filter outcome di UI |
| FILTER-003| FAIL    | Lihat temuan F-04 (Medium) — tidak ada filter sumber di UI |
| FILTER-004| FAIL    | Lihat temuan F-04 (Medium) — tidak ada filter rentang tanggal di UI |
| FILTER-005| PASS    | Kombinasi search "maju" + tahap Dilamar → kosong (logika AND benar) |
| FILTER-006| PASS    | Hapus filter mengembalikan semua kartu + badge hilang |
| LIST-001  | PASS    | Kolom perusahaan/posisi/tahap/sumber/dilamar/agenda/aktivitas akurat untuk 6 aplikasi |
| LIST-002  | PASS    | applied_asc/desc + upcoming_asc (8→9→15 Sep, lalu tanpa-agenda alfabetis) benar |
| LIST-003  | SKIPPED | Hanya 6 records; dataset 100+ tidak dapat dibuat wajar via UI |
| CAL-001   | PASS    | Month view September 2026 memuat event pada tanggal benar (8, 9, 12, 15) |
| CAL-002   | PASS    | Bulan berikutnya/sebelumnya via `?month=` refresh data benar |
| CAL-003   | PASS    | Klik event → dialog detail benar + "Lihat lamaran" ke aplikasi tepat |
| CAL-004   | PASS    | Interview tampil 09.00 WIB (zona preferensi) |
| CAL-005   | PASS    | Tenggat assessment + tenggat tawaran tampil pada tanggal benar |
| DASH-002  | PASS    | "Berikutnya" kronologis (8 Sep interview, 8 Sep offer-deadline, 9 Sep deadline) |
| DASH-003  | PASS    | "Perlu perhatian" menampilkan interview + deadline ≤48 jam; kasus inaktivitas tak-terpicu (waiting dihitung dari max aktivitas/dilamar/dibuat sehingga app baru selalu 0 hari — sesuai ARCH) |
| DASH-004  | PASS    | Akun kosong: nol + "Belum ada lamaran. Tambahkan lamaran pertamamu untuk memulai." + CTA |
| OFFER-003 | PASS    | Tenggat tawaran (8 Sep) muncul di dashboard + kalender sebagai "Batas waktu tawaran" |
| ANA-001   | PASS    | Total 6 sesuai DB |
| ANA-002   | PASS    | Interview 2 berbasis history (bukan stage saat ini — app Diterima tetap dihitung) |
| ANA-003   | PASS    | Offer 1 sesuai DB |
| ANA-004   | PASS    | Diterima 1 sesuai DB |
| ANA-005   | PASS    | Funnel 6→2→1→1 benar; hanya count tanpa teks % (catatan) |
| ANA-006   | PASS    | Akun kosong → "Belum ada data analitik." (tanpa NaN/Infinity) |
| ANA-007   | PASS    | Tren Agu 1 / Sep 5 sesuai applied_at/created_at |
| SET-001   | PASS    | USD tersimpan; record baru default US$; record lama tetap pakai currency barisnya (benar per model data) |
| SET-002   | FAIL    | Lihat temuan F-05 (Low) — format tanggal tersimpan tapi tak-diterapkan di mana pun |
| SET-003   | PASS    | WITA menggeser 09.00→10.00 dengan benar di agenda/timeline/ringkasan |
| ACC-001   | FAIL    | Lihat temuan F-06 (High) — hapus akun gagal |
| ACC-002   | BLOCKED | Tergantung ACC-001 yang FAIL |

## Failed Tests (detail)

### F-04 — FILTER-002/003/004 Filter outcome/sumber/rentang tanggal tidak ada di UI

Status: FAIL (3 test ID, satu root cause)
Severity: Medium
URL: `/aplikasi`, `/aplikasi?view=list` (panel "Filter lamaran")

Expected (`TESTING.md` + PRD §15 minimum): filter tahap, outcome, sumber,
rentang tanggal.
Actual: panel filter (board maupun list, komponen sama) hanya menyediakan
grup Tahap (6 active stages) + Lokasi (kosong: "Belum ada lokasi yang
tercatat") + Hapus/Terapkan. Tidak ada filter outcome, sumber, maupun
rentang tanggal di UI mana pun, padahal skema backend
(`searchFiltersSchema`) sudah mendukung ketiganya.

Reproduction steps:

1. Buka `/aplikasi` → "Filter" (atau `?view=list` → "Filter").
2. Amati grup filter yang tersedia — hanya Tahap + Lokasi.

Notes: tidak ada console/network error (bukan crash — fitur belum ada).
Dampak: user dengan banyak lamaran tidak bisa menyaring closed outcome,
sumber, atau periode — bertentangan dengan cakupan minimum PRD.

Recommended next action: ekspos filter outcome/sumber/date-range di UI
(list view prioritas) memakai parameter backend yang sudah ada.

### F-05 — SET-002 Preferensi format tanggal tidak berpengaruh ke tampilan

Status: PASS (FIXED 2026-09-09; see fix verification below)
Severity: Low -> resolved
URL: `/pengaturan`, `/aplikasi/[id]`, `/aplikasi?view=list`

Expected: memilih "2026-08-28" mengubah render tanggal di aplikasi.
Actual: preferensi tersimpan (radio tetap checked setelah reload) tetapi
semua tanggal tetap format lama ("25 Agu 2026", "7 Sep 2026") di detail,
list, dan permukaan lain yang dicek. Inspeksi kode: `dateFormat` diambil ke
`PreferencesDTO` namun tidak dikonsumsi oleh kode render mana pun (semua
menggunakan `Intl.DateTimeFormat("id-ID", ...)` hardcoded).

Reproduction steps:

1. `/pengaturan` → Format tanggal "2026-08-28" → Simpan.
2. Buka detail/list → tanggal tetap "Agu/Sep".

Notes: tidak ada console/network error. Dampak kosmetik; setting
menjanjikan ("Atur format yang paling nyaman") tetapi tidak melakukan apa pun.
Sampingan: skema mengizinkan "DD/MM/YYYY" tetapi UI hanya menawarkan 2 opsi.

Recommended next action: terapkan `dateFormat` di util format tanggal
terpusat, atau hapus opsi bila di luar scope.

### F-06 — ACC-001 Penghapusan akun gagal total (DATABASE)

Status: FIXED (confirmed by full regression 2026-09-08)
Severity: High (saat ditemukan; fix terverifikasi targeted)
URL: `/pengaturan` (dialog "Hapus akun?")

Expected: konfirmasi "HAPUS AKUN" menghapus auth user + seluruh data domain.
Actual: setelah konfirmasi valid, muncul alert
"Operasi delete_account tidak dapat diselesaikan.", dialog macet terbuka,
akun tetap ada (terverifikasi di DB; sesi tetap login). Gagal 2/2
deterministik. Network response:
`{"success":false,"error":{"code":"DATABASE",...}}`.
Sesi fresh (<10 menit, di dalam jendela re-auth) sehingga bukan penolakan
FORBIDDEN.

Reproduction steps:

1. Login akun disposable `qa-phase2b@applyo.test`.
2. `/pengaturan` → "Hapus akun" → ketik HAPUS AKUN → "Hapus permanen".
3. Alert error; akun tetap ada.

Notes: tidak ada console error. Kemungkinan root cause: kegagalan
`admin.auth.admin.deleteUser` (service-role key/GoTrue admin API) — perlu cek
server log + `SUPABASE_SERVICE_ROLE_KEY` terhadap project lokal. Akun QA
sengaja dibiarkan (tidak dihapus manual via DB) sebagai evidence.

Recommended next action: periksa server log untuk cause asli; validasi
service-role key; uji ulang delete + verifikasi cascade (ACC-002).

#### Siklus re-test F-06 (2026-09-07) — audit ulang, TANPA perubahan kode

Re-test dengan akun disposable baru `qa-f06@applyo.test` (+ 1 aplikasi
`PT F06 Data` agar verifikasi cascade bermakna): hasil SAMA — alert
"Operasi delete_account tidak dapat diselesaikan.", dialog macet terbuka,
akun + data utuh, 0 console error. Kegagalan ke-3 yang konsisten
(Phase 2B 2x + siklus ini 1x) → deterministik, bukan flaky.

Root cause TERBUKTI (evidence read-only, tanpa menyentuh source):

1. GoTrue auth log mencatat `DELETE /admin/users/<qa-f06>` → `status 500`,
   `error: "ERROR: System pipeline stages cannot be deleted
   (SQLSTATE 42501)"`, `actor: service_role`. Artinya service-role key
   VALID dan request admin mencapai GoTrue (hipotesis key salah GUGUR;
   key lokal juga terverifikasi SET dan berbeda dari placeholder contoh,
   dicek boolean-only tanpa membaca nilainya).
2. Migrasi `20260828000000_initial_backend.sql`:
   - `handle_new_user()` membuat 10 system stages per user, semua dengan
     `system_key NOT NULL`;
   - trigger `pipeline_stages_protect_system_stage` (BEFORE DELETE) melempar
     `42501 'System pipeline stages cannot be deleted'` untuk SETIAP baris
     dengan `system_key IS NOT NULL` — tanpa pengecualian untuk penghapusan
     kaskade saat akun dihapus;
   - `pipeline_stages.user_id → auth.users(id) ON DELETE CASCADE`
     (baris 29; pola cascade yang sama di semua tabel domain).
3. Rantai gagal: `deleteCurrentAccount` → `admin.auth.admin.deleteUser` →
   hapus `auth.users` → cascade ke `pipeline_stages` → trigger abort →
   GoTrue 500 `unexpected_failure` → app memetakan ke error DATABASE
   generik. Karena SETIAP user memiliki 10 system stages, delete akun
   GAGAL SELALU untuk semua user. Rollback penuh terverifikasi (auth user
   `qa-f06` tetap ada, sesi tetap login).

Rekomendasi fix (untuk siklus fix terpisah, BUKAN dikerjakan di sini):
buat penghapusan akun berhasil menghapus system stages secara sah —
mis. hapus eksplisit baris domain via service-role SEBELUM memanggil
GoTrue deleteUser, atau sesuaikan proteksi trigger agar tidak memblokir
penghapusan akun; plus tampilkan error server di dialog (saat ini
ditelan menjadi alert generik + dialog macet). Perlu migration +
pengujian cascade penuh (ACC-002).

ACC-002 tetap BLOCKED (tergantung ACC-001). Akun `qa-f06` (+ 1 aplikasi)
sengaja dibiarkan sebagai evidence, konsisten dengan `qa-phase2b`.

#### Fix record (2026-09-07) — STATUS: FIXED, pending full regression

Root cause (final, terbukti berlapis — sama seperti hipotesis audit):

```text
deleteCurrentAccount
→ admin.auth.admin.deleteUser (service_role, valid)
→ DELETE auth.users
→ ON DELETE CASCADE ke pipeline_stages
→ BEFORE DELETE trigger protect_system_pipeline_stage
→ RAISE 42501 untuk SEMUA 10 system stages (system_key NOT NULL)
→ GoTrue 500 unexpected_failure → rollback total
```

Chosen solution: trigger kini memblokir penghapusan system stage HANYA
jika owning `auth.users` masih ada
(`... AND EXISTS (select 1 from auth.users where id = old.user_id)`).
Semantik cascade PostgreSQL 15.8 DIBUKTIKAN via eksperimen skema terisolasi
(`f06_probe`, sudah di-drop): direct child delete dengan parent hidup →
42501 BLOCKED; parent delete → cascade ALLOW + child hilang. BUKAN
pengecualian `if service_role` — penghapusan langsung oleh role mana pun
(incl. service_role) saat owner masih ada TETAP ditolak; yang diizinkan
hanya cascade saat owner sedang dihapus. Fungsi dijadikan
`SECURITY DEFINER` (owner postgres, `search_path=''`, tabel
schema-qualified — pola yang sama dengan fungsi lain di migrasi) agar cek
`auth.users` deterministik untuk semua invoking role.

Alternatif yang ditolak: hapus/drop trigger (menghilangkan proteksi),
hapus cascade (merusak lifecycle), hapus eksplisit via app-code sebelum
GoTrue call (duplikasi logika cascade, risiko partial delete), retry/sleep
(menyamarkan masalah), catch-and-ignore (dilarang).

Migration: `supabase/migrations/20260907061127_account_deletion_cascade.sql`
(`CREATE OR REPLACE FUNCTION` + `ALTER FUNCTION ... OWNER TO postgres`;
reproducible, preservatif — tidak menyentuh data; migrasi lama tak diubah).
Di-apply lokal via `supabase migration up` (tercatat di history, tanpa
`db reset` sehingga data uji utuh); `supabase db lint`: No schema errors.

Files changed:

- `supabase/migrations/20260907061127_account_deletion_cascade.sql` (baru)
- `supabase/tests/account_deletion.sql` (baru, 14 pgTAP tests)

Tidak ada application source code yang diubah (fix murni database +
tests); fix EVENT-004 sebelumnya tidak tersentuh.

Database verification:

- Pre-fix: file test 3/14 PASS (proteksi direct-delete bekerja),
  11/14 FAIL tepat pada cascade (bug ter-reproduksi di level SQL).
- Post-fix: `npm run db:test` 35/35 PASS (21 lifecycle + 14 baru).
- Case A: direct system-stage delete → 42501 tetap ditolak (pgTAP).
- Custom (non-system) stage tetap bisa dihapus langsung (no regression
  stage management).
- Orphan scan 8 tabel domain untuk user tanpa `auth.users` → 0/0/0/0/0/0/0/0.

Browser verification (Chrome headed):

- Case B (akun kosong `f01-r6`): Hapus akun → redirect `/`, dialog keluar
  flow dengan benar, auth row hilang, sesi invalid (`/dashboard` →
  `/masuk?next=%2Fdashboard`), 0 console error.
- Case C (akun + data `qa-f06`: 1 aplikasi + history + stages + prefs +
  profile): Hapus akun → redirect `/`, auth row hilang, orphan scan 0 di
  semua tabel, 0 console error.
- Multi-user: witness `qa-phase2` tetap 6 aplikasi / 10 stages / 5 events
  (identik baseline); semua user lain utuh. Tidak ada cross-user deletion.
- Regression: login/logout/settings/board/kanban render normal untuk
  `qa-phase2` pasca-migrasi; dashboard counts konsisten.
- Failure UI tidak berubah (tidak tersentuh); path sukses tidak lagi
  menyentuh path error tersebut.

Automated checks: `supabase db lint` PASS, `tsc --noEmit` PASS (0),
`eslint .` PASS (0), `npm run db:test` 35/35 PASS. Full unit suite tidak
dijalankan ulang (tidak ada application-code change pada siklus ini;
terakhir 48/48 pada siklus EVENT-004).

Test data pasca-fix: `qa-f06` dan `f01-r6` terhapus via flow yang diuji
(bukti sukses); `qa-phase2b` tetap ada sebagai witness/evidence F-01.

## Update temuan Phase 2

### F-01 (DASH-001) — bukti baru Phase 2B: crash 100% pada render pasca-signup, intermittent setelahnya

- Registrasi akun kedua (`qa-phase2b`) mereproduksi crash dashboard
  pasca-signup ke-3/3 (kali ini operasi `read_domain_data`/`ownedRows`).
- Pada sesi hangat (password-grant), 1 kegagalan `read_domain_data` terjadi
  pada load pertama setelah dev-server restart; load berikutnya OK.
- `/analitik` (yang memanggil `ownedRows()` yang sama, 6× `select(*)`
  paralel) selalu OK; query REST + supabase-js langsung untuk ketujuh tabel
  selalu OK (data + RLS terbukti benar).
- Pola: query yang gagal BERBEDA-BEDA (`get_preferences` 2x, `read_domain_data`
  2x) dan pulih sendiri — mengarah ke race/flakiness pada client SSR
  konkuren di `Promise.all([getDashboardSummary(), getPreferences()])`,
  bukan bug data/RLS. Severity tetap High.

## Console / Network Review (Phase 2B)

- Error: 1 console error pasca-signup akun kedua (F-01, `read_domain_data`);
  tidak ada error di 30+ navigasi lain. Tidak ada React/hydration/
  unhandled-promise error.
- Warning: hanya noise dev (HMR/Fast Refresh, React DevTools info).
- Jaringan: tidak ada 4xx/5xx HTTP. Satu respons action-level `success:false`
  (`DATABASE` delete_account, F-06).
- Observasi insidental: kalender akun kosong tidak membocorkan event akun
  lain (sinyal positif untuk isolasi Phase 4, bukan pengganti tesnya).

## Remaining Blockers (kumulatif s/d Phase 2B + fix EVENT-004)

1. [Critical → FIXED pending regression] F-02 — edit agenda (lihat fix record).
2. [High] F-01 — dashboard crash pasca-signup: 4 kegagalan historis, 0/8 repro
   pada siklus fix (6 dev + 2 prod); root cause level kode tidak terbukti,
   diduga transient infra dev; blocker dipertahankan, verifikasi cloud
   direkomendasikan.
3. [High → FIXED pending regression] F-06 — hapus akun (lihat fix record).
4. [Medium] F-03 — close "Ditarik" dengan alasan gagal diam-diam.
5. [Medium] F-04 (BARU) — filter outcome/sumber/date-range tidak ada di UI.
6. [Low] F-05 (BARU) — preferensi format tanggal tidak berpengaruh.

## Release Decision (kumulatif)

**NOT READY FOR DEPLOYMENT** — F-02 dan F-06 FIXED pending regression;
tersisa terbuka: 1 High (F-01) + 2 Medium (F-03, F-04) + 1 Low (F-05).
Lanjut ke verifikasi cloud F-01 / regression penuh, lalu fase `TESTING.md`
berikutnya bila gating mengizinkan.

## Files Created / Changed by Phase 2B Audit

- Updated: `TEST-REPORT.md` (section Phase 2B ini).
- Test data (dev DB lokal saja): 3 aplikasi aktif + 2 events di
  `qa-phase2@applyo.test`; akun `qa-phase2b@applyo.test` (gagal dihapus —
  evidence F-06). Preferensi `qa-phase2` dikembalikan ke awal dan
  terverifikasi. Tidak ada source code yang diubah.

---

# Full Regression After F-06

> **Mode:** REGRESSION AUDIT ONLY (2026-09-08 UTC). Tidak ada perbaikan,
> refactor, atau perubahan source code aplikasi pada siklus ini.
> Baseline: fix EVENT-004 + migration F-06
> (`20260907061127_account_deletion_cascade.sql`) + 14 pgTAP tests baru.
> Browser: Chrome headed, satu session. Akun uji: `reg-test@applyo.test`
> (dibuat + dihapus dalam siklus ini).

## Regression Summary

PASS: 52
FAIL: 0
BLOCKED: 0
SKIPPED: 1

Critical: 0
High: 0
Medium: 0
Low: 0

## Hasil per Area

| Area | Status | Bukti ringkas |
|------|--------|---------------|
| Preflight (git/lint/typecheck/db-lint/db-test/unit/build) | PASS | lint 0, typecheck 0, db-lint bersih, db-test 35/35, unit 48/48, build sukses |
| DB: direct system-stage delete | PASS | 42501 tetap ditolak (pgTAP) |
| DB: custom stage delete | PASS | diizinkan (pgTAP) |
| DB: cascade + orphans + witness | PASS | 35/35; orphan scan 0 di 8 tabel |
| SECURITY DEFINER review | PASS | diperlukan (invoker tanpa akses `auth.users`), owner postgres, `search_path=''`, tanpa dynamic SQL/GRANT — tanpa temuan |
| Auth (register/login/logout/session/redirect) | PASS | semua normal |
| CRUD + validasi + edit + archive/restore + delete | PASS | persist terverifikasi reload |
| Kanban (load/reorder/move/journey/persist/history) | PASS | journey 6 tahap + history berurutan, reorder tanpa history |
| Events + EVENT-004 eksplisit | PASS | create/edit/complete/delete; edit title-only tanpa geser waktu |
| Offer | PASS | create + edit + persist |
| Outcomes (Hired/Rejected/Withdrawn/Ghosted) | PASS | state + history benar; Ghosted user-initiated |
| Reopen | PASS | kembali aktif + history preserved + reopen tercatat |
| Dashboard | PASS | counts 3/1/1/0/1 benar; upcoming/attention benar |
| Calendar | PASS | render + navigasi bulan benar |
| Search/filter/list | PASS | search, stage filter, clear, akurasi list |
| Analytics | PASS | total 3, funnel 3→1→1→1 history-based, sources benar, tanpa NaN |
| Settings | PASS | currency round-trip IDR→USD→IDR persist |
| F-06 delete (empty + with-data) | PASS | redirect `/`, sesi invalid, auth + domain hilang, orphan 0, witness utuh |
| Non-drag Change Stage | SKIPPED | tidak ada UI tersebut (sejak Phase 2; drag satu-satunya path, catat untuk A11Y) |

## F-06 regression status

CONFIRMED FIXED — pensiun dari daftar blocker aktif menjadi
"FIXED, convicted by full regression": Case A/B/C browser + DB,
multi-user isolation, 14 pgTAP permanen, semuanya PASS pada baseline ini.

## EVENT-004 regression status

CONFIRMED — edit interview title-only persist tanpa geser waktu
(09.00 tetap), dialog tertutup normal; assessment + offer flows normal;
tidak ada error terkait datetime di seluruh sesi.

## F-01 occurrences during regression

0 (nol). Tidak satu pun error boundary/console error terkait dashboard
dalam ±40 navigasi siklus ini, termasuk first-render pasca-signup dan
login. Status F-01 tetap STILL FAILING (historical intermittent, menunggu
verifikasi cloud) — tidak ada evidence baru yang mengubahnya.

## Console / Network Review (regression)

- console.error terkait aplikasi: 0 di seluruh sesi.
- Warning: hanya noise dev (React DevTools info).
- Jaringan: tidak ada 4xx/5xx; tidak ada failed Supabase requests.
- Satu observasi perilaku benar: delete dengan sesi >10 menit ditolak
  dengan "Masuk kembali sebelum menghapus akun." (re-auth guard),
  lalu sukses setelah login ulang — sesuai desain.

## Remaining Blockers (pasca full regression)

1. [High] F-01 — historical intermittent, menunggu verifikasi cloud.
2. [Medium] F-03 — close "Ditarik" dengan alasan gagal diam-diam.
3. [Medium] F-04 — filter outcome/sumber/date-range tidak ada di UI.
4. [Low] F-05 — preferensi format tanggal tidak berpengaruh.

## Release Decision (pasca full regression)

**NOT READY FOR DEPLOYMENT** — F-02 dan F-06 kini confirmed fixed by
regression; tersisa 1 High (F-01) + 2 Medium + 1 Low. Langkah berikut
menurut `TESTING.md`: verifikasi cloud untuk F-01, fix F-03/F-04/F-05
(bukan bagian siklus ini), lalu fase UI/Visual, Security/RLS,
Performance, dan Final Smoke.

## Files Created / Changed by Full Regression

- Updated: `TEST-REPORT.md` (section ini).
- Test data: akun `reg-test@applyo.test` dibuat lalu dihapus via flow
  F-06 yang diuji (auth + domain bersih, orphan 0); witness
  `qa-phase2@applyo.test` utuh (6/10/5). Tidak ada source code yang diubah.

---

# UI / Visual / Responsive Audit

> **Mode:** AUDIT ONLY (2026-09-08 UTC). Tidak ada perbaikan, refactor,
> atau perubahan source/CSS/component/copy. Hanya `TEST-REPORT.md` yang
> diupdate. Browser: Chrome headed, satu session, dev server existing.
> Viewports: 1440×900, 1280×800, 768×1024, 390×844 (+600px untuk boundary).
> Visual source of truth: `DESIGN-SYSTEM.md`. Akun uji: `ui-audit@applyo.test`
> (+ 1 aplikasi long-content + 1 interview long-title, dibersihkan setelah
> audit). Screenshot hanya untuk defect aktual (1 file).

## UI Audit Summary

Areas PASS: 21
Issues: 1 (UI-001, Medium)

Critical: 0
High: 0
Medium: 1
Low: 0

## Areas PASS (21)

- Shell global: background cream, tipografi display, border/shadow/radius
  sesuai token (verifikasi computed styles) — 1440/1280/768/390.
- Sidebar desktop + bottom-nav mobile; active navigation; tanpa clipping.
- Dashboard 1440/1280/768/390: KPI, upcoming, attention, empty state.
- Kanban: lebar kolom 280–292px, board scroll internal, card utuh,
  drag overlay + dragging state terverifikasi, tanpa duplikat/hilang.
- List view: akurat + adaptasi card di mobile, paginasi.
- Create/Edit form + validasi; dialog fit + scrollable di mobile,
  actions reachable.
- Datepicker: theme default/focus/popup (fit viewport mobile),
  selected-state CSS themed, apply-on-select; date-only menutup otomatis.
- Popover/menu kartu: Portal, fit viewport, border/shadow themed.
- Dialog agenda/tawaran/outcome: fit mobile, overlay, copy neutral & calm.
- Events (list, edit form, completed, deadline) + long titles wrap.
- Offer section (empty + terisi pada regression).
- Closed outcomes UI (badge/dialog/copy) — tone netral terverifikasi.
- Calendar desktop + mobile: month view, event wrap, navigasi bulan.
- Analytics desktop + mobile: KPI, tren, funnel, sources readable.
- Settings desktop + mobile; dark mode toggle bekerja tanpa overflow.
- Empty states (board/dashboard/list/search): CTA accessible, rapi.
- Error state aman ("Lamaran tidak ditemukan." + kembali).
- Loading: `loading.tsx` ada di 3 route (tidak di-force secara visual).
- Long content: company/position/notes/agenda/timeline wrap tanpa overflow.
- Focus-visible themed komprehensif (34 aturan di CSS).
- Mobile walkthrough (Dashboard/Lamaran/Create/Detail/Kalender/Analitik/
  Settings): navigasi + CTA reachable, tanpa scroll horizontal halaman.

## Temuan

### UI-001 — Toolbar halaman Lamaran overflow pada range tablet

- ID: UI-001
- Page: `/aplikasi` (board + list, toolbar yang sama)
- Viewport: 768×1024 (confirmed); boundary ±640–850px (600px aman,
  1280/1440/390 aman)
- Status: FIXED (pending full regression)
- Severity: Medium
- Expected: toolbar (search + filter + "Tambah lamaran") muat dalam
  container di semua viewport; tanpa scroll horizontal halaman.
- Actual: `.application-toolbar` memakai grid kolom fixed
  `220px 102px 203px` (+gap) = ±549px sementara container hanya ±455px
  pada 768px (sidebar 236px terlihat), sehingga tombol "Tambah lamaran"
  menjorok ±94px keluar viewport dan halaman scroll horizontal
  (docSW 816 vs 768). Di mobile (390px) toolbar menumpuk vertikal sehingga
  aman; di ≥1280px container cukup lebar sehingga aman.
- Reproduction: viewport 768×1024 → buka `/aplikasi` → ukur
  `document.documentElement.scrollWidth` (816) atau scroll kanan.
- Screenshot reference: `ui-tablet-toolbar-overflow.png` (satu-satunya
  screenshot fase ini).
- Notes: CTA tetap reachable via scroll (workaround) — bukan High.
  Tidak ada defect overflow/clipping lain yang ditemukan di semua halaman
  dan viewport yang diuji.

#### Fix record (2026-09-09) — STATUS: FIXED, pending full regression

Root cause: `.workspace-toolbar` memakai grid 3 kolom fixed-ish
(`minmax(220px,460px) auto 1fr`; konten min ±549px) yang hanya di-override
menjadi stacked pada `@media (max-width: 767px)`. Pada 768–±850px (sidebar
terlihat, container ±455–550px) grid tidak muat → tombol keluar viewport.

Fix (minimal, `src/app/globals.css` — blok `@media (max-width: 1024px)`
yang sudah ada): terapkan pola stacked yang IDENTIK dengan aturan mobile
(`1fr auto` + search full-row + button stretch) untuk range tablet.
Tidak ada pola CSS baru, tidak ada perubahan fitur/behavior, tidak ada
`overflow: hidden`. Aturan mobile (767px, kemudian di cascade) tidak
berubah sehingga ≤767px dan ≥1025px pixel-identical dengan sebelumnya.

Files changed:

- `src/app/globals.css` (+12 baris dalam blok media 1024px yang ada)

Verification (Chrome headed, `document.documentElement.scrollWidth`):

- 600px: 585 ≤ 600, tombol terlihat.
- 768px: 753 ≤ 768, tombol terlihat (sebelumnya 816, overflow).
- 850px: 835 ≤ 850, tombol terlihat.
- 1280px: grid 3-kolom desktop utuh (`460px 102px 339px`), tanpa overflow.
- 390px: tanpa overflow, tombol terlihat (tidak berubah).
- Fungsional: search memfilter, filter tahap + clear bekerja pada 768px;
  spacing/gap 12px dan token visual tidak berubah.
- Checks: `eslint .` PASS (0), `tsc --noEmit` PASS (0).
- Test data uji (1 aplikasi) dibuat lalu dihapus via UI; akun kembali kosong.

Tidak ada regression yang ditemukan.

## Non-Drag Change Stage Observation

Dikonfirmasi ulang: tidak ada menu/aksi "Ubah Tahap" non-drag di menu
kartu maupun halaman detail; satu-satunya path adalah drag-and-drop
(KeyboardSensor terdaftar di kode tetapi tidak diverifikasi sebagai
fallback fungsional). BUKAN ditandai bug pada fase ini; severity/keputusan
final di-defer ke Accessibility Audit sesuai instruksi.

## Console Review (UI audit)

- console.error aplikasi: 0 di seluruh sesi.
- Warning: hanya noise dev Next.js (`scroll-behavior: smooth`, DevTools
  info) — bukan issue aplikasi.

## Coverage yang tidak dieksekusi penuh

- Offer dengan benefits/notes sangat panjang (layout section identik
  dengan notes yang sudah stress-tested; risiko rendah).
- Forced loading skeleton visual (file ada; tidak dipaksa via slowdown).
- Analytics empty state (terverifikasi pada Phase 2B).

## Release Decision (UI audit)

UI/Visual/Responsive: UI-001 FIXED pending full regression, tanpa
Critical/High. Tidak ada blocker dari fase ini; dikonfirmasi final pada
regression penuh berikutnya.

## Files Created / Changed by UI Audit

- Updated: `TEST-REPORT.md` (section ini).
- Screenshot: `ui-tablet-toolbar-overflow.png` (evidence UI-001).
- Test data: akun `ui-audit@applyo.test` + 1 aplikasi + 1 event dibuat
  lalu aplikasi dihapus via UI (event ikut cascade); akun dibiarkan
  (kosong kembali). Tidak ada source code yang diubah.

---

# Accessibility Audit

> **Mode:** AUDIT ONLY (2026-09-09 UTC). Tidak ada perbaikan atau perubahan
> source code. Browser: Chrome headed, satu session. Akun uji:
> `qa-phase2@applyo.test` (data kaya) + keyboard-only interaction +
> `prefers-reduced-motion` via emulasi + ukur touch target 390×844.
> Target: WCAG 2.2 AA practical untuk core flow.

## Accessibility Summary

Areas PASS: 10 (audit) → 15 after fix
Issues FAIL: 5 (Medium 2, Low 3) → 0 after fix (all 5 FIXED, pending full regression)
BLOCKED: 0
SKIPPED: 0

## Areas PASS (10)

- Urutan Tab logis di seluruh halaman yang diuji.
- Login penuh via keyboard (Tab → ketik → Enter) berhasil.
- Kanban keyboard drag BERFUNGSI lintas kolom: fokus "Pindahkan kartu" →
  Space (angkat, live-region mengumumkan) → ArrowRight ×2 (pindah antar
  kolom, diumumkan) → Space (drop persist). Terbukti: kartu pindah
  Dilamar → Wawancara.
- Semua input punya label/accessible name yang jelas; placeholder bukan
  satu-satunya label.
- Stage/outcome/status selalu berlabel teks (bukan warna saja), termasuk
  badge Kanban, agenda, timeline, analitik.
- `prefers-reduced-motion: reduce` didukung CSS (animasi/transisi ≈0.01ms);
  dashboard render dan berfungsi normal saat emulasi aktif.
- Navigasi mobile + CTA utama reachable; ukuran nav 75×69, CTA 189×52.
- Focus visible themed konsisten (outline tebal + hard-shadow
  `:focus-within` pada input; 34 aturan `:focus-visible` di CSS).
- Dialog agenda/CTX menutup via Escape; dialog agenda muat di mobile.
- Tidak ada console error terkait aksesibilitas selama audit.

## Temuan

### A11Y-ISSUE-001 — Modal form tanpa focus trap + abaikan Escape (Medium)

- Flow: dialog "Tambah lamaran" (dan pola Modal yang sama pada
  "Edit lamaran").
- Expected: fokus terkunci di dalam modal; Escape menutup.
- Actual (audit): 9 stop Tab pertama jatuh ke konten background di belakang
  dialog; Escape 2x tidak menutup dialog (harus mencapai Batal via Tab
  atau klik). Dialog agenda/CTX terpisah BISA ditutup Escape.
- Reproduction: buka Tambah lamaran → Tab berulang (fokus ke kartu/link
  background) → Escape (dialog tetap terbuka).
- Fix: `useDialogA11y` hook untuk 6 dialog custom (Modal, create/edit/delete di workspace+list, settings delete): trap Tab, Escape menutup, fokus awal ke field pertama, restore ke trigger. **Status: FIXED** — verifikasi: Tab 12x tetap di dalam dialog (0 escaped), Escape menutup dialog dan fokus kembali ke "Tambah lamaran".

### A11Y-ISSUE-002 — Fokus tidak dikembalikan ke trigger + menu abaikan Escape (Low)

- Flow: tutup dialog agenda via Escape; menu kartu "Tindakan".
- Expected: fokus kembali ke pemicu; Escape menutup menu.
- Actual (audit): setelah Escape, fokus jatuh ke BODY (posisi hilang); menu kartu
  tetap terbuka setelah Escape (1x observasi) dan tanpa navigasi panah.
- Reproduction: buka dialog agenda → Escape → cek `document.activeElement`
  (= BODY); buka menu Tindakan → Escape → menu tetap ada.
- Fix: `useDialogA11y` restore fokus ke trigger via saved `document.activeElement`; menu kartu `SortableCard` sekarang tangani Escape (onKeyDown + closeMenu yang fokus kembali ke trigger). **Status: FIXED** — verifikasi: dialog agenda Escape → fokus kembali ke pemicu; menu Escape → menu tertutup dan fokus kembali ke "Tindakan untuk ..." .

### A11Y-ISSUE-003 — Grid kalender datepicker tak terjangkau keyboard (Medium)

- Flow: pilih tanggal di Tambah/Edit agenda.
- Expected: hari dapat dicapai via Tab/panah dan dipilih via Enter.
- Actual (audit): Tab bersiklus di field dialog tanpa pernah mendarat di grid
  (kode `moveDayFocus` panah ada tetapi tidak reachable); pemilihan
  tanggal keyboard-only tidak mungkin. Trigger dan popup mouse/touch OK.
- Reproduction: buka picker tanggal → Tab 14x → fokus tak pernah
  `role=gridcell`.
- Fix: `ThemedDateOnlyPicker`/`ThemedDatePicker` auto-focus `button.date-picker-day[tabindex="0"]` saat `open` (useEffect, query last popover). `useDialogA11y` menahan trap saat picker terbuka agar Tab tidak mengabaikan portal. **Status: FIXED** — verifikasi: buka picker → fokus langsung di gridcell (hari 9, role gridcell), ArrowRight pindah ke hari 10, Escape tutup picker (fokus kembali ke trigger), Escape kedua tutup dialog.

### A11Y-ISSUE-004 — Touch target aksi kartu 28×28px (Low)

- Flow: Kanban mobile 390×844.
- Expected: ±44px.
- Actual (audit): keenam tombol aksi kartu (drag handle + menu, semua kartu)
  28×28px. Alternatif lebih besar ada di halaman detail.
- Reproduction: ukur `article button` di viewport 390px.
- Fix: `globals.css` `.drag-handle, .card-menu-trigger` 28→44px (grid center, gap tetap 2px). Visual membesar minimal tetapi hit area sesuai; layout card-title tidak rusak. **Status: FIXED** — verifikasi: ukur 44×44 di 390px dan 1440px.

### A11Y-ISSUE-005 — Error validasi tak terasosiasi programatik (Low)

- Flow: submit form kosong.
- Expected: pesan error + `aria-describedby`/`aria-invalid` pada field.
- Actual (audit): dialog bertahan + fokus ke field (validasi native), tetapi tanpa
  teks error, tanpa `aria-describedby`, tanpa `aria-invalid`.
- Reproduction: Tambah lamaran → Simpan kosong → inspeksi input required.
- Fix: `ApplicationForm` noValidate + client required check + `fieldErrors` state; input `aria-required`, `aria-invalid`, `aria-describedby="company-error/position-error"`; error span `role=alert` dengan id terkait; backend fieldErrors juga dipetakan. **Status: FIXED** — verifikasi: Simpan kosong → errs `["Perusahaan wajib diisi.", "Posisi wajib diisi.", "Periksa kembali..."]`, inputs `aria-invalid true` + `describedby` menunjuk ke teks error.

## Kanban Non-Drag Alternative (wajib — terjawab)

Alternatif non-drag ADA dan fungsional: keyboard drag (Space angkat →
panah pindah kolom → Space drop, dengan live-region announcement).
Bukan sekadar teori — perpindahan Dilamar → Wawancara dieksekusi penuh
via keyboard dalam audit ini. Keterbatasan: tidak ada petunjuk visible
tentang shortcut ini (discoverability rendah) — dicatat sebagai observasi,
bukan FAIL. (Efek samping audit: kartu "PT Cari Kerja" pindah ke
Wawancara + 1 history entry pada akun dev `qa-phase2`; dibiarkan dan
didokumentasikan.)

## Console Review (a11y)

- console.error: 0. Warning: noise dev standar.

## Release Decision (a11y)

Accessibility: 2 Medium + 3 Low → 0 setelah fix (5 FIXED, pending full regression). Core flow kini fully keyboard-usable (trap, Escape, restore, datepicker grid, menu), status tak color-only, reduced-motion PASS, mobile usable. Tidak ada blocker; convicted final pada regression penuh berikutnya.

## Fix Verification (2026-09-09)

- A11Y-001: Tab trap 0 escaped (12 Tab), Escape tutup dialog → fokus trigger.
- A11Y-002: Menu Escape tutup → fokus trigger; dialog Escape restore verified.
- A11Y-003: Picker open → fokus gridcell (hari 9), ArrowRight → hari 10, Escape → tutup picker → fokus trigger, Escape kedua → tutup dialog.
- A11Y-004: Button 44×44 di 390px dan 1440px.
- A11Y-005: Simpan kosong → field errors dengan aria-describedby/aria-invalid + role alert.
- Checks: `tsc --noEmit` PASS (0), `eslint .` PASS (0), `vitest run` 48/48 PASS.

## Files Created / Changed by Accessibility Audit + Fix

- Created: `src/components/shared/use-dialog-a11y.ts` (baru, hook a11y).
- Changed: `src/components/application-detail/application-detail.tsx` (Modal hook), `src/components/application-workspace.tsx` (create/delete dialogs + menu Escape), `src/components/application-list/application-list.tsx` (3 dialogs), `src/components/settings-form.tsx` (delete dialog), `src/components/ui/date-picker.tsx` (auto-focus grid), `src/app/globals.css` (44px touch target), `src/components/application-detail/application-form.tsx` (validation aria).
- Updated: `TEST-REPORT.md` (section ini). Tidak ada screenshot baru.

---

# Security / RLS Audit

> **Mode:** AUDIT ONLY (2026-09-09 UTC). Tidak ada source code, policy,
> migration, atau configuration yang diubah. User A dan User B memakai
> disposable QA identities yang sudah tersedia di development lokal;
> password/token/secret tidak dicetak atau dicatat.

## Security Summary

PASS: 18
FAIL: 0
BLOCKED: 0
SKIPPED: 0

Critical: 0
High: 0
Medium: 0
Low: 0

## Results

| Test ID | Status | Evidence |
|---------|--------|----------|
| SEC-001 | PASS | User B read application User A: 0 rows, no data disclosure |
| SEC-002 | PASS | User B update application User A: 0 affected rows, no data change |
| SEC-003 | PASS | User B delete application User A: 0 affected rows, no data change |
| SEC-004 | PASS | User B move User A card: RPC `P0002` / not found, no move |
| SEC-005 | PASS | User B read User A history: 0 rows |
| SEC-006 | PASS | User B read User A recruitment event: 0 rows |
| SEC-007 | PASS | User B read User A offer: 0 rows |
| SEC-008 | PASS | User B read User A preferences: 0 rows |
| SEC-009 | PASS | Anonymous REST read: `42501`; anonymous move RPC: `42501` |
| SEC-010 | PASS | Tampered application/stage/event IDs: no data; child insert `42501`, cross-stage insert `42501` |
| SEC-011 | PASS | No service-role/server-secret markers in `.next/static` client chunks; service-role access is server-only |
| SEC-012 | PASS | Existing rendered external links are HTTP(S); URL schema restricts protocols to HTTP/HTTPS |
| DB-001 | PASS | Existing pgTAP/database regression: constraints and invalid ownership paths covered |
| DB-003 | PASS | Cross-user application→stage insert rejected `42501`; composite ownership FK present |
| DB-004 | PASS | History has SELECT-only RLS policy; no client UPDATE/DELETE policies |
| F-06 | PASS | Full regression retained: account cascade, orphan scan 0, User B witness untouched |
| AUTH-007/008 | PASS | Protected route redirects after logout; logout clears local session |
| Auth session | PASS | Authenticated User A/B requests resolve only to their own rows |

## User Isolation Fixture

User A (`qa-phase2@applyo.test`) had 6 applications, 17 history rows,
5 events, 1 offer, 3 outcomes, 10 stages, and 1 preference row.
User B (`qa-phase2b@applyo.test`) had 0 applications and its own 10 stages
and 1 preference row.

User A's own reads returned data. User B's reads against User A resource
IDs returned zero rows across applications, history, events, offers,
outcomes, and preferences. User B's own stage remained present.

## RLS Policy Review

All eight architecture-defined user-owned tables have RLS enabled:

```text
profiles
user_preferences
pipeline_stages
applications
application_history
recruitment_events
application_offers
application_outcomes
```

Policy inventory: 21 operation-specific policies. Ownership predicates use
`auth.uid()` for user-owned rows and `id = auth.uid()` for profiles.
Child INSERT/UPDATE policies additionally verify the referenced application
belongs to the authenticated user. No broad `public` or `anon` data policy
was found.

Database relationship checks: composite ownership foreign keys prevent
cross-user application/stage and child-resource linkage. Direct system-stage
delete remains blocked with `42501`; custom-stage deletion remains allowed.

## SECURITY DEFINER Review

Reviewed all seven public SECURITY DEFINER functions currently present:

```text
close_application
create_application
handle_new_user
move_application
protect_system_pipeline_stage
record_application_archive_change
reopen_application
```

All are postgres-owned and configure `search_path = ''`. The F-06 trigger
uses `SECURITY DEFINER` because it must inspect `auth.users` while running
under cascade/direct-delete contexts; it uses a schema-qualified
`auth.users` reference, no dynamic SQL, no user-controlled object names,
and no new grants. Its guard still denies direct system-stage deletion
while the owner exists. No privilege-escalation path was identified.

## Session / Route Checks

Unauthenticated protected-route behavior was covered by direct navigation
after session logout: requests redirect to `/masuk?next=...`. Anonymous
PostgREST data read and RPC move were denied. Authenticated User A/B sessions
could access only their own domain rows.

## Secret Exposure

The service-role key is read only by server-only `src/lib/supabase/admin.ts`
and is used only for the guarded account-deletion purpose. The client bundle
scan found no `SUPABASE_SERVICE_ROLE_KEY`, `service_role`, `sb_secret_`, or
other service-role markers in `.next/static` chunks. No credential/token was
written to this report.

## Release Decision (Security / RLS)

**SECURITY GATE: PASS.** No Critical/High security issue or cross-user data
isolation failure was found. Applyo is safe to continue to **Performance Audit**
from the security/RLS perspective. Overall deployment readiness remains
**NOT READY** because the previously recorded non-security blockers remain:
F-01, F-03, F-04, and F-05.

## Files Created / Changed by Security Audit

- Updated: `TEST-REPORT.md` only.
- No source code, migration, policy, or configuration was changed.

---

# Performance Audit

> **Mode:** AUDIT ONLY (2026-09-09 UTC). Tidak ada source code, migration,
> configuration, atau dependency yang diubah. Dev server yang sudah hidup di
> `http://localhost:3000` digunakan; tidak ada server/browser duplikat.
> Dataset dibuat pada akun QA disposable di Supabase lokal dan seluruh akun serta
> row turunannya dibersihkan (`cleanup: PASS`).

## Performance Summary

PASS: 3
FAIL: 2 (issue findings; tidak ada functional/query execution failure)
BLOCKED: 7
SKIPPED: 1

Critical: 0
High: 0
Medium: 1
Low: 1

**PERFORMANCE GATE: BLOCKED.** Data/query path untuk 10, 50, 100, dan 500
applications selesai tanpa error dan realistic heavy-use 100 applications masih
cepat. Namun Chrome headed tidak dapat dihubungkan karena ChatGPT browser
extension tidak terpasang dan native-host manifest tidak tersedia. Karena itu
rendering/drag/input latency, CLS, memory, dan long blocking task tidak dapat
diukur secara valid pada browser aktual.

## Environment dan Metode

- Local Next.js development server, Windows, Supabase lokal.
- Median dari 3 warm samples per dataset; angka adalah local baseline, bukan
  prediksi latency cloud.
- Fixture per application: company/position/location/source/date, deskripsi
  pekerjaan realistis (~1.4 KB), notes (~240 B), 1 history row, dan 1 event untuk
  setiap 2 applications; enam active stages terdistribusi merata.
- Query measurement memakai authenticated user/RLS dan bentuk query yang sama
  dengan `getBoard()`, `ownedRows()`, dan search path. RPC move memakai
  `move_application` dengan neighbor valid.
- Static request-fan-out review mencakup layout dan seluruh service pada Landing,
  Dashboard, Applications, Application Detail, Calendar, dan Analytics.
- Lighthouse: SKIPPED karena Chrome headed tidak tersedia. Dev-only HMR payload
  tidak dipakai sebagai production bundle verdict.

## Dataset Measurements

| Applications | Board queries | Board payload | Full-domain queries | Full-domain payload | Search page 20 | Card derivation CPU | Analytics scan CPU | Move RPC |
|--------------|---------------|---------------|---------------------|---------------------|----------------|---------------------|--------------------|----------|
| 10 | 49.72 ms | 11.5 KB | 67.34 ms | 31.1 KB | 31.28 ms | 0.06 ms | 0.03 ms | 68.24 ms |
| 50 | 27.87 ms | 49.9 KB | 46.22 ms | 142.9 KB | 19.47 ms | 0.22 ms | 0.13 ms | 23.31 ms |
| 100 | 40.03 ms | 97.8 KB | 47.95 ms | 282.6 KB | 15.86 ms | 1.12 ms | 0.81 ms | 16.15 ms |
| 500 | 52.37 ms | 482.4 KB | 150.76 ms | 1,401.2 KB | 12.52 ms | 17.75 ms | 9.48 ms | 12.10 ms |

Interpretasi:

- 10 / 50: PASS pada data/query/RPC baseline; browser interaction BLOCKED.
- 100: PASS sebagai realistic heavy-use data/query baseline; tidak ada
  multi-second query atau CPU stall. Visible Kanban render/drag tetap BLOCKED.
- 500: query dan RPC tetap selesai cepat secara lokal, tetapi payload full-domain
  mencapai ~1.40 MB dan client rendering/drag belum dapat divalidasi. Sesuai
  arsitektur, 500 active cards diperlakukan sebagai advisory/stress boundary.

## Results per Test

| Test ID | Status | Evidence |
|---------|--------|----------|
| PERF-001 | PASS | Landing 5x: median TTFB 189 ms, median total 190 ms, HTML 43,333 B; public asset hanya `favicon.svg` 355 B |
| PERF-002 | BLOCKED | Dashboard 100-app data path 47.95 ms / 282.6 KB; page load, CLS, dan long-task browser tidak dapat diukur |
| PERF-003 | BLOCKED | Kanban 10: board 49.72 ms / 11.5 KB, move RPC 68.24 ms; visible render/drag tidak terukur |
| PERF-004 | BLOCKED | Kanban 50: board 27.87 ms / 49.9 KB, move RPC 23.31 ms; visible render/drag tidak terukur |
| PERF-005 | BLOCKED | Kanban 100: board 40.03 ms / 97.8 KB, move RPC 16.15 ms; visible render/drag tidak terukur |
| PERF-006 | BLOCKED | Kanban 500: board 52.37 ms / 482.4 KB, derivation CPU 17.75 ms, move RPC 12.10 ms; render/memory/drag tidak terukur |
| PERF-007 | PASS | Search pada 500 apps, page 20: median 12.52 ms; server-side pagination tetap digunakan |
| PERF-008 | SKIPPED | Input/filter responsiveness membutuhkan browser; tidak menginvestigasi ulang missing filters F-04 |
| PERF-009 | PASS | Analytics query payload tersedia dalam 150.76 ms pada 500; measured scan CPU 9.48 ms, tanpa error |
| PERF-010 | BLOCKED | Detail query count konstan terhadap total dataset dan child rows difilter by `application_id`; large-detail render/long-task browser tidak terukur |
| PERF-CAL-001 | BLOCKED | Calendar range query pada 500-app fixture median 25.34 ms dan application lookup tetap batched; month render/navigation responsiveness tidak terukur |

## Network / Query Review

Tidak ditemukan pola N+1 berbentuk satu request per application. Board memakai
empat batched queries, Calendar dua range queries + satu batched application
lookup, dan detail memakai fixed-count child queries.

Namun terdapat fixed request fan-out dan query berulang:

- Dashboard: sekitar 11 auth/data calls termasuk workspace layout.
- Analytics: sekitar 9 auth/data calls termasuk layout.
- Applications board: sekitar 11 calls; stages diambil oleh `getBoard()` dan
  kembali oleh `getApplicationStages()`.
- Applications list: sekitar 16 calls karena full board tetap diambil lalu
  `searchApplications()` melakukan query paginated + context sendiri.
- Application Detail: sekitar 15 calls; stages diambil hingga tiga kali dan
  `requireAuth()` diulang pada service nested/parallel.
- Calendar: sekitar 8 calls termasuk layout/preferences/auth.

Ini bukan request storm yang tumbuh satu-per-card, tetapi dua redundansi yang
layak dicatat sebagai issue di bawah.

## Bundle / Asset Review

Most recent production artifact yang tersedia (dibuat sebelum perubahan a11y
terakhir) berisi 36 static files: total 1.27 MB raw, JavaScript 1.02 MB, CSS
101 KB, fonts 145 KB; chunk terbesar 229 KB raw. Route-referenced raw JS:

| Route | Raw JS |
|-------|--------|
| Landing | 220 KB |
| Dashboard | 106 KB |
| Applications | 275 KB |
| Application Detail | 201 KB |
| Calendar | 113 KB |
| Analytics | 106 KB |

Tidak ada image/video/font custom besar di `public/`; hanya favicon 355 B.
Tidak ada obvious major asset regression pada artifact tersebut. Exact current
production bundle comparison tidak dijalankan karena audit ini hanya boleh
memperbarui report dan artifact build lebih lama daripada perubahan source
terakhir. Payload dev 5.07 MB yang terlihat pada Landing didominasi React,
Next DevTools, dan HMR, sehingga tidak dianggap production regression.

## Performance Issues

### PERF-ISSUE-001 — Dashboard/Analytics memuat seluruh domain rows dan large text

Status: PASS (FIXED 2026-09-09; see fix verification below)
Severity: Medium -> resolved
Scenario/dataset: Dashboard dan Analytics, 100 realistic / 500 stress.

Expected: summary/analytics mengambil aggregate atau DTO kolom minimum; board
dan summary tidak memindahkan job description/notes penuh yang tidak dirender.

Actual (before fix): keduanya memanggil `ownedRows()` yang menjalankan enam `select("*")`
paralel (`applications`, stages, events, history, outcomes, offers), lalu
menghitung summary di Next.js. Pada fixture realistis:

Measurement/evidence:

- 100 applications: 282.6 KB, median query fan-in 47.95 ms;
- 500 applications: 1,401.2 KB, median 150.76 ms;
- per-application event/history lookup pada Dashboard/card dan beberapa
  Analytics checks memakai repeated array scan; measured proxy CPU naik dari
  1.12/0.81 ms (100) ke 17.75/9.48 ms (500).

Impact: belum menyebabkan freeze pada local data path dan 100-app scenario
masih nyaman, tetapi payload tumbuh linear dengan large text dan CPU scan
mendekati kuadratik terhadap applications × child rows. Cloud latency/serverless
memory akan memperbesar biaya pada heavy users.

### PERF-ISSUE-002 — Applications list selalu memuat full board dan context duplikat

Status: FAIL
Severity: Low
Scenario/dataset: `/aplikasi?view=list`, terutama 100 / 500 applications.

Expected: list view memuat page yang diminta serta lookup/filter facets minimum.

Actual (before fix): route selalu menjalankan `getBoard()` untuk kedua view, kemudian pada
list view juga menjalankan `searchApplications()` (paginated applications,
stages, events, history). `getApplicationStages()` juga berjalan terpisah.

Measurement/evidence:

Dengan fixture audit, full-board overhead sendiri adalah 97.8 KB pada 100 dan
482.4 KB pada 500, sebelum payload list page. Request fan-out route diperkirakan
~16 auth/data calls tetapi tetap fixed, bukan N+1.

Impact: tidak memblokir penggunaan lokal dan list search tetap 12.52 ms pada
500, namun pagination kehilangan sebagian manfaat karena board/context penuh
tetap diambil dan diproses.

## Layout Shift, Freeze, dan Kanban Responsiveness

- CLS/layout shift: BLOCKED (membutuhkan browser performance entries).
- Long blocking task / UI freeze / memory: BLOCKED.
- Kanban data preparation: PASS hingga 500 (maksimum measured CPU 17.75 ms).
- Canonical move RPC: PASS hingga 500 (median 12.10–68.24 ms local).
- Visible card rendering dan pointer/keyboard drag latency: BLOCKED; karena itu
  belum boleh diklaim bahwa Kanban 100/500 sepenuhnya responsif di browser.

## Release Decision (Performance)

Belum aman menutup Required Performance Gate sebagai PASS karena evidence
browser untuk 100-card Kanban, CLS, dan long task belum tersedia. Tidak ada
Critical/High performance issue, N+1, request storm per-card, atau obvious
bundle/asset regression yang ditemukan. Dua issue baru bersifat Medium/Low.

Status menuju tahap berikutnya: **BLOCKED untuk Final Production Smoke** sampai
Chrome headed performance verification selesai. **Preview/Cloud Verification
untuk F-01 tetap aman dilanjutkan** karena audit ini tidak menemukan performance
blocker Critical/High dan tidak menginvestigasi ulang F-01/F-03/F-04/F-05.

## Files Created / Changed by Performance Audit

- Updated: `TEST-REPORT.md` only.
- Source code/configuration/migrations: nihil.
- Test data: empat akun performance disposable beserta seluruh domain rows telah
  dihapus; cleanup seluruh siklus yang sempat membuat data: PASS.

## Initial Continuation Attempt — Playwright MCP (superseded)

Status: BLOCKED

Scope yang dicoba hanya bagian Performance Audit yang sebelumnya BLOCKED:

- Kanban render pada 100 applications;
- drag responsiveness;
- CLS/layout shift;
- long tasks/UI freeze;
- browser responsiveness pada Dashboard, Applications, Application Detail,
  Calendar, dan Analytics.

Environment preparation: PASS. Dev server existing merespons HTTP 200. Fixture
disposable berhasil disiapkan dengan 100 active applications, 90 recruitment
events, 140 history rows, enam active stages, realistic long description/notes,
dan satu large-detail application dengan tambahan 40 events + 40 history rows.

Actual blocker: Playwright MCP dipanggil secara eksplisit, tetapi server tool
menolak baik `browser_navigate` maupun read-only `browser_tabs list` sebelum
session/tab dapat dibuat dengan hasil: `MCP tool call requires approval, but
approval policy is never`. Tidak ada Browser bawaan, Computer Use, Chrome
extension/native host, Playwright CLI, atau browser substitute yang digunakan.
Sesuai anti-stuck rule, action tidak diulang lebih lanjut.

Expected: Playwright MCP dapat membuka Chrome headed pada dev server dan
mengambil Performance API evidence untuk navigation/render, LayoutShift,
LongTask, event-loop responsiveness, DOM/card count, serta drag start→drop.

Actual: tidak ada browser page yang dapat dibuka, sehingga tidak ada measurement
baru yang sah untuk Kanban 100, drag, CLS, long task, UI freeze, atau relevant-page
responsiveness. Status PERF-002/003/004/005/006/010 dan PERF-CAL-001 tetap
BLOCKED; hasil query/RPC yang sudah PASS tidak diulang.

Cleanup: PASS. Akun `perf-browser-audit@applyo.test` dan seluruh fixture 100-app
beserta child rows telah dihapus melalui local admin API. Tidak ada source code,
configuration, migration, atau test artifact baru yang dibuat.

Final Performance Audit status tetap **BLOCKED**. Dua issue yang sudah ditemukan
tetap FAIL (`PERF-ISSUE-001` Medium, `PERF-ISSUE-002` Low); tidak ada evidence
baru yang mengubah severity. Preview/Cloud Verification F-01 tetap aman
dilanjutkan, tetapi Required Performance Gate belum dapat ditutup sebagai PASS.

## Final Playwright MCP Completion (2026-09-09)

> Section ini menggantikan keputusan BLOCKED pada initial continuation attempt
> di atas. Playwright MCP kemudian tersedia dan dipakai langsung dengan Chrome
> headed. Tidak digunakan built-in Browser, Computer Use, Chrome extension/native
> host, atau Playwright CLI. Dev server existing tetap dipakai.

### Final Status

PASS: 11
FAIL: 2 issue findings
BLOCKED: 0
SKIPPED: 1 (PERF-008; F-04 tidak diinvestigasi ulang)

Critical: 0
High: 0
Medium: 1
Low: 1

**PERFORMANCE AUDIT: FAIL.** Seluruh browser coverage yang sebelumnya BLOCKED
sudah selesai. Kanban 100-app initial render, CLS, dan responsiveness
Dashboard/Application Detail/Analytics PASS. Calendar yang sebelumnya FAIL sudah
diperbaiki. Drag persistence dan responsiveness sekarang PASS setelah fix
PERF-ISSUE-004. Temuan lama PERF-ISSUE-001/002 tetap terbuka.

### Kanban — 100 Applications

Status: PASS untuk page/initial render responsiveness.

Dataset: 100 active applications, 50 recruitment events, 100 history rows,
deskripsi/notes realistis, terbagi pada enam tahap. Browser viewport default
desktop Chrome headed.

Measurement/evidence:

- TTFB 390 ms; FCP 1,164 ms; DCL/load ~2,385 ms (local dev).
- RSC/document decoded body 146,877 B.
- Progressive initial DOM: 18 cards (3 per stage), 6 `Muat lebih banyak`,
  876 DOM nodes; JS heap ~36.7 MB.
- Initial render: CLS 0, long tasks 0, post-load frame gap p95 16.8 ms / max
  16.9 ms.
- Satu progressive load 18→21 cards: settle ~259.7 ms, CLS 0, satu 140 ms
  long task. Terasa selesai tanpa multi-second freeze.
- Stress-only expansion seluruh 100 cards melalui 30 klik otomatis rapat:
  3,734 DOM nodes, 10.15 s wall, 39 long tasks, max 378 ms, total blocking
  5.54 s; setelah settle frame gap kembali p95 16.9 ms. Ini bukan normal single
  user action, tetapi menunjukkan jank bila semua kartu dipaksa masuk DOM cepat.

Expected: 100-application board dapat dibuka tanpa severe freeze dan tetap
memberi respons visual stabil.

Actual: initial board memenuhi expectation karena progressive rendering. Full
100-card burst memiliki blocking work, tetapi normal initial path tidak.

### Kanban — 500 Applications Stress Observation

Status: PASS (advisory initial-render observation).

- TTFB 271 ms; FCP 1,020 ms; DCL/load ~1,961 ms.
- Decoded body 401,837 B.
- Progressive DOM tetap 18 cards / 876 nodes, bukan 500 card nodes sekaligus.
- CLS 0; satu long task 61 ms; frame gap p95/max 16.9 ms; heap ~26.3 MB.

Initial board tetap responsif pada 500 records karena progressive rendering.
Seluruh 500 cards tidak dipaksa ke DOM karena 100-card burst sudah menunjukkan
biaya blocking dan 500 merupakan stress/advisory boundary menurut arsitektur.

### Drag Interaction Responsiveness

Status: PASS (FIXED 2026-09-09; see PERF-ISSUE-004 fix verification below).

Pointer drag lintas Dilamar→Seleksi Awal dicoba dua kali (manual mouse sequence
dan Playwright MCP `dragTo`). Keduanya mengakhiri overlay secara bersih tetapi
card tetap di kolom sumber, tanpa error UI/console. Sesuai anti-stuck rule tidak
diulang lagi. KeyboardSensor juga diperiksa dua kali; live region mencatat drop
ke droppable card itu sendiri sehingga tidak terjadi stage move. Evidence audit
a11y sebelumnya bahwa keyboard drag pernah berhasil tidak dipakai sebagai angka
latency baru.

Expected: drag dapat diselesaikan sehingga waktu pointer/keyboard drop→optimistic
settle dapat diukur.

Actual: automation tidak menghasilkan cross-column move; latency drag yang sah
tidak tersedia. Ini dicatat sebagai measurement blocker, bukan performance
failure atau investigasi ulang functional Kanban persistence.

### CLS / Layout Shift

Status: PASS.

PerformanceObserver `layout-shift` dipasang sebelum navigation:

- Applications 100 initial: 0.
- Applications full-100 expansion: delta 0.
- Applications 500 initial: 0.
- Dashboard: 0.
- Application Detail: 0.00014 (negligible).
- Calendar cold + warm: 0 / 0.
- Analytics: 0.

Tidak ditemukan unexpected layout shift yang material.

### Long Tasks / UI Freeze dan Relevant Pages

| Page / dataset | TTFB | FCP | DCL/load | CLS | Long tasks | Settled frame gap |
|----------------|------|-----|----------|-----|------------|-------------------|
| Dashboard / 100 | 227 ms | 836 ms | 2,213 ms | 0 | 0 | max 17.3 ms |
| Applications / 100 | 390 ms | 1,164 ms | 2,385 ms | 0 | 0 | p95 16.8 ms |
| Application Detail / 100 total | 1,025 ms | 1,604 ms | 3,424 ms | 0.00014 | 0 | max 17.1 ms |
| Calendar / 50 events, cold | 446 ms | 1,040 ms | 4,977 ms | 0 | 2; max 1,259 ms; total 2,493 ms | max 33.3 ms |
| Calendar / 50 events, warm | 201 ms | 792 ms | 3,355 ms | 0 | 2; max 1,161 ms; total 1,990 ms | max 17.0 ms |
| Analytics / 100 | 768 ms | 1,036 ms | 2,664 ms | 0 | 0 | max 16.8 ms |

Dashboard, Applications initial, Detail, dan Analytics tidak membeku dan frame
cadence stabil setelah load. Calendar menghasilkan dua long tasks >1.1 detik
pada cold maupun satu warm repeat; ini bukan hanya first-compile outlier.
Console review seluruh sesi: 0 browser console errors.

### PERF-ISSUE-003 — Calendar memiliki repeated >1s long tasks pada 50 events

Status: PASS (FIXED 2026-09-09)
Severity: Medium
Scenario/dataset: Calendar September 2026, akun dengan 100 applications dan 50
scheduled events dalam visible month; Chrome headed, local dev server.

Expected: Calendar dapat hydrate/render tanpa long blocking task atau UI freeze;
normal dataset tidak menahan main thread selama >1 detik.

Actual: dua navigasi menghasilkan hasil konsisten:

- cold: DCL 4,977 ms; 2 long tasks; max 1,259 ms; total 2,493 ms;
- warm: DCL 3,355 ms; 2 long tasks; max 1,161 ms; total 1,990 ms.

FCP tetap 792–1,040 ms, CLS 0, dan frame cadence kembali ~16.9 ms setelah
settle, tetapi main-thread blocking sebelum interaktif melanggar expectation
`no severe UI freeze`. Tidak ada console error. Root cause/optimization tidak
diinvestigasi pada audit-only phase.

### Final Test Status Mapping

- PERF-002 Dashboard: PASS.
- PERF-003/004 Kanban 10/50: PASS by stronger 100-app browser scenario; tidak
  diulang sebagai dataset terpisah.
- PERF-005 Kanban 100 render dan drag responsiveness: PASS setelah fix
  PERF-ISSUE-004.
- PERF-006 Kanban 500: PASS advisory initial-render observation.
- PERF-010 large-detail/browser responsiveness: PASS untuk page responsiveness;
  detail fixture menggunakan realistic long fields pada 100-app account.
- PERF-CAL-001: PASS setelah fix PERF-ISSUE-003.
- CLS across relevant pages: PASS.
- Long-task/UI-freeze: PASS setelah fix PERF-ISSUE-003.

### Final Release Decision (Performance)

Required Performance Gate belum PASS karena PERF-ISSUE-001/002 tetap terbuka.
Tidak ada lagi coverage BLOCKED; PERF-ISSUE-003/004 sudah fixed. Tidak ditemukan
Critical/High performance issue; Kanban 100 dan 500 initial render responsif,
CLS bersih, dan tidak ada console error.

**Aman lanjut ke Preview/Cloud Verification F-01.** Final performance sign-off
tetap menunggu keputusan atas PERF-ISSUE-001/002.

### Cleanup / Files

- Updated: `TEST-REPORT.md` only.
- Source code/configuration/migrations: nihil.
- Disposable fixture: 500 applications, 250 events, 500 history rows, dan akun
  `perf-browser-audit@applyo.test` dihapus; cleanup PASS.
- Playwright MCP page ditutup; tidak ada browser session tambahan yang dibiarkan.

## PERF-ISSUE-003 Fix Verification (2026-09-09)

Status: **PASS / FIXED**
Severity: Medium → resolved

### Root Cause

`CalendarView` melakukan dua jenis kerja main-thread yang berlipat terhadap
jumlah event:

- Month dan Agenda selalu dirender bersamaan; CSS hanya menyembunyikan view
  nonaktif, sehingga 50 event menghasilkan dua tree event sekaligus.
- Setiap active date cell (~30/31 per bulan) menjalankan `events.filter(...)`.
  Callback memanggil `localDay()`, yang membuat `Intl.DateTimeFormat` baru per
  event. Pada September dengan 50 event ini menghasilkan 1,500 evaluasi/filter
  beserta formatter temporer, ditambah formatter baru untuk waktu, bulan, dan
  full date pada setiap item.

Profil kode dan DOM mengonfirmasi bahwa biaya tersebut berada pada transformasi
dan render client, bukan query Calendar atau data correctness.

### Targeted Change

- Render hanya Month atau Agenda yang sedang aktif.
- Kelompokkan event per local day satu kali dengan `Map`, menggantikan filter
  seluruh event pada setiap calendar cell.
- Reuse empat formatter berbasis timezone melalui `useMemo` dan satu title
  formatter tingkat modul.
- Memoize calendar geometry serta derived event display values.

Tidak ada perubahan pada query, DTO, sorting canonical, CSS, UI, atau behavior.

### Before / After — Playwright MCP, Chrome Headed

| Dataset / run | Before max long task | After long tasks | DCL/load after | CLS | Rendered active events |
|---------------|----------------------|------------------|----------------|-----|------------------------|
| 50 events, cold | 1,259 ms (2 tasks; total 2,493 ms) | 1 task; max/total 64 ms | 1,675 / 1,787 ms | 0 | Month 50; Agenda 0 |
| 50 events, warm | 1,161 ms (2 tasks; total 1,990 ms) | 0 | 1,043 / 1,045 ms | 0 | Month 50; Agenda 0 |
| 10 events | not previously blocked | 0 | 995 / 995 ms | 0 | Month 10; Agenda 0 |

Cold 50-event maximum blocking turun 94.9% (1,259 → 64 ms); warm turun
100% (1,161 → 0 ms). Tidak ditemukan significant UI freeze. Switch
Month→Agenda pada 50 event memasang 50 Agenda rows dan melepas Month tree;
interaction mencatat satu 56 ms task, CLS 0.

### Correctness / Regression

- Month/Agenda 10 events: 10/10 titles identik; inactive view tidak berada di
  DOM; switch kembali menampilkan 10 Month events.
- Month/Agenda 50 events: seluruh 50 events tampil; event detail mempertahankan
  title, company, position, time/location, dan application link.
- Navigation September→Agustus→September: PASS; counts 50→0→50 dan month title
  benar.
- Edit event: PASS; title baru persisted di Application Detail dan muncul pada
  Calendar.
- Delete event: PASS; Calendar count berubah 50→49 dan event tidak lagi tampil.
- Current-page browser console setelah final navigation: 0 errors.
- Fixture disposable dan seluruh child rows: cleanup PASS; Playwright page
  ditutup.

### Quality Checks

- `npx eslint src/components/calendar-view.tsx`: PASS.
- `npm run typecheck`: PASS.
- `npm test -- --run src/lib/dates.test.ts`: PASS (5/5).

Final: **PERF-ISSUE-003 PASS / FIXED.**

## Final Cross-Column Drag Verification (2026-09-09)

Environment: Playwright MCP, Chrome headed, existing local dev server, satu
browser session.

Dataset: 100 active applications tersebar pada enam stage. Progressive board
merender 18 cards (3 per stage). Kartu disposable `Drag Audit Source` berada di
Applied/Dilamar; target adalah Screening/Seleksi Awal.

### Result

Status: **FAIL** (functional move/persistence PASS; responsiveness FAIL)

- Cross-column move Applied → Screening: PASS.
- Initial counts: Applied 18, Screening 17.
- Setelah drop: Applied 17, Screening 18.
- Setelah reload: kartu tetap terlihat di Screening dengan counts 17/18.
- Database: `stage=screening`; satu `stage_changed` history tercatat.
- Browser console pada final page: 0 errors.

Attempt accounting sesuai anti-stuck rule:

1. Pointer attempt 1 berhenti sebelum `pointerdown` karena selector geometry
   target tidak menemukan element; tidak ada gesture atau perubahan board.
2. Pointer attempt 2 mengaktifkan overlay, melewati Screening, dan setelah
   pointer release berhasil memindahkan kartu. Probe exact-column `drop-target`
   timeout karena collision resolver memilih droppable card di dalam Screening,
   bukan stage container; gesture tidak diulang. DnD live region, DOM, database,
   history, dan reload mengonfirmasi drop berhasil.

### Responsiveness Evidence

- Visual drag overlay muncul pada activation, tetapi rAF instrumentation
  mencatat frame gap maksimum 649.8 ms selama activation/movement. Karena
  timestamp overlay tidak sempat dikembalikan sebelum probe target timeout,
  interaction→visual response dicatat secara konservatif sebagai sekitar
  0.65–0.8 detik, bukan angka latency presisi.
- Activation/movement: 2 long tasks; 662 ms dan 140 ms.
- Drop/optimistic update: 2 long tasks; 209 ms dan 150 ms.
- Maksimum seluruh drag/drop: **662 ms**; total observed blocking 1,161 ms.
- Tidak ada permanent hang; overlay hilang dan board kembali interaktif setelah
  drop. Namun stall ~650 ms merupakan significant transient UI freeze dan tidak
  memenuhi expectation drag responsif.
- CLS selama sesi: 0.

### PERF-ISSUE-004 — Cross-column drag memiliki main-thread stall 662 ms

Status: PASS (FIXED 2026-09-09; see fix verification below)
Severity: Medium
Scenario/dataset: pointer drag Applied → Screening pada board 100 applications,
18 cards progressively rendered.

Expected: drag memberi visual feedback segera, mengikuti pointer tanpa
significant main-thread stall, dan optimistic drop settle tanpa UI freeze.

Actual: move dan persistence benar, tetapi activation/movement menghasilkan
long task maksimum 662 ms dengan frame gap 649.8 ms; drop juga menghasilkan
long task maksimum 209 ms. Pengguna dapat merasakan jeda sementara walaupun
tidak terjadi hang atau kehilangan data.

Audit-only: root cause dan optimization tidak diinvestigasi atau diperbaiki.

### Final Performance Decision

**PERFORMANCE AUDIT: FAIL.** Tidak ada bagian performance yang masih BLOCKED.
PERF-ISSUE-003/004 sudah fixed; PERF-ISSUE-001 (Medium) dan PERF-ISSUE-002 (Low)
tetap terbuka. Required Performance Gate belum PASS karena dua issue tersebut.

**Aman lanjut ke Preview/Cloud Verification F-01** karena move tersimpan benar
dan tidak ditemukan Critical/High performance issue. Final performance sign-off
menunggu keputusan atas PERF-ISSUE-001/002.

Cleanup: akun disposable beserta 100 applications dan child rows dihapus; PASS.
Playwright page ditutup. Source code tidak diubah; hanya `TEST-REPORT.md` yang
diperbarui.

## PERF-ISSUE-004 Fix Verification (2026-09-09)

Status: **PASS / FIXED**
Severity: Medium → resolved

### Root Cause

Chrome DevTools trace dan sampling CPU profile pada successful cross-column
drag mengisolasi stall di React render work:

- main task 570 ms berada pada React scheduler `performWorkUntilDeadline`;
- `React.createElement` menggunakan ~507 ms sampled self time dan `jsxDEV`
  ~224 ms;
- setiap update DnD context membuat `SortableCard` aktif maupun nonaktif
  membentuk ulang subtree statis kartu, termasuk beberapa Lucide icon, links,
  menu, dan metadata;
- callback `onEvent` inline berubah saat parent render sehingga memo child akan
  terinvalidasi pada activation;
- layout/layerize hanya ~5.4 ms dan collision/scroll helpers masing-masing
  ~12–17 ms, sehingga bukan sumber utama freeze. RPC/history terjadi setelah
  optimistic drop dan bukan penyebab activation stall.

### Targeted Change

- Pisahkan menu/actions dan metadata card menjadi `memo` children agar DnD
  movement hanya memperbarui wrapper transform yang memakai `useSortable`.
- Memoize static `GripVertical` subtree pada drag handle.
- Stabilkan callback pembuka event dialog dengan `useCallback`.

Struktur DOM, visual card, drag handle, `DndContext`, `closestCorners`, overlay,
optimistic board update, RPC, ordering, history, dan rollback logic tidak diubah.
Perubahan hanya pada `src/components/application-workspace.tsx`.

### Before / After — Playwright MCP, Chrome Headed

Dataset: ~100 applications (100 saat profile baseline; 101 saat final karena
satu source card disposable terpisah), enam stages, 18 cards progressively
rendered.

| Measurement | Original issue | Reproduced profile | Final after fix |
|-------------|----------------|--------------------|-----------------|
| Interaction → overlay | ~650–800 ms conservative | 736.5 ms | 331.4 ms |
| Max long task | 662 ms | 570 ms | 182 ms |
| Total drag/drop blocking | 1,161 ms | 769 ms | 259 ms |
| Max rAF frame gap | 649.8 ms | 549.8 ms | 166.5 ms |
| Drop → optimistic DOM | not precisely captured | ≤247.7 ms | 141.2 ms |
| CLS | 0 | 0 | 0 |

Final long tasks: 182 ms saat activation/movement dan 77 ms pada later
movement/drop. Dibanding evidence awal, maksimum blocking turun 72.5%
(662→182 ms), total blocking turun 77.7% (1,161→259 ms), dan frame gap turun
74.4% (649.8→166.5 ms). Freeze 650–800 ms tidak lagi terjadi; residual dev-mode
jank berada di bawah 200 ms dan board langsung kembali interaktif.

### Regression / Persistence

- Final Applied → Screening pointer drag: PASS; overlay terlihat dan hilang
  setelah drop, source card muncul di target.
- Counts berubah Applied 18→17 dan Screening 18→19 pada final fixture.
- Reload: source card tetap terlihat di Screening.
- Database: final source `stage=screening`; satu `stage_changed` history.
- Card action menu setelah extraction: tiga actions tetap tampil; Escape menutup
  menu dan focus kembali ke trigger.
- Browser console pada final page: 0 errors.
- Fixture account, ~100 applications, dan child rows: cleanup PASS; Playwright
  page ditutup.

### Quality Checks

- `npx eslint src/components/application-workspace.tsx`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS (10 files, 48 tests).
- `git diff --check` untuk file scope: PASS.

### Final Performance Status

**PERF-ISSUE-004: PASS / FIXED.**

**PERFORMANCE AUDIT: FAIL** karena PERF-ISSUE-002 (Low) tetap terbuka.
Tidak ada performance coverage yang BLOCKED; PERF-ISSUE-001/003/004 sudah
fixed. Preview/Cloud Verification F-01 tetap aman
dilanjutkan karena tidak ada Critical/High performance issue dan Kanban move,
persistence, ordering, serta history PASS.

## PERF-ISSUE-001 Fix Verification (2026-09-09)

Status: **PASS / FIXED**
Severity: Medium -> resolved

### Root Cause

Dashboard dan Analytics berbagi `ownedRows()`, sehingga setiap page load
menjalankan enam query `select("*")` untuk seluruh domain. Akibatnya field besar
yang tidak pernah dirender -- terutama `applications.job_description`,
`applications.notes`, event notes/location/URL, history metadata, outcome notes,
serta offer benefits/notes -- tetap dibaca dari database dan masuk ke proses
server. Dashboard bahkan mengambil outcomes yang sama sekali tidak dipakai.

### Targeted Change

- `ownedRows()` dipisahkan menjadi loader khusus Dashboard dan Analytics dengan
  explicit column projection untuk setiap tabel.
- Dashboard sekarang menjalankan lima query fixed-count; query outcomes yang
  tidak digunakan dihapus. Upcoming-event DTO dipersempit ke enam field yang
  benar-benar dirender.
- Analytics tetap menjalankan enam query fixed-count dan tetap memakai stage
  history/outcome/offer untuk perhitungan reached-stage dan conversion; hanya
  kolom yang tidak berpartisipasi dalam formula yang dihilangkan.
- Business logic, RPC, persistence, ordering, dan formula analytics tidak
  diubah.

### Before / After Measurements

Fixture lokal realistis sengaja memakai large text per application (job
description sekitar 8 KB dan notes sekitar 4 KB), ditambah notes/metadata pada
child rows. Angka payload adalah ukuran JSON hasil query Supabase terautentikasi
sebelum mapping DTO; latency adalah observasi local-development, bukan cloud
benchmark.

| Dataset | Full-row reference | Dashboard projected | Reduction | Analytics projected | Reduction |
|---------|-------------------:|--------------------:|----------:|--------------------:|----------:|
| 100 applications | 1,915,384 B / 222.7 ms | 80,890 B / 42.4 ms | 95.8% | 54,279 B / 31.5 ms | 97.2% |
| 500 applications | 9,560,657 B / 737.7 ms | 402,850 B / 55.0 ms | 95.8% | 267,586 B / 46.0 ms | 97.2% |

Chrome headed / Playwright MCP warm navigation comparison:

| Dataset | Page | DCL before | DCL after | After long task |
|---------|------|-----------:|----------:|----------------:|
| 100 | Dashboard | 2,888 ms | 1,582 ms | none |
| 100 | Analytics | 3,459 ms | 1,519 ms | max 63 ms |
| 500 | Dashboard | 3,349 ms | 1,603 ms | none |
| 500 | Analytics | 2,831 ms | 1,189 ms | none |

RSC response size di browser tetap kurang-lebih sama karena summary DTO yang
dirender memang sama; pengurangan utama terjadi pada database-to-server payload.
Satu cold-compile Dashboard 500 menghasilkan 155 ms long task dan tidak dipakai
sebagai warm comparison. Tidak ada UI freeze signifikan pada hasil final.

### Correctness / Regression

- 100 applications: Dashboard tetap 100 total / 77 active / 75 interviews /
  25 assessments / 20 offers; Analytics tetap 100 total / 100 reached interview
  / 31 assessment / 31 offer / 10 hired; sources 34/33/33.
- 500 applications: Dashboard tetap 500 total / 386 active / 375 interviews /
  125 assessments / 100 offers; Analytics tetap 500 total / 500 reached
  interview / 153 assessment / 157 offer / 50 hired; sources 167/167/166.
- Upcoming dan needs-attention Dashboard identik sebelum/sesudah (3 dan 10).
  Trend Analytics tetap enam bucket. History-based reached-stage calculation
  tetap aktif dan hasilnya identik.
- Query count konstan terhadap dataset: Dashboard 5 dan Analytics 6 batched
  queries. Tidak ada query per application, N+1 baru, atau request storm.
- Console Chrome: 0 error relevan. Fixture 100/500 dan akun disposable berhasil
  dibersihkan.

### Quality Checks

- `npx eslint src/backend/services/queries.ts src/backend/dto.ts`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS (10 files, 48 tests).

### Final Status

**PERF-ISSUE-001: PASS / FIXED.** Payload database-to-server turun 95.8% pada
Dashboard dan 97.2% pada Analytics untuk 100 maupun 500 applications, tanpa
perubahan output atau analytics correctness.

**PERFORMANCE AUDIT: PASS.** PERF-ISSUE-001/002/003/004 sudah FIXED; tidak ada
performance issue atau coverage yang masih FAIL/BLOCKED.
Preview/Cloud Verification F-01 tetap diperlukan sebelum release.

## Preview/Cloud Verification — F-01 (2026-09-09)

Status: **BLOCKED — deployment Preview yang merepresentasikan repository ini
tidak tersedia**

### Scope / Decision

Target verifikasi adalah minimal 10 clean signup sessions:

`Register -> immediate first Dashboard -> Applications -> Calendar -> Analytics -> Settings -> logout`.

Tidak ada session yang dihitung PASS/FAIL karena tidak ditemukan deployment
Preview/Cloud yang dapat diidentifikasi sebagai build `jikrilar/applyo` ini.
F-01 historis tetap berstatus **STILL FAILING / OPEN pending cloud evidence**;
tidak diubah menjadi `CLOSED / NOT REPRODUCED IN CLOUD`.

### Deployment Discovery Evidence

- `git remote origin`: `https://github.com/jikrilar/applyo.git`, branch hanya
  `main`; tidak ada branch/tag preview.
- Repository tidak memiliki `.vercel`, deployment manifest, preview URL,
  deployment workflow, atau environment URL. `TASKS.md` masih menandai
  konfigurasi preview dan isolated preview Supabase sebagai TODO (INT-203).
- Kandidat publik `https://apply-o.vercel.app` diverifikasi dengan Chrome
  headed/Playwright MCP dan terbukti bukan build ini: landing/sign-in berbahasa
  Inggris, sign-in hanya menyediakan Google/GitHub OAuth, dan
  `https://apply-o.vercel.app/daftar` mengembalikan HTTP 404. Build ini
  seharusnya memiliki email/password `/daftar` dan route Dashboard berbahasa
  Indonesia. Kandidat itu juga menunjuk ke repository lain,
  `MartinKamburov/ApplyO`.
- Karena target signup dan data/auth environment berbeda, menjalankan akun QA
  pada kandidat tersebut tidak akan menjadi evidence F-01 untuk repository ini.

### Session / Evidence Result

| Item | Result |
|------|--------|
| Clean signup sessions executed against matching Preview | 0 / 10 (BLOCKED) |
| Immediate first Dashboard render | Not measurable on matching Preview |
| `read_domain_data` occurrence | Unknown — no matching Preview request |
| `get_preferences` occurrence | Unknown — no matching Preview request |
| Error boundary / failed fetch / 4xx/5xx for target build | Unknown — no matching Preview request |
| Console/network evidence | Candidate mismatch only: `/daftar` 404 on unrelated deployment |
| Source code changed | No |

### Final Decision

**F-01: OPEN / HISTORICAL INTERMITTENT — CLOUD VERIFICATION BLOCKED.** Tidak
ada evidence baru yang mengonfirmasi atau menutup F-01. Histori lokal (empat
kegagalan bergantian `get_preferences`/`read_domain_data`, kemudian 8/8 clean
local production-like sessions PASS) dipertahankan.

**Belum aman menyatakan Final Production-Like Smoke Test / Release Decision
PASS.** Langkah berikutnya memerlukan URL deployment Preview/Cloud yang benar,
commit/build identifier, dan isolated non-production Supabase environment;
setelah tersedia, ulangi 10 clean sessions tanpa reload/re-login penyelamat.

## PERF-ISSUE-002 Fix Verification (2026-09-09)

Status: **PASS / FIXED**
Severity: Low -> resolved

### Root Cause

Route `/aplikasi` memanggil loader yang sama untuk board dan List. Saat
`view=list`, page tetap menjalankan `getBoard()` (seluruh active applications,
seluruh recruitment events, dan seluruh history), `getApplicationStages()`,
serta `searchApplications()` yang mengambil page dan context-nya sendiri.
List hanya memakai board tersebut untuk stage/filter locations, sehingga card
DTO dan child rows penuh menjadi duplicate payload yang tidak dirender.

Selain itu, query context List masih mengambil field event/history/card yang
hanya dibutuhkan Kanban, termasuk event notes/URL dan history metadata.

### Targeted Change

- Page sekarang hanya memanggil `getBoard()` dan `getApplicationStages()` pada
  board view. List view hanya memanggil `searchApplications()` dan preferences.
- `searchApplications()` mengembalikan stage dan location facets bersama hasil
  page, sehingga tidak ada duplicate stage/full-board loader.
- Application, event, history, dan stage selects diproyeksikan ke kolom yang
  dipakai untuk tabel, filter, upcoming event, dan last activity.
- DTO List dipersempit ke field yang benar-benar dikirim ke client.
- Events/history diindeks per application sebelum mapping, menghindari repeated
  full-array scans. Upcoming sort memakai query fixed-count berbasis `user_id`
  pada dataset besar agar tidak membuat URL `.in(...)` ratusan UUID atau batch
  request per-card.

Board behavior, filtering semantics, sorting, pagination, edit/delete flow, dan
data correctness tidak diubah.

### Before / After Measurements

Fixture lokal: satu event dan satu history per application, dengan realistic
large text pada application/event/history. Payload adalah total JSON dari data
queries yang dijalankan untuk default List page (20 rows), tidak termasuk auth
dan preferences yang sama pada kedua versi. Angka after adalah upper bound
konservatif; final stage projection menghapus empat kolom tambahan setelah
measurement ini.

| Dataset | Before payload / data queries | After payload / data queries | Reduction |
|---------|------------------------------:|-----------------------------:|----------:|
| 100 applications | 1,120,226 B / 9 | <=18,064 B / 5 | >=98.39% |
| 500 applications | 4,827,672 B / 9 | <=27,123 B / 5 | >=99.44% |

Dengan preferences disertakan, fixed data request count route turun 10 -> 6.
Outcome filter menambah satu query pada kedua desain hanya bila digunakan;
jumlah request tetap konstan terhadap application count dan tidak ada N+1.

### Playwright MCP / Chrome Headed Regression

- 100 applications: default List menunjukkan `100 lamaran`, 20 rows pada page
  pertama. Warm DCL 3,356 ms, FCP 1,036 ms; dev-mode max long task 165 ms dan
  tidak ada UI freeze.
- 500 applications: default List menunjukkan `500 lamaran`, tetap 20 rows.
  DCL 2,163 ms, FCP 892 ms; max observed dev-mode long task 309 ms dan page
  kembali interaktif tanpa hang.
- Search exact `Perf Company 0499`: PASS, satu hasil benar.
- Location filter `Remote`: PASS, 166 hasil. Stage filter `Dilamar`: PASS,
  84 hasil dan seluruh 20 visible rows bertahap Dilamar.
- Applied ascending: PASS; first result `Perf Company 0000`, 1 Jan 2026.
- Upcoming ascending/descending: PASS pada 100 dan 500; 500 stress path tetap
  20-row paginated output dan tidak gagal karena oversized `.in(...)` URL.
- Page navigation/filter response berada sekitar 2.4-4.8 detik wall time pada
  local Next.js dev server; tidak ada freeze signifikan. Final successful page
  melaporkan 0 console errors.

### Quality / Cleanup

- `npx eslint src/app/(workspace)/aplikasi/page.tsx src/backend/services/queries.ts src/backend/dto.ts`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS (10 files, 48 tests).
- Fixture 100/500 applications beserta child rows dan akun disposable: cleanup
  PASS. Playwright MCP page ditutup.

### Final Status

**PERF-ISSUE-002: PASS / FIXED.** Full-board payload tidak lagi dimuat pada
List View; default List payload turun sedikitnya 98.39% (100) dan 99.44% (500),
dengan filtering, sorting, pagination, dan derived dates tetap benar.

**PERFORMANCE AUDIT: PASS** — 13 PASS, 0 FAIL, 0 BLOCKED, 1 SKIPPED. Seluruh
PERF-ISSUE-001/002/003/004 sudah FIXED dan tidak ada performance issue yang
tersisa. Preview/Cloud Verification F-01 tetap merupakan release gate terpisah
dan saat ini BLOCKED karena deployment yang cocok belum tersedia.

## Current Release Decision After F-01 Cloud Attempt

F-01 belum dapat ditutup: **OPEN / HISTORICAL INTERMITTENT — CLOUD
VERIFICATION BLOCKED**. Tidak ada matching Preview URL untuk menjalankan 10 clean
signup sessions, sehingga **belum aman menyatakan Final Production-Like Smoke
Test / Release Decision PASS**. Sediakan deployment Preview yang merepresentasikan
commit/build ini beserta isolated non-production Supabase, lalu lanjutkan sesi
cloud sesuai section verifikasi di atas.

## Preview Environment Preparation (2026-09-09)

Status: **BLOCKED — external Vercel/Supabase configuration required**

### Target / Build

| Item | Result |
|------|--------|
| Repository | `jikrilar/applyo` |
| Current HEAD SHA | `38bd638bc264c7a6f704760d5a3f1464b21875d0` |
| Preview URL | **Not provisioned** |
| Vercel build | **Not started — no Vercel project/integration** |
| Local production build sanity check | **PASS** (`npm run build`, Next.js 16.3.3; routes generated successfully) |
| Supabase environment | Local project only (`project_id = applyo`, `127.0.0.1:55431`) |
| Cloud database isolation | **Not verifiable — no isolated Supabase project configured** |
| Signup/login smoke check | **Not run — no matching Preview URL** |
| Production deployment | Not touched |

The worktree contains uncommitted changes from the preceding audit/fix cycles;
the SHA above is the current repository `HEAD`, not a claim that those working-
tree changes are already present in a remote deployment. No source logic,
production configuration, or secrets were changed in this preparation attempt.

### External Setup Required Manually

1. Commit and push the intended Applyo changes to a dedicated branch or other
   explicitly selected commit in `jikrilar/applyo`. Do not point Preview at
   unrelated `apply-o.vercel.app`/production deployments.
2. In Vercel, import `jikrilar/applyo` as a new project. Keep production
   deployment disabled for this task and enable Preview deployments for the
   selected branch/PR. Record the resulting immutable Preview URL and commit
   SHA.
3. Create a separate Supabase Cloud project for Preview (different project/ref
   and credentials from production). Apply all migrations from
   `supabase/migrations` through the migration workflow; do not copy production
   user/application rows.
4. Configure Supabase Auth for the Preview project: email/password signup
   enabled, QA email-confirmation policy selected deliberately, Preview Site
   URL set to the Vercel Preview URL, and any required redirect URL(s) added.
5. Set Vercel **Preview-only** environment variables to the isolated project:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only Preview key; never expose or
     commit it)

6. Verify the Preview project has RLS, user-init trigger/default stages, and
   database functions after migrations. If Vercel/GitHub integration is not
   used, configure the equivalent deployment hook/credentials manually; the
   repository currently has zero GitHub Actions workflows, hooks, deployments,
   environments, and repository secrets.
7. After the first successful Preview build, provide/record the URL and commit
   SHA, then run the separate 10-session F-01 verification. This preparation
   task intentionally did not start those signup sessions.

Until these external items exist, Preview Environment status remains
**BLOCKED**, F-01 remains **OPEN / HISTORICAL INTERMITTENT**, and the Final
Production-Like Smoke / Release Decision cannot be signed off.
