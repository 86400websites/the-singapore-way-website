import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

// Content-Security-Policy directives. Allow the third-party origins the site
// actually uses today:
//   - Supabase (auth + realtime)
//   - PostHog (analytics + session replay)
//   - Sentry (error tracking + replay)
//   - Cloudflare Turnstile (CAPTCHA on public forms)
//   - Wixstatic (podcast MP3s)
//   - Railway-hosted Ideate assistant (iframe)
//   - YouTube privacy-enhanced embeds (course video lessons; frame-src only)
// 'unsafe-inline' is required for Next.js hydration scripts/styles and Framer
// Motion inline styles. Moving to a nonce-based CSP is a follow-up refactor.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://us.i.posthog.com https://eu.i.posthog.com https://challenges.cloudflare.com https://*.sentry.io https://*.ingest.sentry.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://us.i.posthog.com https://eu.i.posthog.com https://*.ingest.sentry.io https://*.sentry.io https://challenges.cloudflare.com",
  "frame-src 'self' https://sg-way-ai-agent.up.railway.app https://challenges.cloudflare.com https://www.youtube-nocookie.com",
  "media-src 'self' https://static.wixstatic.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  { key: 'Content-Security-Policy', value: csp },
]

const nextConfig: NextConfig = {
  serverExternalPackages: ['@mailchimp/mailchimp_marketing'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

// Source-map upload and release tracking only run when SENTRY_AUTH_TOKEN,
// SENTRY_ORG, and SENTRY_PROJECT are all set in the environment. When any are
// missing (local dev, CI without secrets, or before Sentry is provisioned),
// withSentryConfig silently skips the upload step and the build still passes.
const sentryEnabled =
  !!process.env.SENTRY_AUTH_TOKEN &&
  !!process.env.SENTRY_ORG &&
  !!process.env.SENTRY_PROJECT

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !sentryEnabled,
  sourcemaps: {
    disable: !sentryEnabled,
  },
  telemetry: false,
})
