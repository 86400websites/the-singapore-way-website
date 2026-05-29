'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import RequestModal from '@/components/RequestModal'
import { themeIcons, fallbackIcon } from '@/components/sgw-icons'

interface Kit {
  title: string
  desc: string
  tag: string
  group: 'governance' | 'economy' | 'education' | 'health' | 'urban' | 'culture'
}

const kits: Kit[] = [
  { title: 'Leadership and Governance', tag: 'leadership-and-governance', group: 'governance', desc: "Adapt the guiding leadership and governance practices distilled from Singapore's journey." },
  { title: 'Smart Housing', tag: 'smart-housing', group: 'urban', desc: "A framework to adapt Singapore's smart housing principles to your local context." },
  { title: 'Economic Transformation', tag: 'economic-transformation', group: 'economy', desc: "Localise Singapore's economic transformation model for your own market and constraints." },
  { title: 'Talent Development & Education', tag: 'talent-development-and-education', group: 'education', desc: "Adapt Singapore's value development and education strategy to your national or regional context." },
  { title: 'Public Health & Healthcare', tag: 'public-health-and-healthcare-system', group: 'health', desc: "Adapt Singapore's public health and healthcare development for your local context." },
  { title: 'Smart Nation', tag: 'smart-nation', group: 'governance', desc: "Localise Singapore's Smart Nation strategy into a context-driven digital transformation initiative." },
  { title: 'Urban Mobility & Transport', tag: 'urban-mobility-and-sustainable-transport', group: 'urban', desc: "A roadmap to adapt and localise Singapore's urban mobility strategy to your context." },
  { title: 'Water & Resources', tag: 'water-and-resource-management', group: 'urban', desc: "A strategic framework for Singapore's integrated approach to water and resource management." },
  { title: 'Business & Trade Hub', tag: 'business-and-trade-hub', group: 'economy', desc: "Adapt Singapore's business and trade hub strategy into your national or regional context." },
  { title: 'Public Trust & Governance', tag: 'public-trust-and-governance', group: 'governance', desc: "Tools to adapt Singapore's trust-building and governance strategies to your context." },
  { title: 'National Identity', tag: 'national-identity', group: 'culture', desc: "Localise the Singapore model of multicultural nation-building." },
  { title: 'Green Strategy', tag: 'green-strategy', group: 'urban', desc: "Adapt Singapore's green strategy to your local environmental and policy context." },
  { title: 'Innovation & Entrepreneurship', tag: 'fostering-innovation-and-entrepreneurship', group: 'economy', desc: "Localise Singapore's experience in fostering innovation and entrepreneurship." },
  { title: 'Culture & Arts in Nation Building', tag: 'culture-and-arts-in-nation-building', group: 'culture', desc: "Adapt Singapore's strategy of leveraging culture and the arts in nation building." },
  { title: 'Harnessing Technology', tag: 'harnessing-technology-for-the-future', group: 'governance', desc: "A roadmap to localise Singapore's approach to national digital transformation." },
  { title: 'Civic Engagement & Community', tag: 'civic-engagement-and-community-building', group: 'culture', desc: "Localise Singapore's strategic approach to civic engagement and community building." },
]

const groupOptions: { value: 'all' | Kit['group']; label: string }[] = [
  { value: 'all', label: 'All themes' },
  { value: 'governance', label: 'Governance' },
  { value: 'economy', label: 'Economy' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'urban', label: 'Urban & Environment' },
  { value: 'culture', label: 'Culture & Community' },
]

const selectChevron =
  'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23888\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/></svg>")'

