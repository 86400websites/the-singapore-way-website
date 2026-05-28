-- Course MVP — security-definer helper functions
--
-- File: supabase/sql/0003_course_mvp_functions.sql
-- Run AFTER 0001 and 0002.
--
-- This file defines two functions that intentionally bypass RLS:
--
--   public.issue_certificate(p_course_id uuid)
--     Called by the certificate page (Sprint 6) when the learner has
--     completed the course. Re-verifies completion server-side before
--     inserting a certificates row. Idempotent: returns the existing
--     certificate if one already exists.
--
--   public.get_public_certificate(certificate_id uuid)
--     Called by the public certificate verification page
--     /certificates/[id]. Returns only the public-safe projection:
--     certificate id, course title, learner display name, issued date.
--     Hides user_id, email, and any progress detail.
--
-- Both functions are marked security definer and scoped with
-- `set search_path = public, auth` so they cannot be hijacked by a
-- shadowing object in a caller's search_path.

-- =============================================================================
-- issue_certificate(p_course_id)
-- =============================================================================
create or replace function public.issue_certificate(p_course_id uuid)
returns public.certificates
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id          uuid := auth.uid();
  v_required_lessons int;
  v_completed        int;
  v_required_quizzes int;
  v_quizzes_passed   int;
  v_existing         public.certificates;
  v_new              public.certificates;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  -- The learner must be actively enrolled.
  if not exists (
    select 1 from public.course_enrollments
    where user_id   = v_user_id
      and course_id = p_course_id
      and status    = 'active'
  ) then
    raise exception 'Not enrolled in course' using errcode = '42501';
  end if;

  -- Idempotent: return the existing certificate if any.
  select * into v_existing
  from public.certificates
  where user_id = v_user_id and course_id = p_course_id
  limit 1;

  if found then
    return v_existing;
  end if;

  -- All required lessons must be completed.
  select count(*) into v_required_lessons
  from public.course_lessons
  where course_id = p_course_id and is_required = true;

  select count(*) into v_completed
  from public.lesson_progress lp
  join public.course_lessons  l on l.id = lp.lesson_id
  where lp.user_id   = v_user_id
    and lp.course_id = p_course_id
    and l.is_required = true;

  if v_completed < v_required_lessons then
    raise exception
      'Course not complete: % of % required lessons done',
      v_completed, v_required_lessons
      using errcode = '23514';
  end if;

  -- Every required quiz lesson must have at least one passing attempt.
  select count(*) into v_required_quizzes
  from public.course_lessons
  where course_id    = p_course_id
    and content_type = 'quiz'
    and is_required  = true;

  select count(distinct lesson_id) into v_quizzes_passed
  from public.quiz_attempts
  where user_id   = v_user_id
    and course_id = p_course_id
    and passed    = true;

  if v_quizzes_passed < v_required_quizzes then
    raise exception
      'Course not complete: % of % required quizzes passed',
      v_quizzes_passed, v_required_quizzes
      using errcode = '23514';
  end if;

  insert into public.certificates (user_id, course_id)
  values (v_user_id, p_course_id)
  returning * into v_new;

  return v_new;
end;
$$;

revoke all on function public.issue_certificate(uuid) from public;
grant execute on function public.issue_certificate(uuid) to authenticated;

-- =============================================================================
-- get_public_certificate(certificate_id)
-- =============================================================================
create or replace function public.get_public_certificate(certificate_id uuid)
returns table (
  id                   uuid,
  course_title         text,
  learner_display_name text,
  issued_at            timestamptz
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    c.id,
    crs.title as course_title,
    coalesce(
      nullif(u.raw_user_meta_data ->> 'full_name', ''),
      split_part(u.email, '@', 1)
    ) as learner_display_name,
    c.issued_at
  from public.certificates c
  join public.courses crs on crs.id = c.course_id
  join auth.users u       on u.id   = c.user_id
  where c.id = certificate_id;
$$;

revoke all on function public.get_public_certificate(uuid) from public;
grant execute on function public.get_public_certificate(uuid) to anon, authenticated;
