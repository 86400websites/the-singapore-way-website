import { Link } from 'react-router-dom'

const modules = [
  { num: '01', title: 'Introduction to The Singapore Way' },
  { num: '02', title: 'The Historical Context: From Third World to First' },
  { num: '03', title: 'Systems Thinking in Governance' },
  { num: '04', title: 'Meritocracy & Human Capital' },
  { num: '05', title: 'Long-Term Planning & the Future State' },
  { num: '06', title: 'Housing as Nation Building' },
  { num: '07', title: 'Water Security & Resource Management' },
  { num: '08', title: 'Education for Transformation' },
  { num: '09', title: 'Economic Strategy & FDI' },
  { num: '10', title: 'Anti-Corruption & Rule of Law' },
  { num: '11', title: 'Social Cohesion in Diverse Societies' },
  { num: '12', title: 'Localization: Adapting the Principles' },
]

export default function OnlineCourse() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-[#C8102E] text-white text-xs font-bold px-3 py-1.5 tracking-widest uppercase mb-6">
                Coming Soon
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                The Singapore Way Online Course
              </h1>
              <p className="text-[#AAAAAA] text-xl leading-relaxed mb-8">
                We're finalising the details to bring you the best experience. Join our comprehensive online course to understand and apply the principles behind Singapore's remarkable national transformation.
              </p>
              <div className="bg-[#1a1a1a] border border-[#333333] p-6 mb-8">
                <h3 className="text-white font-bold text-lg mb-3">Be the first to know when we launch</h3>
                <p className="text-[#AAAAAA] text-sm mb-5">Enter your email and we'll notify you the moment the course goes live.</p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-[#111111] border border-[#444444] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#C8102E] placeholder-[#666666]"
                  />
                  <button className="bg-[#C8102E] text-white font-semibold px-6 py-3 text-sm tracking-wide hover:bg-[#a50d26] transition-colors flex-shrink-0">
                    Notify Me
                  </button>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="w-64 h-64 bg-[#C8102E] rounded-full opacity-10 absolute blur-3xl"></div>
              <img
                src="/assets/learn/online-course.png"
                alt="The Singapore Way Online Course"
                className="relative w-full max-w-md shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Course Preview</p>
              <h2 className="text-4xl font-bold text-[#111111] mb-6">What You'll Learn</h2>
              <p className="text-[#666666] text-lg leading-relaxed mb-8">
                The Singapore Way Online Course takes you from understanding Singapore's founding principles to applying them in your own national or local context. It's designed for practitioners, not academics.
              </p>
              <div className="space-y-4">
                {[
                  'Understand Singapore\'s transformation from founding to today',
                  'Extract the 15 core principles that drove its success',
                  'Learn adaptation frameworks for your specific context',
                  'Apply systems thinking to complex policy challenges',
                  'Build institutional capacity and long-term planning skills',
                  'Design your own transformation roadmap',
                ].map((item) => (
                  <div key={item} className="flex gap-4 items-start">
                    <div className="w-5 h-5 bg-[#C8102E] flex-shrink-0 mt-0.5 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[#333333] text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Course Modules</p>
              <h2 className="text-4xl font-bold text-[#111111] mb-6">12 Deep-Dive Modules</h2>
              <div className="space-y-2">
                {modules.map(({ num, title }) => (
                  <div key={num} className="flex gap-5 items-center py-3 border-b border-[#F0F0F0]">
                    <span className="text-[#C8102E] font-bold text-sm w-8 flex-shrink-0">{num}</span>
                    <span className="text-[#333333] text-sm">{title}</span>
                    <span className="ml-auto text-[#CCCCCC]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meanwhile */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111111] mb-4">Meanwhile, Start Learning Now</h2>
            <p className="text-[#666666] text-lg">Explore these resources while you wait for the course to launch.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'The Book', desc: 'All 17 chapters in a comprehensive, practical guide.', href: '/thebook', cta: 'Get the Book' },
              { title: 'Podcast', desc: 'Deep conversations with leaders and change-makers.', href: '/podcasts', cta: 'Listen Now' },
              { title: 'Blog', desc: 'Articles on applying Singapore\'s principles around the world.', href: '/blog', cta: 'Read Articles' },
            ].map(({ title, desc, href, cta }) => (
              <div key={title} className="bg-white border border-[#E5E5E5] p-8 text-center hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold text-[#111111] mb-3">{title}</h3>
                <p className="text-[#666666] text-sm mb-6">{desc}</p>
                <Link to={href} className="inline-block bg-[#111111] text-white font-semibold px-6 py-3 text-xs tracking-wide hover:bg-[#333333] transition-colors">
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
