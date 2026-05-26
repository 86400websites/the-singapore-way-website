'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { classifyAuthError } from '@/lib/auth/errors'
import { createClient } from '@/lib/supabase/client'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 8

type SignUpFormProps = {
  origin: string
}

export default function SignUpForm({ origin }: SignUpFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sessionCreated, setSessionCreated] = useState(false)

  useEffect(() => {
    if (success && sessionCreated) {
      const t = window.setTimeout(() => router.replace('/account'), 1200)
      return () => window.clearTimeout(t)
    }
  }, [success, sessionCreated, router])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setErrorMsg(null)

    const cleanEmail = email.trim()
    if (!EMAIL_RE.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    if (password.length < MIN_PASSWORD) {
      setErrorMsg(`Password must be at least ${MIN_PASSWORD} characters.`)
      return
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${origin}/login`,
      },
    })
    const result = classifyAuthError(error)
    setSubmitting(false)

    if (result.error) {
      setErrorMsg(result.error)
      return
    }

    setSessionCreated(!!data.session)
    setSuccess(true)
    router.refresh()
  }

  if (success) {
    return sessionCreated ? (
      <div className="space-y-5">
        <div
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          <p className="font-semibold mb-1">Account created successfully</p>
          <p>You're signed in. Taking you to your account...</p>
        </div>
        <Link
          href="/account"
          className="block w-full text-center bg-[#C8102E] text-white text-[14px] font-bold py-3 rounded-full hover:bg-[#a50d26] transition-colors"
        >
          Go to your account
        </Link>
      </div>
    ) : (
      <div className="space-y-5">
        <div
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          <p className="font-semibold mb-1">Check your inbox</p>
          <p>
            We've sent a confirmation link to <span className="font-semibold break-all">{email.trim()}</span>.
            Click the link to verify your email, then sign in.
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full text-center bg-[#C8102E] text-white text-[14px] font-bold py-3 rounded-full hover:bg-[#a50d26] transition-colors"
        >
          Go to sign in
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
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-semibold text-[#111111]">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="text-xs font-semibold text-gray-500 hover:text-[#C8102E] transition-colors"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E]"
          required
          minLength={MIN_PASSWORD}
        />
        <p className="text-xs text-gray-500 mt-1.5">At least {MIN_PASSWORD} characters.</p>
      </div>

      <div>
        <label htmlFor="confirm" className="block text-sm font-semibold text-[#111111] mb-2">
          Confirm password
        </label>
        <input
          id="confirm"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E]"
          required
        />
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
        {submitting ? 'Creating account...' : 'Create account'}
      </button>

      <p className="text-sm text-gray-600 pt-2 text-center">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[#C8102E] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
