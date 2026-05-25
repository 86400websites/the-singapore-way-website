import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo/page-metadata'
import LocalizationKitsClient from './LocalizationKitsClient'

export const metadata: Metadata = pageMetadata({
  title: 'Localization Kits',
  description:
    'Sixteen kits that adapt The Singapore Way to your local reality — housing, education, governance, mobility, water, public trust, and more.',
  path: '/localization-kits',
})

export default function LocalizationKitsPage() {
  return <LocalizationKitsClient />
}
