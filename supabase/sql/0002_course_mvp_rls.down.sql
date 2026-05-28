-- Course MVP — RLS rollback.
--
-- Drops every policy created by 0002_course_mvp_rls.sql and disables RLS.
-- Run BEFORE 0001_course_mvp_schema.down.sql if rolling back the whole stack.

drop policy if exists courses_select_published                 on public.courses;
drop policy if exists course_modules_select_published          on public.course_modules;
drop policy if exists course_lessons_select_published          on public.course_lessons;
drop policy if exists quiz_questions_select_enrolled           on public.quiz_questions;
drop policy if exists course_enrollments_select_own            on public.course_enrollments;
drop policy if exists lesson_progress_select_own               on public.lesson_progress;
drop policy if exists lesson_progress_insert_own_enrolled      on public.lesson_progress;
drop policy if exists lesson_progress_delete_own               on public.lesson_progress;
drop policy if exists quiz_attempts_select_own                 on public.quiz_attempts;
drop policy if exists quiz_attempts_insert_own_enrolled        on public.quiz_attempts;
drop policy if exists certificates_select_own                  on public.certificates;

alter table public.courses            disable row level security;
alter table public.course_modules     disable row level security;
alter table public.course_lessons     disable row level security;
alter table public.course_enrollments disable row level security;
alter table public.lesson_progress    disable row level security;
alter table public.quiz_questions     disable row level security;
alter table public.quiz_attempts      disable row level security;
alter table public.certificates       disable row level security;
