'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import RequestModal from '@/components/RequestModal'

interface UseCase {
  icon: string
  title: string
  desc: string
}

const useCases: UseCase[] = [
  { icon: '🌱', title: 'Climate by Design', desc: "Embeds mandatory climate-positive urban-design studies at the University of Ghana so graduates can future-proof Accra." },
  { icon: '🔵', title: 'Digital Twins for All', desc: "CityTwin SaaS gives cash-strapped cities mobile digital-twin tools to test infrastructure scenarios before they build." },
  { icon: '💰', title: 'From Informal to Investable', desc: "Investable Bamako turns informal micro-enterprises into bankable industrial clusters through micro-parks and e-ID finance access." },
  { icon: '👥', title: 'My City, My Chapter', desc: "Neighborhood Chapters in Lalitpur let citizens co-design plans, budgets, and policies for their own streets." },
  { icon: '🏛️', title: 'Redesigning the State', desc: "Statecraft Studio Addis swaps rote policy study for live simulations that let students prototype real governance reforms." },
  { icon: '🌳', title: 'Roots in the Sky', desc: "Skycool Nairobi converts unsafe rooftop shanties into modular green micro-villages with housing, farms, and services." },
  { icon: '🗺️', title: 'Smart Streets, Safe Cities', desc: "Port Louis Smart Street Grid links sensors, smart lights, and live dashboards to cut crime and smooth traffic." },
  { icon: '🌐', title: 'Sovereignty as Strategy', desc: "Belmora 2040 equips Saint Calade to steer long-term development with a sovereign foresight framework and diaspora bonds." },
  { icon: '⚡', title: 'City as a Service', desc: "GridBlocks in Gulu delivers prepaid, high-uptake power via modular micro-grids that treat energy as a civic service." },
  { icon: '📚', title: 'From Learning to Earning', desc: "W-Connect in Asmara gives women micro-training credits and an app to translate new skills directly into higher income." },
  { icon: '🔬', title: 'Scenario Labs for Clients', desc: "Cobalt Strategies' Scenario Labs lets companies co-create modular simulations that bake long-term foresight into strategy." },
  { icon: '❤️', title: 'Unity by Platform', desc: "UbuntuConnect gamifies civic missions, tracks a Unity Index, and rewards diverse users to build social cohesion across Johannesburg." },
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
          <div ref={ctaRef} className="card-editorial p-6 md:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
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
            Each card is an illustrative scenario. Hover or tap to reveal availability — every case is sent by email on request.
          </p>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {useCases.map(({ icon, title, desc }) => (
              <button
                key={title}
                onClick={scrollToCta}
                type="button"
                aria-label={`${title} — request by email`}
                className="card-editorial p-6 sm:p-7 md:p-8 flex flex-col text-left group hover:border-[#C8102E]/30 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2"
              >
                <span className="absolute top-4 right-4 bg-[#C8102E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[0.06em] uppercase opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Available via email
                </span>
                <div className="icon-block mb-5">
                  <span aria-hidden="true">{icon}</span>
                </div>
                <h3 className="text-[18px] md:text-[20px] font-bold text-[#111111] leading-[1.25] tracking-[-0.005em] mb-3 pr-16 md:pr-24">{title}</h3>
                <span className="block w-8 h-[3px] bg-[#C8102E] rounded-full mb-4" aria-hidden="true" />
                <p className="text-[15px] text-[#666666] leading-[1.6] mb-6">{desc}</p>
                <span className="link-arrow mt-auto pt-2 group-hover:gap-2.5">
                  Request example
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {modalOpen && <RequestModal onClose={() => setModalOpen(false)} kind="Use Cases" />}
    </div>
  )
}
