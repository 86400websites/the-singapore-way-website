'use server'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

export type MarkLessonCompleteResult =
  | { status: 'success' }
  | { status: 'unauthorized' }
  | { status: 'not_configured' }
  | { status: 'not_found' }
  | { status: 'error'; message: string }

/**
 * Mark a NON-quiz lesson complete for the currently signed-in learner.
 *
 * Server-side: thin wrapper over mark_lesson_complete(), the SECURITY DEFINER
 * RPC introduced in 0005. The RPC re-verifies auth, the course/lesson
 * resolution, and that the lesson is not a quiz. Direct INSERT into
 * lesson_progress is not permitted by RLS — the RPC is the only writer.
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
  | { status: 'not_configured' }
  | { status: 'not_found' }
  | { status: 'invalid_input'; message: string }
  | { status: 'error'; message: string }

/**
 * Submit a quiz attempt. Thin wrapper over submit_quiz_attempt(), the
 * SECURITY DEFINER RPC introduced in 0005.
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

// =============================================================================
// Learner name (certificate)
// =============================================================================

export type UpdateLearnerNameResult =
  | { status: 'success' }
  | { status: 'unauthorized' }
  | { status: 'not_configured' }
  | { status: 'invalid_input'; message: string }
  | { status: 'error' }

const LEARNER_NAME_MAX_LENGTH = 80

/**
 * Set the signed-in learner's display name (user_metadata.full_name), used on
 * their certificate and its public verification page.
 *
 * The learner updates only their own auth record through their own session —
 * no privileged key is involved and nothing beyond full_name is written.
 */
export async function updateLearnerName(
  fullName: string,
): Promise<UpdateLearnerNameResult> {
  if (!isSupabaseConfigured()) {
    return { status: 'not_configured' }
  }

  if (typeof fullName !== 'string') {
    return { status: 'invalid_input', message: 'Please enter your name.' }
  }

  // Strip control characters and collapse runs of whitespace so the stored
  // name renders predictably on the certificate and in print.
  const cleaned = fullName
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) {
    return { status: 'invalid_input', message: 'Please enter your name.' }
  }
  if (cleaned.length > LEARNER_NAME_MAX_LENGTH) {
    return {
      status: 'invalid_input',
      message: `Please keep your name under ${LEARNER_NAME_MAX_LENGTH} characters.`,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { status: 'unauthorized' }
  }

  const { error } = await supabase.auth.updateUser({
    data: { full_name: cleaned },
  })
  if (error) {
    return { status: 'error' }
  }

  return { status: 'success' }
}
