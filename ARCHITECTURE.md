# Applyo — Software Architecture

> **Status:** Draft v1.0  
> **Product:** Applyo  
> **Document Type:** Software Architecture Specification  
> **Primary References:** `PRD.md`, `ROADMAP.md`, `TASKS.md`  
> **Architecture Style:** Full-stack modular monolith  
> **Primary Framework:** Next.js 16 + TypeScript  
> **Backend Platform:** Supabase (PostgreSQL + Auth)  
> **Primary Deployment:** Vercel + Supabase

---

# 1. Purpose

Dokumen ini mendefinisikan bagaimana Applyo dibangun secara teknis.

Dokumen ini menjadi sumber utama untuk keputusan mengenai:

- system architecture;
- frontend/backend boundary;
- project structure;
- authentication;
- authorization;
- database model;
- Row Level Security;
- application lifecycle persistence;
- Kanban drag-and-drop persistence;
- card ordering;
- recruitment events;
- timeline;
- follow-up logic;
- analytics;
- validation;
- error handling;
- caching and revalidation;
- security;
- testing;
- performance;
- observability;
- deployment;
- future scalability.

Dokumen ini tidak mendefinisikan detail visual component.

Visual specification berada di:

```text
DESIGN-SYSTEM.md
```

---

# 2. Architectural Goals

Arsitektur Applyo harus memenuhi beberapa tujuan utama.

## 2.1 Simple to Maintain

Applyo dikelola sebagai project gratis dan tidak membutuhkan kompleksitas distributed system.

Gunakan satu codebase:

```text
Next.js
+
Supabase
```

Hindari service tambahan sampai terdapat masalah nyata yang membutuhkan service tersebut.

---

## 2.2 Secure by Default

Data application bersifat pribadi.

Security tidak hanya bergantung pada UI atau route protection.

Protection dilakukan pada beberapa layer:

```text
UI Route Protection
        ↓
Server Authorization
        ↓
Database Row Level Security
```

---

## 2.3 Reliable Mutations

Operation penting seperti Kanban move harus atomic.

Contoh:

```text
Move Application
├── change stage
├── change ordering
└── write stage history
```

Ketiganya harus berhasil atau gagal bersama.

---

## 2.4 Fast Interaction

Kanban harus terasa instant.

Gunakan:

```text
Optimistic UI
+
Server Mutation
+
Rollback on Failure
```

---

## 2.5 Portable

Applyo tidak boleh terlalu terikat pada platform hosting tertentu.

Vercel digunakan untuk convenience, bukan sebagai requirement arsitektur permanen.

Database tetap standard PostgreSQL.

---

## 2.6 Avoid Premature Infrastructure

Initial architecture tidak menggunakan:

```text
Microservices
Redis
Kafka
RabbitMQ
Elasticsearch
Dedicated API server
Kubernetes
Background job platform
Realtime collaboration
```

Service baru hanya ditambahkan jika requirement nyata muncul.

---

# 3. Technology Stack

## 3.1 Application Framework

```text
Next.js 16
React
TypeScript
App Router
```

Next.js digunakan sebagai:

```text
Frontend
+
Server Rendering
+
Server Actions
+
Route Handlers when required
```

---

## 3.2 UI

```text
Tailwind CSS v4
shadcn/ui
Lucide Icons
dnd-kit
React Hook Form
Zod
```

---

## 3.3 Backend

```text
Supabase
├── PostgreSQL
└── Auth
```

Future optional:

```text
Supabase Storage
```

Storage tidak menjadi dependency MVP.

---

## 3.4 Authentication

```text
Supabase Auth
+
@supabase/ssr
+
Cookie-based session
```

Initial provider:

```text
Email + Password
```

Future:

```text
Google OAuth
```

---

## 3.5 Testing

```text
Vitest
Playwright
```

Potential supporting libraries:

```text
Testing Library
```

---

## 3.6 Deployment

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

# 4. Architectural Style

Applyo menggunakan:

> **Modular Full-Stack Monolith**

Diagram:

```text
┌──────────────────────────────────────────────────────────┐
│                         BROWSER                          │
│                                                          │
│  React Client Components                                 │
│  Kanban Interaction                                      │
│  Forms                                                   │
│  Optimistic UI                                           │
└───────────────────────────┬──────────────────────────────┘
                            │
                            │ Next.js
                            ▼
┌──────────────────────────────────────────────────────────┐
│                       NEXT.JS APP                         │
│                                                          │
│  Server Components                                       │
│  Server Actions                                          │
│  Route Handlers (only when required)                     │
│  Validation                                              │
│  Domain Services                                         │
│  Queries                                                 │
└───────────────────────────┬──────────────────────────────┘
                            │
                            │ Supabase Client / RPC
                            ▼
┌──────────────────────────────────────────────────────────┐
│                        SUPABASE                           │
│                                                          │
│  Auth                                                    │
│  PostgreSQL                                              │
│  Row Level Security                                      │
│  Database Functions                                      │
│  Constraints / Indexes                                   │
└──────────────────────────────────────────────────────────┘
```

---

# 5. Why No Separate Backend Service

Applyo tidak membutuhkan:

```text
Next.js
↓
Express / NestJS
↓
Supabase
```

pada tahap awal.

Alasannya:

1. Next.js sudah menyediakan server runtime.
2. Server Actions cukup untuk internal mutations.
3. Server Components cukup untuk sebagian besar reads.
4. Supabase menyediakan PostgreSQL dan Auth.
5. Dedicated API menambah deployment dan maintenance.
6. Tidak ada native mobile client pada MVP.
7. Tidak ada third-party public API pada MVP.

Dedicated API dapat dipertimbangkan jika nanti muncul:

```text
Mobile App
Browser Extension
Public API
External Webhooks
Third-party Integration
```

---

# 6. Frontend / Backend Responsibility

## 6.1 Frontend Responsibilities

Frontend bertanggung jawab untuk:

```text
Rendering
Interaction
Local UI State
Drag-and-Drop
Optimistic State
Form State
Loading State
Error Presentation
Responsive UX
Accessibility
```

Frontend tidak boleh menentukan authorization.

---

## 6.2 Backend Responsibilities

Backend bertanggung jawab untuk:

```text
Authentication Verification
Authorization
Validation
Database Mutation
Transactional Logic
Canonical Business Rules
Analytics Calculation
Data Isolation
```

---

## 6.3 Database Responsibilities

PostgreSQL bertanggung jawab untuk:

```text
Integrity
Foreign Keys
Constraints
RLS
Atomic Transactions
Canonical Ordering Mutation
Ownership Enforcement
```

---

# 7. Rendering Strategy

Gunakan Server Components sebagai default.

```text
Server Component
    ↓
Fetch data
    ↓
Render initial UI
```

Gunakan Client Component hanya jika membutuhkan:

```text
useState
useEffect
Browser API
Drag-and-drop
Interactive dialog state
Optimistic state
Complex form interaction
```

---

## 7.1 Server Component Examples

```text
Dashboard Page
Applications Page Wrapper
Application Detail Page
Analytics Page
Settings Initial Data
```

---

## 7.2 Client Component Examples

```text
KanbanBoard
ApplicationCard draggable behavior
CreateApplicationDialog
FilterControls
Interactive Calendar
Toast
```

---

## 7.3 Boundary Rule

Do not mark an entire route as client component merely because one child is interactive.

Prefer:

```text
Server Page
├── Server Header
├── Server Data Fetch
└── Client Kanban
```

instead of:

```text
"use client"

Entire Page
```

---

# 8. Mutation Strategy

Internal UI mutations menggunakan:

```text
Server Actions
```

Examples:

```text
createApplication()
updateApplication()
moveApplication()
archiveApplication()
deleteApplication()

createRecruitmentEvent()
updateRecruitmentEvent()
completeRecruitmentEvent()

closeApplication()
reopenApplication()

updatePreferences()
```

---

## 8.1 Route Handlers

Use Route Handlers only when an HTTP endpoint is inherently required.

