# AGENTS.md — Applyo

> **Project:** Applyo  
> **Purpose:** Operating instructions for AI coding agents working in this repository  
> **Development Style:** Agentic / AI-assisted development  
> **Core Product:** Free job application tracker with Kanban-based recruitment tracking

---

## 1. Purpose

This file defines how AI coding agents must work inside the Applyo repository.

The goal is to keep agentic development:

- predictable;
- safe;
- incremental;
- aligned with product requirements;
- resistant to unnecessary refactors;
- easy to review;
- reliable when testing UI behavior.

These instructions apply to all coding agents unless the current user task explicitly overrides them.

---

## 2. Project Overview

Applyo is a free public web application for job seekers.

Users can:

- track job applications;
- manage recruitment stages;
- move application cards through a Kanban board;
- record interviews and assessments;
- track follow-ups;
- manage offers;
- close applications as Hired, Rejected, Withdrawn, or Ghosted;
- review calendar events and job-search analytics.

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

Primary UX goal:

> Make job hunting easier to manage without making the interface feel like another administrative chore.

---

## 3. Source of Truth

Before making product, architecture, database, or design decisions, read the relevant project documentation.

Primary documents:

```text
PRD.md
ROADMAP.md
TASKS.md
ARCHITECTURE.md
DESIGN-SYSTEM.md
AGENTS.md
```

Use them as follows:

### `PRD.md`

Defines **what**, **why**, and **for whom**.

Read for:

- feature requirements;
- product behavior;
- user flows;
- MVP scope;
- non-goals.

### `ROADMAP.md`

Defines implementation sequence and milestones.

Read for:

- phase order;
- milestone dependencies;
- release priorities.

### `TASKS.md`

Defines executable backlog items.

Read for:

- task IDs;
- acceptance criteria;
- dependencies;
- frontend/backend/integration boundaries.

### `ARCHITECTURE.md`

Defines how the system works technically.

Read before changing:

- database;
- Supabase;
- authentication;
- RLS;
- Server Actions;
- Kanban ordering;
- data access;
- validation;
- caching;
- deployment.

### `DESIGN-SYSTEM.md`

Defines how Applyo looks, feels, and behaves.

Read before changing:

- colors;
- typography;
- shadows;
- borders;
- components;
- motion;
- responsive behavior;
- microcopy;
- emotional UX.

---

## 4. Documentation Precedence

When instructions conflict, use this order:

```text
1. Explicit user instruction in the current task
2. AGENTS.md
3. PRD.md
4. ARCHITECTURE.md
5. DESIGN-SYSTEM.md
6. TASKS.md
7. ROADMAP.md
8. Existing implementation
```

If existing code conflicts with documented architecture or product behavior, do not silently preserve the inconsistency. Identify it and apply the smallest safe correction required for the current task.

Do not broaden scope unless necessary.

---

## 5. Core Tech Stack

Expected stack:

```text
Next.js 16
React
TypeScript
App Router

Tailwind CSS v4
shadcn/ui
Lucide Icons
dnd-kit

Supabase
├── PostgreSQL
└── Auth

React Hook Form
Zod

Vitest
Playwright
```

Do not introduce another framework or major dependency without a clear requirement.

---

## 6. Architecture Rules

Applyo uses a **modular full-stack monolith**.

Do not introduce the following unless an explicit architecture change requires them:

```text
Express
NestJS
separate backend service
microservices
Redis
message queue
Elasticsearch
ORM
realtime infrastructure
```

### ORM rule

MVP does not use:

```text
Prisma
Drizzle
```

Primary data access:

```text
Supabase typed client
+
PostgreSQL
+
SQL migrations
+
RPC/database functions for transactional logic
```

Do not install an ORM casually.

---

## 7. Server and Client Components

Use Server Components by default.

Use Client Components only when required for:

- browser APIs;
- local interactive state;
- drag-and-drop;
- interactive forms;
- optimistic state;
- client-only UI behavior.

