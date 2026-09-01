# Applyo — Product Requirements Document (PRD)

> **Status:** Draft v1.0  
> **Product:** Applyo  
> **Product Type:** Free public web application  
> **Primary Platform:** Web  
> **Primary Audience:** Job seekers  
> **Core Experience:** Kanban-based job application tracking

---

## 1. Product Overview

**Applyo** adalah web application gratis yang membantu job seeker mencatat, mengelola, dan memantau seluruh proses lamaran pekerjaan dalam satu tempat.

Alih-alih menggunakan spreadsheet, notes, chat pribadi, atau pencatatan manual yang tersebar, pengguna dapat menyimpan setiap lamaran sebagai sebuah kartu dan memindahkannya di Kanban board sesuai perkembangan proses rekrutmen.

Core interaction Applyo adalah:

```text
Save → Apply → Track → Move → Follow Up → Interview → Offer → Close → Review
```

USP utama Applyo adalah **Kanban-first job application tracker** dengan pengalaman drag-and-drop yang cepat, visual, dan menyenangkan.

Applyo tidak dirancang sebagai SaaS berbayar. Produk akan tersedia gratis untuk penggunaan pribadi maupun publik.

---

## 2. Background

Mencari pekerjaan sering kali melibatkan banyak lamaran dalam waktu yang bersamaan.

Seorang job seeker dapat memiliki:

- lowongan yang baru ditemukan;
- lowongan yang belum dilamar;
- lamaran yang sudah dikirim;
- recruiter yang sudah menghubungi;
- interview yang akan datang;
- technical test dengan deadline tertentu;
- proses yang belum mendapatkan kabar;
- lamaran yang ditolak;
- offer yang sedang dipertimbangkan.

Dalam praktiknya, informasi tersebut sering tersebar di:

- spreadsheet;
- Google Sheets;
- notes;
- email;
- WhatsApp;
- LinkedIn;
- calendar;
- screenshot;
- bookmark browser.

Akibatnya, job seeker harus melakukan tracking secara manual dan mudah kehilangan konteks mengenai lamaran tertentu.

Applyo dibuat untuk menyederhanakan proses tersebut melalui satu visual workspace.

---

## 3. Problem Statement

### 3.1 Primary Problem

Job seeker membutuhkan cara sederhana untuk mengetahui:

> "Saya sudah apply ke mana saja, sekarang setiap lamaran berada di tahap apa, dan apa yang harus saya lakukan berikutnya?"

Tools generik seperti spreadsheet dapat digunakan, tetapi tidak didesain berdasarkan alur rekrutmen dan membutuhkan pengelolaan manual.

### 3.2 Supporting Problems

Job seeker sering mengalami beberapa masalah berikut:

1. Sulit mengingat status setiap lamaran.
2. Tidak mengetahui berapa lama sebuah lamaran tidak mendapatkan update.
3. Interview dan assessment deadline mudah terlewat.
4. Riwayat proses rekrutmen tidak terdokumentasi.
5. Lowongan yang pernah dilamar sulit ditemukan kembali.
6. Banyak aplikasi dicatat di tempat berbeda.
7. Spreadsheet terasa administratif dan tidak menyenangkan digunakan.
8. Sulit mengevaluasi hasil job hunting secara keseluruhan.

---

## 4. Product Vision

> **Make job hunting easier to track and lighter to manage.**

Applyo ingin menjadi workspace sederhana yang dapat dibuka setiap hari oleh job seeker untuk mengetahui kondisi proses pencarian kerja mereka secara cepat.

Produk harus memberikan perasaan:

- organized;
- lightweight;
- visual;
- responsive;
- encouraging;
- playful without being childish.

Applyo tidak bertujuan membuat proses mencari pekerjaan menjadi sebuah game. Produk hanya mencoba mengurangi friction dan beban administratif dari proses tersebut.

---

## 5. Product Principles

### 5.1 Kanban First

Kanban board adalah pusat pengalaman Applyo.

Pengguna harus dapat memahami kondisi job hunt mereka hanya dengan melihat board.

### 5.2 Low Friction

Mencatat sebuah lamaran baru harus cepat.

Target:

> Pengguna dapat menyimpan lamaran dasar dalam kurang dari 30 detik.

### 5.3 Progressive Detail

Pengguna tidak diwajibkan mengisi seluruh informasi saat membuat lamaran.

