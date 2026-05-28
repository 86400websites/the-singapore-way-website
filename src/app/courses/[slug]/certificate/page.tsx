import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import AccessPending from '@/components/course/AccessPending'
import CertificateView from '@/components/course/CertificateView'
import {
  checkCourseAccess,
  computeProgress,
  getCompletedLessonIds,
  getCourseForPlayer,
  getLearnerDisplayName,
  getOwnCertificate,
  isCourseComplete,
  issueCertificate,
} from '@/lib/course/queries'
import { pageMetadata } from '@/lib/seo/page-metadata'

export const dynamic = 'force-dynamic'

type CertificatePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseForPlayer(slug)
  return pageMetadata({
    title: course ? `Certificate — ${course.title}` : 'Certificate',
    description:
      course?.subtitle ?? 'Your certificate of completion for the book companion course.',
    path: `/courses/${slug}/certificate`,
    noindex: true,
  })
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { slug } = await params

  const course = await getCourseForPlayer(slug)
  if (!course) {
    notFound()
  }

  const access = await checkCourseAccess(slug)

  if (access.status === 'logged_out') {
    redirect(`/login?next=${encodeURIComponent(`/courses/${slug}/certificate`)}`)
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
  if (!access.user || !access.courseId) {
    // Can only happen when the course row hasn't been seeded yet.
    return <NotConfiguredState courseTitle={course.title} courseHref={`/courses/${course.slug}`} />
  }

  const completed = await getCompletedLessonIds(access.courseId, access.user.id)
  const progress = computeProgress(course, completed)
  const complete = isCourseComplete(course, completed)

  // Try to read an existing certificate first.
  let cert = await getOwnCertificate(access.courseId, access.user.id)

  // If complete but no certificate yet, issue one. The RPC re-verifies
  // completion server-side and is idempotent.
  let issueError: string | null = null
  if (!cert && complete) {
    const result = await issueCertificate(access.courseId)
    if (result.status === 'issued') {
      cert = { id: result.id, issuedAt: result.issuedAt }
    } else if (result.status === 'incomplete') {
      // Race: progress changed between check and call. Treat as incomplete.
    } else {
      issueError = (() => {
        switch (result.status) {
          case 'unauthorized':
            return 'Your session has expired. Please sign in again.'
          case 'not_enrolled':
            return 'Your enrollment is not active.'
          case 'not_configured':
            return 'Certificates are not available right now.'
          case 'error':
            return result.message
          default:
            return 'Could not issue your certificate. Please try again.'
        }
      })()
    }
  }

  if (cert) {
    return (
      <section className="bg-[#fbf5f2]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <header className="mb-8 md:mb-10 text-center">
            <p className="eyebrow mb-3">Certificate earned</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]">
              Well done.
            </h1>
            <p className="lede mt-4 max-w-xl mx-auto">
              Your completion of <strong>{course.title}</strong> is on the record.
              Share the public verification URL to let anyone confirm it.
            </p>
          </header>

          <CertificateView
            certificateId={cert.id}
            courseTitle={course.title}
            learnerName={getLearnerDisplayName(access.user)}
            issuedAt={cert.issuedAt}
            variant="own"
          />

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link href={`/courses/${course.slug}`} className="btn-pill-outline">
              Back to course
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Either course is incomplete, or issuance failed.
  return (
    <IncompleteCertificateState
      courseTitle={course.title}
      courseSlug={course.slug}
      requiredTotal={progress.requiredTotal}
      requiredCompleted={progress.requiredCompleted}
      percent={progress.percent}
      issueError={issueError}
    />
  )
}

function IncompleteCertificateState({
  courseTitle,
  courseSlug,
  requiredTotal,
  requiredCompleted,
  percent,
  issueError,
}: {
  courseTitle: string
  courseSlug: string
  requiredTotal: number
  requiredCompleted: number
  percent: number
  issueError: string | null
}) {
  const remaining = Math.max(0, requiredTotal - requiredCompleted)

  return (
    <section className="bg-[#fbf5f2] min-h-[calc(100vh-70px)] flex items-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="card-editorial p-10 md:p-14 text-center">
          <span
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fbf5f2] border border-[#F0E5DF] mb-8"
            aria-hidden="true"
          >
            <svg className="w-7 h-7 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <p className="eyebrow mb-4">Certificate pending</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em] mb-5">
            Almost there.
          </h1>
          <span className="editorial-rule mx-auto mb-7" aria-hidden="true" />
          <p className="lede mb-8 max-w-xl mx-auto">
            Your certificate for <strong>{courseTitle}</strong> will be issued automatically once
            you complete every required lesson and pass every required quiz.
          </p>

          <div className="mx-auto max-w-md text-left mb-9">
            <div className="flex items-center justify-between text-[13px] text-[#444444]">
              <span className="font-bold tabular-nums">{percent}% complete</span>
              <span className="tabular-nums text-[#888888]">
                {requiredCompleted} / {requiredTotal} required items done
              </span>
            </div>
            <div
              className="mt-2 h-1.5 rounded-full bg-[#ECECEC] overflow-hidden"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Course progress"
            >
              <div
                className="h-full bg-[#0a8553] transition-[width] duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-4 text-[13px] text-[#666666]">
              {remaining > 0
                ? `${remaining} required item${remaining === 1 ? '' : 's'} still to complete.`
                : 'All required items appear complete. Try refreshing in a moment.'}
            </p>
          </div>

          {issueError && (
            <p role="alert" className="text-sm text-[#C8102E] mb-6">
              {issueError}
            </p>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={`/courses/${courseSlug}`} className="btn-pill">
              Continue the course
            </Link>
            <Link href={`/courses/${courseSlug}`} className="btn-pill-outline">
              Back to course page
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function NotConfiguredState({
  courseTitle,
  courseHref,
}: {
  courseTitle: string
  courseHref: string
}) {
  return (
    <section className="bg-[#fbf5f2] min-h-[calc(100vh-70px)] flex items-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="card-editorial p-10 md:p-14 text-center">
          <p className="eyebrow mb-4">Certificate unavailable</p>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em] mb-5">
            Certificate is being prepared.
          </h1>
          <span className="editorial-rule mx-auto mb-7" aria-hidden="true" />
          <p className="lede mb-9 max-w-xl mx-auto">
            <strong>{courseTitle}</strong> is not yet fully configured for certificate issuance.
            Check back shortly.
          </p>
          <Link href={courseHref} className="btn-pill">
            Back to course page
          </Link>
        </div>
      </div>
    </section>
  )
}
