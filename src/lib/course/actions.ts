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
 * Mark a NON-quiz lesson complete for the currently signed-in learner.
 *
 * Server-side: thin wrapper over mark_lesson_complete(), the SECURITY DEFINER
 * RPC introduced in 0004. The RPC re-verifies auth, the course/lesson
 * resolution, enrollment status, and that the lesson is not a quiz. Direct
 * INSERT into lesson_progress is no longer permitted by RLS.
 */
export async function markLessonComplete(
  courseSlug: string,
  lessonSlug: string,
): Promise<MarkLessonCompleteResult> {
  if (!isSupabaseConfigured()) {
    return { status: 'not_configured' }
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc('mark_lesson_complete', {
    p_course_slug: courseSlug,
    p_lesson_slug: lessonSlug,
  })

  if (error) {
    const message = error.message ?? ''
    if (message.includes('Not authenticated')) return { status: 'unauthorized' }
    if (message.includes('Not enrolled')) return { status: 'not_enrolled' }
    if (message.includes('Lesson not found')) return { status: 'not_found' }
    // The quiz-lessons-must-be-submitted path surfaces as a generic error —
    // the UI hides the Mark Complete button on quiz lessons, so reaching
    // here means a client crafted a request to a quiz lesson slug.
    return { status: 'error', message }
  }

  return { status: 'success' }
}

// =============================================================================
// Quizzes
// =============================================================================

export type SubmitQuizAttemptResult =
  | { status: 'success'; score: number; passed: boolean; total: number; correct: number }
  | { status: 'unauthorized' }
  | { status: 'not_enrolled' }
  | { status: 'not_configured' }
  | { status: 'not_found' }
  | { status: 'invalid_input'; message: string }
  | { status: 'error'; message: string }

/**
 * Submit a quiz attempt. Thin wrapper over submit_quiz_attempt(), the
 * SECURITY DEFINER RPC introduced in 0004.
 *
 * The RPC grades the submitted answers against the DB-side correct_choice
 * column, computes score and pass/fail (80% threshold), inserts the attempt,
 * and on a passing score idempotently marks the quiz lesson complete. The
 * client never receives the answer key and cannot influence the score or
 * passed flag.
 */
export async function submitQuizAttempt(
  courseSlug: string,
  lessonSlug: string,
  answers: Record<string, number>,
): Promise<SubmitQuizAttemptResult> {
  if (!isSupabaseConfigured()) {
    return { status: 'not_configured' }
  }

  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return { status: 'invalid_input', message: 'No answers provided.' }
  }

  // Cheap shape guard before the RPC: every value must be a non-negative
  // integer index. The RPC re-validates against the DB; this just avoids a
  // wasteful round-trip when the payload is obviously wrong.
  for (const value of Object.values(answers)) {
    if (!Number.isInteger(value) || value < 0) {
      return { status: 'invalid_input', message: 'Invalid choice index.' }
    }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('submit_quiz_attempt', {
    p_course_slug: courseSlug,
    p_lesson_slug: lessonSlug,
    p_answers: answers,
  })

  if (error) {
    const message = error.message ?? ''
    if (message.includes('Not authenticated')) return { status: 'unauthorized' }
    if (message.includes('Not enrolled')) return { status: 'not_enrolled' }
    if (
      message.includes('Quiz lesson not found') ||
      message.includes('Quiz has no questions')
    ) {
      return { status: 'not_found' }
    }
    if (message.includes('Invalid answers payload')) {
      return { status: 'invalid_input', message: 'Invalid answers payload.' }
    }
    return { status: 'error', message }
  }

  const rows = (Array.isArray(data) ? data : data ? [data] : []) as Array<{
    score: number
    passed: boolean
    total: number
    correct: number
  }>
  if (rows.length === 0) {
    return { status: 'error', message: 'No grading result returned.' }
  }

  const result = rows[0]
  return {
    status: 'success',
    score: result.score,
    passed: result.passed,
    total: result.total,
    correct: result.correct,
  }
}
