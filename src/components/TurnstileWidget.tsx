'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

type TurnstileRenderOptions = {
  sitekey: string
  callback?: (token: string) => void
  'error-callback'?: () => void
  'expired-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact' | 'flexible'
}

type TurnstileApi = {
  render: (el: HTMLElement, opts: TurnstileRenderOptions) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

type TurnstileWidgetProps = {
  onToken: (token: string | null) => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact' | 'flexible'
  className?: string
}

const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/**
 * Cloudflare Turnstile widget. Renders nothing when `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
 * is missing so dev/preview environments without Turnstile provisioned still work.
 */
export default function TurnstileWidget({
  onToken,
  theme = 'auto',
  size = 'flexible',
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  // Seed from the global at mount: if a sibling already loaded the script,
  // `window.turnstile` is already defined and we don't get an onLoad event
  // from next/script. The lazy initializer keeps this synchronous (no
  // setState in an effect).
  const [scriptReady, setScriptReady] = useState<boolean>(
    () => typeof window !== 'undefined' && !!window.turnstile,
  )
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // Keep the latest callback in a ref so we never re-render the widget when
  // the parent re-renders with a new function identity.
  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    if (!sitekey || !scriptReady) return
    const container = containerRef.current
    const turnstile = typeof window !== 'undefined' ? window.turnstile : undefined
    if (!container || !turnstile || widgetIdRef.current) return

    widgetIdRef.current = turnstile.render(container, {
      sitekey,
      theme,
      size,
      callback: (token) => onTokenRef.current(token),
      'error-callback': () => onTokenRef.current(null),
      'expired-callback': () => onTokenRef.current(null),
    })

    return () => {
      const api = typeof window !== 'undefined' ? window.turnstile : undefined
      if (widgetIdRef.current && api) {
        api.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [sitekey, scriptReady, theme, size])

  if (!sitekey) return null

  return (
    <>
      <Script
        src={TURNSTILE_SCRIPT_SRC}
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className={className} />
    </>
  )
}
