import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo/page-metadata'
import PodcastsClient from './PodcastsClient'

export const metadata: Metadata = pageMetadata({
  title: 'Podcast',
  description:
    "Learn The Singapore Way, in your ear. In-depth conversations on the ideas, innovations, and trade-offs behind Singapore's rise. Eight episodes streaming now.",
  path: '/podcasts',
})

export default function PodcastsPage() {
  return <PodcastsClient />
}
