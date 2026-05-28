-- Course MVP — schema
--
-- File: supabase/sql/0001_course_mvp_schema.sql
-- Companion: 0002_course_mvp_rls.sql (RLS policies), 0003_course_mvp_functions.sql (helpers).
-- Apply via Supabase dashboard → SQL editor → Run. Idempotent on a fresh project.
-- See supabase/sql/README.md for the full apply order and verification steps.

create extension if not exists "pgcrypto";

-- =============================================================================
-- courses
-- =============================================================================
create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  subtitle    text,
  description text,
  status      text not null default 'draft'
                check (status in ('draft', 'published')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =============================================================================
-- course_modules
-- =============================================================================
create table if not exists public.course_modules (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses(id) on delete cascade,
  title       text not null,
  description text,
  position    int  not null,
  created_at  timestamptz not null default now(),
  unique (course_id, position)
);

-- =============================================================================
-- course_lessons
-- =============================================================================
create table if not exists public.course_lessons (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references public.courses(id)        on delete cascade,
  module_id    uuid not null references public.course_modules(id) on delete cascade,
  slug         text not null,
  title        text not null,
  description  text,
  content_type text not null default 'text'
                  check (content_type in ('text', 'video', 'quiz')),
  content      text,
  video_url    text,
  position     int  not null,
  is_required  boolean not null default true,
  created_at   timestamptz not null default now(),
  unique (course_id, slug),
  unique (module_id, position)
);

-- =============================================================================
-- course_enrollments
-- Manual enrollment: rows are inserted by an admin in the Supabase dashboard.
-- The frontend never inserts here.
-- =============================================================================
create table if not exists public.course_enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id)    on delete cascade,
  course_id   uuid not null references public.courses(id) on delete cascade,
  status      text not null default 'active'
                check (status in ('active', 'revoked')),
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- =============================================================================
-- lesson_progress
-- One row per (user, lesson) once the lesson is completed.
-- =============================================================================
create table if not exists public.lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id)            on delete cascade,
  course_id    uuid not null references public.courses(id)        on delete cascade,
  lesson_id    uuid not null references public.course_lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- =============================================================================
-- quiz_questions
-- One question row per MCQ. The full row (including correct_choice) is only
-- readable by enrolled users via RLS — see 0002_course_mvp_rls.sql.
-- =============================================================================
create table if not exists public.quiz_questions (
  id             uuid primary key default gen_random_uuid(),
  course_id      uuid not null references public.courses(id)        on delete cascade,
  lesson_id      uuid not null references public.course_lessons(id) on delete cascade,
  question       text not null,
  choices        jsonb not null check (jsonb_typeof(choices) = 'array'),
  correct_choice int  not null,
  explanation    text,
  position       int  not null,
  created_at     timestamptz not null default now(),
  unique (lesson_id, position)
);

-- =============================================================================
-- quiz_attempts
-- Append-only history of submitted quiz attempts.
-- =============================================================================
create table if not exists public.quiz_attempts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id)            on delete cascade,
  course_id  uuid not null references public.courses(id)        on delete cascade,
  lesson_id  uuid not null references public.course_lessons(id) on delete cascade,
  score      int  not null check (score between 0 and 100),
  passed     boolean not null,
  answers    jsonb not null,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- certificates
-- One certificate per (user, course). The certificate id is the public code.
-- Inserts happen exclusively through public.issue_certificate() (Sprint 6) —
-- see 0003_course_mvp_functions.sql.
-- =============================================================================
create table if not exists public.certificates (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id)    on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  issued_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- =============================================================================
-- updated_at trigger
-- Only courses has updates today; the trigger is named generically so future
-- tables can reuse it.
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_courses_updated_at on public.courses;
create trigger trg_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

-- =============================================================================
-- Indexes for query patterns wired up in Sprint 3+
-- =============================================================================
create index if not exists idx_course_modules_course_id      on public.course_modules(course_id);
create index if not exists idx_course_lessons_course_id      on public.course_lessons(course_id);
create index if not exists idx_course_lessons_module_id      on public.course_lessons(module_id);
create index if not exists idx_course_enrollments_user_id    on public.course_enrollments(user_id);
create index if not exists idx_course_enrollments_course_id  on public.course_enrollments(course_id);
create index if not exists idx_lesson_progress_user_course   on public.lesson_progress(user_id, course_id);
create index if not exists idx_quiz_questions_lesson_id      on public.quiz_questions(lesson_id);
create index if not exists idx_quiz_attempts_user_lesson     on public.quiz_attempts(user_id, lesson_id);