Informasi tambahan dapat dilengkapi seiring perkembangan proses rekrutmen.

### 5.4 Visual Progress

Perkembangan recruitment harus dapat dipahami tanpa membaca banyak data.

### 5.5 User Controlled

Applyo tidak boleh mengambil keputusan penting secara otomatis.

Contoh:

- sistem boleh menyarankan follow-up;
- sistem tidak boleh otomatis menandai lamaran sebagai Ghosted;
- pengguna tetap menentukan outcome setiap lamaran.

### 5.6 Celebrate Progress, Don't Punish Inactivity

Applyo dapat memberikan feedback positif terhadap milestone, tetapi tidak menggunakan mekanisme seperti:

- streak;
- leaderboard;
- ranking;
- punishment karena tidak apply;
- aggressive productivity reminders.

---

## 6. Target Users

### 6.1 Primary User

Job seeker yang sedang aktif mencari pekerjaan dan melakukan beberapa lamaran secara bersamaan.

Contoh:

- fresh graduate;
- entry-level job seeker;
- career switcher;
- unemployed job seeker;
- employed professional yang sedang mencari pekerjaan baru.

### 6.2 Typical User Characteristics

Pengguna kemungkinan:

- menggunakan LinkedIn, Jobstreet, Glints, Indeed, atau career page perusahaan;
- melakukan beberapa aplikasi dalam satu minggu;
- membutuhkan tracking sederhana;
- tidak ingin membuat spreadsheet kompleks;
- mengakses aplikasi melalui laptop/desktop;
- sesekali membuka melalui mobile.

---

## 7. User Value Proposition

Applyo membantu pengguna menjawab lima pertanyaan utama:

1. **Where did I apply?**
2. **What stage is each application in?**
3. **What should I do next?**
4. **How long have I been waiting?**
5. **How is my job search progressing overall?**

---

## 8. Core User Journey

```text
Discover Job
    ↓
Save to Wishlist
    ↓
Apply
    ↓
Applied
    ↓
Screening
    ↓
Interview / Assessment
    ↓
Offer
    ↓
Hired
```

Dari active recruitment stage, sebuah application juga dapat berakhir sebagai:

```text
Rejected
Withdrawn
Ghosted
```

---

## 9. Application Lifecycle

### 9.1 Active Stages

Default stages:

1. Wishlist
2. Applied
3. Screening
4. Interview
5. Assessment
6. Offer

### 9.2 Closed Outcomes

Closed outcomes:

1. Hired
2. Rejected
3. Withdrawn
4. Ghosted

### 9.3 Important Rule

`Stage` dan `Activity/Event` harus diperlakukan sebagai dua konsep berbeda.

**Stage** menunjukkan posisi application saat ini.

Contoh:

```text
Current Stage: Interview
```

**Activity/Event** menunjukkan sesuatu yang terjadi.

Contoh:

```text
28 Aug — Applied
30 Aug — Recruiter contacted
02 Sep — HR Interview scheduled
05 Sep — HR Interview completed
```

Satu stage dapat memiliki beberapa events.

---

## 10. MVP Scope

MVP Applyo harus mencakup:

1. Authentication
2. Dashboard
3. Create Application
4. Kanban Board
5. Drag-and-Drop Stage Management
6. Application Detail
7. Application Timeline / History
8. Recruitment Events
9. Follow-up Tracking
10. Closed Outcomes
11. Calendar
12. Basic Analytics
13. Search and Filter
14. Responsive Interface
15. Settings

---

# 11. Functional Requirements

## 11.1 Authentication

Pengguna dapat:

- register;
- login;
- logout;
- maintain authenticated session.

Minimum authentication method:

- email and password.

Social authentication dapat ditambahkan kemudian.

### Acceptance Criteria

- User yang belum login tidak dapat membuka private application data.
- Setelah login berhasil, user diarahkan ke application workspace.
- Data milik satu user tidak dapat dilihat user lain.

---

## 11.2 First-Time Experience

Ketika pengguna baru belum memiliki application:

```text
Belum ada apa pun di sini.

Mulai pantau proses pencarian kerjamu.

[ Tambah Lamaran ]
```

Onboarding harus ringan dan tidak menjadi blocker.

MVP tidak membutuhkan onboarding wizard panjang.

---

## 11.3 Create Application

User dapat membuat application dari tombol:

```text
+ Tambah Lamaran
```

