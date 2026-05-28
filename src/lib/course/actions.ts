'use server'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

const QUIZ_PASS_THRESHOLD = 80

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

type QuizQuestionWithKey = {
  id: string
  correct_choice: number
  choices: string[]
}

/**
 * Submit a quiz attempt. The action grades the answers server-side using
 * the full quiz_questions rows (including correct_choice) — the answer key
 * never leaves the server.
 *
 * Side effects:
 *  - Always inserts a quiz_attempts row (append-only history).
 *  - On a passing score (>= 80%), upserts a lesson_progress row so the quiz
 *    counts toward course completion. Idempotent via the unique constraint.
 */
export async function submitQuizAttempt(
  courseSlug: string,
  lessonSlug: string,
  answers: Record<string, number>,
): Promise<SubmitQuizAttemptResult> {
  if (!isSupabaseConfigured()) {
    return { status: 'not_configured' }
  }

  if (!answers || typeof answers !== 'object') {
    return { status: 'invalid_input', message: 'No answers provided.' }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { status: 'unauthorized' }
  }

  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', courseSlug)
    .eq('status', 'published')
    .maybeSingle()

  if (!course) {
    return { status: 'not_found' }
  }

  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('status')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle()

  if (!enrollment || enrollment.status !== 'active') {
    return { status: 'not_enrolled' }
  }

  const { data: lesson } = await supabase
    .from('course_lessons')
    .select('id, content_type')
    .eq('course_id', course.id)
    .eq('slug', lessonSlug)
    .maybeSingle()

  if (!lesson) {
    return { status: 'not_found' }
  }

  if (lesson.content_type !== 'quiz') {
    return { status: 'invalid_input', message: 'This lesson is not a quiz.' }
  }

  // Pull the full question rows (including the answer key) under the user's
  // own session. RLS allows this because they are enrolled.
  const { data: questionRows, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('id, correct_choice, choices')
    .eq('course_id', course.id)
    .eq('lesson_id', lesson.id)

  if (questionsError || !questionRows || questionRows.length === 0) {
    return { status: 'not_found' }
  }

  const questions = questionRows as QuizQuestionWithKey[]
  const questionIds = new Set(questions.map((q) => q.id))

  // Validate the submitted answers. Each key must be a real question for
  // this lesson; each value must be a valid choice index. Unknown question
  // ids are rejected to prevent payload tampering from spoofing extra
  // "correct" answers; partial submissions are accepted and the missing
  // questions count as wrong.
  for (const [qid, choiceIndex] of Object.entries(answers)) {
    if (!questionIds.has(qid)) {
      return { status: 'invalid_input', message: 'Unknown question id in submission.' }
    }
    if (!Number.isInteger(choiceIndex) || choiceIndex < 0) {
      return { status: 'invalid_input', message: 'Invalid choice index.' }
    }
    const question = questions.find((q) => q.id === qid)
    if (!question || choiceIndex >= question.choices.length) {
      return { status: 'invalid_input', message: 'Choice index out of range.' }
    }
  }

  // Grade server-side.
  let correctCount = 0
  for (const q of questions) {
    if (answers[q.id] === q.correct_choice) {
      correctCount += 1
    }
  }
  const total = questions.length
  const score = Math.round((correctCount / total) * 100)
  const passed = score >= QUIZ_PASS_THRESHOLD

  // Append the attempt. The answers payload is stored as-is for audit.
  const { error: attemptInsertError } = await supabase.from('quiz_attempts').insert({
    user_id: user.id,
    course_id: course.id,
    lesson_id: lesson.id,
    score,
    passed,
    answers,
  })

  if (attemptInsertError) {
    return { status: 'error', message: attemptInsertError.message }
  }

  // On pass, also mark the quiz lesson complete so it counts in the
  // course-completion calculation. Idempotent.
  if (passed) {
    const { error: progressError } = await supabase.from('lesson_progress').upsert(
      {
        user_id: user.id,
        course_id: course.id,
        lesson_id: lesson.id,
      },
      { onConflict: 'user_id,lesson_id', ignoreDuplicates: true },
    )

    if (progressError) {
      // The attempt is recorded; the progress write failing is unusual but
      // surface a clear error so the learner can retry. Their score is not
      // lost — the attempt is in the history.
      return { status: 'error', message: progressError.message }
    }
  }

  return { status: 'success', score, passed, total, correct: correctCount }
}
