import { Link } from 'react-router-dom'

export default function Apply() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Apply</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Apply The Singapore Way
          </h1>
          <p className="text-[#AAAAAA] text-xl max-w-2xl leading-relaxed">
            Transform Singapore's development principles into effective local solutions with practical localization kits and interactive labs tailored for your city, country, or organization.
          </p>
        </div>
      </section>

      {/* Apply Options */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Localization Kits */}
            <div className="group">
              <div className="overflow-hidden mb-8">
                <img
                  src="/assets/apply/localization-kits.png"
                  alt="Localization Kits"
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-[#C8102E] text-xs font-semibold tracking-widest uppercase mb-3">Tools for Adaptation</p>
              <h2 className="text-3xl font-bold text-[#111111] mb-4">Localization Kits</h2>
              <p className="text-[#666666] text-lg leading-relaxed mb-6">
                Easily adapt Singapore's proven principles to your local context using practical Localization Kits. Ideal for housing, education, governance reforms, and more. Each kit provides step-by-step guidance for translating principles into action.
              </p>
              <Link
                to="/localization-kits"
                className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-semibold px-7 py-3.5 text-sm tracking-wide hover:bg-[#a50d26] transition-colors"
              >
                Explore Localization Kits
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Examples / Possibilities */}
            <div className="group">
              <div className="overflow-hidden mb-8">
                <img
                  src="/assets/apply/examples.png"
                  alt="Examples / Possibilities"
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-[#C8102E] text-xs font-semibold tracking-widest uppercase mb-3">Illustrative Use Cases</p>
              <h2 className="text-3xl font-bold text-[#111111] mb-4">Examples & Possibilities</h2>
              <p className="text-[#666666] text-lg leading-relaxed mb-6">
                Explore how others have adapted Singapore's principles to address challenges in their own cities, ministries, and communities. Real stories of adaptation and transformation.
              </p>
              <Link
                to="/possibilities"
                className="inline-flex items-center gap-2 bg-[#111111] text-white font-semibold px-7 py-3.5 text-sm tracking-wide hover:bg-[#333333] transition-colors"
              >
                Explore Examples
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Domains</p>
            <h2 className="text-4xl font-bold text-[#111111]">Apply to Any Sector</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Housing', 'Water', 'Education', 'Governance', 'Economic Growth', 'Urban Planning'].map((domain) => (
              <div key={domain} className="bg-white border border-[#E5E5E5] p-6 text-center hover:border-[#C8102E] hover:shadow-md transition-all">
                <p className="text-[#111111] font-semibold text-sm">{domain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C8102E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Start Applying Today</h2>
            <p className="text-white/80">Download a localization kit or explore real-world examples.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/localization-kits" className="bg-white text-[#C8102E] font-bold px-8 py-4 text-sm tracking-wide hover:bg-[#F5F5F5] transition-colors">
              Get Localization Kits
            </Link>
            <Link to="/possibilities" className="border-2 border-white text-white font-bold px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-[#C8102E] transition-colors">
              See Examples
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
