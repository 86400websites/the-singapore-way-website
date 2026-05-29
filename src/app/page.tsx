import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import FreeBookSummaryButton from '@/components/FreeBookSummaryButton'
import Reveal from '@/components/motion/Reveal'
import RevealStagger from '@/components/motion/RevealStagger'
import { CardMedia } from '@/components/ui/card'
import { pageMetadata } from '@/lib/seo/page-metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Method, not miracle',
  description:
    "Singapore's success wasn't a miracle—it was a method. The Singapore Way turns that method into practical principles for leaders, educators, and change-makers across the Global Majority.",
  path: '/',
})

const pillars = [
  {
    title: 'Learn',
    description: 'Discover practical lessons through clear tools, short videos, and insightful readings.',
    image: '/assets/home/learn-card.png',
    href: '/learn',
  },
  {
    title: 'Apply',
    description: 'Use practical worksheets, ready-to-use templates, and sector-specific guidance to apply The Singapore Way where it matters most.',
    image: '/assets/home/apply-card.png',
    href: '/apply',
  },
  {
    title: 'Teach',
    description: 'Access ready-to-use teaching materials, real-world case studies—fact sheets for universities, think tanks, and professional training programs.',
    image: '/assets/home/teach-card.png',
    href: '/teach',
  },
  {
    title: 'Ideate',
    description: 'Brainstorm practical solutions to real challenges in your own environment—guided and inspired by The Singapore Way.',
    image: '/assets/home/ideate-card.png',
    href: '/ideate',
  },
]

export default function Page() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-white pt-16 pb-14 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111111] leading-[1.08] tracking-[-0.01em] mb-6">
                The Singapore Way
              </h1>
              <span className="editorial-rule mb-7 mx-auto lg:mx-0" aria-hidden="true" />
              <p className="text-[17px] sm:text-[18px] text-[#444444] leading-[1.5] mb-6 max-w-xl mx-auto lg:mx-0 font-bold">
                More Than a Book, a Bridge from Singapore to the Global Majority
              </p>
              <p className="text-[15px] sm:text-base text-[#666666] leading-[1.7] mb-9 max-w-xl mx-auto lg:mx-0">
                Singapore's success wasn't a miracle—it was a method. The Singapore Way turns that method into something practical and adaptable for leaders, educators, and change-makers across the Global Majority. It's not about copying Singapore, but learning how to think, plan, and execute with clarity—then applying it to your own context.
              </p>
              <Link href="/q-a" className="btn-pill">
                Start Exploring
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative mx-auto lg:ml-auto w-full max-w-[440px] sm:max-w-[520px] lg:max-w-[560px] aspect-square">
                <Image
                  src="/assets/home/Hero%20-%20The%20Singapore%20Way.png"
                  alt="The Singapore Way hero illustration"
                  fill
                  sizes="(min-width: 1024px) 560px, (min-width: 640px) 520px, 100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial pull quote */}
      <section className="py-14 sm:py-16 bg-white border-y border-[#ECECEC]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="editorial-rule mx-auto mb-7" aria-hidden="true" />
          <blockquote className="text-[#111111] text-xl md:text-2xl italic leading-[1.45]">
            “Don't borrow the fruit. Borrow the root.”
          </blockquote>
          <cite className="block text-[#C8102E] font-bold text-[12px] tracking-[0.14em] uppercase mt-5 not-italic">
            — Maher Kaddoura
          </cite>
        </div>
      </section>

      {/* Framework Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src="/assets/home/Home%20Page%20Image%202.png"
                  alt="A Practical Framework for National and Local Transformation"
                  fill
                  sizes="(min-width: 1024px) 448px, 100vw"
                  className="object-contain"
                />
              </div>
            </div>
            <Reveal as="div" className="lg:col-span-7">
              <p className="eyebrow mb-5">The Framework</p>
              <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#111111] mb-6 leading-[1.18] tracking-[-0.01em]">
                A Practical Framework for National and Local Transformation
              </h2>
              <span className="editorial-rule mb-7" aria-hidden="true" />
              <p className="text-[15px] sm:text-base text-[#444444] leading-[1.7] mb-4">
                Too many countries are asked to admire success stories…<br />
                But they're rarely given the tools to build their own.
              </p>
              <p className="text-[15px] sm:text-base text-[#444444] leading-[1.7] mb-4">
                Singapore's rise wasn't luck. It was systems thinking, designed for decades, not cycles.
              </p>
              <p className="text-[15px] sm:text-base text-[#444444] leading-[1.7] mb-8">
                This book and platform share a framework and principles—not to copy them, but to understand them, teach them, and adapt them to build new, local futures.
              </p>
              <div className="flex flex-wrap gap-3">
                <FreeBookSummaryButton />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <Reveal as="div" className="lg:col-span-7 order-2 lg:order-1">
              <p className="eyebrow mb-5">Who Is It For</p>
              <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#111111] mb-6 leading-[1.18] tracking-[-0.01em]">
                Who is it for?
              </h2>
              <span className="editorial-rule mb-7" aria-hidden="true" />
              <ul className="space-y-4 mb-9">
                <li className="flex items-start gap-3 text-[15px] sm:text-base text-[#444444] leading-[1.6]">
                  <span className="text-[#C8102E] font-bold mt-0.5 flex-shrink-0" aria-hidden="true">—</span>
                  <span><span className="font-bold text-[#111111]">Educators</span>, who want to teach systems, not just policies.</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] sm:text-base text-[#444444] leading-[1.6]">
                  <span className="text-[#C8102E] font-bold mt-0.5 flex-shrink-0" aria-hidden="true">—</span>
                  <span><span className="font-bold text-[#111111]">Government leaders</span>, who want to pilot reforms with clarity.</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] sm:text-base text-[#444444] leading-[1.6]">
                  <span className="text-[#C8102E] font-bold mt-0.5 flex-shrink-0" aria-hidden="true">—</span>
                  <span><span className="font-bold text-[#111111]">Social innovators</span>, who want to design smart from the start.</span>
                </li>
              </ul>
              <Link href="/q-a" className="btn-pill">
                Questions &amp; Answers
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Reveal>
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src="/assets/home/Home%20Page%20Image%203.png"
                  alt="Who The Singapore Way is for"
                  fill
                  sizes="(min-width: 1024px) 448px, 100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <p className="eyebrow mb-4">Four ways to engage</p>
            <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#111111] tracking-[-0.01em] leading-[1.18]">
              Choose your path into The Singapore Way
            </h2>
            <span className="editorial-rule mx-auto mt-6" aria-hidden="true" />
          </div>
          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
            {pillars.map((pillar) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="card-link group flex flex-col h-full"
                aria-label={`${pillar.title} — Explore`}
              >
                <CardMedia aspect="aspect-[16/9]">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </CardMedia>
                <div className="flex flex-col flex-1 p-6 sm:p-7">
                  <h3 className="text-[19px] md:text-xl font-bold text-[#111111] leading-[1.25] tracking-[-0.005em] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-[14.5px] text-[#666666] leading-[1.65] mb-7 flex-1">
                    {pillar.description}
                  </p>
                  <span className="link-arrow group-hover:gap-2.5">
                    Explore
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </RevealStagger>
        </div>
      </section>

    </div>
  )
}
