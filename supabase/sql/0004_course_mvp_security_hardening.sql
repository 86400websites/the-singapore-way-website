-- Course MVP — security hardening (Codex review)
--
-- File: supabase/sql/0004_course_mvp_security_hardening.sql
-- Run AFTER 0001, 0002, 0003 (and the seed).
--
-- Background: Codex flagged five blocking issues in the original design:
--
--   1. The RLS posture on quiz_questions / course_lessons is row-level, not
--      column-level. Authenticated enrolled users could SELECT the
--      `correct_choice` column directly, and the anon role could SELECT
--      lesson `content` and `video_url`.
--   2. Authenticated enrolled users could INSERT into quiz_attempts directly
--      with `passed = true`, forging a passing attempt.
--   3. issue_certificate() trusted quiz_attempts.passed, which was forgeable.
--   4. Authenticated enrolled users could INSERT into lesson_progress for any
--      lesson in the course they were enrolled in, with no validation that
--      the lesson actually belonged to that course or was a non-quiz lesson.
--   5. get_public_certificate() leaked the email local-part when
--      raw_user_meta_data.full_name was empty.
--
-- This forward-only migration:
--
--   * drops the unsafe SELECT/INSERT policies on course_lessons,
--     quiz_questions, quiz_attempts, lesson_progress;
--   * exposes safe access paths via SECURITY DEFINER RPCs that never return
--     answer keys to authenticated clients and never return protected lesson
--     bodies to anon;
--   * moves quiz attempt creation and lesson completion behind RPCs so the
--     server is the only writer;
--   * replaces issue_certificate() so the required-quiz count is derived
--     from course_lessons (not the forgeable attempts table) and the
--     passed-attempt check joins by lesson_id;
--   * replaces get_public_certificate() so the display-name fallback is
--     "Verified learner" instead of the email local-part.
--
-- The existing 0002 owner-side SELECT policies on quiz_attempts,
-- lesson_progress, certificates, and course_enrollments are kept — they let
-- a learner read their own state, which is required by the UI and was not
-- flagged. Only the write paths and the unsafe public reads are tightened.

-- =============================================================================
-- 1. Drop unsafe policies
-- =============================================================================
drop policy if exists course_lessons_select_published      on public.course_lessons;
drop policy if exists quiz_questions_select_enrolled       on public.quiz_questions;
drop policy if exists quiz_attempts_insert_own_enrolled    on public.quiz_attempts;
drop policy if exists lesson_progress_insert_own_enrolled  on public.lesson_progress;
drop policy if exists lesson_progress_delete_own           on public.lesson_progress;

-- After this migration:
--   * course_lessons has NO direct SELECT policy. All reads go through
--     get_published_curriculum (preview projection, no content / video_url)
--     and get_enrolled_lesson_body (enrolled-only access to content / video_url).
--   * quiz_questions has NO direct SELECT policy. All reads go through
--     get_enrolled_quiz_questions (no correct_choice) and submit_quiz_attempt
--     (server-side grading only).
--   * quiz_attempts has NO direct INSERT/UPDATE/DELETE policy. The only
--     creator is submit_quiz_attempt(). The owner SELECT policy remains so
--     the UI can show the latest passing attempt.
--   * lesson_progress has NO direct INSERT/UPDATE/DELETE policy. The only
--     creator is mark_lesson_complete() or submit_quiz_attempt() (on pass).
--     The owner SELECT policy remains.

