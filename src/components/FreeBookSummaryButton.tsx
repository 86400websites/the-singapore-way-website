'use client'

import { useState } from 'react'

import FreeBookSummaryModal from '@/components/FreeBookSummaryModal'

interface FreeBookSummaryButtonProps {
  className?: string
  showIcon?: boolean
}

export default function FreeBookSummaryButton({
  className = 'btn-pill-outline',
  showIcon = false,
}: FreeBookSummaryButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        Download Free Summary
        {showIcon && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </button>
      {open && <FreeBookSummaryModal onClose={() => setOpen(false)} />}
    </>
  )
}
