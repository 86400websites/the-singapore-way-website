-- Course MVP — open-access (signed-in) sample course migration.
--
-- File: supabase/sql/0005_course_mvp_open_access_sample.sql
-- Run AFTER 0001, 0002, 0003 and BEFORE the seed
-- (seed-the-singapore-way.sql). SKIP 0004 (it failed at the `position int`
-- keyword issue — see docs/course-setup-and-launch-checklist.md).
--
-- This migration replaces the manual-enrollment access model with a
-- sign-in-only access model:
--
--   * Public visitors: see the course landing page and the safe public
--     curriculum preview (titles only, no lesson bodies, no quiz questions).
--   * Signed-in users: see lesson bodies, take quizzes, save progress,
--     earn certificates. No enrollment check.
--   * Quiz grading still happens server-side through a SECURITY DEFINER RPC.
--   * Lesson completion writes still happen through a SECURITY DEFINER RPC.
--   * Certificate issuance still goes through a SECURITY DEFINER RPC that
--     re-verifies completion server-side.
--   * Public certificate verification still exposes only a safe projection;
--     the display-name fallback is "Verified learner" (no email local-part).
--
-- The `course_enrollments` table is left in place for possible future use
-- but is NOT consulted by any RPC or any runtime path. Its existing owner
-- SELECT policy from 0002 is left untouched.
--
-- This file is idempotent and safe to re-run. It is also safe to run on a
-- project where 0004 partially applied — the drops are guarded, and the
-- function bodies are CREATE OR REPLACE. The two RPC names that 0004
-- introduced (`get_enrolled_lesson_body`, `get_enrolled_quiz_questions`)
-- are explicitly dropped here so they cannot diverge from the new
-- `get_signed_in_*` names.

-- =============================================================================
-- 1. Idempotent drops — clean up the partial 0004 state if present.
-- =============================================================================

-- Unsafe RLS policies from 0002 that 0004 was supposed to drop. We drop them
-- here too in case 0004 was never applied.
drop policy if exists course_lessons_select_published      on public.course_lessons;
drop policy if exists quiz_questions_select_enrolled       on public.quiz_questions;
drop policy if exists quiz_attempts_insert_own_enrolled    on public.quiz_attempts;
drop policy if exists lesson_progress_insert_own_enrolled  on public.lesson_progress;
drop policy if exists lesson_progress_delete_own           on public.lesson_progress;

-- 0004 RPC names — drop unconditionally so a re-run doesn't leave both old
-- and new bodies coexisting. The new names below are `get_signed_in_*`.
drop function if exists public.get_enrolled_lesson_body(text, text);
drop function if exists public.get_enrolled_quiz_questions(text, text);

-- Drop the RPCs introduced earlier in 0004 (which may or may not exist) so
-- we can re-create them with the new behaviour.
drop function if exists public.get_published_curriculum(text);
drop function if exists public.submit_quiz_attempt(text, text, jsonb);
drop function if exists public.mark_lesson_complete(text, text);

