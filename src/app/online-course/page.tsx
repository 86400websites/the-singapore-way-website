import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { COURSE_SLUG } from '@/data/course'
import { pageMetadata } from '@/lib/seo/page-metadata'

export const dynamic = 'force-dynamic'

// Kept for historical inbound links and nav menus. The canonical URL for the
// book companion course is /courses/[slug]; we 307-redirect anyone hitting
// the legacy /online-course path. Noindex so search engines pick up the
// canonical URL instead.
export const metadata: Metadata = pageMetadata({
  title: 'Online Course',
  description:
    'The Singapore Way book companion course. Redirects to the canonical course page.',
  path: '/online-course',
  noindex: true,
})

export default function OnlineCourseRedirectPage(): never {
  redirect(`/courses/${COURSE_SLUG}`)
}
