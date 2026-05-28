'use server'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

export type MarkLessonCompleteResult =
  | { status: 'success' }
  | { status: 'unauthorized' }
  | { status: 'not_enrolled' }
  | { status: 'not_configured' }
  | { status: 'not_found' }
  | { status: 'error'; message: string }

/**
 * Mark a lesson complete for the currently signed-in learner.
 *
 * Security:
 *  - Uses the user's own Supabase session. The insert relies on RLS to enforce
 *    "user can only write their own progress, and only while actively
 *    enrolled" — see supabase/sql/0002_course_mvp_rls.sql.
 *  - We additionally pre-validate the course + enrollment here for clearer
 *    error messages.
 *  - Idempotent: a duplicate (user_id, lesson_id) insert is silently ignored
 *    via the unique constraint on lesson_progress.
 */
export async function markLessonComplete(
  courseSlug: string,
  lessonSlug: string,
): Promise<MarkLessonCompleteResult> {
  if (!isSupabaseConfigured()) {
    return { status: 'not_configured' }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { status: 'unauthorized' }
  }

  // Resolve the course (published only).
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', courseSlug)
    .eq('status', 'published')
    .maybeSingle()

  if (courseError || !course) {
    return { status: 'not_found' }
  }

  // Verify enrollment is active. RLS would also block the write, but checking
  // here lets us return a clearer status.
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('status')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle()

  if (!enrollment || enrollment.status !== 'active') {
    return { status: 'not_enrolled' }
  }

  // Resolve the lesson within this course.
  const { data: lesson, error: lessonError } = await supabase
    .from('course_lessons')
    .select('id')
    .eq('course_id', course.id)
    .eq('slug', lessonSlug)
    .maybeSingle()

  if (lessonError || !lesson) {
    return { status: 'not_found' }
  }

  // Idempotent insert. The unique (user_id, lesson_id) constraint makes a
  // repeat click a no-op; we ignore duplicates explicitly so we never surface
  // a 23505 error to the user.
  const { error: insertError } = await supabase.from('lesson_progress').upsert(
    {
      user_id: user.id,
      course_id: course.id,
      lesson_id: lesson.id,
    },
    { onConflict: 'user_id,lesson_id', ignoreDuplicates: true },
  )

  if (insertError) {
    return { status: 'error', message: insertError.message }
  }

  return { status: 'success' }
}
