# Applyo — Testing Strategy & Pre-Deployment Test Plan

> **Status:** Draft v1.0
> **Product:** Applyo
> **Document Type:** Testing Strategy, QA Plan, and Release Gate
> **Primary References:** `PRD.md`, `ROADMAP.md`, `TASKS.md`, `ARCHITECTURE.md`, `DESIGN-SYSTEM.md`, `AGENTS.md`
> **Primary Testing Mode:** Agentic testing with OpenCode + Playwright
> **Primary Browser:** Chrome (headed / visible)
> **Purpose:** Define how Applyo is tested before deployment and future releases

---

# 1. Purpose

Dokumen ini mendefinisikan bagaimana Applyo harus diuji sebelum deployment.

Dokumen ini berfungsi sebagai:

- test plan;
- QA checklist;
- agent testing instruction;
- regression checklist;
- performance test plan;
- security test plan;
- pre-deployment release gate.

Dokumen ini **bukan** laporan hasil testing.

Hasil testing aktual harus disimpan terpisah, misalnya:

```text
TEST-REPORT.md
```

atau:

```text
reports/
└── pre-deployment-test.md
```

---

# 2. Testing Goals

Testing Applyo bertujuan memastikan bahwa:

1. seluruh core user flow bekerja;
2. data tersimpan dan berubah dengan benar;
3. Kanban drag-and-drop reliable;
4. history tidak kehilangan consistency;
5. user tidak dapat mengakses data user lain;
6. UI tetap usable pada desktop, tablet, dan mobile;
7. tidak ada critical visual regression;
8. performance tetap nyaman pada dataset realistis;
9. production build dapat berjalan;
10. tidak ada Critical atau High severity bug sebelum deployment.

---

# 3. Testing Principles

## 3.1 Audit Before Fix

Testing dan bug fixing harus dipisahkan.

```text
Audit
↓
Report
↓
Prioritize
↓
Fix
↓
Regression
```

Testing agent tidak boleh langsung mengubah source code selama audit kecuali task secara eksplisit meminta perbaikan.

## 3.2 Test User Journeys, Not Only Components

Prioritaskan flow nyata:

```text
Register
↓
Create Application
↓
Move Application
↓
Add Interview
↓
Add Assessment
↓
Receive Offer
↓
Close Application
```

## 3.3 Security Is a Release Blocker

Failure pada authentication, authorization, RLS, atau user isolation selalu dianggap minimal **High** dan dapat menjadi **Critical** jika data user lain dapat dibaca atau dimodifikasi.

## 3.4 Performance Should Be Practical

Target utama:

> Apakah aplikasi tetap nyaman digunakan oleh job seeker dengan puluhan hingga ratusan application records?

## 3.5 Browser Testing Must Have Stop Conditions

Jika action yang sama gagal dua kali:

```text
STOP RETRYING
↓
record failure
↓
inspect root cause
```

---

# 4. Testing Environments

Recommended environments:

```text
Local / Development
Preview
Production-like Local Build
Production
```

## 4.1 Development Environment

Digunakan untuk functional, UI, integration, security, dan performance testing.

Recommended:

```text
Next.js local dev server
+
Development Supabase
```

## 4.2 Production-Like Local Environment

Digunakan untuk final smoke testing:

```text
npm run build
npm run start
```

atau equivalent scripts yang tersedia.

## 4.3 Production Environment

Production tidak digunakan untuk destructive testing.

Hanya lakukan post-deployment smoke test dengan akun test yang aman.

---

# 5. Test Data Safety

Jangan gunakan data job application pribadi untuk automated testing.

Gunakan dedicated test users.

Minimal:

```text
User A
User B
```

User A digunakan untuk normal flows. User B digunakan untuk RLS dan user isolation.

---

# 6. Seed Data

Gunakan predictable seed dataset.

Suggested distribution:

```text
Wishlist        5
Applied        10
Screening       5
Interview       4
Assessment      3
Offer           2

Hired           2
Rejected       10
Withdrawn       3
Ghosted         5
```

Seed data sebaiknya mencakup:

- application tanpa applied date;
- long company name;
- long position;
- long notes;
- long job description;
- application dengan event;
- application tanpa event;
- upcoming interview;
- expired deadline;
- follow-up case;
- reopened application.

