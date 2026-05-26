import type { Metadata } from 'next'

import { SITE_NAME, absoluteUrl } from './site'

type PageMetadataInput = {
  title: string
  description: string
  path: string
  noindex?: boolean
}

export function pageMetadata({ title, description, path, noindex }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const fullTitle = `${title} — ${SITE_NAME}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url,
    },
    twitter: {
      title: fullTitle,
      description,
    },
    ...(noindex
      ? { robots: { index: false, follow: false } }
      : {}),
  }
}
