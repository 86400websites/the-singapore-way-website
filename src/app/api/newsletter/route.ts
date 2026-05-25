import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

import { checkRateLimit, clientIpFromRequest } from '@/lib/rate-limit'
import { MissingServerEnvError } from '@/lib/server-env'
import { verifyTurnstileToken } from '@/lib/turnstile/verify'
import { newsletterSignupSchema } from '@/lib/validation/forms'
import { subscribeToNewsletter } from '@/lib/mailchimp/marketing'

export async function POST(request: Request) {
  try {
    const ip = clientIpFromRequest(request)
    const rate = await checkRateLimit(ip, {
      prefix: 'newsletter',
      limit: 5,
      window: '1 m',
    })

    if (!rate.success) {
      return NextResponse.json(
        { ok: false, message: 'Too many requests. Please wait a moment and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000)).toString(),
          },
        },
      )
    }

    const { turnstileToken, ...rest } = (await request.json()) as {
      turnstileToken?: string | null
      [key: string]: unknown
    }

    const turnstile = await verifyTurnstileToken(turnstileToken, ip)
    if (!turnstile.ok) {
      return NextResponse.json(
        { ok: false, message: 'Please complete the verification challenge and try again.' },
        { status: 401 },
      )
    }

    const payload = newsletterSignupSchema.parse(rest)
    await subscribeToNewsletter(payload)

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { ok: false, message: error.issues[0]?.message ?? 'Please check the form and try again.' },
        { status: 400 },
      )
    }

    if (error instanceof MissingServerEnvError) {
      return NextResponse.json(
        { ok: false, message: 'Newsletter delivery is not configured yet.' },
        { status: 503 },
      )
    }

    return NextResponse.json(
      { ok: false, message: 'Unable to subscribe right now. Please try again later.' },
      { status: 502 },
    )
  }
}