---

# 7. Performance Seed Sets

Prepare datasets:

```text
10 applications
50 applications
100 applications
500 applications
```

Optional stress dataset:

```text
1000 applications
```

hanya jika dibutuhkan.

---

# 8. Test Categories

```text
1. Preflight
2. Functional
3. UI / Visual
4. Responsive
5. Accessibility
6. Backend / Integration
7. Security / RLS
8. Performance
9. Regression
10. Production Build
11. Final Smoke Test
```

---

# 9. Test Status

Each test must be recorded as:

```text
PASS
FAIL
BLOCKED
SKIPPED
```

- **PASS** — expected behavior confirmed.
- **FAIL** — actual behavior differs from requirement.
- **BLOCKED** — another issue prevents testing.
- **SKIPPED** — intentionally not executed; reason must be documented.

---

# 10. Severity Levels

## Critical

Release blocker.

Examples:

- application cannot be created;
- auth broken for all users;
- data loss;
- User A can access User B data;
- production build unusable.

## High

Major user flow broken.

Examples:

- Kanban move does not persist;
- application edit corrupts data;
- RLS blocks legitimate user;
- event cannot be saved;
- mobile core flow impossible.

## Medium

Important usability issue with workaround.

Examples:

- popup clipping;
- filter inconsistency;
- datepicker visual regression;
- responsive overflow on secondary page.

## Low

Minor polish.

Examples:

- spacing inconsistency;
- minor copy issue;
- non-blocking animation issue.

---

# 11. Evidence Requirements

For failed tests record:

```text
Test ID
Status
Severity
Environment
Browser / viewport
Expected
Actual
Reproduction steps
Console error
Screenshot if useful
Notes
```

Do not take screenshots for every PASS.

---

# 12. Preflight Testing

## PF-001 — Git Working Tree Review

Run:

```text
git status
```

Goal: understand existing modifications and avoid losing unrelated work.

## PF-002 — Dependency Integrity

Run appropriate install validation:

```text
npm ci
```

or the project-equivalent workflow.

Expected: dependency resolution and lockfile consistency.

## PF-003 — Lint

Run project lint script.

Release gate:

```text
no lint errors
```

## PF-004 — Typecheck

Run project typecheck script.

Expected:

```text
0 TypeScript errors
```

## PF-005 — Unit Tests

Expected all critical logic tests pass.

## PF-006 — Integration / Database Tests

Expected all available integration/database tests pass.

## PF-007 — Production Build

Run:

```text
npm run build
```

Expected:

```text
build succeeds
```

Build failure is **Critical**.

---

# 13. Authentication Tests

## AUTH-001 — Register New User
Expected: account created and expected verification flow occurs.

## AUTH-002 — Duplicate Registration
Expected: clear error and no corrupted duplicate profile.

## AUTH-003 — Invalid Email
Expected: validation/server rejection without crash.

## AUTH-004 — Invalid Password
Expected: clear validation/auth error.

## AUTH-005 — Valid Login
Expected: user reaches workspace.

## AUTH-006 — Invalid Login
Expected: neutral error, no sensitive technical detail.

## AUTH-007 — Protected Routes
Unauthenticated user tries `/dashboard`, `/applications`, `/calendar`, `/analytics`.

Expected: redirected or denied.

## AUTH-008 — Logout
Expected: session cleared and protected routes become inaccessible.

## AUTH-009 — Session Persistence
Expected: authenticated session survives normal reload according to architecture.

---

# 14. Application CRUD Tests

## APP-001 — Create Minimum Application

Input only:

```text
Company
Position
Stage
```

Expected: saves and appears in board/list/detail.

## APP-002 — Create Full Application
Expected all optional values persist accurately.

## APP-003 — Required Validation
Missing required fields must not persist invalid data.

## APP-004 — URL Validation
Valid accepted; invalid handled safely.

## APP-005 — Salary Validation
Test negative values, invalid min/max, and valid ranges.

## APP-006 — Edit Application
Expected changed data appears across relevant UI.

## APP-007 — Archive
Expected hidden from default active views and recoverable.

## APP-008 — Restore Archive
Expected restored correctly.