export default function LocalizationKitsClient() {
  const [group, setGroup] = useState<'all' | Kit['group']>('all')
  const [tag, setTag] = useState<'all' | string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const ctaRef = useRef<HTMLDivElement | null>(null)

  const filtered = useMemo(() => {
    return kits.filter((k) => {
      if (group !== 'all' && k.group !== group) return false
      if (tag !== 'all' && k.tag !== tag) return false
      return true
    })
  }, [group, tag])

  const scrollToCta = () => ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Apply · Localization Kits"
        title="Apply The Singapore Way where you stand."
        description="Each kit breaks down a principle from The Singapore Way and re-tasks it for your local reality — whether you're redesigning housing policy, education, or governance."
        align="left"
        variant="light"
        image="/assets/apply/localization-kits.png"
        imageAlt="Editorial illustration representing The Singapore Way localization kits"
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
            <span className="text-[#C8102E] font-bold">Localization Kits</span>
          </nav>

          {/* CTA card */}
          <div
            ref={ctaRef}
            id="request-cta"
            className="card-editorial p-6 md:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 scroll-mt-[90px]"
          >
            <div className="flex-1">
              <p className="eyebrow mb-2">Get the Kits</p>
              <p className="text-[16px] md:text-[17px] text-[#111111] font-bold leading-snug">
                Receive a curated list of Localization Kits by email.
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-pill self-start sm:self-auto whitespace-nowrap" type="button">
              Request the Kits
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1">
              <label htmlFor="kit-group" className="block text-[11px] font-bold tracking-[0.12em] uppercase text-[#666666] mb-2">Filter by theme</label>
              <select
                id="kit-group"
                value={group}
                onChange={(e) => setGroup(e.target.value as typeof group)}
                className="w-full border border-[#E5E5E5] rounded-full px-5 py-3 text-[14px] text-[#111111] focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/20 bg-white shadow-sm appearance-none bg-no-repeat bg-[length:1.25rem] bg-[right_1rem_center] pr-12"
                style={{ backgroundImage: selectChevron }}
              >
                {groupOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="kit-tag" className="block text-[11px] font-bold tracking-[0.12em] uppercase text-[#666666] mb-2">Filter by chapter</label>
              <select
                id="kit-tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-full px-5 py-3 text-[14px] text-[#111111] focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/20 bg-white shadow-sm appearance-none bg-no-repeat bg-[length:1.25rem] bg-[right_1rem_center] pr-12"
                style={{ backgroundImage: selectChevron }}
              >
                <option value="all">All chapters</option>
                {kits.map((k) => (
                  <option key={k.tag} value={k.tag}>{k.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result count */}
          <p className="text-[13px] text-[#888888] mb-6">
            Showing <span className="text-[#111111] font-bold">{filtered.length}</span> of {kits.length} kits
            {(group !== 'all' || tag !== 'all') && (
              <button
                onClick={() => { setGroup('all'); setTag('all') }}
                className="ml-3 text-[#C8102E] font-bold hover:underline"
                type="button"
              >
                Reset filters
              </button>
            )}
          </p>

          {/* Kits Grid / Empty */}
          {filtered.length === 0 ? (
            <div className="card-editorial p-12 text-center">
              <p className="eyebrow-muted mb-3">No matches</p>
              <h3 className="text-xl font-bold text-[#111111] mb-3">No kits match those filters.</h3>
              <p className="text-[15px] text-[#666666] mb-6 max-w-md mx-auto">Try a broader theme or reset to see the full set.</p>
              <button
                onClick={() => { setGroup('all'); setTag('all') }}
                className="btn-pill"
                type="button"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {filtered.map(({ title, desc, tag }) => (
                <button
                  key={tag}
                  onClick={scrollToCta}
                  type="button"
                  aria-label={`${title} — request by email`}
                  className="group relative bg-[#f9f9f9] rounded-[15px] p-6 sm:p-7 flex flex-col items-start text-left shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[5px] transition-all duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-3 -right-3 rotate-6 bg-[#C8102E] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-[0_10px_24px_rgba(200,16,46,0.25)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200"
                  >
                    Available via email
                  </span>
                  <div className="mb-5 w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-[15px] bg-[#FBF1E7] text-[#C8102E] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.08]">
                    {themeIcons[tag] ?? fallbackIcon}
                  </div>
                  <h3 className="text-[17px] md:text-[18px] font-bold text-[#181C14] leading-[1.3] mb-3 pr-12">{title}</h3>
                  <span className="block w-10 h-1 bg-[#C8102E] rounded-full mb-4" aria-hidden="true" />
                  <p className="text-[15px] text-[#555555] leading-[1.6]">{desc}</p>
                </button>
              ))}
            </div>
          )}

        </div>
      </section>

      {modalOpen && (
        <RequestModal
          onClose={() => setModalOpen(false)}
          kind="Localization Kits"
          formType="localization-kits"
        />
      )}
    </div>
  )
}
