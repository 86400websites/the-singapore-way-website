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
// Access check — auth + enrollment in one shot.
// =============================================================================

export type CourseAccessStatus =
  | 'logged_out'        // No Supabase session. Caller should redirect to /login.
  | 'access_pending'    // Logged in, but no active enrollment exists for this course yet.
  | 'enrolled'          // Logged in with an active enrollment.
  | 'revoked'           // Logged in but enrollment is explicitly revoked.

export type CourseAccessResult = {
  status: CourseAccessStatus
  user: User | null
  // The Supabase course id (UUID) when it could be resolved. May be undefined if
  // the SQL has not been applied yet to the connected Supabase project, in
  // which case we still attempt to render the player from local data so the UI
  // is reviewable in dev environments before the seed is applied.
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

  const { data: course } = await supabase
    .from('courses')
    .select('id, status')
    .eq('slug', courseSlug)
    .eq('status', 'published')
    .maybeSingle()

  // The Supabase course row may not exist yet (seed not applied). In that case
  // we cannot verify enrollment, so we surface access_pending — the page will
  // show the friendly waiting state instead of crashing on a join.
  if (!course) {
    return { status: 'access_pending', user }
  }

  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('status')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .maybeSingle()

  if (!enrollment) {
    return { status: 'access_pending', user, courseId: course.id }
  }

  if (enrollment.status === 'revoked') {
    return { status: 'revoked', user, courseId: course.id }
  }

  return { status: 'enrolled', user, courseId: course.id }
}

// =============================================================================
// Curriculum adapter — read from Supabase when the seed exists, else fall back
// to the typed local data so the UI is reviewable in dev environments before
// the SQL is applied to the connected project.
// =============================================================================

type DbCourseRow = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string | null
  status: 'draft' | 'published'
}

type DbModuleRow = {
  id: string
  course_id: string
  title: string
  description: string | null
  position: number
}

type DbLessonRow = {
  id: string
  course_id: string
  module_id: string
  slug: string
  title: string
  description: string | null
  content_type: CourseLessonContentType
  content: string | null
  video_url: string | null
  position: number
  is_required: boolean
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

  const { data: courseRow, error: courseError } = await supabase
    .from('courses')
    .select('id, slug, title, subtitle, description, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle<DbCourseRow>()

  if (courseError || !courseRow) {
    return null
  }

  const { data: moduleRows, error: moduleError } = await supabase
    .from('course_modules')
    .select('id, course_id, title, description, position')
    .eq('course_id', courseRow.id)
    .order('position', { ascending: true })

  if (moduleError || !moduleRows) {
    return null
  }

  const { data: lessonRows, error: lessonError } = await supabase
    .from('course_lessons')
    .select(
      'id, course_id, module_id, slug, title, description, content_type, content, video_url, position, is_required',
    )
    .eq('course_id', courseRow.id)
    .order('position', { ascending: true })

  if (lessonError || !lessonRows) {
    return null
  }

  // Marketing-only fields. The DB schema doesn't track landing copy, so we
  // borrow it from the local typed record. The course must exist locally for
  // its landing copy; this is a deliberate constraint of the MVP.
  const localCourse = getLocalCourseBySlug(slug)
  if (!localCourse) {
    return null
  }

  const modules: CourseModulePreview[] = (moduleRows as DbModuleRow[]).map((m) => {
    const lessons: CourseLessonPreview[] = (lessonRows as DbLessonRow[])
      .filter((l) => l.module_id === m.id)
      .map((l) => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        description: l.description ?? undefined,
        contentType: l.content_type,
        isRequired: l.is_required,
        content: l.content,
        videoUrl: l.video_url,
      }))

    return {
      id: m.id,
      // Modules have no DB slug; keep the title as a stable React key.
      slug: m.id,
      title: m.title,
      description: m.description ?? undefined,
      lessons,
    }
  })

  return {
    id: courseRow.id,
    slug: courseRow.slug,
    title: courseRow.title,
    subtitle: courseRow.subtitle ?? localCourse.subtitle,
    description: courseRow.description ?? localCourse.description,
    status: courseRow.status,
    modules,
    landing: localCourse.landing,
  }
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
 * Fetch the questions for a quiz lesson, projected for client rendering.
 * The `correct_choice` column is deliberately NOT selected — the answer key
 * never travels to the browser. RLS already blocks unenrolled reads.
 */
export async function getQuizQuestionsForLesson(
  courseId: string | undefined,
  lessonId: string | undefined,
): Promise<QuizQuestionForClient[]> {
  if (!isSupabaseConfigured() || !courseId || !lessonId) {
    return []
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id, question, choices, position')
    .eq('course_id', courseId)
    .eq('lesson_id', lessonId)
    .order('position', { ascending: true })

  if (error || !data) return []

  return data.map((row) => ({
    id: row.id as string,
    question: row.question as string,
    choices: (row.choices as string[]) ?? [],
    position: row.position as number,
  }))
}

/**
 * Returns the most recent passing attempt for a quiz lesson, or null when
 * there is none. Used to render the "Quiz passed" banner.
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
  | { status: 'unauthorized' }
  | { status: 'not_enrolled' }
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
    if (message.includes('Not enrolled')) return { status: 'not_enrolled' }
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
 * Derive the display name shown on the learner's own certificate from their
 * Supabase user record. Falls back to the email local-part when no full_name
 * metadata is set. Mirrors the SQL fallback in get_public_certificate().
 */
export function getLearnerDisplayName(user: {
  email?: string | null
  user_metadata?: { full_name?: string | null } | null | undefined
}): string {
  const raw = user.user_metadata?.full_name
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  if (trimmed) return trimmed
  if (user.email) {
    const local = user.email.split('@')[0]
    if (local) return local
  }
  return 'Learner'
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