Do not add `"use client"` to an entire page because one nested child is interactive.

Prefer:

```text
Server Page
├── Server data loading
└── Client interactive component
```

---

## 8. Feature Structure

Prefer feature-based organization.

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
├── lib/
├── hooks/
└── types/
```

Keep domain logic close to its feature.

Do not create generic folders that become dumping grounds.

---

## 9. Domain Terminology

Use these terms consistently:

```text
Application
Stage
Recruitment Event
Outcome
History
Pipeline
```

Definitions:

```text
Application = one tracked job opportunity
Stage = current recruitment pipeline position
Recruitment Event = interview, assessment, follow-up, recruiter contact, etc.
Outcome = Hired, Rejected, Withdrawn, or Ghosted
History = append-only record of important application state changes
```

Do not randomly switch between `job`, `submission`, `ticket`, `record`, or `task` when referring to an Application.

---

## 10. Stage vs Recruitment Event

This distinction is critical.

Default broad stages:

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

Events represent detailed recruitment steps.

Example:

```text
Stage: Interview

Events:
- HR Interview
- Technical Interview
- Final Interview
```

Do not model every interview as a pipeline stage.

---

## 11. Database Rules

All schema changes must use migrations.

Do not make undocumented manual production database changes.

Preferred workflow:

```text
Create migration
↓
Apply locally/development
↓
Test
↓
Commit migration
↓
Apply through release workflow
```

---

## 12. Data Ownership and RLS

User-owned data must be protected by:

```text
Server authorization
+
Supabase RLS
+
Database integrity
```

RLS is mandatory for user-owned tables.

Typical ownership:

```text
user_id = auth.uid()
```

Never disable RLS as a shortcut to fix a query.

Never trust client-supplied ownership.

---

## 13. Service Role Safety

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

to the browser.

Do not use a service-role client for normal user requests when authenticated RLS access is sufficient.

---

## 14. Canonical Stage Changes

Stage changes must not be performed through a generic application update if stage history and card ordering are involved.

Use the canonical move operation.

Conceptually:

```text
moveApplication()
↓
move_application RPC
```

This keeps:

```text
stage
ordering
history
```

consistent.

---

## 15. Kanban Ordering

Expected data model:

```text
stage_id
sort_order bigint
```

Use sparse numeric ordering and database-side reconciliation as defined in `ARCHITECTURE.md`.

The frontend must not be the final authority for canonical card order.

Do not replace the ordering model without an explicit architectural reason.

---

## 16. Atomic Business Operations

Operations affecting multiple records must be transactional when required.

Example:

```text
Move Application
├── update stage
├── update sort order
└── write history
```

Another example:

```text
Close Application
├── change stage
├── set closed state
├── write history
└── write outcome
```

Avoid partial writes.

---

## 17. Validation

Use Zod.

Client validation exists for UX.

Server validation is authoritative.

Database constraints provide the final integrity layer.

Expected flow:

```text
Client validation
↓
Server validation
↓
Database constraint
```

---

## 18. Forms

Use React Hook Form where the project already follows that pattern.

Preserve:

- form state;
- validation;
- keyboard behavior;
- submit behavior;
- server error mapping.

When fixing a styling or layout bug, do not rewrite form logic unless the root cause is actually inside form logic.

---

## 19. Design Direction

Applyo uses:

> **Playful Neobrutalism + Cartoon Personality**

Core visual language:

```text
Warm cream background
White surfaces
Bold black borders
Solid black offset shadows
Colorful flat accents
Friendly typography
Tactile interactions
```

Do not introduce unrelated visual styles.

---

## 20. Design System Rule

Before styling a new component, inspect `DESIGN-SYSTEM.md` and existing reusable primitives.

Prefer existing:

- CSS variables;
- Tailwind tokens;
- component variants;
- design utilities.

Avoid hardcoding repeated design values if tokens already exist.

---

## 21. Visual Hierarchy

Fun does not mean every element should be visually loud.

Preferred balance:

```text
mostly neutral surfaces
+
black structure
+
controlled accent colors
```

Do not:

- make every card a different strong color;
- add hard shadows to every tiny element;
- add random rotations;
- overuse animation.

Cards should remain mostly neutral, while stage colors act as accents.

---

## 22. Motion

Motion should communicate state.

Good examples:

```text
button press
card lift
drop settle
dialog pop
toast slide
```

Avoid decorative animation without UX purpose.

Always respect:

```text
prefers-reduced-motion
```

---

## 23. Emotional UX

Job hunting can be exhausting.

Applyo should not use guilt-driven or insensitive language.

Never use copy such as:

```text
You failed
Try harder
You're falling behind
Streak lost
Application goal missed
```

For negative outcomes, use neutral language.

Examples:

```text
Moved to Rejected.
Application withdrawn.
Marked as Ghosted.
```

Do not add motivational spam to rejection flows.

---

## 24. Gamification

Do not add the following without explicit product direction:

```text
XP
leaderboards
daily streaks
job application quotas
competitive scoring
```

Milestone celebration is acceptable for:

```text
First application
First interview
Offer
Hired
```

---

## 25. Scope Discipline

For every task:

> Apply the smallest change that fully satisfies the requested behavior.

Do not perform unrelated cleanup.

Do not:

- redesign unrelated components;
- rename folders unnecessarily;
- replace libraries without need;
- refactor working code just because another style is preferred;
- introduce abstractions before they are useful.

---

## 26. Bug Fix Workflow

For bug fixes:

```text
1. Inspect
2. Reproduce
3. Find root cause
4. Make minimal fix
5. Verify
6. Check regression
```

Do not start rewriting before understanding the current implementation.

For UI-only bugs, preserve:

- data flow;
- form behavior;
- validation;
- backend contracts;
- existing successful interactions.

---

## 27. Browser Testing

Use Playwright MCP when browser verification materially improves confidence.

Use it for:

- frontend bug fixes;
- visual regressions;
- forms;
- dropdowns;
- popovers;
- datepickers;
- dialogs;
- responsive issues;
- Kanban drag-and-drop;
- critical end-to-end user flows.

Do **not** automatically use browser testing for:

- documentation;
- markdown-only changes;
- backend-only refactors;
- simple database migrations;
- static configuration changes that have no browser-visible behavior.

---

## 28. Playwright Environment

Expected local browser-testing configuration:

```text
Browser: Chrome
Mode: Headed
Browser visible to developer: Yes
Browser sessions: One at a time
```

The developer should be able to watch the browser actions performed by the agent.

Do not enable headless mode for normal local agent debugging unless explicitly requested.

---

## 29. Playwright Testing Workflow

For relevant frontend tasks:

```text
1. Inspect relevant code.
2. Confirm the dev server is available.
3. Reproduce the issue in Chrome when possible.
4. Apply the smallest targeted fix.
5. Test the affected flow.
6. Check relevant edge states.
7. Check browser console for relevant errors.
8. Perform one final regression check.
9. Stop when the acceptance criteria pass.
```

---

## 30. Playwright Anti-Stuck Rules

The project previously experienced browser automation getting stuck. Follow these rules strictly.

### Never retry indefinitely

If the same browser action fails twice:

```text
STOP RETRYING
↓
inspect the root cause
```

Do not loop like this:

```text
click
snapshot
click
snapshot
reload
snapshot
click
...
```

### Use one browser session

Preferred:

```text
1 Codex session
+
1 Playwright MCP session
+
1 Chrome browser
```

Do not open additional browser instances unless necessary.

### Do not start duplicate dev servers

Before running:

```text
npm run dev
```

check whether the application is already running.

Do not repeatedly spawn development servers.

### Screenshot rule

Take screenshots only when visual verification is useful.

For most fixes, one final screenshot is enough.

Do not create screenshot loops.

### Snapshot rule

Use snapshots to understand page structure, not as a polling mechanism.

Do not repeatedly snapshot the same page without a clear reason.

### Timeout rule

If navigation or an action times out:

- inspect the page state;
- inspect browser console;
- inspect the dev server;
- inspect selector assumptions;
- investigate the root cause.

Do not keep retrying blindly.

---

## 31. Datepicker / Popover Testing

When changing datepickers or popovers, verify:

- popup opens correctly;
- popup is not clipped;
- popup works near viewport edges;
- selected value persists;
- outside click closes it;
- focus and active states remain themed;
- keyboard navigation works;
- there are no relevant console errors.

If a popup is clipped by parent overflow, prefer the existing Portal/Popover architecture over extreme z-index hacks.

Do not use arbitrary values such as:

```text
z-index: 999999
```

as the first fix.

---

## 32. Kanban Browser Testing

For Kanban changes, verify the real persisted flow:

```text
Create or locate card
↓
Move card
↓
Verify target stage
↓
Reload page
↓
Verify persistence
↓
Verify history if stage changed
```

Also test same-column reorder when relevant.

---

## 33. Browser Testing Stop Condition

Do not keep exploring after the task passes its acceptance criteria.

Once the requested behavior is:

```text
implemented
verified
regression checked
```

stop browser testing and report results.

---

## 34. Console Errors

During UI verification, check for relevant browser console errors.

Do not fix unrelated pre-existing warnings unless they block the requested task.

If an unrelated issue is important, report it separately instead of silently broadening scope.

---

## 35. Testing Strategy

Use the appropriate level of testing.

### Unit / Logic

Use for:

- validation;
- date utilities;
- analytics;
- waiting-duration calculations;
- pure domain logic.

### Database / Integration

Use for:

- RLS;
- constraints;
- RPC functions;
- transactional behavior.

### Playwright E2E

Use for:

- critical user flows;
- interactive bugs;
- auth;
- application CRUD;
- Kanban;
- recruitment events.

Do not write E2E tests for every minor visual detail.

---

## 36. Critical E2E Flows

Important product flows include:

```text
Register
↓
Login
↓
Create Application
↓
Move Through Kanban
↓
Verify Persistence
↓
Add Recruitment Event
↓
View Calendar
↓
Close Application
```

---

## 37. Multi-User Security Testing

When changing authorization or data access, verify:

```text
User A cannot read/update/delete User B's data.
```

Security changes require extra caution.

---

## 38. Type Safety

Avoid `any` unless justified.

Prefer:

- generated Supabase types;
- Zod-inferred input types;
- domain types;
- DTOs.

Do not manually duplicate database type definitions without need.

---

## 39. Error Handling

Do not expose raw database errors to users.

User-facing copy should be concise.

Example:

```text
Couldn't move application. Try again.
```

Server logs may contain technical context, but never log:

- passwords;
- tokens;
- service-role credentials;
- unnecessary private job notes.

Do not swallow errors with empty catch blocks.

---

## 40. Loading, Empty, and Error States

Any network-driven UI should consider:

- loading;
- success;
- error;
- empty.

Prefer skeletons for content surfaces.

Use small spinners for button-level actions.

---

## 41. Optimistic UI

Optimistic UI is appropriate for Kanban and lightweight mutations where rollback is safe.

Expected flow:

```text
snapshot previous state
↓
update UI immediately
↓
send mutation
↓
success → keep
failure → rollback
```

Never leave the UI pretending a failed mutation succeeded.

---

## 42. Cache and Revalidation

Follow the targeted revalidation strategy in `ARCHITECTURE.md`.

Do not scatter broad `revalidatePath()` calls without reason.

Avoid unnecessary full-page reloads.

---

## 43. Performance

Avoid:

- N+1 queries;
- fetching full job descriptions for Kanban cards;
- shipping large client bundles;
- turning entire routes into Client Components unnecessarily.

Board cards should use compact DTOs.

---

## 44. Dependency Policy

Before adding a package, ask:

```text
1. Can the platform already do this?
2. Does an existing project dependency solve it?
3. Is the package actively maintained?
4. Does it materially reduce complexity?
```

Avoid dependency churn.

Do not replace core dependencies such as:

```text
dnd-kit
Supabase
shadcn/ui
React Hook Form
Zod
```

without a clear reason.

---

## 45. Git Discipline

Before modifying code:

```text
inspect git status
```

Do not overwrite unrelated uncommitted user work.

If unrelated changes exist:

- preserve them;
- limit edits to requested files;
- do not reset them.

Never run destructive commands such as:

```text
git reset --hard
git clean -fd
```

unless explicitly instructed.

---

## 46. Commit Scope

If asked to commit:

- keep commits focused;
- use descriptive messages;
- exclude unrelated changes.

Suggested style:

```text
fix: prevent datepicker popup clipping
feat: add recruitment event timeline
refactor: extract application query mapping
test: cover kanban stage persistence
docs: update architecture notes
```

---

## 47. Build Verification

Before declaring a significant implementation complete, run relevant checks if available:

```text
lint
typecheck
tests
build
```

Do not run every expensive test after every tiny edit. Choose checks proportional to the task.

Do not weaken CI or type rules merely to make a change pass.

---

## 48. SQL Changes

For migrations, review:

- foreign keys;
- cascade behavior;
- RLS;
- indexes;
- functions;
- ownership integrity.

Test migrations in a non-production environment where possible.

Take extra care when editing:

```text
auth setup
Supabase clients
proxy.ts
RLS migrations
RPC functions
environment handling
account deletion
```

Read `ARCHITECTURE.md` first.

---

## 49. Environment Variables

Do not commit secrets.

Browser-safe variables may use:

```text
NEXT_PUBLIC_
```

Server secrets must not.

If a new environment variable is introduced, update the example env file if one exists.

---

## 50. Accessibility

Core UI must support:

- keyboard navigation;
- visible focus states;
- semantic HTML;
- proper labels;
- reduced motion;
- status indicators that are not color-only.

Target:

```text
WCAG 2.2 AA
```

where reasonably applicable.

Drag-and-drop must not be the only way to change stage.

Every Application Card must provide an accessible fallback such as:

```text
Change Stage
```

---

## 51. Responsive Design

Primary Kanban experience is desktop-oriented.

Mobile must still support:

- viewing applications;
- creating applications;
- editing applications;
- changing stage;
- managing events.

Do not force precision drag as the only mobile interaction.

Interactive touch targets should be approximately 44×44px where practical.

---

## 52. Microcopy

Prefer concise, human language.

Good:

```text
Application added!
All saved!
Moved to Interview.
Nothing here yet.
```

Avoid corporate wording such as:

```text
Your application record has been successfully processed.
```

For rejection and negative outcomes, use neutral acknowledgement rather than motivational language.

---

## 53. Documentation Updates

If implementation materially changes a documented architecture, product behavior, or design rule, update the relevant document in the same task when appropriate.

Examples:

```text
schema changed → ARCHITECTURE.md
major component behavior changed → DESIGN-SYSTEM.md
scope changed → PRD.md / TASKS.md
```

Do not update high-level docs for trivial internal implementation details.

---

## 54. Task Execution Pattern

For each task, work in this sequence:

```text
Goal
↓
Relevant docs
↓
Relevant files
↓
Current behavior
↓
Root cause / implementation plan
↓
Minimal change
↓
Verification
```

Avoid coding before locating the relevant implementation.

---

## 55. Shared Component Safety

Before modifying shared components such as:

```text
Button
Input
Popover
Dialog
Calendar
Card
```

inspect their usages.

Prefer:

- variant-specific fixes;
- scoped classes;
- local wrappers;

over global changes when the bug is local.

Avoid broad CSS selectors that can accidentally affect unrelated components.

---

## 56. Date and Time Rules

Follow the architecture rules:

- timestamps are stored in UTC;
- user timezone is used for display;
- date-only values remain date-only;
- avoid accidental timezone conversion of plain dates.

Do not change date serialization casually.

---

## 57. Analytics Rules

Do not calculate funnel conversion solely from the current stage.

Use history when determining whether an application ever reached a stage.

Example:

```text
Interview → Rejected
```

still counts as having reached Interview.

---

## 58. Follow-Up Rule

The system may suggest a follow-up.

The system must not automatically mark an Application as Ghosted.

The user controls that outcome.

---

## 59. Closed Applications

Closed outcomes:

```text
Hired
Rejected
Withdrawn
Ghosted
```

must remain reopenable if the product behavior supports it.

Do not destroy history when reopening.

---

## 60. Archive vs Delete

Archive is recoverable and hidden from default views.

Delete is permanent and requires explicit confirmation.

Do not conflate them.

---

## 61. Free Product Constraint

Applyo is intended to remain free.

Be cautious with features that create ongoing operational cost.

Do not introduce expensive infrastructure without product justification, including:

```text
large file storage
AI inference
heavy background jobs
paid search infrastructure
```

---

## 62. Storage, Realtime, and Background Work

File upload is not part of the core MVP architecture.

Supabase Realtime is not part of MVP.

Background workers, queues, schedulers, and cron are not required for normal MVP dashboard reminders.

Do not add these systems without a concrete requirement.

---

## 63. Definition of Done — UI Bug

A UI bug is done when:

- root cause is understood;
- targeted fix is applied;
- requested state works;
- relevant interaction states are tested;
- no obvious visual regression exists;
- no relevant console error exists;
- lint/typecheck pass when appropriate.

---

## 64. Definition of Done — Feature

A feature is done when:

- acceptance criteria are met;
- loading/empty/error states exist where needed;
- data persists;
- authorization works;
- responsive behavior is acceptable;
- accessibility basics are covered;
- important logic is tested;
- documentation is updated if behavior changed materially.

---

## 65. Definition of Done — Backend Change

A backend change is done when:

- validation exists;
- authorization exists;
- RLS remains correct;
- transactionality is correct;
- failure behavior is handled;
- migrations are reproducible;
- relevant tests pass.

---

## 66. Completion Report

At task completion, report concisely:

```text
What changed
Files changed
How it was verified
Any remaining issue
```

Do not provide a long diary of every internal action.

---

## 67. When Blocked

If a real blocker prevents completion:

- identify the exact blocker;
- provide evidence;
- stop repeating the same failed approach;
- do not pretend the task is complete.

---

## 68. Final Agent Principle

When uncertain, prefer:

```text
small
clear
reversible
documented
tested
```

over:

```text
large
clever
speculative
unnecessary
```

The goal is not to rewrite Applyo into the agent's preferred architecture.

The goal is to improve Applyo while preserving the product, architecture, and design decisions already made.

---

## 69. Quick Checklist

Before editing:

```text
[ ] Read relevant docs
[ ] Inspect current code
[ ] Check git status
[ ] Confirm task scope
```

During implementation:

```text
[ ] Use existing architecture
[ ] Keep changes minimal
[ ] Preserve unrelated behavior
[ ] Maintain type safety
[ ] Maintain RLS/security
[ ] Follow design system
```

For UI work:

```text
[ ] Verify in visible Chrome with Playwright when useful
[ ] Avoid retry loops
[ ] Check relevant console errors
[ ] Check responsive behavior when relevant
```

Before finishing:

```text
[ ] Test requested behavior
[ ] Run relevant lint/typecheck/test/build
[ ] Review diff
[ ] Ensure no unrelated changes
[ ] Report changed files and verification
```
