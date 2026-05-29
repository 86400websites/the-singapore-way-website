'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import RequestModal from '@/components/RequestModal'
import { exampleIcons, fallbackIcon } from '@/components/sgw-icons'

interface UseCase {
  slug: string
  title: string
  desc: string
}

const useCases: UseCase[] = [
  { slug: 'climate-by-design', title: 'Climate by Design', desc: "Embeds mandatory climate-positive urban-design studies at the University of Ghana so graduates can future-proof Accra." },
  { slug: 'digital-twins', title: 'Digital Twins for All', desc: "CityTwin SaaS gives cash-strapped cities mobile digital-twin tools to test infrastructure scenarios before they build." },
  { slug: 'from-informal-to-investable', title: 'From Informal to Investable', desc: "Investable Bamako turns informal micro-enterprises into bankable industrial clusters through micro-parks and e-ID finance access." },
  { slug: 'my-city-my-chapter', title: 'My City, My Chapter', desc: "Neighborhood Chapters in Lalitpur let citizens co-design plans, budgets, and policies for their own streets." },
  { slug: 'redesigning-the-state', title: 'Redesigning the State', desc: "Statecraft Studio Addis swaps rote policy study for live simulations that let students prototype real governance reforms." },
  { slug: 'roots-in-the-sky', title: 'Roots in the Sky', desc: "Skycool Nairobi converts unsafe rooftop shanties into modular green micro-villages with housing, farms, and services." },
  { slug: 'smart-streets-safe-cities', title: 'Smart Streets, Safe Cities', desc: "Port Louis Smart Street Grid links sensors, smart lights, and live dashboards to cut crime and smooth traffic." },
  { slug: 'sovereignty-as-strategy', title: 'Sovereignty as Strategy', desc: "Belmora 2040 equips Saint Calade to steer long-term development with a sovereign foresight framework and diaspora bonds." },
  { slug: 'city-as-a-service', title: 'City as a Service', desc: "GridBlocks in Gulu delivers prepaid, high-uptake power via modular micro-grids that treat energy as a civic service." },
  { slug: 'from-learning-to-earning', title: 'From Learning to Earning', desc: "W-Connect in Asmara gives women micro-training credits and an app to translate new skills directly into higher income." },
  { slug: 'scenario-labs', title: 'Scenario Labs for Clients', desc: "Cobalt Strategies' Scenario Labs lets companies co-create modular simulations that bake long-term foresight into strategy." },
  { slug: 'unity-by-platform', title: 'Unity by Platform', desc: "UbuntuConnect gamifies civic missions, tracks a Unity Index, and rewards diverse users to build social cohesion across Johannesburg." },
]

export default function PossibilitiesClient() {
  const [modalOpen, setModalOpen] = useState(false)
  const ctaRef = useRef<HTMLDivElement | null>(null)
  const scrollToCta = () => ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Apply · Examples"
        title="What it looks like when the principles travel."
        description="Illustrative use cases showing how communities adapt The Singapore Way to address challenges across cities, ministries, and public systems."
        align="left"
        variant="light"
        image="/assets/apply/examples.png"
        imageAlt="Editorial illustration representing examples of The Singapore Way in practice"
        priority
      />

      <section className="py-14 md:py-20 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="text-[12px] text-[#888888] mb-8 flex items-center gap-2 tracking-[0.04em]" aria-label="Breadcrumb">
            <Link href="/apply" className="hover:text-[#111111] transition-colors">Apply</Link>
            <svg className="w-3 h-3 text-[#CCCCCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#C8102E] font-bold">Examples</span>
          </nav>

          {/* CTA card */}
          <div
            ref={ctaRef}
            id="request-cta"
            className="card-editorial p-6 md:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 scroll-mt-[90px]"
          >
            <div className="flex-1">
              <p className="eyebrow mb-2">Get the Use Cases</p>
              <p className="text-[16px] md:text-[17px] text-[#111111] font-bold leading-snug">
                Receive a curated list of Use Cases by email.
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-pill self-start sm:self-auto whitespace-nowrap" type="button">
              Request the Use Cases
            </button>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mb-3 mt-4">
            Explore the Cases
          </h2>
          <p className="text-[15px] text-[#666666] mb-8 max-w-2xl">
            Each card is an illustrative scenario. Tap any card to jump to the request form above — every case is sent by email on request.
          </p>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {useCases.map(({ slug, title, desc }) => (
              <button
                key={slug}
                onClick={scrollToCta}
                type="button"
                aria-label={`${title} — request by email above`}
                className="group relative bg-[#f9f9f9] rounded-[15px] p-6 sm:p-7 flex flex-col items-start text-left cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[5px] transition-all duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3 -right-3 rotate-6 bg-[#C8102E] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-[0_10px_24px_rgba(200,16,46,0.25)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200"
                >
                  Request above
                </span>
                <div className="mb-5 w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-[15px] bg-[#FBF1E7] text-[#C8102E] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.08]">
                  {exampleIcons[slug] ?? fallbackIcon}
                </div>
                <h3 className="text-[18px] md:text-[20px] font-bold text-[#181C14] leading-[1.25] tracking-[-0.005em] mb-3 pr-10">{title}</h3>
                <span className="block w-10 h-1 bg-[#C8102E] rounded-full mb-4" aria-hidden="true" />
                <p className="text-[15px] text-[#555555] leading-[1.6]">{desc}</p>
              </button>
            ))}
          </div>

        </div>
      </section>

      {modalOpen && (
        <RequestModal
          onClose={() => setModalOpen(false)}
          kind="Use Cases"
          formType="use-cases"
        />
      )}
    </div>
  )
}
