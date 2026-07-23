import 'server-only'

import type { User } from '@supabase/supabase-js'

import { getCourseBySlug as getLocalCourseBySlug } from '@/data/course'
import type {
  Course,
  CourseLessonContentType,
  CourseLessonPreview,
  CourseModulePreview,
  OwnCertificate,
  PublicCertificate,
  QuizPassedSummary,
  QuizQuestionForClient,
} from '@/lib/course/types'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

// =============================================================================
// Access check — sign-in only.
//
// Manual enrollment was removed in 0005. Any signed-in user has access to the
// course player, quizzes, progress writes, and certificate flows. The
// course_enrollments table is left in place for possible future use but is
// not consulted by any runtime path.
// =============================================================================

export type CourseAccessStatus =
  | 'logged_out' // No Supabase session. Caller should redirect to /login.
  | 'signed_in'  // Authenticated. Full course access.

export type CourseAccessResult = {
  status: CourseAccessStatus
  user: User | null
  // The Supabase course id (UUID) when it could be resolved. Used by
  // downstream owner-scoped reads (lesson_progress, certificates).
  courseId?: string
}

export async function checkCourseAccess(courseSlug: string): Promise<CourseAccessResult> {
  if (!isSupabaseConfigured()) {
    // Without auth wiring the only safe answer is logged_out — the page sends
    // the visitor to /login, which itself shows AuthUnavailableNotice when env
    // vars are missing. Matches the pattern in /account, /signup, /login.
    return { status: 'logged_out', user: null }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { status: 'logged_out', user: null }
  }

  // Resolve the course row so callers can use its id for owner-scoped reads
  // (lesson_progress, certificates). When the seed has not been applied yet
  // the id is left undefined and the player falls back to local data.
  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', courseSlug)
    .eq('status', 'published')
    .maybeSingle()

  return { status: 'signed_in', user, courseId: course?.id }
}

// =============================================================================
// Curriculum adapter.
//
// In DB mode (Supabase configured + course row exists), we call the
// get_published_curriculum SECURITY DEFINER RPC, which returns a flat row per
// lesson with NO content / video_url. That is the only path anon traverses.
//
// In local-data fallback mode (Supabase not configured, or DB seed not
// applied), we return the typed local record so the UI is reviewable in dev
// environments before the SQL is applied.
// =============================================================================

type DbCurriculumRow = {
  course_id: string
  course_slug: string
  course_title: string
  course_subtitle: string | null
  course_description: string | null
  module_id: string
  module_title: string
  module_description: string | null
  module_position: number
  lesson_id: string
  lesson_slug: string
  lesson_title: string
  lesson_description: string | null
  lesson_content_type: CourseLessonContentType
  lesson_position: number
  lesson_is_required: boolean
}

export async function getCourseForPlayer(slug: string): Promise<Course | null> {
  if (isSupabaseConfigured()) {
    const dbCourse = await readCourseFromSupabase(slug)
    if (dbCourse) {
      return dbCourse
    }
  }

  // Fallback: local typed data. Same shape, no DB ids.
  return getLocalCourseBySlug(slug) ?? null
}

async function readCourseFromSupabase(slug: string): Promise<Course | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_published_curriculum', {
    p_course_slug: slug,
  })

  if (error || !data) return null

  const rows = (Array.isArray(data) ? data : [data]) as DbCurriculumRow[]
  if (rows.length === 0) return null

  // The landing page copy (`landing`) is not in the DB schema by design — it
  // is marketing content that lives next to the codebase. We borrow it from
  // the local typed record. If the slug isn't in the local data, we can't
  // render a useful landing page, so return null.
  const localCourse = getLocalCourseBySlug(slug)
  if (!localCourse) return null

  // First row carries all the course-level fields; they repeat per lesson row.
  const head = rows[0]

  const modulesById = new Map<string, CourseModulePreview>()
  for (const row of rows) {
    let module_ = modulesById.get(row.module_id)
    if (!module_) {
      module_ = {
        id: row.module_id,
        // Modules have no DB slug; the id makes a stable React key.
        slug: row.module_id,
        title: row.module_title,
        description: row.module_description ?? undefined,
        lessons: [],
      }
      modulesById.set(row.module_id, module_)
    }

    const lesson: CourseLessonPreview = {
      id: row.lesson_id,
      slug: row.lesson_slug,
      title: row.lesson_title,
      description: row.lesson_description ?? undefined,
      contentType: row.lesson_content_type,
      isRequired: row.lesson_is_required,
      // Deliberately not populated from DB mode — content/video_url come from
      // get_signed_in_lesson_body() on the player page, which is sign-in gated.
    }
    module_.lessons.push(lesson)
  }

  const modules = Array.from(modulesById.values())

  return {
    id: head.course_id,
    slug: head.course_slug,
    title: head.course_title,
    subtitle: head.course_subtitle ?? localCourse.subtitle,
    description: head.course_description ?? localCourse.description,
    status: 'published',
    modules,
    landing: localCourse.landing,
  }
}

