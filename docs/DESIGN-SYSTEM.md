# Applyo — Design System

> **Status:** Draft v1.0  
> **Product:** Applyo  
> **Document Type:** UI/UX Design System Specification  
> **Primary References:** `PRD.md`, `ROADMAP.md`, `TASKS.md`, `ARCHITECTURE.md`  
> **Visual Direction:** Playful Neobrutalism + Cartoon Personality  
> **Core Product Emotion:** Friendly, optimistic, tactile, organized

---

# 1. Purpose

Dokumen ini mendefinisikan bagaimana Applyo harus terlihat, terasa, dan berperilaku.

Design system ini menjadi acuan untuk:

- brand expression;
- visual language;
- colors;
- typography;
- spacing;
- radius;
- border;
- hard shadows;
- iconography;
- components;
- interactions;
- motion;
- Kanban behavior;
- responsive UI;
- empty states;
- microcopy;
- accessibility;
- emotional UX.

Tujuan utamanya adalah memastikan Applyo tetap:

```text
fun
+
colorful
+
memorable
+
usable
+
calm enough for repeated daily use
```

---

# 2. Product Design Philosophy

Applyo dibangun untuk job seeker.

Job seeking sendiri sering terasa:

- repetitif;
- melelahkan;
- penuh ketidakpastian;
- administratif;
- emotionally draining.

Karena itu Applyo tidak boleh terasa seperti:

```text
Spreadsheet
Admin dashboard
Enterprise CRM
Corporate HR software
```

Sebaliknya, Applyo harus terasa seperti:

> **A friendly workspace that makes job hunting easier to manage.**

---

# 3. Core Design Principles

## 3.1 Playful

UI boleh terasa menyenangkan.

Gunakan:

- warna terang;
- rounded-but-chunky shapes;
- hard shadows;
- subtle bounce;
- expressive labels;
- playful empty states.

Tetapi jangan sampai childish.

---

## 3.2 Tactile

Komponen harus terasa seperti objek nyata.

Contoh:

```text
Button
→ can be pressed

Card
→ can be lifted

Kanban card
→ can be dragged

Dialog
→ pops into place
```

---

## 3.3 Optimistic

Visual language harus memberi energi ringan.

Bukan:

> Kamu gagal.

Tetapi:

> Lamaran dipindahkan ke Ditolak.

Bukan:

> Kamu belum cukup banyak melamar.

Tetapi:

> Belum ada yang baru di sini.

---

## 3.4 Organized

Fun tidak berarti chaotic.

Board dengan banyak application harus tetap:

- mudah dibaca;
- punya whitespace;
- punya hierarchy;
- tidak terlalu banyak warna pada satu card;
- tidak terlalu banyak shadow.

---

## 3.5 Accessible

Color, motion, dan playful visuals tidak boleh menghambat accessibility.

---

# 4. Brand Positioning

Applyo adalah:

> **Pelacak lamaran kerja yang menyenangkan untuk mengelola seluruh proses pencarian kerjamu di satu tempat.**

Brand attributes:

```text
Friendly
Helpful
Playful
Optimistic
Clear
Human
Modern
Tactile
```

Avoid attributes:

```text
Corporate
Cold
Overly serious
Childish
Gamified
Aggressive
Productivity-obsessed
```

---

# 5. Brand Personality

Jika Applyo adalah seseorang:

```text
supportive friend
+
organized coworker
+
playful designer
```

Bukan:

```text
motivational coach
salesperson
HR manager
productivity guru
```

---

# 6. Tone of Voice

## Bahasa Antarmuka

Bahasa utama antarmuka Applyo adalah **Bahasa Indonesia**.

Semua teks yang terlihat atau dibacakan kepada pengguna harus menggunakan Bahasa Indonesia, termasuk:

- navigasi dan judul halaman;
- tombol, label formulir, helper text, dan validasi;
- nama tahap yang ditampilkan;
- empty, loading, error, dan success state;
- toast, dialog, tooltip, dan label aksesibilitas;
- metadata landing page.

Istilah Inggris hanya boleh digunakan untuk nama merek, jabatan dengan nama resmi berbahasa Inggris, atau identifier internal yang tidak ditampilkan kepada pengguna. System key seperti `interview` tetap berbahasa Inggris dan dipisahkan dari display label `Wawancara`.

Tone:

```text
friendly
short
clear
calm
lightly playful
```

Avoid:

```text
overly enthusiastic
fake positivity
corporate jargon
guilt language
```

---

# 7. Brand Name

Primary wordmark:

```text
Applyo
```

Preferred casing:

```text
Applyo
```

Avoid:

```text
APPLYO
applyo
ApplyO
```

unless used intentionally in logo artwork.

---

# 8. Tagline

Primary:

> **Kariermu terus maju.**

Alternative supporting copy:

> Pantau setiap lamaran di satu tempat.

> Jalani prosesnya, selangkah demi selangkah.

> Pencarian kerjamu, tanpa keruwetan spreadsheet.

---

# 9. Visual Style

Primary visual direction:

> **Playful Neobrutalism**

Characteristics:

```text
thick black border
flat color
hard black shadow
minimal blur
high contrast
chunky shapes
bold typography
sticker-like UI
cartoon personality
```

---

# 10. What Applyo Should Not Look Like

Avoid:

```text
glassmorphism
frosted cards
subtle gray SaaS cards
soft diffuse shadow everywhere
blue corporate dashboards
gradient-heavy UI
hyper-minimal white UI
gaming interface
excessive 3D
```

---

# 11. Background

Primary application background:

```css
--background: #FFFDF5;
```

This is a warm cream rather than pure white.

Reason:

- softer for long sessions;
- less sterile;
- matches playful cartoon style;
- provides contrast against white cards.

---

# 12. Core Color Palette

## Base

| Token | Name | Hex | Usage |
|---|---|---:|---|
| `--color-background` | Warm Cream | `#FFFDF5` | Main app background |
| `--color-surface` | Paper White | `#FFFFFF` | Cards, panels |
| `--color-ink` | Ink Black | `#151515` | Text, border, shadow |
| `--color-muted` | Soft Cream | `#F3EEDF` | Secondary surfaces |
| `--color-muted-text` | Warm Gray | `#68635B` | Secondary copy |

