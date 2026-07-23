# Course MVP — operator setup and launch checklist

Single source of truth for taking the book companion course MVP from a fresh
Supabase project all the way to Production. Replaces the earlier
`docs/launch-qa-checklist.md` and `docs/manual-enrollment.md` (both removed —
manual enrollment is gone; the access model is now sign-in only).

If anything in this checklist conflicts with the code, the code wins. Open a
PR to fix this doc.

---

## 0. Access model in one paragraph

Public visitors can read the course landing page and the safe public
curriculum preview (no lesson bodies, no quiz questions). **Any signed-in
user** can open the player, read lesson bodies, take quizzes, save progress,
and earn a certificate. There is no `course_enrollments` lookup in the
runtime path. Quiz grading is server-side via a `SECURITY DEFINER` RPC.
Lesson-completion writes are server-side via a `SECURITY DEFINER` RPC.
Certificate issuance is server-side via a `SECURITY DEFINER` RPC that
re-verifies completion. Public certificate verification exposes only id,
course title, learner display name (or "Verified learner" fallback), and
issued date — never an email.

---

## 1. Supabase setup (per environment)

Do this once per Supabase project that will back the course (local, Preview,
Production).

- [ ] Pick or create the Supabase project. Note the project URL and the
      publishable key.
- [ ] Set the two browser-safe env vars where the app runs:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] **Do not** set `SUPABASE_SECRET_KEY` / `sb_secret_*` on Preview or
      Production. The app never reads it.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the canonical origin for the environment.
