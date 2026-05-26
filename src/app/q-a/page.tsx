import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo/page-metadata'
import QAClient from './QAClient'

export const metadata: Metadata = pageMetadata({
  title: 'Questions & Answers',
  description:
    'Everything you need to know about The Singapore Way — the framework, the audience, and how to get started.',
  path: '/q-a',
})

export default function QAPage() {
  return <QAClient />
}
