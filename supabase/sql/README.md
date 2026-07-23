# Supabase SQL — course MVP

This folder holds the SQL that backs the book companion course.

The repo does **not** use the Supabase CLI / migrations workflow. These files
are applied by hand via the Supabase dashboard **SQL editor**, in the order
listed below.

Operator runbook for setup / launch / rollback:
[`docs/course-setup-and-launch-checklist.md`](../../docs/course-setup-and-launch-checklist.md).

Content edit guide:
[`docs/update-course-content.md`](../../docs/update-course-content.md).

---

## Access model (current)

**Sign-in only.** Public visitors can read the course landing page and the
safe public curriculum preview (titles only — no lesson bodies, no quiz
questions, no answer keys). Any signed-in user can:

- read lesson bodies (text + video metadata) via the `get_signed_in_lesson_body` RPC;
- read quiz questions (without `correct_choice`) via the
  `get_signed_in_quiz_questions` RPC;
- mark non-quiz lessons complete via the `mark_lesson_complete` RPC;
- take a quiz via the `submit_quiz_attempt` RPC (server-side grading);
- read their own progress and certificate rows under RLS;
- earn a certificate via the `issue_certificate` RPC after completion —
  issuance additionally requires a meaningful full name on the auth record
  (the 0007 name gate).

Public certificate verification goes through `get_public_certificate`. It
returns only id / course title / learner display name / issued date — and,
since 0008, returns **no row at all** while the certificate owner's stored
full name is blank or a generic fallback, so a generic-name credential is
never publicly displayed. The "Verified learner" coalesce remains in the
projection purely as defense-in-depth; the email local-part is never used.

There is no manual-enrollment step. The `course_enrollments` table is kept
in the schema for possible future use but is **not** consulted by any
runtime path.

---

## Apply order

Run these in the Supabase dashboard → **SQL Editor** → New query → paste →
Run, one file at a time, top to bottom:

1. [`0001_course_mvp_schema.sql`](./0001_course_mvp_schema.sql) — tables, indexes,
   `updated_at` trigger.
2. [`0002_course_mvp_rls.sql`](./0002_course_mvp_rls.sql) — enables RLS on every
   table and adds owner-side policies. (Some of these policies are *dropped*
   again by 0005 — that is intentional.)
3. [`0003_course_mvp_functions.sql`](./0003_course_mvp_functions.sql) —
   first version of `issue_certificate()` and `get_public_certificate()`.
   Both are replaced by 0005 below.
4. **SKIP `0004_course_mvp_security_hardening.sql`.** It is kept in the repo
   as a historical record but it fails to apply because of a SQL
   reserved-word issue (`ERROR: 42601: syntax error at or near "position"`).
   `0005` supersedes it and includes the fix.
5. [`0005_course_mvp_open_access_sample.sql`](./0005_course_mvp_open_access_sample.sql)
   — **required**. Drops the unsafe SELECT/INSERT policies that 0002 added,
   adds the five `SECURITY DEFINER` RPCs the app uses
   (`get_published_curriculum`, `get_signed_in_lesson_body`,
   `get_signed_in_quiz_questions`, `submit_quiz_attempt`,
   `mark_lesson_complete`), replaces `issue_certificate()` with the hardened
   body, and replaces `get_public_certificate()` with the privacy-safe
   fallback. Idempotent — safe to re-run, including on a project where 0004
   partially applied.
6. [`seed-the-singapore-way.sql`](./seed-the-singapore-way.sql) — the single
   bundled course, final S13 content: 5 modules, 16 required video lessons
   with the approved tracker YouTube URLs, 5 quiz lessons of 5 questions
   each, 80% pass threshold. Idempotent on the `the-singapore-way` slug —
   it inserts only when the course does not exist yet.
7. [`0006_course_final_content.sql`](./0006_course_final_content.sql) —
   **only for projects seeded before S13** (i.e. with the old 4-module
   sample course). Replaces the sample content with the final course inside
   one transaction, scoped to the `the-singapore-way` course. Destructive
   for that course's `lesson_progress` and `quiz_attempts` (Path A of the
   S13 runbook — owner-confirmed test data); certificates are preserved.
   A fresh project seeded at step 6 must NOT run this file — the seed
   already contains the final content.
8. [`0007_certificate_name_gate_and_cleanup.sql`](./0007_certificate_name_gate_and_cleanup.sql)
   — **required on every project.** Replaces `issue_certificate` with the
   full-name-gated version and removes any certificate for this course not
   backed by completion of the current curriculum (on an older project that
   ran 0006, that is the preserved sample-era test certificate; on a fresh
   project the cleanup is a no-op).
9. [`0008_certificate_public_name_gate.sql`](./0008_certificate_public_name_gate.sql)
   — **required on every project.** Moves the name gate before the
   existing-certificate return in `issue_certificate`, and makes
   `get_public_certificate` return no row for blank/generic-name owners so
   such a certificate is never publicly displayed.

After the seed, 0007, and 0008 (plus 0006 on an older project), the course
is queryable as anon (curriculum metadata only) and as any signed-in user
(full player + quizzes + progress + certificate).

---

## Rollback order

Down files are destructive. Only run when explicitly rolling back.

00. If 0008 was applied:
   [`0008_certificate_public_name_gate.down.sql`](./0008_certificate_public_name_gate.down.sql)
   — restores the 0007 `issue_certificate` and 0005 `get_public_certificate`
   bodies. No data change either way.
0. If 0007 was applied:
   [`0007_certificate_name_gate_and_cleanup.down.sql`](./0007_certificate_name_gate_and_cleanup.down.sql)
   — restores the ungated 0005 `issue_certificate` body. Certificate rows
   deleted by 0007's cleanup are NOT restored.
