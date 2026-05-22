import { Link } from 'react-router-dom'

const pillars = [
  {
    title: 'Learn',
    description: 'Discover practical lessons through clear tools, short videos, and insightful readings.',
    image: '/assets/home/learn-card.png',
    href: '/learn',
  },
  {
    title: 'Apply',
    description: 'Use practical worksheets, ready-to-use templates, and sector-specific guidance to apply The Singapore Way where it matters most.',
    image: '/assets/home/apply-card.png',
    href: '/apply',
  },
  {
    title: 'Teach',
    description: 'Access ready-to-use teaching materials, real-world case studies—fact sheets for universities, think tanks, and professional training programs.',
    image: '/assets/home/teach-card.png',
    href: '/teach',
  },
  {
    title: 'Ideate',
    description: 'Brainstorm practical solutions to real challenges in your own environment—guided and inspired by The Singapore Way.',
    image: '/assets/home/ideate-card.png',
    href: '/ideate',
  },
]

export default function Home() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-[#fbf5f2] pt-16 pb-14 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-5">
                The Singapore Way
              </h1>
              <p className="text-base sm:text-lg font-semibold text-gray-600 mb-5 leading-snug">
                More Than a Book, a Bridge from Singapore to the Global Majority
              </p>
              <p className="text-[15px] sm:text-base text-gray-500 leading-relaxed mb-9 max-w-xl mx-auto lg:mx-0">
                Singapore's success wasn't a miracle—it was a method. The Singapore Way turns that method into something practical and adaptable for leaders, educators, and change-makers across the Global Majority. It's not about copying Singapore, but learning how to think, plan, and execute with clarity—then applying it to your own context.
              </p>
              <Link
                to="/learn"
                className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-8 py-3.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
              >
                Start Exploring
              </Link>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative mx-auto w-full max-w-[480px] sm:max-w-[580px] lg:max-w-[640px] aspect-square">
                <img
                  src="/assets/home/home-hero-singapore-way.png"
                  alt="Person reading The Singapore Way book with Singapore skyline"
                  className="absolute inset-0 w-full h-full object-contain"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-12 sm:py-14 bg-[#fef9f6] border-y border-[#f3e7dd]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#C8102E] text-lg md:text-xl italic font-semibold leading-relaxed">
            <span aria-hidden="true" className="not-italic font-bold mr-1">“</span>
            Don't borrow the fruit. Borrow the root.
            <span aria-hidden="true" className="not-italic font-bold ml-1">”</span>
            <span className="block sm:inline mt-2 sm:mt-0 sm:ml-2 not-italic font-bold text-gray-800">
              — Maher Kaddoura
            </span>
          </p>
        </div>
      </section>

      {/* Framework Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <img
                  src="/assets/home/framework.png"
                  alt="A Practical Framework for National and Local Transformation"
                  className="absolute inset-0 w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                <span className="inline bg-[#C8102E] text-white px-1.5 py-0.5 leading-[1.6] box-decoration-clone">A Practical Framework for</span>
                <br />
                <span className="inline bg-[#C8102E] text-white px-1.5 py-0.5 leading-[1.6] box-decoration-clone">National and Local Transformation</span>
              </h2>
              <p className="text-[15px] sm:text-base text-gray-600 leading-relaxed mb-4">
                Too many countries are asked to admire success stories…<br />
                But they're rarely given the tools to build their own.
              </p>
              <p className="text-[15px] sm:text-base text-gray-600 leading-relaxed mb-4">
                Singapore's rise wasn't luck. It was systems thinking, designed for decades, not cycles.
              </p>
              <p className="text-[15px] sm:text-base text-gray-600 leading-relaxed mb-8">
                This book and platform share a framework and principles—not to copy them, but to understand them, teach them, and adapt them to build new, local futures.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://video.wixstatic.com/video/d1daaa_61e6acec091e46d7a2748275fa8f72d5/1080p/mp4/file.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
                >
                  Watch Video
                </a>
                <button className="bg-white text-[#C8102E] border-2 border-[#C8102E] text-[13px] font-bold px-7 py-[10px] rounded-full hover:bg-[#C8102E] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2">
                  Download Free Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-extrabold tracking-tight mb-7">
                <span className="inline bg-[#C8102E] text-white px-2 py-1 leading-[1.6] box-decoration-clone">who is it for?</span>
              </h2>
              <ul className="space-y-4 mb-9">
                <li className="flex items-start gap-3 text-[15px] sm:text-base text-gray-700">
                  <span className="text-[#C8102E] font-bold mt-0.5 flex-shrink-0">—</span>
                  <span>Educators, who want to teach systems, not just policies.</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] sm:text-base text-gray-700">
                  <span className="text-[#C8102E] font-bold mt-0.5 flex-shrink-0">—</span>
                  <span>Government leaders, who want to pilot reforms with clarity.</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] sm:text-base text-gray-700">
                  <span className="text-[#C8102E] font-bold mt-0.5 flex-shrink-0">—</span>
                  <span>Social innovators, who want to design smart from the start.</span>
                </li>
              </ul>
              <Link
                to="/q-a"
                className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
              >
                Questions &amp; answers
              </Link>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <img
                  src="/assets/home/who-is-it-for.png"
                  alt="Who is The Singapore Way for"
                  className="absolute inset-0 w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#C8102E] uppercase mb-3">
              Four ways to engage
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-extrabold text-gray-900 tracking-tight leading-tight">
              Choose your path into The Singapore Way
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="relative aspect-[4/3] bg-[#faf8f4] overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col flex-1 p-6 sm:p-7">
                  <h3 className="text-lg font-extrabold text-gray-900 tracking-tight mb-2.5">{pillar.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed mb-6 flex-1">{pillar.description}</p>
                  <Link
                    to={pillar.href}
                    className="inline-flex items-center gap-2 self-start bg-[#C8102E] text-white text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
                  >
                    Explore
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
