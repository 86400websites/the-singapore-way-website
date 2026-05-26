import 'server-only'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

type LimiterConfig = {
  /** Identifier used to namespace Redis keys (e.g. 'newsletter'). */
  prefix: string
  /** Max requests in the window. */
  limit: number
  /** Window expressed as a Ratelimit duration string, e.g. '1 m', '10 s'. */
  window: `${number} ${'s' | 'm' | 'h' | 'd'}`
}

// Cached limiters keyed by prefix so each route reuses the same instance.
const limiters = new Map<string, Ratelimit | null>()

function getLimiter(config: LimiterConfig): Ratelimit | null {
  const cached = limiters.get(config.prefix)
  if (cached !== undefined) return cached

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    limiters.set(config.prefix, null)
    return null
  }

  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(config.limit, config.window),
    analytics: true,
    prefix: `sgw:rl:${config.prefix}`,
  })

  limiters.set(config.prefix, limiter)
  return limiter
}

/**
 * Best-effort per-IP rate limiter. Returns `{ success: true }` with permissive
 * defaults when Upstash env vars are absent so dev and preview environments
 * still work without provisioning Redis.
 */
export async function checkRateLimit(
  identifier: string,
  config: LimiterConfig,
): Promise<RateLimitResult> {
  const limiter = getLimiter(config)

  if (!limiter) {
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: Date.now(),
    }
  }

  const result = await limiter.limit(identifier)
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

/** Pull the requester's IP from common Vercel / proxy headers. */
export function clientIpFromRequest(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '0.0.0.0'
  )
}