Potential future examples:

```text
OAuth callback
Webhook receiver
Browser extension API
Public API
External calendar callback
```

Do not create `/api/*` wrappers for every internal action.

---

# 9. Supabase Client Architecture

Use separate clients for browser and server.

Recommended:

```text
src/lib/supabase/
├── client.ts
├── server.ts
└── admin.ts        # only if truly needed
```

---

## 9.1 Browser Client

Browser client uses:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Use cases:

- auth operations that need browser interaction;
- future realtime if adopted;
- carefully scoped direct access if explicitly justified.

Application domain data should normally pass through the server-side query/action layer for architectural consistency.

---

## 9.2 Server Client

Server client reads authenticated cookies and is used in:

```text
Server Components
Server Actions
Route Handlers
```

---

## 9.3 Admin Client

A service-role/admin client is **not** part of normal user request flow.

If required for limited administrative operations:

```text
SUPABASE_SERVICE_ROLE_KEY
```

must remain server-only.

Never expose service role to browser bundles.

---

# 10. Authentication Architecture

Authentication flow:

```text
Browser
↓
Supabase Auth
↓
Session stored in cookies
↓
Next.js Server
↓
Supabase session-aware client
```

---

## 10.1 Next.js 16 Proxy

Because Applyo uses Next.js 16, request interception uses:

```text
proxy.ts
```

not the deprecated:

```text
middleware.ts
```

Proxy may be used for:

- refreshing Supabase auth cookies as required;
- lightweight route redirects;
- optimistic authenticated/unauthenticated routing.

Proxy is not the authorization boundary.

---

## 10.2 Authorization Rule

Never rely only on:

```text
if logged in → allowed
```

Each resource operation must also verify ownership through:

```text
RLS
```

and/or explicit server-side ownership checks.

---

# 11. Route Architecture

Recommended App Router structure:

```text
src/app/
│
├── (marketing)/
│   ├── page.tsx
│   ├── privacy/
│   └── terms/
│
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── auth/
│       └── callback/
│
├── (app)/
│   ├── layout.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── applications/
│   │   ├── page.tsx
│   │   ├── list/
│   │   │   └── page.tsx
│   │   └── [applicationId]/
│   │       └── page.tsx
│   │
│   ├── calendar/
│   │   └── page.tsx
│   │
│   ├── analytics/
│   │   └── page.tsx
│   │
│   └── settings/
│       └── page.tsx
│
└── api/
    └── ... only when justified
```

---

# 12. Feature-Based Source Structure

Recommended:

```text
src/
│
├── app/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── features/
│   │
│   ├── auth/
│   │   ├── actions/
│   │   ├── components/
│   │   ├── schemas/
│   │   └── types/
│   │
│   ├── applications/
│   │   ├── actions/
│   │   ├── components/
│   │   ├── queries/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── kanban/
│   │   ├── actions/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── events/
│   │   ├── actions/
│   │   ├── components/
│   │   ├── queries/
│   │   ├── schemas/
│   │   └── types/
│   │
│   ├── dashboard/
│   ├── calendar/
│   ├── analytics/
│   └── settings/
│
├── lib/
│   ├── supabase/
│   ├── validations/
│   ├── dates/
│   ├── errors/
│   └── utils/
│
├── hooks/
├── types/
└── styles/
```

---

# 13. Dependency Direction

Feature components may depend on shared UI.

```text
features/*
   ↓
components/ui
lib/*
```

Avoid:

```text
components/ui
   ↓
features/applications
```

Base UI must not depend on application domain.

---

# 14. Domain Model Overview

Primary entities:

```text
auth.users
     │
     ▼
profiles
     │
     ├───────────────┐
     │               │
     ▼               ▼
pipeline_stages    user_preferences
     │
     ▼
applications
     │
     ├──────────────┬─────────────────┬──────────────────┐
     ▼              ▼                 ▼                  ▼
application_     recruitment_      application_       application_
history          events            offers             outcomes
```

---

# 15. Database Conventions

## 15.1 IDs

Use:

```text
UUID
```

Default:

```sql
gen_random_uuid()
```

---

## 15.2 Time

Use:

```text
timestamptz
```

for timestamps.

Store timestamps in UTC.

Convert for display using user's timezone.

---

## 15.3 Date-Only Values

Use PostgreSQL:

```text
date
```

for values where exact time is not meaningful.

Example:

```text
applied_at
start_date
```

if only a date is needed.

---

## 15.4 Naming

Database:

```text
snake_case
```

TypeScript:

```text
camelCase
```

---

## 15.5 Ownership

Every user-owned domain table should contain:

```text
user_id
```

even when ownership could theoretically be inferred through parent relations.

Benefits:

- simpler RLS;
- simpler queries;
- faster ownership filtering;
- easier audit.

---

# 16. Profiles Table

```sql
profiles
```

Candidate schema:

```text
id              uuid PK → auth.users.id
display_name    text nullable
created_at      timestamptz
updated_at      timestamptz
```

---

## 16.1 Profile Creation

On successful Auth signup, a database trigger/function may create:

```text
profile
+
user preferences
+
default pipeline stages
```

in the same database-side onboarding flow.

---

# 17. User Preferences Table

```sql
user_preferences
```

Candidate:

```text
id              uuid PK
user_id         uuid UNIQUE
currency        text
date_format     text
timezone        text
created_at      timestamptz
updated_at      timestamptz
```

Defaults:

```text
currency     IDR or detected/default product choice
date_format  DD MMM YYYY
timezone     Asia/Jakarta for initial fallback
```

Timezone must be stored as an IANA timezone identifier.

Example:

```text
Asia/Jakarta
Asia/Singapore
Europe/London
America/New_York
```

---

# 18. Pipeline Stage Architecture

Pipeline stages are stored per-user from the beginning.

This intentionally supports future customization without changing the Application relationship.

Table:

```sql
pipeline_stages
```

Candidate fields:

```text
id                uuid PK
user_id           uuid
name              text
slug              text
system_key        text nullable
color_key         text
position          integer
is_closed         boolean
is_visible        boolean
created_at        timestamptz
updated_at        timestamptz
```

---

## 18.1 Default Stages

Every new user receives:

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

## 18.2 `system_key`

`system_key` represents semantic meaning needed by business logic.

Examples:

```text
wishlist
applied
screening
interview
assessment
offer
hired
rejected
withdrawn
ghosted
```

A future custom stage may have:

```text
system_key = null
```

or be associated with a broader semantic category depending on future custom-pipeline design.

MVP default stage keys are treated as protected semantic identifiers.

---

## 18.3 Active vs Closed

```text
Wishlist      active
Applied       active
Screening     active
Interview     active
Assessment    active
Offer         active

Hired         closed
Rejected      closed
Withdrawn     closed
Ghosted       closed
```

Use:

```text
is_closed
```

rather than deriving from stage name.

---

# 19. Applications Table

Primary table:

```sql
applications
```

Candidate fields:

```text
id                  uuid PK
user_id             uuid
stage_id            uuid
company             text
position            text

job_url             text nullable
location            text nullable
work_arrangement    text nullable
employment_type     text nullable
source              text nullable

applied_at          date nullable

salary_min          numeric nullable
salary_max          numeric nullable
currency            text nullable

job_description     text nullable
notes               text nullable

sort_order          bigint

closed_at           timestamptz nullable
archived_at         timestamptz nullable

created_at          timestamptz
updated_at          timestamptz
```

---

# 20. Application Constraints

Minimum constraints:

```text
company non-empty
position non-empty
user_id required
stage_id required
sort_order required
```

Salary:

```text
salary_min >= 0
salary_max >= 0
salary_max >= salary_min
```

where values exist.

---

# 21. Application History

Table:

```sql
application_history
```

Purpose:

> append-only audit trail untuk domain-level application state changes.

Candidate fields:

