import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { AuthError, Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'email_taken'
  | 'weak_password'
  | 'rate_limited'
  | 'network'
  | 'other'

type AuthResult = { error: string | null; code?: AuthErrorCode }

// signUp also reports whether Supabase returned an active session. This is the
// authoritative signal for which mode the project is in:
//   sessionCreated === true  → "Confirm email" is OFF; user is signed in.
//   sessionCreated === false → "Confirm email" is ON; user must verify via email.
// We let the UI branch on this rather than guessing from copy/config.
type SignUpResult = AuthResult & { sessionCreated: boolean }

type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string) => Promise<SignUpResult>
  resetPassword: (email: string) => Promise<AuthResult>
  updatePassword: (newPassword: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Map a Supabase AuthError to user-friendly text + a stable code the UI can
// branch on. Rate-limit detection prefers status/code over substring matching
// because real 429s don't always contain the literal text "rate limit"
// (e.g. "For security purposes, you can only request this after X seconds").
function classifyAuthError(error: AuthError | null | undefined): AuthResult {
  if (!error) return { error: null }

  const status = (error as { status?: number }).status
  const code = (error as { code?: string }).code ?? ''
  const msg = (error.message ?? '').toLowerCase()

  if (status === 429 || code.startsWith('over_') || msg.includes('rate limit') || msg.includes('for security purposes')) {
    return { error: 'Too many attempts. Please wait a moment and try again.', code: 'rate_limited' }
  }
  if (msg.includes('invalid login')) {
    return { error: 'Email or password is incorrect.', code: 'invalid_credentials' }
  }
  if (msg.includes('email not confirmed')) {
    return { error: 'Please confirm your email before signing in.', code: 'email_not_confirmed' }
  }
  if (msg.includes('user already registered')) {
    return { error: 'An account with this email already exists.', code: 'email_taken' }
  }
  if (msg.includes('password should be')) {
    return { error: 'Password must be at least 8 characters.', code: 'weak_password' }
  }
  if (msg.includes('network') || msg.includes('failed to fetch')) {
    return { error: 'Network error. Check your connection and try again.', code: 'network' }
  }
  return { error: 'Something went wrong. Please try again.', code: 'other' }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return classifyAuthError(error)
  }

  const signUp: AuthContextValue['signUp'] = async (email, password) => {
    // emailRedirectTo is kept pointing at /login so that if "Confirm email"
    // is enabled in Supabase later, the confirmation link lands users on the
    // sign-in page.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    return { ...classifyAuthError(error), sessionCreated: !!data.session }
  }

  const resetPassword: AuthContextValue['resetPassword'] = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    return classifyAuthError(error)
  }

  const updatePassword: AuthContextValue['updatePassword'] = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    return classifyAuthError(error)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