## APP-009 — Delete
Expected confirmation, permanent removal, and no orphan UI state.

---

# 15. Application Detail Tests

## DETAIL-001 — Existing Application
Expected correct metadata and stage.

## DETAIL-002 — Invalid ID
Expected not found/inaccessible without stack trace.

## DETAIL-003 — Long Job Description
Expected readable without broken layout.

## DETAIL-004 — Long Notes
Expected readable and editable.

---

# 16. Kanban Functional Tests

## KAN-001 — Board Load
Expected correct stages, counts, and cards.

## KAN-002 — Same-Column Reorder
Expected position persists after reload and no stage history is created.

## KAN-003 — Cross-Column Move
Example: `Applied → Screening`.

Expected:
- card moves;
- stage persists;
- ordering persists;
- stage history created.

## KAN-004 — Multi-Stage Journey

```text
Wishlist
→ Applied
→ Screening
→ Interview
→ Assessment
→ Offer
```

Expected all transitions persist and history sequence is correct.

## KAN-005 — Rapid Drag Protection
Expected no duplicate/lost card and canonical final state.

## KAN-006 — Failed Mutation Rollback
Expected optimistic state rolls back and user receives error feedback.

## KAN-007 — Reload Persistence
Expected stage and card position remain correct.

## KAN-008 — Non-Drag Stage Change
Expected accessible stage action uses the same canonical backend behavior.

---

# 17. Contextual Stage Tests

## CTX-001 — Wishlist → Applied
Move succeeds; applied date prompt may appear; skipping does not undo move.

## CTX-002 — Move to Interview
Move succeeds; interview form optional.

## CTX-003 — Move to Assessment
Move succeeds; assessment form optional.

## CTX-004 — Move to Offer
Move persists; offer details remain optional.

---

# 18. Recruitment Event Tests

## EVENT-001 — Create Interview
Expected visible in detail, calendar, and upcoming dashboard where relevant.

## EVENT-002 — Multiple Interviews
Expected HR, Technical, and Final interviews can coexist.

## EVENT-003 — Create Assessment
Expected deadline persists and appears in calendar.

## EVENT-004 — Edit Event
Expected all relevant views update.

## EVENT-005 — Complete Event
Expected completion state and upcoming lists update.

## EVENT-006 — Delete Event
Expected no stale calendar/detail item.

---

# 19. Follow-Up Tests

## FOLLOW-001 — Waiting Duration
Expected sensible non-negative value.

## FOLLOW-002 — Follow-Up Suggestion
Expected only when criteria are met.

## FOLLOW-003 — Follow-Up Sent
Expected event/history recorded and last activity recalculated.

## FOLLOW-004 — No Auto Ghosting
Expected system never automatically marks an application Ghosted.

---

# 20. Closed Outcome Tests

## OUT-001 — Hired
Expected closed, removed from active board, available in closed view, timeline updated.

## OUT-002 — Rejected
Expected neutral UX and optional metadata persistence.

## OUT-003 — Withdrawn
Expected optional reason persistence.

## OUT-004 — Ghosted
Expected explicit user action required.

## OUT-005 — Reopen
Expected active stage restored, closure removed, history preserved.

---

# 21. Offer Tests

## OFFER-001 — Create Offer Details
Test salary, benefits, start date, and deadline.

## OFFER-002 — Edit Offer
Expected updates persist.

## OFFER-003 — Offer Deadline
Expected shown in dashboard/calendar when relevant.

---

# 22. Dashboard Tests

## DASH-001 — Summary Counts
Expected values match database truth.

## DASH-002 — Upcoming Events
Expected chronological order.

## DASH-003 — Needs Attention
Test upcoming interview, assessment deadline, offer deadline, and inactivity.

## DASH-004 — Empty Dashboard
Expected useful empty state and no broken metrics.

---

# 23. Search & Filter Tests

## SEARCH-001 — Company
## SEARCH-002 — Position
## SEARCH-003 — Case Insensitivity
## SEARCH-004 — No Results

## FILTER-001 — Stage
## FILTER-002 — Outcome
## FILTER-003 — Source
## FILTER-004 — Date Range
## FILTER-005 — Combined Filters
## FILTER-006 — Clear Filters