```text
id                uuid PK
user_id           uuid
application_id    uuid
event_type        text
from_stage_id     uuid nullable
to_stage_id       uuid nullable
metadata          jsonb
occurred_at       timestamptz
created_at        timestamptz
```

---

## 21.1 Event Types

Possible:

```text
application_created
stage_changed
application_closed
application_reopened
application_archived
application_restored
```

Avoid storing visual-only events.

Pure card reorder does not need timeline history.

---

## 21.2 Append-Only Rule

Normal application logic must not edit old history records.

History represents what happened at that time.

Corrections should normally generate a new domain action rather than rewriting history.

Administrative correction can be handled separately if ever required.

---

# 22. Recruitment Events

Table:

```sql
recruitment_events
```

Candidate:

```text
id                uuid PK
user_id           uuid
application_id    uuid

category          text
subtype           text nullable
title             text

scheduled_at      timestamptz nullable
deadline_at       timestamptz nullable

location          text nullable
url               text nullable
notes             text nullable

status            text
completed_at      timestamptz nullable

created_at        timestamptz
updated_at        timestamptz
```

---

## 22.1 Categories

```text
interview
assessment
recruiter_contact
follow_up
offer
other
```

---

## 22.2 Interview Subtypes

```text
hr
user
technical
final
other
```

---

## 22.3 Assessment Subtypes

```text
technical_test
coding_test
psychological_test
case_study
take_home
medical_checkup
other
```

---

## 22.4 Status

Candidate:

```text
scheduled
completed
cancelled
```

Some general events can be inserted directly as `completed`.

Example:

```text
follow_up sent
```

---

# 23. Offer Details

Table:

```sql
application_offers
```

One current offer record per application for MVP.

Candidate:

```text
id                uuid PK
user_id           uuid
application_id    uuid UNIQUE

salary            numeric nullable
currency          text nullable
benefits          text nullable
start_date        date nullable
offer_deadline    timestamptz nullable
notes             text nullable

created_at        timestamptz
updated_at        timestamptz
```

Future multi-offer/revision support can convert this into versioned offers if real usage requires it.

---

# 24. Application Outcomes

Because a closed application can later be reopened, closure metadata should not live only as mutable columns on `applications`.

Use appendable:

```sql
application_outcomes
```

Candidate:

```text
id                  uuid PK
user_id             uuid
application_id      uuid

outcome_key         text
from_stage_id       uuid nullable
outcome_stage_id    uuid

reason_code         text nullable
notes               text nullable

occurred_at         timestamptz
reopened_at         timestamptz nullable

created_at          timestamptz
```

---

## 24.1 Outcome Keys

```text
hired
rejected
withdrawn
ghosted
```

---

## 24.2 Current Closure

Current application state is determined by:

```text
applications.stage_id
+
pipeline_stages.is_closed
+
applications.closed_at
```

Outcome table preserves historical closure cycles.

---

# 25. Entity Relationship Diagram

```text
auth.users
    │ 1
    │
    ▼ 1
profiles
    │
    ├───────────────────────┐
    │                       │
    ▼ N                     ▼ 1
pipeline_stages        user_preferences
    │
    │ 1
    │
    ▼ N
applications
    │
    ├─────────────┬─────────────┬──────────────┬──────────────┐
    │             │             │              │              │
    ▼ N           ▼ N           ▼ 0..1         ▼ N
application_   recruitment_   application_   application_
history        events         offers         outcomes
```

---

# 26. Row Level Security Strategy

RLS is mandatory for all user-owned tables.

Enable RLS on:

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

---

# 27. Standard Ownership Policy

Conceptual pattern:

```sql
user_id = auth.uid()
```

For `profiles`:

```sql
id = auth.uid()
```

Policies required per operation where applicable:

```text
SELECT
INSERT
UPDATE
DELETE
```

---

# 28. Child Resource Security

Even when a child record has its own `user_id`, operation should also ensure the referenced application belongs to the same user.

Conceptually:

```text
recruitment_event.user_id = auth.uid()
AND
application.user_id = auth.uid()
```

This protects against inserting a child row that points to another user's application.

---

# 29. Defense in Depth

Security layers:

```text
Route / App checks
        ↓
Server Action auth check
        ↓
RLS
        ↓
Foreign Keys / Constraints
```

No single layer is treated as sufficient by itself.

---

# 30. Kanban Data Model

Each application has:

```text
stage_id
sort_order
```

Example:

```text
Applied

Company A  1024
Company B  2048
Company C  3072
```

---

# 31. Why Sparse Numeric Ordering

Do not store card position as:

```text
0
1
2
3
4
```

if every insert requires shifting all subsequent rows.

Use sparse values:

```text
1024
2048
3072
4096
```

Moving between two cards:

```text
1024
?
2048
```

new position:

```text
1536
```

This minimizes database writes.

---

# 32. Ordering Data Type

Use:

```text
bigint
```

for `sort_order`.

Initial spacing:

```text
1024
```

or another fixed large gap.

---

# 33. Client Move Payload

Frontend should not be trusted to calculate canonical numeric ordering.

Preferred payload:

```text
applicationId
destinationStageId
beforeApplicationId
afterApplicationId
```

Examples.

Move to beginning:

```text
beforeApplicationId = null
afterApplicationId = firstCardId
```

Move between cards:

```text
beforeApplicationId = previousCardId
afterApplicationId = nextCardId
```

Move to end:

```text
beforeApplicationId = lastCardId
afterApplicationId = null
```

Server/database calculates the new `sort_order`.

---

# 34. `move_application` Database Function

Canonical Kanban move should be implemented as a PostgreSQL function invoked via Supabase RPC.

Conceptual signature:

```text
move_application(
    p_application_id,
    p_destination_stage_id,
    p_before_application_id,
    p_after_application_id
)
```

---

## 34.1 Function Responsibilities

1. Get current authenticated user.
2. Validate application ownership.
3. Validate destination stage ownership.
4. Lock moved application row.
5. Validate neighbor rows belong to same destination stage/user.
6. Determine target `sort_order`.
7. Rebalance target column if no numeric gap exists.
8. Update application stage/order.
9. Insert history if stage changed.
10. Update `updated_at`.
11. Commit as one transaction.
12. Return updated application state.

---

# 35. Rebalancing Strategy

If neighbor values become too close:

```text
before = 1024
after  = 1025
```

there is no integer midpoint.

The function rebalances the target column:

```text
Card A → 1024
Card B → 2048
Card C → 3072
...
```

then computes the requested target order.

Rebalance should happen rarely.

---

# 36. Same-Column Reorder

When stage does not change:

```text
Interview
A
B
C

B → below C
```

Only ordering changes.

Do not create a user-facing stage history entry.

---

# 37. Cross-Column Move

Example:

```text
Applied → Interview
```

Operation updates:

```text
stage_id
sort_order
updated_at
```

and inserts:

```text
application_history.event_type = stage_changed
```

with:

```text
from_stage_id
to_stage_id
```

---

# 38. Optimistic Kanban Flow

```text
User drops card
        ↓
Client snapshots previous board
        ↓
Client moves card immediately
        ↓
Server Action
        ↓
RPC move_application
        ↓
┌───────────────┬─────────────────┐
│ success       │ failure         │
│               │                 │
│ keep state    │ restore snapshot│
│ sync result   │ show toast      │
└───────────────┴─────────────────┘
```

---

# 39. Concurrency Strategy

Applyo is primarily single-user-per-board, so collaborative concurrency is low.

Still, transaction function must safely handle:

- rapid repeated drag;
- duplicate requests;
- stale neighbors;
- two browser tabs.

Minimum approach:

```text
row lock moved application
+
validate destination neighbors
+
transactional update
```

If a move conflicts with stale state:

```text
return error
↓
frontend rollback
↓
revalidate board
```

Do not silently guess.

---

# 40. Mutation Idempotency

Most form mutations do not require dedicated idempotency keys for MVP.

For drag mutations, frontend should prevent overlapping mutations for the same card.

If future network retries cause duplicate domain events, introduce request/mutation IDs.

---

