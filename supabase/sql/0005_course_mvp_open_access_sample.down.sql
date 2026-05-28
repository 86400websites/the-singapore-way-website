-- Course MVP — 0005 rollback.
--
-- WARNING: rolling back removes the sign-in-only access RPCs and the
-- hardened certificate functions. After running this, the course player
-- and the quiz / completion / certificate flows will not work until you
-- re-apply a working migration. Only run this in a controlled environment
-- when you are immediately re-applying a different forward migration on
-- top.
--
-- This rollback drops the RPCs introduced/replaced by 0005.
-- It does NOT recreate the unsafe policies from 0002 (those were already
-- dropped by 0005 and re-creating them would re-open the security holes
-- Codex flagged). If you need the pre-0005 RLS posture, re-apply
-- 0002_course_mvp_rls.sql followed by 0003_course_mvp_functions.sql.

drop function if exists public.get_published_curriculum(text);
drop function if exists public.get_signed_in_lesson_body(text, text);
drop function if exists public.get_signed_in_quiz_questions(text, text);
drop function if exists public.submit_quiz_attempt(text, text, jsonb);
drop function if exists public.mark_lesson_complete(text, text);

-- issue_certificate() and get_public_certificate() are recreated by 0005
-- with CREATE OR REPLACE. Re-running 0003_course_mvp_functions.sql will
-- restore their pre-0005 bodies.
