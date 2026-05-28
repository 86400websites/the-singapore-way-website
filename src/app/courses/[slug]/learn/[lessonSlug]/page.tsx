import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import AccessPending from '@/components/course/AccessPending'
import LessonBody from '@/components/course/LessonBody'
import LessonNav from '@/components/course/LessonNav'
import LessonSidebar from '@/components/course/LessonSidebar'
import MarkCompleteButton from '@/components/course/MarkCompleteButton'
import QuizRunner from '@/components/course/QuizRunner'
import {
  checkCourseAccess,
  computeProgress,
  findLessonContext,
  getCompletedLessonIds,
  getCourseForPlayer,
  getLatestPassedQuizAttempt,
  getQuizQuestionsForLesson,
} from '@/lib/course/queries'
import { pageMetadata } from '@/lib/seo/page-metadata'

export const dynamic = 'force-dynamic'

type LessonPageProps = {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const course = await getCourseForPlayer(slug)
  const context = course ? findLessonContext(course, lessonSlug) : null

  if (!course || !context) {
    return pageMetadata({
      title: 'Lesson not found',
      description: 'This lesson could not be found.',
      path: `/courses/${slug}/learn/${lessonSlug}`,
      noindex: true,
    })
  }

  return pageMetadata({
    title: `${context.lesson.title} — ${course.title}`,
    description: context.lesson.description ?? course.subtitle,
    path: `/courses/${course.slug}/learn/${context.lesson.slug}`,
    noindex: true,
  })
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params

  const course = await getCourseForPlayer(slug)
  if (!course) {
    notFound()
  }

  const context = findLessonContext(course, lessonSlug)
  if (!context) {
    notFound()
  }

  const access = await checkCourseAccess(slug)

  if (access.status === 'logged_out') {
    const next = `/courses/${slug}/learn/${lessonSlug}`
    redirect(`/login?next=${encodeURIComponent(next)}`)
  }

  if (access.status === 'access_pending' || access.status === 'revoked') {
    return (
      <AccessPending
        courseTitle={course.title}
        courseHref={`/courses/${course.slug}`}
        variant={access.status === 'revoked' ? 'revoked' : 'pending'}
        email={access.user?.email ?? null}
      />
    )
  }

  // status === 'enrolled'
  const completedLessonIds = await getCompletedLessonIds(access.courseId, access.user?.id)
  const progress = computeProgress(course, completedLessonIds)
  const isComplete = !!(context.lesson.id && completedLessonIds.has(context.lesson.id))
  const canMarkComplete =
    !!access.courseId && !!context.lesson.id && context.lesson.contentType !== 'quiz'

  const isQuizLesson = context.lesson.contentType === 'quiz'
  const [quizQuestions, latestPassedAttempt] = isQuizLesson
    ? await Promise.all([
        getQuizQuestionsForLesson(access.courseId, context.lesson.id),
        getLatestPassedQuizAttempt(access.courseId, context.lesson.id, access.user?.id),
      ])
    : [[], null]

  const prev = context.prev
    ? {
        title: context.prev.lesson.title,
        href: `/courses/${course.slug}/learn/${context.prev.lesson.slug}`,
      }
    : null
  const next = context.next
    ? {
        title: context.next.lesson.title,
        href: `/courses/${course.slug}/learn/${context.next.lesson.slug}`,
      }
    : null

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[300px_1fr] gap-10 lg:gap-12 xl:gap-16">
          <div className="order-2 lg:order-1">
            <LessonSidebar
              course={course}
              activeLessonSlug={context.lesson.slug}
              completedLessonIds={completedLessonIds}
              progress={progress}
            />
          </div>

          <main className="order-1 lg:order-2 min-w-0">
            <header className="mb-8 md:mb-10">
              <p className="text-[11px] font-bold tracking-[0.14em] text-[#C8102E] uppercase mb-3">
                {context.module.title}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]">
                {context.lesson.title}
              </h1>
              <span className="editorial-rule mt-5" aria-hidden="true" />
              <p className="text-[13px] text-[#888888] mt-5 tabular-nums">
                Lesson {context.position} of {context.total}
                {typeof context.lesson.durationMinutes === 'number' && (
                  <> · {context.lesson.durationMinutes} min</>
                )}
              </p>
            </header>

            {isQuizLesson && quizQuestions.length > 0 ? (
              <QuizRunner
                courseSlug={course.slug}
                lessonSlug={context.lesson.slug}
                questions={quizQuestions}
                initialPassed={latestPassedAttempt}
                nextHref={next?.href ?? null}
              />
            ) : (
              <LessonBody lesson={context.lesson} />
            )}

            {canMarkComplete && (
              <div className="mt-10">
                <MarkCompleteButton
                  courseSlug={course.slug}
                  lessonSlug={context.lesson.slug}
                  isComplete={isComplete}
                  nextHref={next?.href ?? null}
                />
              </div>
            )}

            <LessonNav prev={prev} next={next} />
          </main>
        </div>
      </div>
    </section>
  )
}
