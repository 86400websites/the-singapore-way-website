'use client'

import { useState } from 'react'

import type { CourseFaq } from '@/lib/course/types'

type CourseFAQProps = {
  faqs: CourseFaq[]
}

export default function CourseFAQ({ faqs }: CourseFAQProps) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {faqs.map(({ question, answer }, i) => {
        const isOpen = open === i
        return (
          <div
            key={question}
            className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
              isOpen
                ? 'border-[#C8102E]/30 shadow-[0_12px_32px_-18px_rgba(17,17,17,0.16)]'
                : 'border-[#ECECEC] hover:border-[#DDDDDD]'
            }`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between px-6 md:px-7 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C8102E]"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`course-faq-${i}`}
            >
              <span className="font-bold text-[#111111] text-[16px] md:text-[17px] pr-6 leading-[1.4]">
                {question}
              </span>
              <span
                className={`flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#C8102E]' : 'text-[#888888]'
                }`}
                aria-hidden="true"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div
                id={`course-faq-${i}`}
                className="px-6 md:px-7 pb-6 border-t border-[#F0F0F0]"
              >
                <p className="text-[15px] md:text-[16px] text-[#444444] leading-[1.7] pt-5">
                  {answer}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
