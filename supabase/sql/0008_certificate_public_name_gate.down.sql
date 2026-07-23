-- 0008_certificate_public_name_gate.down.sql — ROLLBACK of 0008.
--
-- Do NOT run unless deliberately rolling back.
--
-- Restores:
--   1. issue_certificate() to the 0007 body (name gate AFTER the
--      existing-certificate return).
--   2. get_public_certificate() to the 0005 body (public display with the
--      'Verified learner' fallback, no name filter).
--
-- No data is changed by 0008 or by this rollback.

-- ---------- 1. issue_certificate: 0007 body ----------
create or replace function public.issue_certificate(p_course_id uuid)
returns public.certificates
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id          uuid := auth.uid();
  v_full_name        text;
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

  -- Name gate: a certificate is only ISSUED with a meaningful full name.
  select nullif(trim(u.raw_user_meta_data ->> 'full_name'), '')
    into v_full_name
  from auth.users u
  where u.id = v_user_id;

  if v_full_name is null
     or lower(v_full_name) in ('learner', 'verified learner') then
    raise exception 'Full name required' using errcode = '23514';
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

-- ---------- 2. get_public_certificate: 0005 body ----------
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