# 41. Application Creation Flow

```text
Client Form
↓
React Hook Form
↓
Client Zod validation
↓
Server Action
↓
Server Zod validation
↓
Authenticated Supabase client
↓
INSERT application
↓
INSERT application_created history
↓
Return created application
↓
Update / revalidate UI
```

Creation + initial history should ideally execute atomically through a database function if both are required as canonical records.

---

# 42. Application Update Flow

Normal metadata update:

```text
Company
Position
URL
Location
Notes
Salary
```

uses:

```text
Server Action
↓
Validation
↓
UPDATE
```

Stage changes should **not** use generic update action.

Always use canonical:

```text
moveApplication()
```

This avoids stage update without history.

---

# 43. Recruitment Event Flow

```text
Create Event Form
↓
Zod
↓
Server Action
↓
Ownership check / RLS
↓
INSERT recruitment_event
↓
Revalidate application + calendar + dashboard
```

---

# 44. Timeline Architecture

Timeline combines:

```text
application_history
+
recruitment_events
+
application_outcomes if needed
```

Initial implementation should combine records in server-side application code rather than create a complex public database view.

Result shape:

```ts
type TimelineItem =
  | StageHistoryTimelineItem
  | RecruitmentEventTimelineItem
  | OutcomeTimelineItem
```

Sort by:

```text
occurredAt DESC
```

or ascending based on UI design.

---

# 45. Timeline Normalization

Normalize all timeline records to:

```text
id
kind
title
description
occurredAt
metadata
```

Domain-specific information remains in typed metadata.

This keeps rendering simple while source tables remain normalized.

---

# 46. Follow-Up Architecture

Follow-up is represented as a recruitment event.

Example:

```text
category = follow_up
status = completed
completed_at = now()
```

---

# 47. Last Activity Definition

`last_activity_at` should be derived from meaningful application activity.

Candidates:

```text
latest stage history
latest completed/scheduled recruitment event creation/update as defined
latest follow-up
application creation
```

For MVP, calculate through a query rather than storing a mutable duplicate column unless performance later requires denormalization.

---

# 48. Waiting Duration

Concept:

```text
waiting_since =
max(
  last meaningful activity,
  applied_at,
  created_at
)
```

Then:

```text
now - waiting_since
```

Do not show waiting suggestion for:

```text
closed application
archived application
```

Potential stage-specific exclusions can be added later.

---

# 49. Ghosted Rule

System never automatically updates stage to Ghosted.

Backend may return:

```text
followUpSuggested = true
```

based on configurable rule.

User must invoke:

```text
closeApplication(outcome = ghosted)
```

---

# 50. Close Application Transaction

Canonical close operation:

```text
close_application(
    application_id,
    outcome_stage_id,
    reason_code,
    notes
)
```

Responsibilities:

1. verify ownership;
2. validate destination stage is closed;
3. capture current stage;
4. update application stage;
5. set `closed_at`;
6. set appropriate ordering;
7. insert application history;
8. insert application outcome;
9. commit atomically.

---

# 51. Reopen Application Transaction

Canonical:

```text
reopen_application(
    application_id,
    destination_stage_id
)
```

Responsibilities:

1. verify current application is closed;
2. validate destination stage is active;
3. update stage;
4. set `closed_at = null`;
5. set card ordering;
6. mark latest active outcome record `reopened_at`;
7. write history;
8. commit.

---

# 52. Archive Architecture

Archive is orthogonal to stage.

An application can technically be:

```text
active + archived
closed + archived
```

Default UI hides:

```text
archived_at IS NOT NULL
```

Restore sets:

```text
archived_at = null
```

---

# 53. Delete Architecture

Hard delete is allowed only after explicit user confirmation.

Foreign-key behavior should clean child records.

Recommended:

```text
applications
  ON DELETE CASCADE
    → history
    → events
    → offers
    → outcomes
```

Deletion should be server-authorized and protected by RLS.

---

# 54. Database Foreign Keys

Conceptual:

```text
profiles.id
    → auth.users.id

pipeline_stages.user_id
    → auth.users.id

applications.user_id
    → auth.users.id

applications.stage_id
    → pipeline_stages.id

application_history.application_id
    → applications.id ON DELETE CASCADE

recruitment_events.application_id
    → applications.id ON DELETE CASCADE

application_offers.application_id
    → applications.id ON DELETE CASCADE

application_outcomes.application_id
    → applications.id ON DELETE CASCADE
```

---

# 55. Database Index Strategy

Initial indexes:

## Applications

```text
(user_id)
(user_id, stage_id)
(user_id, archived_at)
(user_id, closed_at)
(user_id, stage_id, sort_order)
(user_id, applied_at)
```

---

## History

```text
(application_id, occurred_at DESC)
(user_id, occurred_at DESC)
```

---

## Events

```text
(application_id, scheduled_at)
(user_id, scheduled_at)
(user_id, deadline_at)
```

---

## Outcomes

```text
(application_id, occurred_at DESC)
(user_id, outcome_key)
```

---

# 56. Search Strategy

MVP search requirement:

```text
company
position
```

Initial implementation may use PostgreSQL case-insensitive matching.

Conceptually:

```text
ILIKE
```

For user datasets in the hundreds, this is sufficient.

Do not introduce Elasticsearch.

If scale/search requirements grow, consider:

```text
PostgreSQL full-text search
trigram indexes
```

before external search infrastructure.

---

# 57. Filtering Strategy

Apply filters server-side for list view and large datasets.

Potential parameters:

```text
stage
outcome
source
dateFrom
dateTo
archived
query
sort
```

Use validated URL search parameters for list view where practical.

---

# 58. Board Loading Strategy

Board only needs:

```text
active
non-archived
applications
```

plus necessary card metadata.

Do not fetch full:

```text
job_description
large notes
complete history
```

for every card.

Board query should return compact DTO.

---

# 59. Application Detail Loading Strategy

Application detail can fetch richer data:

```text
application
stage
events
history
offer
outcomes
```

Use parallel reads where possible.

---

# 60. DTO Strategy

Do not expose raw database rows directly to every component.

Create domain-oriented types.

Examples:

```text
ApplicationCardDTO
ApplicationDetailDTO
DashboardSummaryDTO
CalendarEventDTO
AnalyticsSummaryDTO
```

Benefits:

- stable UI contracts;
- smaller payload;
- clearer nullable values;
- easier refactoring.

---

# 61. Validation Architecture

Use Zod on both frontend-friendly boundaries and server mutation boundaries.

Canonical server validation is mandatory.

Examples:

```text
createApplicationSchema
updateApplicationSchema
moveApplicationSchema
createEventSchema
offerSchema
closeApplicationSchema
preferencesSchema
```

---

# 62. Client vs Server Validation

Client:

```text
fast feedback
```

Server:

```text
trusted validation
```

Database:

```text
final integrity constraints
```

Flow:

```text
Client Zod
↓
Server Zod
↓
Database Constraint
```

---

# 63. Error Architecture

Define application error classes/categories.

Potential:

```text
ValidationError
UnauthorizedError
ForbiddenError
NotFoundError
ConflictError
DatabaseError
UnexpectedError
```

---

# 64. Server Action Result

Recommended discriminated union:

```ts
type ActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        fieldErrors?: Record<string, string[]>;
      };
    };
```

Do not send raw database error messages directly to users.

---

# 65. Error Logging

User sees:

```text
Lamaran tidak dapat dipindahkan.
Silakan coba lagi.
```

Server logs enough technical context:

```text
operation
user id
resource id
database error code
correlation/request context where available
```

Never log:

```text
password
auth tokens
service role keys
full sensitive notes unnecessarily
```

---

# 66. Caching Strategy

User-specific application data changes frequently and should favor correctness.

Initial rule:

> **Do not aggressively cache private mutable job-tracking data.**

Reads can be rendered dynamically when authentication/session data is involved.

---

# 67. Revalidation Strategy

After mutation, invalidate the smallest relevant UI surface practical.

