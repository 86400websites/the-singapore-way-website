import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import PageHero from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo/page-metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Apply',
  description:
    'Adapt The Singapore Way to where you stand. Kits and case studies designed for adaptation, not imitation — tailored to your own sector, context, and constraints.',
  path: '/apply',
})

const applyCards = [
  {
    title: 'Localization Kits',
    description: 'Practical guides that adapt the 15+ principles of The Singapore Way to diverse challenges — through adaptation, not imitation.',
    image: '/assets/apply/localization-kits.png',
    href: '/localization-kits',
    cta: 'Explore Kits',
  },
  {
    title: 'Examples',
    description: 'Illustrative use cases showing how The Singapore Way can be adapted to solve complex challenges across communities.',
    image: '/assets/apply/examples.png',
    href: '/possibilities',
    cta: 'Explore Cases',
  },
]

export default function ApplyPage() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Apply"
        title="Adapt The Singapore Way to where you stand."
        description="Kits and case studies designed for adaptation, not imitation — built to be tailored to your own context, sector, and constraints."
        align="left"
        variant="light"
      />

      <section className="py-16 md:py-24 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {applyCards.map((card) => (
              <article
                key={card.title}
                className="card-editorial flex flex-col group"
              >
                <div className="relative aspect-[4/3] bg-[#faf8f4] overflow-hidden flex items-center justify-center border-b border-[#ECECEC]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain p-6 group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="p-7 md:p-8 flex flex-col flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-3">
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
          </div>
        </div>
      </section>
    </div>
  )
}
