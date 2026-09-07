# Applyo

**Applyo** adalah web application gratis untuk membantu job seeker mencatat, mengelola, dan memantau seluruh proses lamaran pekerjaan dalam satu workspace berbasis Kanban.

Alih-alih menyimpan informasi lamaran di spreadsheet, notes, chat, screenshot, atau bookmark yang terpisah, Applyo menyatukan proses tersebut menjadi alur visual yang mudah dipantau:

```text
Simpan → Lamar → Pantau → Pindahkan → Tindak Lanjut → Wawancara → Tawaran → Hasil → Tinjau
```

Core experience Applyo adalah **Kanban-first job application tracking** dengan drag-and-drop, recruitment events, calendar, timeline, dan analytics.

> Status project: development / pre-deployment.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Application Lifecycle](#application-lifecycle)
- [Tech Stack](#tech-stack)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Workflow Penggunaan](#workflow-penggunaan)
- [Struktur Data Utama](#struktur-data-utama)
- [Security](#security)
- [Development Commands](#development-commands)
- [Testing](#testing)
- [Struktur Project](#struktur-project)
- [Deployment](#deployment)
- [Dokumentasi Project](#dokumentasi-project)
- [Troubleshooting](#troubleshooting)

---

## Fitur Utama

### Authentication

- Registrasi dengan email dan password.
- Login dan logout.
- Session berbasis cookie melalui Supabase Auth.
- Route workspace hanya dapat diakses oleh pengguna yang sudah login.

### Dashboard

Dashboard memberikan ringkasan cepat mengenai kondisi pencarian kerja pengguna:

- total lamaran;
- lamaran aktif;
- wawancara;
- asesmen;
- tawaran;
- agenda terdekat;
- lamaran yang membutuhkan perhatian.

### Kanban Application Board

Lamaran ditampilkan sebagai kartu pada pipeline rekrutmen.

Pengguna dapat:

- menambah lamaran baru;
- memindahkan kartu dengan drag-and-drop;
- mengubah stage;
- mempertahankan urutan kartu;
- melihat jumlah lamaran pada setiap stage;
- menyembunyikan stage aktif tertentu dari board.

Perubahan stage disimpan sebagai satu business operation di backend dan dicatat ke application history.

### Application List

Selain Kanban, Applyo menyediakan list view untuk meninjau lamaran secara lebih terstruktur.

List dapat digunakan untuk:

- pencarian;
- filter berdasarkan stage;
- filter lokasi;
- filter outcome;
- filter source;
- rentang tanggal;
- archived applications;
- sorting.

### Application Detail

Setiap lamaran memiliki halaman detail yang menyimpan konteks lengkap proses rekrutmen, termasuk informasi pekerjaan, notes, event, dan timeline perubahan.

### Recruitment Events

Applyo dapat mencatat event seperti:

- HR Interview;
- User Interview;
- Technical Interview;
- Final Interview;
- Technical Test;
- Coding Test;
- Psychological Test;
- Case Study;
- Take Home Assignment;
- Medical Check Up;
- Recruiter Contact;
- Follow-up;
- Offer;
- event lainnya.

Event dapat memiliki jadwal, deadline, lokasi/link, notes, dan status.

### Calendar

Calendar menggabungkan agenda recruitment dalam satu tampilan, terutama:

- interview;
- assessment;
- deadline.

Tanggal ditampilkan berdasarkan timezone yang dipilih pengguna.

### Analytics

Analytics membantu pengguna memahami perkembangan job hunting tanpa productivity score atau leaderboard.

Saat ini analytics menampilkan:

- total applications;
- interviews;
- assessments;
- offers;
- hired;
- application trend;
- conversion funnel;
- application sources.

### Settings

Pengguna dapat mengatur:

- display name;
- mata uang utama (`IDR` atau `USD`);
- format tanggal;
- timezone Indonesia (`WIB`, `WITA`, `WIT`);
- visibility stage pada Kanban board.

---

## Application Lifecycle

Setiap akun baru mendapatkan pipeline default berikut.

### Active Stages

```text
Incaran
   ↓
Dilamar
   ↓
Seleksi Awal
   ↓
Wawancara
   ↓
Asesmen
   ↓
Tawaran
```

### Closed Outcomes

```text
Diterima
Ditolak
Ditarik
Tanpa Kabar
```

Stage dan event merupakan dua konsep berbeda:

```text
Stage  = posisi lamaran saat ini
Event  = sesuatu yang terjadi pada proses recruitment
```

Contoh:

```text
Stage: Wawancara

Events:
02 Sep — HR Interview dijadwalkan
05 Sep — HR Interview selesai
08 Sep — User Interview dijadwalkan
```

---

## Tech Stack

### Application

- Next.js 16
- React
- TypeScript
- App Router
- Server Components
- Server Actions

### UI

- Tailwind CSS v4
- shadcn/ui / Radix UI primitives
- Lucide Icons
- dnd-kit
- Motion
- Zod

### Backend

- Supabase
- PostgreSQL 15
- Supabase Auth
- Row Level Security (RLS)
- PostgreSQL Functions / RPC

### Testing & Tooling

- Vitest
- Testing Library
- Supabase CLI
- pgTAP database tests
- ESLint
- Prettier

### Deployment Architecture

```text
GitHub
   ↓
Vercel
   ↓
Next.js

Supabase Cloud
   ↓
PostgreSQL + Auth
```

---

## Persyaratan Sistem

Untuk development lokal, pastikan tersedia:

- Git;
- Node.js;
- npm;
- Docker Desktop atau Docker-compatible container runtime;
- koneksi internet untuk instalasi dependency.

Supabase CLI sudah tersedia sebagai development dependency project dan dapat dijalankan melalui npm/npx.

Cek environment:

```bash
git --version
node --version
npm --version
docker --version
```

---

## Instalasi

### 1. Clone repository

```bash
git clone https://github.com/jikrilar/applyo.git
cd applyo
```

### 2. Install dependencies

```bash
npm install
```

Untuk instalasi yang benar-benar mengikuti lockfile:

```bash
npm ci
```

### 3. Start local Supabase

Pastikan Docker sudah berjalan, kemudian:

```bash
npm run db:start
```

Command tersebut menjalankan Supabase lokal tanpa Studio.

Jika ingin menjalankan Supabase beserta Studio:

```bash
npm run db:start:studio
```

Konfigurasi local Supabase menggunakan port berikut:

| Service | Port |
| --- | ---: |
| API | `55431` |
| PostgreSQL | `55432` |
| Studio | `55433` |
| Local SMTP UI | `55434` |
| SMTP | `55435` |
| POP3 | `55436` |

### 4. Lihat credential local Supabase

Jalankan:

```bash
npx supabase status
```

Catat nilai yang dibutuhkan untuk `.env.local`, terutama:

- API URL;
- publishable/anon key;
- service role key.

### 5. Buat `.env.local`

Linux/macOS:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Kemudian isi value menggunakan output dari `npx supabase status`.

### 6. Reset dan apply database schema

```bash
npm run db:reset
```

Command ini menjalankan ulang migration dan seed lokal.

> `db:reset` menghapus data pada database development lokal. Jangan menjalankannya pada database yang berisi data penting.

### 7. Jalankan aplikasi

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

---

## Konfigurasi Environment

Template environment tersedia pada:

```text
.env.example
```

Minimum configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55431
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=replace-with-local-publishable-key
SUPABASE_SERVICE_ROLE_KEY=replace-with-local-service-role-key
```

### `NEXT_PUBLIC_SUPABASE_URL`

URL Supabase yang digunakan browser dan server untuk mengakses backend.

Local default:

```text
http://127.0.0.1:55431
```

### `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Key browser-safe untuk Supabase client.

Data isolation tetap bergantung pada authentication dan Row Level Security.

### `SUPABASE_SERVICE_ROLE_KEY`

Server-only credential yang memiliki privilege tinggi.

Dalam Applyo key ini digunakan untuk administrative account operation yang dijaga di server.

**Jangan pernah:**

- menambahkan prefix `NEXT_PUBLIC_`;
- mengakses key ini dari Client Component;
- menaruhnya di source code;
- meng-commit `.env.local`;
- membagikannya ke publik.

---

## Menjalankan Aplikasi

Development frontend/backend Next.js:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Menjalankan hasil production build:

```bash
npm run start
```

Local Supabase harus tetap berjalan ketika aplikasi development menggunakan credential lokal.

---

## Workflow Penggunaan

### 1. Buat akun

Buka:

```text
/daftar
```

Daftar menggunakan email dan password.

Ketika akun dibuat, database otomatis membuat:

- profile;
- user preferences;
- 10 default pipeline stages.

Pada local development, email confirmation dinonaktifkan sehingga akun dapat langsung digunakan.

### 2. Login

Buka:

```text
/masuk
```

Setelah berhasil login, pengguna dapat mengakses workspace pribadi.

### 3. Lihat Dashboard

```text
/dashboard
```

Dashboard digunakan untuk melihat kondisi job search secara cepat, termasuk jumlah lamaran, upcoming agenda, dan items yang membutuhkan perhatian.

### 4. Tambahkan Lamaran

Buka:

```text
/aplikasi
```

Minimum data:

- Company;
- Position;
- Stage.

Data tambahan yang dapat disimpan antara lain:

- Job URL;
- Location;
- Work arrangement;
- Employment type;
- Source;
- Applied date;
- Salary range;
- Currency;
- Job description;
- Notes.

### 5. Kelola Lamaran di Kanban

Gunakan board untuk memindahkan lamaran mengikuti perkembangan proses recruitment.

Contoh:

```text
Incaran → Dilamar → Seleksi Awal → Wawancara
```

Saat card dipindahkan, backend memperbarui stage, ordering, dan application history secara konsisten.

### 6. Buka Detail Lamaran

Klik application card untuk melihat konteks lengkap sebuah lamaran.

Gunakan halaman detail untuk:

- memperbarui informasi pekerjaan;
- menambahkan notes;
- melihat timeline;
- mencatat recruitment events;
- mengikuti perkembangan proses recruitment.

### 7. Tambahkan Recruitment Event

Tambahkan interview, assessment, follow-up, atau event lainnya ke application terkait.

Gunakan `scheduled_at` untuk agenda dan `deadline_at` untuk tenggat jika relevan.

### 8. Pantau Kalender

```text
/kalender
```

Gunakan kalender untuk melihat interview, assessment, dan deadline dalam satu tampilan.

### 9. Tinjau Analytics

```text
/analitik
```

Gunakan analytics untuk memahami pola pencarian kerja, conversion funnel, dan sumber lamaran.

### 10. Atur Workspace

```text
/pengaturan
```

Atur profile, currency, format tanggal, timezone, dan stage yang ingin ditampilkan pada Kanban.

---

## Struktur Data Utama

Backend menggunakan beberapa entity utama.

```text
Auth User
├── Profile
├── User Preferences
├── Pipeline Stages
└── Applications
      ├── Application History
      ├── Recruitment Events
      ├── Application Offer
      └── Application Outcomes
```

### Applications

Menyimpan informasi lowongan dan status recruitment saat ini.

### Pipeline Stages

Menyimpan stage milik masing-masing user. Default system stages dibuat otomatis ketika akun baru dibuat.

### Application History

Menyimpan perubahan lifecycle secara append-only, seperti:

- application created;
- stage changed;
- application closed;
- application reopened;
- application archived;
- application restored.

### Recruitment Events

Menyimpan interview, assessment, recruiter contact, follow-up, offer, dan event lain.

### Application Outcomes

Menyimpan hasil closed lifecycle:

```text
hired
rejected
withdrawn
ghosted
```

---

## Security

Applyo menggunakan beberapa layer protection:

```text
Route Protection
      ↓
Server Authorization
      ↓
Supabase Auth
      ↓
PostgreSQL Row Level Security
```

### Row Level Security

RLS aktif pada table utama sehingga user hanya dapat mengakses data miliknya sendiri.

Ownership juga diperkuat dengan foreign key dan database constraints untuk mencegah hubungan data lintas user.

### Server-side Mutations

Business operation penting seperti create/move/close/reopen application menggunakan server-side service/RPC sehingga lifecycle dan history tidak bergantung hanya pada state frontend.

### Service Role Key

`SUPABASE_SERVICE_ROLE_KEY` harus selalu dianggap sebagai secret production.

---

## Development Commands

| Command | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan Next.js development server. |
| `npm run build` | Membuat production build. |
| `npm run start` | Menjalankan production build. |
| `npm run lint` | Menjalankan ESLint. |
| `npm run format` | Format source menggunakan Prettier. |
| `npm run format:check` | Memeriksa format tanpa mengubah file. |
| `npm run typecheck` | Menjalankan TypeScript type checking. |
| `npm test` | Menjalankan seluruh Vitest test. |
| `npm run test:backend` | Menjalankan backend test suite. |
| `npm run test:coverage` | Menjalankan test dengan coverage. |
| `npm run db:start` | Start local Supabase tanpa Studio. |
| `npm run db:start:studio` | Start local Supabase dengan Studio. |
| `npm run db:reset` | Reset database lalu apply migration/seed. |
| `npm run db:lint` | Menjalankan Supabase database lint. |
| `npm run db:test` | Menjalankan database tests. |

---

## Testing

Sebelum membuat perubahan besar atau deployment, jalankan minimum quality gate:

```bash
npm run lint
npm run typecheck
npm test
npm run test:backend
npm run db:test
npm run build
```

Project memiliki testing untuk beberapa layer:

```text
Unit Tests
Integration / Backend Tests
Database Tests (pgTAP)
UI / Component Tests
Pre-deployment Test Plan
```

Panduan testing lengkap tersedia di:

```text
TESTING.md
```

Hasil audit/test terakhir didokumentasikan di:

```text
TEST-REPORT.md
```

---

## Struktur Project

```text
applyo/
├── src/
│   ├── app/                    # Next.js routes, layouts, server actions
│   ├── backend/                # Domain/backend services, queries, validation
│   ├── components/             # UI dan feature components
│   ├── lib/                    # Shared utilities dan Supabase clients
│   └── ...
├── supabase/
│   ├── migrations/             # PostgreSQL schema, RLS, functions, triggers
│   ├── tests/                  # Database tests
│   ├── config.toml             # Local Supabase configuration
│   └── seed.sql
├── public/
├── PRD.md
├── ARCHITECTURE.md
├── DESIGN-SYSTEM.md
├── ROADMAP.md
├── TASKS.md
├── TESTING.md
├── TEST-REPORT.md
├── AGENTS.md
├── .env.example
└── package.json
```

Applyo menggunakan pendekatan **modular full-stack monolith**: frontend dan application server berada dalam satu Next.js codebase, sedangkan database dan authentication dikelola oleh Supabase.

---

## Deployment

Arsitektur utama project dirancang untuk:

- **Vercel** sebagai deployment Next.js;
- **Supabase Cloud** sebagai PostgreSQL dan authentication backend.

Sebelum deployment:

1. Buat atau pilih Supabase project production.
2. Apply migration di `supabase/migrations/` ke database production.
3. Pastikan RLS dan database functions berhasil dibuat.
4. Tambahkan environment variables ke deployment platform:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

5. Pastikan `SUPABASE_SERVICE_ROLE_KEY` hanya tersedia pada server environment.
6. Konfigurasikan Auth Site URL dan redirect URL sesuai domain production.
7. Jalankan quality gate.
8. Deploy Next.js application.
9. Lakukan smoke test authentication, application lifecycle, calendar, analytics, dan RLS setelah deployment.

Production build lokal dapat diverifikasi dengan:

```bash
npm run build
npm run start
```

---

## Dokumentasi Project

Repository memiliki dokumentasi yang lebih detail untuk setiap aspek project:

| Dokumen | Isi |
| --- | --- |
| `PRD.md` | Product requirements, user problems, scope, dan product behavior. |
| `ARCHITECTURE.md` | Software architecture, backend boundary, database, RLS, dan lifecycle. |
| `DESIGN-SYSTEM.md` | Visual language, component behavior, dan design rules. |
| `ROADMAP.md` | Tahapan pengembangan project. |
| `TASKS.md` | Breakdown implementasi dan task development. |
| `TESTING.md` | Test strategy dan pre-deployment verification. |
| `TEST-REPORT.md` | Hasil testing/audit yang sudah dilakukan. |
| `AGENTS.md` | Aturan kerja untuk coding/AI agents pada repository. |

README ini berfungsi sebagai entry point. Gunakan dokumen di atas jika membutuhkan detail implementasi atau keputusan desain.

---

## Troubleshooting

### Supabase tidak bisa start

Pastikan Docker Desktop sudah aktif:

```bash
docker ps
```

Kemudian coba:

```bash
npm run db:start
```

### Environment variable belum benar

Periksa local Supabase:

```bash
npx supabase status
```

Pastikan `.env.local` menggunakan URL dan key dari local project yang sedang berjalan.

Setelah mengubah `.env.local`, restart Next.js development server.

### Database schema tidak sinkron

Untuk development lokal:

```bash
npm run db:reset
```

> Seluruh data lokal akan dihapus.

### Login berhasil tetapi data tidak dapat diakses

Periksa:

- user session;
- Supabase URL/key;
- migration;
- RLS policies;
- browser/server environment menggunakan project Supabase yang sama.

### Drag-and-drop gagal menyimpan

Periksa browser/server log dan pastikan database migration sudah up-to-date. Perpindahan card menggunakan database operation yang memvalidasi destination stage dan neighboring card ordering.

### Calendar menampilkan waktu yang tidak sesuai

Periksa timezone pada:

```text
Pengaturan → Preferensi → Zona waktu
```

Applyo menyediakan WIB, WITA, dan WIT pada UI settings.

### Build gagal

Jalankan pemeriksaan berikut secara terpisah:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

---

## Repository

```text
https://github.com/jikrilar/applyo
```

Applyo dibuat untuk membuat proses job hunting lebih mudah dipantau, lebih terorganisir, dan tidak terasa seperti mengelola spreadsheet tambahan.