---

# 13. Accent Palette

| Token | Name | Hex |
|---|---|---:|
| `--color-yellow` | Sunny Yellow | `#FFD84D` |
| `--color-blue` | Sky Blue | `#74C7FF` |
| `--color-pink` | Bubblegum Pink | `#FF8CCB` |
| `--color-purple` | Grape Purple | `#B49CFF` |
| `--color-green` | Mint Green | `#72E6A6` |
| `--color-orange` | Tangerine | `#FFAA5B` |
| `--color-red` | Coral Red | `#FF6B6B` |
| `--color-gray` | Cloud Gray | `#D8D5CF` |

---

# 14. Semantic Colors

Use semantic colors carefully.

```css
--color-success: #72E6A6;
--color-warning: #FFD84D;
--color-error: #FF6B6B;
--color-info: #74C7FF;
```

Do not rely on color only.

Always pair with:

- icon;
- label;
- text;
- shape.

---

# 15. Stage Colors

Recommended stage mapping:

| Stage | Color |
|---|---|
| Incaran | Purple |
| Dilamar | Blue |
| Seleksi Awal | Yellow |
| Wawancara | Pink |
| Asesmen | Orange |
| Tawaran | Green |
| Diterima | Green |
| Ditolak | Red |
| Ditarik | Gray |
| Tanpa Kabar | Muted Gray / Charcoal |

Stage colors should primarily appear as:

```text
column header
badge
small accent strip
icon background
```

Avoid painting every card entirely in stage color.

---

# 16. Color Distribution Rule

Recommended balance:

```text
60% neutral cream / white
25% black / typography / outlines
15% accent colors
```

This keeps the app colorful without visual exhaustion.

---

# 17. Surface Hierarchy

## Surface Level 0

Background.

```text
Warm Cream
```

## Surface Level 1

Standard cards.

```text
White
+
2px black border
+
4px hard shadow
```

## Surface Level 2

Important panels.

```text
Accent / White
+
2–3px border
+
6px shadow
```

## Surface Level 3

Modal / spotlight.

```text
White
+
3px border
+
8px shadow
```

---

# 18. Border System

Primary border color:

```css
#151515
```

Tokens:

```css
--border-thin: 1px;
--border-default: 2px;
--border-strong: 3px;
```

Use:

```text
1px
→ rare subtle separators

2px
→ standard controls/cards

3px
→ hero elements/dialogs
```

Avoid generic:

```text
#E5E7EB 1px border
```

on primary components.

---

# 19. Hard Shadow System

Shadows must be:

```text
solid
black
zero blur
```

Tokens:

```css
--shadow-xs: 2px 2px 0 #151515;
--shadow-sm: 3px 3px 0 #151515;
--shadow-md: 4px 4px 0 #151515;
--shadow-lg: 6px 6px 0 #151515;
--shadow-xl: 8px 8px 0 #151515;
```

---

# 20. Shadow Usage

## No Shadow

Use for:

- small badges;
- subtle inputs at rest;
- dividers;
- compact controls.

## XS / SM

Use for:

- chips;
- tabs;
- small buttons.

## MD

Use for:

- cards;
- standard buttons.

## LG

Use for:

- lifted cards;
- highlighted panels;
- dropdowns.

## XL

Use sparingly:

- dialogs;
- hero visual;
- major celebration card.

---

# 21. Shadow Interaction

Button:

```text
rest
4px 4px

hover
6px 6px
transform(-2px, -2px)

pressed
0px 0px
transform(4px, 4px)
```

This creates tactile physical feedback.

---

# 22. Border Radius

Applyo is not strict brutalism.

Use friendlier radius:

```css
--radius-xs: 4px;
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 14px;
--radius-xl: 18px;
--radius-pill: 999px;
```

Recommended:

```text
buttons       8–10px
inputs        8–10px
cards         12–14px
dialogs       14–18px
chips         pill
```

---

# 23. Spacing System

Use 4px base grid.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

---

# 24. Layout Density

Default density:

> Comfortable, not compact.

Board cards must remain compact enough for multiple applications.

Application detail can use more whitespace.

---

# 25. Typography

## Display Font

Recommended:

```text
Bricolage Grotesque
```

Use for:

- landing hero;
- major headings;
- empty states;
- milestone messages.

---

## UI / Body Font

Recommended:

```text
Geist
```

Fallback:

```text
Inter
system-ui
sans-serif
```

Use for:

- forms;
- cards;
- dates;
- tables;
- settings;
- analytics.

---

# 26. Typography Scale

```text
Display XL   48 / 52   700
Display L    40 / 44   700
H1           32 / 38   700
H2           26 / 32   700
H3           22 / 28   700
H4           18 / 24   700

Body L       16 / 26   500
Body         14 / 22   400
Body Strong  14 / 22   600
Small        12 / 18   500
Tiny         11 / 16   600

Button       14 / 20   700
Label        13 / 18   600
```

---

# 27. Typography Rules

Do:

- keep card titles concise;
- use bold for company/position;
- use tabular figures where useful;
- avoid too many weights.

Avoid:

- body text in display font;
- uppercase long sentences;
- thin font weights;
- tiny gray text.

---

# 28. Heading Style

Major page heading:

```text
Lamaran Saya
```

Use:

```text
Bricolage Grotesque
700
```

Optional decorative accent:

```text
small colored underline
sticker-like highlight
```

Do not add decoration to every heading.

---

# 29. Iconography

Primary icon library:

```text
Lucide Icons
```

Recommended:

```text
stroke-width: 2.25–2.5
```

Keep icon language consistent.

---

# 30. Icon Sizes

```text
XS   14px
SM   16px
MD   20px
LG   24px
XL   32px
```

---

# 31. Icon + Text Rule

For important state/action:

```text
icon + label
```

Do not depend on ambiguous icon-only actions unless familiar and tooltip-supported.

---

# 32. Logo Direction

Recommended logo behavior:

```text
Applyo
```

with:

- bold rounded-ish typography;
- black outline or strong black fill;
- optional colored accent on `o`;
- optional card/sticker motif.

Potential brand symbol:

```text
stacked application card
```

or:

```text
rounded "A" with card movement motif
```

---

# 33. Illustration Style

Illustrations should look:

```text
flat
simple
cartoon
thick outline
slightly imperfect
sticker-like
```

Use limited shapes.

Avoid:

```text
realistic 3D
complex gradients
stock illustration
corporate vector people
```

---

# 34. Mascot Direction

Mascot is optional, not required for core navigation.

Potential concept:

> **Appy** — a small application-card / résumé character.

Use mascot in:

- onboarding;
- empty states;
- 404;
- first application;
- first interview;
- hired milestone.

Avoid mascot:

- inside every application card;
- in error messages;
- during rejection flow;
- repeated in dense dashboards.

---

# 35. Mascot Personality

Appy should feel:

```text
quietly supportive
curious
organized
playful
```

Not:

```text
overexcited
hyperactive
motivational
baby-like
```

---

# 36. Motion Principles

Motion must have a reason.

Good motion communicates:

```text
pressed
moved
opened
closed
saved
completed
```

Decorative motion should be rare.

---

# 37. Motion Tokens

```css
--motion-fast: 120ms;
--motion-normal: 200ms;
--motion-slow: 320ms;
--motion-celebration: 600ms;
```

---

# 38. Motion Easing

Recommended:

```text
standard transition → ease-out
closing transition  → ease-in
physical movement   → spring
```

---

# 39. Motion Categories

## Fast

Use for:

```text
button hover
checkbox
small toggle
badge
```

## Normal

Use for:

```text
popover
dropdown
card lift
tab change
```

## Slow

Use for:

```text
dialog
drawer
page-level panel
```

---

# 40. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Disable:

- bounce;
- rotation;
- exaggerated scale;
- confetti;
- decorative motion.

Keep simple:

```text
opacity
instant state change
```

---

# 41. Button Component

Default structure:

```text
[ Icon ] Label
```

Primary:

```text
yellow background
black border
black text
4px shadow
```

---

# 42. Button Variants

## Primary

Use:

```text
Tambah Lamaran
Simpan
Konfirmasi
```

Style:

```text
Yellow
Black border
Black shadow
```

---

## Secondary

Use:

```text
Kembali
Batal
Lihat detail
```

Style:

```text
White
Black border
Small shadow
```

---

## Accent

Optional for special contexts.

Example:

```text
Wawancara
```

may use Pink.

Do not use stage colors for random unrelated actions.

---

## Destructive

Use:

```text
Hapus
```

Style:

```text
Red / coral
Black border
```

Avoid aggressive visual size.

---

## Ghost

Use for tertiary actions:

```text
Lewati
Tutup
Lainnya
```

No shadow by default.

---

# 43. Button Size

```text
SM  height 32
MD  height 40
LG  height 48
```

Primary app CTA:

```text
MD
```

Landing hero CTA:

```text
LG
```

---

# 44. Button Press Interaction

Rest:

```text
translate(0,0)
shadow 4px 4px
```

Hover:

```text
translate(-1px,-1px)
shadow 5px 5px
```

Pressed:

```text
translate(3px,3px)
shadow 1px 1px
```

---

# 45. Input Component

Default:

```text
white background
2px black border
10px radius
```

At rest:

```text
shadow none or 2px
```

Focus:

```text
3px hard shadow
slight warm/yellow tint optional
```

---

# 46. Input Error State

Use:

```text
red border
warning icon
clear error copy
```

Example:

> Perusahaan wajib diisi.

Do not use only red color without text.

---

# 47. Form Layout

Use vertical forms by default.

Preferred:

```text
Label
Input
Help/Error
```

Do not rely on placeholder as label.

---

# 48. Form Grouping

Create Application should be progressive.

Primary visible group:

```text
Company
Position
Stage
```

Secondary group:

```text
Job URL
Location
Source
Applied Date
```

Advanced:

```text
Salary
Job Description
Notes
```

---

# 49. Card Component

Base card:

```text
white surface
2px black border
12–14px radius
4px hard shadow
```

Padding:

```text
16px
```

---

# 50. Card Hierarchy

Cards should not all have equal emphasis.

Use:

```text
standard card
highlight card
compact card
flat card
```

---

# 51. Application Card

Application Card is the most important recurring component.

Recommended anatomy:

```text
┌──────────────────────────────┐
│ Company                 ⋯    │
│ Position                     │
│                              │
│ [Stage]                      │
│                              │
│ Applied 5 days ago           │
│ Next: HR Interview · Tue     │
└──────────────────────────────┘▓▓▓
```

---

# 52. Application Card Information Priority

Primary:

```text
Company
Position
```

Secondary:

```text
Stage
Waiting
Upcoming event
```

Tertiary:

```text
Source
Location
```

Do not put:

```text
full job description
salary detail
long notes
```

inside Kanban card.

---

# 53. Card Color Rule

Card body remains mostly:

```text
white
```

Stage color appears as:

- top stripe;
- badge;
- dot;
- mini label;
- icon background.

This avoids rainbow overload.

---

# 54. Card Hover

Desktop hover:

```text
translate(-1px,-1px)
shadow +1px
```

Keep subtle.

---

# 55. Card Selected State

Use:

```text
3px border
accent ring
```

not only a color wash.

---

# 56. Kanban Board

Board is Applyo's hero interaction.

Structure:

```text
Board
├── Stage Column
│   ├── Header
│   ├── Card
│   ├── Card
│   └── Drop zone
```

---

# 57. Kanban Column Width

Recommended desktop width:

```text
280–320px
```

Do not stretch columns to huge widths.

---

# 58. Kanban Column Header

Header should show:

```text
Stage Name
Count
Color
```

Example:

```text
[ Pink ] Interview    3
```

Header may use stage color background.

---

# 59. Kanban Column Surface

Prefer:

```text
very light neutral background
or
subtle stage tint
```

with:

```text
2px border
```

Do not apply strong black shadow to every entire column if board becomes too visually heavy.

