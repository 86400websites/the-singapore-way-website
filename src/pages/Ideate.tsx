import { Link } from 'react-router-dom'

const useCases = [
  {
    domain: 'Urban Planning',
    title: 'Smart Cities for Developing Nations',
    description: 'How Singapore\'s integrated urban planning model can be adapted for rapidly growing cities in Africa and Asia.',
  },
  {
    domain: 'Water Security',
    title: 'Four Taps Water Policy',
    description: 'Adapting Singapore\'s diversified water source strategy to build resilience against climate-driven water scarcity.',
  },
  {
    domain: 'Education',
    title: 'Meritocracy Without Elitism',
    description: 'Building education systems that reward ability while ensuring equity and opportunity for all socioeconomic groups.',
  },
  {
    domain: 'Governance',
    title: 'Anti-Corruption Systems',
    description: 'Institutional design principles that build public trust and create accountability structures that last.',
  },
  {
    domain: 'Housing',
    title: 'Public Housing as Nation Building',
    description: 'How public housing policy can simultaneously address shelter, social cohesion, and wealth-building.',
  },
  {
    domain: 'Economic Policy',
    title: 'Strategic Economic Transformation',
    description: 'Long-term industrial policy and FDI strategy applied to economies transitioning from commodity dependence.',
  },
]

export default function Ideate() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Ideate</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Ideation Hub: Practical Applications of The Singapore Way
          </h1>
          <p className="text-[#AAAAAA] text-xl max-w-2xl leading-relaxed">
            Access use cases illustrating how The Singapore Way's principles solve real-world challenges, from urban planning to climate resilience.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-[#F5F5F5] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-[#111111] mb-4">Where Ideas Become Solutions</h2>
            <p className="text-[#666666] text-lg leading-relaxed">
              The Ideate hub is a space for imaginative, principle-driven thinking. Each use case here demonstrates how Singapore's core principles could be applied to common development challenges — adapted, not copied.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Use Cases</p>
            <h2 className="text-4xl font-bold text-[#111111]">Illustrative Applications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map(({ domain, title, description }) => (
              <div key={title} className="border border-[#E5E5E5] p-8 hover:border-[#C8102E] hover:shadow-lg transition-all group">
                <span className="inline-block bg-[#C8102E] text-white text-xs font-bold px-3 py-1.5 tracking-wide uppercase mb-5">
                  {domain}
                </span>
                <h3 className="text-xl font-bold text-[#111111] mb-3 group-hover:text-[#C8102E] transition-colors">{title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-20 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">The Foundation</p>
              <h2 className="text-4xl font-bold mb-6">15 Adaptable Principles</h2>
              <p className="text-[#AAAAAA] text-lg leading-relaxed mb-8">
                We distilled Singapore's journey into 15 adaptable principles, supported by real-world tools. The goal isn't to glorify a country, but to empower changemakers — in cities, classrooms, and communities — to tailor proven strategies to their own local challenges.
              </p>
              <Link
                to="/thebook"
                className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-[#a50d26] transition-colors"
              >
                Learn the Principles
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['Long-Term Thinking', 'Meritocracy', 'Pragmatism', 'Rule of Law', 'Social Cohesion', 'Systems Design', 'Anti-Corruption', 'Education First', 'Strategic FDI'].map((principle) => (
                <div key={principle} className="border border-[#333333] p-4 text-center hover:border-[#C8102E] transition-colors">
                  <p className="text-white text-xs font-medium leading-tight">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Submit Idea */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-[#111111] mb-2">Have an idea to share?</h2>
            <p className="text-[#666666] text-lg">We're building a growing library of adaptation ideas from around the world.</p>
          </div>
          <a
            href="mailto:info@thesingaporeway.com"
            className="bg-[#C8102E] text-white font-bold px-8 py-4 text-sm tracking-wide hover:bg-[#a50d26] transition-colors flex-shrink-0"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}
