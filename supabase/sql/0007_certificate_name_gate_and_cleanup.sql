-- 0007_certificate_name_gate_and_cleanup.sql — S13 review fixes (Codex round
-- 1, findings 2 and 3).
--
-- File: supabase/sql/0007_certificate_name_gate_and_cleanup.sql
-- Run AFTER 0005 (and after 0006 / the seed). Required on EVERY project,
-- fresh or already-seeded.
-- Rollback: 0007_certificate_name_gate_and_cleanup.down.sql (restores the
-- 0005 function body; it cannot restore deleted certificate rows).
--
-- WHAT THIS DOES
--   1. Replaces issue_certificate() so a certificate can only be ISSUED when
--      the learner's auth record carries a meaningful full name
--      (raw_user_meta_data ->> 'full_name': non-blank after trim, and not a
--      generic fallback string). The completion checks are unchanged. The
--      existing-certificate idempotent return is unchanged.
--   2. Removes certificates for 'the-singapore-way' whose owner does NOT
--      satisfy completion of the CURRENT curriculum. Context: 0006 rebuilt
--      the course content in place and reset progress/attempts (Path A,
--      owner-confirmed disposable test data) but preserved certificates —
--      leaving one sample-era test certificate that would otherwise present
--      as a credential for the final course without completion of it
--      (issue_certificate returns an existing row before re-checking
--      completion, and public verification shows the course's current
--      title). This delete is self-scoping: a certificate legitimately
--      earned on the final curriculum after 0006 is NOT removed.
--
-- CLASSIFICATION
--   Part 1: reversible (function replace; down restores the 0005 body).
--   Part 2: DESTRUCTIVE for certificates not backed by current-curriculum
--   completion. At authoring time that is exactly the one sample-era test
--   certificate the owner confirmed disposable (preflight 2026-07-23).
--   A deleted certificate row cannot be restored by the down file; its
--   public verification URL stops resolving.

-- =============================================================================
-- 1. issue_certificate with the full-name gate.
-- =============================================================================
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

  -- Name gate: a certificate is only ISSUED with a meaningful full name, so
  -- the credential (and its public verification page) never reads as a
  -- generic fallback. UI collects the name; this is the authoritative check.
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

-- =============================================================================
-- 2. Remove certificates not backed by completion of the current curriculum.
--    Scoped to 'the-singapore-way'; self-limiting (see header).
-- =============================================================================
do $$
declare
  v_course_id uuid;
  v_removed   int;
begin
  select id into v_course_id
  from public.courses
  where slug = 'the-singapore-way';

  if v_course_id is null then
    raise notice 'Course "the-singapore-way" not found; no certificates to correct.';
    return;
  end if;

  delete from public.certificates x
  where x.course_id = v_course_id
    and (
      -- some required non-quiz lesson is not completed by this learner
      exists (
        select 1
        from public.course_lessons l
        where l.course_id    = v_course_id
          and l.is_required  = true
          and l.content_type <> 'quiz'
          and not exists (
            select 1 from public.lesson_progress p
            where p.lesson_id = l.id and p.user_id = x.user_id
          )
      )
      -- or some required quiz has no passing attempt by this learner
      or exists (
        select 1
        from public.course_lessons l
        where l.course_id    = v_course_id
          and l.is_required  = true
          and l.content_type = 'quiz'
          and not exists (
            select 1 from public.quiz_attempts a
            where a.lesson_id = l.id and a.user_id = x.user_id and a.passed = true
          )
      )
    );

  get diagnostics v_removed = row_count;
  raise notice 'Removed % certificate(s) not backed by completion of the current curriculum.', v_removed;
end $$;

-- =============================================================================
-- Verification (read-only; run after applying)
-- =============================================================================
--
-- Expected: 0 certificates remain that are not backed by completion (at
-- authoring time: 0 certificates total, since the only row was sample-era).
--
--   select count(*) as certificate_rows
--   from public.certificates x
--   join public.courses c on c.id = x.course_id
--   where c.slug = 'the-singapore-way';
--
-- Expected: the function definition contains the name gate.
--
--   select prosrc like '%Full name required%' as has_name_gate
--   from pg_proc
--   where proname = 'issue_certificate';
