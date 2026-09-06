# Applyo — Development Tasks

> **Status:** Maintained v1.1  
> **Product:** Applyo  
> **Document Type:** Implementation Task Backlog  
> **Primary References:** `PRD.md`, `ROADMAP.md`  
> **Core Stack Assumption:** Next.js + TypeScript + Tailwind CSS + shadcn/ui + dnd-kit + Supabase  
> **Task Groups:** Frontend, Backend, Frontend–Backend Integration

## Current Progress Snapshot

**Status:** Core frontend, backend, and primary integration are implemented. Application detail, responsive Kanban drag-and-drop, list sorting, event management, notes, timeline, offer, outcome, archive, follow-up recording, contextual stage forms, and reusable UI primitives are available. Remaining release-critical work is concentrated in comprehensive security tests, reproducible browser E2E coverage, accessibility remediation, production configuration, and production smoke testing.

**Last verified:** 2026-08-30

Completed and verified:

- frontend foundation, landing page, auth pages, workspace shell, dashboard, Kanban, calendar, analytics, and settings;
- Supabase migrations, schema constraints, onboarding trigger, RLS, indexes, and lifecycle RPCs;
- real Supabase email/password registration, login, logout, protected route redirects, and profile initialization;
- persistent application create, edit, delete, archive/restore, stage movement, ordering, search, URL-backed filters, and mobile drag-and-drop;
- recruitment event creation, timezone-aware calendar rendering, dashboard upcoming data, analytics data, and preference persistence;
- application detail, timeline, event edit/complete/delete, close/reopen outcomes, offer details, and follow-up recording;
- applied-date and upcoming-agenda sorting from table headers in list view;
- 41 local Vitest tests, 21 pgTAP lifecycle/security assertions, SQL lint, typecheck, lint, and local production build.

Not yet complete:

- comprehensive table-by-table RLS tests and critical Kanban transaction edge-case tests (`P0`);
- reproducible Playwright flows for auth, CRUD, Kanban, outcomes, and user isolation (`P0`);
- field-level server validation mapping and accessibility remediation for core flows (`P0`);
- production Supabase/Vercel configuration, legal/privacy basics, and production smoke test (`P0`);
- dedicated closed/archive views, outcome reason contract, and durable "Tetap menunggu" behavior (`P1`);
- full outcome/source/date/archive filter controls and active filter chips (`P1`/`P2`);
- query-plan review and performance tests at 100+ applications (`P2`);
- stage ordering, direct calendar editing, and advanced source conversion analytics (`P3`).

All `[x]` markers below indicate work that exists in the repository. A task remains `[ ]` when its acceptance criteria are unfinished. `[~]` means the item is no longer relevant to the current product decision and must not be treated as active backlog.

## Current Backlog Index

This index is the canonical current status when older implementation detail below is more granular. Priorities on unfinished work describe the **next-work priority**, not the historical priority at task creation.

### Completed Frontend Tasks

```text
FE-001–002, FE-010–016, FE-020–024, FE-030–032
FE-040, FE-042, FE-050–052, FE-060–064, FE-070–071
FE-080–084, FE-090–093, FE-100, FE-102, FE-110, FE-122
FE-130–131, FE-140–143, FE-150–152, FE-160, FE-163
FE-170–172, FE-180–181, FE-183, FE-190–192, FE-202
```

### Active Frontend Backlog

| Task   | Status  | Current priority | Remaining scope                                                                           |
| ------ | ------- | ---------------: | ----------------------------------------------------------------------------------------- |
| FE-017 | Partial |               P2 | Make motion duration tokens canonical; drop bounce remains optional.                      |
| FE-041 | Partial |               P2 | Add a board-level empty state with intentional CTA/illustration.                          |
| FE-101 | Partial |               P2 | Label deadline separately on detail event cards.                                          |
| FE-111 | Partial |               P1 | Persist `Tetap menunggu` snooze; Ghosted remains available through close flow.            |
| FE-120 | Partial |               P1 | Align rejection reason UI with backend reason-code contract.                              |
| FE-121 | Partial |               P3 | Add structured withdrawn reasons only if reporting requires them.                         |
| FE-123 | Todo    |               P2 | Add restrained Hired success state with reduced-motion fallback.                          |
| FE-124 | Todo    |               P1 | Add dedicated closed-applications/outcome view.                                           |
| FE-161 | Partial |               P1 | Expose outcome/archive controls; source/date controls are P2.                             |
| FE-162 | Partial |               P2 | Render active filter chips and support individual removal.                                |
| FE-173 | Partial |               P3 | Source counts are done; interviews/offers conversion by source remains.                   |
| FE-182 | Partial |               P3 | Stage visibility is done; stage ordering remains.                                         |
| FE-200 | Todo    |               P0 | Audit/remediate keyboard behavior for menus, dialogs, forms, cards, Kanban, and calendar. |
| FE-201 | Todo    |               P0 | Audit/remediate visible, consistent, unclipped focus.                                     |
| FE-203 | Todo    |               P0 | Complete contrast and non-color-indicator audit.                                          |
| FE-210 | Partial |               P2 | Add rendered form/filter/status behavior tests.                                           |
| FE-211 | Partial |               P1 | Add card action, drag, rollback, and filter interaction tests.                            |

### Frontend Items No Longer Relevant

- [~] **FE-002 feature-directory migration:** superseded by the established shared-component/backend-domain structure.
- [~] **FE-015 generic Sheet/Drawer:** no current product flow requires this primitive.
- [~] **FE-065 mobile stage dropdown:** intentionally removed; mobile retains canonical drag-and-drop through the card handle.
- [~] **FE-110 stage-specific waiting treatment:** current waiting logic already excludes closed/archived applications.
- [~] **FE-151 direct edit from calendar detail:** application detail is the canonical event editor; revisit only as P3 convenience.
- [~] **FE-202 separate celebration fallback item:** owned by FE-123 if a celebration is introduced.

### Completed Backend Tasks

```text
BE-001–002, BE-010–012, BE-020–022, BE-030–033, BE-040–043
BE-050–066, BE-072–073, BE-080–092, BE-100–102, BE-110–111
BE-120–121, BE-130–132, BE-140–151, BE-160–164, BE-171–173
```

### Active Backend Backlog

| Task       | Status  | Current priority | Remaining scope                                                                                    |
| ---------- | ------- | ---------------: | -------------------------------------------------------------------------------------------------- |
| BE-003     | Partial |               P1 | Replace the hand-maintained generated-shape file with reproducible Supabase CLI output.            |
| BE-013     | Partial |               P0 | Configure production domain and auth redirect URLs.                                                |
| BE-070–071 | Partial |               P1 | Finalize canonical last-activity semantics; future agenda time must not incorrectly reset waiting. |
| BE-112     | Partial |               P2 | Applied-date and upcoming-agenda sorts are done; last-activity sort is optional.                   |
| BE-133     | Partial |               P3 | Add source-level interview/offer conversions only when analytics requires them.                    |
| BE-170     | Partial |               P0 | Complete authorization audit with tests for every user-owned table and operation.                  |
| BE-180–182 | Todo    |               P2 | Query plans, index evidence, and 100+/500+ dataset strategy.                                       |
| BE-190     | Partial |               P1 | Add direct database constraint tests for stage, salary, and foreign keys.                          |
| BE-191     | Partial |               P0 | Expand pgTAP isolation beyond application/history/move.                                            |
| BE-192     | Partial |               P0 | Test meaningful same-column neighbors, invalid IDs, stale neighbors, and rebalance paths.          |
| BE-193     | Partial |               P2 | Conversion arithmetic is tested; aggregate analytics query fixtures remain.                        |
| BE-194     | Todo    |               P1 | Document and verify production backup, migration recovery, and restore procedures.                 |

### Backend Items No Longer Relevant

- [~] **BE-032 `updated_at` index:** no supported query sorts by `updated_at`; add only after query-plan evidence.
- [~] **BE-063 duplicate history entry for event creation:** events are first-class timeline items and must not be duplicated in lifecycle history.
- [~] **BE-132 daily/weekly MVP grouping:** monthly grouping is the selected current granularity; selectable granularity is P3.

### Completed Integration Tasks

```text
INT-001–003, INT-010–013, INT-021, INT-023–024, INT-030–034
INT-040–041, INT-050–053, INT-060–062, INT-070–071, INT-082
INT-090, INT-100–102, INT-110, INT-112, INT-122, INT-130–132
INT-140, INT-142, INT-150, INT-160, INT-162, INT-170–173
```

### Active Integration Backlog

