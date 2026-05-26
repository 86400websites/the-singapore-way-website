import type { Metadata } from 'next'
import Link from 'next/link'

import { pageMetadata } from '@/lib/seo/page-metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Online Course — Coming Soon',
  description:
    "We're finalising an online course around the 15 principles of The Singapore Way. In the meantime, explore the podcast, blog, and case studies.",
  path: '/online-course',
})

export default function OnlineCoursePage() {
  return (
    <div className="bg-[#fbf5f2] min-h-[calc(100vh-70px)] flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 text-center py-20 md:py-28">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-[#E5E5E5] shadow-sm mb-8">
          <svg className="w-7 h-7 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="eyebrow mb-5">Online Course</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em] mb-6">
          Coming soon.
        </h1>
        <span className="editorial-rule mx-auto mb-7" aria-hidden="true" />
        <p className="lede mb-9 max-w-xl mx-auto">
          We're finalising the details to bring you the best experience. In the meantime, explore the podcast, blog, and case studies.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/podcasts" className="btn-pill">Listen to the Podcast</Link>
          <Link href="/blog" className="btn-pill-outline">Read the Blog</Link>
        </div>
      </div>
    </div>
  )
}