Expected search/filter results always match the selected criteria.

---

# 24. List View Tests

## LIST-001 — Data Accuracy
Verify company, position, stage, applied date, source, and upcoming event.

## LIST-002 — Sorting
Verify available sort options.

## LIST-003 — Large Dataset
Expected usability with 100+ records and pagination strategy if implemented.

---

# 25. Calendar Tests

## CAL-001 — Visible Date Range
Expected correct event loading.

## CAL-002 — Next / Previous
Expected data refresh.

## CAL-003 — Event Click
Expected related application/event opens.

## CAL-004 — Interview Timezone
Expected correct local time.

## CAL-005 — Deadline Display
Expected correct date/time.

---

# 26. Analytics Tests

## ANA-001 — Total Applications
Compare against known fixture.

## ANA-002 — Interview Count
Must follow metric definition and history, not only current stage.

## ANA-003 — Offer Count
Same principle.

## ANA-004 — Hired Count
Expected accurate.

## ANA-005 — Conversion Funnel

Known fixture:

```text
Applied 100
Interview 20
Offer 5
Hired 2
```

Expected:

```text
Applied → Interview = 20%
Interview → Offer = 25%
Offer → Hired = 40%
```

## ANA-006 — Zero Denominator
Expected no `NaN` or `Infinity`.

## ANA-007 — Trend Chart
Expected grouped dates are correct.

---

# 27. Settings Tests

## SET-001 — Currency
Expected formatting updates.

## SET-002 — Date Format
Expected consistent display.

## SET-003 — Timezone
Expected scheduled timestamps render correctly.

---

# 28. Account Lifecycle Tests

## ACC-001 — Delete Account
Expected domain data removed according to architecture and session invalidated.

## ACC-002 — No Orphan Data
Verify related rows are cleaned.

---

# 29. UI / Visual Testing

Use Playwright MCP + **Chrome headed**.

Primary visual source of truth:

```text
DESIGN-SYSTEM.md
```

Minimum viewports:

```text
Desktop  1440x900
Laptop   1280x800
Tablet   768x1024
Mobile   390x844
```

Check:

- overflow;
- clipping;
- overlapping;
- layout shift;
- text wrapping;
- hard shadow consistency;
- borders;
- stage colors;
- spacing;
- typography;
- hierarchy.

---

# 30. Datepicker Tests

## UI-DATE-001 — Theme
Expected Applyo styling in default state.

## UI-DATE-002 — Active State
Expected styling remains themed after focus/open.

## UI-DATE-003 — Selected State
Expected selected date styling is consistent.

## UI-DATE-004 — Popup Overflow
Expected popup not clipped by card/container.

## UI-DATE-005 — Bottom Collision
Expected popup remains visible or flips if supported.

## UI-DATE-006 — Right Collision
Expected no viewport clipping.

---

# 31. Overlay Tests

Popover, dropdown, and dialog should be checked for:

- Portal behavior;
- z-index;
- clipping;
- outside click;
- focus management;
- viewport collision;
- mobile sizing.

---

# 32. Kanban Visual Tests

Check:

- card readability;
- stage headers;
- horizontal overflow;
- drag overlay;
- drop target;
- long company/position names;
- no clipping.

---

# 33. Responsive Tests

## RESP-001 — Desktop Sidebar
## RESP-002 — Mobile Navigation
## RESP-003 — Create Application Mobile
## RESP-004 — Application Detail Mobile
## RESP-005 — Kanban Mobile + Stage Fallback
## RESP-006 — Calendar Mobile
## RESP-007 — Analytics Mobile

Expected no critical horizontal overflow and all core actions remain usable.

---

# 34. Accessibility Tests

Target:

```text
WCAG 2.2 AA where reasonably applicable
```

## A11Y-001 — Keyboard Navigation
## A11Y-002 — Visible Focus
## A11Y-003 — Form Labels
## A11Y-004 — Drag Alternative
## A11Y-005 — Color Not Sole Indicator
## A11Y-006 — Reduced Motion
## A11Y-007 — Dialog Focus

Any core action inaccessible without a pointer should be treated seriously.

---

# 35. Backend / Database Tests

## DB-001 — Constraints
Test required fields, foreign keys, salary constraints, and invalid stages.

