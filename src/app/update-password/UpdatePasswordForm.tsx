'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

const MIN_PASSWORD = 8

export default function UpdatePasswordForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [recoveryReady, setRecoveryReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setHasSession(!!data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryReady(true)
      }
      setHasSession(!!session)
      setLoading(false)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const canUpdate = recoveryReady || hasSession

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setErrorMsg(null)

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
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (error) {
      setErrorMsg('We could not update your password. The link may have expired - please request a new one.')
      return
    }

    setSuccess(true)
    window.setTimeout(() => router.replace('/account'), 1500)
    router.refresh()
  }

  if (success) {
    return (
      <div
        role="status"
        className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
      >
        <p className="font-semibold mb-1">Password updated</p>
        <p>You're being redirected to your account...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[160px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!canUpdate) {
    return (
      <div className="space-y-5">
        <div
          role="alert"
          className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900"
        >
          <p className="font-semibold mb-1">This link may be invalid or expired</p>
          <p>Request a new password reset email to continue.</p>
        </div>
        <Link
          href="/forgot-password"
          className="block w-full text-center bg-[#C8102E] text-white text-[14px] font-bold py-3 rounded-full hover:bg-[#a50d26] transition-colors"
        >
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-semibold text-[#111111]">
            New password
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
          Confirm new password
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
        {submitting ? 'Updating...' : 'Update password'}
      </button>
    </form>
  )
}
