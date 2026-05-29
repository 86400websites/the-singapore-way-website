import Link from 'next/link'

import type { CourseProgress } from '@/lib/course/queries'
import type { Course } from '@/lib/course/types'

type LessonSidebarProps = {
  course: Course
  activeLessonSlug: string
  completedLessonIds: Set<string>
  progress: CourseProgress
}

export default function LessonSidebar({
  course,
  activeLessonSlug,
  completedLessonIds,
  progress,
}: LessonSidebarProps) {
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const showProgress = progress.requiredTotal > 0

  return (
    <aside aria-label="Course curriculum" className="lg:sticky lg:top-[88px] lg:self-start">
      <Link
        href={`/courses/${course.slug}`}
        className="focus-ring rounded-sm inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.12em] uppercase text-[#666666] hover:text-[#C8102E] transition-colors mb-6"
      >
        <svg
          className="w-4 h-4 rotate-180 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
        Course overview
      </Link>

      <div className="mb-6">
        <p className="eyebrow mb-2">Curriculum</p>
        <h2 className="text-lg md:text-xl font-bold text-[#111111] leading-[1.3]">
          {course.title}
        </h2>
        <p className="text-[13px] text-[#666666] mt-2">
          {course.modules.length} modules · {totalLessons} lessons
        </p>

        {showProgress && (
          <div
            className="mt-4"
            role="group"
            aria-label="Course progress"
          >
            <div className="flex items-center justify-between text-[12px] text-[#444444]">
              <span className="font-bold tabular-nums">
                {progress.percent}% complete
              </span>
              <span className="tabular-nums text-[#888888]">
                {progress.requiredCompleted} / {progress.requiredTotal}
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
            {progress.percent >= 100 && (
              <Link
                href={`/courses/${course.slug}/certificate`}
                className="focus-ring rounded-sm mt-4 inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.08em] uppercase text-[#0a8553] hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Get your certificate
              </Link>
            )}
          </div>
        )}
      </div>

      <nav className="lg:max-h-[calc(100vh-260px)] lg:overflow-y-auto lg:pr-2">
        <ol className="space-y-6">
          {course.modules.map((module, mi) => (
            <li key={module.id ?? module.slug}>
              <div className="mb-3">
                <span className="text-[10px] font-bold tracking-[0.14em] text-[#C8102E] uppercase">
                  Module {mi + 1}
                </span>
                <h3 className="text-[14px] font-bold text-[#111111] leading-[1.35] mt-1">
                  {module.title}
                </h3>
              </div>
              <ol className="space-y-1">
                {module.lessons.map((lesson, li) => {
                  const isActive = lesson.slug === activeLessonSlug
                  const isComplete = !!(lesson.id && completedLessonIds.has(lesson.id))
                  return (
                    <li key={lesson.id ?? lesson.slug}>
                      <Link
                        href={`/courses/${course.slug}/learn/${lesson.slug}`}
                        aria-current={isActive ? 'page' : undefined}
                        className={`focus-ring flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                          isActive
                            ? 'bg-[#C8102E]/10 text-[#C8102E]'
                            : 'text-[#444444] hover:bg-[#F5F5F5] hover:text-[#111111]'
                        }`}
                      >
                        <span
                          className={`flex-shrink-0 mt-0.5 w-6 inline-flex items-center justify-center ${
                            isComplete ? 'text-[#0a8553]' : isActive ? 'text-[#C8102E]' : 'text-[#888888]'
                          }`}
                          aria-hidden={!isComplete}
                          aria-label={isComplete ? 'Completed' : undefined}
                        >
                          {isComplete ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-[11px] font-bold tabular-nums tracking-[0.06em]">
                              {String(li + 1).padStart(2, '0')}
                            </span>
                          )}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span
                            className={`block text-[14px] leading-[1.4] ${
                              isActive ? 'font-bold' : 'font-normal'
                            }`}
                          >
                            {lesson.title}
                          </span>
                          <span className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] uppercase">
                            {lesson.contentType === 'quiz' ? (
                              <span className="text-[#C8102E]">Quiz</span>
                            ) : lesson.contentType === 'video' ? (
                              <span className="text-[#666666]">Video</span>
                            ) : (
                              <span className="text-[#888888]">Lesson</span>
                            )}
                            {typeof lesson.durationMinutes === 'number' && (
                              <span className="text-[#AAAAAA] font-normal normal-case tracking-normal">
                                · {lesson.durationMinutes} min
                              </span>
                            )}
                          </span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}