Use shadow primarily on cards.

---

# 60. Drag Start

When user picks up card:

```text
scale 1.02–1.04
rotate -1deg to 1deg
shadow 8px
cursor grabbing
```

Do not rotate randomly on every frame.

---

# 61. Dragging

Card should remain readable.

Avoid:

- opacity too low;
- excessive blur;
- huge scale;
- bouncing during movement.

---

# 62. Drop Target

Destination column:

```text
slightly brighter stage tint
border stronger
optional dashed inset zone
```

Do not flash aggressively.

---

# 63. Drop Success

On drop:

```text
small spring settle
```

No confetti for normal stage movement.

---

# 64. Drop Failure

On failure:

```text
rollback
+
small shake optional
+
toast
```

Example:

> Lamaran tidak dapat dipindahkan. Coba lagi.

---

# 65. Kanban Mobile

On mobile:

- allow horizontal scrolling;
- preserve card width;
- offer stage-change action menu;
- do not force precise touch drag.

Primary fallback:

```text
More
↓
Ubah Tahap
↓
Select Stage
```

---

# 66. Badge

Badges are used for:

```text
Stage
Remote
Source
Waiting
Deadline
```

Default style:

```text
pill
2px border
no shadow
```

---

# 67. Badge Color

Stage badge:

```text
stage color
```

Metadata badge:

```text
neutral / cream
```

Warning:

```text
yellow
```

Error:

```text
red
```

---

# 68. Tabs

Tabs should feel sticker-like.

Active:

```text
accent fill
2px border
small hard shadow
```

Inactive:

```text
transparent / neutral
no shadow
```

---

# 69. Dropdown

Dropdown:

```text
white
2px black border
6px shadow
12px radius
```

Open animation:

```text
small pop
```

---

# 70. Dialog

Dialog:

```text
white
3px black border
8px shadow
16px radius
```

Backdrop:

```text
black with low opacity
```

No blur required.

---

# 71. Dialog Motion

Open:

```text
opacity 0→1
scale .96→1
translateY 6→0
```

Close:

```text
faster reverse
```

Reduced-motion:

```text
fade only
```

---

# 72. Drawer / Sheet

Mobile forms can use bottom sheet.

Style:

```text
white
3px black top border
large top radius
```

Avoid too much bounce.

---

# 73. Toast

Toast:

```text
white or semantic accent
2px black border
4px shadow
```

Animation:

```text
slide in
tiny rotate optional
```

---

# 74. Toast Copy

Good:

```text
Lamaran ditambahkan!
Dipindahkan ke Wawancara.
Semua tersimpan.
Tindak lanjut ditambahkan.
```

Avoid:

```text
Your operation was successfully processed.
```

---

# 75. Tooltip

Tooltip:

```text
black background
white text
small radius
```

Tooltip does not need neobrutalist shadow.

Use for icon-only ambiguity.

---

# 76. Checkbox

Checked:

```text
yellow / green fill
black check
```

Interaction:

```text
tiny squish
```

---

# 77. Toggle

Make toggle feel physical.

Track:

```text
2px black border
```

Thumb:

```text
black or white
```

Selected state can use accent color.

---

# 78. Progress Indicators

Avoid gamified XP bars.

Progress can represent:

- onboarding;
- form steps;
- funnel analytics.

Do not show:

```text
Job hunt score
Productivity score
```

---

# 79. Navigation

Desktop primary:

```text
Sidebar
```

Items:

```text
Dasbor
Lamaran
Kalender
Analitik
Pengaturan
```

---

# 80. Sidebar Style

Recommended:

```text
cream / white
right black border
```

Active item:

```text
yellow or blue background
2px border
small hard shadow
```

Do not give every nav item a shadow.

---

# 81. Mobile Navigation

Recommended:

```text
bottom nav
```

or compact drawer depending on final UI.

Core items:

```text
Beranda
Lamaran
Kalender
Analitik
```

Settings can live in profile menu.

---

# 82. Page Header

Structure:

```text
Title
Supporting copy
Primary action
```

Example:

```text
Lamaran Saya

Pantau setiap peluang.

[ + Tambah Lamaran ]
```

---

# 83. Dashboard

Dashboard must answer:

```text
What is happening?
What is next?
What needs attention?
```

Not:

```text
How productive am I?
```

---

# 84. Dashboard Summary Cards

Use max 3–5 visible at once.

Cards may use different accents but should remain balanced.

Example:

```text
Applications
42

Interviews
5

Offers
2
```

---

# 85. Dashboard Stats

Avoid overly large enterprise metrics.

Use:

```text
big number
small label
small supporting context
```

---

# 86. Upcoming Section

Use event cards with category accent.

Example:

```text
HR Interview
Tokopedia
Tomorrow · 10:00
```

---

# 87. Needs Attention

Tone must be calm.

Good:

> Belum ada kabar selama 8 hari.

> Batas waktu asesmen besok.

Avoid:

> URGENT! You are falling behind!

---

# 88. Application Detail

Application detail should feel calmer than board.

Recommended structure:

```text
Header
Overview
Recruitment
Notes
Timeline
```

Use 2-column desktop layout only if readability remains good.

---

# 89. Timeline

Timeline should visually show progress.

Use:

```text
vertical line
+
colored event nodes
```

Stage change:

```text
stage color
```

Interview:

```text
pink
```

Assessment:

```text
orange
```

Offer:

```text
green
```

---

# 90. Timeline Density

Do not overdecorate every event.

Use hierarchy:

```text
date
title
secondary description
```

---

# 91. Calendar

Calendar should inherit stage/event colors.

Do not overfill cells.

Show:

```text
short title
colored marker
time
```

Mobile may switch to agenda view.

---

# 92. Analytics Visual Style

Analytics should not look like corporate BI.

Use:

```text
simple bold bars
color blocks
sticker-like labels
large readable percentages
```

Avoid:

```text
3D charts
pie chart explosion
tiny legends
complex dashboards
```

---

# 93. Charts

Chart colors should use existing accent palette.

Do not invent random colors.

Maintain contrast.

Charts must have:

- text labels where needed;
- tooltips;
- accessible summary.

