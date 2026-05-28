# Book companion course MVP — launch QA checklist

Use this checklist to validate the MVP end-to-end before merging
`feature/book-course-mvp` to `main` and before announcing the course.

The MVP scope is locked in
[`docs/book-course-mvp-plan.md`](./book-course-mvp-plan.md). Manual enrollment
is covered in [`docs/manual-enrollment.md`](./manual-enrollment.md). The
Supabase SQL apply order lives in [`supabase/sql/README.md`](../supabase/sql/README.md).

---

## A. Pre-deployment — once per environment

Do this before pointing any real learner at the course on a given Supabase
project (local, Preview, or Production).

- [ ] Supabase project picked. Note its URL and publishable key.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` set in
      the environment's Vercel settings (or `.env.local` for local dev).
- [ ] `SUPABASE_SECRET_KEY` is **not** set on Preview or Production — frontend
      MVP never reads it. (`grep -r "SUPABASE_SECRET" src/` returns no hits.)
- [ ] `NEXT_PUBLIC_SITE_URL` set to the canonical origin for the environment
      (e.g. `https://the-singapore-way-website.vercel.app` for Production).
- [ ] Supabase Auth → URL Configuration: Site URL + Redirect URLs cover this
      environment, per [`SUPABASE_VERCEL_SETUP.md`](../SUPABASE_VERCEL_SETUP.md).
- [ ] Apply SQL in order via Supabase SQL editor:
  1. `supabase/sql/0001_course_mvp_schema.sql`
  2. `supabase/sql/0002_course_mvp_rls.sql`
  3. `supabase/sql/0003_course_mvp_functions.sql`
  4. `supabase/sql/0004_course_mvp_security_hardening.sql` — **required**
     Codex hardening pass. Without this, quiz answer keys are readable to
     enrolled users, lesson bodies are readable to anon, and quiz attempts
     can be forged by a direct insert.
  5. `supabase/sql/seed-the-singapore-way.sql`
- [ ] Run the RLS smoke tests from `supabase/sql/README.md` and confirm the
      expected row counts as `anon`.
- [ ] As `anon`, confirm `select * from public.quiz_questions` returns
      **zero rows** (answer keys are not public).
- [ ] As `anon`, confirm `select * from public.course_lessons` returns
      **zero rows** (lesson bodies are not public).
- [ ] As `anon`, confirm
      `select * from public.get_published_curriculum('the-singapore-way')`
      returns 12 rows with NO `content` or `video_url` column.
- [ ] As an authenticated enrolled user, confirm a direct
      `insert into public.quiz_attempts (..., passed) values (..., true)`
      FAILS with an RLS error.
- [ ] As an authenticated enrolled user, confirm a direct
      `insert into public.lesson_progress (...)` FAILS with an RLS error.
- [ ] As an authenticated enrolled user, confirm
      `select * from public.get_enrolled_quiz_questions('the-singapore-way',
      'foundations-quiz')` returns 5 rows that do NOT include
      `correct_choice`.

## B. Manual enrollment — once per learner

- [ ] Learner has signed up via `/signup` and confirmed their email.
      `auth.users` shows their row with `email_confirmed_at` set.
- [ ] Run the grant statement from
      [`docs/manual-enrollment.md`](./manual-enrollment.md) with the learner's
      exact email. Confirm exactly one row is returned.
- [ ] Tell the learner they can sign in and start.

## C. End-to-end flow QA — once per environment, every release

Run this script against the Vercel Preview after every PR that touches course
code, and once more on Production after merge.

### C.1 Logged-out visitor

- [ ] Open `/` in a private/incognito window. Homepage renders. No console
      errors. No 4xx in network panel.
- [ ] Open `/courses/the-singapore-way`. The branded landing page renders with
      all 10 sections (hero, book/course connection, what you'll learn,
      curriculum preview, who this is for, how it works, quiz + certificate,
      instructor authority, FAQ, final CTA).
- [ ] Hero primary CTA reads "Sign up to start" and links to
      `/signup?next=/courses/the-singapore-way/learn/welcome`.
