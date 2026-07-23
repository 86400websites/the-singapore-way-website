-- 0007_certificate_name_gate_and_cleanup.down.sql — DESTRUCTIVE ROLLBACK.
--
-- Do NOT run unless deliberately rolling back 0007.
--
-- WHAT THIS DOES
--   * Restores issue_certificate() to its 0005 body (no full-name gate).
--
-- ROLLBACK REALITY
--   * Certificate rows deleted by 0007's cleanup CANNOT be restored by this
--     file. At authoring time the only affected row was the sample-era test
--     certificate the owner confirmed disposable.

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