---

# 94. Conversion Funnel

Preferred:

```text
Applied
100
↓
Interview
24
↓
Offer
6
↓
Hired
2
```

with broad colorful blocks.

---

# 95. Empty States

Empty states are one of the best places for personality.

Structure:

```text
Illustration
Headline
Short supporting copy
Primary action
```

---

# 96. Empty State Examples

## No Applications

> **Belum ada apa pun di sini.**  
> Tambahkan lamaran pertamamu dan mulai pantau proses pencarian kerja.

CTA:

```text
Tambah Lamaran
```

---

## Empty Interview Column

> Belum ada wawancara di sini.

Keep this subtle; no need for large illustration in every empty Kanban column.

---

## No Search Results

> **Tidak ada hasil yang cocok.**  
> Coba ubah pencarian atau filter.

CTA:

```text
Hapus Filter
```

---

## No Calendar Events

> **Kalendermu masih kosong.**

Supporting:

> Wawancara dan batas waktu akan muncul di sini.

---

# 97. 404

Potential playful copy:

> **Ups, halaman ini mengambil jalan lain.**

CTA:

```text
Kembali ke Applyo
```

Use mascot illustration if available.

---

# 98. Loading States

Prefer skeletons over spinners for:

- dashboard;
- board;
- application detail;
- analytics.

Spinner is acceptable for:

- button submission;
- tiny inline actions.

---

# 99. Skeleton Style

Skeleton:

```text
muted cream / gray
rounded
no black border
```

Do not animate aggressively.

---

# 100. Celebration

Celebrate only meaningful milestones.

Approved:

```text
First application
First interview
First offer
Hired
```

Not approved:

```text
Every drag
Every save
Every login
```

---

# 101. Hired Moment

Hired can use:

```text
small confetti
mascot
green/yellow accents
```

Copy:

> **Kamu mendapatkan pekerjaannya!**

Supporting:

> Lamaran ini sekarang ditandai sebagai Diterima.

---

# 102. Rejection UX

Rejection must remain respectful.

Good:

> **Dipindahkan ke Ditolak.**

Optional:

> Riwayatmu tersimpan jika ingin ditinjau nanti.

Avoid:

```text
You failed
Better luck next time!!!
Don't give up!
```

---

# 103. Ghosted UX

Good:

> **Ditandai Tanpa Kabar.**

Supporting:

> Kamu dapat membuka kembali lamaran ini jika perusahaan menghubungimu lagi.

---

# 104. Withdrawn UX

Neutral:

> **Lamaran ditarik.**

No celebration.

---

# 105. Offer UX

Offer can use subtle positive emphasis.

Example:

```text
green highlight
small star icon
```

No confetti yet.

---

# 106. Microcopy Principles

Use:

```text
short
direct
human
friendly
```

---

# 107. Microcopy Examples

Instead of:

> Lamaran berhasil dibuat.

Use:

> Lamaran ditambahkan!

Instead of:

> Pembaruan berhasil diselesaikan.

Use:

> Semua tersimpan!

Instead of:

> Tidak ada data.

Use:

> Belum ada apa pun di sini.

Instead of:

> Terjadi kesalahan tak terduga.

Use:

> Terjadi kesalahan. Coba lagi.

---

# 108. Confirmation Dialog Copy

Delete:

> **Hapus lamaran ini?**  
> Tindakan ini tidak dapat dibatalkan.

Archive:

> **Arsipkan lamaran ini?**  
> Kamu dapat memulihkannya nanti.

---

# 109. Error Tone

Error copy should explain:

```text
what failed
+
what user can do next
```

Example:

> Lamaran tidak dapat dipindahkan. Coba lagi.

---

# 110. Success Tone

Success copy should not interrupt flow.

Use toast.

Example:

> Dipindahkan ke Wawancara.

---

# 111. Gamification Rules

Allowed:

```text
milestone celebration
weekly recap
progress summary
```

Avoid:

```text
streaks
XP
levels
badges for number of applications
leaderboards
daily quotas
```

---

# 112. Why No Streaks

Applyo should not make users feel guilty for:

- not applying every day;
- taking breaks;
- receiving few responses.

Job searching is not a productivity competition.

---

# 113. Interaction Feedback Matrix

| Action | Feedback |
|---|---|
| Hover button | Lift |
| Click button | Press |
| Open dialog | Pop |
| Drag card | Lift + slight tilt |
| Drop card | Settle |
| Save form | Toast |
| Complete event | Small check animation |
| Hired | Celebration |
| Error | Toast + rollback |
| Rejected | Neutral state change |

---

# 114. Application Stage Interaction

Stage change should be visible through:

- card movement;
- badge change;
- column context;
- toast;
- timeline entry.

Do not add multiple competing animations.

---

# 115. Interactive Component Budget

A page should not have everything animated simultaneously.

Rule of thumb:

```text
primary interaction
→ expressive

secondary interaction
→ subtle

background
→ mostly static
```

---

# 116. Responsive Breakpoints

Use Tailwind defaults as baseline:

```text
sm
md
lg
xl
2xl
```

Design intentionally for:

```text
mobile
tablet
laptop
desktop
```

---

# 117. Content Width

Standard content max width:

```text
1200–1440px
```

Kanban may use wider horizontal overflow.

---

# 118. Mobile Padding

Recommended:

```text
16px
```

Desktop:

```text
24–32px
```

---

# 119. Kanban on Desktop

Use full-height workspace where practical.

Columns scroll horizontally.

Cards scroll vertically with page or controlled column depending implementation.

Avoid nested scroll unless necessary.

---

# 120. Kanban on Mobile

Preferred:

```text
horizontal columns
+
stage menu fallback
```

No desktop-only interaction should block mobile use.

---

# 121. Touch Targets

Minimum interactive touch target:

```text
44x44px
```

for mobile where practical.

---

# 122. Accessibility

Target:

```text
WCAG 2.2 AA
```

where reasonably applicable.

---

# 123. Color Contrast

Ensure:

```text
text on yellow
text on pink
text on green
```

remains readable.

Primary ink color is usually black.