/**
 * Sign-in-only fetch for an individual lesson's body. Calls the
 * get_signed_in_lesson_body() SECURITY DEFINER RPC, which returns zero rows
 * when the caller is not authenticated.
 *
 * The player page calls this only after verifying access; it remains the
 * only path by which content / video_url reaches the server-rendered HTML.
 */
export async function getSignedInLessonBody(
  courseSlug: string,
  lessonSlug: string,
): Promise<{ content: string | null; videoUrl: string | null } | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_signed_in_lesson_body', {
    p_course_slug: courseSlug,
    p_lesson_slug: lessonSlug,
  })

  if (error || !data) return null

  const rows = (Array.isArray(data) ? data : [data]) as Array<{
    content: string | null
    video_url: string | null
  }>
  if (rows.length === 0) return null

  return { content: rows[0].content, videoUrl: rows[0].video_url }
}

// =============================================================================
// Progress
// =============================================================================

/**
 * Returns the set of lesson UUIDs that the given user has completed for the
 * given course. Used to render checkmarks in the sidebar and to compute
 * progress percentage.
 *
 * Returns an empty set when Supabase is not configured, when no course id is
 * available (DB seed not applied yet), or when the read fails — completion is
 * non-essential UI and should degrade silently rather than block the player.
 */
export async function getCompletedLessonIds(
  courseId: string | undefined,
  userId: string | undefined,
): Promise<Set<string>> {
  if (!isSupabaseConfigured() || !courseId || !userId) {
    return new Set()
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('course_id', courseId)

  if (error || !data) {
    return new Set()
  }

  return new Set(data.map((row) => row.lesson_id as string))
}

export type CourseProgress = {
  requiredTotal: number
  requiredCompleted: number
  percent: number
}

export function computeProgress(course: Course, completed: Set<string>): CourseProgress {
  const required = course.modules
    .flatMap((m) => m.lessons)
    .filter((l) => l.isRequired)
  const total = required.length
  const done = required.filter((l) => l.id && completed.has(l.id)).length
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  return { requiredTotal: total, requiredCompleted: done, percent }
}

export function isCourseComplete(course: Course, completed: Set<string>): boolean {
  const p = computeProgress(course, completed)
  return p.requiredTotal > 0 && p.requiredCompleted >= p.requiredTotal
}

// =============================================================================
// Quizzes
// =============================================================================

/**
 * Fetch the questions for a quiz lesson via the
 * get_signed_in_quiz_questions() SECURITY DEFINER RPC. The RPC returns ONLY
 * id, question, choices, question_position — `correct_choice` is never
 * selected, never serialised, and never reaches the browser.
 *
 * The RPC returns `question_position` (renamed from `position` to avoid the
 * SQL reserved-word issue that broke 0004). We map it back to `position` here
 * so the rest of the codebase keeps a single field name.
 */
export async function getQuizQuestionsForLesson(
  courseSlug: string,
  lessonSlug: string,
): Promise<QuizQuestionForClient[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_signed_in_quiz_questions', {
    p_course_slug: courseSlug,
    p_lesson_slug: lessonSlug,
  })

  if (error || !data) return []

  const rows = (Array.isArray(data) ? data : [data]) as Array<{
    id: string
    question: string
    choices: string[]
    question_position: number
  }>

  return rows.map((row) => ({
    id: row.id,
    question: row.question,
    choices: row.choices ?? [],
    position: row.question_position,
  }))
}

/**
 * Returns the most recent passing attempt for a quiz lesson, or null when
 * there is none. Used to render the "Quiz passed" banner.
 *
 * Reads quiz_attempts directly under the user's session — the owner SELECT
 * policy from 0002 still grants this. Write access was moved behind
 * submit_quiz_attempt() in 0005 (and previously 0004).
 */