## DB-002 — Cascade Delete
Verify application child records behave as architecture defines.

## DB-003 — Stage Ownership Integrity
Application must not reference another user's stage.

## DB-004 — Append-Only History
Existing history must not silently mutate.

---

# 36. RLS / Security Tests

Use User A and User B.

## SEC-001 — Read Other User Application
Expected denied/not found.

## SEC-002 — Update Other User Application
Expected denied.

## SEC-003 — Delete Other User Application
Expected denied.

## SEC-004 — Move Other User Card
Expected denied.

## SEC-005 — Read Other User History
Expected denied.

## SEC-006 — Read Other User Events
Expected denied.

## SEC-007 — Read Other User Offer
Expected denied.

## SEC-008 — Read Other User Preferences
Expected denied.

## SEC-009 — Unauthenticated Direct Access
Expected denied.

## SEC-010 — Tampered IDs
Try application/stage/event IDs belonging to another user. Expected denied.

## SEC-011 — Service Role Exposure
Expected no service-role credential in client bundle or browser-accessible config.

## SEC-012 — External URL Safety
Unsupported/dangerous protocols must not render dangerously.

---

# 37. Error Handling Tests

## ERR-001 — Failed Create
Expected form input retained and no fake success.

## ERR-002 — Failed Edit
Expected state not silently lost.

## ERR-003 — Failed Kanban Move
Expected rollback.

## ERR-004 — Network Failure
Expected clear user feedback.

## ERR-005 — Not Found
Expected safe branded page.

---

# 38. Console / Network Review

During browser testing inspect meaningful:

```text
console.error
unhandled promise rejection
React hydration errors
failed API/database requests
```

Do not automatically treat every harmless warning as release blocking.

---

# 39. Performance Testing Strategy

Run performance testing after core functionality is stable.

Observe:

- page load;
- interaction latency;
- query latency;
- client rendering;
- network payload;
- layout shift;
- browser responsiveness.

---

# 40. Performance Cases

## PERF-001 — Landing
Check large assets and layout shift.

## PERF-002 — Dashboard with 100 Applications
Expected usable.

## PERF-003 — Kanban with 10 Applications
Baseline.

## PERF-004 — Kanban with 50 Applications
Expected smooth.

## PERF-005 — Kanban with 100 Applications
Expected comfortable.

## PERF-006 — Kanban with 500 Applications
Observe board load, drag responsiveness, memory, and query behavior.

## PERF-007 — Search with 500 Applications
Expected reasonable response.

## PERF-008 — Filter with 500 Applications
Expected reasonable response.

## PERF-009 — Analytics with 500 Applications
Expected no excessive wait.

## PERF-010 — Large Application Detail
Use long description + many events/history.

---

# 41. Lighthouse / Web Performance Audit

If Lighthouse is available, run on:

```text
Landing
Dashboard
Applications
Application Detail
```

Use score as guidance, not as a requirement to reach 100.

Prioritize:

- severe performance bottlenecks;
- Core Web Vitals regressions;
- oversized assets/bundles;
- long UI freezes.

---

# 42. Performance Release Expectations

Minimum practical expectations:

- no multi-second UI freeze for normal dataset;
- Kanban drag feels responsive;
- no obvious N+1 request storm;
- page navigation feels reasonable;
- no accidental major client-bundle regression.

500-record results may be advisory if outside normal active-board expectations, but must be documented.

---

# 43. Regression Tests

After Critical/High fixes, rerun:

## REG-A

```text
Login
↓
Create Application
↓
Move Applied → Screening
↓
Reload
↓
Verify Stage
↓
Verify History
```

## REG-B

```text
Move to Interview
↓
Add Interview
↓
View Detail
↓
View Calendar
↓
Complete Event
```

## REG-C

```text
Interview
↓
Assessment
↓
Offer
↓
Hired
```

## REG-D

```text
Create Application
↓
Rejected
↓
Closed View
```

## REG-E

```text
Ghosted
↓
Reopen
↓
Active Board
```

## REG-F

```text
User A creates Application
↓
User B attempts direct access
↓
DENIED
```

---

# 44. Production Build Test

After regression:

```text
npm run build
```

Then run the production server script, for example:

