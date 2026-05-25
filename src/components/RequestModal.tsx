'use client'

import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import TurnstileWidget from '@/components/TurnstileWidget'
import {
  resourceRequestSchema,
  type ResourceRequestValues,
} from '@/lib/validation/forms'

interface RequestModalProps {
  onClose: () => void
  kind: string
  description?: string
}

const turnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export default function RequestModal({ onClose, kind, description }: RequestModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const handleTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token)
  }, [])
  const form = useForm<ResourceRequestValues>({
    resolver: zodResolver(resourceRequestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      consent: false,
    },
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const onSubmit = async (values: ResourceRequestValues) => {
    setSubmitError(null)
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        kind,
        description,
        turnstileToken,
      }),
    })
    const result = (await response.json().catch(() => null)) as { message?: string } | null

    if (!response.ok) {
      setSubmitError(result?.message ?? 'Unable to send this request right now. Please try again later.')
      return
    }

    setSubmittedEmail(values.email)
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-12 sm:pt-16 px-5 bg-[#111111]/40 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_30px_60px_-20px_rgba(17,17,17,0.4)] border border-[#ECECEC] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors flex items-center justify-center"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-7 md:p-9">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#fbf5f2] flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 id="request-modal-title" className="text-2xl font-bold text-[#111111] mb-3 leading-[1.2]">
                Thanks - we've got your request.
              </h2>
              <p className="text-[15px] text-[#666666] leading-[1.65] mb-6">
                We'll follow up at{' '}
                <span className="text-[#111111] font-bold">{submittedEmail}</span> soon.
              </p>
              <button onClick={onClose} className="btn-pill" type="button">Close</button>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-3">Request</p>
              <h2 id="request-modal-title" className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mb-2">
                Get the {kind}
              </h2>
              <p className="text-[15px] text-[#666666] leading-[1.65] mb-6">
                {description || `Share your details and we'll email you the full set as soon as delivery is live.`}
              </p>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="req-fn" className="block text-[12px] font-bold tracking-[0.08em] uppercase text-[#666666] mb-1.5">
                      First name <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      id="req-fn"
                      type="text"
                      {...form.register('firstName')}
                      required
                      autoFocus
                      className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-[15px] text-[#111111] focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/20 bg-[#FAFAFA] transition-colors"
                    />
                    {form.formState.errors.firstName && (
                      <p className="mt-1.5 text-[12px] text-[#C8102E]" role="alert">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="req-ln" className="block text-[12px] font-bold tracking-[0.08em] uppercase text-[#666666] mb-1.5">
                      Last name
                    </label>
                    <input
                      id="req-ln"
                      type="text"
                      {...form.register('lastName')}
                      className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-[15px] text-[#111111] focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/20 bg-[#FAFAFA] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="req-email" className="block text-[12px] font-bold tracking-[0.08em] uppercase text-[#666666] mb-1.5">
                    Email <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    id="req-email"
                    type="email"
                    {...form.register('email')}
                    required
                    className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-[15px] text-[#111111] focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/20 bg-[#FAFAFA] transition-colors"
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1.5 text-[12px] text-[#C8102E]" role="alert">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...form.register('consent')}
                    required
                    className="mt-1 accent-[#C8102E]"
                  />
                  <span className="text-[14px] text-[#444444] leading-snug">
                    I agree to receive emails from <span className="font-bold text-[#111111]">The Singapore Way</span>.
                  </span>
                </label>
                {form.formState.errors.consent && (
                  <p className="text-[12px] text-[#C8102E]" role="alert">
                    {form.formState.errors.consent.message}
                  </p>
                )}
                {turnstileRequired && (
                  <TurnstileWidget onToken={handleTurnstileToken} theme="light" />
                )}
                <div className="pt-2">
                  {submitError && (
                    <p className="mb-4 text-[12px] text-[#C8102E]" role="alert">
                      {submitError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={
                      form.formState.isSubmitting ||
                      (turnstileRequired && !turnstileToken)
                    }
                    className="btn-pill w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {form.formState.isSubmitting ? 'Sending...' : 'Send my request'}
                  </button>
                </div>
                <p className="text-[12px] text-[#888888] leading-snug">
                  Your details will be sent securely to The Singapore Way team.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
