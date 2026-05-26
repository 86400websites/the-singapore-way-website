import 'server-only'

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export type TurnstileVerification =
  | { ok: true; configured: boolean }
  | { ok: false; reason: 'missing-token' | 'invalid-token' | 'network-error' }

/**
 * Verifies a Cloudflare Turnstile token server-side.
 *
 * When `TURNSTILE_SECRET_KEY` is missing the verifier short-circuits as
 * `{ ok: true, configured: false }` so dev/preview environments without
 * Turnstile provisioned still accept form submissions.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string,
): Promise<TurnstileVerification> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    return { ok: true, configured: false }
  }

  if (!token) {
    return { ok: false, reason: 'missing-token' }
  }

  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
    })
    const data = (await response.json()) as { success?: boolean }

    if (!data.success) {
      return { ok: false, reason: 'invalid-token' }
    }

    return { ok: true, configured: true }
  } catch {
    return { ok: false, reason: 'network-error' }
  }
}