- [ ] Open `/courses/the-singapore-way/learn/welcome` directly. It redirects
      to `/login?next=...`.
- [ ] Open `/my-learning` directly. It redirects to
      `/login?next=/my-learning`.
- [ ] Open `/courses/the-singapore-way/certificate` directly. It redirects to
      `/login?next=...`.

### C.2 Signup + login

- [ ] `/login` and `/signup` render. The Sign in / Create account forms work.
- [ ] Sign up from the landing page CTA. After signup (with auto-sign-in), the
      success view's "Continue" button routes to the lesson the learner asked
      for in `?next=` (not to `/account`).
- [ ] `/account` shows the signed-in email and a prominent "Go to My Learning"
      button.

### C.3 Logged-in, not yet enrolled

- [ ] Open `/my-learning`. The single card shows "Access pending" with a
      "Contact our team" CTA. No course progress is displayed.
- [ ] Open `/courses/the-singapore-way/learn/welcome`. The friendly
      "Access pending" screen renders, with the signed-in email confirmed
      and a "Contact our team" mailto link.
- [ ] Open `/courses/the-singapore-way/certificate`. The "Certificate
      pending" screen renders with a progress bar at 0%.

### C.4 Manually enrolled, fresh start

After running the grant statement from `docs/manual-enrollment.md`:

- [ ] `/my-learning` now shows the course with a "Not started" badge and a
      "Start course" CTA pointing at the first lesson (`/learn/welcome`).
- [ ] Click "Start course". The player renders with the curriculum sidebar,
      the lesson title and body, and a "Mark lesson complete" button.
- [ ] The sidebar shows numbered lesson rows; the current lesson is
      highlighted in brand red.
- [ ] Previous/next navigation at the bottom of each lesson routes correctly.

### C.5 Lesson progress

- [ ] Click "Mark lesson complete" on the first lesson. The button flips to a
      green "Lesson completed" badge with a "Continue to next lesson" CTA.
- [ ] Sidebar checkmark appears for the completed lesson. Progress bar
      updates (1 / 12 ≈ 8%).
- [ ] Refresh the page. The checkmark and the "Lesson completed" state
      persist.
- [ ] Mark a few more text lessons complete. Progress updates monotonically.

### C.6 Quizzes

- [ ] Navigate to "Foundations check" (or any quiz lesson). The QuizRunner
      renders with five questions, label-wrapped radios, and a disabled
      Submit button.
- [ ] Answer some but not all questions. Submit stays disabled with helper
      text.
- [ ] Open DevTools → Network. Submit the form. Observe the Server Action
      request payload — confirm `answers` is `{ questionId: choiceIndex }` and
      **no `correct_choice` is anywhere in the response.**
- [ ] Open DevTools → Sources / Application → JS bundles. Search for
      `correct_choice`. **No result** — the answer key never reaches the
      browser.
- [ ] Submit with deliberately wrong answers (score 0%). Result panel shows a
      "Not passed yet" state with the 80% threshold explanation and a "Try
      again" CTA.
- [ ] Click "Try again". The form resets; you can re-answer.
- [ ] Submit with all correct answers (score 100%). Result panel shows
      "Quiz passed" with a "Continue to next lesson" CTA.
- [ ] Refresh the quiz page. The "Quiz passed" banner shows the score from
      your latest passing attempt.
- [ ] Sidebar checkmark appears for the quiz lesson. Progress bar increments.
- [ ] Retake the quiz and deliberately fail. The passed banner survives — a
      failing retake does not invalidate the prior pass.

### C.7 Completion and certificate

- [ ] Complete every required lesson + pass every required quiz. Progress bar
      reaches 100%.
- [ ] The sidebar now shows a green "Get your certificate" link.
- [ ] Click it. `/courses/the-singapore-way/certificate` renders the branded
      CertificateView with the learner display name, the course title, the
      issued date (today), and a UUID certificate code.
- [ ] Refresh the page. Same certificate is shown (idempotent).
- [ ] Copy the verify URL from the cert page. Open in a private window —
      `/certificates/<id>` renders the public verification view with a
      "Verified" badge.
