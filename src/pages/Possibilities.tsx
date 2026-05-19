import { Link } from 'react-router-dom'

const examples = [
  {
    country: 'South Africa',
    domain: 'Governance',
    title: 'Rebuilding Public Trust Through Institutional Reform',
    desc: 'How Singapore\'s anti-corruption and meritocracy principles are being studied by South African reform advocates to rebuild public sector legitimacy.',
  },
  {
    country: 'Rwanda',
    domain: 'Urban Planning',
    title: 'Vision 2050: Singapore Principles in Kigali',
    desc: 'Rwanda\'s urban planners draw directly on Singapore\'s clean city, integrated planning, and long-term vision frameworks in developing Kigali.',
  },
  {
    country: 'Ethiopia',
    domain: 'Economic Strategy',
    title: 'Industrial Park Strategy Inspired by Singapore\'s FDI Model',
    desc: 'Ethiopia\'s industrial zones programme borrows from Singapore\'s strategic FDI attraction and industrial upgrading ladder approach.',
  },
  {
    country: 'Kazakhstan',
    domain: 'Education',
    title: 'Reforming Higher Education for National Competitiveness',
    desc: 'Kazakhstan\'s education reforms draw on Singapore\'s STEM emphasis, meritocracy in university admissions, and teaching quality frameworks.',
  },
  {
    country: 'Jordan',
    domain: 'Water Security',
    title: 'Four Taps Strategy for a Water-Scarce Nation',
    desc: 'Jordan\'s water security planners are adapting Singapore\'s diversified water sourcing strategy to their desert context.',
  },
  {
    country: 'Vietnam',
    domain: 'Economic Policy',
    title: 'Long-Term Economic Transformation Planning',
    desc: 'Vietnam\'s sustained economic development strategy shares structural similarities with Singapore\'s pragmatic, meritocratic industrial policy.',
  },
]

export default function Possibilities() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Possibilities</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Examples: Illustrative Use Cases
              </h1>
              <p className="text-[#AAAAAA] text-xl leading-relaxed mb-8">
                This space is designed to help you explore how others have adapted Singapore's principles to address challenges in their own cities, ministries, and communities.
              </p>
            </div>
            <div className="relative flex justify-center">
              <img
                src="/assets/apply/examples.png"
                alt="Examples and Possibilities"
                className="w-full max-w-md shadow-2xl rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-[#F5F5F5] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-[#111111] mb-4">What Are These Examples?</h2>
          <p className="text-[#666666] text-lg leading-relaxed">
            These are not Singapore replicas. They are illustrative demonstrations of how the <em>principles</em> of The Singapore Way have been — or could be — adapted to different national and local contexts. The goal is to spark ideas, not provide blueprints.
          </p>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {examples.map(({ country, domain, title, desc }) => (
              <div key={title} className="border border-[#E5E5E5] p-8 hover:border-[#C8102E] hover:shadow-lg transition-all group">
                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-[#C8102E] text-white text-xs font-bold px-3 py-1 tracking-wide">{domain}</span>
                  <span className="text-[#999999] text-xs font-medium">{country}</span>
                </div>
                <h3 className="text-[#111111] font-bold text-lg mb-3 group-hover:text-[#C8102E] transition-colors leading-tight">{title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribute */}
      <section className="bg-[#111111] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Know of a real example?</h2>
            <p className="text-[#AAAAAA]">We're building a global library of adaptation examples. Contribute yours.</p>
          </div>
          <a
            href="mailto:info@thesingaporeway.com"
            className="bg-[#C8102E] text-white font-bold px-8 py-4 text-sm tracking-wide hover:bg-[#a50d26] transition-colors flex-shrink-0"
          >
            Share an Example
          </a>
        </div>
      </section>
    </div>
  )
}