Conceptual mapping:

## Create Application

Refresh:

```text
applications board
applications list
dashboard
analytics
```

---

## Move Application

Refresh:

```text
applications board
application detail
dashboard
analytics
```

---

## Create Event

Refresh:

```text
application detail
calendar
dashboard
```

---

## Close Application

Refresh:

```text
board
closed view
dashboard
analytics
application detail
```

---

# 68. Next.js Cache API Rule

Do not scatter:

```text
revalidatePath()
```

randomly across actions.

Centralize revalidation helpers where practical.

Example:

```text
revalidateApplicationViews()
revalidateEventViews()
```

If cache tags are introduced, define consistent tag names.

Example future pattern:

```text
user:{userId}:applications
application:{applicationId}
user:{userId}:dashboard
user:{userId}:calendar
```

---

# 69. Server Actions and Read-Your-Writes

After user mutations, the UI should reflect new data immediately.

Use:

```text
optimistic state
+
server return value
+
targeted revalidation
```

rather than relying only on broad route refresh.

---

# 70. State Management

Initial global client state library:

```text
none
```

Use:

```text
React local state
Server Component data
URL state
useOptimistic / optimistic patterns
```

---

# 71. When Zustand Could Be Added

Only consider Zustand if Kanban/client state becomes difficult due to:

- cross-page persistent drafts;
- complex board state;
- large shared client interactions.

Do not introduce Redux.

---

# 72. React Hook Form

Use React Hook Form for:

```text
Create Application
Edit Application
Event Forms
Offer
Settings
```

Zod resolver can provide client validation while server repeats trusted validation.

---

# 73. URL State

Use URL search parameters for durable view state such as:

```text
Applications List:
?q=developer
&stage=interview
&source=linkedin
```

Avoid putting sensitive data in URLs.

---

# 74. Kanban Client State

The Kanban client receives initial:

```text
stages
applications
```

Then maintains temporary ordering during drag.

Structure conceptually:

```ts
type BoardState = {
  stages: StageDTO[];
  cardsByStage: Record<string, ApplicationCardDTO[]>;
};
```

Normalize only if complexity requires it.

Readable code is preferred over premature entity-store abstraction.

---

# 75. Calendar Architecture

Calendar reads recruitment events by visible range.

Query:

```text
start
end
```

Return:

```text
scheduled interviews
assessment deadlines
offer deadlines
other scheduled events
```

Do not fetch all historical events on every calendar load.

---

# 76. Timezone Handling

Canonical rules:

1. Store timestamps in UTC.
2. Store user's IANA timezone preference.
3. Render date/time using user timezone.
4. Convert form-local time into UTC before persistence.
5. Date-only values remain date-only.

---

# 77. Analytics Architecture

Analytics is computed from PostgreSQL data.

MVP does not need external analytics warehouse.

Source tables:

```text
applications
application_history
recruitment_events
application_outcomes
```

---

# 78. Analytics Metrics

Minimum:

```text
Total Applications
Active Applications
Interview Count
Assessment Count
Offer Count
Hired Count
Rejected Count
```

---

# 79. Conversion Definition

Conversion definitions must be explicit.

Example:

### Applied → Interview

Numerator:

```text
applications that have ever reached interview
```

Denominator:

```text
applications that reached applied or beyond
```

Do not calculate based only on current stage because an application may later be:

```text
Rejected
Hired
Ghosted
```

History/events are required to know whether a stage was ever reached.

---

# 80. Stage Analytics Source

Use application history to determine:

```text
ever reached interview
ever reached offer
```

rather than current `stage_id`.

This is one reason stage history is core product data.

---

# 81. Analytics Query Strategy

Start with SQL aggregate queries or database functions.

Potential functions:

```text
get_dashboard_summary()
get_application_analytics()
get_application_trend()
```

Functions should execute under user identity or accept no arbitrary user ID.

Prefer:

```text
auth.uid()
```

inside user-scoped database functions.

---

# 82. Dashboard Architecture

Dashboard aggregates:

```text
application counts
upcoming events
needs attention
```

Keep sections separately queryable if one query becomes expensive.

Initial server page can execute them in parallel.

---

# 83. Needs Attention Logic

Potential rules:

```text
Interview within 24h
Assessment deadline within 48h
Offer deadline within 48h
Application inactive > threshold
```

Thresholds should eventually be configurable.

Do not create background jobs merely to display these states.

Compute when dashboard is loaded.

---

# 84. Notifications

No out-of-app notification system in MVP.

Therefore no requirement for:

```text
cron jobs
email worker
push notifications
queue
```

Future notification architecture can be added separately.

---

# 85. Storage Architecture

Supabase Storage is not required for initial MVP.

Reason:

- public free product;
- file storage can become primary cost driver;
- CV upload is not core tracking functionality.

Initial document tracking, if introduced, should prefer metadata/reference before binary uploads.

---

# 86. Realtime Architecture

Supabase Realtime is not used in MVP.

Reason:

```text
one user
→ one personal board
```

No collaboration requirement.

Normal mutation + optimistic UI provides sufficient UX.

---

# 87. Security Architecture

Security priorities:

```text
Authentication
Authorization
RLS
Input Validation
Secret Management
Safe Links
Data Isolation
Account Deletion
```

---

# 88. Authentication vs Authorization

Authentication answers:

> Who are you?

Authorization answers:

> Can you access this application?

Applyo requires both.

---

# 89. Direct Object Reference Protection

Route:

```text
/applications/:id
```

must never assume that knowing an ID grants access.

Query should operate under user-scoped RLS.

Unauthorized resource should behave as:

```text
not found / inaccessible
```

without exposing another user's metadata.

---

# 90. External URL Safety

User may store:

```text
job_url
event URL
```

When rendering:

- validate protocol;
- allow `http` / `https`;
- add safe external link attributes;
- do not inject raw HTML.

---

# 91. Rich Text

MVP should store:

```text
job_description
notes
```

as plain text.

Avoid rich-text HTML persistence initially.

Benefits:

- simpler security;
- less XSS surface;
- simpler editing.

Rich text can be evaluated later.

---

# 92. Secrets

Browser-safe:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Server-only:

```text
SUPABASE_SERVICE_ROLE_KEY
other private credentials
```

Never prefix secrets with:

```text
NEXT_PUBLIC_
```

---

# 93. CSRF / Mutation Safety

Server Actions and Supabase session handling reduce some traditional API boilerplate, but authorization is still mandatory.

For custom Route Handlers that mutate state:

- validate origin/auth as appropriate;
- avoid unauthenticated mutations;
- use same validation layer.

---

# 94. Rate Limiting

Not required for every authenticated mutation initially.

Consider rate limiting for abuse-prone public endpoints such as:

```text
signup-related endpoints
future public forms
future metadata extraction
future AI endpoint
```

Do not add Redis solely for rate limiting before it is needed.

---

# 95. Account Deletion

Account deletion should remove user-owned domain data.

Preferred flow:

```text
Confirm
↓
Re-auth if required
↓
Delete domain data / auth account
↓
Session invalidated
↓
Redirect to public page
```

Implement using trusted server-side logic.

---

# 96. Database Trigger Strategy

Triggers are acceptable for invariant database lifecycle behavior.

Good candidates:

```text
updated_at
new-user profile initialization
default stage creation
```

Avoid hiding large application business workflows in many unrelated triggers.

Canonical complex actions should use explicit functions.

---

# 97. Updated At

Tables with mutable state should use a consistent `updated_at` mechanism.

Potential:

```text
before update trigger
```

that sets:

```text
updated_at = now()
```

---

# 98. Database Function Security

Database functions exposed via RPC should:

- use minimal permissions;
- verify authenticated ownership;
- use explicit schema qualification;
- avoid dangerous dynamic SQL;
- set safe search path if needed;
- use `SECURITY INVOKER` by default when possible.

Use `SECURITY DEFINER` only if a specific operation requires elevated rights and has been security-reviewed.

---

