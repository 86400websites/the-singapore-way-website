-- Course MVP — Row Level Security
--
-- File: supabase/sql/0002_course_mvp_rls.sql
-- Run AFTER 0001_course_mvp_schema.sql.
--
-- Posture: default-deny on every course MVP table, then explicit policies for
-- the access modes documented in docs/book-course-mvp-plan.md Section 8c.
--
-- Roles referenced:
--   anon          — unauthenticated visitors (public marketing reads).
--   authenticated — logged-in Supabase Auth users (everything user-specific).
--
-- No policy ever grants writes to the certificates table. Certificate creation
-- happens exclusively through public.issue_certificate() in
-- 0003_course_mvp_functions.sql, which runs as security definer and re-verifies
-- completion server-side.

-- =============================================================================
-- Enable RLS everywhere
-- =============================================================================
alter table public.courses            enable row level security;
alter table public.course_modules     enable row level security;
alter table public.course_lessons     enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.lesson_progress    enable row level security;
alter table public.quiz_questions     enable row level security;
alter table public.quiz_attempts      enable row level security;
alter table public.certificates       enable row level security;

-- =============================================================================
-- courses — public read of published courses
-- =============================================================================
drop policy if exists courses_select_published on public.courses;
create policy courses_select_published
  on public.courses
  for select
  to anon, authenticated
  using (status = 'published');

-- =============================================================================
-- course_modules — public read when parent course is published
-- =============================================================================
drop policy if exists course_modules_select_published on public.course_modules;
create policy course_modules_select_published
  on public.course_modules
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_modules.course_id
        and c.status = 'published'
    )
  );

-- =============================================================================
-- course_lessons — public read when parent course is published
-- MVP rationale: lesson body content is marketing-adjacent. See
-- docs/book-course-mvp-plan.md Risk #1. If we ever need true gating, split
-- the body into a separate table and restrict that table to enrolled users.
-- =============================================================================
drop policy if exists course_lessons_select_published on public.course_lessons;
create policy course_lessons_select_published
  on public.course_lessons
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_lessons.course_id
        and c.status = 'published'
    )
  );

-- =============================================================================
-- quiz_questions — readable only to actively enrolled users.
-- This keeps the correct_choice column from leaking to the public.
-- The Sprint 5 client renders questions through a server-side projection that
-- omits correct_choice, but RLS is the real defence.
-- =============================================================================
drop policy if exists quiz_questions_select_enrolled on public.quiz_questions;
create policy quiz_questions_select_enrolled
  on public.quiz_questions
  for select
  to authenticated
  using (
    exists (
      select 1 from public.course_enrollments e
      where e.user_id   = auth.uid()
        and e.course_id = quiz_questions.course_id
        and e.status    = 'active'
    )
  );

-- =============================================================================
-- course_enrollments — each user reads only their own row.
-- No INSERT / UPDATE / DELETE policies exist. The dashboard admin inserts
-- enrollments manually using the service role context. The frontend cannot
-- write here.
-- =============================================================================
drop policy if exists course_enrollments_select_own on public.course_enrollments;
create policy course_enrollments_select_own
  on public.course_enrollments
  for select
  to authenticated
  using (user_id = auth.uid());

-- =============================================================================
-- lesson_progress — each user reads / writes their own rows, only while
-- actively enrolled. No UPDATE: rows are idempotent inserts (unique on
-- user_id + lesson_id). DELETE is allowed so a learner can clear their own
-- progress if needed.
-- =============================================================================
drop policy if exists lesson_progress_select_own            on public.lesson_progress;
drop policy if exists lesson_progress_insert_own_enrolled   on public.lesson_progress;
drop policy if exists lesson_progress_delete_own            on public.lesson_progress;

create policy lesson_progress_select_own
  on public.lesson_progress
  for select
  to authenticated
  using (user_id = auth.uid());

create policy lesson_progress_insert_own_enrolled
  on public.lesson_progress
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.course_enrollments e
      where e.user_id   = auth.uid()
        and e.course_id = lesson_progress.course_id
        and e.status    = 'active'
    )
  );

create policy lesson_progress_delete_own
  on public.lesson_progress
  for delete
  to authenticated
  using (user_id = auth.uid());

-- =============================================================================
-- quiz_attempts — each user reads / inserts their own, only while actively
-- enrolled. Append-only: no UPDATE, no DELETE policies.
-- =============================================================================
drop policy if exists quiz_attempts_select_own          on public.quiz_attempts;
drop policy if exists quiz_attempts_insert_own_enrolled on public.quiz_attempts;

create policy quiz_attempts_select_own
  on public.quiz_attempts
  for select
  to authenticated
  using (user_id = auth.uid());

create policy quiz_attempts_insert_own_enrolled
  on public.quiz_attempts
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.course_enrollments e
      where e.user_id   = auth.uid()
        and e.course_id = quiz_attempts.course_id
        and e.status    = 'active'
    )
  );

-- =============================================================================
-- certificates — owner-only SELECT. NO insert/update/delete policy.
-- Public verification at /certificates/[id] does NOT read the table directly.
-- It calls the security-definer function public.get_public_certificate(id),
-- which returns only safe public fields. See 0003_course_mvp_functions.sql.
-- =============================================================================
drop policy if exists certificates_select_own on public.certificates;
create policy certificates_select_own
  on public.certificates
  for select
  to authenticated
  using (user_id = auth.uid());
