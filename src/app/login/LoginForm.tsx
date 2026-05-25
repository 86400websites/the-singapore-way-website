'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { classifyAuthError, type AuthErrorCode } from '@/lib/auth/errors'
import { createClient } from '@/lib/supabase/client'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LoginFormProps = {
  redirectTo: string
}

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<AuthErrorCode | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setErrorMsg(null)
    setErrorCode(null)

    const cleanEmail = email.trim()
    if (!EMAIL_RE.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    if (!password) {
      setErrorMsg('Please enter your password.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })
    const result = classifyAuthError(error)
    setSubmitting(false)

    if (result.error) {
      setErrorMsg(result.error)
      setErrorCode(result.code ?? null)
      return
    }

    router.replace(redirectTo)
    router.refresh()
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E]"
          required
        />
      </div>

      {errorMsg && (
        <p role="alert" className="text-sm text-[#C8102E]">
          {errorMsg}
          {errorCode === 'invalid_credentials' && (
            <>
              {' '}
              Need an account?{' '}
              <Link href="/signup" className="font-semibold underline hover:no-underline">
                Create one
              </Link>
              .
            </>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#C8102E] text-white text-[14px] font-bold py-3 rounded-full hover:bg-[#a50d26] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-sm">
        <Link href="/forgot-password" className="text-gray-600 hover:text-[#C8102E] transition-colors">
          Forgot your password?
        </Link>
        <span className="text-gray-600">
          New here?{' '}
          <Link href="/signup" className="font-semibold text-[#C8102E] hover:underline">
            Create an account
          </Link>
        </span>
      </div>
    </form>
  )
}