### Required Fields

- Company
- Position
- Stage

### Optional Fields

- Job URL
- Location
- Work arrangement
- Employment type
- Job source
- Applied date
- Salary minimum
- Salary maximum
- Currency
- Job description
- Notes

### Default Behavior

Jika user memilih `Applied` atau stage setelah Applied dan tidak menentukan tanggal apply, sistem dapat menawarkan tanggal hari ini sebagai default.

### Acceptance Criteria

- Application dapat dibuat dengan hanya required fields.
- Setelah disimpan, kartu muncul di stage yang dipilih.
- Form harus dapat diselesaikan dengan cepat.
- URL dan numeric field harus divalidasi.

---

## 11.4 Wishlist

Wishlist digunakan untuk lowongan yang ditemukan tetapi belum dilamar.

User dapat:

- menyimpan vacancy;
- menambahkan job URL;
- menambahkan notes;
- memindahkan kartu ke Applied.

Saat:

```text
Wishlist → Applied
```

sistem harus dapat menyimpan `applied_at`.

Jika applied date belum tersedia, tampilkan contextual action sederhana.

---

## 11.5 Kanban Board

Kanban adalah halaman utama pengelolaan application.

Board menampilkan satu column untuk setiap active stage.

Contoh:

```text
Wishlist | Applied | Screening | Interview | Assessment | Offer
```

Setiap column menampilkan:

- stage name;
- stage color;
- jumlah application;
- list application cards.

### Application Card

Minimum information:

- company;
- position;
- current stage;
- applied date atau waiting duration jika relevan;
- optional upcoming event indicator.

### Acceptance Criteria

- User dapat memindahkan kartu antar-column.
- Perpindahan harus memiliki optimistic UI.
- Jika update gagal, posisi kartu dikembalikan.
- Urutan kartu di dalam column dapat dipertahankan.
- Board tetap usable ketika jumlah kartu bertambah.

---

## 11.6 Drag-and-Drop Stage Change

Ketika kartu dipindahkan:

```text
Applied → Screening
```

sistem harus:

1. mengubah current stage;
2. menyimpan card ordering;
3. mencatat application history;
4. memperbarui UI;
5. menampilkan contextual action bila diperlukan.

Perpindahan harus dianggap sebagai satu business operation.

### Example History

```text
28 Aug 2026
Stage changed
Applied → Screening
```

---

## 11.7 Contextual Stage Actions

Beberapa stage transition dapat memunculkan optional action.

### Wishlist → Applied

Prompt:

```text
When did you apply?
```

### Screening → Interview

Prompt:

```text
Add interview details?
```

Fields:

- interview type;
- date;
- time;
- location/link;
- notes.

### Any Stage → Assessment

Prompt:

```text
Add assessment details?
```

Fields:

- assessment type;
- deadline;
- link;
- notes.

### Any Stage → Offer

Prompt:

```text
Add offer details?
```

Fields:

- salary;
- currency;
- start date;
- offer deadline;
- notes.

Semua contextual actions harus dapat di-skip.

---

## 11.8 Application Detail

Setiap card dapat dibuka menuju application detail.

Minimum sections:

### Header

- company;
- position;
- current stage;
- edit action;
- archive action.

### Job Information

- URL;
- location;
- work arrangement;
- employment type;
- source;
- salary range;
- job description.

### Recruitment

- applied date;
- upcoming events;
- completed events.

### Notes

Freeform notes.

### Timeline

Chronological history.

Example:

```text
28 Aug
Application created

30 Aug
Applied → Screening

01 Sep
HR Interview scheduled

03 Sep
HR Interview completed

04 Sep
Interview → Assessment
```

---

## 11.9 Recruitment Events

Application dapat memiliki banyak events.

Event types minimum:

### Interview

- HR Interview
- User Interview
- Technical Interview
- Final Interview
- Other Interview

### Assessment

- Technical Test
- Coding Test
- Psychological Test
- Case Study
- Take Home Assignment
- Medical Check Up
- Other Assessment

### General

- Recruiter Contacted
- Follow-up Sent
- Offer Received
- Other

Event dapat memiliki:

- title;
- type;
- date;
- time;
- deadline;
- URL/location;
- notes;
- completion status.

---

## 11.10 Follow-up Tracking

Applyo harus membantu user mengetahui application yang sudah lama tidak memiliki aktivitas.