| Task        | Status  | Current priority | Remaining scope                                                                         |
| ----------- | ------- | ---------------: | --------------------------------------------------------------------------------------- |
| INT-004     | Partial |               P1 | Reproducibly generate database types and guard schema drift.                            |
| INT-020     | Partial |               P0 | Map field errors and preserve inputs for failed application mutations.                  |
| INT-022     | Partial |               P2 | Core edit integration is done; add explicit success feedback if retained.               |
| INT-063     | Partial |               P1 | Add confirmation before destructive event deletion.                                     |
| INT-072     | Partial |               P1 | Recording/recalculation is done; add explicit feedback and durable snooze flow.         |
| INT-080–081 | Partial |               P1 | Close/history are done; add closed view and fix structured reason handling.             |
| INT-083     | Partial |               P2 | Hired close/timeline/analytics are done; success UI remains.                            |
| INT-084     | Partial |               P1 | Reopen works; allow the user to choose the active destination stage.                    |
| INT-111     | Partial |               P3 | Calendar navigation works; Today shortcut remains optional.                             |
| INT-120     | Partial |               P2 | Backend search and URL sync work; add debounce.                                         |
| INT-121     | Partial |               P1 | Stage works; expose outcome/archive, then source/date controls.                         |
| INT-133     | Partial |               P3 | Source counts work; conversion-by-source remains.                                       |
| INT-141     | Partial |               P2 | Preferences persist; apply selected `date_format` throughout renderers.                 |
| INT-151     | Partial |               P1 | Add repeated-mutation/stale-state integration coverage.                                 |
| INT-161     | Partial |               P0 | Field-level mapping exists for auth only; extend it to core forms.                      |
| INT-180–184 | Todo    |               P0 | Add reproducible Playwright auth, CRUD, Kanban, event, and outcome flows.               |
| INT-185     | Todo    |               P2 | Add list search/filter/sort/pagination E2E after controls are complete.                 |
| INT-186     | Partial |               P0 | pgTAP covers limited mutation isolation; add direct URL/UI E2E and full table coverage. |
| INT-190–191 | Todo    |               P2 | Benchmark board rendering and mutation latency at realistic datasets.                   |
| INT-200–202 | Todo    |               P0 | Configure, validate, deploy, and smoke-test production.                                 |
| INT-203     | Todo    |               P0 | Configure safe preview deployment with isolated non-production data.                    |
| INT-204     | Todo    |               P1 | Add redacted observability for auth, mutation, server, and client failures.             |
| INT-205     | Todo    |               P0 | Publish privacy, terms, and account/data-deletion information before public signup.     |
| INT-206     | Todo    |               P2 | Add feedback, bug-report, and feature-suggestion channels.                              |

### Integration Items No Longer Relevant

- [~] **INT-035 mobile select integration:** superseded by the product decision to retain drag-and-drop on mobile and remove the status dropdown.

### Code Quality Backlog

| Task       | Status  | Current priority | Remaining scope                                                                          |
| ---------- | ------- | ---------------: | ---------------------------------------------------------------------------------------- |
| CQ-001     | Partial |               P1 | Automate real database type generation.                                                  |
| CQ-002     | Done    |                - | Naming is consistent.                                                                    |
| CQ-003     | Partial |               P1 | Wire redacted unexpected-error logging into server boundaries.                           |
| CQ-004–005 | Done    |                - | Current abstraction/comment discipline is acceptable.                                    |
| CQ-006     | Todo    |               P1 | Make format, lint, typecheck, tests, build, database checks, and E2E reproducible in CI. |

---

# 1. Purpose

Dokumen ini mengubah kebutuhan produk dan roadmap Applyo menjadi backlog pekerjaan yang dapat dieksekusi saat development.

Seluruh task dibagi menjadi tiga grup utama:

```text
1. FRONTEND
2. BACKEND
3. FRONTEND–BACKEND INTEGRATION
```

Dokumen ini berfokus pada **apa yang harus dikerjakan**, bukan penjelasan teknis arsitektur secara mendalam.

Keputusan teknis detail seperti schema database final, pola data access, transaction strategy, security policy, dan deployment architecture akan dijelaskan pada:

```text
ARCHITECTURE.md
```

---

# 2. Task Conventions

## 2.1 Task ID

Task frontend menggunakan prefix:

```text
FE-
```

Task backend menggunakan prefix:

```text
BE-
```

Task integrasi menggunakan prefix:

```text
INT-
```

---

## 2.2 Priority

```text
P0 = wajib untuk core product
P1 = wajib untuk complete MVP
P2 = penting untuk usability/public beta
P3 = enhancement / post-MVP
```

---

## 2.3 Status

Recommended task status:

```text
[ ] Todo
[-] In Progress
[x] Done
[!] Blocked
[~] No longer relevant / superseded
```

---

## 2.4 Definition of Done

Sebuah task dianggap selesai jika:

- implementation selesai;
- tidak ada known critical bug;
- acceptance criteria terpenuhi;
- responsive behavior diperiksa jika terkait UI;
- error state ditangani;
- loading state ditangani jika diperlukan;
- accessibility dasar diperiksa;
- type checking lulus;
- linting lulus;
- test ditambahkan jika logic cukup penting.

---

# 3. Development Order

Recommended high-level execution:

```text
FRONTEND FOUNDATION
        +
BACKEND FOUNDATION
        ↓
AUTH INTEGRATION
        ↓
APPLICATION CRUD
        ↓
KANBAN
        ↓
HISTORY
        ↓
RECRUITMENT EVENTS
        ↓
CLOSED OUTCOMES
        ↓
CALENDAR
        ↓
DASHBOARD
        ↓
SEARCH / FILTER
        ↓
ANALYTICS
        ↓
POLISH / TEST / RELEASE
```

Frontend dan backend foundation dapat dikerjakan paralel.

---

# ============================================================

# GROUP 1 — FRONTEND

# ============================================================

# 4. Frontend Foundation

## FE-001 — Initialize Frontend Project

**Priority:** P0

- [x] Initialize Next.js project.
- [x] Enable TypeScript strict mode.
- [x] Configure Tailwind CSS.
- [x] Install and configure shadcn-compatible UI primitives via Radix and `components.json`.
- [x] Configure import aliases.
- [x] Configure ESLint.
- [x] Configure formatter.
- [x] Create base folder structure.
- [x] Add environment variable typing strategy.

### Acceptance Criteria

- Project berjalan pada local development.
- TypeScript, lint, dan build berhasil.
- Styling dapat digunakan pada app route.

---

## FE-002 — Create Frontend Folder Structure

**Priority:** P0  
**Depends on:** FE-001

Recommended structure:

```text
src/
├── app/
├── components/
│   ├── ui/
│   └── shared/
├── features/
│   ├── auth/
│   ├── applications/
│   ├── kanban/
│   ├── events/
│   ├── dashboard/
│   ├── calendar/
│   └── analytics/
├── hooks/
├── lib/
├── types/
└── styles/
```

Tasks:

- [x] Create route groups.
- [~] Create feature directories. (Superseded: current shared-component and backend-domain structure is established and coherent.)
- [x] Define component placement convention.
- [x] Define naming convention.

---

# 5. Design System Foundation

## FE-010 — Implement Global Design Tokens

**Priority:** P0

Create tokens for:

- [x] background;
- [x] surface;
- [x] foreground;
- [x] muted colors;
- [x] stage colors;
- [x] semantic success/warning/error;
- [x] black border;
- [x] border widths;
- [x] radius;
- [x] hard shadows;
- [x] spacing;
- [x] typography;
- [x] motion duration.

Initial visual direction:

```text
Playful Neobrutalism
+
Cartoon Personality
```

### Acceptance Criteria

- No core UI component uses arbitrary repeated visual values when a token exists.
- Dark solid offset shadow is reusable.
- Stage colors are centrally defined.

---

## FE-011 — Configure Typography

**Priority:** P0  
**Depends on:** FE-010

- [x] Add display font.
- [x] Add UI/body font.
- [x] Define heading scale.
- [x] Define body scale.
- [x] Define label/button typography.
- [x] Ensure font fallback.

---

## FE-012 — Build Base Button Component

**Priority:** P0  
**Depends on:** FE-010

Variants:

- [x] primary;
- [x] secondary;
- [x] neutral.
- [x] destructive;
- [x] ghost;
- [x] icon-only.

States:

- [x] default;
- [x] hover;
- [x] pressed;
- [x] focus;
- [x] disabled;
- [x] loading.

Interaction:

```text
hover → lift
press → move toward solid shadow
```

---

## FE-013 — Build Form Components

**Priority:** P0

Components:

- [x] Input;
- [x] Textarea;
- [x] Select;
- [x] Checkbox;
- [x] Radio;
- [x] Switch;
- [x] Date input;
- [x] Time input;
- [x] Form label;
- [x] Error message;
- [x] Help text.

States:

- [x] focus;
- [x] invalid;
- [x] disabled;
- [x] read-only.

---

## FE-014 — Build Feedback Components

**Priority:** P0

- [x] Toast;
- [x] Alert;
- [x] Inline error;
- [x] Loading spinner;
- [x] Skeleton;
- [x] Empty state primitive.

---

## FE-015 — Build Overlay Components

**Priority:** P0

- [x] Dialog;
- [~] Sheet / Drawer. (No current product flow requires this primitive.)
- [x] Dropdown Menu;
- [x] Popover;
- [x] Tooltip;
- [x] Confirmation Dialog.

---

## FE-016 — Build Data Display Components

**Priority:** P0

- [x] Badge;
- [x] Card;
- [x] Avatar fallback;
- [x] Divider;
- [x] Tabs;
- [x] Stat Card;
- [x] Status Indicator.

---

## FE-017 — Implement Motion Utilities

**Priority:** P1

Create reusable interaction presets:

- [x] press;
- [x] lift;
- [x] pop;
- [~] bounce. (Optional; no current interaction requires it.)
- [x] slide;
- [x] drag lift.

Requirements:

- [x] support `prefers-reduced-motion`;
- [x] no excessive animation;
- [ ] durations follow tokens.

---

# 6. App Shell

## FE-020 — Build Public Layout

**Priority:** P0

- [x] Public navigation.
- [x] Logo placeholder / wordmark Applyo.
- [x] Responsive container.
- [x] Footer.

---

## FE-021 — Build Auth Layout

**Priority:** P0

- [x] Login layout.
- [x] Register layout.
- [x] Friendly visual / illustration slot.
- [x] Responsive mobile behavior.

---

## FE-022 — Build Dashboard App Shell

**Priority:** P0

Components:

- [x] Sidebar;
- [x] Top bar;
- [x] Main content area;
- [x] Mobile navigation;
- [x] Page header;
- [x] Responsive breakpoints.

