import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import PageHero from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo/page-metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Teach',
  description:
    "Equip students with proven principles. Seventeen case studies for classrooms, boardrooms, and policy briefings — built around the systems behind Singapore's rise.",
  path: '/teach',
})

export default function TeachPage() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Teach"
        title="Equip students with proven principles."
        description="Seventeen case studies, ready for the classroom, the boardroom, and policy briefings — built around the systems behind Singapore's rise."
        align="left"
        variant="light"
        image="/assets/home/teach-card.png"
        imageAlt="Editorial illustration representing teaching with proven principles"
        priority
      />

      <section className="py-16 md:py-24 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <article className="card-editorial flex flex-col group">
            <div className="relative aspect-[16/9] bg-[#faf8f4] overflow-hidden flex items-center justify-center border-b border-[#ECECEC]">
              <Image
                src="/assets/teach/case-studies.png"
                alt="Case Studies"
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-contain p-8 group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col">
              <p className="eyebrow-muted mb-3">17 Studies</p>
              <h3 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mb-4">
                Case Studies
              </h3>
              <p className="prose-body mb-8">
                Download 17 practical case studies linked to The Singapore Way principles, showing how systems were built, scaled, and sustained — for deeper learning in classrooms and leadership programs.
              </p>
              <div>
                <Link href="/teaching-materials" className="btn-pill">
                  Browse Cases
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