-- =============================================================================
-- 2. Public curriculum projection — safe for anon and authenticated.
-- Returns NO lesson content. Returns NO video_url.
-- =============================================================================
create or replace function public.get_published_curriculum(p_course_slug text)
returns table (
  course_id           uuid,
  course_slug         text,
  course_title        text,
  course_subtitle     text,
  course_description  text,
  module_id           uuid,
  module_title        text,
  module_description  text,
  module_position     int,
  lesson_id           uuid,
  lesson_slug         text,
  lesson_title        text,
  lesson_description  text,
  lesson_content_type text,
  lesson_position     int,
  lesson_is_required  boolean
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    c.id, c.slug, c.title, c.subtitle, c.description,
    m.id, m.title, m.description, m.position,
    l.id, l.slug, l.title, l.description, l.content_type, l.position, l.is_required
  from public.courses c
  join public.course_modules m on m.course_id = c.id
  join public.course_lessons l on l.module_id = m.id
  where c.slug = p_course_slug
    and c.status = 'published'
  order by m.position, l.position;
$$;

revoke all on function public.get_published_curriculum(text) from public;
grant execute on function public.get_published_curriculum(text) to anon, authenticated;

-- =============================================================================
-- 3. Signed-in lesson body. Returns content + video_url if and only if the
-- caller is authenticated. No enrollment check.
-- =============================================================================
create or replace function public.get_signed_in_lesson_body(
  p_course_slug text,
  p_lesson_slug text
)
returns table (
  content   text,
  video_url text
)
language plpgsql
stable
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  return query
    select l.content, l.video_url
    from public.course_lessons l
    join public.courses c on c.id = l.course_id
    where c.slug   = p_course_slug
      and l.slug   = p_lesson_slug
      and c.status = 'published'
    limit 1;
end;
$$;

revoke all on function public.get_signed_in_lesson_body(text, text) from public;
grant execute on function public.get_signed_in_lesson_body(text, text) to authenticated;

-- =============================================================================
-- 4. Signed-in quiz questions WITHOUT the answer key.
--
-- The return column for the original lesson position is renamed to
-- `question_position` to avoid the PostgreSQL `position` keyword that broke
-- 0004 at the `position int` line.
-- =============================================================================
create or replace function public.get_signed_in_quiz_questions(
  p_course_slug text,
  p_lesson_slug text
)
returns table (
  id                uuid,
  question          text,
  choices           jsonb,
  question_position int
)
language plpgsql
stable
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    return;
  end if;

  return query
    select q.id, q.question, q.choices, q.position
    from public.quiz_questions q
    join public.courses c        on c.id = q.course_id
    join public.course_lessons l on l.id = q.lesson_id
    where c.slug         = p_course_slug
      and l.slug         = p_lesson_slug
      and l.content_type = 'quiz'
      and c.status       = 'published'
    order by q.position;
end;
$$;

revoke all on function public.get_signed_in_quiz_questions(text, text) from public;
grant execute on function public.get_signed_in_quiz_questions(text, text) to authenticated;

-- =============================================================================
-- 5. Server-side quiz grading. The only quiz_attempts INSERT path. Sign-in only.
--
-- - Requires auth.uid().
-- - Verifies the lesson is a quiz in the published course.
-- - Grades p_answers against the DB-side correct_choice column.
-- - Computes score and pass/fail (80% threshold) inside the function.
-- - Inserts a quiz_attempts row with the computed values.
-- - On pass, idempotently inserts a lesson_progress row.
-- =============================================================================
create or replace function public.submit_quiz_attempt(
  p_course_slug text,
  p_lesson_slug text,
  p_answers     jsonb
)
returns table (
  score   int,
  passed  boolean,
  total   int,
  correct int
)
language plpgsql
volatile
security definer
set search_path = public, auth
as $$
declare
  v_user_id     uuid := auth.uid();
  v_course_id   uuid;
  v_lesson_id   uuid;
  v_q           record;
  v_chosen_text text;
  v_chosen_int  int;
  v_correct     int := 0;
  v_total       int := 0;
  v_score       int := 0;
  v_passed      boolean := false;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Invalid answers payload' using errcode = '22023';
  end if;

  select c.id, l.id into v_course_id, v_lesson_id
  from public.courses c
  join public.course_lessons l on l.course_id = c.id
  where c.slug = p_course_slug
    and l.slug = p_lesson_slug
    and c.status = 'published'
    and l.content_type = 'quiz'
  limit 1;

  if v_course_id is null then
    raise exception 'Quiz lesson not found' using errcode = '02000';
  end if;

  for v_q in
    select id, correct_choice, jsonb_array_length(choices) as n_choices
    from public.quiz_questions
    where course_id = v_course_id
      and lesson_id = v_lesson_id
  loop
    v_total := v_total + 1;
    v_chosen_text := p_answers ->> v_q.id::text;
    if v_chosen_text is not null then
      begin
        v_chosen_int := v_chosen_text::int;
      exception when others then
        v_chosen_int := null;
      end;
      if v_chosen_int is not null
         and v_chosen_int >= 0
         and v_chosen_int < v_q.n_choices
         and v_chosen_int = v_q.correct_choice
      then
        v_correct := v_correct + 1;
      end if;
    end if;
  end loop;

  if v_total = 0 then
    raise exception 'Quiz has no questions' using errcode = '02000';
  end if;

  v_score  := round((v_correct::numeric / v_total::numeric) * 100);
  v_passed := v_score >= 80;

  insert into public.quiz_attempts (user_id, course_id, lesson_id, score, passed, answers)
  values (v_user_id, v_course_id, v_lesson_id, v_score, v_passed, p_answers);

  if v_passed then
    insert into public.lesson_progress (user_id, course_id, lesson_id)
    values (v_user_id, v_course_id, v_lesson_id)
    on conflict (user_id, lesson_id) do nothing;
  end if;

  return query select v_score, v_passed, v_total, v_correct;
end;
$$;

revoke all on function public.submit_quiz_attempt(text, text, jsonb) from public;
grant execute on function public.submit_quiz_attempt(text, text, jsonb) to authenticated;

-- =============================================================================
-- 6. Server-side lesson completion. Only writer to lesson_progress for
-- non-quiz lessons. Sign-in only.
-- =============================================================================
create or replace function public.mark_lesson_complete(
  p_course_slug text,
  p_lesson_slug text
)
returns void
language plpgsql
volatile
security definer
set search_path = public, auth
as $$
declare
  v_user_id      uuid := auth.uid();
  v_course_id    uuid;
  v_lesson_id    uuid;
  v_content_type text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select c.id, l.id, l.content_type
    into v_course_id, v_lesson_id, v_content_type
  from public.courses c
  join public.course_lessons l on l.course_id = c.id
  where c.slug = p_course_slug
    and l.slug = p_lesson_slug
    and c.status = 'published'
  limit 1;

  if v_course_id is null then
    raise exception 'Lesson not found' using errcode = '02000';
  end if;

  if v_content_type = 'quiz' then
    raise exception 'Quiz lessons can only be completed by submitting the quiz'
      using errcode = '22023';
  end if;

  insert into public.lesson_progress (user_id, course_id, lesson_id)
  values (v_user_id, v_course_id, v_lesson_id)
  on conflict (user_id, lesson_id) do nothing;
end;
$$;

revoke all on function public.mark_lesson_complete(text, text) from public;
grant execute on function public.mark_lesson_complete(text, text) to authenticated;

-- =============================================================================
-- 7. Hardened issue_certificate. Sign-in only (no enrollment check). Issues
-- a certificate when every required non-quiz lesson is complete AND every
-- required quiz lesson has at least one passed attempt.
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
  v_lessons_done     int;
  v_required_quizzes int;
  v_quizzes_passed   int;
  v_existing         public.certificates;
  v_new              public.certificates;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  -- Idempotent: existing cert wins.
  select * into v_existing
  from public.certificates
  where user_id = v_user_id and course_id = p_course_id
  limit 1;

  if found then
    return v_existing;
  end if;

  select count(*) into v_required_lessons
  from public.course_lessons
  where course_id    = p_course_id
    and is_required  = true
    and content_type <> 'quiz';

  select count(*) into v_lessons_done
  from public.lesson_progress lp
  join public.course_lessons l on l.id = lp.lesson_id
  where lp.user_id     = v_user_id
    and lp.course_id   = p_course_id
    and l.is_required  = true
    and l.content_type <> 'quiz';

  if v_lessons_done < v_required_lessons then
    raise exception
      'Course not complete: % of % required lessons done',
      v_lessons_done, v_required_lessons
      using errcode = '23514';
  end if;

  select count(*) into v_required_quizzes
  from public.course_lessons
  where course_id    = p_course_id
    and is_required  = true
    and content_type = 'quiz';

  select count(*) into v_quizzes_passed
  from public.course_lessons l
  where l.course_id    = p_course_id
    and l.is_required  = true
    and l.content_type = 'quiz'
    and exists (
      select 1 from public.quiz_attempts qa
      where qa.user_id   = v_user_id
        and qa.lesson_id = l.id
        and qa.passed    = true
    );

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
-- 8. Public certificate verification — no email local-part fallback.
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
      nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
      'Verified learner'
    ) as learner_display_name,
    c.issued_at
  from public.certificates c
  join public.courses crs on crs.id = c.course_id
  join auth.users u       on u.id   = c.user_id
  where c.id = certificate_id;
$$;

revoke all on function public.get_public_certificate(uuid) from public;
grant execute on function public.get_public_certificate(uuid) to anon, authenticated;
