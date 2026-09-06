# Applyo — Product Development Roadmap

> **Status:** Draft v1.0  
> **Product:** Applyo  
> **Document Type:** Product & Engineering Roadmap  
> **Primary Reference:** `PRD.md`  
> **Product Model:** Free public web application  
> **Core Experience:** Kanban-based job application tracking

---

# 1. Purpose

Dokumen ini mendefinisikan urutan pengembangan Applyo dari project setup sampai public release.

Roadmap berfokus pada:

- urutan milestone;
- dependency antar fitur;
- scope setiap fase;
- acceptance / exit criteria;
- prioritas pengembangan;
- hal yang sengaja ditunda.

Roadmap **tidak** menjadi daftar task implementasi granular.

Breakdown pekerjaan teknis akan dibuat terpisah di:

```text
TASKS.md
```

---

# 2. Roadmap Principles

Pengembangan Applyo mengikuti prinsip berikut.

## 2.1 Core Loop First

Fitur pertama yang harus bekerja adalah:

```text
Create Application
      ↓
See on Board
      ↓
Move Card
      ↓
Save New Stage
      ↓
Record History
```

Jika loop ini belum solid, fitur lain tidak boleh menjadi prioritas utama.

---

## 2.2 Functional Before Decorative

Design system tetap menjadi bagian penting Applyo, tetapi implementation priority adalah:

```text
usable
↓
reliable
↓
polished
↓
delightful
```

Bukan sebaliknya.

---

## 2.3 Build Vertical Slices

Sebisa mungkin setiap milestone menghasilkan flow yang dapat digunakan end-to-end.

Contoh:

```text
Create application
→ save to database
→ appear on Kanban
→ open detail
```

lebih baik daripada membangun semua halaman kosong terlebih dahulu.

---

## 2.4 Keep MVP Small

Fitur yang tidak diperlukan untuk core job tracking tidak masuk critical path.

Contoh:

```text
Browser extension
Google Calendar integration
Document upload
AI features
Custom workflow automation
```

ditunda sampai core product terbukti nyaman digunakan.

---

## 2.5 Dogfood Early

Applyo akan digunakan langsung dalam proses job application sehari-hari.

Setiap milestone utama harus diuji dengan penggunaan nyata sebelum melanjutkan ke scope berikutnya.

---

# 3. Release Strategy

Roadmap menggunakan empat level release.

```text
Internal Prototype
      ↓
Private Alpha
      ↓
Public Beta
      ↓
Public v1
```

## Internal Prototype

Tujuan:

> membuktikan core interaction Applyo.

Belum membutuhkan seluruh polishing atau feature completeness.

---

## Private Alpha

Tujuan:

> aplikasi sudah cukup stabil untuk digunakan secara rutin oleh developer / pengguna awal terbatas.

---

## Public Beta

Tujuan:

> pengguna umum sudah dapat register dan menggunakan seluruh core workflow.

Beberapa edge case atau advanced feature masih dapat belum tersedia.

---

## Public v1

Tujuan:

> pengalaman utama stabil, polished, responsive, accessible, dan layak dipromosikan secara publik.

---

# 4. Roadmap Overview

```text
PHASE 0
Foundation & Product Decisions
        ↓
PHASE 1
Project Foundation
        ↓
PHASE 2
Core Application Tracking
        ↓
PHASE 3
Kanban Experience
        ↓
PHASE 4
Recruitment Management
        ↓
PHASE 5
Dashboard, Calendar & Analytics
        ↓
PHASE 6
Product Polish & Quality
        ↓
PHASE 7
Public Release
        ↓
POST-MVP
Enhancements
```

---

# 5. Phase 0 — Foundation & Product Decisions

## Goal

Menghilangkan ambiguity penting sebelum coding dimulai.

## Deliverables

Dokumen utama:

```text
PRD.md
ROADMAP.md
TASKS.md
ARCHITECTURE.md
DESIGN-SYSTEM.md
```

Keputusan yang perlu dikunci:

- MVP scope;
- application lifecycle;
- active vs closed stages;
- event model;
- Kanban behavior;
- responsive behavior;
- design language;
- technical architecture;
- database model;
- authentication model;
- deployment approach.

---

## Product Decisions

Default active stages:

```text
Wishlist
Applied
Screening
Interview
Assessment
Offer
```

Closed outcomes:

```text
Hired
Rejected
Withdrawn
Ghosted
```

Important model:

```text
Stage ≠ Event
```

Stage menunjukkan posisi application saat ini.

Event menunjukkan sesuatu yang terjadi dalam recruitment process.

---

## Exit Criteria

Phase selesai jika:

- PRD tersedia;
- roadmap tersedia;
- architecture terdokumentasi;
- design system terdokumentasi;
- task breakdown tersedia;
- tidak ada ambiguity besar mengenai MVP core flow.

---

# 6. Phase 1 — Project Foundation

## Goal

Membangun foundation teknis yang siap menerima feature development.

## Scope

### Project Setup

- initialize Next.js project;
- configure TypeScript;
- configure styling;
- configure linting;
- configure formatting;
- environment configuration;
- repository structure.

### UI Foundation

- design tokens;
- typography;
- colors;
- border;
- shadow;
- radius;
- spacing;
- base component primitives.

Minimum components:

```text
Button
Input
Textarea
Select
Badge
Card
Dialog
Dropdown
Toast
Tooltip
Skeleton
```

### Backend Foundation

- Supabase project;
- database connection;
- migration workflow;
- authentication;
- authorization strategy;
- Row Level Security;
- generated database types.

### Application Shell

Build:

```text
Sidebar / Navigation
Topbar
Content Layout
Mobile Navigation
Loading State
Error Boundary
404
```

---

## Primary User Flow

At the end of this phase:

```text
Landing
↓
Register
↓
Login
↓
Protected App
↓
Logout
```

---

## Milestone

### M1 — Authenticated Shell

User dapat:

- membuka landing page;
- register;
- login;
- masuk workspace;
- logout.

Workspace belum membutuhkan application tracking yang lengkap.

---

## Exit Criteria

- authentication stabil;
- user session berjalan;
- protected routes aman;
- base layout responsive;
- core design tokens tersedia;
- database migration workflow bekerja;
- RLS foundation tersedia.

---

# 7. Phase 2 — Core Application Tracking

## Goal

Membuat Applyo sudah berguna sebagai basic job application tracker.

## Scope

### Application Model

Implement minimum application data:

```text
Company
Position
Stage
Job URL
Location
Work Arrangement
Employment Type
Source
Applied Date
Salary Range
Job Description
Notes
Created At
Updated At
```

### Application CRUD

User dapat:

```text
Create
Read
Update
Archive
Delete
```

application.

### Application Detail

Implement:

- header;
- current stage;
- job information;
- notes;
- applied date;
- metadata;
- basic activity history.

### Basic Board

Applications ditampilkan berdasarkan stage.

Drag-and-drop belum wajib sempurna pada awal phase.

---

## Primary User Flow

```text
Login
↓
Tambah Lamaran
↓
Save
↓
Application appears
↓
Open Application
↓
Edit Information
```

---

## Milestone

### M2 — Usable Job Tracker

Applyo sudah dapat dipakai sebagai alternatif spreadsheet sederhana.

---

## Exit Criteria

- application CRUD stabil;
- user hanya dapat mengakses datanya sendiri;
- application detail berjalan;
- empty states tersedia;
- validation tersedia;
- archive/delete behavior berjalan;
- application dapat dikelompokkan berdasarkan stage.

---

# 8. Phase 3 — Kanban Experience

## Goal

Menyelesaikan USP utama Applyo.

> Application status management melalui visual drag-and-drop Kanban.

---

## Scope

### Kanban Columns

Default columns:

```text
Wishlist
Applied
Screening
Interview
Assessment
Offer
```

Setiap column memiliki:

- stage label;
- stage color;
- application count;
- droppable area.

