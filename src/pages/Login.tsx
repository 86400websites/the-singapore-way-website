import { FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import PageHero from '../components/PageHero'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { session, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Only honor redirect targets that are same-origin relative paths.
  const rawFrom = (location.state as { from?: string } | null)?.from
  const redirectTo = rawFrom && rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!loading && session) {
    return <Navigate to={redirectTo} replace />
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
    if (!password) {
      setErrorMsg('Please enter your password.')
      return
    }

    setSubmitting(true)
    const { error } = await signIn(cleanEmail, password)
    setSubmitting(false)

    if (error) {
      setErrorMsg(error)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Sign in"
        description="Sign in to access your account."
        variant="light"
      />
      <section className="bg-white">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8 py-12">
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
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#C8102E] text-white text-[14px] font-bold py-3 rounded-full hover:bg-[#a50d26] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-sm">
              <Link to="/forgot-password" className="text-gray-600 hover:text-[#C8102E] transition-colors">
                Forgot your password?
              </Link>
              <span className="text-gray-600">
                New here?{' '}
                <Link to="/signup" className="font-semibold text-[#C8102E] hover:underline">
                  Create an account
                </Link>
              </span>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
