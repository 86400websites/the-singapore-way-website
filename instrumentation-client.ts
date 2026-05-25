import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  })
}

// Required by @sentry/nextjs 10.x to instrument App Router client-side
// navigations. Safe to export even when Sentry is not initialized (the hook
// is a no-op when no client is bound).
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
