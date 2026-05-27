import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import PageHero from '@/components/PageHero'
import RevealStagger from '@/components/motion/RevealStagger'
import { pageMetadata } from '@/lib/seo/page-metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Learn',
  description:
    "The foundations behind Singapore's success. Three ways into the framework — course, podcast, blog. Pick the format that fits how you learn best.",
  path: '/learn',
})

const learnCards = [
  {
    title: 'Online Course',
    description: 'Explore 15 principles through practical case studies, videos, and interactive lessons.',
    image: '/assets/learn/online-course.png',
    href: '/online-course',
    cta: 'Coming Soon',
  },
  {
    title: 'Podcast',
    description: "Join us for in-depth dives into the ideas and innovations behind Singapore's rise.",
    image: '/assets/learn/podcast.png',
    href: '/podcasts',
    cta: 'Tune In',
  },
  {
    title: 'Blog',
    description: "Simple lessons from Singapore's success — clear, practical, and ready to use.",
    image: '/assets/learn/blog.png',
    href: '/blog',
    cta: 'Read Now',
  },
]

export default function LearnPage() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Learn"
        title="The foundations behind Singapore's success."
        description="Course, podcast, and blog — three ways into the framework. Pick the format that fits how you learn best."
        align="left"
        variant="light"
      />

      <section className="py-16 md:py-24 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {learnCards.map((card) => (
              <article
                key={card.title}
                className="card-editorial flex flex-col group h-full"
              >
                <div className="card-thumb aspect-[4/3] flex items-center justify-center">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain p-6 group-hover:scale-[1.03] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                </div>
                <div className="p-7 md:p-8 flex flex-col flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] tracking-[-0.005em] mb-3">
                    {card.title}
                  </h3>
                  <p className="prose-body mb-7 flex-1">{card.description}</p>
                  <div>
                    <Link href={card.href} className="btn-pill">
                      {card.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </RevealStagger>
        </div>
      </section>
    </div>
  )
}
