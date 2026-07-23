-- 0008_certificate_public_name_gate.sql — S13 review fixes (Codex round 2,
-- finding 2): extend the certificate name gate to the existing-certificate
-- return path and to PUBLIC verification.
--
-- File: supabase/sql/0008_certificate_public_name_gate.sql
-- Run AFTER 0007. Required on EVERY project.
-- Rollback: 0008_certificate_public_name_gate.down.sql (restores the 0007
-- issue_certificate body and the 0005 get_public_certificate body).
--
-- WHAT THIS DOES
--   1. Replaces issue_certificate() so the meaningful-full-name check runs
--      BEFORE the idempotent existing-certificate return. A learner whose
--      stored name is blank or generic can no longer retrieve a certificate
--      through the RPC until the name is fixed. Completion checks unchanged.
--   2. Replaces get_public_certificate() so PUBLIC verification returns no
--      row when the certificate owner's stored full name is blank or a
--      generic fallback ('learner', 'verified learner'). Such a certificate's
--      public URL renders the not-found state instead of presenting a
--      generic-name credential as verified. The 'Verified learner' coalesce
--      is kept in the projection purely as defense-in-depth; the WHERE filter
--      makes it unreachable in practice.
--
-- CLASSIFICATION: reversible (function replaces only; no data change).
--
-- After a learner sets a meaningful name (certificate page name step, which
-- calls updateLearnerName), their certificate and its public verification
-- URL work again unchanged — the certificate row itself is never touched.

-- =============================================================================
-- 1. issue_certificate — name gate before the existing-certificate return.
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

  -- Name gate FIRST: neither a new nor an existing certificate is returned
  -- without a meaningful full name on the auth record. UI collects the name;
  -- this is the authoritative check.
  select nullif(trim(u.raw_user_meta_data ->> 'full_name'), '')
    into v_full_name
  from auth.users u
  where u.id = v_user_id;

  if v_full_name is null
     or lower(v_full_name) in ('learner', 'verified learner') then
    raise exception 'Full name required' using errcode = '23514';
  end if;

  -- Idempotent: existing cert wins (name already validated above).
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
-- 2. get_public_certificate — no public display without a meaningful name.
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
  where c.id = certificate_id
    and nullif(trim(u.raw_user_meta_data ->> 'full_name'), '') is not null
    and lower(trim(u.raw_user_meta_data ->> 'full_name'))
        not in ('learner', 'verified learner');
$$;

revoke all on function public.get_public_certificate(uuid) from public;
grant execute on function public.get_public_certificate(uuid) to anon, authenticated;

-- =============================================================================
-- Verification (read-only; run after applying — boolean/count only, the name
-- itself is never selected)
-- =============================================================================
--
-- Expected: both functions carry the gate.
--
--   select
--     (select prosrc like '%Full name required%' from pg_proc
--       where proname = 'issue_certificate')            as issue_gated,
--     (select prosrc like '%not in (''learner'', ''verified learner'')%'
--       from pg_proc where proname = 'get_public_certificate') as public_gated;
--
-- Expected: every remaining certificate for the course is publicly
-- displayable (owner name meaningful) — count of non-displayable = 0.
--
--   select count(*) as non_displayable_certificates
--   from public.certificates x
--   join public.courses c on c.id = x.course_id
--   join auth.users u on u.id = x.user_id
--   where c.slug = 'the-singapore-way'
--     and (nullif(trim(u.raw_user_meta_data ->> 'full_name'), '') is null
--          or lower(trim(u.raw_user_meta_data ->> 'full_name'))
--             in ('learner', 'verified learner'));
