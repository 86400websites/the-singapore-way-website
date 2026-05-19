import { Link } from 'react-router-dom'

const caseStudies = [
  { num: '01', domain: 'Housing', title: 'The HDB Story: Housing as Nation Building', pages: '18 pages' },
  { num: '02', domain: 'Water', title: 'Four Taps: Singapore\'s Water Security Strategy', pages: '14 pages' },
  { num: '03', domain: 'Education', title: 'Education for a Knowledge Economy', pages: '20 pages' },
  { num: '04', domain: 'Governance', title: 'Anti-Corruption: Building a Culture of Integrity', pages: '16 pages' },
  { num: '05', domain: 'Economics', title: 'From Third World to First: The Economic Journey', pages: '22 pages' },
  { num: '06', domain: 'Urban', title: 'Planning the Unplannable: Urban Development at Scale', pages: '18 pages' },
  { num: '07', domain: 'Meritocracy', title: 'Meritocracy in Practice: Opportunity and Accountability', pages: '15 pages' },
  { num: '08', domain: 'Identity', title: 'Social Cohesion in a Multi-Ethnic Society', pages: '17 pages' },
  { num: '09', domain: 'Healthcare', title: 'The 3M Healthcare Framework', pages: '14 pages' },
  { num: '10', domain: 'Defence', title: 'Total Defence: A Small Nation\'s Security Strategy', pages: '12 pages' },
  { num: '11', domain: 'Innovation', title: 'Building an Innovation Ecosystem', pages: '16 pages' },
  { num: '12', domain: 'Governance', title: 'Long-Term Planning: The Singapore Concept Plan', pages: '13 pages' },
  { num: '13', domain: 'Leadership', title: 'Leadership & Institutional Integrity', pages: '15 pages' },
  { num: '14', domain: 'FDI', title: 'Strategic Foreign Direct Investment', pages: '17 pages' },
  { num: '15', domain: 'Adaptation', title: 'Rwanda: Adapting the Singapore Model', pages: '20 pages' },
  { num: '16', domain: 'Adaptation', title: 'Kazakhstan: Education Reform Inspired by Singapore', pages: '18 pages' },
  { num: '17', domain: 'Roadmap', title: 'Building Your Transformation Roadmap', pages: '24 pages' },
]

export default function TeachingMaterials() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Teaching Materials</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Case Studies | The Singapore Way
              </h1>
              <p className="text-[#AAAAAA] text-xl leading-relaxed mb-8">
                Explore 17 detailed Singapore Way Case Studies showcasing practical lessons in housing, education, governance, water security, and national development.
              </p>
              <a
                href="mailto:info@thesingaporeway.com"
                className="inline-block bg-[#C8102E] text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-[#a50d26] transition-colors"
              >
                Request Full Access
              </a>
            </div>
            <div className="relative flex justify-center">
              <img
                src="/assets/teach/case-studies.png"
                alt="Case Studies"
                className="w-full max-w-md shadow-2xl rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">The Library</p>
            <h2 className="text-4xl font-bold text-[#111111]">17 Case Studies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseStudies.map(({ num, domain, title, pages }) => (
              <div key={num} className="flex items-start gap-5 p-6 border border-[#E5E5E5] hover:border-[#C8102E] hover:shadow-md transition-all group cursor-pointer">
                <span className="text-[#C8102E] font-bold text-lg w-10 flex-shrink-0">{num}</span>
                <div className="flex-1">
                  <span className="inline-block text-xs font-bold text-[#C8102E] tracking-widest uppercase mb-2">{domain}</span>
                  <h3 className="text-[#111111] font-bold text-base mb-1 group-hover:text-[#C8102E] transition-colors">{title}</h3>
                  <p className="text-[#999999] text-xs">{pages}</p>
                </div>
                <div className="flex-shrink-0 text-[#CCCCCC] group-hover:text-[#C8102E] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Pedagogy</p>
            <h2 className="text-4xl font-bold text-[#111111]">How to Use These Case Studies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Read', desc: 'Study the case study to understand Singapore\'s approach and the context in which it worked.' },
              { step: '02', title: 'Analyse', desc: 'Use the discussion questions to critically examine what principles drove the outcome.' },
              { step: '03', title: 'Compare', desc: 'Map the principles against your own context — where do they apply, and where must they be adapted?' },
              { step: '04', title: 'Apply', desc: 'Design a locally-adapted approach using the principles, not the policies, as your foundation.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-[#C8102E] text-white font-bold text-xl flex items-center justify-center mx-auto mb-5">
                  {step}
                </div>
                <h3 className="text-[#111111] font-bold text-lg mb-3">{title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C8102E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Use these in your classroom or program</h2>
            <p className="text-white/80">Contact us for institutional access and licensing information.</p>
          </div>
          <a
            href="mailto:info@thesingaporeway.com"
            className="bg-white text-[#C8102E] font-bold px-8 py-4 text-sm tracking-wide hover:bg-[#F5F5F5] transition-colors flex-shrink-0"
          >
            Request Access
          </a>
        </div>
      </section>
    </div>
  )
}
