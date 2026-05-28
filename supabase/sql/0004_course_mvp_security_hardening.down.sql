-- Course MVP — security hardening rollback.
--
-- WARNING: rolling back 0004 re-opens the security holes Codex flagged:
--
--   * authenticated enrolled users can read quiz_questions.correct_choice,
--   * anon can read course_lessons.content and video_url,
--   * authenticated enrolled users can INSERT forged passing quiz_attempts,
--   * lesson_progress can be written directly to bypass the quiz check,
--   * issue_certificate trusts quiz_attempts.passed against forged rows,
--   * get_public_certificate falls back to the email local-part as the
--     learner display name.
--
-- Only run if you are explicitly reverting the hardening migration AND
-- accept restoring the policies from 0002 and the function bodies from 0003.

-- Drop the hardening RPCs.
drop function if exists public.get_published_curriculum(text);
drop function if exists public.get_enrolled_lesson_body(text, text);
drop function if exists public.get_enrolled_quiz_questions(text, text);
drop function if exists public.submit_quiz_attempt(text, text, jsonb);
drop function if exists public.mark_lesson_complete(text, text);

-- Restore the policies that 0004 dropped. These are byte-identical to the
-- definitions in 0002_course_mvp_rls.sql.
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

-- issue_certificate() and get_public_certificate() are CREATE OR REPLACE'd
-- by 0004; re-apply 0003_course_mvp_functions.sql to restore the pre-0004
-- bodies.