Do not use white text unnecessarily on bright accent colors.

---

# 124. Focus Ring

Focus style should fit brand.

Recommended:

```text
2px black outline
+
2px accent offset
```

or equivalent clearly visible state.

---

# 125. Keyboard Navigation

Must support:

- navigation;
- forms;
- dialogs;
- dropdowns;
- card action menu;
- stage change fallback;
- calendar controls.

---

# 126. Drag-and-Drop Accessibility

Drag is not the only method.

Every card must expose:

```text
Ubah Tahap
```

through accessible action.

---

# 127. Screen Readers

Use semantic:

```text
button
heading
nav
main
section
dialog
form
label
```

Do not use clickable `div` if a button is correct.

---

# 128. Icon Accessibility

Decorative icons:

```text
aria-hidden
```

Meaningful icon-only buttons:

```text
aria-label
```

---

# 129. Motion Accessibility

Reduced motion must remove:

- bounce;
- spin;
- parallax;
- confetti;
- excessive drag scale.

---

# 130. Illustration Accessibility

Decorative illustration:

```text
alt=""
```

Meaningful illustration should have concise alt text.

---

# 131. Dark Mode

Dark mode is not required for MVP.

Reason:

- core brand direction is built around warm cream + black outline;
- adding dark mode early doubles visual QA complexity.

Architecture should not prevent future dark mode.

---

# 132. Design Tokens — CSS Draft

```css
:root {
  /* Base */
  --background: #FFFDF5;
  --surface: #FFFFFF;
  --ink: #151515;
  --muted: #F3EEDF;
  --muted-text: #68635B;

  /* Accent */
  --yellow: #FFD84D;
  --blue: #74C7FF;
  --pink: #FF8CCB;
  --purple: #B49CFF;
  --green: #72E6A6;
  --orange: #FFAA5B;
  --red: #FF6B6B;
  --gray: #D8D5CF;

  /* Semantic */
  --success: var(--green);
  --warning: var(--yellow);
  --error: var(--red);
  --info: var(--blue);

  /* Border */
  --border-color: #151515;
  --border-default: 2px;
  --border-strong: 3px;

  /* Radius */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-pill: 999px;

  /* Shadow */
  --shadow-xs: 2px 2px 0 #151515;
  --shadow-sm: 3px 3px 0 #151515;
  --shadow-md: 4px 4px 0 #151515;
  --shadow-lg: 6px 6px 0 #151515;
  --shadow-xl: 8px 8px 0 #151515;

  /* Motion */
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 320ms;
  --duration-celebration: 600ms;
}
```

---

# 133. Component Token Philosophy

Component variants should be built from semantic tokens.

Bad:

```text
button yellow = #FFD84D hardcoded
```

Good:

```text
button.primary.background = var(--yellow)
```

---

# 134. Tailwind Usage

Use semantic classes / CSS variables where practical.

Avoid repeated arbitrary values like:

```text
shadow-[4px_4px_0_#151515]
```

throughout codebase.

Create reusable utilities/components.

---

# 135. shadcn/ui Strategy

shadcn/ui is the primitive starting point.

Do not treat default shadcn styling as final Applyo design.

Every core component should be adapted to:

```text
Applyo border
Applyo radius
Applyo shadow
Applyo motion
Applyo typography
```

---

# 136. Component Ownership

Base primitives:

```text
components/ui
```

Application-specific components:

```text
features/*
```

Examples:

```text
components/ui/button.tsx
components/ui/dialog.tsx

features/applications/components/application-card.tsx
features/kanban/components/kanban-column.tsx
```

---

# 137. Component Naming

Prefer descriptive:

```text
ApplicationCard
KanbanColumn
RecruitmentEventCard
ApplicationTimeline
StageBadge
```

Avoid:

```text
FancyCard
CoolBox
BrutalButton2
```

---

# 138. Component Documentation

Each reusable core component should document:

- variants;
- size;
- state;
- expected interaction;
- accessibility notes.

Storybook is optional and not required for MVP.

---

# 139. Primary Components Checklist

Required:

```text
Button
IconButton
Input
Textarea
Select
Checkbox
Switch
Badge
Card
Dialog
Drawer
Dropdown
Popover
Tooltip
Toast
Tabs
Skeleton
EmptyState
PageHeader
StatCard
ApplicationCard
StageBadge
KanbanColumn
Timeline
EventCard
```

---

# 140. Stage Badge Mapping

```text
Wishlist   → Purple
Applied    → Blue
Screening  → Yellow
Interview  → Pink
Assessment → Orange
Offer      → Green
Hired      → Green
Rejected   → Red
Withdrawn  → Gray
Ghosted    → Dark Gray
```

---

# 141. Stage Icon Suggestions

Optional:

```text
Wishlist   → Bookmark
Applied    → Send
Screening  → Search
Interview  → MessageCircle
Assessment → ClipboardCheck
Offer      → Sparkles
Hired      → PartyPopper / CheckCircle
Rejected   → XCircle
Withdrawn  → Undo2
Ghosted    → Ghost
```

Use carefully; do not over-symbolize every stage if labels are enough.

---

# 142. Source Badge

Examples:

```text
LinkedIn
Jobstreet
Glints
Referral
Company Website
Other
```

Use neutral styling so source does not compete with stage.

---

# 143. Work Arrangement Badge

Examples:

```text
Remote
Hybrid
On-site
```

Neutral cream/white.

---

# 144. Waiting Indicator

Good:

```text
Waiting · 8 days
```

Visual:

```text
small muted badge
```

If threshold exceeded:

```text
yellow
```

Do not automatically use red.

---

# 145. Deadline Indicator

Within 24h:

```text
yellow / orange
```

Past due:

```text
red
```

Use icon + text.

---

# 146. Table/List View

Table should remain playful but functional.

Header:

```text
muted cream
bold labels
2px bottom border
```

Rows:

```text
white
subtle separators
hover light yellow
```

Do not give every table row a hard shadow.

---

# 147. Search

Search input should be prominent but not oversized.

Icon:

```text
Search
```

Placeholder:

> Cari perusahaan atau posisi...

---

