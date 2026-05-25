'use client'

import posthog from 'posthog-js'

let initialized = false

export function initPostHog() {
  if (initialized) return posthog
  if (typeof window === 'undefined') return null

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

  if (!key) return null

  posthog.init(key, {
    api_host: host,
    capture_pageview: 'history_change',
    capture_pageleave: true,
    autocapture: true,
    disable_session_recording: false,
    persistence: 'localStorage+cookie',
  })

  initialized = true
  return posthog
}

export { posthog }
