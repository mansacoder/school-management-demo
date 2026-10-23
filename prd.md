# PRD v2: MY PUBLIC SCHOOL — School Management Web App (Frontend-Only Demo MVP)

## 1. Purpose
A **frontend-only, demo-grade MVP** for **"MY PUBLIC SCHOOL"**, built to impress a school **Principal** in a live demo. No backend. All data is **realistic mock data** in a typed store, persisted in localStorage. Goal: a **premium, minimal, calm UI** and a **native-app feel** for Parent and Teacher on mobile (installed as PWA).

## 2. Tech Stack (fixed)
- **React 18 + Vite + TypeScript (strict mode)**
- React Router v6, Zustand (typed slices), Zod for form validation + react-hook-form
- Tailwind CSS + shadcn/ui (Radix primitives), Framer Motion, Recharts, lucide-react, date-fns, sonner (toasts)
- **vite-plugin-pwa** (manifest, service worker, installable, standalone display, themed status bar)
- Hosting: **Vercel** (`vercel.json` SPA rewrite to `index.html`)
- All entities fully typed in `src/types/` (Student, Teacher, Parent, Class, FeeType, FeeStructure, FeeInvoice, Payment, Notice, Attendance, Homework, Exam, etc.)

## 3. Branding & Design System

### 3.1 School
- Name everywhere: **MY PUBLIC SCHOOL** (logo placeholder: simple monogram "MPS" in a rounded shield/circle). Tagline optional.

### 3.2 Color (NO default indigo/purple/blue-purple)
Premium, rich, minimal. Define as CSS variables / Tailwind tokens so they can be changed in one place.

| Token | Value | Use |
|---|---|---|
| `--primary` | Deep Emerald `#0B4F45` | Buttons, active nav, key cards |
| `--primary-soft` | `#E4F0EC` | Tints, selected chips |
| `--accent` | Antique Gold `#C8A24A` | Highlights, badges, premium touches |
| `--ink` | Rich Charcoal `#14201D` | Dark KPI card, headings |
| `--bg` | Warm Ivory `#FAF8F3` | App background |
| `--surface` | `#FFFFFF` | Cards |
| `--muted` | `#EEF0EC` | Secondary cards, table stripes |
| `--border` | `#E6E4DC` | Hairlines |
| Success / Warning / Danger | `#1F9D6B` / `#D9962B` / `#C8453B` | Status chips (Paid / Due / Overdue) |

