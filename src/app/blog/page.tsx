import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { blogPosts } from '@/data/blogPosts'
import PageHero from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo/page-metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Blog',
  description:
    'Clear lessons, practical principles. Short, grounded essays applying The Singapore Way to real challenges across the Global Majority.',
  path: '/blog',
})

export default function BlogPage() {
  const [featured, ...rest] = blogPosts

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="The Blog"
        title="Clear lessons. Practical principles."
        description="Short, grounded essays applying The Singapore Way to real challenges across the Global Majority."
        align="left"
        variant="light"
      />

      <section className="py-16 md:py-24 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="card-editorial group mb-10 md:mb-12 flex flex-col md:flex-row overflow-hidden"
            >
              <div className="relative md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden bg-[#faf8f4] flex-shrink-0">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  priority
                />
              </div>
              <div className="md:w-1/2 p-7 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="eyebrow">{featured.category}</span>
                  <span className="text-[#CCCCCC]">·</span>
                  <span className="text-[12px] text-[#888888]">{featured.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mb-4 group-hover:text-[#C8102E] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-[15px] md:text-[16px] text-[#555555] leading-[1.65]">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-[#C8102E] tracking-[0.06em] uppercase">
                  Read article
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          )}

          {/* Rest of posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card-editorial group flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#faf8f4]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <div className="p-6 md:p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="eyebrow">{post.category}</span>
                    <span className="text-[#CCCCCC]">·</span>
                    <span className="text-[12px] text-[#888888]">{post.readTime}</span>
                  </div>
                  <h3 className="text-[18px] md:text-[19px] font-bold text-[#111111] leading-[1.3] mb-3 group-hover:text-[#C8102E] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[15px] text-[#666666] leading-[1.6] line-clamp-3 flex-1">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