---

## Application Cards

Card minimum menampilkan:

```text
Company
Position
Stage indicator
Applied / waiting information
Upcoming event indicator
```

---

## Drag-and-Drop

Support:

- drag between columns;
- reorder inside same column;
- optimistic update;
- rollback on failure;
- persisted card ordering;
- keyboard-accessible alternative.

---

## Stage History

Setiap perpindahan harus menghasilkan history.

Example:

```text
Applied → Screening
```

menjadi:

```text
Stage changed
Applied → Screening
28 Aug 2026
```

---

## Transaction Integrity

Move operation harus mengelola secara konsisten:

```text
stage
ordering
history
```

agar application state dan timeline tidak berbeda.

---

## Interaction Polish

Implement tactile feedback:

```text
pick up
↓
lift
↓
drag
↓
highlight target
↓
drop
↓
small bounce
```

Respect:

```text
prefers-reduced-motion
```

---

## Mobile Alternative

Jika drag-and-drop tidak nyaman di mobile:

```text
Ubah Tahap
↓
Select Stage
```

harus tersedia sebagai alternative.

---

## Milestone

### M3 — Kanban Alpha

Core Applyo experience sudah berfungsi end-to-end.

---

## Exit Criteria

User dapat:

```text
Create Application
↓
See Card
↓
Drag Card
↓
Ubah Tahap
↓
Refresh
↓
Card remains in new position
↓
History shows transition
```

Tambahan:

- move operation reliable;
- optimistic rollback bekerja;
- keyboard/non-drag alternative tersedia;
- board usable dengan banyak cards.

---

# 9. Phase 4 — Recruitment Management

## Goal

Mengembangkan Applyo dari status tracker menjadi recruitment journey tracker.

---

# 9.1 Recruitment Events

Implement events:

### Interview

```text
HR Interview
User Interview
Technical Interview
Final Interview
Other Interview
```

### Assessment

```text
Technical Test
Coding Test
Psychological Test
Case Study
Take Home Assignment
Medical Check Up
Other
```

### General

```text
Recruiter Contacted
Follow-up Sent
Offer Received
Other
```

---

## Event Data

Event dapat memiliki:

```text
Title
Type
Date
Time
Deadline
Location / URL
Notes
Completion Status
```

---

# 9.2 Contextual Stage Actions

Ketika application dipindahkan ke stage tertentu, system dapat menawarkan contextual action.

### Wishlist → Applied

```text
When did you apply?
```

### → Interview

```text
Add interview details?
```

### → Assessment

```text
Add assessment details?
```

### → Offer

```text
Add offer details?
```

Seluruh prompt:

```text
optional
skippable
non-blocking
```

---

# 9.3 Timeline

Application detail mendapatkan chronological timeline.

Example:

```text
28 Aug
Applied

30 Aug
Recruiter contacted

01 Sep
HR Interview scheduled

03 Sep
Interview completed
```

Timeline harus menggabungkan:

- stage history;
- recruitment events;
- follow-up activity.

---

# 9.4 Follow-Up

System menghitung inactivity.

Display:

```text
Waiting · 8 days
```

Possible suggestion:

```text
Belum ada kabar selama 8 hari.
Consider following up.
```

Actions:

```text
Mark Follow-up Sent
Keep Waiting
Mark Ghosted
```

---

# 9.5 Closed Outcomes

Implement:

```text
Hired
Rejected
Withdrawn
Ghosted
```

Closed application:

- tidak memenuhi default active board;
- tetap dapat dilihat;
- dapat dibuka;
- history tetap tersedia;
- dapat direopen.

---

# 9.6 Offer Details

Offer dapat menyimpan:

```text
Salary
Currency
Benefits
Start Date
Offer Deadline
Notes
```

---

## Milestone

### M4 — Recruitment Tracker Alpha

Applyo sudah dapat mengikuti sebuah application dari discovery sampai outcome.

---

## Exit Criteria

Flow berikut bekerja:

```text
Wishlist
↓
Applied
↓
Interview
↓
Assessment
↓
Interview
↓
Offer
↓
Hired
```

serta:

```text
Any Active Stage
↓
Rejected / Withdrawn / Ghosted
```

Events dan timeline tersimpan dengan benar.

---

# 10. Phase 5 — Dashboard, Calendar & Analytics

## Goal

Membantu user memahami apa yang sedang terjadi dan apa yang perlu diperhatikan.

---

# 10.1 Dashboard

Implement minimum summary:

```text
Total Applications
Active Applications
Interviews
Assessments
Offers
```

---

## Upcoming

Display upcoming:

```text
Interview
Assessment Deadline
Offer Deadline
```

---

## Needs Attention

Examples:

```text
Wawancara besok
Assessment due soon
Waiting 10 days
Offer deadline approaching
```

Tidak menggunakan guilt-driven UI.

---

# 10.2 Calendar

Minimum:

- recruitment events;
- deadlines;
- interview schedule;
- offer deadlines.

Event dapat membuka application terkait.

---

# 10.3 Application List

Alternative dari Kanban.

Minimum columns:

```text
Company
Position
Stage
Applied Date
Last Activity
Source
Upcoming Event
```

Support:

- sorting;
- search;
- filtering.

---

# 10.4 Search & Filter

Search:

```text
Company
Position
```

Minimum filters:

```text
Stage
Outcome
Source
Date Range
```

---

# 10.5 Basic Analytics

Metrics:

```text
Total Applications
Interviews
Assessments
Offers
Hired
Rejected
```

Conversion:

```text
Applied → Interview
Interview → Offer
Offer → Hired
```

Trend:

```text
Applications over time
```

Optional jika data mencukupi:

```text
Source performance
Average waiting time
```

---

## Milestone

### M5 — Private Alpha

Applyo cukup lengkap untuk digunakan sebagai daily job hunting workspace.

---

## Exit Criteria

- dashboard useful;
- calendar menampilkan events;
- list view berjalan;
- search/filter reliable;
- analytics calculations tervalidasi;
- application detail, Kanban, dan calendar saling terhubung.

---

# 11. Phase 6 — Product Polish & Quality

## Goal

Mengubah functional application menjadi product experience yang layak digunakan publik.

---

# 11.1 Visual Polish

Apply full design system.

Focus:

- playful neobrutalist visual language;
- consistent borders;
- solid shadows;
- stage colors;
- typography;
- spacing;
- card hierarchy.

---

# 11.2 Interaction Polish

Implement microinteractions:

```text
Button press
Card lift
Kanban bounce
Dialog pop
Toast slide
Tab movement
Checkbox feedback
```

Gunakan animation hanya untuk feedback dan delight yang relevan.

---

# 11.3 Empty States

Create intentional empty states untuk:

- no applications;
- empty Kanban stage;
- no upcoming events;
- no analytics data;
- no search result;
- archived applications.

---

# 11.4 Emotional UX

Review seluruh microcopy.

Avoid:

```text
Gagal
Kamu kalah
Berusaha lebih keras
Tidak ada perkembangan
```

Prefer:

```text
Dipindahkan ke Ditolak
Belum ada apa pun di sini
Semua tersimpan
Lamaran ditambahkan
```

Meaningful celebration:

```text
Lamaran Pertama
Wawancara Pertama
Tawaran
Diterima
```

---

# 11.5 Responsive QA

Test minimum:

```text
Desktop
Laptop
Tablet
Mobile
```

Kanban must support horizontal behavior gracefully.

---

# 11.6 Accessibility

Review:

- semantic structure;
- keyboard navigation;
- focus states;
- screen reader labels;
- contrast;
- reduced motion;
- non-color indicators;
- drag alternatives.

Target:

```text
WCAG 2.2 AA where applicable
```

---

# 11.7 Performance

Review:

- server/client component boundaries;
- bundle size;
- loading states;
- database query efficiency;
- unnecessary re-renders;
- large Kanban datasets.

