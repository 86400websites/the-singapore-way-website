import { Link } from 'react-router-dom'

const teachingTools = [
  {
    title: 'Case Studies',
    description: '17 detailed Singapore Way case studies showcasing practical lessons in housing, education, governance, water security, and national development.',
    href: '/teaching-materials',
    image: '/assets/teach/case-studies.png',
  },
]

export default function Teach() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Teach</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Teach The Singapore Way Principles
          </h1>
          <p className="text-[#AAAAAA] text-xl max-w-2xl leading-relaxed">
            Help students master the Singapore Way through real-world examples in strategy, governance, policy, and transformation.
          </p>
        </div>
      </section>

      {/* Teaching Resources */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Resources for Educators</p>
              <h2 className="text-4xl font-bold text-[#111111] mb-6">Case Studies & Classroom Resources</h2>
              <p className="text-[#666666] text-lg leading-relaxed mb-8">
                Whether you're teaching at a university, running a leadership program, or training government officials, The Singapore Way provides structured resources to make complex policy ideas accessible and applicable.
              </p>
              <div className="space-y-6 mb-10">
                {[
                  { title: 'Ready-to-Use Case Studies', desc: '17 detailed case studies across key development domains.' },
                  { title: 'Discussion Frameworks', desc: 'Structured questions that help learners critically analyze and adapt Singapore\'s lessons.' },
                  { title: 'Adaptation Exercises', desc: 'Practical exercises for applying principles to local contexts.' },
                  { title: 'Presentation Materials', desc: 'Supporting slides and visual aids for classroom delivery.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-6 h-6 bg-[#C8102E] flex-shrink-0 mt-0.5 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[#111111] font-bold text-sm mb-1">{title}</h3>
                      <p className="text-[#666666] text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/teaching-materials"
                className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-[#a50d26] transition-colors"
              >
                Access Case Studies
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="overflow-hidden">
              <img
                src="/assets/teach/case-studies.png"
                alt="Case Studies"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Teach */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">For Educators</p>
            <h2 className="text-4xl font-bold text-[#111111]">Who Should Teach This?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'University Professors',
                desc: 'In public policy, governance, development economics, and urban studies.',
              },
              {
                title: 'Leadership Trainers',
                desc: 'Running programs for government officials, corporate leaders, and social entrepreneurs.',
              },
              {
                title: 'Policy Institutes',
                desc: 'Think tanks and research institutions seeking structured, comparative case material.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-8 border border-[#E5E5E5]">
                <div className="w-10 h-1 bg-[#C8102E] mb-6"></div>
                <h3 className="text-xl font-bold text-[#111111] mb-3">{title}</h3>
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
            <h2 className="text-3xl font-bold text-white mb-2">Ready to teach transformation?</h2>
            <p className="text-white/80">Access our full library of case studies and teaching materials.</p>
          </div>
          <Link to="/teaching-materials" className="bg-white text-[#C8102E] font-bold px-8 py-4 text-sm tracking-wide hover:bg-[#F5F5F5] transition-colors flex-shrink-0">
            Access Teaching Materials
          </Link>
        </div>
      </section>
    </div>
  )
}