Navigation:

```text
Dashboard
Applications
Calendar
Analytics
Settings
```

---

## FE-023 — Global Loading UI

**Priority:** P1

- [x] Route loading state.
- [x] Page skeleton.
- [x] Button/action loading state.

---

## FE-024 — Global Error UI

**Priority:** P1

- [x] Generic error boundary.
- [x] Not found page.
- [x] Unauthorized state melalui protected redirect.
- [x] Retry action where applicable.

---

# 7. Authentication UI

## FE-030 — Login Form

**Priority:** P0

Fields:

- [x] email;
- [x] password.

UI states:

- [x] normal;
- [x] submitting;
- [x] invalid credentials;
- [x] validation error.

---

## FE-031 — Register Form

**Priority:** P0

Fields:

- [x] display name;
- [x] email;
- [x] password;
- [x] confirm password.

---

## FE-032 — Authenticated User Menu

**Priority:** P1

- [x] display user identity;
- [x] settings link;
- [x] logout action.

---

# 8. Applications — Shared UI

## FE-040 — Create Application Card Component

**Priority:** P0

Display:

- [x] company;
- [x] position;
- [x] stage marker;
- [x] applied date or waiting duration;
- [x] upcoming event indicator;
- [~] source on Kanban card. (Source remains available in list/detail; board cards intentionally stay compact.)
- [x] overflow menu.

Behavior:

- [x] clickable;
- [x] draggable-ready;
- [x] keyboard focusable.

---

## FE-041 — Application Empty State

**Priority:** P0

Content:

```text
Belum ada apa pun di sini.
Mulai pantau proses pencarian kerjamu.

[ Tambah Lamaran ]
```

- [ ] board-level illustration/icon area. (`P2`; column empty targets already exist.)
- [ ] board-level CTA. (`P2`; toolbar CTA exists, but no dedicated whole-board empty state.)
- [x] responsive layout.

---

## FE-042 — Trigger Tambah Lamaran

**Priority:** P0

- [x] Tombol global `+ Tambah Lamaran`.
- [x] Accessible from board.
- [x] Accessible from list.
- [x] Accessible from empty state.

---

# 9. Application Form

## FE-050 — Build Create Application Form

**Priority:** P0

Required fields:

- [x] Company;
- [x] Position;
- [x] Stage.

Optional:

- [x] Job URL;
- [x] Location;
- [x] Work arrangement;
- [x] Employment type;
- [x] Source;
- [x] Applied date;
- [x] Salary minimum;
- [x] Salary maximum;
- [x] Currency;
- [x] Job description;
- [x] Notes.

UX:

- [x] group fields logically;
- [x] keep first interaction lightweight;
- [x] avoid visually overwhelming form.

---

## FE-051 — Build Edit Application Form

**Priority:** P0  
**Depends on:** FE-050

- [x] Reuse form primitives.
- [x] Pre-populate values.
- [x] Handle dirty state.
- [x] Confirm unsaved changes if needed.

---

## FE-052 — Client Form Validation

**Priority:** P0

Validate:

- [x] required fields;
- [x] URL format;
- [x] salary numeric constraints;
- [x] min/max salary relationship;
- [x] date values.

---

# 10. Applications — Board UI

## FE-060 — Build Kanban Board Container

**Priority:** P0

- [x] horizontal board layout;
- [x] responsive overflow;
- [x] stage columns;
- [x] loading state;
- [x] empty state.

---

## FE-061 — Build Kanban Column

**Priority:** P0

Display:

- [x] stage label;
- [x] stage color;
- [x] application count;
- [x] card list;
- [x] empty drop target.

---

## FE-062 — Implement Drag-and-Drop Client Behavior

**Priority:** P0  
**Depends on:** FE-040, FE-060, FE-061

Using dnd-kit:

- [x] make cards draggable;
- [x] make columns droppable;
- [x] reorder cards in same column;
- [x] move cards between columns;
- [x] drag overlay;
- [x] collision handling;
- [x] pointer input;
- [x] keyboard input where feasible.

---

## FE-063 — Implement Drag Visual Feedback

**Priority:** P1

During drag:

- [x] lifted card;
- [x] stronger solid shadow;
- [~] slight scale. (The compact overlay uses rotation and shadow; scale is not required.)
- [x] optional tiny rotation;
- [x] target column highlight;
- [~] drop bounce. (Optional polish; no current usability requirement.)

---

## FE-064 — Implement Optimistic Kanban State

**Priority:** P0

- [x] locally move card immediately;
- [x] store previous board state;
- [x] support rollback;
- [x] disable invalid duplicate mutation;
- [x] show error feedback on failure.

---

## FE-065 — Mobile Stage Change Alternative

**Priority:** N/A — superseded

Provide non-drag stage changing:

```text
Card Menu
↓
Ubah Tahap
↓
Select Stage
```

- [~] Superseded by the current product decision: mobile retains drag-and-drop through the card handle and the status dropdown was intentionally removed.

---

# 11. Applications — List View

## FE-070 — Build Application List/Table

**Priority:** P2

Columns:

- [x] Company;
- [x] Position;
- [x] Stage;
- [x] Applied Date;
- [x] Last Activity;
- [x] Source;
- [x] Upcoming Event.

---

## FE-071 — Responsive List View

**Priority:** P2

- [x] desktop table.
- [x] compact mobile card/list layout.
- [x] preserve key actions. (Detail, edit, and delete are available on desktop and mobile list layouts.)

---

# 12. Application Detail

## FE-080 — Build Application Detail Header

**Priority:** P0

Display:

- [x] company;
- [x] position;
- [x] stage;
- [x] edit action;
- [x] action menu.

---

## FE-081 — Build Job Information Section

**Priority:** P0

Display:

- [x] job URL;
- [x] location;
- [x] work arrangement;
- [x] employment type;
- [x] source;
- [x] salary;
- [x] job description.

---

## FE-082 — Build Notes Section

**Priority:** P0

- [x] notes display;
- [x] edit state;
- [x] save state.

---

## FE-083 — Build Recruitment Summary Section

**Priority:** P1

Display:

- [x] applied date;
- [x] upcoming events;
- [x] latest activity;
- [x] waiting duration.

---

## FE-084 — Build Timeline UI

**Priority:** P1

Timeline items:

- [x] stage transition;
- [x] recruiter contacted;
- [x] interview;
- [x] assessment;
- [x] follow-up;
- [x] offer;
- [x] outcome.

Detail route `/aplikasi/[id]` dan timeline sudah tersedia. Stage history menggunakan label Bahasa Indonesia.

---

# 13. Contextual Stage Actions

## FE-090 — Wishlist to Applied Dialog

**Priority:** P1

Fields:

- [x] applied date.

Actions:

- [x] save;
- [x] skip where appropriate.

---

## FE-091 — Interview Context Dialog

**Priority:** P1

Fields:

- [x] interview type.
- [x] date;
- [x] time;
- [x] location/link;
- [x] notes.

---

## FE-092 — Assessment Context Dialog

**Priority:** P1

Fields:

- [x] assessment type.
- [x] deadline.
- [x] link;
- [x] notes.

---

## FE-093 — Offer Context Dialog

**Priority:** P1

Fields:

- [x] salary;
- [x] currency;
- [x] benefits;
- [x] start date;
- [x] offer deadline;
- [x] notes.

---

# 14. Recruitment Events UI

## FE-100 — Build Event Form

**Priority:** P1

Support:

- [x] interview events;
- [x] assessment events;
- [x] general events.

---

## FE-101 — Build Event Card

**Priority:** P1

Display:

- [x] event type;
- [x] title;
- [x] date/time;
- [ ] deadline. (`P2`: deadline exists in data/calendar but is not labeled separately on detail event cards.)
- [x] status;
- [x] related application.

---

## FE-102 — Event Completion Interaction

**Priority:** P1

- [x] mark complete;
- [x] undo if appropriate;
- [x] visual completed state.

Completion dan pembatalan selesai sudah memakai server action pada detail lamaran.

---

# 15. Follow-Up UI

## FE-110 — Waiting Duration Indicator

**Priority:** P1

Display:

```text
Waiting · 8 days
```

Requirements:

- [x] compact;
- [x] non-alarming;
- [~] stage-aware treatment. (Not currently required; waiting logic already excludes closed/archived applications.)

---

## FE-111 — Follow-Up Suggestion UI

**Priority:** P1

Example:

```text
Belum ada kabar selama 8 hari.
Consider following up.
```

Actions:

- [x] Follow-up sent;
- [ ] Keep waiting. (`P1`: durable snooze persistence is not implemented.)
- [~] Mark Ghosted shortcut. (Ghosted remains available through the canonical close flow.)

---

# 16. Closed Outcomes UI

## FE-120 — Rejected Flow

**Priority:** P1

Dialog optional metadata:

- [x] rejection date (captured as outcome occurrence time);
- [x] rejection stage (captured as `from_stage_id`);
- [x] reason input and persistence;
- [x] notes.

**Remaining (`P1`):** align the free-text reason UI with the slug-like `reason_code` database contract.

Copy must remain neutral.

---

## FE-121 — Withdrawn Flow

**Priority:** P1

Optional reasons:

- [~] Fixed withdrawn-reason taxonomy. (Generic reason/notes already persist; structured options are P3 unless reporting requires them.)

---

## FE-122 — Ghosted Flow

**Priority:** P1

- [x] mark Ghosted confirmation;
- [x] explain that user controls this state;
- [x] support reopening later.

---

## FE-123 — Hired Success State

**Priority:** P1