Sistem menghitung:

```text
days_since_last_activity
```

atau duration sejak applied jika belum ada aktivitas lain.

Contoh card indicator:

```text
Waiting · 8 days
```

Sistem dapat memberikan suggestion:

```text
Belum ada kabar selama 8 hari.

Consider following up.
```

User dapat:

- mark follow-up sent;
- keep waiting;
- mark Ghosted.

### Important

Applyo tidak otomatis mengubah application menjadi Ghosted.

---

## 11.11 Rejected

Application dapat dipindahkan ke Rejected dari active stage mana pun.

Optional metadata:

- rejected date;
- stage when rejected;
- rejection reason;
- notes.

UX tidak boleh menggunakan language seperti:

```text
Failed
You lost
```

Gunakan neutral language seperti:

```text
Moved to Rejected
```

---

## 11.12 Withdrawn

User dapat menutup application sebagai Withdrawn.

Optional reason:

- accepted another offer;
- salary mismatch;
- location mismatch;
- role not suitable;
- recruitment process concern;
- personal reason;
- other.

Reason bersifat optional.

---

## 11.13 Ghosted

Ghosted adalah kondisi ketika recruitment tidak mendapat response dalam periode yang dianggap cukup lama oleh user.

User menentukan sendiri kapan application dianggap Ghosted.

System hanya dapat memberikan suggestion berdasarkan inactivity.

---

## 11.14 Offer

Ketika application masuk Offer, user dapat menyimpan:

- salary;
- currency;
- benefits;
- start date;
- offer deadline;
- notes.

Offer dapat berakhir sebagai:

```text
Offer → Hired
Offer → Withdrawn
Offer → Rejected
```

---

## 11.15 Hired

Hired adalah primary success state.

Saat user memindahkan application ke Hired:

- application menjadi closed;
- history dicatat;
- subtle success feedback dapat ditampilkan.

Celebration diperbolehkan pada milestone ini.

---

## 11.16 Closed Applications

Closed applications terdiri dari:

- Hired
- Rejected
- Withdrawn
- Ghosted

Closed applications tidak harus memenuhi main active board.

User harus dapat melihatnya melalui dedicated view/filter.

---

## 11.17 Archive

User dapat mengarsipkan application lama.

Archive berbeda dengan delete.

Archived application:

- tetap tersimpan;
- tidak muncul pada default views;
- dapat dipulihkan.

---

## 11.18 Delete Application

User dapat menghapus application secara permanen.

Delete harus memiliki confirmation dialog.

Contoh:

```text
Delete this application?

This action cannot be undone.
```

---

# 12. Dashboard

Dashboard memberikan overview job hunt.

Minimum widgets:

### Application Summary

- Total Applications
- Active Applications
- Interviews
- Assessments
- Offers

### Upcoming

Menampilkan event/deadline berikutnya.

Example:

```text
Tomorrow · 10:00
HR Interview
Company A
```

### Needs Attention

Contoh:

- assessment deadline dekat;
- interview upcoming;
- application tanpa update cukup lama;
- offer deadline.

Dashboard tidak boleh terlalu padat.

---

# 13. Application List View

Selain Kanban, user dapat melihat application dalam list/table.

Possible columns:

- Company
- Position
- Stage
- Applied Date
- Last Activity
- Source
- Upcoming Event

List view membantu:

- sorting;
- searching;
- managing large datasets.

---

# 14. Search

User dapat mencari berdasarkan minimum:

- company;
- position.

Search harus tersedia pada Applications view.

---

# 15. Filtering

Minimum filters:

- stage;
- outcome;
- source;
- date range.

Possible future filters:

- work arrangement;
- location;
- employment type;
- has upcoming event;
- waiting duration.

---

# 16. Calendar

Calendar menampilkan recruitment events.

Minimum events:

- interviews;
- assessments;
- deadlines;
- offer deadlines.

Views yang dapat dipertimbangkan:

- month;
- agenda/list.

MVP dapat dimulai dengan satu calendar view yang sederhana.

User dapat membuka application terkait dari event.

---

# 17. Analytics

Analytics bertujuan membantu user memahami progress job hunt, bukan menilai produktivitas.

Minimum metrics:

- total applications;
- total active;
- total rejected;
- total interviews;
- total assessments;
- total offers;
- total hired;
- applications over time.

Conversion metrics:

```text
Applied → Interview
Interview → Offer
Offer → Hired
```

Potential source performance:

```text
LinkedIn
Jobstreet
Glints
Company Website
Referral
Other
```

Analytics harus didasarkan pada data milik user sendiri.

---

# 18. Settings

Minimum settings:

### Profile

- display name;
- email information.

### Preferences

- default currency;
- date format;
- timezone.

### Board

Potential MVP settings:

- stage visibility;
- stage ordering.

Custom stage creation dapat dipertimbangkan setelah MVP jika menambah complexity terlalu besar.

### Account

- logout;
- delete account.

---

# 19. Navigation Structure

Recommended primary navigation:

```text
Dashboard

Applications
├── Board
└── List

Calendar

Analytics

Settings
```

Application detail dibuka dari Board/List dan bukan menjadi global navigation item.

---

# 20. Information Architecture

```text
Applyo
│
├── Marketing
│   ├── Landing Page
│   └── Authentication
│
└── App
    │
    ├── Dashboard
    │
    ├── Applications
    │   ├── Board
    │   ├── List
    │   └── Application Detail
    │
    ├── Calendar
    ├── Analytics
    └── Settings
```

---

# 21. UX Requirements

## 21.1 Desktop First, Responsive Always

Primary Kanban experience dioptimalkan untuk desktop.

Mobile harus tetap dapat:

- melihat applications;
- menambahkan application;
- mengedit application;
- mengubah stage;
- melihat upcoming events.

Jika drag-and-drop tidak ideal pada small screen, mobile dapat menyediakan alternative stage selector.

---

## 21.2 Fast Interaction

Actions seperti:

- create;
- edit;
- move;
- complete event;

harus terasa cepat.

Kanban transition harus menggunakan optimistic interaction jika memungkinkan.

---

## 21.3 Progressive Disclosure

Form panjang harus dihindari.

Tampilkan informasi berdasarkan kebutuhan dan konteks.

---

## 21.4 Feedback

System harus memberi feedback terhadap actions:

```text
Lamaran ditambahkan
Semua tersimpan
Dipindahkan ke Wawancara
Tindak lanjut ditambahkan
```

Gunakan toast atau contextual feedback yang ringan.

## 21.6 Bahasa Antarmuka

Bahasa antarmuka MVP adalah **Bahasa Indonesia**. Navigasi, label form, nama tahap yang ditampilkan, tombol, feedback, empty state, error, metadata, dan accessibility label harus menggunakan Bahasa Indonesia.

Nama tahap yang terlihat pengguna adalah:

```text
Incaran
Dilamar
Seleksi Awal
Wawancara
Asesmen
Tawaran
Diterima
Ditolak
Ditarik
Tanpa Kabar
```

Identifier internal dapat tetap menggunakan system key berbahasa Inggris dan tidak boleh ditampilkan langsung kepada pengguna.

---

## 21.5 Error Recovery

Jika suatu operation gagal:

- beri pesan jelas;
- jangan menghilangkan user input;
- rollback optimistic UI jika diperlukan;
- sediakan retry ketika relevan.

---

# 22. Design Direction

Detail lengkap akan ditentukan pada `design-system.md`.

High-level direction:

> **Playful Neobrutalism + Cartoon Personality**

Characteristics:

- colorful flat surfaces;
- bold black borders;
- solid black offset shadows;
- warm cream background;
- expressive typography;
- sticker/cartoon visual language;
- tactile interactions;
- subtle bounce and press motion;
- stage-specific colors;
- friendly microcopy.

Design harus tetap:

- readable;
- organized;
- accessible;
- usable untuk banyak application cards.

Fun UI tidak boleh mengurangi clarity.

---

# 23. Emotional UX Guidelines

Job hunting dapat menjadi proses yang melelahkan.

Applyo harus memperhatikan emotional context tersebut.

## Do

- acknowledge progress;
- provide calm reminders;
- make interactions satisfying;
- celebrate meaningful milestones;
- use friendly language.

## Don't

- guilt user karena tidak apply;
- aggressive notifications;
- motivational spam;
- celebrate rejection;
- gamify application quantity;
- use competitive leaderboard;
- imply user gagal karena sebuah rejection.

---

# 24. Accessibility Requirements

Minimum accessibility targets:

- semantic HTML;
- keyboard navigation;
- visible focus states;
- sufficient contrast;
- form labels;
- screen-reader-friendly controls;
- drag-and-drop alternative via keyboard/action menu;
- icons not used as sole meaning;
- colors not used as sole stage indicators;
- support `prefers-reduced-motion`.

Target standard:

> WCAG 2.2 AA where reasonably applicable.

---

# 25. Privacy Requirements

Application tracking contains potentially sensitive personal career information.

Requirements:

1. Application data private by default.
2. User A cannot access User B data.
3. Public profile is not part of MVP.
4. Application sharing is not part of MVP.
5. Sensitive data should not appear in public URLs.
6. Account deletion must remove or schedule deletion of associated user data.
7. Avoid collecting unnecessary personal information.

---

# 26. Performance Requirements

Target experience:

- dashboard usable quickly after navigation;
- drag interactions responsive;
- no full-page reload for normal CRUD operations;
- image/media usage minimized in dashboard;
- Kanban should remain usable with at least 100+ application records per user.

Performance target guideline:

- prioritize good Core Web Vitals;
- minimize client-side JavaScript where possible;
- lazy load non-critical UI.

---

# 27. Reliability Requirements

Important business operations must avoid partial updates.

Example:

```text
Pindahkan kartu
├── update current stage
├── update ordering
└── create history
```

These operations should succeed or fail together where possible.

Application history must not silently diverge from application state.

---

# 28. Security Requirements

Minimum requirements:

- authentication required for user workspace;
- server-side authorization;
- database-level ownership protection;
- secure session handling;
- server-side input validation;
- safe handling of user-generated URLs and text;
- rate limiting for abuse-prone endpoints if required;
- secrets never exposed to client.

Detailed implementation belongs in `architecture.md`.

---

# 29. Non-Goals for Initial Release

The following are explicitly outside the first release unless priorities change:

- paid subscriptions;
- premium plans;
- team workspace;
- recruiter accounts;
- employer dashboard;
- job marketplace;
- automated job applications;
- resume builder;
- AI-generated cover letters;
- AI interview coach;
- public user profile;
- social features;
- leaderboard;
- mobile native application;
- browser extension;
- collaborative board;
- complex workflow automation;
- realtime multi-user editing.

---

# 30. Potential Post-MVP Features

Possible future features:

## Job Capture

- browser extension;
- save from job board;
- metadata extraction from job URL.

## Documents

- save CV variants;
- cover letter tracking;
- record which CV was used.

## Enhanced Analytics

- CV performance;
- source conversion;
- average time per stage;
- rejection stage analysis.

## Personalization

- custom pipeline stages;
- custom colors;
- custom event types.

## Notifications

- interview reminder;
- assessment deadline;
- follow-up reminder.

## Import / Export

- CSV import;
- CSV export;
- backup.

## Calendar Integration

- Google Calendar integration.

## Email Integration

Potential future ability to associate recruitment emails with applications.

These features require separate validation before implementation.

---

# 31. High-Level Data Entities

Detailed schema belongs in `architecture.md`.

Core entities expected:

```text
User

Application

PipelineStage

ApplicationHistory

RecruitmentEvent

ApplicationNote

OfferDetails

UserPreference
```

Relationship overview:

```text
User
│
├── Applications
│   ├── History
│   ├── Events
│   ├── Notes
│   └── Offer Details
│
├── Pipeline Stages
└── Preferences
```

---

# 32. Application State Rules

## Active

```text
Wishlist
Applied
Screening
Interview
Assessment
Offer
```

## Closed

```text
Hired
Rejected
Withdrawn
Ghosted
```

A closed application can potentially be reopened by the user.

Example:

```text
Ghosted → Screening
```

if recruiter kembali menghubungi.

History harus mencatat reopening tersebut.

---

# 33. Example User Flow

## Scenario

User menemukan lowongan IT Support.

### Step 1

```text
Tambah Lamaran
```

User memasukkan:

```text
Company: Example Corp
Position: IT Support
Stage: Wishlist
URL: ...
```

### Step 2

Setelah apply:

```text
Wishlist → Applied
```

System meminta optional applied date.

### Step 3

Recruiter menghubungi user.

```text
Applied → Screening
```

History dicatat.

### Step 4

User mendapatkan HR interview.

```text
Screening → Interview
```

System menawarkan:

```text
Add interview details?
```

User menambahkan jadwal.

### Step 5

User mendapat technical test.

```text
Interview → Assessment
```

