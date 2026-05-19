import { Link } from 'react-router-dom'

const kits = [
  {
    domain: 'Housing',
    title: 'Housing Localization Kit',
    desc: 'Adapt Singapore\'s HDB model principles for your context — from policy design to community planning.',
    items: ['Land acquisition frameworks', 'Affordability mechanisms', 'Racial/ethnic integration policies', 'Resale market design'],
  },
  {
    domain: 'Water',
    title: 'Water Security Kit',
    desc: 'Build a four-tap diversification strategy for your water security challenges.',
    items: ['Source diversification audit', 'Water pricing policy templates', 'Conservation campaign frameworks', 'Infrastructure planning guides'],
  },
  {
    domain: 'Education',
    title: 'Education Transformation Kit',
    desc: 'Redesign your education system for long-term national development and competitiveness.',
    items: ['Curriculum alignment tools', 'Teacher development frameworks', 'Meritocracy implementation guides', 'Technical education pathway design'],
  },
  {
    domain: 'Governance',
    title: 'Governance Reform Kit',
    desc: 'Build cleaner, more effective government institutions rooted in Singapore\'s governance principles.',
    items: ['Anti-corruption frameworks', 'Civil service reform guides', 'Transparency mechanisms', 'Public trust-building strategies'],
  },
  {
    domain: 'Economics',
    title: 'Economic Strategy Kit',
    desc: 'Design a long-term economic strategy using Singapore\'s proven FDI and industrial policy approaches.',
    items: ['FDI attraction frameworks', 'Economic zone design', 'Industry ladder strategies', 'Labour market policy tools'],
  },
  {
    domain: 'Urban',
    title: 'Urban Planning Kit',
    desc: 'Adapt Singapore\'s integrated urban planning model for sustainable, liveable city development.',
    items: ['Land use planning templates', 'Transport integration frameworks', 'Green space policies', 'Urban density models'],
  },
]

export default function LocalizationKits() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Localization Kits</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                The Singapore Way Localization Kits
              </h1>
              <p className="text-[#AAAAAA] text-xl leading-relaxed mb-8">
                Easily adapt Singapore's proven principles to your local context using practical Localization Kits. Ideal for housing, education, governance reforms, and more.
              </p>
              <a
                href="mailto:info@thesingaporeway.com"
                className="inline-block bg-[#C8102E] text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-[#a50d26] transition-colors"
              >
                Request Access
              </a>
            </div>
            <div className="relative flex justify-center">
              <img
                src="/assets/apply/localization-kits.png"
                alt="Localization Kits"
                className="w-full max-w-md shadow-2xl rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What Is a Kit */}
      <section className="py-16 bg-[#F5F5F5] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Context Audit', desc: 'Map your local conditions, constraints, and opportunities to identify where adaptation is needed.' },
              { title: 'Principle Mapping', desc: 'Match Singapore\'s relevant principles to your specific challenges and governance context.' },
              { title: 'Implementation Roadmap', desc: 'Get a structured pathway for piloting and scaling adapted principles in your context.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-8 border border-[#E5E5E5]">
                <div className="w-10 h-1 bg-[#C8102E] mb-5"></div>
                <h3 className="text-lg font-bold text-[#111111] mb-3">{title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kits Grid */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Available Kits</p>
            <h2 className="text-4xl font-bold text-[#111111]">Sector-Specific Localization Kits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kits.map(({ domain, title, desc, items }) => (
              <div key={title} className="border border-[#E5E5E5] overflow-hidden hover:shadow-lg hover:border-[#C8102E] transition-all group">
                <div className="bg-[#111111] p-6">
                  <span className="inline-block bg-[#C8102E] text-white text-xs font-bold px-3 py-1 tracking-widest uppercase mb-3">
                    {domain}
                  </span>
                  <h3 className="text-white font-bold text-xl">{title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-[#666666] text-sm leading-relaxed mb-5">{desc}</p>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-[#333333]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full bg-[#F5F5F5] group-hover:bg-[#C8102E] text-[#111111] group-hover:text-white font-semibold py-3 text-sm tracking-wide transition-colors">
                    Coming Soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C8102E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Need a custom kit?</h2>
            <p className="text-white/80">We work with governments, universities, and organizations to develop context-specific adaptation kits.</p>
          </div>
          <a
            href="mailto:info@thesingaporeway.com"
            className="bg-white text-[#C8102E] font-bold px-8 py-4 text-sm tracking-wide hover:bg-[#F5F5F5] transition-colors flex-shrink-0"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}