- [ ] subtle celebration;
- [ ] success copy;
- [ ] reduced-motion fallback;
- [x] avoid excessive confetti.

---

## FE-124 — Closed Applications View

**Priority:** P1

Filter/view:

- [ ] Hired;
- [ ] Rejected;
- [ ] Withdrawn;
- [ ] Ghosted.

---

# 17. Archive & Delete UI

## FE-130 — Archive Application Action

**Priority:** P2

- [x] archive action;
- [x] archived state;
- [x] restore action;

Archive/restore tersedia pada detail lamaran. View archive khusus masih menjadi pekerjaan lanjutan.

---

## FE-131 — Delete Application Confirmation

**Priority:** P1

Copy:

```text
Delete this application?
This action cannot be undone.
```

---

# 18. Dashboard UI

## FE-140 — Dashboard Summary Cards

**Priority:** P2

Cards:

- [x] Total Applications;
- [x] Active Applications;
- [x] Interviews;
- [x] Assessments;
- [x] Offers.

---

## FE-141 — Upcoming Section

**Priority:** P2

Display upcoming:

- [x] interview;
- [x] assessment;
- [x] deadline;
- [x] offer deadline.

---

## FE-142 — Needs Attention Section

**Priority:** P2

Examples:

- [x] interview tomorrow;
- [x] deadline approaching;
- [x] no updates;
- [x] offer deadline.

---

## FE-143 — Dashboard Empty State

**Priority:** P2

Support users with:

- no applications;
- no events;
- insufficient analytics data.

---

# 19. Calendar UI

## FE-150 — Build Calendar View

**Priority:** P1

Show:

- [x] interviews;
- [x] assessments;
- [x] deadlines;
- [x] offer deadlines.

---

## FE-151 — Calendar Event Detail

**Priority:** P1

On event click:

- [x] show event detail;
- [x] navigate to application;
- [~] edit event directly from calendar. (Application detail is the canonical event editor; direct calendar editing is P3 convenience.)

---

## FE-152 — Calendar Mobile Layout

**Priority:** P2

Possible fallback:

```text
Agenda / List
```

if month grid becomes too cramped.

---

# FE-152 status: [x] Agenda fallback pada mobile sudah tersedia.

# 20. Search & Filtering UI

## FE-160 — Application Search Input

**Priority:** P2

Search by:

- [x] company;
- [x] position.

---

## FE-161 — Filter Panel

**Priority:** P2

Filters:

- [x] stage;
- [ ] outcome. (Board default hanya memuat closed outcomes melalui view khusus yang belum dibuat.)
- [ ] source. (Belum tersedia pada filter board.)
- [ ] date range. (Belum tersedia pada filter board.)

---

## FE-162 — Active Filter Chips

**Priority:** P2

- [ ] show active filter chips. (`P2`; only the active count is currently shown.)
- [ ] remove individual chip. (`P2`; individual filters can only be changed inside the panel.)
- [x] clear all.

---

## FE-163 — No Search Results State

**Priority:** P2

Friendly empty state with reset filters action.

- [x] Board-level no-results state.

---

# 21. Analytics UI

## FE-170 — Analytics Overview

**Priority:** P2

Metrics:

- [x] Total Applications;
- [x] Interviews;
- [x] Assessments;
- [x] Offers;
- [x] Hired;
- [x] Rejected.

---

## FE-171 — Conversion Funnel UI

**Priority:** P2

Display:

```text
Applied → Interview → Offer → Hired
```

---

## FE-172 — Application Trend Chart

**Priority:** P2

- [x] applications over time;
- [x] responsive chart;
- [x] empty data state.

---

## FE-173 — Source Performance UI

**Priority:** P3

Potential:

- [x] source counts;
- [ ] interviews by source;
- [ ] offers by source.

---

# 22. Settings UI

## FE-180 — Profile Settings UI

**Priority:** P2

- [x] display name;
- [x] email display.

---

## FE-181 — Preference Settings UI

**Priority:** P2

- [x] currency;
- [x] date format;
- [x] timezone.

---

## FE-182 — Board Settings UI

**Priority:** P3

Potential:

- [x] stage visibility;
- [ ] stage ordering. (Model/UI belum menyediakan operasi reorder.)

---

## FE-183 — Account Deletion UI

**Priority:** P2

- [x] destructive confirmation;
- [x] clear consequences;
- [x] recent-authentication guard.

---

# 23. Public Landing Page

Seluruh copy landing page, metadata, CTA, dan accessibility label harus menggunakan Bahasa Indonesia sesuai `DESIGN-SYSTEM.md`. Istilah Inggris hanya digunakan untuk identifier internal yang tidak terlihat pengguna.

## FE-190 — Build Landing Hero

**Priority:** P2

Include:

- [x] Applyo branding;
- [x] positioning;
- [x] CTA;
- [x] playful visual;
- [x] Kanban preview.

---

## FE-191 — Product Value Sections

**Priority:** P2

Sections:

- [x] Pantau Lamaran;
- [x] Ikuti Setiap Tahap;
- [x] Kelola Wawancara;
- [x] Tinjau Perkembangan;
- [x] Pesan gratis.

---

## FE-192 — Landing Responsive Polish

**Priority:** P2

- [x] desktop;
- [x] tablet;
- [x] mobile.

---

# 24. Frontend Accessibility

## FE-200 — Keyboard Navigation Audit

**Priority:** P2

Check:

- [ ] menus;
- [ ] dialogs;
- [ ] forms;
- [ ] cards;
- [ ] Kanban alternatives;
- [ ] calendar.

---

## FE-201 — Focus State Audit

**Priority:** P2

- [ ] visible focus;
- [ ] consistent design;
- [ ] no clipped outline.

---

## FE-202 — Reduced Motion Support

**Priority:** P2

Disable/reduce:

- [x] bounce;
- [x] large drag effects;
- [x] decorative animation;
- [~] celebration animation fallback. (Handled by FE-123 if a celebration is introduced.)

---

## FE-203 — Contrast & Color Audit

**Priority:** P2

- [ ] text contrast;
- [ ] stage label contrast;
- [ ] color not sole indicator.

---

# 25. Frontend Testing

## FE-210 — Component Tests

**Priority:** P2

Test key UI logic:

- [ ] rendered application form validation behavior;
- [ ] rendered filter behavior;
- [ ] rendered status labels;
- [x] formatting utilities.

---

## FE-211 — Interaction Tests

**Priority:** P2

Test:

- [x] base dialog Escape/focus-restoration behavior;
- [ ] card actions;
- [ ] drag state;
- [ ] rollback UI;
- [ ] filter interaction.

---

# ============================================================

# GROUP 2 — BACKEND

# ============================================================

# 26. Backend Foundation

## BE-001 — Create Supabase Project

**Priority:** P0

- [x] Create local development project configuration.
- [x] Configure local environment variables.
- [x] Define environment naming convention.
- [x] Keep service-role secret server-only.

---

## BE-002 — Configure Database Migration Workflow

**Priority:** P0

- [x] Initialize migration directory.
- [x] Define migration naming convention.
- [x] Test migration apply.
- [x] Test fresh database setup.
- [x] Document development workflow.

---

## BE-003 — Generate Database Types

**Priority:** P1 (current)

- [ ] Generate TypeScript types reproducibly from the current Supabase schema. (Current file is a centralized hand-maintained generated-shape.)
- [x] Define regeneration workflow via Supabase CLI.
- [x] Prevent manually duplicated schema types where possible.

---

# 27. Authentication Backend

## BE-010 — Configure Supabase Auth

**Priority:** P0

Minimum:

- [x] email/password registration;
- [x] login;
- [x] session;
- [x] logout.

---

## BE-011 — User Profile Model

**Priority:** P0

Create profile data if required:

```text
id
display_name
created_at
updated_at
```

---

## BE-012 — Auth Trigger / Profile Creation

**Priority:** P0

- [x] Create profile when user registers.
- [x] Create preferences and default stages during onboarding.
- [x] Handle duplicate/retry safely through database constraints.

---

## BE-013 — Auth Security Rules

**Priority:** P0

- [x] Ensure server/client keys correctly scoped.
- [x] Configure local allowed redirect URLs.
- [ ] configure production domain and auth redirects. (`P0` before public beta.)

---

# 28. Pipeline & Stage Backend

## BE-020 — Define Pipeline Stage Model

**Priority:** P0

Minimum fields:

```text
id
user_id / system scope
name
slug
category
position
color_key
is_active
is_closed
created_at
updated_at
```

Architecture document will finalize whether default stages are global templates or copied per user.

---

## BE-021 — Seed Default Stages

**Priority:** P0

Defaults:

```text
Wishlist
Applied
Screening
Interview
Assessment
Offer
Hired
Rejected
Withdrawn
Ghosted
```

---

## BE-022 — Stage Constraints

**Priority:** P0

Ensure:

- [x] valid ordering;
- [x] unique stage identifiers as required;
- [x] valid active/closed classification.

---

# 29. Application Database

## BE-030 — Create Applications Table

**Priority:** P0

Minimum candidate fields:

```text
id
user_id
company
position
stage_id
job_url
location
work_arrangement
employment_type
source
applied_at
salary_min
salary_max
currency
job_description
notes
sort_order
archived_at
created_at
updated_at
```

---

## BE-031 — Application Constraints

**Priority:** P0

- [x] company required;
- [x] position required;
- [x] stage required;
- [x] valid salary values;
- [x] valid ownership;
- [x] sensible defaults.

---

## BE-032 — Application Indexes

**Priority:** P1

Potential indexes:

- [x] user_id;
- [x] stage_id;
- [x] user_id + stage_id;
- [x] applied_at;
- [x] archived_at;
- [~] updated_at. (No current supported query uses it; add only after query-plan evidence.)

Finalize based on query design.

---

## BE-033 — Application RLS Policies

**Priority:** P0

User may:

- [x] select own applications;
- [x] insert own applications through canonical RPC;
- [x] update own applications;
- [x] delete own applications.

User must not access others' data.

---

# 30. Application History

## BE-040 — Create Application History Table

**Priority:** P0

Fields candidate:

```text
id
application_id
user_id
event_type
from_stage_id
to_stage_id
metadata
created_at
```

---

## BE-041 — History RLS

**Priority:** P0

- [x] user can access history only for owned applications;
- [x] unauthorized insert impossible through authenticated table grants/policies.

---

## BE-042 — Stage Move Transaction Function

**Priority:** P0

Create atomic operation conceptually:

```text
move_application(
  application_id,
  destination_stage,
  destination_order
)
```

Operation should:

- [x] verify ownership;
- [x] update stage;
- [x] update ordering;
- [x] insert history;
- [x] update timestamp;
- [x] return updated state.

---

## BE-043 — Card Reorder Operation

**Priority:** P0

Support:

- [x] reorder inside same stage;
- [x] move to another stage;
- [x] avoid duplicate ordering conflicts;
- [x] transactional consistency.

Architecture document should choose ordering strategy.

---

# 31. Application CRUD Backend Logic

## BE-050 — Create Application Operation

**Priority:** P0

- [x] server validation;
- [x] ownership assignment from session;
- [x] initial sort order;
- [x] initial history record.

---

## BE-051 — Read Applications Query

**Priority:** P0

Support:

- [x] active applications;
- [x] closed applications;
- [x] archived filtering;
- [x] stage grouping data.

---

## BE-052 — Read Application Detail Query

**Priority:** P0

Return:

- [x] application;
- [x] stage;
- [x] history;
- [x] events;
- [x] offer details if available.

---

## BE-053 — Update Application Operation

**Priority:** P0

- [x] validate fields;
- [x] verify ownership;
- [x] avoid silently changing stage outside canonical move path.

---

## BE-054 — Archive Application Operation

**Priority:** P2

- [x] set archived_at;
- [x] restore operation;
- [x] preserve history/events.

---

## BE-055 — Delete Application Operation

**Priority:** P1

- [x] ownership check;
- [x] cascading behavior defined;
- [x] remove associated data safely.

---

# 32. Recruitment Events Database

## BE-060 — Create Recruitment Events Table

**Priority:** P1

Candidate fields:

```text
id
application_id
user_id
event_type
title
scheduled_at
deadline_at
location
url
notes
status
completed_at
created_at
updated_at
```

---

## BE-061 — Event Type Rules

**Priority:** P1

Support categories:

```text
interview
assessment
recruiter_contact
follow_up
offer
other
```

Store subtype where needed.

---

## BE-062 — Event RLS

**Priority:** P1

User can only CRUD events tied to owned applications.

---

## BE-063 — Create Event Operation

**Priority:** P1

- [x] validate;
- [x] verify application ownership;
- [x] save event;
- [~] generate a duplicate activity/history item. (Events are first-class normalized timeline entries; duplicating them in lifecycle history is intentionally avoided.)

---

## BE-064 — Update Event Operation

**Priority:** P1

- [x] ownership;
- [x] rescheduling;
- [x] notes;
- [x] completion state.

---

## BE-065 — Delete Event Operation

**Priority:** P1

- [x] ownership;
- [x] timeline consistency.

---

## BE-066 — Upcoming Events Query

**Priority:** P1

Support:

- [x] upcoming interviews;
- [x] deadlines;
- [x] offer deadlines;
- [x] range queries for calendar.

---

# 33. Follow-Up Backend

## BE-070 — Last Activity Calculation

**Priority:** P1

Define canonical:

```text
last_activity_at
```

based on latest relevant:

- stage transition;
- recruitment event;
- follow-up;
- application creation/applied date.

---

## BE-071 — Waiting Duration Query

**Priority:** P1

Return duration for active applications.

---

## BE-072 — Follow-Up Event Operation

**Priority:** P1

- [x] record follow-up sent through a completed `follow_up` event;
- [x] update normalized timeline;
- [x] affect last activity and waiting calculation.

**Remaining (`P1`):** add durable suggestion snooze/dismissal separately from recording a sent follow-up.

---

## BE-073 — Follow-Up Suggestion Rule

**Priority:** P1

Implement configurable/default threshold.

Important:

- [x] suggestion only;
- [x] never auto-Ghost.

---

# 34. Closed Outcomes Backend

## BE-080 — Close Application Operation

**Priority:** P1

Support:

```text
Hired
Rejected
Withdrawn
Ghosted
```

Operation:

- [x] verify ownership;
- [x] update stage/outcome;
- [x] record history;
- [x] persist optional metadata.

---

## BE-081 — Rejected Metadata

**Priority:** P1

Candidate:

```text
rejected_at
rejected_from_stage
reason
notes
```

Could use outcome metadata table or structured history metadata; architecture will decide.

---

## BE-082 — Withdrawn Metadata

**Priority:** P1

Store optional reason.

---

## BE-083 — Reopen Application Operation

**Priority:** P1

Support:

```text
Closed → Active Stage
```

Record reopen history.

---

# 35. Offer Backend

## BE-090 — Create Offer Details Model

**Priority:** P1

Candidate fields:

```text
application_id
salary
currency
benefits
start_date
offer_deadline
notes
created_at
updated_at
```

---

## BE-091 — Offer RLS

**Priority:** P1

Only owner can access.

---

## BE-092 — Offer Upsert Operation

**Priority:** P1

- [x] create;
- [x] update;
- [x] validate salary/date.

---

# 36. Dashboard Backend Queries

## BE-100 — Application Summary Query

**Priority:** P2

Return:

```text
total
active
interviews
assessments
offers
```

---

## BE-101 — Needs Attention Query

**Priority:** P2

Return applications/events such as:

- [x] interview soon;
- [x] assessment due soon;
- [x] offer deadline;
- [x] inactivity threshold.

---

## BE-102 — Upcoming Dashboard Query

**Priority:** P2

Return next relevant events sorted chronologically.

---

# 37. Search & Filtering Backend

## BE-110 — Application Search Query

**Priority:** P2

Support search on:

- [x] company;
- [x] position.

---

## BE-111 — Application Filter Query

**Priority:** P2

Filters:

- [x] stage;
- [x] outcome;
- [x] source;
- [x] date range;
- [x] archived status.

---

## BE-112 — Sorting Query Support

**Priority:** P2

Possible:

- [x] applied date;
- [x] upcoming event;
- [~] updated date. (Removed from the current sorting contract.)
- [~] company. (Removed from the current sorting contract.)
- [ ] last activity. (`P2` only if product usage requires it.)

---

# 38. Calendar Backend

## BE-120 — Calendar Events Query

**Priority:** P1

Input:

```text
start
end
```

Return owned recruitment events in range.

---

## BE-121 — Calendar Event Normalization

**Priority:** P1

Ensure interviews, deadlines, and offer deadlines can be represented consistently by frontend.

---

# 39. Analytics Backend

## BE-130 — Analytics Summary Query

**Priority:** P2

Return:

- [x] total applications;
- [x] interviews;
- [x] assessments;
- [x] offers;
- [x] hired;
- [x] rejected.

---

## BE-131 — Conversion Calculation

**Priority:** P2

Calculate:

```text
Applied → Interview
Interview → Offer
Offer → Hired
```

Define denominator behavior for zero values.

---

## BE-132 — Application Trend Query

**Priority:** P2

Group:

- [~] daily for MVP;
- [~] weekly for MVP;
- [x] monthly as appropriate.

---

## BE-133 — Source Performance Query

**Priority:** P3

Return source-level conversion data.

---

# 40. User Preferences Backend

## BE-140 — User Preferences Table

**Priority:** P2

Fields:

```text
user_id
currency
date_format
timezone
created_at
updated_at
```

---

## BE-141 — Preferences RLS

**Priority:** P2

User only accesses own preferences.

---

## BE-142 — Update Preferences Operation

**Priority:** P2

Validate:

- [x] supported currency;
- [x] supported format;
- [x] timezone.

---

# 41. Account Lifecycle Backend

## BE-150 — Account Deletion Operation

**Priority:** P2

Define deletion behavior for:

- [x] profile;
- [x] applications;
- [x] events;
- [x] history;
- [x] preferences;
- [x] auth account.

---

## BE-151 — Data Cascade Review

**Priority:** P2

Ensure no orphan records.

---

# 42. Backend Validation

## BE-160 — Shared Application Schema

**Priority:** P0

Define Zod schema for create/update application.

- [x] Server schema implemented and covered by unit tests.

---

## BE-161 — Shared Event Schema

**Priority:** P1

Define create/update event validation.

- [x] Server schema implemented with category, subtype, URL, status, and completion validation.

---

## BE-162 — Stage Move Schema

**Priority:** P0

Validate:

- [x] application id;
- [x] stage;
- [x] order values.

---

## BE-163 — Offer Schema

**Priority:** P1

- [x] Offer payload schema implemented and validated.

---

## BE-164 — Preference Schema

**Priority:** P2

- [x] Preference payload schema implemented and validated.

---

# 43. Backend Security

## BE-170 — RLS Audit

**Priority:** P0 (active)

Test each user-owned table.

Attempt:

```text
User A → read User B
User A → update User B
User A → delete User B
```

All must fail.

