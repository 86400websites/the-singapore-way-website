'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-[#111111] antialiased">
        <main className="min-h-screen flex items-center justify-center px-5">
          <div className="max-w-md text-center">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#C8102E] mb-4">
              Error
            </p>
            <h1 className="text-3xl font-bold leading-[1.2] mb-5">
              Something went wrong.
            </h1>
            <p className="text-[15px] text-[#666666] leading-[1.65] mb-7">
              The page failed to load. Try again, or return home if the problem persists.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full transition-all duration-200 hover:bg-[#a50d26] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