```text
npm run start
```

Use actual scripts from `package.json`.

---

# 45. Production-Like Smoke Test

Run against the local production build:

```text
Login
Create Application
Move Card
Open Detail
Create Event
Logout
```

Expected behavior should match development.

---

# 46. OpenCode Testing Workflow

Recommended sequence:

```text
Session 1
Preflight Audit

Session 2
Functional Audit

Session 3
UI + Responsive Audit

Session 4
Security / RLS Audit

Session 5
Performance Audit

↓
TEST-REPORT.md

↓
Fix Critical

↓
Regression

↓
Fix High

↓
Regression

↓
Medium / Low Triage

↓
Production Build

↓
Final Smoke
```

---

# 47. Audit-Only Agent Rule

During audit:

```text
DO NOT MODIFY APPLICATION SOURCE CODE
```

Allowed:

- run the app;
- run tests;
- browser interactions;
- use development/test fixtures;
- create/update `TEST-REPORT.md`.

---

# 48. Bug-Fix Agent Rule

When fixing:

```text
one issue / related group
↓
reproduce
↓
root cause
↓
minimal fix
↓
targeted verification
↓
regression
```

Do not rewrite unrelated areas.

---

# 49. Playwright Browser Rules

Expected:

```text
Chrome
headed
visible
one browser session
```

Strict anti-stuck rules:

1. Do not retry the same action more than twice.
2. Do not repeatedly reload without cause.
3. Do not snapshot repeatedly as polling.
4. Do not create screenshot loops.
5. Do not spawn duplicate browsers.
6. Do not spawn duplicate dev servers.
7. Stop once acceptance criteria are verified.
8. If browser becomes unresponsive, record BLOCKED and diagnose instead of looping.

---

# 50. Browser Evidence

For visual issue:

```text
screenshot recommended
```

For functional issue:

```text
reproduction steps
+
console/network evidence when useful
```

---

# 51. TEST-REPORT.md Format

Recommended template:

```markdown
# Applyo Pre-Deployment Test Report

## Summary

Environment:
Commit:
Date:
Tester:
Browser:

Passed:
Failed:
Blocked:
Skipped:

Critical:
High:
Medium:
Low:

## Release Decision

READY / NOT READY

## Failed Tests

### KAN-003 — Cross-Column Move

Status: FAIL
Severity: High

Expected:
...

Actual:
...

Steps:
1.
2.
3.

Evidence:
...

## Passed Areas

- Auth
- Application CRUD
- ...

## Security Notes

...

## Performance Notes

...

## Remaining Blockers

...
```

---

# 52. Release Gate

Applyo may be considered ready for deployment only if:

```text
Critical Bugs = 0
High Bugs     = 0
```

---

# 53. Required Preflight Gate

```text
[ ] Lint PASS
[ ] Typecheck PASS
[ ] Critical tests PASS
[ ] Production build PASS
```

---

# 54. Required Functional Gate

```text
[ ] Authentication PASS
[ ] Application CRUD PASS
[ ] Application Detail PASS
[ ] Kanban PASS
[ ] Card Ordering PASS
[ ] Stage Persistence PASS
[ ] History PASS
[ ] Recruitment Events PASS
[ ] Follow-Up PASS
[ ] Offers PASS
[ ] Closed Outcomes PASS
[ ] Reopen PASS
[ ] Dashboard PASS
[ ] Search PASS
[ ] Filters PASS
[ ] Calendar PASS
[ ] Analytics PASS
[ ] Settings PASS
```

A feature may be marked N/A only if explicitly excluded from the current release scope.

---

# 55. Required Security Gate

```text
[ ] RLS PASS
[ ] User Isolation PASS
[ ] Direct Object Access PASS
[ ] Unauthorized Route Access PASS
[ ] Service Role Exposure PASS
```

Any failure here blocks deployment.

---

# 56. Required UI Gate

```text
[ ] Desktop PASS
[ ] Laptop PASS
[ ] Tablet PASS
[ ] Mobile PASS
[ ] Datepicker PASS
[ ] Popover PASS
[ ] Dialog PASS
[ ] Kanban Layout PASS
[ ] No Critical Clipping PASS
```

---

# 57. Required Accessibility Gate