- [x] Application and history read isolation plus application move/update/delete isolation.
- [ ] Profile and preferences isolation.
- [ ] Pipeline stage isolation.
- [ ] Recruitment event CRUD isolation.
- [ ] Offer CRUD isolation.
- [ ] Outcome isolation and unauthorized history writes.
- [ ] Anonymous table/RPC denial.

---

## BE-171 — Server Authorization Audit

**Priority:** P0

Every mutation must derive/verify current user.

---

## BE-172 — Service Role Usage Audit

**Priority:** P0

- [x] no service role leaked;
- [x] only use where explicitly necessary.

---

## BE-173 — Input Sanitization Review

**Priority:** P1

Review:

- [x] job URL;
- [x] notes;
- [x] job description;
- [x] location;
- [x] external links.

---

# 44. Backend Performance

## BE-180 — Query Plan Review

**Priority:** P2

Review common queries:

- [ ] board load;
- [ ] application detail;
- [ ] dashboard;
- [ ] calendar;
- [ ] analytics.

---

## BE-181 — Index Review

**Priority:** P2

Add indexes based on actual query paths.

---

## BE-182 — Pagination / Dataset Strategy

**Priority:** P2

Define behavior for users with:

```text
100+
500+
applications
```

Board may load active only while list view can paginate if needed.

---

# 45. Backend Testing

## BE-190 — Database Constraint Tests

**Priority:** P1

Test invalid:

- [x] ownership;
- [ ] stage;
- [ ] salary at the PostgreSQL constraint layer;
- [ ] foreign keys.

---

## BE-191 — RLS Tests

**Priority:** P0

Critical multi-user isolation tests.

- [x] Application/history read and application update/delete/move isolation covered by pgTAP.
- [ ] Profile/preferences/stage isolation.
- [ ] Recruitment event/offer/outcome CRUD isolation.
- [ ] Unauthorized history writes and anonymous access.

---

## BE-192 — Stage Move Transaction Tests

**Priority:** P0

Cases:

- [ ] meaningful same-column reorder with multiple neighbors;
- [x] cross-column move;
- [ ] invalid application;
- [x] unauthorized user;
- [ ] stale-neighbor, rebalance, and concurrent-ish reorder edge cases.

---

## BE-193 — Analytics Logic Tests

**Priority:** P2

Validate calculations against known fixtures.

- [x] Conversion arithmetic fixtures covered by Vitest.
- [ ] Aggregate analytics query behavior covered against known domain fixtures.

---

## BE-194 — Backup / Recovery Verification

**Priority:** P1 before public beta

- [ ] document production backup capabilities and limitations;
- [ ] document migration recovery and rollback procedure;
- [ ] test logical backup or restore procedure in a non-production environment;
- [ ] define responsible owner and verification cadence.

---

# ============================================================

# GROUP 3 — FRONTEND–BACKEND INTEGRATION

# ============================================================

# 46. Integration Foundation

## INT-001 — Configure Supabase Browser Client

**Priority:** P0  
**Depends on:** FE-001, BE-001

- [x] create browser-safe client;
- [x] expose only public key;
- [x] correct environment handling.

---

## INT-002 — Configure Supabase Server Client

**Priority:** P0

- [x] server-side client;
- [x] session/cookie handling;
- [x] server-only secrets separation.

---

## INT-003 — Define Data Access Boundary

**Priority:** P0

Create clear pattern such as:

```text
feature
├── queries
├── actions
├── schemas
└── components
```

Avoid direct scattered database calls from arbitrary UI components.

---

## INT-004 — Shared Type Strategy

**Priority:** P1 (current)

- [ ] reproducibly generated database type shape;
- [x] domain types;
- [x] form types;
- [x] avoid duplicate incompatible types where practical.

---

# 47. Authentication Integration

## INT-010 — Connect Register Form to Auth

**Priority:** P0  
**Depends on:** FE-031, BE-010

- [x] submit registration;
- [x] handle server/auth errors;
- [x] loading state;
- [x] redirect behavior.

---

## INT-011 — Connect Login Form to Auth

**Priority:** P0

- [x] authenticate;
- [x] persist session;
- [x] redirect to workspace;
- [x] display invalid credential message.

---

## INT-012 — Protected Route Integration

**Priority:** P0

- [x] redirect unauthenticated user;
- [x] allow authenticated workspace;
- [x] avoid protected content flash.

---

## INT-013 — Logout Integration

**Priority:** P0

- [x] clear session;
- [x] redirect appropriately.

---

# 48. Application CRUD Integration

## INT-020 — Connect Create Application Form

**Priority:** P0  
**Depends on:** FE-050, BE-050

Flow:

```text
Form
↓
Validate
↓
Server Action
↓
Database
↓
Success
↓
Update UI
```

Acceptance:

- [x] validation displayed;
- [x] successful create appears on board;
- [x] no full page reload required where avoidable;
- [ ] error preserves form data. (Perlu penyempurnaan.)

---

## INT-021 — Connect Application Detail Query

**Priority:** P0

- [x] load application by id;
- [x] handle not found;
- [x] handle unauthorized;
- [x] display data.

---

## INT-022 — Connect Edit Application Form

**Priority:** P0

- [x] prefill;
- [x] save;
- [x] invalidate/revalidate relevant views;
- [ ] explicit success feedback. (`P2`.)

---

## INT-023 — Connect Archive Action

**Priority:** P2

- [x] archive;
- [x] remove from active default view;
- [x] restore.

**Remaining:** discoverable archived-view/filter control is tracked under FE-161/INT-121.

---

## INT-024 — Connect Delete Action

**Priority:** P1

- [x] confirmation;
- [x] delete;
- [x] redirect/remove card;
- [x] error handling.

---

# 49. Kanban Integration

## INT-030 — Load Board Data from Backend

**Priority:** P0

Return board-ready data grouped/sortable by:

```text
stage
sort_order
```

- [x] Data board berasal dari query Supabase terautentikasi.

---

## INT-031 — Connect Drag Move to Backend Transaction

**Priority:** P0  
**Depends on:** FE-062, FE-064, BE-042

Flow:

```text
Drag
↓
Optimistic Move
↓
move_application()
↓
Success
    → keep
Failure
    → rollback atau ambil ulang board terbaru
```

- [x] Drag memanggil RPC `move_application`.
- [x] Optimistic move dan refresh state berhasil diverifikasi.

---

## INT-032 — Persist Same-Column Reordering

**Priority:** P0

- [x] reorder client;
- [x] persist order;
- [x] refresh maintains order.

---

## INT-033 — Persist Cross-Column Movement

**Priority:** P0

- [x] new stage saved;
- [x] order saved;
- [x] history created.

---

## INT-034 — Kanban Error Recovery

**Priority:** P0

On failed mutation:

- [x] rollback atau ambil ulang board terbaru;
- [x] error feedback;
- [x] no duplicate cards;
- [x] no lost card;
- [x] revalidate server state.

---

## INT-035 — Mobile Stage Change Integration

**Priority:** N/A — superseded

Use same canonical backend move operation as drag-and-drop.

- [~] Mobile status select was intentionally removed; the current mobile interaction retains canonical drag-and-drop through the card handle.

---

# 50. Stage History Integration

## INT-040 — Show Stage History in Timeline

**Priority:** P1

- [x] load history;
- [x] map stage ids to labels;
- [x] chronological order.

---

## INT-041 — Update Timeline After Move

**Priority:** P1

After successful stage change:

- [x] new timeline item visible;
- [x] avoid stale cached detail.

---

# 51. Contextual Stage Action Integration

## INT-050 — Wishlist → Applied Integration

**Priority:** P1

Flow:

```text
Move to Applied
↓
Optional Applied Date Dialog
↓
Save applied_at
```

Need clear behavior if user skips.

- [x] Stage move persists independently of the optional applied-date dialog.
- [x] Applied date saves when submitted; dialog can be skipped.

---

## INT-051 — Move to Interview Integration

**Priority:** P1

Flow:

```text
Pindahkan kartu
↓
Stage saved
↓
Optional interview dialog
↓
Create event if submitted
```

The stage transition should not fail solely because the user skips event creation.

- [x] Stage transition persists independently.
- [x] Optional interview event is created when submitted.

---

## INT-052 — Move to Assessment Integration

**Priority:** P1

Same pattern as interview.

- [x] Stage transition persists independently.
- [x] Optional assessment event is created when submitted.

---

## INT-053 — Move to Offer Integration

**Priority:** P1

- [x] stage update;
- [x] optional offer details.

---

# 52. Recruitment Event Integration

## INT-060 — Connect Create Event Form

**Priority:** P1  
**Depends on:** FE-100, BE-063

- [x] submit;
- [x] validate;
- [x] update detail page;
- [x] update calendar;
- [x] update dashboard if relevant.

---

## INT-061 — Connect Edit Event

**Priority:** P1

- [x] reschedule;
- [x] update location/url;
- [x] update notes.

---

## INT-062 — Connect Complete Event

**Priority:** P1

- [x] mark complete;
- [x] timeline reflects status;
- [x] upcoming list updates.

---

## INT-063 — Connect Delete Event

**Priority:** P1

- [ ] confirmation before destructive deletion. (`P1`.)
- [x] calendar/detail refresh.

---

# 53. Follow-Up Integration

## INT-070 — Display Waiting Duration

**Priority:** P1  
**Depends on:** FE-110, BE-071

- [x] board card;
- [x] application detail.

---

## INT-071 — Display Follow-Up Suggestions

**Priority:** P1

- [x] query backend suggestion;
- [x] show only when relevant.

---

## INT-072 — Record Follow-Up Sent

**Priority:** P1

After action:

