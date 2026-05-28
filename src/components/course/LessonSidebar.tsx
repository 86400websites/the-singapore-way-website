import Link from 'next/link'

import type { Course } from '@/lib/course/types'

type LessonSidebarProps = {
  course: Course
  activeLessonSlug: string
}

export default function LessonSidebar({ course, activeLessonSlug }: LessonSidebarProps) {
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)

  return (
    <aside aria-label="Course curriculum" className="lg:sticky lg:top-[88px] lg:self-start">
      <Link
        href={`/courses/${course.slug}`}
        className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.12em] uppercase text-[#666666] hover:text-[#C8102E] transition-colors mb-6"
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
      </div>

      <nav className="lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-2">
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
                  return (
                    <li key={lesson.id ?? lesson.slug}>
                      <Link
                        href={`/courses/${course.slug}/learn/${lesson.slug}`}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                          isActive
                            ? 'bg-[#C8102E]/10 text-[#C8102E]'
                            : 'text-[#444444] hover:bg-[#F5F5F5] hover:text-[#111111]'
                        }`}
                      >
                        <span
                          className={`flex-shrink-0 mt-0.5 text-[11px] font-bold tabular-nums tracking-[0.06em] w-6 ${
                            isActive ? 'text-[#C8102E]' : 'text-[#888888]'
                          }`}
                          aria-hidden="true"
                        >
                          {String(li + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span
                            className={`block text-[14px] leading-[1.4] ${
                              isActive ? 'font-bold' : 'font-medium'
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