# 99. Service Layer

Actions should remain thin.

Example:

```text
Server Action
    ↓
parse auth
validate input
    ↓
Domain Service
    ↓
Supabase query / RPC
```

Do not put large business logic directly inside React component files.

---

# 100. Query Layer

Feature query files:

```text
features/applications/queries/
├── get-applications.ts
├── get-application-detail.ts
└── get-board.ts
```

Query functions return domain DTOs.

---

# 101. Action Layer

Example:

```text
features/applications/actions/
├── create-application.ts
├── update-application.ts
├── move-application.ts
├── close-application.ts
└── delete-application.ts
```

---

# 102. Domain Service Layer

Use services for workflows with meaningful rules.

Examples:

```text
application-move-service
application-close-service
timeline-service
analytics-service
```

Do not create service classes for trivial one-line queries.

---

# 103. Type Architecture

Types fall into four categories.

## Database Types

Generated from Supabase.

```text
Database
Tables
Enums if any
```

---

## Input Types

Derived from Zod.

```ts
type CreateApplicationInput =
  z.infer<typeof createApplicationSchema>;
```

---

## Domain Types

Represent business meaning.

```text
ApplicationStage
TimelineItem
ApplicationOutcome
```

---

## DTO Types

Represent UI payload.

```text
ApplicationCardDTO
ApplicationDetailDTO
```

---

# 104. Avoid Duplicate Types

Do not manually rewrite the same schema in:

```text
database.ts
types.ts
form.ts
api.ts
```

Use generated + inferred types where appropriate.

---

# 105. API / Action Naming

Mutations use verbs:

```text
createApplication
updateApplication
moveApplication
closeApplication
reopenApplication
archiveApplication
deleteApplication
```

Queries:

```text
getBoard
getApplication
getApplications
getCalendarEvents
getDashboardSummary
getAnalytics
```

---

# 106. Business Terminology

Use consistently:

```text
Application = one job opportunity being tracked
Stage       = current pipeline position
Event       = recruitment occurrence
Outcome     = closed result
History     = application state audit trail
```

Avoid mixing:

```text
submission
job record
task
ticket
```

for the same domain object.

---

# 107. Performance Strategy

Primary performance goals:

- fast initial board render;
- smooth dragging;
- small card payloads;
- efficient user-scoped queries.

---

# 108. Client Bundle Strategy

Keep heavy logic server-side.

Do not import full chart/calendar libraries into routes that do not use them.

Use route/component-level loading when appropriate.

---

# 109. Kanban Rendering

For ordinary user volumes:

```text
< 100 active cards
```

rendering all active cards is acceptable.

If real users routinely reach hundreds of active cards, evaluate:

```text
virtualization
collapsed columns
pagination by stage
```

only then.

---

# 110. Database Scale Expectations

Initial expected scale per user:

```text
10–500 total applications
```

This is small relational data.

PostgreSQL can handle far beyond this architecture's MVP needs if indexes and queries are reasonable.

---

# 111. Avoid N+1 Queries

Application board should not execute:

```text
1 applications query
+
1 event query per application
```

Use joins, aggregated subqueries, or batched queries.

---

# 112. Upcoming Event Card Data

Card needs only:

```text
nearest upcoming event
```

not all events.

Board query can provide a compact derived field.

---

# 113. Observability

Minimum production visibility:

```text
Vercel application logs
Supabase database/auth logs
client error monitoring if added
```

Recommended post-beta:

```text
Sentry or equivalent
```

if error volume warrants it.

---

# 114. Product Analytics vs User Analytics

Two different concepts.

## Product Analytics

Used by Applyo maintainer to understand usage.

Examples:

```text
registration
activation
feature usage
errors
```

---

## User Analytics

Shown inside Applyo.

Examples:

```text
applications
interviews
offers
conversion
```

Do not mix their data models.

---

# 115. Privacy-Respecting Product Analytics

If product analytics is introduced:

- collect minimal telemetry;
- do not send job descriptions or private notes;
- avoid unnecessary PII;
- document usage in privacy policy.

---

# 116. Testing Architecture

Testing pyramid adapted for Applyo:

```text
       E2E
      /   \
 Integration
   /       \
Unit / Logic
```

Because core value is workflow-heavy, E2E tests are particularly important.

---

# 117. Unit Tests

Target deterministic logic:

```text
Zod validation
date utilities
waiting duration
timeline normalization
analytics calculation
formatting
ordering helper logic
```

---

# 118. Database Tests

Critical database behavior:

```text
constraints
RLS
move_application
close_application
reopen_application
```

These deserve dedicated tests.

---

# 119. Integration Tests

Test action/query behavior against test database where practical.

Examples:

```text
create application
create event
filter applications
analytics query
```

---

# 120. Playwright E2E

Critical flows:

```text
Register
Login
Create Application
Move Application
Refresh
Verify Position
Verify History
Create Interview
View Calendar
Close Application
Reopen
Logout
```

---

# 121. Multi-User Security Test

Mandatory test scenario:

```text
User A creates application X

User B:
- cannot open X
- cannot query X
- cannot update X
- cannot move X
- cannot delete X
```

---

# 122. Development Environments

Recommended environments:

```text
Local
Preview
Production
```

---

## 122.1 Local

Use local Next.js.

Database options:

- Supabase local development; or
- dedicated Supabase development project.

For disciplined migration development, local Supabase is preferred when practical.

---

## 122.2 Preview

Vercel preview deployment.

Do not automatically connect unsafe preview code to production database.

Use a development/staging backend strategy.

---

## 122.3 Production

```text
Vercel Production
+
Supabase Production
```

---

# 123. Environment Variables

Example:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

SUPABASE_SERVICE_ROLE_KEY   # only if needed
```

Additional monitoring keys can be introduced later.

---

# 124. Migration Workflow

Database changes must be migration-driven.

Do not rely on manual production Table Editor changes without migration representation.

Flow:

```text
Create migration
↓
Apply local/development
↓
Test
↓
Commit migration
↓
Apply production during release
```

---

# 125. Seed Data

Seed development with:

```text
sample user
sample stages
sample applications
sample events
```

Production default stage creation is handled via user initialization logic, not generic test seeds.

---

# 126. Deployment Architecture

```text
GitHub
  │
  ▼
Vercel
  │
  │ HTTPS
  ▼
Next.js 16
  │
  │ Supabase JS / RPC
  ▼