- [x] event/timeline entry saved;
- [x] waiting state recalculated;
- [ ] explicit success/snooze UI feedback. (`P1`.)

---

# 54. Closed Outcome Integration

## INT-080 — Rejected Integration

**Priority:** P1

- [x] move/close application;
- [x] save optional rejection metadata;
- [x] remove from active board;
- [ ] add to dedicated closed view. (`P1`.)
- [x] timeline update.

**Remaining (`P1`):** align natural-language reason input with the backend `reason_code` contract.

---

## INT-081 — Withdrawn Integration

**Priority:** P1

Same general behavior.

- [x] close application, persist generic reason/notes, remove from board, and update timeline.
- [ ] dedicated closed view. (`P1`.)
- [~] fixed withdrawn-reason taxonomy. (P3 unless reporting requires it.)

---

## INT-082 — Ghosted Integration

**Priority:** P1

- [x] user action required;
- [x] no automatic close.

---

## INT-083 — Hired Integration

**Priority:** P1

- [x] close as Hired;
- [x] timeline;
- [ ] success UI;
- [x] analytics update.

---

## INT-084 — Reopen Application Integration

**Priority:** P1

- [ ] choose active stage. (`P1`; current flow uses the first active stage.)
- [x] backend reopen operation;
- [x] return to board;
- [x] history record.

---

# 55. Offer Integration

## INT-090 — Offer Details Form Integration

**Priority:** P1

- [x] load offer details;
- [x] create/update;
- [x] show deadline in dashboard/calendar.

---

# 56. Dashboard Integration

## INT-100 — Load Dashboard Summary

**Priority:** P2

- [x] connect metric query;
- [x] loading skeleton;
- [x] empty state;
- [x] error state melalui boundary workspace.

---

## INT-101 — Load Upcoming Events

**Priority:** P2

- [x] chronological order;
- [x] links to applications.

---

## INT-102 — Load Needs Attention

**Priority:** P2

- [x] inactivity;
- [x] upcoming deadlines;
- [x] offer deadline.

---

# 57. Calendar Integration

## INT-110 — Load Calendar Date Range

**Priority:** P1

On visible calendar range:

- [x] request relevant events;
- [x] render event type;
- [x] avoid loading all historical data unnecessarily.

---

## INT-111 — Calendar Navigation Integration

**Priority:** P1

- [x] next range;
- [x] previous range;
- [ ] today shortcut.
- [x] refresh event data melalui URL navigation.

---

## INT-112 — Calendar Event to Application Navigation

**Priority:** P1

- [x] click event;
- [x] open related application/event.

---

# 58. Search & Filter Integration

## INT-120 — Search Integration

**Priority:** P2

- [ ] debounce client input where appropriate;
- [x] query backend;
- [x] sync results through URL state;
- [x] clear search.

---

## INT-121 — Filter Integration

**Priority:** P2

- [x] stage filter;
- [ ] outcome/closed-view control. (`P1`.)
- [ ] source. (`P2`.)
- [ ] date range. (`P2`.)
- [ ] archived-view control. (`P1`.)

---

## INT-122 — URL Search Params

**Priority:** P2

Where beneficial:

```text
?stage=interview&source=linkedin
```

Benefits:

- reload persistence;
- share internal state locally;
- back/forward navigation.

Do not expose sensitive application data.

- [x] Search, stage, location, sort, view, archived, outcome, source, date, and pagination parameters are parsed or preserved.

---

# 59. Analytics Integration

## INT-130 — Connect Analytics Summary

**Priority:** P2

- [x] metrics;
- [x] loading;
- [x] zero-state.

---

## INT-131 — Connect Conversion Funnel

**Priority:** P2

- [x] percentages;
- [x] zero denominator handling;
- [x] labels.

---

## INT-132 — Connect Trend Chart

**Priority:** P2

- [x] backend grouped data;
- [x] chart data normalization.

---

## INT-133 — Connect Source Performance

**Priority:** P3

- [x] source application counts;
- [ ] interviews by source;
- [ ] offers/conversion by source.

---

# 60. Settings Integration

## INT-140 — Load User Preferences

**Priority:** P2

- [x] currency;
- [x] timezone;
- [x] date format.

---

## INT-141 — Update User Preferences

**Priority:** P2

- [x] server validation;
- [ ] apply saved `date_format` consistently across UI renderers. (`P2`; currency/timezone persistence works.)

---

## INT-142 — Account Deletion Integration

**Priority:** P2

Flow:

```text
Confirm
↓
Optional re-auth
↓
Delete account/data
↓
Clear session
↓
Redirect
```

- [x] Confirmation phrase.
- [x] Account/data deletion.
- [x] Session clearing.
- [x] Redirect after success.

---

# 61. Cache & Revalidation Integration

## INT-150 — Define Revalidation Rules

**Priority:** P0

Ensure mutations update relevant UI:

### Create Application

Refresh:

```text
Board
List
Dashboard
Analytics
```

- [x] Revalidation rules are implemented for application, event, offer, outcome, dashboard, calendar, analytics, and detail paths.

### Move Application

Refresh:

```text
Board
Detail
Dashboard
Analytics
```

### Create Event

Refresh:

```text
Detail
Dashboard
Calendar
```

---

## INT-151 — Avoid Stale State After Mutations

**Priority:** P1

Test repeated operations without manual reload.

- [ ] Add repeated-mutation and stale-state integration coverage. (`P1`.)

---

# 62. Error Handling Integration

## INT-160 — Standardize Server Action Result

**Priority:** P0

Recommended result shape conceptually:

```text
success
data
error
fieldErrors
```

Exact architecture to be defined later.

- [x] Shared success/error/field-error action result contract is implemented.

---

## INT-161 — Map Server Validation Errors to Forms

**Priority:** P0

- [x] field error mapping for auth forms;
- [ ] field error mapping for application, event, offer, and settings forms;
- [x] general error;
- [ ] preserve input pada semua form mutation. (Masih perlu penyempurnaan.)

---

## INT-162 — Network/Mutation Error UX

**Priority:** P0

- [x] retry/reconcile where relevant;
- [x] rollback/reconcile optimistic mutations;
- [x] avoid ambiguous success.

---

# 63. Loading State Integration

## INT-170 — Application Loading States

**Priority:** P1

- [x] board;
- [x] detail;
- [x] create/update.

---

## INT-171 — Dashboard Loading State

**Priority:** P2

- [x] Workspace loading boundary covers dashboard navigation.

---

## INT-172 — Calendar Loading State

**Priority:** P2

- [x] Workspace loading boundary covers calendar navigation.

---

## INT-173 — Analytics Loading State

**Priority:** P2

- [x] Workspace loading boundary covers analytics navigation.

---

# 64. End-to-End Testing

## INT-180 — Auth E2E

**Priority:** P0 before public beta

Scenario:

```text
Register
↓
Login
↓
Open protected workspace
↓
Logout
```

- [ ] Reproducible browser E2E is not present in the repository. Manual/local verification is not treated as completion.

---

## INT-181 — Application CRUD E2E

**Priority:** P0

Scenario:

```text
Create
↓
Open
↓
Edit
↓
Archive/Restore
```

Delete can be separate destructive test.

- [ ] Reproducible create/open/edit/delete browser E2E.
- [ ] Archive/restore browser E2E. (Implementation is connected; automated verification is missing.)

---

## INT-182 — Kanban E2E

**Priority:** P0

Scenario:

```text
Create application
↓
Move Applied → Screening
↓
Reload
↓
Verify position
↓
Verify timeline
```

- [ ] Reproducible create/move/reload/order browser E2E.
- [ ] Timeline persistence browser assertion. (Timeline implementation is available.)

---

## INT-183 — Recruitment Event E2E

**Priority:** P0 before public beta

Scenario:

```text
Move to Interview
↓
Add HR interview
↓
See on detail
↓
See on calendar
↓
Complete event
```

---

## INT-184 — Closed Outcome E2E

**Priority:** P0 before public beta

Test each:

- [ ] Hired;
- [ ] Rejected;
- [ ] Withdrawn;
- [ ] Ghosted;
- [ ] Reopen.

---

## INT-185 — Search & Filter E2E

**Priority:** P2

---

## INT-186 — User Isolation E2E

**Priority:** P0

Create two accounts.

Verify user A cannot access user B application through:

- [ ] UI;
- [ ] direct URL;
- [x] limited application/history/move mutation attempts at RLS/pgTAP level;
- [ ] full user-owned table coverage.

---

# 65. Integration Performance

## INT-190 — Board Data Load Review

**Priority:** P2

Test with seeded:

```text
10 applications
50 applications
100 applications
500 applications
```

Review:

- query time;
- rendering;
- drag responsiveness.

---

## INT-191 — Mutation Latency Review

**Priority:** P2

Focus:

- create;
- edit;
- move;
- event completion.

Optimistic UI should hide ordinary network latency where safe.

---

# 66. Public Release Integration

## INT-200 — Production Environment Configuration

**Priority:** P0 before public beta

- [ ] production env vars;
- [ ] Supabase production config;
- [ ] auth redirect URLs;
- [ ] deployment variables.

---

## INT-201 — Production Build Validation

**Priority:** P0 before public beta

- [x] build;
- [x] lint;
- [x] type check;
- [x] tests lokal.
- [ ] repository-wide `format:check`.
- [ ] Production environment validation.

---

## INT-202 — Production Smoke Test

**Priority:** P0 before public beta

Test:

```text
Landing
Register
Login
Create Application
Move Card
Create Event
Close Application
Logout
```

---

## INT-203 — Preview / CI Deployment Safety

**Priority:** P0 before public beta

