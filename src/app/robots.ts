import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/account',
          '/login',
          '/signup',
          '/forgot-password',
          '/update-password',
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
