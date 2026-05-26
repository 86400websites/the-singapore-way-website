import type { AuthError } from '@supabase/supabase-js'

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'email_taken'
  | 'weak_password'
  | 'rate_limited'
  | 'network'
  | 'other'

export type AuthResult = {
  error: string | null
  code?: AuthErrorCode
}

// Rate-limit detection prefers status/code over substring matching because real
// 429s do not always contain the literal text "rate limit".
export function classifyAuthError(error: AuthError | null | undefined): AuthResult {
  if (!error) return { error: null }

  const status = (error as { status?: number }).status
  const code = (error as { code?: string }).code ?? ''
  const msg = (error.message ?? '').toLowerCase()

  if (
    status === 429 ||
    code.startsWith('over_') ||
    msg.includes('rate limit') ||
    msg.includes('for security purposes')
  ) {
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
