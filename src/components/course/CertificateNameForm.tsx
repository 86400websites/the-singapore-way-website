'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition, type FormEvent } from 'react'

import { updateLearnerName } from '@/lib/course/actions'

/**
 * Shown on the learner's own certificate page when their account has no
 * full name yet. Saves the name via the updateLearnerName Server Action,
 * then refreshes so the certificate re-renders with the real name.
 */
export default function CertificateNameForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateLearnerName(name)
      if (result.status === 'success') {
        router.refresh()
        return
      }
      if (result.status === 'invalid_input') {
        setError(result.message)
      } else if (result.status === 'unauthorized') {
        setError('Your session has expired. Please sign in again.')
      } else {
        setError('Could not save your name. Please try again.')
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="no-print card-editorial p-6 md:p-8 mb-8 md:mb-10"
    >
      <p className="eyebrow mb-3">Name on certificate</p>
      <h2 className="text-lg md:text-xl font-bold text-[#111111] leading-[1.3] mb-2">
        Add your full name.
      </h2>
      <p className="text-[14px] text-[#666666] leading-[1.65] max-w-xl">
        Enter your name exactly as it should appear on your certificate and its
        public verification page.
      </p>
      <div className="mt-5 flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <label
            htmlFor="certificate-full-name"
            className="block text-[14px] text-[#444444] mb-2"
          >
            Your full name
          </label>
          <input
            id="certificate-full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-full border border-[#E5E5E5] bg-white px-5 py-3 text-[15px] text-[#111111] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="btn-pill disabled:opacity-60 disabled:pointer-events-none"
        >
          {isPending ? 'Saving…' : 'Save name'}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-[#C8102E]">
          {error}
        </p>
      )}
    </form>
  )
}