- [ ] configure preview deployment;
- [ ] use isolated development/staging Supabase for previews;
- [ ] prevent untrusted previews from accessing production data;
- [ ] document migration and application deployment order;
- [ ] document rollback procedure.

---

## INT-204 — Production Observability

**Priority:** P1 before public beta

- [ ] unexpected server errors reach production logs;
- [ ] auth and Kanban mutation failures are monitorable;
- [ ] client crashes are monitorable or explicitly deferred;
- [ ] sensitive notes, descriptions, tokens, and cookies are redacted.

---

## INT-205 — Legal and Privacy Basics

**Priority:** P0 before public registration

- [ ] privacy policy;
- [ ] terms or usage terms;
- [ ] account and data-deletion information;
- [ ] telemetry disclosure if product analytics is introduced.

---

## INT-206 — Feedback Channel

**Priority:** P2

- [ ] feedback method;
- [ ] bug-report method;
- [ ] feature-suggestion method.

---

# 67. Recommended MVP Cut Line

Tasks above this cut line should be complete before public beta.

## Core P0

### Frontend

```text
FE-001
FE-002
FE-010–016
FE-020–022
FE-030–031
FE-040–052
FE-060–065
FE-080–084
```

### Backend

```text
BE-001–003
BE-010–013
BE-020–022
BE-030–033
BE-040–043
BE-050–053
BE-160
BE-162
BE-170–172
BE-191–192
```

### Integration

```text
INT-001–004
INT-010–013
INT-020–022
INT-030–035
INT-040–041
INT-150
INT-160–162
INT-181–182
INT-186
```

This produces:

```text
Authenticated
+
Private
+
CRUD
+
Kanban
+
Persistent Stage Changes
+
History
```

This is the minimum Applyo core.

---

# 68. Complete MVP Cut Line

Before calling Applyo a complete recruitment tracker, add P1:

### Frontend

```text
Contextual Actions
Recruitment Events
Timeline
Follow-Up
Closed Outcomes
Calendar
```

### Backend

```text
Recruitment Events
Follow-Up
Closed Outcomes
Offers
Calendar Queries
```

### Integration

```text
Contextual Actions
Events
Follow-Up
Outcomes
Offer
Calendar
```

Result:

```text
Discover
↓
Apply
↓
Track
↓
Interview
↓
Assessment
↓
Offer
↓
Close
```

---

# 69. Public Beta Cut Line

P2 priorities before public beta:

```text
Dashboard
List View
Search
Filters
Analytics
Archive
Settings
Responsive QA
Accessibility
Performance
Landing Page
Account Deletion
Production Smoke Tests
```

Some P2 tasks may be deferred if they do not block core usability, but:

```text
Security
Accessibility of core actions
Responsive usability
Production reliability
```

must not be deferred.

---

# 70. Suggested Sprint / Execution Batches

This document does not enforce time-based sprints, but tasks can be grouped into execution batches.

## Batch A — Foundation

**Status:** Selesai untuk foundation lokal dan integrasi Auth.

```text
FE-001 → FE-024
BE-001 → BE-022
INT-001 → INT-013
```

Outcome:

> Authenticated application shell.

---

## Batch B — Application Tracking

**Status:** Selesai untuk create/read/edit/delete, detail, notes, timeline, dan archive/restore action. Discoverable archived-view control remains `P1`.

```text
FE-040 → FE-052
FE-080 → FE-082

BE-030 → BE-055
BE-160

INT-020 → INT-024
```

Outcome:

> Basic usable application tracker.

---

## Batch C — Kanban Core

**Status:** Selesai untuk board loading, responsive desktop/mobile drag-and-drop, ordering, RPC, and history persistence. The old mobile status dropdown was intentionally removed and is no longer backlog.

```text
FE-060 → FE-065
BE-040 → BE-043
BE-162
INT-030 → INT-041
```

Outcome:

> Main USP functional.

---

## Batch D — Recruitment Journey

**Status:** Event lifecycle, follow-up recording, outcome close/reopen, offer, and timeline are integrated. Remaining work: dedicated closed view, reason-code contract, durable follow-up snooze, user-selected reopen stage, and Hired success polish.

```text
FE-083 → FE-124
BE-060 → BE-092
INT-050 → INT-090
```

Outcome:

> Full application lifecycle.

---

## Batch E — Workspace Utility

**Status:** Dashboard, calendar, analytics, board/list search, list sorting, filters, and responsive list actions are available. Remaining controls: outcome/archive/source/date filters and active filter chips.

```text
FE-140 → FE-173
BE-100 → BE-133
INT-100 → INT-133
```

Outcome:

> Dashboard + Calendar + Analytics + discovery tools.

---

## Batch F — Settings & Release

**Status:** Settings dan account deletion sudah terhubung. Production configuration, performance review, serta release smoke test masih terbuka.

```text
FE-180 → FE-211
BE-140 → BE-193
INT-140 → INT-202
```

Outcome:

> Public-ready product.

---

# 71. Critical Dependency Chain

The most important dependency path is:

```text
BE-030 Applications Table
        ↓
BE-050 Create Application
        ↓
INT-020 Create Integration
        ↓
FE-040 Application Card
        ↓
FE-060 Kanban Board
        ↓
FE-062 Drag & Drop
        ↓
BE-042 Move Transaction
        ↓
INT-031 Kanban Move Integration
        ↓
BE-040 History
        ↓
INT-040 Timeline Integration
```

This chain should receive the highest development priority.

**Current status:** The full dependency chain through `INT-040` is implemented. Remaining risk is automated browser and transaction-edge verification, not missing product integration.

---

# 72. Tasks That Should Not Block Core MVP

The following should not delay the main Kanban experience:

```text
Advanced charts
Custom pipeline
File uploads
Social login
Browser extension
Google Calendar integration
AI
PWA
Custom illustrations
Mascot animation
Advanced source analytics
```

These can be developed only after core tracking is reliable.

---

# 73. Code Quality Tasks

These apply throughout all three groups.

## CQ-001 — Type Safety

- [x] avoid `any` unless justified;
- [x] use a centralized Supabase-compatible database type shape;
- [ ] generate and verify that shape reproducibly from the current schema. (`P1`.)
- [x] validate external/user input.

## CQ-002 — Naming

- [x] consistent domain terminology;
- [x] use `application`, not random alternation with `job`/`submission`;
- [x] use `stage` consistently.

## CQ-003 — Error Handling

- [x] no swallowed errors;
- [x] user-facing feedback where needed;
- [ ] wire redacted unexpected-server-error logging into production server boundaries. (`P1`.)

## CQ-004 — Reusability

- [x] avoid premature abstraction;
- [x] extract repeated logic after real repetition appears.

## CQ-005 — Comments

- [x] comment why, not obvious what;
- [x] document tricky ordering/transaction logic.

## CQ-006 — Formatting and Automated Quality Gate

- [ ] repository-wide `npm run format:check` passes. (`P1`.)
- [ ] lint, typecheck, unit tests, and build run in CI. (`P1`, `P0` before public beta.)
- [ ] database lint and pgTAP run in CI. (`P1`, `P0` before public beta.)
- [ ] Playwright runs against an isolated test environment. (`P0` before public beta.)

---

# 74. Final MVP Verification Checklist

Before public beta:

## Frontend

- [x] UI follows Applyo design language.
- [x] Forms usable.
- [x] Kanban responsive.
- [x] Mobile retains canonical drag-and-drop through the card handle.
- [~] Separate mobile status dropdown is no longer part of the product decision.
- [x] Important empty states exist.
- [x] Loading states exist.
- [x] Error states exist.
- [x] Reduced motion supported.
- [ ] Keyboard/focus/contrast audit passes for core flows. (`P0`.)

## Backend

- [ ] RLS verified for every user-owned table and denied operation. (`P0`; application/history/move coverage exists.)
- [x] Stage moves atomic.
- [x] History lifecycle integration implemented.
- [ ] Critical history/outcome/event paths comprehensively tested. (`P0`/`P1`.)
- [x] Validation server-side.
- [ ] User isolation tested across every table, direct URL, UI, and mutation path. (`P0`.)
- [x] Database constraints valid.
- [ ] Critical query plans and index sufficiency reviewed. (`P2`.)

## Integration

- [x] Register/login implementation works locally.
- [x] Application CRUD implementation works locally.
- [x] Kanban persistence is implemented and partially covered by pgTAP.
- [x] Failed mutations reconcile with the latest board state.
- [ ] Core auth/CRUD/Kanban browser E2E is reproducible. (`P0`.)
- [x] Timeline updates.
- [x] Events update detail/calendar.
- [ ] Outcomes update active/closed views.
- [x] Dashboard reflects new data.
- [x] Conversion arithmetic fixtures verified.
- [ ] Aggregate analytics query fixtures verified. (`P2`.)
- [ ] Account deletion action tested at the service/database boundary. (`P1`.)
- [ ] Production smoke test passes.

---

# 75. Final Implementation Goal

When P0 and P1 tasks are complete, a user must be able to complete this flow without workaround:

```text
Register
↓
Login
↓
Add Job Opportunity
↓
Save to Wishlist
↓
Move to Applied
↓
Move Through Recruitment Stages
↓
Add Interview
↓
Add Assessment
↓
Track Follow-Up
↓
Receive Offer
↓
Mark Hired / Rejected / Withdrawn / Ghosted
↓
Review Timeline
↓
Review Calendar
```

When P2 is complete:

```text
Dashboard
+
Search
+
Filters
+
List
+
Analytics
+
Responsive & Accessible Public Experience
```

At that point Applyo is ready to move from a personal dogfooding tool into a public job application tracker.