- [ ] On the public verify page, open DevTools → Network. Confirm the only
      visible fields are id, course title, learner display name, issued date.
      No `user_id`, no `email`, no progress detail.
- [ ] When the test learner has no `full_name` in `auth.users.raw_user_meta_data`,
      confirm the public verify page shows "Verified learner" — never the
      email local-part.
- [ ] Edit the URL to use a random UUID (e.g. `00000000-0000-0000-0000-...`).
      The "Couldn't verify" card renders.
- [ ] Edit the URL to use a malformed id (e.g. `abc`). Same "Couldn't verify"
      card — no RPC was issued, validated by the absence of a Supabase RPC
      request in the network panel.

### C.8 My Learning, completed state

- [ ] `/my-learning` now shows a green "Completed" badge, the progress bar at
      100%, "View certificate" as the primary CTA, and "Revisit course" as
      the secondary CTA.
- [ ] Click "Revisit course". Course landing page loads with the hero CTA
      now reading "Start the course" (because you're signed in and enrolled).
- [ ] Re-enter the player. Sidebar shows all lessons checked.

### C.9 Revoked enrollment

- [ ] In Supabase SQL editor, set the learner's enrollment status to
      `revoked` (see `docs/manual-enrollment.md`).
- [ ] `/my-learning` now shows an "Access paused" card with a contact CTA.
- [ ] `/courses/the-singapore-way/learn/welcome` shows the AccessPending
      view with `variant='revoked'` copy.
- [ ] In Supabase, try to insert into `lesson_progress` as the learner —
      RLS denies it. (Optional, only if you want to spot-check defense in
      depth.)
- [ ] Restore status to `active`. Player returns to normal.

### C.10 Auth-unavailable degradation

If Supabase env vars are intentionally unset on an environment (e.g. a quick
sanity build):

- [ ] `/login`, `/signup`, `/account`, `/my-learning`, `/courses/[slug]/learn/[lesson]`,
      and `/courses/[slug]/certificate` all show the
      `AuthUnavailableNotice` instead of crashing.
- [ ] `/courses/the-singapore-way` (public landing) still renders, with a
      generic CTA (not session-aware).

## D. Cross-device + accessibility spot checks

- [ ] Open the player at 375 × 667 (iPhone SE-ish). Lesson content stacks
      above the curriculum. Mark Complete button is reachable.
- [ ] Open the certificate page at 375 px wide. Logo, name, course title,
      date, and code all wrap or scale cleanly.
- [ ] Tab through the player and the QuizRunner. Focus moves through every
      interactive element with a visible focus ring.
- [ ] In a screen reader (VoiceOver / NVDA), the progress bar announces its
      percent. The QuizRunner announces the result via `aria-live="polite"`.
- [ ] Lighthouse: Performance, Accessibility, Best Practices, and SEO all at
      90+ for `/`, `/thebook`, `/courses/the-singapore-way`. (Player and cert
      pages are noindex; SEO score is less load-bearing there.)

## E. Pre-merge hygiene

- [ ] `pnpm run typecheck` passes.
- [ ] `pnpm run lint` passes.
- [ ] `pnpm run build` passes.
- [ ] `git status` is clean of unintended files.
- [ ] `git diff main...HEAD --name-only` shows only intended files.
- [ ] `.env.local` is **not** in the diff. `git ls-files | grep .env` returns
      only `.env.example`.
- [ ] No `console.log` / `console.warn` / `TODO` introduced.
      (`grep -rn "TODO\|FIXME\|console\." src/` returns no hits.)
- [ ] No `service_role` references in `src/`.
- [ ] CI is green on the PR's latest commit (GitHub Actions, if configured).
- [ ] Vercel Preview deploy is green and accessible.

## F. Post-merge

- [ ] Production deploy is green.
- [ ] Smoke check the Production URL: hero loads, sign-in works, an existing
      enrolled test account can reach `/my-learning`.
- [ ] Pin the SQL apply commit hash in the team Notion / wherever, so the
      next person who points a new Supabase project at this repo knows the
      order.

If any item fails, do **not** merge until the failure is either fixed or
explicitly accepted in the PR thread.
