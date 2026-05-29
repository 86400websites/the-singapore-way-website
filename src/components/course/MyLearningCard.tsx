import Link from 'next/link'

import type { CourseProgress } from '@/lib/course/queries'
import type { Course, OwnCertificate } from '@/lib/course/types'

type MyLearningCardProps = {
  course: Course
  progress: CourseProgress
  certificate: OwnCertificate | null
  continueHref: string
}

export default function MyLearningCard({
  course,
  progress,
  certificate,
  continueHref,
}: MyLearningCardProps) {
  const courseHref = `/courses/${course.slug}`
  const certHref = `/courses/${course.slug}/certificate`

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const totalQuizzes = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.contentType === 'quiz').length,
    0,
  )

  const hasItems = progress.requiredTotal > 0
  const notStarted = hasItems && progress.requiredCompleted === 0
  const completed = hasItems && progress.requiredCompleted >= progress.requiredTotal

  const statusBadge = completed
    ? { label: 'Completed', tone: 'success' as const }
    : notStarted
      ? { label: 'Not started', tone: 'neutral' as const }
      : { label: 'In progress', tone: 'brand' as const }

  return (
    <article className="card-editorial p-8 md:p-10">
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <p className="eyebrow">Your course</p>
        <StatusBadge label={statusBadge.label} tone={statusBadge.tone} />
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-3">
        {course.title}
      </h2>
      <p className="prose-body mb-4 max-w-xl">{course.subtitle}</p>
      <p className="text-[13px] text-[#666666] mb-6 tabular-nums">
        {course.modules.length} modules · {totalLessons} lessons · {totalQuizzes} quizzes
      </p>

      {hasItems && (
        <div className="mb-7 max-w-md" role="group" aria-label="Course progress">
          <div className="flex items-center justify-between text-[13px] text-[#444444]">
            <span className="font-bold tabular-nums">{progress.percent}% complete</span>
            <span className="tabular-nums text-[#888888]">
              {progress.requiredCompleted} / {progress.requiredTotal} required items
            </span>
          </div>
          <div
            className="mt-2 h-1.5 rounded-full bg-[#ECECEC] overflow-hidden"
            role="progressbar"
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course progress"
          >
            <div
              className="h-full bg-[#0a8553] transition-[width] duration-500 ease-out"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {completed && certificate ? (
          <>
            <Link href={certHref} className="btn-pill">
              View certificate
            </Link>
            <Link href={continueHref} className="btn-pill-outline">
              Revisit course
            </Link>
          </>
        ) : completed && !certificate ? (
          <>
            <Link href={certHref} className="btn-pill">
              Get your certificate
            </Link>
            <Link href={continueHref} className="btn-pill-outline">
              Revisit course
            </Link>
          </>
        ) : notStarted ? (
          <>
            <Link href={continueHref} className="btn-pill">
              Start course
            </Link>
            <Link href={courseHref} className="btn-pill-outline">
              View course page
            </Link>
          </>
        ) : (
          <>
            <Link href={continueHref} className="btn-pill">
              Continue course
            </Link>
            <Link href={courseHref} className="btn-pill-outline">
              View course page
            </Link>
          </>
        )}
      </div>
    </article>
  )
}

type BadgeTone = 'neutral' | 'brand' | 'success'

function StatusBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  const toneClasses: Record<BadgeTone, string> = {
    neutral: 'bg-[#F5F5F5] text-[#666666] border-[#E5E5E5]',
    brand: 'bg-[#fbf5f2] text-[#C8102E] border-[#F0E5DF]',
    success: 'bg-[#E8F5EE] text-[#0a8553] border-[#C7E6D4]',
  }
  return (
    <span
      className={`text-[10px] font-bold tracking-[0.14em] uppercase border rounded-full px-2.5 py-0.5 ${toneClasses[tone]}`}
    >
      {label}
    </span>
  )
}
