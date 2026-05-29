import Link from 'next/link'

type NavTarget = {
  title: string
  href: string
} | null

type LessonNavProps = {
  prev: NavTarget
  next: NavTarget
}

export default function LessonNav({ prev, next }: LessonNavProps) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="mt-10 md:mt-14 pt-8 border-t border-[#ECECEC] grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="focus-ring group flex flex-col gap-1 rounded-2xl border border-[#ECECEC] hover:border-[#C8102E] hover:bg-[#fbf5f2] transition-colors p-5"
          rel="prev"
        >
          <span className="text-[11px] font-bold tracking-[0.14em] text-[#888888] uppercase inline-flex items-center gap-2">
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
            Previous
          </span>
          <span className="text-[15px] font-bold text-[#111111] group-hover:text-[#C8102E] transition-colors line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="focus-ring group flex flex-col gap-1 rounded-2xl border border-[#ECECEC] hover:border-[#C8102E] hover:bg-[#fbf5f2] transition-colors p-5 sm:text-right sm:items-end"
          rel="next"
        >
          <span className="text-[11px] font-bold tracking-[0.14em] text-[#888888] uppercase inline-flex items-center gap-2">
            Next
            <svg
              className="w-4 h-4 flex-shrink-0"
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
          </span>
          <span className="text-[15px] font-bold text-[#111111] group-hover:text-[#C8102E] transition-colors line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  )
}
