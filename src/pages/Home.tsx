import { Link } from 'react-router-dom'

const pillars = [
  {
    title: 'LEARN',
    description: 'Deep dive into Singapore\'s principles through our course, podcast, and blog.',
    image: '/assets/home/learn-card.png',
    href: '/learn',
    bg: 'bg-[#111111]',
  },
  {
    title: 'APPLY',
    description: 'Translate Singapore\'s principles into practical tools for your context.',
    image: '/assets/home/apply-card.png',
    href: '/apply',
    bg: 'bg-[#C8102E]',
  },
  {
    title: 'TEACH',
    description: 'Bring these principles into classrooms and leadership programs.',
    image: '/assets/home/teach-card.png',
    href: '/teach',
    bg: 'bg-[#111111]',
  },
  {
    title: 'IDEATE',
    description: 'Explore real-world use cases and spark your own innovations.',
    image: '/assets/home/ideate-card.png',
    href: '/ideate',
    bg: 'bg-[#C8102E]',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#2a0a0f] opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[#C8102E] text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 mb-6">
              Live
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              The Singapore Way
            </h1>
            <p className="text-xl md:text-2xl font-light text-[#CCCCCC] mb-4 leading-relaxed">
              More Than a Book, a Bridge from Singapore to the Global Majority
            </p>
            <p className="text-[#AAAAAA] text-lg mb-8 max-w-lg leading-relaxed">
              Singapore's success wasn't a miracle—it was a method. The Singapore Way turns that method into something practical and adaptable for leaders, educators, and change-makers across the Global Majority. It's not about copying Singapore, but learning how to think, plan, and execute with clarity—then applying it to your own context.
            </p>
            <blockquote className="border-l-4 border-[#C8102E] pl-5 mb-10">
              <p className="text-[#CCCCCC] text-lg italic">"Don't borrow the fruit. Borrow the root."</p>
              <cite className="text-[#C8102E] text-sm font-semibold mt-2 block">— Maher Kaddoura</cite>
            </blockquote>
            <div className="flex flex-wrap gap-4">
              <Link to="/thebook" className="bg-[#C8102E] text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-[#a50d26] transition-colors">
                Buy the Book
              </Link>
              <Link to="/learn" className="border-2 border-white text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-[#111111] transition-colors">
                Start Exploring
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-[#C8102E] rounded-full opacity-10 absolute -top-8 -right-8 blur-3xl"></div>
              <img
                src="/assets/home/framework.png"
                alt="A Practical Framework for National and Local Transformation"
                className="relative w-full max-w-md rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Framework Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">The Framework</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111111] mb-6 leading-tight">
                A Practical Framework for National and Local Transformation
              </h2>
              <p className="text-[#666666] text-lg mb-4 leading-relaxed">
                Too many countries are asked to admire success stories…<br />
                But they're rarely given the tools to build their own.
              </p>
              <p className="text-[#666666] text-lg mb-4 leading-relaxed">
                Singapore's rise wasn't luck. It was systems thinking, designed for decades, not cycles.
              </p>
              <p className="text-[#666666] text-lg mb-10 leading-relaxed">
                This book and platform share a framework and principles—not to copy them, but to understand them, teach them, and adapt them to build new, local futures.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/thebook" className="bg-[#C8102E] text-white font-semibold px-7 py-3.5 text-sm tracking-wide hover:bg-[#a50d26] transition-colors">
                  Download Free Summary
                </Link>
                <Link to="/about" className="border-2 border-[#111111] text-[#111111] font-semibold px-7 py-3.5 text-sm tracking-wide hover:bg-[#111111] hover:text-white transition-colors">
                  Watch Video
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/home/framework.png"
                alt="The Singapore Way Framework"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-20 md:py-28 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/assets/home/who-is-it-for.png"
                alt="Who is The Singapore Way for?"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Audience</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111111] mb-8 leading-tight">
                Who is it for?
              </h2>
              <div className="space-y-6">
                {[
                  { icon: '🎓', role: 'Educators', desc: 'who want to teach systems, not just policies.' },
                  { icon: '🏛️', role: 'Government Leaders', desc: 'who want to pilot reforms with clarity.' },
                  { icon: '💡', role: 'Social Innovators', desc: 'who want to design smart from the start.' },
                ].map(({ role, desc }) => (
                  <div key={role} className="flex gap-5 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2.5 flex-shrink-0"></div>
                    <p className="text-[#333333] text-lg">
                      <span className="font-bold">{role}</span>, {desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link
                  to="/q-a"
                  className="inline-flex items-center gap-2 text-[#C8102E] font-semibold text-sm tracking-wide hover:gap-4 transition-all"
                >
                  Questions & Answers
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">The Platform</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#111111]">Four Ways to Engage</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {pillars.map((pillar) => (
              <Link
                key={pillar.title}
                to={pillar.href}
                className={`${pillar.bg} group relative overflow-hidden flex flex-col min-h-80 p-8 hover:opacity-95 transition-all`}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-25 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-2xl font-bold text-white tracking-wide mb-auto">{pillar.title}</h3>
                  <div className="mt-auto">
                    <p className="text-white/80 text-sm mb-5 leading-relaxed">{pillar.description}</p>
                    <span className="inline-flex items-center gap-2 text-white text-xs font-bold tracking-widest uppercase border-b border-white pb-0.5 group-hover:gap-4 transition-all">
                      Explore
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-[#C8102E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Ready to build your own future?
            </h2>
            <p className="text-white/80 text-lg">
              Get the book. Learn the method. Apply it to your world.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <Link
              to="/thebook"
              className="bg-white text-[#C8102E] font-bold px-8 py-4 text-sm tracking-wide hover:bg-[#F5F5F5] transition-colors"
            >
              Buy the Book
            </Link>
            <Link
              to="/learn"
              className="border-2 border-white text-white font-bold px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-[#C8102E] transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
