import type { Metadata } from 'next'
import Image from 'next/image'

import PageHero from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo/page-metadata'

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    "A method, not a miracle. We translate Singapore's principles into practical tools that change-makers across the Global Majority can adapt to their own context.",
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="bg-white">

      <PageHero
        eyebrow="About"
        title="A method, not a miracle. A mindset, not a copy."
        description="We translate Singapore's principles into practical tools that change-makers across the Global Majority can adapt to their own context."
        align="left"
        variant="light"
      />

      {/* About the Author */}
      <section className="py-20 md:py-24 bg-white border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[440px]">
                {/* Soft warm offset shadow behind the frame */}
                <span
                  aria-hidden="true"
                  className="absolute -inset-3 sm:-inset-4 bg-[#fbf5f2] rounded-[28px] -z-0"
                />
                <div className="relative overflow-hidden rounded-2xl bg-white border border-[#ECECEC] shadow-[0_24px_48px_-24px_rgba(17,17,17,0.22)]">
                  <Image
                    src="/assets/about/author.png"
                    alt="Maher Kaddoura"
                    width={1036}
                    height={1036}
                    className="block w-full h-auto"
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col">
              <p className="eyebrow mb-5">The Author</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111111] leading-[1.15] mb-7">
                Maher Kaddoura
              </h2>
              <p className="prose-body mb-5">
                Strategist, author, and former Accenture consultant driven by one core mission: turning bold ideas into real impact. He leads The Singapore Way, combining deep research with hands-on leadership experience to reveal how nations can rise from adversity to prosperity.
              </p>
              <p className="prose-body mb-9">
                Through his work, he empowers change-makers from around the world to adapt Singapore's principles for innovation, leadership, and sustainable success. He serves on the Advisory Board of the National University of Singapore.
              </p>
              <div>
                <a
                  href="https://maherkaddoura.com/english"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill"
                >
                  Get to know Maher
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col">
              <p className="eyebrow mb-5">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111111] leading-[1.15] mb-7">
                From a single question to a working framework
              </h2>
              <p className="prose-body mb-5">
                It started with one question: can transformation be replicated without imitation?
              </p>
              <p className="prose-body mb-5">
                Our answer was a mindset — not just a platform. We distilled Singapore's journey into 15 adaptable principles, supported by real-world tools.
              </p>
              <p className="prose-body mb-9">
                The goal isn't to glorify a country, but to empower change-makers — in cities, classrooms, and communities — to tailor proven strategies to their own local challenges.
              </p>
              <div>
                <a href="mailto:info@thesingaporeway.com" className="btn-pill">
                  Contact Us
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[460px] aspect-square">
                <Image
                  src="/assets/about/our-story.png"
                  alt="An illustration of Singapore's skyline along the waterfront, with a red path tracing the city's transformation"
                  fill
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <span className="editorial-rule mx-auto mb-6" aria-hidden="true" />
          <blockquote className="text-[#111111] text-xl md:text-2xl italic leading-[1.5]">
            "We're not here to copy Singapore. We're here to build with what we have, boldly, and together."
          </blockquote>
          <cite className="block text-[#C8102E] font-bold text-[13px] tracking-[0.12em] uppercase mt-5 not-italic">
            — Maher Kaddoura
          </cite>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="py-20 md:py-24 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="eyebrow mb-4">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111111] leading-[1.15] mb-5">
              Resilient systems are built, not borrowed.
            </h2>
            <p className="prose-body">
              We believe every nation, no matter how constrained, can build effective systems — with the right mindset and tools.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="card-editorial p-8 md:p-10">
              <Image src="/assets/about/mission-icon.png" alt="" width={48} height={48} className="h-12 w-auto mb-6 opacity-80" />
              <h3 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-4">
                Our Mission
              </h3>
              <p className="prose-body">
                Equip governments, educators, and change-makers across the Global Majority with proven frameworks for equity, dignity, and long-term progress.
              </p>
            </div>
            <div className="card-editorial p-8 md:p-10">
              <Image src="/assets/about/vision-icon.png" alt="" width={48} height={48} className="h-12 w-auto mb-6 opacity-80" />
              <h3 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-4">
                Our Vision
              </h3>
              <p className="prose-body">
                Global majority countries designing sovereign, cohesive, sustainable systems — inspired by Singapore, adapted to their own reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing quote */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <span className="editorial-rule mx-auto mb-6" aria-hidden="true" />
          <blockquote className="text-[#111111] text-xl md:text-2xl italic leading-[1.5]">
            "Don't borrow the fruit. Borrow the root. Then plant it where you stand."
          </blockquote>
          <cite className="block text-[#C8102E] font-bold text-[13px] tracking-[0.12em] uppercase mt-5 not-italic">
            — Maher Kaddoura
          </cite>
        </div>
      </section>

    </div>
  )
}
