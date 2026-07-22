# Book Companion Course — MVP Technical Blueprint

> ⚠️ **Historical document — Sprint 0 record.**
>
> This file is the Sprint 0 blueprint and describes the original
> **manual-enrollment** access model. That model was replaced in Sprint 10
> with **sign-in-only** access — any signed-in user can take the course,
> save progress, take quizzes, and earn a certificate. The
> `course_enrollments` table is kept in the schema but no longer consulted
> at runtime.
>
> For the current architecture, see:
> - [`docs/course-setup-and-launch-checklist.md`](./course-setup-and-launch-checklist.md) — operator runbook and access model.
> - [`docs/update-course-content.md`](./update-course-content.md) — how to change titles, lessons, quizzes, and the certificate.
> - [`supabase/sql/README.md`](../supabase/sql/README.md) — current SQL apply order (skip 0004; run 0005).
>
> Keep this file for audit and history; do not act on its access-model claims.

---

Status: Sprint 0 plan. No production feature code added yet.
Branch: `feature/book-course-mvp`
Owner: Maher Kaddoura / 86400 Studio
Last updated: 2026-05-28

---

## 1. Purpose of this document

This blueprint locks the scope, route map, data model, security posture, and sprint-by-sprint plan for the **single branded online companion course** that ships with the book *The Singapore Way*.

It is intentionally narrow. This is:

- **One** premium branded course bundled with the book.
- **Manual enrollment only** — no payments, no access codes, no marketplace.
- **A web-based experience** — no native app, no SCORM/xAPI, no PDF certs (MVP).

If this document drifts from the on-disk reality (see `package.json`, `next.config.ts`, `middleware.ts`, `TECH-ARCHITECTURE.md`), trust the code.

---

## 2. Confirmed repo reality (Sprint 0 inspection)

The repo matches the locked stack in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md). Key facts validated from disk:

- Framework: **Next.js 15.5** App Router, React 19, TypeScript strict (`tsconfig.json`).
- Package manager: **pnpm 10.12.1** (pinned via `packageManager`).
- Styling: **Tailwind CSS v4** (`@tailwindcss/postcss`), tokens in `src/styles/globals.css`, brand red `#C8102E`.
- Components: shadcn-style primitives live in `src/components/ui/` (`button`, `card`, `form`, `input`, `label`, `textarea`).
- Shared sections: `PageHero`, `Navigation`, `Footer`, `AuthUnavailableNotice`, `motion/Reveal`, `motion/RevealStagger`.
- Animation: **Framer Motion 12** via the existing `motion/` primitives.
- Forms: `react-hook-form` + `zod` (already installed).
- Icons: `lucide-react` (already installed).
- Auth + DB: **Supabase** via `@supabase/ssr`. Browser client at [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts); server client at [`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts); session refresh in [`middleware.ts`](../middleware.ts).
- Auth flows already shipped: `/login`, `/signup`, `/forgot-password`, `/update-password`, `/account`, with helpers [`src/lib/auth/errors.ts`](../src/lib/auth/errors.ts) and [`src/lib/auth/redirects.ts`](../src/lib/auth/redirects.ts) and the `AuthUnavailableNotice` graceful-degradation pattern.
- API routes: `/api/newsletter`, `/api/contact`, `/api/mailchimp/subscribe` — server-only, gated by Turnstile and Upstash rate limits.
- Observability: Sentry, PostHog (no-op when keys absent).
- Hardening: Upstash Redis rate limiting, Cloudflare Turnstile, security headers + CSP in `next.config.ts`.
- Hosting: Vercel (`vercel.json` not committed in this snapshot; framework preset implicit).
- SEO helpers: `src/lib/seo/page-metadata.ts` (`pageMetadata({ title, description, path, noindex })`).
- No `supabase/` migrations folder exists yet. No prior `docs/` folder existed before this file.
- An existing **placeholder** route at `/online-course` says "Coming soon" and links to podcast/blog. This is the page the course MVP will eventually supersede (we do **not** rip it out in Sprint 1 — see route map below).

Baseline checks at Sprint 0 (after `pnpm install --frozen-lockfile`):

- `pnpm run typecheck` — **PASS**.
- `pnpm run lint` — **PASS**.
- `pnpm run build` — **PASS** (39 routes generated; Sentry source-map upload runs in build).
- `git status` — **clean** on `feature/book-course-mvp`.

---

## 3. MVP product definition

A logged-in, manually-enrolled learner can:

1. Read a public landing page for the one bundled course.
2. Sign up / log in using the existing Supabase auth flow.
3. Once an admin manually inserts a `course_enrollments` row, access the protected course player.
4. Move through modules and lessons (text/video).
5. Take multiple-choice quizzes with an 80% pass bar, unlimited retries.
6. See lesson-level completion and a course progress percentage.
7. Earn a web-based certificate when all required lessons + quizzes are done.
8. View their certificate at `/courses/[slug]/certificate` and have anyone verify it at `/certificates/[certificateId]`.
9. See their single course in a simple `/my-learning` dashboard.

That is the entire MVP.

---

## 4. Non-goals (explicit out-of-scope)

To prevent scope creep across sprints, the following are **not** in MVP:

- Marketplace, catalog browse, search, filters.
- Multiple instructors / multi-course platform.
- Payments, cart, coupons, Stripe, pricing pages.
- Book access codes / redemption flows.
- Reviews, ratings, comments, community/forum.
- Full admin CMS / instructor dashboard / authoring UI.
- AI tutor, chat with the book, RAG.
- Drip / time-released lessons.
- Advanced analytics dashboards beyond PostHog autocapture.
- PDF certificate generation, LinkedIn share button.
- Email automation tied to course events.
- SCORM / xAPI / LMS export.
- Native mobile app.
- Course discussion threads.

If any future request touches the list above, it is a **separate** initiative — not part of `feature/book-course-mvp`.

---

## 5. Access model — Option A: Manual Enrollment

- A learner must be **logged in** (Supabase session present).
- A learner must have a row in `course_enrollments` for the course (status `active`).
- Enrollment is granted **manually** in the Supabase dashboard (admin inserts a row) — there is no self-serve enrollment endpoint in MVP.
- Logged-out users on protected routes are redirected to `/login?next=...` using the existing `getSafeRedirectPath` helper.
- Logged-in but not-enrolled users see a friendly **access-pending** screen explaining that enrollment is being processed.
- The frontend **never** uses `SUPABASE_SECRET_KEY` / service role. All access checks rely on Supabase RLS + the user's own session.

---

## 6. Route map

All routes use the App Router under `src/app/`.

| Route | Type | Auth | Sprint |
| --- | --- | --- | --- |
| `/courses/[slug]` | Server Component, public | Public; CTA adapts to session | 1 |
| `/courses/[slug]/learn/[lessonSlug]` | Server Component shell + client lesson body | Required + enrollment | 3 |
| `/courses/[slug]/certificate` | Server Component | Required + enrollment + completion | 6 |
| `/certificates/[certificateId]` | Server Component | Public (limited fields) | 6 |
| `/my-learning` | Server Component | Required | 7 |

Sprint-1 note: the existing `/online-course` "coming soon" page **stays as-is** until the course is ready for public traffic. The new flow lives under `/courses/[slug]` so nothing in `Navigation.tsx` breaks. Repointing the nav CTA from `/online-course` to `/courses/the-singapore-way` is a Sprint 8 polish task, not a Sprint 1 task.

Slug for the single course: **`the-singapore-way`** (matches the brand). One slug, one course, for the entire MVP.

---

## 7. Component plan

We reuse the existing visual system. New course-specific components will live in `src/components/course/`.

Reuse as-is:

- `PageHero` for top-of-page heroes (variant `warm` or `light`).
- `Navigation`, `Footer`, `AuthUnavailableNotice`.
- `motion/Reveal`, `motion/RevealStagger` for scroll-triggered animation.
- `ui/button`, `ui/card`, `ui/form`, `ui/input`, `ui/label`.
- `lib/seo/page-metadata` for per-page metadata.
- `lib/supabase/{client,server}` for auth + data.
- `lib/auth/{errors,redirects}` for auth UX consistency.

New components to add **only when their sprint runs** (not in Sprint 0):

- `course/CourseHero.tsx` — branded hero with book-bundle positioning. *(Sprint 1)*
- `course/CurriculumPreview.tsx` — module → lesson outline, public-safe. *(Sprint 1)*
- `course/CourseFAQ.tsx` — collapsible FAQ. *(Sprint 1)*
- `course/CourseCTA.tsx` — session-aware CTA. *(Sprint 1)*
- `course/CoursePlayerLayout.tsx` — sidebar + content shell. *(Sprint 3)*
- `course/LessonSidebar.tsx` — modules/lessons with completion ticks. *(Sprint 3–4)*
- `course/LessonNav.tsx` — previous/next. *(Sprint 3)*
- `course/AccessPending.tsx` — friendly locked state. *(Sprint 3)*
- `course/MarkCompleteButton.tsx` — client component, calls Server Action. *(Sprint 4)*
- `course/QuizRunner.tsx` — multiple-choice client component. *(Sprint 5)*
- `course/QuizResult.tsx` — score + retry. *(Sprint 5)*
- `course/CertificateView.tsx` — printable web certificate. *(Sprint 6)*
- `course/MyLearningCard.tsx` — dashboard card. *(Sprint 7)*

Every new client component will use `'use client'` only when it owns interactivity. Layouts, queries, and data fetching stay server-side.

---

## 8. Data layer plan

### 8a. Where files live

- Local typed course data (Sprint 1, pre-Supabase): `src/data/course.ts`
- Course-domain types: `src/lib/course/types.ts`
- Server-side data helpers (Sprint 2+): `src/lib/course/queries.ts` and `src/lib/course/mutations.ts` — these will use the existing `createClient()` from `src/lib/supabase/server.ts` and rely on **RLS**, not service-role.
- SQL plan: `supabase/sql/` (created in Sprint 2 if needed; the repo currently has no migration convention, so we will write plain SQL files with clear ordering and a README on how to apply them).

### 8b. Supabase schema plan (designed in Sprint 0, **not created** until Sprint 2)

All tables use `uuid` PKs (`gen_random_uuid()`), `created_at` / `updated_at` `timestamptz` defaults, and **RLS enabled** at creation.

```text
courses
  id uuid PK
  slug text unique not null
  title text not null
  subtitle text
  description text
  status text check in ('draft','published') default 'draft'
  created_at timestamptz default now()
  updated_at timestamptz default now()

course_modules
  id uuid PK
  course_id uuid FK -> courses(id) on delete cascade
  title text not null
  description text
  position int not null
  unique(course_id, position)

course_lessons
  id uuid PK
  course_id uuid FK -> courses(id) on delete cascade
  module_id uuid FK -> course_modules(id) on delete cascade
  slug text not null
  title text not null
  description text
  content_type text check in ('text','video','quiz') default 'text'
  content text                -- markdown/plain text body, null for quiz lessons
  video_url text              -- nullable
  position int not null
  is_required boolean default true
  unique(course_id, slug)

course_enrollments
  id uuid PK
  user_id uuid FK -> auth.users(id) on delete cascade
  course_id uuid FK -> courses(id) on delete cascade
  status text check in ('active','revoked') default 'active'
  enrolled_at timestamptz default now()
  unique(user_id, course_id)

lesson_progress
  id uuid PK
  user_id uuid FK -> auth.users(id) on delete cascade
  course_id uuid FK -> courses(id) on delete cascade
  lesson_id uuid FK -> course_lessons(id) on delete cascade
  completed_at timestamptz default now()
  unique(user_id, lesson_id)

quiz_questions
  id uuid PK
  course_id uuid FK -> courses(id) on delete cascade
  lesson_id uuid FK -> course_lessons(id) on delete cascade   -- MVP: quizzes live on a quiz-type lesson
  question text not null
  choices jsonb not null            -- ["A","B","C","D"]
  correct_choice int not null       -- index into choices
  explanation text                  -- nullable
  position int not null
  unique(lesson_id, position)

quiz_attempts
  id uuid PK
  user_id uuid FK -> auth.users(id) on delete cascade
  course_id uuid FK -> courses(id) on delete cascade
  lesson_id uuid FK -> course_lessons(id) on delete cascade
  score int not null            -- 0..100
  passed boolean not null
  answers jsonb not null        -- [{question_id, choice}]
  created_at timestamptz default now()

certificates
  id uuid PK                              -- this is the certificate_code shown publicly
  user_id uuid FK -> auth.users(id) on delete cascade
  course_id uuid FK -> courses(id) on delete cascade
  issued_at timestamptz default now()
  unique(user_id, course_id)
```

Notes:
- We do **not** add a `profiles` table in MVP. The learner's display name on certificates falls back to `auth.users.email` and an optional name held in Supabase Auth user metadata (set during signup if available). A separate `profiles` table can come later if needed.
- The certificate's public ID is the `certificates.id` UUID. We use the UUID as the public `certificate_code` for verification rather than a separate human-friendly code, to avoid collisions and an extra column for MVP.
- Quizzes attach to a **quiz-type lesson** (one quiz per lesson). This avoids a separate `module_id` quiz path and keeps URLs clean (`/learn/[lessonSlug]`).

### 8c. RLS policies plan

Default-deny on every table. Then:

- **courses**: `select` allowed to anyone where `status = 'published'`. No `insert/update/delete` from frontend roles.
- **course_modules / course_lessons**: `select` allowed to anyone where the parent course is `published`. Lesson **content** is read here too — MVP treats the curriculum body as non-secret marketing-adjacent content. (If we later need true content gating, we can split a `course_lesson_content` table and restrict it to enrolled users; this is called out in Risks.)
- **quiz_questions**: `select` restricted to users with an `active` enrollment on the parent course (no public reads — we do not want answer keys leaking).
- **course_enrollments**: each user can `select` their own rows. No `insert/update/delete` from the frontend. Admin grants enrollment by inserting via the Supabase dashboard or a privileged session.
- **lesson_progress**: each user can `select/insert/update/delete` their own rows, **and only when an active enrollment exists** for the same `(user_id, course_id)`. Enforced via a policy that joins `course_enrollments`.
- **quiz_attempts**: each user can `select/insert` their own rows, **and only when an active enrollment exists**. No update or delete (attempts are append-only).
- **certificates**: each user can `select` their own rows. `insert` allowed only by the user themselves and only when the completion calculation passes (we will gate creation via a Postgres function or a server-side check; see Risks). Public `select` of a single certificate by `id` is allowed but exposes only a public-safe projection — implemented either by a Postgres `security definer` function or by returning only the columns we choose in the Server Component (RLS allows the row read, the UI controls the projection).

All policies will be expressed in plain SQL under `supabase/sql/` in Sprint 2 with an `apply.md` describing how to run them against the project.

### 8d. Seed plan

One seed file: `supabase/sql/seed-the-singapore-way.sql`. Inserts:

- 1 row in `courses` (slug `the-singapore-way`, status `published`).
- N rows in `course_modules` and `course_lessons` representing the MVP curriculum (final outline to be confirmed by Maher; placeholder structure used in Sprint 1's local typed data acts as the reference).
- M rows in `quiz_questions` for the lessons whose `content_type = 'quiz'`.

Manual enrollment is documented but **not** auto-seeded — admin runs a single insert per learner.

### 8e. Server vs. client boundaries

- All Supabase reads from React Server Components use `createClient()` from `src/lib/supabase/server.ts` and `await cookies()`.
- All progress writes (`mark complete`, `submit quiz`) happen through **Server Actions** living next to the route, so the Supabase session cookie is used (RLS enforces user identity).
- The browser Supabase client is only used in client components that already exist (auth forms in `/login`, `/signup`, etc.). The course player will **not** introduce new browser-side Supabase queries.
- No `SUPABASE_SECRET_KEY` is read anywhere in the app. The blueprint does not add it to `.env.example`. If a future admin tool needs it, that lives in a separate `/admin/*` initiative outside this MVP.

---

## 9. Sprint sequence and acceptance criteria

Each sprint is a single PR-sized unit of work. The branch stays `feature/book-course-mvp` throughout. We stop and ask for explicit approval between sprints.

### Sprint 0 — Repo inspection + blueprint (this document)

- Deliverable: this file.
- Acceptance: plan committed (with explicit approval), `typecheck` / `lint` / `build` baseline captured.

### Sprint 1 — Public course landing page

- Route: `/courses/[slug]`.
- Data: `src/data/course.ts` typed local record for `the-singapore-way`.
- Sections: hero, book/course connection, what you'll learn, curriculum preview, who this is for, how the course works, quiz & certificate explanation, instructor authority, FAQ, final CTA.
- Unknown slugs → `notFound()`.
- CTA adapts to session (signed-in vs signed-out) using the existing server-side Supabase client.
- Acceptance: page renders, mobile responsive, no Supabase schema changes, `typecheck` / `lint` / `build` pass.

### Sprint 2 — Supabase schema + manual enrollment foundation

- Add `supabase/sql/0001_course_mvp.sql` (schema), `supabase/sql/0002_course_mvp_rls.sql` (RLS), and `supabase/sql/seed-the-singapore-way.sql` (seed).
- Add `supabase/sql/README.md` documenting how to apply them via the Supabase SQL editor (we do not adopt the Supabase CLI tooling in MVP unless needed).
- Add `src/lib/course/types.ts` and minimal read helpers in `src/lib/course/queries.ts` that target the published course (no writes yet).
- No UI changes that depend on Supabase data yet — the landing page can swap from local data to Supabase in Sprint 3 or stay on local data until then, whichever is cleaner.
- Acceptance: schema is reviewable; RLS is default-deny; service role is never used in app code; build still passes.

### Sprint 3 — Auth-gated course player shell

- Route: `/courses/[slug]/learn/[lessonSlug]`.
- Logged-out → redirect to `/login?next=<current>` using `getSafeRedirectPath`.
- Logged-in + not enrolled → `AccessPending` UI.
- Logged-in + enrolled → render player shell with sidebar, active lesson body, previous/next.
- Unknown course or lesson → `notFound()`.
- Reads come from Supabase via the server client. If schema/seed is not applied, the page renders a graceful "Course is being prepared" empty state instead of crashing.
- Acceptance: locked, pending, and enrolled states all reachable in dev; no client-side Supabase reads added.

### Sprint 4 — Lesson progress tracking

- Server Action `markLessonComplete(lessonId)` upserts `lesson_progress` with the user from the server session.
- Sidebar shows ticks for completed lessons; course header shows `X of Y lessons complete (Z%)`.
- Optimistic UI via React 19 `useOptimistic` only if it does not complicate the server boundary; otherwise a simple refresh after the action.
- Acceptance: refresh persists progress; only the owning user can write; build passes.

### Sprint 5 — Quiz engine MVP

- Quiz lives on a `content_type = 'quiz'` lesson.
- `QuizRunner` client component handles selection state.
- Submit goes through Server Action `submitQuizAttempt(lessonId, answers)`; server calculates score, sets `passed = score >= 80`, inserts a row into `quiz_attempts`, and on pass writes a `lesson_progress` row for the quiz lesson.
- Result screen shows score + per-question correctness; retry resets state.
- Acceptance: passing 4 of 5 questions → 80%, marked passed, lesson counted as complete; failing attempt does not mark progress; only enrolled users can submit.

### Sprint 6 — Completion logic + certificate

- Helper `isCourseComplete(courseId, userId)` checks all required lessons (`is_required = true`) have a `lesson_progress` row.
- Route `/courses/[slug]/certificate`:
  - Not complete → show outstanding requirements list.
  - Complete + no certificate → create one in a server action and render.
  - Complete + certificate exists → render.
- Route `/certificates/[certificateId]` (public): show certificate code, learner display name, course title, issued date — and nothing else. No email, no user_id, no progress detail.
- Acceptance: certificate persists across refresh; verification page works without a session; build passes.

### Sprint 7 — My Learning dashboard

- Route `/my-learning`.
- Logged-out → redirect to `/login?next=/my-learning`.
- Logged-in: show one `MyLearningCard` reflecting one of: not enrolled (access pending), enrolled not started, in progress, completed with certificate link.
- No catalog, no search, no second card.
- Acceptance: each state reachable; CTA routes correctly; build passes.

### Sprint 8 — QA, polish, hardening, launch readiness

- Full flow QA on Vercel Preview (manual).
- Repoint Navigation CTAs from `/online-course` to `/courses/the-singapore-way` if Maher approves.
- Replace the `/online-course` "coming soon" stub with a redirect (or keep both — decide here, not earlier).
- Empty/loading/error polish, mobile pass, a11y pass, copy pass.
- Final docs: how to manually enroll a user, how to seed the course, how to issue certificates manually if needed.
- Acceptance: build passes, no dead code, ready for PR review.

---

## 10. Testing plan

The repo has no `test` script and no test framework today. We will not add Vitest/Jest in MVP — adding a test framework is itself a multi-day initiative and out of scope. Verification will rely on:

1. **`pnpm run typecheck`** — strict TS catches most regressions.
2. **`pnpm run lint`** — `eslint-config-next` flags App Router footguns.
3. **`pnpm run build`** — production build proves Server/Client boundaries hold.
4. **Manual QA against the Vercel Preview** at the end of each sprint, following the per-sprint acceptance criteria. Browsers checked: Chromium desktop + iOS Safari width (responsive emulator).
5. **Manual RLS smoke test** (Sprint 2 onward): in the Supabase SQL editor, run the policy checks as an anonymous user and as a sample authenticated `auth.uid()` to confirm reads/writes behave as designed.

If automated tests become important after MVP, the right unit to add first is a Vitest + Playwright pair, isolated under `tests/` — but that is a follow-up initiative.

---

## 11. Risks and open questions

1. **Lesson content gating.** The current plan lets anyone with a `published` course read `course_lessons.content`. For a paid book companion course we probably want to gate lesson body text behind enrollment. Two options: (a) split a `course_lesson_content` table with stricter RLS, or (b) keep content public and only gate the player UI. We will pick before Sprint 2 implementation. Default position: **(b) for MVP**, because the lesson body is at most marketing-adjacent and the differentiator is structure + quizzes + certificate.
2. **Certificate creation under RLS.** Letting the user `insert` their own certificate row when "they say they are complete" is fragile. Two mitigations: (i) a Postgres `security definer` function `issue_certificate(course_id)` that re-checks completion server-side, called from a Server Action; or (ii) a policy with a `using` clause that re-verifies completion in SQL. We will implement (i) — it is the safest and clearest.
3. **Display name on certificates.** We do not have a `profiles` table. We will fall back to `auth.users.email` (server-side, never exposed publicly) and an optional `user_metadata.full_name` captured at signup. We will not add `profiles` in MVP.
4. **Vercel deploy config.** `vercel.json` is referenced in `CLAUDE.md` but is not in this snapshot. Vercel will use Next.js defaults — that is fine for this MVP. If a change later affects scripts/headers/routing we will revisit.
5. **`/online-course` stub.** It exists today and is linked from `Navigation.tsx`. We will not touch it until Sprint 8 to avoid breaking the live site mid-flight.
6. **Quiz security.** `quiz_questions.correct_choice` must never leak to the client. Quiz rendering will fetch a **projection without the correct answer** for the runner; the Server Action grading the attempt uses a separate server-only read of the full row. We will encode this in `src/lib/course/queries.ts`.
7. **Race conditions.** A learner could spam "Mark complete" or submit a quiz twice. `unique(user_id, lesson_id)` on `lesson_progress` makes the first write idempotent; quiz attempts are append-only and harmless to repeat.
8. **No automated tests.** Acknowledged. Regressions caught by typecheck + manual QA only. This is a deliberate scope trade-off for MVP speed.

---

## 12. Rollback notes

- **Per sprint:** every sprint lands one focused commit on `feature/book-course-mvp`. To roll back a sprint, `git revert <sha>` on the branch, push, the Vercel Preview rebuilds.
- **SQL rollback (Sprint 2+):** every SQL change file in `supabase/sql/` will have a sibling `*.down.sql` that drops the objects in reverse order. Because this is a brand-new schema (no existing user data on these tables), drops are safe. If learners have already started using the course, dropping `lesson_progress` / `quiz_attempts` would destroy progress — a flagged warning will live at the top of every `*.down.sql`.
- **Schema-rename late in MVP:** avoid. If a column name must change after Sprint 2, prefer adding a new column and backfilling rather than renaming.
- **Production safety:** nothing in this MVP merges to `main` until the full flow QAs green on Vercel Preview. `main` stays untouched until that gate is passed.

---

## 13. Self-review against Sprint 0 acceptance criteria

- Repo inspected (Section 2): **yes**.
- Plan reflects actual repo conventions (App Router, Tailwind v4, shadcn primitives, `@supabase/ssr`, `pageMetadata`, motion primitives): **yes**.
- Manual enrollment clearly described (Section 5, Section 8c): **yes** — no payments, no access codes.
- No marketplace / multi-course assumptions (Section 4 explicitly excludes them): **yes**.
- No admin/CMS scope added (Section 4 + Section 8e note): **yes**.
- No dependencies added (every new component uses what's already installed): **yes**.
- No production feature code added in Sprint 0 (only this file + docs folder): **yes**.
- `typecheck` / `lint` / `build` pass on baseline (Section 2): **yes**.
- `.env.local` not staged, no secrets staged (Section 2 git status was clean before Sprint 0): **verified**.
