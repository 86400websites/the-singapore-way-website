import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo/page-metadata'
import PossibilitiesClient from './PossibilitiesClient'

export const metadata: Metadata = pageMetadata({
  title: 'Examples',
  description:
    'What it looks like when the principles travel. Illustrative use cases showing how communities adapt The Singapore Way across cities, ministries, and public systems.',
  path: '/possibilities',
})

export default function PossibilitiesPage() {
  return <PossibilitiesClient />
}
