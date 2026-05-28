import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import AuthUnavailableNotice from '@/components/AuthUnavailableNotice'
import MyLearningCard from '@/components/course/MyLearningCard'
import PageHero from '@/components/PageHero'
import { COURSE_SLUG } from '@/data/course'
import {
  checkCourseAccess,
  computeProgress,
  getCompletedLessonIds,
  getCourseForPlayer,
  getOwnCertificate,
} from '@/lib/course/queries'
import type { Course } from '@/lib/course/types'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  title: 'My Learning',
  description: 'Your courses with The Singapore Way.',
  path: '/my-learning',
  noindex: true,
})

export default async function MyLearningPage() {
  if (!isSupabaseConfigured()) {
    return <AuthUnavailableNotice />
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/my-learning')
  }

  const course = await getCourseForPlayer(COURSE_SLUG)
  if (!course) {
    return <CourseUnavailableState />
  }

  const access = await checkCourseAccess(COURSE_SLUG)

  const [completed, certificate] = await Promise.all([
    getCompletedLessonIds(access.courseId, user.id),
    getOwnCertificate(access.courseId, user.id),
  ])

  const progress = computeProgress(course, completed)
  const continueHref = computeContinueHref(course, completed)

  return (
    <>
      <PageHero
        eyebrow="My Learning"
        title="Pick up where you left off."
        description="Your bundled book companion course, in one place."
        variant="light"
      />
      <section className="bg-[#F5F5F5] border-t border-[#ECECEC] py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <MyLearningCard
            course={course}
            progress={progress}
            certificate={certificate}
            continueHref={continueHref}
          />
        </div>
      </section>
    </>
  )
}

/**
 * Compute the most useful destination for the dashboard's primary CTA:
 * the first required, not-yet-completed lesson. When everything is already
 * complete, point at the first lesson (so "Revisit course" still works).
 */
function computeContinueHref(course: Course, completed: Set<string>): string {
  for (const module_ of course.modules) {
    for (const lesson of module_.lessons) {
      if (!lesson.isRequired) continue
      if (!lesson.id || !completed.has(lesson.id)) {
        return `/courses/${course.slug}/learn/${lesson.slug}`
      }
    }
  }
  const firstLesson = course.modules[0]?.lessons[0]
  return firstLesson
    ? `/courses/${course.slug}/learn/${firstLesson.slug}`
    : `/courses/${course.slug}`
}

function CourseUnavailableState() {
  return (
    <>
      <PageHero
        eyebrow="My Learning"
        title="Nothing here yet."
        description="Your courses will appear here once they are available."
        variant="light"
      />
      <section className="bg-[#F5F5F5] border-t border-[#ECECEC] py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="btn-pill">
            Back to home
          </Link>
        </div>
      </section>
    </>
  )
}
