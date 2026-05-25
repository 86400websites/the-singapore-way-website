import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo/page-metadata'
import TeachingMaterialsClient from './TeachingMaterialsClient'

export const metadata: Metadata = pageMetadata({
  title: 'Case Studies',
  description:
    'Seventeen case studies that bring The Singapore Way to life — for classrooms, policy circles, and national strategy discussions.',
  path: '/teaching-materials',
})

export default function TeachingMaterialsPage() {
  return <TeachingMaterialsClient />
}