Supabase
├── Auth
└── PostgreSQL
```

---

# 127. Region Consideration

Choose deployment/database regions reasonably close to primary users when configuration allows.

Avoid premature multi-region complexity.

Latency is less important than keeping application and database reasonably colocated.

---

# 128. Backup Strategy

Use Supabase platform backup capabilities according to selected plan.

For a free public project:

- understand free-plan recovery limitations;
- keep migrations in Git;
- provide future user export capability;
- consider periodic logical backup if usage becomes important.

---

# 129. Portability

Because the database is PostgreSQL and business rules are mostly SQL/functions + TypeScript:

Potential future migration:

```text
Vercel → another Node host
Supabase Postgres → managed PostgreSQL
Supabase Auth → another auth provider
```

is possible, though not zero-cost.

Avoid platform-specific features unless they deliver clear value.

---

# 130. ORM Decision

MVP does **not** use:

```text
Prisma
Drizzle ORM
```

Primary data access:

```text
Supabase JS
+
PostgreSQL functions
+
SQL migrations
```

Reasons:

1. Supabase already provides typed data access.
2. RLS is a core architecture component.
3. Complex canonical mutations are better represented as PostgreSQL transactions/functions.
4. Additional ORM layer adds duplication at current complexity.

---

# 131. When ORM Could Be Reconsidered

Revisit if:

- server-side query complexity expands significantly;
- Supabase Data API becomes limiting;
- direct Postgres connections become standard;
- reporting queries benefit from query builder ergonomics.

Do not add ORM solely because it is common in Next.js projects.

---

# 132. Architecture Decision Records

Important architecture decisions should be recorded.

Recommended folder:

```text
docs/adr/
```

Example:

```text
0001-fullstack-monolith.md
0002-supabase-auth-postgres.md
0003-no-orm-mvp.md
0004-user-owned-pipeline-stages.md
0005-sparse-kanban-ordering.md
```

For this small project, ADRs can remain lightweight.

---

# 133. ADR-001 — Modular Monolith

**Decision:** Use one Next.js application rather than separate frontend/backend services.

**Reason:**

- simpler development;
- fewer deployments;
- sufficient scale;
- Server Actions available;
- no public API requirement.

**Revisit when:**

- multiple clients appear;
- independent backend deployment becomes necessary.

---

# 134. ADR-002 — Supabase

**Decision:** Use Supabase PostgreSQL + Auth.

**Reason:**

- relational data fit;
- built-in auth;
- RLS;
- simple hosting;
- standard PostgreSQL.

---

# 135. ADR-003 — No ORM Initially

**Decision:** Use Supabase typed client + SQL/RPC.

**Reason:**

- less abstraction;
- native RLS;
- fewer moving parts.

---

# 136. ADR-004 — Pipeline Stages Per User

**Decision:** Default stages are inserted per user.

**Reason:**

- future stage customization;
- future reordering;
- no schema redesign required.

**Tradeoff:**

- more rows than a global stage enum;
- onboarding initialization is slightly more complex.

---

# 137. ADR-005 — Sparse Numeric Card Ordering

**Decision:** Persist `sort_order bigint` with large gaps.

**Reason:**

- fewer write operations;
- simple SQL;
- suitable for personal Kanban.

**Fallback:**

- rebalance column when gaps are exhausted.

---

# 138. ADR-006 — Stage Move Through RPC

**Decision:** Stage transitions use a database transaction function.

**Reason:**

```text
stage
ordering
history
```

must remain consistent.

---

# 139. ADR-007 — Events Separate from Stages

**Decision:** Interview/assessment are recruitment events; broad process position remains stage.

**Reason:**

Companies have varied flows such as:

```text
Interview
Assessment
Interview
```

A rigid one-column-per-step model would be too restrictive.

---

# 140. ADR-008 — Closed Outcome History

**Decision:** Closure is stored both in current application state and appendable outcome/history records.

**Reason:**

Applications may later reopen.

---

# 141. ADR-009 — No Realtime MVP

**Decision:** Do not use Supabase Realtime initially.

**Reason:**

No collaboration requirement.

---

# 142. ADR-010 — No File Upload MVP

**Decision:** Supabase Storage is deferred.

**Reason:**

Storage is not required for core value and may create unnecessary operational cost.

---

# 143. Future Browser Extension Architecture

If added later:

```text
Browser Extension
       ↓
Authenticated HTTP API
       ↓
Next.js Route Handler / dedicated API boundary
       ↓
Application creation service
       ↓
Supabase
```

Do not let extension directly use privileged database credentials.

---

# 144. Future Google Calendar Architecture

Potential:

```text
Applyo
↓
OAuth
↓
Google Calendar API
```

Need:

- encrypted/token-safe server storage;
- refresh token management;
- sync conflict rules;
- revocation handling.

This is explicitly outside MVP.

---

# 145. Future Notification Architecture

If scheduled reminders are added:

```text
Scheduler
↓
Notification Worker
↓
Email / Push
```

At that point evaluate:

- Supabase scheduled functions;
- platform cron;
- dedicated queue.

Do not prebuild this now.

---

# 146. Future AI Architecture

AI is not core to Applyo.

If later added:

```text
job description summary
interview preparation
application insights
```

AI calls must:

- be opt-in;
- avoid exposing unnecessary private data;
- have usage limits;
- not block basic tracker functionality.

---

# 147. Data Retention

MVP:

- data retained while account exists;
- archived application remains retained;
- hard delete removes application;
- account deletion removes associated user data.

If legal/product requirements change, retention policy must be documented.

---

# 148. Privacy by Design

Do not collect:

```text
full address
government ID
unnecessary demographic data
```

Applyo only needs data useful for tracking job applications.

---

# 149. Database Schema Draft

Conceptual SQL only; migration files remain canonical implementation.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  currency text not null default 'IDR',
  date_format text not null default 'DD MMM YYYY',
  timezone text not null default 'Asia/Jakarta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  system_key text,
  color_key text not null,
  position integer not null,
  is_closed boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, slug)
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stage_id uuid not null references pipeline_stages(id),
  company text not null,
  position text not null,
  job_url text,
  location text,
  work_arrangement text,
  employment_type text,
  source text,
  applied_at date,
  salary_min numeric,
  salary_max numeric,
  currency text,
  job_description text,
  notes text,
  sort_order bigint not null,
  closed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table application_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  event_type text not null,
  from_stage_id uuid references pipeline_stages(id),
  to_stage_id uuid references pipeline_stages(id),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table recruitment_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  category text not null,
  subtype text,
  title text not null,
  scheduled_at timestamptz,
  deadline_at timestamptz,
  location text,
  url text,
  notes text,
  status text not null default 'scheduled',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table application_offers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null unique references applications(id) on delete cascade,
  salary numeric,
  currency text,
  benefits text,
  start_date date,
  offer_deadline timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table application_outcomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  outcome_key text not null,
  from_stage_id uuid references pipeline_stages(id),
  outcome_stage_id uuid not null references pipeline_stages(id),
  reason_code text,
  notes text,
  occurred_at timestamptz not null default now(),
  reopened_at timestamptz,
  created_at timestamptz not null default now()
);
```

This draft is descriptive.

Actual migrations must add:

```text
checks
indexes
RLS
triggers
functions
grants
```

---

# 150. Cross-User Stage Integrity

A normal foreign key does not guarantee that:

```text
application.user_id
```

matches:

```text
pipeline_stage.user_id
```

Therefore stage-changing operations must validate same ownership.

Possible stronger database design:

```text
composite foreign key
(user_id, stage_id)
→
pipeline_stages(user_id, id)
```

with a corresponding unique constraint.

This is recommended if implementation ergonomics remain acceptable.

The same principle applies to child tables where ownership consistency can be strengthened structurally.

---

# 151. Recommended Integrity Improvement

Prefer composite ownership foreign keys where they materially prevent cross-user linkage.

Example conceptual:

```text
pipeline_stages UNIQUE(user_id, id)

applications
FOREIGN KEY (user_id, stage_id)
REFERENCES pipeline_stages(user_id, id)
```

This supplements RLS.

---

# 152. RLS Example — Applications

Conceptual only:

```sql
alter table applications enable row level security;

create policy "users can read own applications"
on applications
for select
using (user_id = auth.uid());

create policy "users can create own applications"
on applications
for insert
with check (user_id = auth.uid());

create policy "users can update own applications"
on applications
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users can delete own applications"
on applications
for delete
using (user_id = auth.uid());
```

Equivalent policies are required for other user-owned tables.

---

# 153. Database RPC Response

`move_application` should return enough data to reconcile optimistic client state.

Example:

```text
application_id
stage_id
sort_order
updated_at
```

Potentially:

```text
history_id
```

if useful.

Do not return the entire board unnecessarily.

---

# 154. Contextual Actions Transaction Boundary

Example:

```text
Screening → Interview
```

Moving the card and adding interview details are separate user intentions.

Therefore:

```text
Stage move
```

should commit independently.

Then:

```text
Create interview event
```

is optional.

If the user closes the dialog:

```text
Interview stage remains valid.
```

This prevents optional metadata from blocking the core workflow.

---

# 155. Wishlist → Applied Special Case

When moving to Applied and `applied_at` is null:

1. stage move succeeds;
2. UI prompts for applied date;
3. user may accept default date or skip.

If skipped, `applied_at` remains null.

Business logic must tolerate this.

---

# 156. Offer Special Case

Moving to Offer does not require offer details.

Offer details are optional.

This follows progressive disclosure.

---

