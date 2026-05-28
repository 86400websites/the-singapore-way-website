'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'

import { submitQuizAttempt, type SubmitQuizAttemptResult } from '@/lib/course/actions'
import type { QuizPassedSummary, QuizQuestionForClient } from '@/lib/course/types'

const PASS_THRESHOLD = 80

type QuizRunnerProps = {
  courseSlug: string
  lessonSlug: string
  questions: QuizQuestionForClient[]
  initialPassed: QuizPassedSummary | null
  nextHref: string | null
}

type ResultState = {
  score: number
  passed: boolean
  total: number
  correct: number
}

function formatError(result: SubmitQuizAttemptResult): string {
  switch (result.status) {
    case 'unauthorized':
      return 'Your session has expired. Please sign in again.'
    case 'not_enrolled':
      return 'Your enrollment is not active.'
    case 'not_configured':
      return 'Quizzes are not available right now.'
    case 'not_found':
      return 'This quiz could not be found.'
    case 'invalid_input':
      return result.message || 'Please answer every question before submitting.'
    case 'error':
      return result.message || 'Something went wrong. Please try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export default function QuizRunner({
  courseSlug,
  lessonSlug,
  questions,
  initialPassed,
  nextHref,
}: QuizRunnerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<ResultState | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Tracks whether the learner has explicitly chosen to retake after a pass.
  const [retaking, setRetaking] = useState(false)

  const orderedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.position - b.position),
    [questions],
  )

  const allAnswered = orderedQuestions.every((q) => typeof answers[q.id] === 'number')

  const onSelect = (questionId: string, choiceIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!allAnswered || isPending) return
    setError(null)
    startTransition(async () => {
      const submission = await submitQuizAttempt(courseSlug, lessonSlug, answers)
      if (submission.status !== 'success') {
        setError(formatError(submission))
        return
      }
      setResult({
        score: submission.score,
        passed: submission.passed,
        total: submission.total,
        correct: submission.correct,
      })
      // Pull fresh server state so the sidebar checkmark + progress bar update.
      router.refresh()
    })
  }

  const onRetake = () => {
    setResult(null)
    setError(null)
    setAnswers({})
    setRetaking(true)
  }

  // 1) Already passed and the learner hasn't asked to retake → passed banner.
  if (initialPassed && !retaking && !result) {
    return (
      <PassedBanner
        score={initialPassed.score}
        passedAt={initialPassed.passedAt}
        nextHref={nextHref}
        onRetake={onRetake}
      />
    )
  }

  // 2) Fresh attempt graded this session → result panel.
  if (result) {
    return (
      <ResultPanel
        result={result}
        nextHref={nextHref}
        onRetake={() => {
          setResult(null)
          setAnswers({})
          setError(null)
        }}
      />
    )
  }

  // 3) Default → render the form.
  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="card-editorial p-7 md:p-10 mb-8">
        <p className="eyebrow mb-3">Quiz</p>
        <h2 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-3">
          {orderedQuestions.length} multiple-choice questions. {PASS_THRESHOLD}% to pass.
        </h2>
        <p className="prose-body">
          Pick the best answer for each question. You have unlimited retries — your latest
          passing attempt is what counts toward your certificate.
        </p>
      </div>

      <ol className="space-y-8">
        {orderedQuestions.map((q, qi) => {
          const groupName = `q-${q.id}`
          const selected = answers[q.id]
          return (
            <li key={q.id} className="card-editorial p-7 md:p-8">
              <p className="text-[11px] font-bold tracking-[0.14em] text-[#C8102E] uppercase mb-3">
                Question {qi + 1} of {orderedQuestions.length}
              </p>
              <p className="text-[16px] md:text-[17px] font-bold text-[#111111] leading-[1.4] mb-5">
                {q.question}
              </p>
              <fieldset>
                <legend className="sr-only">Answer choices for question {qi + 1}</legend>
                <ul className="space-y-2.5">
                  {q.choices.map((choice, ci) => {
                    const isChosen = selected === ci
                    const inputId = `${groupName}-${ci}`
                    return (
                      <li key={ci}>
                        <label
                          htmlFor={inputId}
                          className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                            isChosen
                              ? 'border-[#C8102E] bg-[#fbf5f2]'
                              : 'border-[#ECECEC] bg-white hover:border-[#DDDDDD] hover:bg-[#FAFAFA]'
                          }`}
                        >
                          <input
                            id={inputId}
                            type="radio"
                            name={groupName}
                            value={ci}
                            checked={isChosen}
                            onChange={() => onSelect(q.id, ci)}
                            className="mt-1 flex-shrink-0 accent-[#C8102E]"
                            required
                          />
                          <span className="text-[15px] text-[#111111] leading-[1.5]">
                            {choice}
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </fieldset>
            </li>
          )
        })}
      </ol>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={!allAnswered || isPending}
          className="btn-pill disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? 'Grading…' : 'Submit quiz'}
        </button>
        <p className="text-[13px] text-[#888888]">
          {allAnswered
            ? 'Ready to submit.'
            : `Answer all ${orderedQuestions.length} questions to submit.`}
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-[#C8102E]">
          {error}
        </p>
      )}
    </form>
  )
}

function PassedBanner({
  score,
  passedAt,
  nextHref,
  onRetake,
}: {
  score: number
  passedAt: string
  nextHref: string | null
  onRetake: () => void
}) {
  return (
    <div className="card-editorial p-8 md:p-10">
      <div className="flex items-start gap-4">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E8F5EE] border border-[#C7E6D4] text-[#0a8553] flex-shrink-0"
          aria-hidden="true"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="eyebrow mb-2">Quiz passed</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-2">
            You passed with {score}%.
          </h2>
          <p className="text-[13px] text-[#888888]">
            Passed on{' '}
            <time dateTime={passedAt}>{new Date(passedAt).toLocaleDateString()}</time>. This quiz
            counts toward your certificate.
          </p>
        </div>
      </div>
      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        {nextHref && (
          <Link href={nextHref} className="btn-pill">
            Continue to next lesson
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
        <button type="button" onClick={onRetake} className="btn-pill-outline">
          Retake quiz
        </button>
      </div>
    </div>
  )
}

function ResultPanel({
  result,
  nextHref,
  onRetake,
}: {
  result: ResultState
  nextHref: string | null
  onRetake: () => void
}) {
  const { score, passed, total, correct } = result

  return (
    <div
      className="card-editorial p-8 md:p-10"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <span
          className={`inline-flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 border ${
            passed
              ? 'bg-[#E8F5EE] border-[#C7E6D4] text-[#0a8553]'
              : 'bg-[#fbf5f2] border-[#F0E5DF] text-[#C8102E]'
          }`}
          aria-hidden="true"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d={
                passed
                  ? 'M5 13l4 4L19 7'
                  : 'M12 8v4m0 4h.008v.008H12V16zm9-4a9 9 0 11-18 0 9 9 0 0118 0z'
              }
            />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="eyebrow mb-2">{passed ? 'Quiz passed' : 'Not passed yet'}</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-2">
            You scored {score}%.
          </h2>
          <p className="text-[14px] text-[#666666]">
            {correct} of {total} questions correct. {passed
              ? 'This quiz now counts toward your certificate.'
              : `You need ${PASS_THRESHOLD}% to pass. Review the lesson and try again — your retries are unlimited.`}
          </p>
        </div>
      </div>
      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        {passed && nextHref && (
          <Link href={nextHref} className="btn-pill">
            Continue to next lesson
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
        <button
          type="button"
          onClick={onRetake}
          className={passed ? 'btn-pill-outline' : 'btn-pill'}
        >
          {passed ? 'Retake quiz' : 'Try again'}
        </button>
      </div>
    </div>
  )
}