Target scenario:

```text
100+ applications / user
```

tanpa UX yang terasa berat.

---

# 11.8 Testing

Minimum automated coverage:

### E2E

```text
Register
Login
Create Application
Edit Application
Move Card
Create Event
Close Application
Search
Filter
Logout
```

### Unit / Logic

```text
Validation
Stage transition logic
Waiting duration
Analytics calculation
Date utilities
```

---

# 11.9 Security Review

Validate:

- RLS;
- authorization;
- protected routes;
- server validation;
- secret handling;
- account deletion;
- URL/text handling.

---

## Milestone

### M6 — Public Beta Candidate

Tidak ada known blocker untuk pengguna umum.

---

## Exit Criteria

- no critical bugs;
- core E2E flow passing;
- responsive experience acceptable;
- accessibility review complete;
- performance acceptable;
- security checklist complete;
- visual consistency acceptable.

---

# 12. Phase 7 — Public Release

## Goal

Membuka Applyo untuk penggunaan publik.

---

# 12.1 Landing Page

Minimum sections:

```text
Hero
Product Value
Kanban Demo
Core Features
How It Works
Free Forever Message
CTA
Footer
```

Positioning:

> A playful job application tracker that keeps your whole job hunt in one place.

---

# 12.2 Production Setup

Prepare:

- production environment;
- production database;
- domain;
- SSL;
- analytics / observability;
- error monitoring;
- backups where applicable.

---

# 12.3 Legal & Privacy Basics

Because app is public, prepare minimum:

```text
Privacy Policy
Terms / Usage Terms
Data Deletion Information
```

Tidak perlu kompleks, tetapi harus sesuai dengan data yang benar-benar dikumpulkan.

---

# 12.4 Feedback Channel

Provide simple method:

```text
Feedback
Bug Report
Feature Suggestion
```

---

# 12.5 Beta Release

Open registration publicly.

Monitor:

- failed registrations;
- auth errors;
- Kanban mutation failures;
- database errors;
- client crashes.

---

## Milestone

### M7 — Applyo Public Beta

Public users dapat membuat account dan menggunakan complete core flow.

---

## Exit Criteria

Public user dapat:

```text
Discover Applyo
↓
Register
↓
Create Applications
↓
Track via Kanban
↓
Manage Recruitment Events
↓
Review Calendar
↓
Close Applications
↓
Review Analytics
```

tanpa developer intervention.

---

# 13. Phase 8 — Public v1

## Goal

Stabilize berdasarkan penggunaan beta.

---

## Focus

- fix recurring bugs;
- improve confusing UX;
- simplify friction points;
- improve mobile interaction;
- improve performance;
- adjust analytics based on real usage;
- refine onboarding.

Avoid langsung menambah banyak fitur baru.

Prioritas:

```text
stability
>
clarity
>
speed
>
new features
```

---

## Milestone

### M8 — Applyo v1

Core product dianggap stable.

---

# 14. Post-MVP Roadmap

Fitur berikut **tidak berada pada critical path**.

Urutannya dapat berubah berdasarkan feedback nyata.

---

# 14.1 Custom Pipelines

Potential capabilities:

- reorder stage;
- hide stage;
- create custom stage;
- custom color;
- custom event types.

---

# 14.2 Import / Export

Potential:

```text
CSV Import
CSV Export
Backup
```

Useful untuk user yang sebelumnya menggunakan spreadsheet.

---

# 14.3 Document Tracking

Potential:

- CV variants;
- cover letters;
- record CV used per application.

Upload file hanya dipertimbangkan setelah storage implications dievaluasi.

---

# 14.4 Calendar Integration

Potential:

```text
Google Calendar
```

Interview/deadline dapat disinkronkan.

---

# 14.5 Browser Extension

Potential workflow:

```text
Open LinkedIn / Job Board
↓
Save to Applyo
↓
Application created as Wishlist
```

---

# 14.6 Job Metadata Extraction

Potential:

```text
Paste Job URL
↓
Detect
Company
Position
Location
Description
```

Harus dievaluasi berdasarkan reliability dan terms setiap source.

---

# 14.7 Enhanced Analytics

Potential:

```text
Average time per stage
Source conversion
Rejection stage
CV performance
Weekly recap
Monthly recap
```

---

# 14.8 Notifications

Potential:

- interview reminder;
- assessment deadline;
- follow-up reminder;
- offer deadline.

Notifications harus tetap calm dan user-controlled.

---

# 14.9 PWA

Potential:

- installable web app;
- better mobile experience;
- offline-friendly read experience.

---

# 15. Explicitly Deferred

Tidak direncanakan dalam foreseeable initial roadmap:

```text
Paid subscriptions
Recruiter marketplace
Employer accounts
Automated job application
Job scraping at scale
Social network
Leaderboard
Daily streak
Native mobile app
Realtime collaboration
AI-first features
```

Fitur hanya dipertimbangkan jika arah produk berubah secara signifikan.

---

# 16. Dependency Map

```text
Auth
 │
 ▼
User Data Isolation
 │
 ▼
Application CRUD
 │
 ▼
Application Board
 │
 ▼
Kanban Drag & Drop
 │
 ├─────────────┐
 ▼             ▼
History      Ordering
 │
 ▼
Events
 │
 ├─────────────┐
 ▼             ▼
Timeline     Calendar
 │
 ▼
Analytics
```

Feature dependencies utama:

```text
Dashboard
    depends on Applications + Events

Calendar
    depends on Events

Analytics
    depends on Applications + History

Follow-up
    depends on Application activity/history

Closed outcomes
    depend on Stage system + History
```

---

# 17. Priority Matrix

## P0 — Required for Core Product

```text
Authentication
Data Isolation
Application CRUD
Kanban Board
Drag & Drop
Stage History
Application Detail
```

---

## P1 — Required for Complete Recruitment Tracking

```text
Recruitment Events
Timeline
Interview
Assessment
Follow-up
Offer
Closed Outcomes
Calendar
```

---

## P2 — Important Product Utility

```text
Dashboard
List View
Search
Filters
Basic Analytics
Archive
Responsive UX
```

---

## P3 — Product Expansion

```text
Custom Pipelines
Import / Export
Documents
Integrations
Browser Extension
Enhanced Analytics
Notifications
```

---

# 18. Dogfooding Checkpoints

Applyo should be used personally throughout development.

---

## Checkpoint A — After M2

Question:

> Can I stop using a spreadsheet for basic application tracking?

Test:

- add real applications;
- edit real data;
- archive stale applications.

---

## Checkpoint B — After M3

Question:

> Is moving applications on the Kanban faster than manually editing a status field?

Observe:

- drag friction;
- column width;
- card density;
- ordering;
- mobile behavior.

---

## Checkpoint C — After M4

Question:

> Can Applyo represent my real recruitment processes without workarounds?

Test:

- multiple interviews;
- assessment;
- back-and-forth stages;
- rejection;
- ghosting;
- offer.

---

## Checkpoint D — After M5

Question:

> When I open Applyo, can I immediately understand what needs attention?

Review:

- dashboard;
- upcoming events;
- waiting applications;
- calendar.

---

# 19. Validation Questions

Before public beta, validate:

### Kanban

- Does drag-and-drop actually make tracking faster?
- Are default stages sufficient?
- Are cards too information-dense?

### Events

- Are Interview and Assessment models flexible enough?
- Do users understand stage vs event?

### Dashboard

- Which information is most useful when opening Applyo?

### Analytics

- Do metrics help users make decisions or are they merely decorative?

### Emotional UX

- Does the playful UI make the product feel lighter?
- Does any interaction feel insensitive during rejection/ghosting?

---

# 20. Risk Register

## Risk 1 — Overbuilding Before Core Validation

### Problem

Too many features sebelum Kanban UX terbukti nyaman.

### Mitigation

Do not move post-MVP features into critical path.

