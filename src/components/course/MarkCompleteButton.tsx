'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import { markLessonComplete, type MarkLessonCompleteResult } from '@/lib/course/actions'

type MarkCompleteButtonProps = {
  courseSlug: string
  lessonSlug: string
  isComplete: boolean
  nextHref: string | null
}

function formatError(result: MarkLessonCompleteResult): string {
  switch (result.status) {
    case 'unauthorized':
      return 'Your session has expired. Please sign in again.'
    case 'not_enrolled':
      return 'Your enrollment is not active.'
    case 'not_configured':
      return 'Course progress is not available right now.'
    case 'not_found':
      return 'This lesson could not be found.'
    case 'error':
      return result.message || 'Something went wrong. Please try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export default function MarkCompleteButton({
  courseSlug,
  lessonSlug,
  isComplete,
  nextHref,
}: MarkCompleteButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticComplete, setOptimisticComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showComplete = isComplete || optimisticComplete

  const onClick = () => {
    setError(null)
    setOptimisticComplete(true)
    startTransition(async () => {
      const result = await markLessonComplete(courseSlug, lessonSlug)
      if (result.status !== 'success') {
        setOptimisticComplete(false)
        setError(formatError(result))
        return
      }
      // Refresh so the Server Component re-renders with the new isComplete
      // value from Supabase. This also updates the sidebar checkmarks and
      // progress percentage.
      router.refresh()
    })
  }

  if (showComplete) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <span className="inline-flex items-center gap-2 text-[13px] font-bold text-[#0a8553] bg-[#E8F5EE] border border-[#C7E6D4] rounded-full px-4 py-2">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Lesson completed
        </span>
        {nextHref && (
          <Link href={nextHref} className="btn-pill">
            Continue to next lesson
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className="btn-pill disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? 'Marking complete…' : 'Mark lesson complete'}
        {!isPending && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      {error && (
        <p role="alert" className="text-sm text-[#C8102E]">
          {error}
        </p>
      )}
    </div>
  )
}
