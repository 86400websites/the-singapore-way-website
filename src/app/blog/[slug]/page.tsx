import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { blogPosts } from '@/data/blogPosts'
import { pageMetadata } from '@/lib/seo/page-metadata'

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return pageMetadata({
      title: 'Post not found',
      description: 'The post you are looking for could not be found.',
      path: `/blog/${slug}`,
      noindex: true,
    })
  }

  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center px-5">
          <p className="eyebrow mb-4">404</p>
          <h1 className="text-3xl font-bold text-[#111111] mb-6 leading-[1.2]">Post not found</h1>
          <Link href="/blog" className="btn-pill">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">

      {/* Article hero */}
      <header className="bg-[#fbf5f2] border-b border-[#ECECEC]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-14 md:py-20">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#C8102E] text-[12px] font-bold mb-8 tracking-[0.12em] uppercase hover:gap-3 transition-all duration-200">
            <svg className="w-4 h-4 rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            Back to Posts
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-[#C8102E] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-[0.12em] uppercase">
              {post.category}
            </span>
            <span className="text-[13px] text-[#888888]">{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]">
            {post.title}
          </h1>
        </div>
      </header>

      {/* Article body */}
      <article className="bg-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">

          <figure className="relative mb-10 md:mb-12 -mx-5 sm:-mx-6 lg:-mx-8 aspect-[16/9] overflow-hidden rounded-none md:rounded-2xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 832px, 100vw"
              className="object-cover"
              priority
            />
          </figure>

          <p className="text-[18px] md:text-[20px] text-[#111111] leading-[1.6] mb-8 font-normal italic">
            {post.excerpt}
          </p>

          <div className="prose-body space-y-6">
            <p>
              Singapore's success story is one of the most studied — yet least understood — in modern development history. When we look at what made Singapore work, we see not a miracle but a method: a deliberate, sustained commitment to clear principles, applied consistently over decades.
            </p>
            <p>
              The Singapore Way is not about copying Singapore. It's about understanding the roots of that success — and then planting those roots in your own soil, in your own way, with your own resources.
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mt-12 md:mt-14 mb-5">The Core Insight</h2>
          <div className="prose-body space-y-6">
            <p>
              What Singapore teaches us is that transformation is possible when a society commits to long-term thinking over short-term gains. When institutions are built to last. When talent is developed and rewarded regardless of background.
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mt-12 md:mt-14 mb-5">Adapting, Not Copying</h2>
          <div className="prose-body space-y-6">
            <p>
              The critical distinction is adaptation versus imitation. What matters is not what Singapore did, but why it worked. When you understand the principles behind the policies, you can generate your own solutions.
            </p>
          </div>

          <blockquote className="border-l-[3px] border-[#C8102E] pl-6 md:pl-8 my-12 py-2">
            <p className="text-[#111111] text-xl md:text-2xl italic leading-[1.45]">
              "Don't borrow the fruit. Borrow the root. Then plant it where you stand."
            </p>
            <cite className="block text-[#C8102E] font-bold text-[12px] tracking-[0.14em] uppercase mt-4 not-italic">
              — Maher Kaddoura
            </cite>
          </blockquote>
        </div>
      </article>

      {/* CTA */}
      <section className="bg-[#F5F5F5] py-16 md:py-20 border-t border-[#ECECEC]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="card-editorial p-8 md:p-10">
            <p className="eyebrow mb-4">Continue</p>
            <h3 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mb-4">
              Want the full framework?
            </h3>
            <p className="prose-body mb-7">
              The Singapore Way book walks through all 17 dimensions with practical tools for adaptation.
            </p>
            <a
              href="https://www.amazon.com/Singapore-Way-Principles-Hardship-Prosperity/dp/B0F8DLL2Q9"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill"
            >
              Get the Book
            </a>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 bg-white border-t border-[#ECECEC]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-[#111111]">More Posts</h3>
              <Link href="/blog" className="text-[12px] font-bold text-[#C8102E] tracking-[0.12em] uppercase hover:underline">
                All posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="card-editorial group flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#faf8f4]">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="eyebrow">{r.category}</span>
                      <span className="text-[#CCCCCC]">·</span>
                      <span className="text-[12px] text-[#888888]">{r.readTime}</span>
                    </div>
                    <h4 className="text-[17px] font-bold text-[#111111] leading-[1.3] group-hover:text-[#C8102E] transition-colors">{r.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
