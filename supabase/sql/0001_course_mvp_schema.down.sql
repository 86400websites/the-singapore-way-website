-- Course MVP — schema rollback
--
-- WARNING: this DROPS every course MVP table. All learner progress, quiz
-- attempts, and certificates on those tables are permanently lost. Only run
-- this on a fresh project, or after explicit confirmation that no learner
-- data needs to be preserved.

drop trigger if exists trg_courses_updated_at on public.courses;
drop function if exists public.set_updated_at();

drop table if exists public.certificates;
drop table if exists public.quiz_attempts;
drop table if exists public.quiz_questions;
drop table if exists public.lesson_progress;
drop table if exists public.course_enrollments;
drop table if exists public.course_lessons;
drop table if exists public.course_modules;
drop table if exists public.courses;