```text
[ ] Core keyboard navigation PASS
[ ] Visible focus PASS
[ ] Drag alternative PASS
[ ] Labels PASS
[ ] Reduced motion PASS
[ ] No color-only critical meaning PASS
```

---

# 58. Required Performance Gate

```text
[ ] Normal dataset performance acceptable
[ ] 100-application board acceptable
[ ] No obvious N+1 request storm
[ ] No severe UI freeze
[ ] No obvious accidental major bundle regression
```

---

# 59. Final Smoke Gate

```text
[ ] Production build starts
[ ] Login works
[ ] Create Application works
[ ] Kanban move works
[ ] Application Detail works
[ ] Event creation works
[ ] Logout works
```

---

# 60. Deployment Decision

Final result must be one of:

```text
READY FOR DEPLOYMENT
```

or:

```text
NOT READY FOR DEPLOYMENT
```

If not ready, list release blockers first.

---

# 61. Mandatory Blockers

Always block deployment:

- Critical bug;
- High security bug;
- data isolation failure;
- data corruption;
- broken production build;
- broken authentication core flow;
- broken create application;
- broken Kanban persistence;
- destructive mutation affecting another user.

---

# 62. Known Non-Blockers

Do not automatically block deployment for:

- minor spacing issue;
- small copy inconsistency;
- low-severity animation polish;
- non-perfect Lighthouse score;
- post-MVP feature absence;
- cosmetic issue with clear workaround.

Record them in the report.

---

# 63. Post-Deployment Smoke Test

After deployment perform a small safe test:

```text
Landing
Login
Dashboard
Create disposable test Application
Move once
Open detail
Delete disposable test Application
Logout
```

Use a dedicated production test account if possible.

Do not run broad destructive automation against production.

---

# 64. Continuous Testing Strategy

## Small Change

Run:

```text
lint
typecheck
targeted tests
```

## Feature Change

Run:

```text
targeted functional tests
+
relevant E2E
+
regression of affected flow
```

## Before Production Release

Run:

```text
Preflight
Critical functional flows
Security-sensitive tests if auth/data changed
Production build
Final smoke
```

---

# 65. Testing Definition of Done

Testing cycle is complete when:

1. planned tests executed;
2. blocked/skipped tests documented;
3. Critical = 0;
4. High = 0;
5. security gate passes;
6. production build passes;
7. regression passes;
8. production-like smoke passes;
9. `TEST-REPORT.md` contains final decision.

---

# 66. OpenCode Audit Prompt Template

```text
Read:
- AGENTS.md
- TESTING.md
- PRD.md
- ARCHITECTURE.md
- DESIGN-SYSTEM.md

Perform the requested testing phase for Applyo.

This is AUDIT ONLY.

Do not modify application source code.

Follow TESTING.md exactly.

For each test record:
- PASS
- FAIL
- BLOCKED
- SKIPPED

For failures record:
- test ID
- severity
- expected behavior
- actual behavior
- reproduction steps
- browser/viewport where relevant
- console/network evidence where relevant
- screenshot only when useful

Browser rules:
- use Chrome headed
- keep one browser session
- do not retry the same action more than twice
- do not enter screenshot/snapshot loops
- stop testing a case once its acceptance criteria are verified
- if blocked, record it and continue where possible

Update TEST-REPORT.md with the results.

Do not fix issues during this audit.
```

---

# 67. OpenCode Fix Prompt Template

```text
Read:
- AGENTS.md
- TESTING.md
- TEST-REPORT.md

Fix only the specified issue(s).

For each issue:
1. reproduce it when possible;
2. identify the root cause;
3. apply the smallest safe fix;
4. preserve unrelated behavior;
5. verify the original failure;
6. run targeted regression tests;
7. run relevant lint/typecheck/tests.

Do not fix unrelated Medium/Low issues unless explicitly requested.

Update the relevant issue in TEST-REPORT.md with:
- fix status
- files changed
- verification performed
- regression result
```

---

# 68. Final Principle

Testing should answer one question:

> **Can a real job seeker safely and comfortably use Applyo for their real job applications without losing data, seeing incorrect state, or accessing another user's data?**

If the answer is not confidently yes, Applyo is not ready for deployment.
