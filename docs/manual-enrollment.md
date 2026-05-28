# Manual enrollment — operator runbook

This is the runbook for granting a learner access to the bundled book
companion course. Manual enrollment is the **only** access path in the MVP —
there are no payments, no access codes, and no self-serve enrollment route.

The frontend has no write path into `course_enrollments`. Every enrollment is
performed by a project owner against the Supabase dashboard.

## Preconditions

- The SQL in [`supabase/sql/`](../supabase/sql/) has been applied to the
  Supabase project (schema, RLS, functions, seed). See
  [`supabase/sql/README.md`](../supabase/sql/README.md).
- The learner has signed up at `/signup` and confirmed their email (so a row
  exists in `auth.users` for them).
- You have access to the Supabase dashboard for the project as a project
  owner. The dashboard SQL editor runs as the service role, which bypasses
  RLS — that is what makes manual enrollment possible.

## Grant access

1. Open the Supabase dashboard for the project.
2. Authentication → Users → confirm the learner's email exists and is
   confirmed. Copy the email exactly as it appears.
3. SQL Editor → New query → paste:

   ```sql
   insert into public.course_enrollments (user_id, course_id, status)
   select u.id, c.id, 'active'
   from auth.users u
   cross join public.courses c
   where u.email = 'learner@example.com'   -- ← change this
     and c.slug  = 'the-singapore-way'
   on conflict (user_id, course_id) do update
     set status = excluded.status
   returning *;
   ```

4. Run. You should see exactly one row returned.

   - If you see **zero rows**, either the email did not match an
     `auth.users` row (likely a typo, or the learner has not confirmed their
     email), or the course slug is wrong.
   - If you see **more than one row**, something is off — stop and review.

5. Tell the learner. They can now sign in and access the course at
   `/courses/the-singapore-way` and the player route at
   `/courses/the-singapore-way/learn/welcome`.

## Revoke access

Do **not** delete the row. Set status to `revoked` so the audit trail of who
ever had access is preserved:

```sql
update public.course_enrollments e
set status = 'revoked'
from auth.users u, public.courses c
where e.user_id   = u.id
  and e.course_id = c.id
  and u.email     = 'learner@example.com'
  and c.slug      = 'the-singapore-way'
returning e.*;
```

RLS policies require `status = 'active'` for every protected action (writing
lesson progress, reading quiz questions, submitting attempts), so a revoked
enrollment immediately removes access without dropping the user's history.

## Restore access

Identical to the grant query — the `on conflict do update` clause flips
`status` back to `'active'`.

## Verify a single learner's state

```sql
select
  u.email,
  c.slug          as course,
  e.status,
  e.enrolled_at,
  (
    select count(*) from public.lesson_progress lp
    where lp.user_id = u.id and lp.course_id = c.id
  ) as lessons_completed,
  (
    select count(*) from public.quiz_attempts qa
    where qa.user_id = u.id and qa.course_id = c.id and qa.passed
  ) as quizzes_passed,
  (
    select cert.id from public.certificates cert
    where cert.user_id = u.id and cert.course_id = c.id
  ) as certificate_id
from public.course_enrollments e
join auth.users      u on u.id = e.user_id
join public.courses  c on c.id = e.course_id
where u.email = 'learner@example.com';
```

## Issue a certificate manually (only if needed)

The certificate page issues certificates automatically when a learner meets
the completion criteria. If you ever need to issue one out of band — for
example, to re-issue after a data fix — call the `security definer` function
**as the learner** rather than inserting a row directly. The function
re-verifies completion before inserting, so it cannot mint a certificate the
learner has not earned. If you need to bypass that check, edit
`certificates` directly via the dashboard service role and document why.

## What manual enrollment does NOT do

- It does not send the learner any email. Email automation is not in the
  MVP. Communicate access yourself (Resend transactional template is out of
  scope for Sprint 2).
- It does not create the user. Sign-up + email confirmation must happen
  first.
- It does not grant admin / instructor capabilities. There are no admin
  capabilities in the MVP frontend — there is only the learner role.