---

## Risk 2 — Kanban Becomes Too Crowded

### Problem

User dengan banyak applications dapat memiliki board yang terlalu padat.

### Mitigation

- compact cards;
- filtering;
- closed applications separate;
- list view;
- archive.

---

## Risk 3 — Playful Design Hurts Usability

### Problem

Color, shadows, animations, dan decoration terlalu dominan.

### Mitigation

- neutral card surfaces;
- stage color primarily as accents;
- consistent hierarchy;
- motion budget;
- accessibility review.

---

## Risk 4 — Recruitment Processes Are Too Varied

### Problem

Fixed pipeline tidak mampu menggambarkan semua companies.

### Mitigation

MVP menggunakan broad stages:

```text
Interview
Assessment
```

dengan multiple events.

Custom pipelines dapat datang setelah MVP.

---

## Risk 5 — Public Free App Operational Cost

### Problem

Growth dapat meningkatkan database, storage, atau hosting usage.

### Mitigation

- avoid unnecessary file storage;
- optimize queries;
- monitor usage;
- defer expensive features;
- keep architecture portable.

---

## Risk 6 — Data Privacy

### Problem

Job application data bersifat personal.

### Mitigation

- strict ownership;
- database RLS;
- no public application URLs;
- collect minimal personal data;
- security tests.

---

# 21. Development Order

Recommended implementation sequence:

```text
01. Documentation
02. Project Setup
03. Design Tokens
04. Authentication
05. Database Foundation
06. App Shell
07. Application CRUD
08. Application Detail
09. Basic Board
10. Drag-and-Drop
11. History
12. Card Ordering
13. Events
14. Timeline
15. Closed Outcomes
16. Follow-Up
17. Calendar
18. Dashboard
19. Search & Filters
20. List View
21. Analytics
22. Responsive Polish
23. Accessibility
24. Testing
25. Security Review
26. Landing Page
27. Production Release
```

---

# 22. Milestone Summary

| Milestone | Outcome |
|---|---|
| **M0 — Product Spec** | Requirements and architecture clear |
| **M1 — Authenticated Shell** | User can register/login and enter app |
| **M2 — Usable Job Tracker** | Application CRUD works |
| **M3 — Kanban Alpha** | Drag-and-drop core USP works |
| **M4 — Recruitment Tracker Alpha** | Events + full recruitment lifecycle |
| **M5 — Private Alpha** | Dashboard, calendar, search, analytics |
| **M6 — Public Beta Candidate** | Polished, tested, secure |
| **M7 — Public Beta** | Open to public users |
| **M8 — Applyo v1** | Stable core product |

---

# 23. Definition of Roadmap Success

Roadmap berhasil jika development tidak kehilangan fokus terhadap core problem.

Final core loop:

```text
Find Opportunity
↓
Add to Applyo
↓
Apply
↓
Move Through Stages
↓
Track Events
↓
Know What Needs Attention
↓
Close Application
↓
Review Progress
```

Applyo tidak perlu memiliki banyak fitur untuk berhasil.

Produk dianggap berhasil ketika job seeker dapat membuka satu workspace dan dengan cepat memahami:

> **Where did I apply, what is happening now, and what should I do next?**

---

# 24. Related Documents

```text
PRD.md
ROADMAP.md
TASKS.md
ARCHITECTURE.md
DESIGN-SYSTEM.md
```

Document responsibilities:

### `PRD.md`

Defines:

```text
WHAT
WHY
WHO
```

### `ROADMAP.md`

Defines:

```text
WHEN
IN WHAT ORDER
WITH WHAT MILESTONES
```

### `TASKS.md`

Defines:

```text
WHAT EXACTLY NEEDS TO BE IMPLEMENTED
```

### `ARCHITECTURE.md`

Defines:

```text
HOW THE SYSTEM WORKS TECHNICALLY
```

### `DESIGN-SYSTEM.md`

Defines:

```text
HOW APPLYO LOOKS, FEELS, AND BEHAVES
```
