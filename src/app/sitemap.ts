import type { MetadataRoute } from 'next'

import { blogPosts } from '@/data/blogPosts'
import { absoluteUrl } from '@/lib/seo/site'

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/thebook', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/learn', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/apply', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/teach', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ideate', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/online-course', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/podcasts', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/localization-kits', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/possibilities', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/teaching-materials', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/q-a', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...blogEntries]
}