-- =============================================================================
-- 2. Public curriculum projection — safe for anon and authenticated.
-- Returns NO content / video_url.
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
-- 3. Enrolled-only lesson body. Returns content and video_url ONLY when the
-- caller is authenticated AND actively enrolled in the published course.
-- Returns zero rows otherwise — never raises, to keep the caller paths simple.
-- =============================================================================
create or replace function public.get_enrolled_lesson_body(
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
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    return;
  end if;

  return query
    select l.content, l.video_url
    from public.course_lessons l
    join public.courses c            on c.id = l.course_id
    join public.course_enrollments e on e.course_id = c.id
    where c.slug      = p_course_slug
      and l.slug      = p_lesson_slug
      and c.status    = 'published'
      and e.user_id   = v_user_id
      and e.status    = 'active'
    limit 1;
end;
$$;

revoke all on function public.get_enrolled_lesson_body(text, text) from public;
grant execute on function public.get_enrolled_lesson_body(text, text) to authenticated;

-- =============================================================================
-- 4. Enrolled-only quiz questions — WITHOUT correct_choice.
-- Returns zero rows when the caller is not authenticated or not enrolled.
-- =============================================================================
create or replace function public.get_enrolled_quiz_questions(
  p_course_slug text,
  p_lesson_slug text
)
returns table (
  id       uuid,
  question text,
  choices  jsonb,
  position int
)
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    return;
  end if;

  return query
    select q.id, q.question, q.choices, q.position
    from public.quiz_questions q
    join public.courses c            on c.id = q.course_id
    join public.course_lessons l     on l.id = q.lesson_id
    join public.course_enrollments e on e.course_id = c.id
    where c.slug      = p_course_slug
      and l.slug      = p_lesson_slug
      and l.content_type = 'quiz'
      and c.status    = 'published'
      and e.user_id   = v_user_id
      and e.status    = 'active'
    order by q.position;
end;
$$;

revoke all on function public.get_enrolled_quiz_questions(text, text) from public;
grant execute on function public.get_enrolled_quiz_questions(text, text) to authenticated;

-- =============================================================================
-- 5. Server-side quiz grading. Replaces every direct quiz_attempts insert path.
--
-- - Requires auth.uid().
-- - Requires an active enrollment in the published course.
-- - Requires the lesson to be a quiz in that course.
-- - Grades p_answers against the DB-side correct_choice column.
-- - Inserts a quiz_attempts row with the computed score and passed flag.
-- - On a passing score (>= 80%), idempotently inserts a lesson_progress row
--   so the quiz counts toward course completion.
-- - Returns a single row with score, passed, total, correct.
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
  v_user_id   uuid := auth.uid();
  v_course_id uuid;
  v_lesson_id uuid;
  v_q         record;
  v_chosen_text text;
  v_chosen_int  int;
  v_correct   int := 0;
  v_total     int := 0;
  v_score     int := 0;
  v_passed    boolean := false;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Invalid answers payload' using errcode = '22023';
  end if;

  -- Resolve course + lesson, and enforce quiz-only.
  select c.id, l.id
    into v_course_id, v_lesson_id
  from public.courses c
  join public.course_lessons l on l.course_id = c.id
  where c.slug         = p_course_slug
    and l.slug         = p_lesson_slug
    and c.status       = 'published'
    and l.content_type = 'quiz'
  limit 1;

  if v_course_id is null then
    raise exception 'Quiz lesson not found' using errcode = '02000';
  end if;

  -- Enrollment must be active.
  if not exists (
    select 1 from public.course_enrollments
    where user_id   = v_user_id
      and course_id = v_course_id
      and status    = 'active'
  ) then
    raise exception 'Not enrolled in course' using errcode = '42501';
  end if;

  -- Grade against the DB-side answer key. Unknown question ids in the
  -- payload are ignored (they cannot count); unanswered questions count as
  -- wrong; out-of-range indices count as wrong.
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

  -- Append the attempt. p_answers is stored as the audit trail of what the
  -- learner submitted; nothing the learner controls affects passed/score.
  insert into public.quiz_attempts (user_id, course_id, lesson_id, score, passed, answers)
  values (v_user_id, v_course_id, v_lesson_id, v_score, v_passed, p_answers);

  -- On pass, mark the quiz lesson complete. Idempotent.
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
-- 6. Server-side lesson completion. Replaces every direct lesson_progress
-- insert path.
--
-- - Requires auth.uid().
-- - Requires the lesson to be a NON-quiz lesson in the published course.
--   Quiz lessons are only marked complete by submit_quiz_attempt() on pass,
--   to prevent a learner from clicking "Mark complete" past a quiz they
--   haven't passed.
-- - Requires an active enrollment.
-- - Idempotent via the unique (user_id, lesson_id) constraint.
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
  where c.slug   = p_course_slug
    and l.slug   = p_lesson_slug
    and c.status = 'published'
  limit 1;

  if v_course_id is null then
    raise exception 'Lesson not found' using errcode = '02000';
  end if;

  if v_content_type = 'quiz' then
    raise exception 'Quiz lessons can only be completed by submitting the quiz'
      using errcode = '22023';
  end if;

  if not exists (
    select 1 from public.course_enrollments
    where user_id   = v_user_id
      and course_id = v_course_id
      and status    = 'active'
  ) then
    raise exception 'Not enrolled in course' using errcode = '42501';
  end if;

  insert into public.lesson_progress (user_id, course_id, lesson_id)
  values (v_user_id, v_course_id, v_lesson_id)
  on conflict (user_id, lesson_id) do nothing;
end;
$$;

revoke all on function public.mark_lesson_complete(text, text) from public;
grant execute on function public.mark_lesson_complete(text, text) to authenticated;

-- =============================================================================
-- 7. Hardened issue_certificate(). Replaces the version from 0003.
--
-- Changes vs 0003:
--   * The required-quiz count is taken from course_lessons (joined explicitly
--     by content_type = 'quiz' AND is_required = true), not from a count
--     against the forgeable attempts table.
--   * Now that quiz_attempts can only be created by submit_quiz_attempt(),
--     trusting quiz_attempts.passed is safe again. The defensive checks here
--     stay so that two layers fail closed.
--   * Required NON-quiz lessons are counted by an explicit
--     content_type <> 'quiz' filter, so a quiz lesson with progress (from a
--     prior pass) cannot satisfy the "required lessons" half of the test.
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

  if not exists (
    select 1 from public.course_enrollments
    where user_id   = v_user_id
      and course_id = p_course_id
      and status    = 'active'
  ) then
    raise exception 'Not enrolled in course' using errcode = '42501';
  end if;

  -- Idempotent: return the existing cert if any.
  select * into v_existing
  from public.certificates
  where user_id = v_user_id and course_id = p_course_id
  limit 1;

  if found then
    return v_existing;
  end if;

  -- Required NON-quiz lessons must all be completed.
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

  -- Required quiz lessons must each have a passed attempt. We anchor the
  -- count on course_lessons (which Codex called out) so we are counting
  -- "required quizzes with a passing attempt", not "any passing attempts".
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
-- 8. Hardened get_public_certificate(). Removes the email local-part fallback.
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