# 148. Filters

Filter controls can use pill/sticker styling.

Active filters visible as chips.

Example:

```text
[ Interview × ]
[ LinkedIn × ]
```

---

# 149. Settings

Settings should use calmer surfaces.

Avoid too many accent colors.

Use playful UI primarily in:

- headings;
- toggles;
- section icons;
- buttons.

---

# 150. Auth Pages

Auth should feel welcoming.

Recommended layout:

```text
Form
+
illustration / brand panel
```

Desktop split optional.

Mobile:

```text
single column
```

---

# 151. Login Copy

Heading:

> Selamat datang kembali!

Supporting:

> Lanjutkan kembali proses pencarian kerjamu.

---

# 152. Register Copy

Heading:

> Mulai memantau bersama Applyo.

Supporting:

> Simpan semua lamaran di satu tempat.

---

# 153. Landing Hero

Possible structure:

```text
Your job hunt,
without the spreadsheet chaos.

Track applications.
Move them through the process.
Keep everything in one place.

[ Mulai Pantau Gratis ]
```

---

# 154. Landing Visual

Best visual:

```text
interactive / illustrated mini Kanban
```

with cards that subtly move.

Avoid autoplay chaos.

---

# 155. Free Message

Since Applyo is full free:

> **Gratis digunakan. Tidak ada papan premium yang dikunci di balik pembayaran.**

Tone should remain straightforward.

---

# 156. Responsive Typography

Mobile headings scale down.

Example:

```text
Display XL desktop 48
Mobile 36
```

Body stays minimum ~14–16px.

---

# 157. Long Content

Job descriptions and notes may be long.

Use:

- readable line length;
- whitespace;
- collapsible sections if needed.

Avoid long text inside narrow sidebars.

---

# 158. Text Line Length

For reading-heavy content:

```text
60–75 characters
```

where practical.

---

# 159. Data Formatting

Dates should feel natural.

Examples:

```text
28 Aug 2026
Tomorrow · 10:00
5 days ago
```

Do not overuse raw ISO dates in UI.

---

# 160. Currency

Display based on preference.

Examples:

```text
Rp6.000.000
$1,200
```

Use readable locale formatting.

---

# 161. Empty Kanban Column

Keep minimal:

```text
Drop an application here
```

or:

```text
Belum ada apa pun di sini
```

No large mascot in every column.

---

# 162. Drag Handle

Card can be draggable from full card on desktop.

If conflicts appear with clicks:

```text
drag handle
```

may be introduced.

Ensure accessible card action menu remains separate.

---

# 163. Click vs Drag

The interaction threshold should prevent accidental drag when clicking a card.

Click:

```text
open detail
```

Drag:

```text
move card
```

---

# 164. Destructive Actions

Delete should never be visually adjacent to safe actions without differentiation.

Use:

```text
destructive section
confirmation dialog
```

---

# 165. Archive vs Delete

Archive:

```text
neutral
```

Delete:

```text
red
```

Make distinction obvious.

---

# 166. Form Save Behavior

Primary action:

```text
Save
```

On successful save:

```text
close dialog when appropriate
+
toast
```

Do not keep form blocked longer than necessary.

---

# 167. Unsaved State

If user navigates away from a large edit form with unsaved content:

- consider confirmation;
- do not add confirmation for tiny inline edit if unnecessary.

---

# 168. Loading Buttons

Button loading:

```text
spinner + label
```

Example:

```text
Menyimpan...
```

Maintain width if possible to prevent layout jump.

---

# 169. Disabled State

Disabled:

```text
reduced opacity
no shadow interaction
cursor not-allowed
```

Text must remain legible.

---

# 170. Skeleton Board

Show:

```text
stage headers
2–3 card skeletons
```

Do not show dozens of skeleton cards.

---

# 171. Error Page

Use neutral playful visual.

Headline:

> Ada yang tidak berjalan semestinya.

Supporting:

> Coba muat ulang halaman ini.

CTA:

```text
Coba Lagi
```

---

# 172. Onboarding

MVP onboarding should remain short.

Potential:

```text
Welcome
↓
Add first application
```

No 5-step product tour required.

---

# 173. First Application Moment

After first application:

```text
small success toast
```

Potential mascot nod.

No full-screen celebration.

---

# 174. First Interview Moment

Can show subtle milestone:

> **Wawancara pertama ditambahkan!**

This is meaningful enough for mild celebration.

---

# 175. Emotional Safety

UI must not make assumptions about how users feel.

Avoid:

> Amazing! Rejected again but keep going!

Use neutral language for negative outcomes.

---

# 176. Reminder Tone

Good:

> Wawancara besok pukul 10.00.

> Belum ada kabar selama 8 hari.

Bad:

> Don't forget! You still haven't followed up!

---

# 177. Job Search Pace

Never impose:

```text
daily application target
weekly quota
streak loss
```

unless user explicitly opts into a future personal goal feature.

---

# 178. Accessibility Testing Checklist

For each core component:

- [ ] keyboard operable;
- [ ] visible focus;
- [ ] proper semantic role;
- [ ] label present;
- [ ] color contrast acceptable;
- [ ] state not color-only;
- [ ] reduced motion considered;
- [ ] mobile touch target acceptable.

---

# 179. Kanban Accessibility Checklist

- [ ] card focusable;
- [ ] card has accessible name;
- [ ] menu Ubah Tahap tersedia;
- [ ] drag instructions if keyboard DnD used;
- [ ] stage change announced or visible;
- [ ] no critical action only via drag.

---

# 180. Visual QA Checklist

Before public beta:

- [ ] hard shadows consistent;
- [ ] border width consistent;
- [ ] stage colors consistent;
- [ ] no arbitrary random accent colors;
- [ ] radius consistent;
- [ ] typography hierarchy consistent;
- [ ] cards not overly dense;
- [ ] dashboard not rainbow-heavy;
- [ ] responsive spacing checked;
- [ ] motion feels intentional.

---

# 181. Component QA Checklist

Button:

- [ ] hover;
- [ ] active;
- [ ] focus;
- [ ] disabled;
- [ ] loading.

Input:

- [ ] default;
- [ ] focus;
- [ ] invalid;
- [ ] disabled.

Dialog:

- [ ] keyboard escape;
- [ ] focus trap;
- [ ] mobile layout.

Kanban card:

- [ ] hover;
- [ ] click;
- [ ] drag;
- [ ] keyboard alternative.

---

# 182. Brand Consistency Rule

When uncertain, choose the option that is:

```text
clearer
simpler
more readable
```

before choosing the one that is:

```text
more decorative
more animated
more colorful
```

---

# 183. Design Anti-Patterns

Do not:

- add shadow to every small element;
- use six bright colors in one card;
- rotate every card randomly;
- animate every mount;
- use emoji for all icons;
- hide labels behind icons;
- use red for inactivity;
- show huge illustrations in data-dense screens;
- add motivational quotes after rejection;
- make Kanban columns look like toys at the expense of readability.

---

# 184. Recommended Visual Formula

For most Applyo screens:

```text
Cream Background
+
White Main Surfaces
+
Black Borders
+
Black Hard Shadows
+
1–2 Accent Colors Per Section
+
Bold Heading
+
Neutral Body Typography
```

---

# 185. Page-Level Color Rule

Each page can have one dominant accent.

Example:

```text
Dashboard    Yellow
Applications Blue
Calendar     Pink
Analytics    Purple
Settings     Green
```

This is optional.

Do not let page color override semantic stage colors.

---

# 186. Illustration Placement

Use illustrations primarily where data is absent or product story matters.

Best places:

```text
Landing
Auth
Empty State
404
Hired
Onboarding
```

Avoid:

```text
every dashboard section
every form
every card
```

---

# 187. Mascot Frequency

Recommended maximum:

```text
0–1 mascot instance per page
```

Most utility pages should have none.

---

# 188. Design System Implementation Priority

P0:

```text
colors
typography
border
shadow
radius
spacing
button
input
card
badge
dialog
application card
Kanban column
```

P1:

```text
motion
toast
timeline
event card
empty state
calendar styling
```

P2:

```text
analytics charts
landing illustrations
mascot
advanced celebration
```

---

# 189. Design Tokens Naming Strategy

Prefer semantic tokens.

Example:

```text
--color-background
--color-surface
--color-foreground
--color-stage-interview
--shadow-card
--shadow-dialog
```

Avoid raw naming only:

```text
--pink-1
--pink-2
```

unless maintaining a full scale becomes necessary.

---

# 190. Stage Token Draft

```css
:root {
  --stage-wishlist: #B49CFF;
  --stage-applied: #74C7FF;
  --stage-screening: #FFD84D;
  --stage-interview: #FF8CCB;
  --stage-assessment: #FFAA5B;
  --stage-offer: #72E6A6;
  --stage-hired: #72E6A6;
  --stage-rejected: #FF6B6B;
  --stage-withdrawn: #D8D5CF;
  --stage-ghosted: #A7A29A;
}
```

---

# 191. Component Shadow Tokens

```css
:root {
  --shadow-button: 4px 4px 0 #151515;
  --shadow-card: 4px 4px 0 #151515;
  --shadow-card-hover: 5px 5px 0 #151515;
  --shadow-card-drag: 8px 8px 0 #151515;
  --shadow-dialog: 8px 8px 0 #151515;
  --shadow-dropdown: 6px 6px 0 #151515;
}
```

---

# 192. Focus Token Draft

```css
:root {
  --focus-ring: 0 0 0 3px #FFD84D;
}
```

Pair with black outline where needed for contrast.

---

# 193. Layout Token Draft

```css
:root {
  --sidebar-width: 240px;
  --content-max: 1440px;
  --kanban-column-width: 300px;
}
```

---

# 194. Application Card Compact Variant

For very dense boards:

```text
Company
Position
[Stage]
5d waiting
```

Can be introduced later without changing design language.

---

# 195. High-Contrast Mode Consideration

Ensure custom black borders and stage colors do not disappear under forced-colors environments.

Use semantic HTML and avoid relying entirely on background color.

---

# 196. Print Behavior

Not a core requirement.

No dedicated print design required for MVP.

---

# 197. Dark Shadow Rule

Always use the same ink black:

```text
#151515
```

Do not use:

```text
gray shadow
colored shadow
blurred shadow
```

for primary neobrutalist components.

---

# 198. Color Shadow Exception

Default: no colored hard shadows.

Potential brand illustration may use accent shadow, but product UI should stay black-shadow based for consistency.

---

# 199. Data Dense Mode

If future user feedback indicates board is too large, introduce density settings only later.

Current default:

```text
comfortable
```

---

# 200. Final Design Direction

Applyo should visually communicate:

```text
JOB SEARCH
     ↓
SERIOUS INFORMATION

wrapped inside

PLAYFUL VISUAL EXPERIENCE
```

The UI is not playful because job searching is trivial.

It is playful because the process is already exhausting enough.

---

# 201. Final Experience Statement

The target feeling when opening Applyo:

> **"I can see where everything is, and managing it doesn't feel like another chore."**

This should guide every design decision.

---

# 202. Design System Summary

```text
APPLYO
│
├── Playful Neobrutalism
│   ├── Bold black borders
│   ├── Hard black shadows
│   ├── Flat colors
│   └── Chunky shapes
│
├── Cartoon Personality
│   ├── Sticker illustrations
│   ├── Friendly mascot
│   └── Light microcopy
│
├── Tactile Interaction
│   ├── Button press
│   ├── Card lift
│   ├── Kanban drag
│   └── Small bounce
│
├── Emotional UX
│   ├── Celebrate milestones
│   ├── Neutral rejection language
│   ├── No guilt
│   └── No productivity pressure
│
└── Usability
    ├── Strong hierarchy
    ├── Accessible
    ├── Responsive
    ├── Reduced motion
    └── Clear data density
```

---

# 203. Related Documents

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
→ product requirements

ROADMAP
→ development sequence

TASKS
→ implementation backlog

ARCHITECTURE
→ technical architecture

DESIGN SYSTEM
→ visual, UX, interaction, and emotional design rules
```