1. If 0006 was applied:
   [`0006_course_final_content.down.sql`](./0006_course_final_content.down.sql)
   — restores the pre-S13 SAMPLE course content shape. It cannot restore
   learner history deleted by 0006, and it destroys any progress earned on
   the final course. Prefer a forward fix once real learners exist.
2. Drop the seed (optional):
   ```sql
   delete from public.courses where slug = 'the-singapore-way';
   ```
3. [`0005_course_mvp_open_access_sample.down.sql`](./0005_course_mvp_open_access_sample.down.sql)
   — drops the sign-in-only RPCs. Does NOT recreate the unsafe policies
   from 0002. If you need the pre-0005 RLS posture (which Codex flagged as
   broken), re-apply `0002_course_mvp_rls.sql` then
   `0003_course_mvp_functions.sql`.
4. [`0003_course_mvp_functions.down.sql`](./0003_course_mvp_functions.down.sql)
5. [`0002_course_mvp_rls.down.sql`](./0002_course_mvp_rls.down.sql)
6. [`0001_course_mvp_schema.down.sql`](./0001_course_mvp_schema.down.sql)

Files marked `.down.sql` are exclusively rollback tools. **Do not paste a
`.down.sql` file into the SQL editor unless you are rolling back.**

---

## Smoke tests

The full smoke-test suite (anon, signed-in, forged-insert attempts,
verification projection) lives in
[`docs/course-setup-and-launch-checklist.md`](../../docs/course-setup-and-launch-checklist.md)
§3.

Minimum quick check after applying 0005 + the seed (or 0006):

```sql
-- As anon:
set role anon;
select count(*) from public.get_published_curriculum('the-singapore-way');  -- 21
select count(*) from public.course_lessons;                                 -- 0 (no policy)
select count(*) from public.quiz_questions;                                 -- 0 (no policy)
reset role;
```

Post-0006 content verification queries (16 video / 5 quiz / 21 required, 25
questions, per-lesson URL mapping, certificate preservation) are appended as
comments at the end of
[`0006_course_final_content.sql`](./0006_course_final_content.sql).

If any of those return unexpected counts, stop and re-apply 0005.

---

## Where the app reads / writes this schema

| Path | RPC / table | Notes |
| --- | --- | --- |
| `/courses/[slug]` (landing) | `get_published_curriculum()` | Curriculum metadata only — no content / video_url. |
| `/courses/[slug]/learn/[lessonSlug]` (player) | `get_published_curriculum()`, `get_signed_in_lesson_body()`, `lesson_progress` (owner read) | Sign-in only. |
| `QuizRunner` (quiz lessons) | `get_signed_in_quiz_questions()` | Returns `id, question, choices, question_position` only. `correct_choice` is never returned. |
| Server action `markLessonComplete` | `mark_lesson_complete()` | Server is the only writer to `lesson_progress`. Quiz lessons rejected. |
| Server action `submitQuizAttempt` | `submit_quiz_attempt()` | Server-side grading. Server is the only writer to `quiz_attempts`. |
| `/courses/[slug]/certificate` | `issue_certificate()`, `certificates` (owner read) | RPC re-verifies completion. |
| `/certificates/[id]` (public verify) | `get_public_certificate()` | id / course title / display name / issued date. Display name falls back to "Verified learner". |
| `/my-learning` | `lesson_progress`, `certificates` (owner reads) | Sign-in only. |

No app path uses `service_role`. Every read and write goes through the
user's own session under RLS, or a `SECURITY DEFINER` RPC the user is
granted `execute` on.

---

## File index

| File | Purpose |
| --- | --- |
| `0001_course_mvp_schema.sql` | Tables, indexes, `updated_at` trigger. Up. |
| `0001_course_mvp_schema.down.sql` | Drops the tables. Destructive rollback. |
| `0002_course_mvp_rls.sql` | First RLS pass. Up. |
| `0002_course_mvp_rls.down.sql` | Removes the RLS policies. Rollback. |
| `0003_course_mvp_functions.sql` | First version of certificate functions. Up. |
| `0003_course_mvp_functions.down.sql` | Drops those functions. Rollback. |
| `0004_course_mvp_security_hardening.sql` | **Do not run.** Historical record of the failed hardening migration. |
| `0004_course_mvp_security_hardening.down.sql` | **Do not run.** |
| `0005_course_mvp_open_access_sample.sql` | Sign-in-only model + 0004 repair + position keyword fix. Up. |
| `0005_course_mvp_open_access_sample.down.sql` | Drops the sign-in RPCs. Rollback. |
| `0006_course_final_content.sql` | S13: replaces the sample content with the final course (5 modules / 16 videos / 5 quizzes / 25 questions). Destructive for this course's progress + attempts (Path A); preserves certificates. Up. |
| `0006_course_final_content.down.sql` | Restores the pre-S13 sample content shape. Cannot restore deleted learner history. Destructive rollback. |
| `0007_certificate_name_gate_and_cleanup.sql` | S13 review fixes: full-name gate in `issue_certificate` + removal of certificates not backed by current-curriculum completion. Up. |
| `0007_certificate_name_gate_and_cleanup.down.sql` | Restores the ungated 0005 function body. Cannot restore deleted certificates. Rollback. |
| `0008_certificate_public_name_gate.sql` | Name gate before the existing-cert return + public verification hides blank/generic-name certificates. Up. |
| `0008_certificate_public_name_gate.down.sql` | Restores the 0007 `issue_certificate` and 0005 `get_public_certificate` bodies. Rollback. |
| `seed-the-singapore-way.sql` | Idempotent final-course seed (content identical to the 0006 rebuild body). Up. |
| `README.md` | This file. |
