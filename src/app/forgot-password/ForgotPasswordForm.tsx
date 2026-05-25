'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ForgotPasswordFormProps = {
  origin: string
}

export default function ForgotPasswordForm({ origin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setErrorMsg(null)

    const cleanEmail = email.trim()
    if (!EMAIL_RE.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${origin}/update-password`,
    })
    setSubmitting(false)

    if (error) {
      setErrorMsg('Something went wrong. Please wait a moment and try again.')
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="space-y-5">
        <div
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          <p className="font-semibold mb-1">Check your inbox</p>
          <p>
            If an account exists for <span className="font-semibold break-all">{email.trim()}</span>,
            we've sent a password reset link. Follow it to choose a new password.
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full text-center bg-[#C8102E] text-white text-[14px] font-bold py-3 rounded-full hover:bg-[#a50d26] transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#111111] mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E]"
          required
        />
        <p className="text-xs text-gray-500 mt-1.5">Enter the email you used to sign up.</p>
      </div>

      {errorMsg && (
        <p role="alert" className="text-sm text-[#C8102E]">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#C8102E] text-white text-[14px] font-bold py-3 rounded-full hover:bg-[#a50d26] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? 'Sending...' : 'Send reset link'}
      </button>

      <p className="text-sm text-gray-600 pt-2 text-center">
        Remembered it?{' '}
        <Link href="/login" className="font-semibold text-[#C8102E] hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