# 157. Closed Stage Placement

Closed outcomes should not clutter active board.

Primary board query:

```text
pipeline_stages.is_closed = false
```

Closed view:

```text
pipeline_stages.is_closed = true
```

---

# 158. Stage Customization Compatibility

Although custom stages are post-MVP, architecture supports:

```text
rename custom stage
change position
hide stage
custom color
```

Protected default semantic stages may need restrictions if business rules rely on them.

Potential future strategy:

```text
stage.type_key
```

separate from display name.

---

# 159. Default Stage Naming

Do not use display name for logic.

Bad:

```ts
if (stage.name === "Interview")
```

Good:

```ts
if (stage.systemKey === "interview")
```

Display name may eventually be translated or customized.

---

# 160. Internationalization Readiness

MVP menggunakan Bahasa Indonesia sebagai bahasa antarmuka. Arsitektur harus menghindari penyimpanan UI copy di dalam business logic.

Semua label yang terlihat pengguna, pesan status, error, metadata, dan label aksesibilitas menggunakan Bahasa Indonesia. Identifier internal dan `systemKey` tetap stabil dalam Bahasa Inggris agar business logic tidak terikat pada display label.

Potential future:

```text
Bahasa Indonesia
English (future optional locale)
```

Dates/currency are already preference-aware.

Do not build full i18n infrastructure unless selected for MVP.

---

# 161. Accessibility Architecture

Core actions must not depend exclusively on pointer drag.

Provide:

```text
card menu
→ Ubah Tahap
```

Keyboard interaction should reach all major controls.

Motion respects:

```text
prefers-reduced-motion
```

---

# 162. Responsive Architecture

Desktop is primary Kanban experience.

Mobile:

```text
horizontal board scroll
+
stage change menu
+
responsive card layout
```

Do not require precision dragging on small touchscreens.

---

# 163. Offline Behavior

Offline-first is not part of MVP.

When offline:

- preserve unsent form state when reasonably possible;
- show clear mutation failure;
- do not pretend save succeeded.

PWA/offline sync can be considered later.

---

# 164. Data Export Readiness

Future CSV export should be possible directly from relational model.

Avoid storing core application data solely inside opaque JSON.

Use JSONB only for flexible history metadata.

---

# 165. Data Import Readiness

Future CSV import should pass through the same canonical validation/service layer as manual create.

Do not create a separate loose ingestion path.

---

# 166. Logging Strategy

Use structured server logs where practical.

Example context:

```text
operation: move_application
application_id
user_id
result
error_code
```

Avoid log noise for normal successful reads.

---

# 167. Feature Flags

No dedicated feature flag service initially.

For experimental developer-only flags, environment config or simple database/user flag may be sufficient.

Do not build a feature flag platform.

---

# 168. Dependency Policy

Prefer well-supported dependencies with narrow purpose.

Before adding a dependency, ask:

1. Can platform/browser already do this?
2. Does shadcn/Radix already cover it?
3. Is package actively maintained?
4. Does it materially reduce complexity?

---

# 169. Dependency Updates

Use lockfile.

Update dependencies intentionally.

For major upgrades:

- review release notes;
- run typecheck;
- run unit tests;
- run E2E;
- validate production build.

---

# 170. CI Pipeline

Recommended GitHub CI:

```text
Install
↓
Lint
↓
Typecheck
↓
Unit Tests
↓
Build
```

For protected main branch, E2E can run against preview/test environment where practical.

---

# 171. Pull Request Quality Gate

Before merge:

```text
lint passes
typecheck passes
tests pass
build passes
database migration reviewed
no secrets committed
```

---

# 172. SQL Review Rule

Any migration changing:

```text
RLS
database function
foreign key
delete behavior
```

requires extra review because it affects data security/integrity.

---

# 173. Production Migration Safety

Avoid destructive migrations in one step when real data exists.

Prefer:

```text
add
backfill
switch
remove old
```

for future schema changes.

---

# 174. Architecture Health Checks

Revisit architecture if any become true:

```text
> significant public traffic
> database costs become material
> 500+ active cards common
> mobile app introduced
> browser extension introduced
> notifications required
> AI usage introduced
> shared/collaborative boards introduced
```

---

# 175. What Not to Optimize Yet

Do not prematurely optimize:

```text
multi-region writes
event streaming
CQRS
read replicas
sharding
distributed cache
WebSockets
```

These do not match current product scale.

---

# 176. Architecture Implementation Sequence

Recommended technical sequence:

```text
01. Initialize Next.js
02. Configure design primitives
03. Configure Supabase
04. Implement @supabase/ssr clients
05. Implement proxy auth refresh
06. Create database migrations
07. Profiles + preferences
08. Pipeline stages + default initialization
09. Applications table + RLS
10. Application CRUD
11. Application history
12. move_application RPC
13. Kanban integration
14. Recruitment events
15. Timeline normalization
16. Close/reopen RPC
17. Offers
18. Follow-up queries
19. Calendar queries
20. Dashboard queries
21. Analytics
22. Security tests
23. E2E
24. Production deployment
```

---

# 177. Architecture Definition of Done

Architecture foundation is considered correctly implemented when:

## Authentication

- [ ] cookie-based Supabase Auth works;
- [ ] protected routes work;
- [ ] session refresh works;
- [ ] logout invalidates session.

## Database

- [ ] migrations reproduce schema;
- [ ] RLS enabled;
- [ ] ownership constraints work;
- [ ] default stages created;
- [ ] indexes exist.

## Applications

- [ ] CRUD works;
- [ ] stage cannot be silently changed through generic update;
- [ ] Kanban ordering persists;
- [ ] cross-column move is atomic;
- [ ] history is consistent.

## Recruitment

- [ ] events are private;
- [ ] timeline is normalized;
- [ ] closing/reopening is transactional.

## Security

- [ ] User A cannot access User B;
- [ ] service role is not exposed;
- [ ] server validation exists;
- [ ] direct object access is protected.

## Reliability

- [ ] optimistic rollback works;
- [ ] mutations expose typed errors;
- [ ] stale views are revalidated.

## Quality

- [ ] typecheck passes;
- [ ] tests cover critical logic;
- [ ] production build succeeds.

---

# 178. Architecture Summary

Final Applyo architecture:

```text
┌──────────────────────────────────────────────┐
│                  CLIENT                      │
│                                              │
│ React Client Components                      │
│ Tailwind + shadcn/ui                         │
│ dnd-kit                                      │
│ React Hook Form                              │
│ Optimistic UI                                │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│                 NEXT.JS 16                   │
│                                              │
│ App Router                                   │
│ Server Components                            │
│ Server Actions                               │
│ Zod                                          │
│ Domain Services                              │
│ Query Layer                                  │
│ proxy.ts for request/auth boundary           │
└───────────────────┬──────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│                  SUPABASE                    │
│                                              │
│ Auth                                         │
│ PostgreSQL                                   │
│ RLS                                          │
│ Transactions / RPC                           │
│ Constraints                                  │
│ Indexes                                      │
└──────────────────────────────────────────────┘
```

Key decisions:

```text
Modular monolith
No dedicated backend service
No ORM initially
Server Components by default
Server Actions for internal mutations
Supabase Auth with cookie-based SSR
RLS as database authorization boundary
Per-user pipeline stages
Sparse bigint Kanban ordering
Transactional RPC for card movement
Stage and recruitment events separated
Append-only history
No realtime MVP
No file upload MVP
No background workers MVP
```

The architecture is intentionally simple enough for a single developer to maintain while preserving the data integrity, privacy, and extensibility required for a public job application tracker.

---

# 179. Related Documents

```text
PRD.md
ROADMAP.md
TASKS.md
ARCHITECTURE.md
DESIGN-SYSTEM.md
```

Responsibilities:

```text
PRD
→ what and why

ROADMAP
→ sequence and milestones

TASKS
→ implementation backlog

ARCHITECTURE
→ technical system design

DESIGN SYSTEM
→ visual and interaction language
```