export async function getLatestPassedQuizAttempt(
  courseId: string | undefined,
  lessonId: string | undefined,
  userId: string | undefined,
): Promise<QuizPassedSummary | null> {
  if (!isSupabaseConfigured() || !courseId || !lessonId || !userId) {
    return null
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('score, created_at')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('lesson_id', lessonId)
    .eq('passed', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  return { score: data.score as number, passedAt: data.created_at as string }
}

// =============================================================================
// Certificates
// =============================================================================

/**
 * Read the user's own certificate row for a course, if one exists.
 * RLS allows users to read only their own certificates.
 */
export async function getOwnCertificate(
  courseId: string | undefined,
  userId: string | undefined,
): Promise<OwnCertificate | null> {
  if (!isSupabaseConfigured() || !courseId || !userId) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('certificates')
    .select('id, issued_at')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (error || !data) return null
  return { id: data.id as string, issuedAt: data.issued_at as string }
}

export type IssueCertificateResult =
  | { status: 'issued'; id: string; issuedAt: string }
  | { status: 'incomplete'; message: string }
  | { status: 'name_required' }
  | { status: 'unauthorized' }
  | { status: 'not_configured' }
  | { status: 'error'; message: string }

/**
 * Call the issue_certificate() security-definer RPC. The function re-verifies
 * completion server-side and inserts a row, idempotent on existing certs.
 *
 * The page should only call this when completion is already locally confirmed.
 * The RPC's exception path is the authoritative defence; this helper translates
 * those exceptions into a typed result.
 */
export async function issueCertificate(courseId: string): Promise<IssueCertificateResult> {
  if (!isSupabaseConfigured()) {
    return { status: 'not_configured' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('issue_certificate', {
    p_course_id: courseId,
  })

  if (error) {
    const message = error.message ?? ''
    if (message.includes('Not authenticated')) return { status: 'unauthorized' }
    if (message.includes('Full name required')) return { status: 'name_required' }
    if (message.includes('Course not complete')) {
      return { status: 'incomplete', message }
    }
    return { status: 'error', message }
  }

  if (!data) {
    return { status: 'error', message: 'No certificate returned by issue_certificate.' }
  }

  // The RPC returns a single certificates row. Supabase typing for rpc() is
  // unknown by default; we narrow here.
  const row = data as { id: string; issued_at: string }
  return { status: 'issued', id: row.id, issuedAt: row.issued_at }
}

/**
 * Fetch the public-safe projection of a certificate by id, via the
 * get_public_certificate() security-definer RPC. Exposes ONLY course title,
 * learner display name, certificate id, and issued date — never user_id,
 * never email, never progress detail.
 */
export async function getPublicCertificate(
  certificateId: string,
): Promise<PublicCertificate | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_public_certificate', {
    certificate_id: certificateId,
  })

  if (error || !data) return null

  // The RPC returns `returns table (...)` which surfaces as an array.
  const rows = Array.isArray(data) ? data : [data]
  if (rows.length === 0) return null

  const row = rows[0] as {
    id: string
    course_title: string
    learner_display_name: string
    issued_at: string
  }

  return {
    id: row.id,
    courseTitle: row.course_title,
    learnerDisplayName: row.learner_display_name,
    issuedAt: row.issued_at,
  }
}

/**
 * Display name shown on the LEARNER'S OWN certificate (not the public verify
 * page). Falls back to "Learner" rather than the email local-part so a
 * shoulder-surfer cannot read an email-like string off a printed cert.
 *
 * For the public verify page, the display name comes from
 * get_public_certificate() and is computed in SQL.
 */
export function getLearnerDisplayName(user: {
  email?: string | null
  user_metadata?: { full_name?: string | null } | null | undefined
}): string {
  const raw = user.user_metadata?.full_name
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  if (trimmed) return trimmed
  return 'Learner'
}

/**
 * True when the learner's stored full name is meaningful — non-blank and not
 * one of the generic fallback strings. Mirrors the authoritative gate inside
 * the issue_certificate() RPC (0007): the UI uses this to decide whether to
 * request a name before issuing/displaying the certificate.
 */
export function hasMeaningfulLearnerName(user: {
  user_metadata?: { full_name?: string | null } | null | undefined
}): boolean {
  const raw = user.user_metadata?.full_name
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  if (!trimmed) return false
  const lowered = trimmed.toLowerCase()
  return lowered !== 'learner' && lowered !== 'verified learner'
}

// =============================================================================
// Lesson navigation helpers
// =============================================================================

export type FlatLesson = {
  module: CourseModulePreview
  lesson: CourseLessonPreview
}

export function flattenLessons(course: Course): FlatLesson[] {
  return course.modules.flatMap((m) => m.lessons.map((lesson) => ({ module: m, lesson })))
}

export function findLessonContext(course: Course, lessonSlug: string) {
  const flat = flattenLessons(course)
  const index = flat.findIndex((entry) => entry.lesson.slug === lessonSlug)
  if (index === -1) return null

  const current = flat[index]
  const prev = index > 0 ? flat[index - 1] : null
  const next = index < flat.length - 1 ? flat[index + 1] : null

  return { ...current, prev, next, position: index + 1, total: flat.length }
}
