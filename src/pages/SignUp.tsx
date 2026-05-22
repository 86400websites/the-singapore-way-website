import { FormEvent, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import PageHero from '../components/PageHero'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 8

export default function SignUp() {
  const { session, loading, signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  // sessionCreated mirrors Supabase's response: when "Confirm email" is OFF
  // we get a session immediately and treat signup as a completed sign-in;
  // when ON we get no session and show the confirm-your-inbox state.
  const [sessionCreated, setSessionCreated] = useState(false)

  // After a signup that returned a session, redirect into the app shortly so
  // the success message is visible but the user is not stranded on this page.
  useEffect(() => {
    if (success && sessionCreated) {
      const t = window.setTimeout(() => navigate('/account', { replace: true }), 1200)
      return () => window.clearTimeout(t)
    }
  }, [success, sessionCreated, navigate])

  if (!loading && session && !success) {
    return <Navigate to="/account" replace />
  }

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
    const { error, sessionCreated: created } = await signUp(cleanEmail, password)
    setSubmitting(false)

    if (error) {
      setErrorMsg(error)
      return
    }
    setSessionCreated(created)
    setSuccess(true)
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Create an account"
        description="Set up a free account to access your tools and resources."
        variant="light"
      />
      <section className="bg-white">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8 py-12">
          {success ? (
            sessionCreated ? (
              <div className="space-y-5">
                <div
                  role="status"
                  className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                  <p className="font-semibold mb-1">Account created successfully</p>
                  <p>You're signed in. Taking you to your account…</p>
                </div>
                <Link
                  to="/account"
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
                  to="/login"
                  className="block w-full text-center bg-[#C8102E] text-white text-[14px] font-bold py-3 rounded-full hover:bg-[#a50d26] transition-colors"
                >
                  Go to sign in
                </Link>
              </div>
            )
          ) : (
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
                {submitting ? 'Creating account…' : 'Create account'}
              </button>

              <p className="text-sm text-gray-600 pt-2 text-center">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#C8102E] hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