- **Dark mode:** deep green-black `#0B1311` background, same emerald/gold accents.
- Style: minimal, lots of white space, hairline borders, soft shadows, 16–24px radius, one accent color per screen (don't overuse gold).

### 3.3 Typography
- **Poppins (Google Fonts)** only, self-host or load via `@fontsource/poppins` (weights 400, 500, 600, 700).
- Scale: Display 28/32 600, Title 20/28 600, Body 14/22 400, Caption 12/16 500. Numbers (fees, stats) in 600 with tabular figures.

### 3.4 Visual References
- **Attached reference designs are the layout source of truth.** Follow them for structure and spacing: KPI card row (one tinted, one dark/ink, others light), bar chart + donut chart row, searchable sortable table with status pills, top tabs + avatar header, left sidebar with grouped menu.
- Apply **this PRD's color palette and Poppins font** to the references (do not copy their lavender/purple colors).
- If a reference conflicts with this PRD on layout, follow the reference; on color/font, follow the PRD.

### 3.5 Motion & Components
- Page transitions (slide on mobile, fade on desktop), skeleton loaders, count-up numbers, tap scale 0.97, success check animation on payment, bottom-sheet swipe-to-dismiss.
- Designed empty / loading / error states for every list.

## 4. Roles & Platforms
Login screen with 3 role cards (Admin / Teacher / Parent) and **one-tap demo login**.

| Role | Device | Layout |
|---|---|---|
| **Admin** | Desktop/tablet first, responsive on mobile | Left sidebar + top bar (on mobile: hamburger drawer, **no bottom nav**) |
| **Teacher** | **Mobile PWA (primary)** | Native app shell with **bottom navigation** |
| **Parent** | **Mobile PWA (primary)** | Native app shell with **bottom navigation** |

### 4.1 Native Mobile App Shell (Teacher & Parent ONLY)
- **Fixed bottom navigation bar** with 4–5 tabs: icon + label, active tab highlighted (emerald pill/indicator with subtle animation), glass/blur surface, safe-area padding (`env(safe-area-inset-bottom)`), haptic-like tap feedback.
- Top app bar with large collapsing title; bottom sheets instead of modals; sticky bottom action buttons.
- 44px minimum touch targets; no hover-only UI; `100dvh`; no text selection on chrome; overscroll handled.
- Splash screen with MPS logo; PWA install banner; app icons + theme-color set to `--primary`.
- On desktop browsers, the Teacher/Parent app renders inside a centered phone-width frame (max 430px) so the demo still looks like an app.

## 5. Features by Role

### 5.1 Admin (Desktop-first, responsive)
1. **Dashboard** (follow the reference layout): KPI cards (Total Students, Teachers, Today's Attendance %, Fees Collected this month, Pending Fees), Collection bar chart (1d/7d/30d/16m toggle) + donut (Paid / Overdue / Unpaid), recent payments table, quick actions.
2. **Students**: searchable/filterable/sortable table, profile page (details, linked parent, attendance, fee ledger), add/edit drawer.
3. **Teachers**, **Classes & Sections**, **Timetable**, **Events/Calendar**, **Exams & Results (view)**, **Attendance Overview**.
4. **Notices (Admin side)**: create notice (title, message, category: General / Holiday / Fee / Exam / Urgent, audience: All Parents / Specific Class / Teachers, optional pinned). Live **preview of how it looks in the Parent app**. Published list with edit/delete.
5. **Fee Management** (Admin owns all fee operations) — see section 6.
6. **Settings**: school profile (MY PUBLIC SCHOOL), academic year, theme toggle, "Reset demo data".

### 5.2 Teacher (Mobile PWA) — Bottom tabs: Home · Attendance · Classes · Notices · Profile
1. **Home**: greeting, today's schedule (current period highlighted), quick actions (Mark attendance, Add homework, Post notice, Enter marks), pending tasks.
2. **Attendance** (hero feature): choose class → student list → tap/swipe to toggle Present/Absent/Late → live counter → submit with success animation.
3. **Classes**: my classes, student list, parent contact (call / WhatsApp buttons).
4. **Notices**: **teacher can create notices** for their classes' parents (title, message, category, class selector). Teacher's notices show with teacher name + "Teacher" badge in the Parent top notice box. Also shows notices received from Admin.
5. **Homework** (create/list), **Marks entry**, **Leave application**, **Timetable**.
6. **Profile**: details, theme toggle, logout.

### 5.3 Parent (Mobile PWA) — Bottom tabs: Home · Fees · Academics · Notices · Profile
1. **Home**
   - **Top Notice Box (key requirement):** a prominent card/carousel at the very top of Home showing the latest and pinned notices. **Notices come from both Admin and Teachers.** Each notice shows: title, short text, category chip, time ago, and **author chip** ("Admin" with school badge or "Mrs. Sharma · Class Teacher"). Urgent/pinned notices appear first with a gold accent. Tap opens full notice in a bottom sheet; "View all" goes to Notices tab. Unread dot/count.
   - Child switcher (multi-child), today's attendance status, **Fee due card** (amount, due date, Pay Now), homework due today, upcoming events, quick actions grid.
2. **Fees**: summary ring (total / paid / due), fee list grouped by **fee type** (Monthly, Admission, Exam, etc.) with status chips (Paid / Due / Overdue), **Pay Now** flow (select dues → bottom sheet with UPI / Card / Net Banking mock → processing → success animation → downloadable/printable receipt), payment history.
3. **Academics**: attendance calendar, homework, results with charts, timetable, exam schedule.
4. **Notices**: full feed with filters (All / Admin / Teachers / Fee / Exam), unread state.
5. **Extras (mock)**: bus tracking placeholder with animated marker, gallery, leave application, digital ID card with QR.
6. **Profile**: parent + children details, language toggle (EN / हिंदी), theme toggle, logout.

## 6. Fee Management (Admin) — Fee Types First
**Flow order matters: Admin must first define Fee Types, then assign amounts to classes, then collect.**

### 6.1 Fee Types (new, first screen of Fees module)
- List + **"Add Fee Type"** button (drawer form, Zod-validated).
- Fields: Name, Category (**Monthly / Admission / Exam / Annual / Transport / Activity / Uniform & Books / Custom**), Frequency (Monthly / Quarterly / Yearly / One-time / Per exam), Mandatory or Optional, Late fee (fixed or % after due date), Active toggle.
- Pre-seeded types: Monthly Tuition Fee, Admission Fee, Exam Fee (Term 1, Term 2, Final), Annual Charges, Transport Fee.
- Edit, deactivate, and delete (mock) supported.

### 6.2 Fee Structure
- Per **class** (Nursery–10): pick fee types, set amount for each, due day/date. Copy structure from another class. Applied invoices auto-generate in mock store for each student.

### 6.3 Collect Fee
- Search student → see all dues grouped by fee type → select items → apply discount / waive late fee → choose mode (Cash / UPI / Card / Cheque) → **branded receipt** (MY PUBLIC SCHOOL header, receipt no., itemized fee types, QR, printable) + success animation.

### 6.4 Pending / Defaulters
- Filters: class, fee type, amount, days overdue; bulk select; "Send reminder" (mock WhatsApp/SMS toast).

### 6.5 Transactions & Reports
- Searchable/sortable table (like the reference's Order History) with status pills; filters by date/class/mode/fee type; CSV export (client-side); collection summary charts.

### 6.6 Cross-role sync
- Parent payment instantly appears in Admin dashboard + transactions; admin cash collection updates the Parent's fee screen (shared typed store).

## 7. Notice System (cross-role)
- Single `notices` store slice: `{ id, title, body, category, audience (all | class | teachers), authorRole ('admin' | 'teacher'), authorName, pinned, createdAt, readBy[] }`.
- Admin and Teacher can create; Parent consumes in top box + Notices tab. Teacher can only target their own classes; Admin can target everyone.
- Creating a notice shows a toast and appears immediately in the Parent app (demo moment).

## 8. Mock Data
Realistic Indian names, ₹ with `en-IN` formatting. ~300 students (Nursery–10, 2 sections), 25 teachers, 12-month fee ledger with mixed statuses (~70% paid, 20% due, 10% overdue) across multiple fee types, 60 days attendance, 20 notices from both Admin and teachers, events, homework, results. Seed once, persist in localStorage.

## 9. Routes
```
/login
/admin/dashboard | students | students/:id | teachers | classes | timetable | events | exams | attendance | notices | settings
/admin/fees/types | fees/structure | fees/collect | fees/pending | fees/transactions
/teacher/home | attendance | classes | notices | homework | marks | leave | profile
/parent/home | fees | fees/pay | academics | notices | profile
```

## 10. Folder Structure
```
src/
  app/ (router, layouts: AdminLayout, MobileShell)
  components/ (ui/, charts/, mobile/ BottomNav, BottomSheet, AppBar, NoticeBox)
  features/ (admin/, teacher/, parent/)
  data/ (typed mock seed)
  store/ (zustand typed slices: auth, students, feeTypes, fees, notices, attendance)
  types/  hooks/  lib/ (formatters, receipt)  styles/
```

## 11. Demo Script
1. Phone: splash → Parent login → **top notice box** (Admin + Teacher notices) → Fees → Pay Now → success + receipt.
2. Laptop Admin: dashboard shows the payment → **Add new Fee Type** → assign to a class → Collect Fee (cash) → receipt → Defaulters → reminder.
3. Admin posts a notice → Teacher posts a notice → both appear instantly in Parent's top box.
4. Teacher marks attendance by swipe → Parent sees update.
5. Toggle dark mode and Hindi.

## 12. Non-Functional
- TypeScript strict, no `any`, ESLint + Prettier, no console errors.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 90, PWA installable.
- Responsive 360px → 1920px; test 375×812 and 390×844.
- Route-level lazy loading; design tokens in one place; AA contrast.
- Every visible button works (action or toast).

## 13. Out of Scope
Backend, real auth/payments/SMS/uploads, multi-school.

## 14. Acceptance Criteria
- Theme uses emerald/gold/ivory palette with **Poppins**; no indigo anywhere.
- School name "MY PUBLIC SCHOOL" appears in login, headers, receipts, PWA manifest.
- Teacher and Parent have native-style **bottom navigation** and install as PWA; Admin uses sidebar only.
- Parent Home has a top notice box showing both Admin and Teacher notices with author badges.
- Admin can create Fee Types (Monthly, Admission, Exam, custom) before assigning/collecting fees; parent sees dues grouped by fee type.
- Cross-role sync works for fees, notices, attendance. Deployed on Vercel with deep-link refresh working.

## 15. Build Order
1. Vite + TS + Tailwind + shadcn + Poppins + tokens + PWA + Vercel config
2. Types + mock data + typed Zustand store
3. Login, routing, AdminLayout, MobileShell with BottomNav
4. Parent app (Home with NoticeBox, Fees + pay flow, Notices, Academics)
5. Admin (Dashboard, Fee Types → Structure → Collect → Pending → Transactions, Notices, Students)
6. Teacher app (Home, Attendance, Notices, Homework)
7. Remaining pages, dark mode, Hindi toggle
8. Polish: animations, empty states, Lighthouse, deploy