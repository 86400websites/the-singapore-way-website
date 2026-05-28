# Supabase SQL — course MVP

This folder holds the SQL that backs the book companion course.

The repo does **not** use the Supabase CLI / migrations workflow. These files
are applied by hand via the Supabase dashboard **SQL editor**, in the order
listed below. Each up file has a paired `*.down.sql` for rollback. The whole
stack is brand-new — applying it on a fresh project is safe; dropping it
destroys all course progress.

Working source of truth for design rationale:
[`docs/book-course-mvp-plan.md`](../../docs/book-course-mvp-plan.md).

---

## Apply order

Run these in the Supabase dashboard → **SQL Editor** → New query → paste →
Run, one file at a time, top to bottom:

1. [`0001_course_mvp_schema.sql`](./0001_course_mvp_schema.sql) — tables, indexes,
   `updated_at` trigger.
2. [`0002_course_mvp_rls.sql`](./0002_course_mvp_rls.sql) — enables RLS on every
   table and adds default-deny + per-role policies.
3. [`0003_course_mvp_functions.sql`](./0003_course_mvp_functions.sql) —
   `issue_certificate()` and `get_public_certificate()` — both `security definer`.
4. [`0004_course_mvp_security_hardening.sql`](./0004_course_mvp_security_hardening.sql)
   — **required** Codex hardening pass. Drops unsafe RLS policies that leaked
   `correct_choice` / lesson `content` / `video_url` and allowed forged quiz
   attempt inserts. Adds five SECURITY DEFINER RPCs that the app uses
   exclusively for protected reads and all course state writes
   (`get_published_curriculum`, `get_enrolled_lesson_body`,
   `get_enrolled_quiz_questions`, `submit_quiz_attempt`, `mark_lesson_complete`).
   Replaces `issue_certificate()` (correct required-quiz join) and
   `get_public_certificate()` (no email local-part fallback).
5. [`seed-the-singapore-way.sql`](./seed-the-singapore-way.sql) — the single
   bundled course, 4 modules, 12 lessons, 3 quizzes with 5 questions each.
   Idempotent: re-runs are no-ops once the slug exists.

After step 5, the course is queryable via the safe RPCs as any anonymous
visitor (curriculum preview only — no lesson bodies, no quiz questions, no
quiz answers) and as an authenticated enrolled user (curriculum + the
lesson bodies of the course they are enrolled in + the quiz questions
without `correct_choice`).

**Do not skip 0004.** Without it, an authenticated enrolled user can
`select correct_choice from quiz_questions` directly, and `insert into
quiz_attempts (..., passed) values (..., true)` forges a passing attempt.

---

## Rollback order

If you must roll back, apply down files in **reverse** order:

1. (Optional) Drop seed rows: there is no `seed-the-singapore-way.down.sql`
   because dropping the course cascades through every related row via the
   `on delete cascade` foreign keys defined in `0001`. To remove only the
   seed, run:
   ```sql
   delete from public.courses where slug = 'the-singapore-way';
   ```
2. [`0004_course_mvp_security_hardening.down.sql`](./0004_course_mvp_security_hardening.down.sql)
   — re-opens the security holes Codex flagged. **Do not run on a shared
   environment** unless you have a specific reason and are immediately
   re-applying a fix on top. Then re-apply
   `0003_course_mvp_functions.sql` to restore the pre-hardening function
   bodies that 0004 replaced.
3. [`0003_course_mvp_functions.down.sql`](./0003_course_mvp_functions.down.sql)
4. [`0002_course_mvp_rls.down.sql`](./0002_course_mvp_rls.down.sql)
5. [`0001_course_mvp_schema.down.sql`](./0001_course_mvp_schema.down.sql)

**Warning.** The `0001` down file is destructive — it drops every course MVP
table and every row in them. Only run it on a fresh project or after explicit
confirmation that no learner data needs to be preserved.

---

## Manual enrollment

Manual enrollment is the only access path in the MVP. To grant a learner
access to the course, run this in the SQL editor while signed in as a
Supabase project owner (the dashboard editor runs as the service role, which
bypasses RLS):

```sql
insert into public.course_enrollments (user_id, course_id, status)
select
  u.id,
  c.id,
  'active'
from auth.users u
cross join public.courses c
where u.email = 'learner@example.com'   -- ← change this
  and c.slug  = 'the-singapore-way'
on conflict (user_id, course_id) do update
  set status = excluded.status;
```

To revoke access without deleting the row:

```sql
update public.course_enrollments e
set status = 'revoked'
from auth.users u, public.courses c
where e.user_id   = u.id
  and e.course_id = c.id
  and u.email     = 'learner@example.com'
  and c.slug      = 'the-singapore-way';
```

See [`docs/manual-enrollment.md`](../../docs/manual-enrollment.md) for the
full operator runbook.

---

## RLS smoke test

After applying `0001` + `0002` + `0003` + the seed, run these queries in
the SQL editor to confirm the policies behave as designed. Each query
returns the expected row count; if anything else comes back, stop and
investigate before wiring up the player.

### As the anonymous role

The SQL editor runs as service role by default. Switch to the `anon` role for
these checks:

```sql
set role anon;

-- Published courses are public (anon can see id, slug, title, etc).
select count(*) from public.courses where slug = 'the-singapore-way';
--> 1

-- Modules under a published course are public.
select count(*) from public.course_modules;
--> 4

-- Lessons are NOT directly readable after 0004 — no SELECT policy exists
-- on course_lessons. Anon gets zero rows (or a permission error). The
-- safe public projection is get_published_curriculum().
select count(*) from public.course_lessons;
--> 0

-- The safe projection returns all 12 lesson rows WITHOUT content / video_url.
select count(*) from public.get_published_curriculum('the-singapore-way');
--> 12

-- Confirm content + video_url are not in the projection's return signature.
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'course_lessons'
  and column_name in ('content', 'video_url');
--> 2  (rows exist on the table, but anon can't SELECT them via the table)

-- Quiz questions are NOT directly readable.
select count(*) from public.quiz_questions;
--> 0

-- Enrollment rows are not public.
select count(*) from public.course_enrollments;
--> 0

-- Lesson progress is not public.
select count(*) from public.lesson_progress;
--> 0

-- Quiz attempts are not public.
select count(*) from public.quiz_attempts;
--> 0

-- Certificates are not directly public (verification goes through the function).
select count(*) from public.certificates;
--> 0

reset role;
```

### As an authenticated, enrolled learner

The dashboard cannot easily impersonate a real user. Two ways to verify:

1. **Fastest:** sign in to the running app as the test user, open
   `/learn` or `/account`, and watch the network panel — Supabase returns
   only that user's rows.
2. **From SQL:** set the local request claims to the user you want to act as
   and re-run the queries. Replace `00000000-…` with a real `auth.users.id`:

   ```sql
   begin;
   select set_config('request.jwt.claims',
     json_build_object('sub', '00000000-0000-0000-0000-000000000000', 'role', 'authenticated')::text,
     true);
   set local role authenticated;

   -- The enrolled user can read their own enrollment and their own progress only.
   select count(*) from public.course_enrollments where user_id = auth.uid();
   --> 1 (after manual enrollment)

   select count(*) from public.lesson_progress where user_id <> auth.uid();
   --> 0

   -- After 0004 the quiz_questions table is no longer SELECT-able. The
   -- enrolled user reads questions through the safe RPC, which returns
   -- ONLY id, question, choices, position. correct_choice is never
   -- returned to any client role.
   select count(*) from public.quiz_questions;
   --> 0  (or error: no SELECT policy)

   select count(*)
   from public.get_enrolled_quiz_questions('the-singapore-way', 'foundations-quiz');
   --> 5

   -- Authenticated enrolled users CANNOT directly insert a forged passing
   -- attempt. The only insert path is submit_quiz_attempt(), which grades
   -- the answers server-side against the DB answer key.
   insert into public.quiz_attempts (user_id, course_id, lesson_id, score, passed, answers)
   values (auth.uid(),
           (select id from public.courses where slug = 'the-singapore-way'),
           (select id from public.course_lessons where slug = 'foundations-quiz'),
           100, true, '{}'::jsonb);
   --> ERROR: new row violates row-level security policy for table "quiz_attempts"

   -- Similarly, lesson_progress cannot be inserted directly.
   insert into public.lesson_progress (user_id, course_id, lesson_id)
   values (auth.uid(),
           (select id from public.courses where slug = 'the-singapore-way'),
           (select id from public.course_lessons where slug = 'welcome'));
   --> ERROR: new row violates row-level security policy for table "lesson_progress"

   -- The only valid write paths are the RPCs.
   select * from public.mark_lesson_complete('the-singapore-way', 'welcome');
   --> succeeds (idempotent)

   select * from public.submit_quiz_attempt(
     'the-singapore-way',
     'foundations-quiz',
     '{"<question-id-1>": 0, "<question-id-2>": 1, ...}'::jsonb
   );
   --> returns one row with the genuine score, passed flag, total, correct

   rollback;
   ```

### Verification function

```sql
-- Public verification returns only safe fields.
select * from public.get_public_certificate('00000000-0000-0000-0000-000000000000');
-- Replace the UUID with a real certificate id. Returns id, course_title,
-- learner_display_name, issued_at — and nothing else.
```

---

## Where the app reads/writes this schema (post-0004)

| Path | RPC / table | Notes |
| --- | --- | --- |
| `/courses/[slug]` (landing) | `get_published_curriculum()` RPC | Curriculum metadata only — no content / video_url. |
| `/courses/[slug]/learn/[lessonSlug]` (player) | `get_published_curriculum()`, `get_enrolled_lesson_body()`, `course_enrollments` (owner read), `lesson_progress` (owner read) | The body RPC returns content/video_url ONLY when the caller is the active learner. |
| `QuizRunner` (quiz lessons) | `get_enrolled_quiz_questions()` RPC | Returns id / question / choices / position only. `correct_choice` is never returned. |
| Server action `markLessonComplete` | `mark_lesson_complete()` RPC | Server is the only writer to `lesson_progress`. Quiz lessons rejected. |
| Server action `submitQuizAttempt` | `submit_quiz_attempt()` RPC | Server-side grading. Server is the only writer to `quiz_attempts`. |
| `/courses/[slug]/certificate` | `issue_certificate()` RPC, `certificates` (owner read) | The RPC re-verifies completion server-side and is idempotent. |
| `/certificates/[id]` (public verify) | `get_public_certificate()` RPC | Returns only id / course title / display name / issued date. Display name falls back to "Verified learner" — never email local-part. |
| `/my-learning` | `course_enrollments`, `lesson_progress`, `certificates` (owner reads) | Composite dashboard reads. |

No app path uses `service_role`. Every read and write goes through the user's
own session under RLS or a `security definer` RPC the user is granted
`execute` on.