User menyimpan deadline.

### Step 6

User lolos ke final interview.

Application dapat kembali:

```text
Assessment → Interview
```

dan membuat event interview baru.

### Step 7

User menerima offer.

```text
Interview → Offer
```

Offer details disimpan.

### Step 8

User menerima pekerjaan.

```text
Offer → Hired
```

Application ditutup dan milestone feedback ditampilkan.

---

# 34. Success Metrics

Karena Applyo bukan produk monetization-driven, metrics difokuskan pada usefulness.

## Activation

User dianggap activated ketika:

```text
creates first application
```

Potential activation metric:

- percentage user yang membuat application setelah register.

## Engagement

Possible metrics:

- applications created per active user;
- board moves per active user;
- returning users;
- recruitment events created.

## Product Value

Signals:

- percentage applications yang memiliki status updates;
- percentage active users kembali setelah satu minggu;
- percentage users menggunakan application detail;
- percentage users menggunakan calendar/analytics.

## Reliability

- failed application mutations;
- failed Kanban moves;
- client/server error rate.

Tidak perlu mengejar vanity metric hanya karena jumlah account besar.

---

# 35. MVP Definition of Done

MVP dapat dianggap siap untuk public release jika user dapat melakukan flow berikut secara stabil:

```text
Register
↓
Login
↓
Create Application
↓
See Application on Kanban
↓
Drag Application to Another Stage
↓
History Automatically Recorded
↓
Add Interview / Assessment Event
↓
See Event on Calendar
↓
Open Application Detail
↓
Add/Edit Notes and Information
↓
Move Application to Offer
↓
Close as Hired / Rejected / Withdrawn / Ghosted
↓
Review Basic Analytics
```

Additional requirements:

- data isolation antar-user berjalan;
- mobile basic usability tersedia;
- keyboard-accessible alternative untuk core actions;
- no critical data-loss bug;
- main flows covered by automated tests;
- production deployment stable.

---

# 36. Product Release Priorities

Priority order:

## P0 — Core

- Auth
- Application CRUD
- Kanban
- Drag-and-drop
- Stage updates
- History
- Application detail

## P1 — Recruitment Management

- Interview events
- Assessment events
- Follow-up tracking
- Offer details
- Closed outcomes
- Calendar

## P2 — Product Insight

- Dashboard
- Search
- Filter
- List view
- Basic analytics
- Archive

## P3 — Enhancement

- custom pipeline;
- document tracking;
- calendar integration;
- import/export;
- browser extension.

---

# 37. Open Product Decisions

Beberapa keputusan dapat dikunci pada tahap architecture/design/development planning:

1. Apakah custom stage masuk MVP atau setelah MVP?
2. Apakah Closed outcomes ditampilkan sebagai Kanban columns atau dedicated view?
3. Berapa threshold default untuk follow-up suggestion?
4. Apakah user dapat membuat custom event type pada MVP?
5. Seberapa kompleks mobile drag-and-drop perlu didukung?
6. Apakah job description disimpan sebagai plain text atau rich text?
7. Apakah analytics dihitung realtime atau melalui precomputed query/view?
8. Apakah public landing page masuk release pertama atau setelah core app stabil?

---

# 38. Related Product Documents

PRD ini menjadi sumber utama product requirements.

Dokumen pendamping yang akan dibuat:

```text
/PRD.md
/ROADMAP.md
/TASKS.md
/ARCHITECTURE.md
/DESIGN-SYSTEM.md
```

Pembagian tanggung jawab:

### PRD.md

Apa yang dibangun, untuk siapa, dan mengapa.

### ROADMAP.md

Urutan fase pengembangan dan milestone.

### TASKS.md

Breakdown pekerjaan implementasi yang dapat dieksekusi.

### ARCHITECTURE.md

Tech stack, system architecture, data model, security, API/data access, dan technical decisions.

### DESIGN-SYSTEM.md

Visual language, color tokens, typography, spacing, components, interaction, motion, dan accessibility.

---

# 39. Final Product Statement

> **Applyo is a free, playful job application tracker that helps job seekers organize every opportunity, move applications through recruitment stages with a Kanban board, and keep their entire job hunt visible in one place.**

Core product loop:

```text
Add
↓
Track
↓
Move
↓
Act
↓
Review
```

The product succeeds when users spend less effort managing their job search and more effort acting on the opportunities that matter.
