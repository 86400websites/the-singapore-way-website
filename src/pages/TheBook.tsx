import { Link } from 'react-router-dom'

const chapters = [
  'The Singapore Story',
  'Building Systems That Last',
  'Meritocracy in Practice',
  'Housing as Policy',
  'Water Security & Resource Management',
  'Education for the Long Game',
  'Governance & Anti-Corruption',
  'Economic Diversification',
  'Urban Planning & Smart Cities',
  'Healthcare Systems',
  'National Identity & Social Cohesion',
  'Long-Term Thinking in Policy',
  'Leadership & Institutional Integrity',
  'Adapting Singapore\'s Lessons',
  'Implementing Change in Your Context',
  'Case Studies from the Global Majority',
  'Your Transformation Roadmap',
]

export default function TheBook() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">The Book</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                More Than a Theory, a Practical Toolkit Empowering You to Create…
              </h1>
              <p className="text-[#AAAAAA] text-lg leading-relaxed mb-10">
                The Singapore Way is not theory—it's a practical toolkit for change. In 17 focused chapters, it shows how scalable systems are built in areas like housing, water, education, and governance—using clear principles and real case studies.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C8102E] text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-[#a50d26] transition-colors"
                >
                  Buy Now
                </a>
                <button className="border-2 border-white text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-[#111111] transition-colors">
                  Download Free Summary
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-[#C8102E] rounded-full opacity-20 absolute -top-4 -right-4 blur-3xl"></div>
                <img
                  src="/assets/book/book-cover.png"
                  alt="The Singapore Way Book by Maher Kaddoura"
                  className="relative w-full max-w-sm shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Inside the Book</p>
              <h2 className="text-4xl font-bold text-[#111111] mb-6">17 Chapters of Practical Transformation</h2>
              <p className="text-[#666666] text-lg leading-relaxed mb-10">
                Each chapter dives deep into a specific domain of Singapore's success—not to replicate it exactly, but to extract the principles you can adapt and apply to your own context.
              </p>
              <div className="space-y-3">
                {chapters.map((chapter, i) => (
                  <div key={i} className="flex items-start gap-4 py-2 border-b border-[#F0F0F0]">
                    <span className="text-[#C8102E] font-bold text-sm w-8 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[#333333] text-sm">{chapter}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Why This Book</p>
              <h2 className="text-4xl font-bold text-[#111111] mb-8">Built for Change-Makers</h2>
              <div className="space-y-8">
                {[
                  {
                    title: 'Practical, Not Theoretical',
                    desc: 'Every chapter ends with actionable frameworks you can apply in your own context—no academic fluff.',
                  },
                  {
                    title: 'Principle-Based Adaptation',
                    desc: "Don't copy Singapore. Understand why it worked and translate those principles to your unique environment.",
                  },
                  {
                    title: 'Real Case Studies',
                    desc: 'See how other countries and cities have already begun adapting Singapore\'s lessons successfully.',
                  },
                  {
                    title: 'Systems Thinking',
                    desc: 'Learn to see the whole picture—how policies interconnect and reinforce each other over time.',
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-5">
                    <div className="w-6 h-6 bg-[#C8102E] flex-shrink-0 mt-0.5 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[#111111] font-bold text-base mb-1">{title}</h3>
                      <p className="text-[#666666] text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 p-8 bg-[#F5F5F5] border-l-4 border-[#C8102E]">
                <blockquote className="text-[#333333] text-lg italic leading-relaxed">
                  "Don't borrow the fruit. Borrow the root. Then plant it where you stand."
                </blockquote>
                <cite className="text-[#C8102E] text-sm font-semibold mt-3 block">— Maher Kaddoura</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C8102E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Get your copy today</h2>
            <p className="text-white/80">Available in paperback and digital formats.</p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.amazon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#C8102E] font-bold px-8 py-4 text-sm tracking-wide hover:bg-[#F5F5F5] transition-colors"
            >
              Buy on Amazon
            </a>
            <Link
              to="/learn"
              className="border-2 border-white text-white font-bold px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-[#C8102E] transition-colors"
            >
              Explore the Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