- [ ] In Supabase → Authentication → URL Configuration, configure Site URL and
      Redirect URLs per [`SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md).

---

## 2. SQL apply order

### 2a. Fresh project (recommended path)

Run these in the Supabase dashboard → **SQL Editor**, one file at a time, in
order. **Skip 0004 entirely** — it failed at a SQL syntax issue (see §9) and
is superseded by 0005.

1. [`supabase/sql/0001_course_mvp_schema.sql`](../supabase/sql/0001_course_mvp_schema.sql)
2. [`supabase/sql/0002_course_mvp_rls.sql`](../supabase/sql/0002_course_mvp_rls.sql)
3. [`supabase/sql/0003_course_mvp_functions.sql`](../supabase/sql/0003_course_mvp_functions.sql)
4. **Skip 0004.**
5. [`supabase/sql/0005_course_mvp_open_access_sample.sql`](../supabase/sql/0005_course_mvp_open_access_sample.sql)
6. [`supabase/sql/seed-the-singapore-way.sql`](../supabase/sql/seed-the-singapore-way.sql)
7. [`supabase/sql/0007_certificate_name_gate_and_cleanup.sql`](../supabase/sql/0007_certificate_name_gate_and_cleanup.sql)
   — required: adds the certificate full-name gate (and, on older projects,
   removes sample-era certificates not backed by current-curriculum
   completion; a no-op on a fresh project).
8. [`supabase/sql/0008_certificate_public_name_gate.sql`](../supabase/sql/0008_certificate_public_name_gate.sql)
   — required: name gate before the existing-certificate return, and public
   verification returns no row for blank/generic-name certificates.

### 2b. If 0004 was partially or fully applied

`0005` is idempotent and self-repairs. Just run `0005` and then the seed.
You do not need to revert 0004 first.

### 2b-bis. Project seeded BEFORE S13 (old 4-module sample course)

The seed is insert-only — re-running it on an existing course is a no-op.
To replace the sample content with the final S13 course, run
[`supabase/sql/0006_course_final_content.sql`](../supabase/sql/0006_course_final_content.sql)
once. Before running it, do the read-only preflight (counts of
`lesson_progress`, `quiz_attempts`, `certificates` for the course): 0006 is
**Path A** — it deletes this course's progress and attempts (certificates
are preserved) — and is only safe when that history is disposable test data.
The owner confirmed exactly that on 2026-07-23 (17 / 5 / 1). Verification
queries are appended as comments at the end of the 0006 file; expected
results: 16 video / 5 quiz / 21 required lessons, 25 questions. After 0006,
run `0007_certificate_name_gate_and_cleanup.sql` (step 7 above) — it removes
any preserved sample-era certificate that is no longer backed by completion
of the final curriculum.

### 2c. What NOT to run

- **Do not** run any file under `supabase/sql/*.down.sql` unless you are
  deliberately rolling back. Those files exist to make rollbacks possible
  for auditors and tooling — they are destructive. Reading a `.down.sql`
  by mistake is harmless; pasting one into the SQL editor is not.
- **Do not** run `0004_course_mvp_security_hardening.sql`. It is kept in the
  repo as historical record. `0005` supersedes it.

---

## 3. Confirm SQL applied (smoke tests)

Run in the Supabase SQL Editor. These should match the expected results
exactly; anything else is a problem.

### 3a. As `anon`

```sql
set role anon;

-- Published course is publicly listable.
select count(*) from public.courses where slug = 'the-singapore-way';
-- expect: 1

-- Public curriculum projection works. 21 lessons (16 video + 5 quiz), no
-- content/video_url columns in the result.
select count(*) from public.get_published_curriculum('the-singapore-way');
-- expect: 21

-- The raw lessons table is NOT readable. Either zero rows or a policy error.
select count(*) from public.course_lessons;
-- expect: 0

-- The raw quiz_questions table is NOT readable.
select count(*) from public.quiz_questions;
-- expect: 0

-- Progress / attempts / certificates / enrollments are not public.
select count(*) from public.lesson_progress;     -- expect: 0
select count(*) from public.quiz_attempts;       -- expect: 0
select count(*) from public.certificates;        -- expect: 0
select count(*) from public.course_enrollments;  -- expect: 0

reset role;
```

### 3b. As a signed-in user

You can either sign in to the app and watch the network panel, or use the
Supabase SQL Editor to simulate an authenticated session:

```sql
begin;
select set_config('request.jwt.claims',
  json_build_object('sub', '00000000-0000-0000-0000-000000000000', 'role', 'authenticated')::text,
  true);
set local role authenticated;

-- Signed-in lesson body works.
select * from public.get_signed_in_lesson_body('the-singapore-way', 'start-here');
-- expect: 1 row with content set and video_url = 'https://youtu.be/tVoscHU9Qas'

-- Quiz questions are readable WITHOUT correct_choice.
select count(*) from public.get_signed_in_quiz_questions('the-singapore-way', 'purpose-constraints-pragmatism-quiz');
-- expect: 5
-- and the result columns are: id, question, choices, question_position

-- Direct quiz_attempts inserts are NOT permitted. Forging a passing attempt
-- fails with an RLS error.
insert into public.quiz_attempts (user_id, course_id, lesson_id, score, passed, answers)
values (auth.uid(),
        (select id from public.courses where slug = 'the-singapore-way'),
        (select id from public.course_lessons where slug = 'purpose-constraints-pragmatism-quiz'),
        100, true, '{}'::jsonb);
-- expect: ERROR: new row violates row-level security policy for table "quiz_attempts"

-- Direct lesson_progress inserts are NOT permitted.
insert into public.lesson_progress (user_id, course_id, lesson_id)
values (auth.uid(),
        (select id from public.courses where slug = 'the-singapore-way'),
        (select id from public.course_lessons where slug = 'start-here'));
-- expect: ERROR

rollback;
```

If any of the "expect: ERROR" inserts actually succeed, stop and reapply 0005
before continuing.

---

## 4. Confirm the seeded course

Already done by step 6 of §2a. Confirm:

```sql
select slug, title, status from public.courses where slug = 'the-singapore-way';
-- expect: ('the-singapore-way', 'The Singapore Way Online Course', 'published')

select count(*) as modules from public.course_modules;         -- expect: 5
select count(*) as lessons from public.course_lessons;         -- expect: 21
select count(*) as questions from public.quiz_questions;       -- expect: 25

-- Lesson-type audit. Sixteen video lessons; five required quizzes. There are
-- no text-type lessons in the current course.
select l.content_type, count(*) as lesson_count
from public.course_lessons l
join public.courses c on c.id = l.course_id
where c.slug = 'the-singapore-way'
group by l.content_type
order by l.content_type;
-- expect:
--   quiz  | 5
--   video | 16
```

If the counts show the old sample shape (4 / 12 / 15), the project predates
S13 — apply `0006_course_final_content.sql` per §2b-bis, then 0007.

Re-runs of the seed are no-ops once the slug exists.

---

## 5. Local testing checklist

Before pushing, run on the dev server:

- [ ] `pnpm install --frozen-lockfile`
- [ ] `pnpm run typecheck` — must pass.
- [ ] `pnpm run lint` — must pass.
- [ ] `pnpm run build` — must pass cleanly.
- [ ] `pnpm run dev`, then:
  - [ ] **Public** `/courses/the-singapore-way` renders. CTA says
        "Sign in to start course" (logged-out).
  - [ ] Clicking it sends you to `/login?next=...`.
  - [ ] Sign up via `/signup`. After auto-sign-in the "Continue" button
        routes to the lesson you requested (not to `/account`).
  - [ ] `/my-learning` shows the course with "Not started".
  - [ ] Open the first lesson (`start-here`). The player renders the YouTube
        embed (`youtube-nocookie.com` iframe, no autoplay) with the lesson
        notes below. Mark complete works. Sidebar checkmark appears.
  - [ ] Spot-check several other video lessons. Each plays its own approved
        tracker video with Lesson notes underneath; no console CSP errors.
  - [ ] Open a quiz lesson. Submit deliberately wrong answers — result panel
        shows "Not passed yet" and explains the 80% threshold.
  - [ ] Retry with all correct — result shows "Quiz passed". Sidebar
        checkmark appears.
  - [ ] DevTools → Sources: search the JS bundle for `correct_choice`. **No
        result.**
  - [ ] DevTools → Network: confirm `submit_quiz_attempt` RPC payload
        contains `answers` only. Response contains `score`, `passed`,
        `total`, `correct` — no `correct_choice`.
  - [ ] Complete every required item. Sidebar shows a "Get your certificate"
        link.
  - [ ] With NO `full_name` on the test account: the cert page shows the
        "Add your name to receive your certificate" step — no certificate,
        no Print button. Submitting "Learner" is rejected with an
        explanation; a real name is accepted.
  - [ ] After saving a real name: the cert page auto-issues + shows the
        branded view + a verify URL + the Print button.
  - [ ] Open the verify URL in a private window — shows the "Verified
        certificate" badge and ONLY id, course title, learner display name,
        issued date.
  - [ ] Generic-name certificates are never publicly displayed: since 0008,
        `get_public_certificate` returns no row when the owner's stored name
        is blank or generic, so such a URL renders the not-found state (an
        email-like string is never shown in any case).
- [ ] Sign out → `/my-learning` and `/courses/.../learn/...` redirect to
      `/login?next=...`.
- [ ] `git status` shows nothing unexpected — no `.env.local`, no
      `.pnpm-store/`, no `.next/`, no `tsconfig.tsbuildinfo`.

---

## 6. Vercel Preview checklist

- [ ] PR opened against `main`.
- [ ] CI is green.
- [ ] Vercel Preview deploy is green.
- [ ] In Vercel project settings → Environment Variables → Preview:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` set.
  - [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` set.
  - [ ] No `SUPABASE_SECRET_KEY` / `sb_secret_*`.
- [ ] Supabase Auth → URL Configuration covers the preview wildcard per
      [`SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md).
- [ ] Run the local testing checklist (§5) against the Preview URL.
- [ ] Lighthouse on `/` and `/courses/the-singapore-way` — Performance,
      Accessibility, Best Practices, SEO all ≥ 90.

---

## 7. Production checklist

- [ ] Merge to `main`. Vercel auto-deploys Production.
- [ ] Production deploy is green.
- [ ] Run the §3 SQL smoke tests against the Production Supabase project.
- [ ] Sign in on Production as a test learner, complete a quick run-through
      of the §5 client-side checks (no need to repeat every step — focus
      on quiz submission and certificate verification).
- [ ] Note the SQL commit hash applied + the date in a shared place (Notion,
      runbook).
- [ ] If you swap content later, follow
      [`docs/update-course-content.md`](./update-course-content.md).

---

## 8. Rollback checklist

If you have to roll back:

- **Code:** revert the offending commit on `main` and let Vercel redeploy.
- **SQL (open-access RPCs introduced by 0005):**
  1. (Optional) Reset the seed:
     ```sql
     delete from public.courses where slug = 'the-singapore-way';
     ```
     This cascades through modules, lessons, attempts, progress, certs.
  2. Run [`supabase/sql/0005_course_mvp_open_access_sample.down.sql`](../supabase/sql/0005_course_mvp_open_access_sample.down.sql).
     This drops the sign-in-only RPCs. The app will then degrade gracefully
     (the player falls through to "course is being prepared" empty states).
  3. If you need to roll back further, re-apply
     `0003_course_mvp_functions.sql` to restore the pre-0005 function
     bodies, then `0002_course_mvp_rls.sql` to restore the previous RLS
     posture. **Be aware**: the 0002 posture leaks `correct_choice` to
     enrolled users and lesson bodies to anon — only roll back to 0002 if
     you are immediately re-applying a different forward fix on top.

---

## 9. Troubleshooting

### `ERROR: 42601: syntax error at or near "position"`

This is the error that broke 0004. PostgreSQL treats `position` as a
context-sensitive keyword, and `RETURNS TABLE (... position int ...)` parsed
ambiguously. Fixed in 0005 by renaming the return column to
`question_position`. The app maps it back to `position` in
`getQuizQuestionsForLesson` so the rest of the codebase keeps a single
field name.

**If you see this on a fresh project:** you accidentally pasted
`0004_course_mvp_security_hardening.sql`. Skip 0004 and run 0005 instead.

### `permission denied for table quiz_questions` from the app

The app calls the safe RPCs, not the raw table. If you see this error in
the browser network tab, something is calling `.from('quiz_questions')`
directly. Search the codebase — that path was deliberately removed in 0005.

### "Course not complete" when issuing certificate

Either the learner genuinely hasn't completed every required lesson and
quiz, or the seed's required flags don't match what the app thinks. Check:

```sql
select slug, content_type, is_required from public.course_lessons
where course_id = (select id from public.courses where slug = 'the-singapore-way')
order by position;
```

All 21 should show `is_required = true` in the seeded course.

### Public verify shows the not-found state for an issued certificate

Since 0008, public verification deliberately returns nothing while the
certificate owner's stored `full_name` is blank or a generic fallback — a
generic-name credential is never publicly displayed. The learner fixes this
themselves via the certificate page's name step (or the owner sets
`raw_user_meta_data.full_name` on the relevant `auth.users` row); the
existing certificate then verifies normally, unchanged.

---

## 10. Verification commands (CI parity)

Always run before considering the branch ready:

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
git status
```

Also:

```powershell
git ls-files | Select-String "\.env"
# expect: only ".env.example"

git status --short
# expect: nothing of yours that shouldn't be there
```

Never stage `.env.local`, `.pnpm-store/`, `.next/`,
`tsconfig.tsbuildinfo`, or any secret-bearing file.
