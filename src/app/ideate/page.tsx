import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo/page-metadata'
import IdeateClient from './IdeateClient'

export const metadata: Metadata = pageMetadata({
  title: 'Ideate',
  description:
    "Strategic analysis and consulting powered by Singapore's proven principles. Describe your challenge, attach context, and explore tailored recommendations.",
  path: '/ideate',
})

export default function IdeatePage() {
  return <IdeateClient />
}
