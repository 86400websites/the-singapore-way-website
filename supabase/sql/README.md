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
   `issue_certificate()` (Sprint 6) and `get_public_certificate()` (verification
   page) — both `security definer`.
4. [`seed-the-singapore-way.sql`](./seed-the-singapore-way.sql) — the single
   bundled course, 4 modules, 12 lessons, 3 quizzes with 5 questions each.
   Idempotent: re-runs are no-ops once the slug exists.

After step 4, the course is queryable via RLS as any anonymous visitor (only
the published course landing data is visible) and as an authenticated user
(no quiz answers, no other learners' progress).

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
2. [`0003_course_mvp_functions.down.sql`](./0003_course_mvp_functions.down.sql)
3. [`0002_course_mvp_rls.down.sql`](./0002_course_mvp_rls.down.sql)
4. [`0001_course_mvp_schema.down.sql`](./0001_course_mvp_schema.down.sql)

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

-- Published courses are public.
select count(*) from public.courses where slug = 'the-singapore-way';
--> 1

-- Modules and lessons under a published course are public.
select count(*) from public.course_modules;
--> 4
select count(*) from public.course_lessons;
--> 12

-- Quiz questions are NOT public — anonymous users see zero rows.
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

   -- Quiz questions are now visible because the user is enrolled.
   select count(*) from public.quiz_questions;
   --> 15

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

## Where the app reads/writes this schema

| Sprint | Path | What it touches |
| --- | --- | --- |
| 3 | `/courses/[slug]/learn/[lessonSlug]` | `courses`, `course_modules`, `course_lessons`, `course_enrollments` (read). |
| 4 | Server action `markLessonComplete` | `lesson_progress` (insert), `course_enrollments` (read for guard). |
| 5 | `QuizRunner` + server action `submitQuizAttempt` | `quiz_questions` (read, projection without `correct_choice` for the client), `quiz_attempts` (insert), `lesson_progress` (insert on pass). |
| 6 | `/courses/[slug]/certificate` + `/certificates/[id]` | `issue_certificate()` RPC, `get_public_certificate()` RPC, `certificates` (owner read). |
| 7 | `/my-learning` | `course_enrollments`, `lesson_progress`, `certificates` (owner reads). |

No app path uses `service_role`. Every read and write goes through the user's
own session under RLS.
