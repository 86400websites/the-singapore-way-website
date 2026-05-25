'use client'

import { useEffect, type ReactNode } from 'react'
import { PostHogProvider } from 'posthog-js/react'

import { initPostHog, posthog } from '@/lib/posthog/client'

type ProvidersProps = {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    initPostHog()
  }, [])

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
