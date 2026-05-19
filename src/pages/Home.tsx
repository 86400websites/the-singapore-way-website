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
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-4">
                The Singapore Way
              </h1>
              <p className="text-base md:text-lg font-semibold text-gray-600 mb-5 leading-snug">
                More Than a Book, a Bridge from Singapore to the Global Majority
              </p>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-9 max-w-lg">
                Singapore's success wasn't a miracle—it was a method. The Singapore Way turns that method into something practical and adaptable for leaders, educators, and change-makers across the Global Majority. It's not about copying Singapore, but learning how to think, plan, and execute with clarity—then applying it to your own context.
              </p>
              <Link
                to="/learn"
                className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-8 py-3.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Start Exploring
              </Link>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="/assets/home/hero-illustration.png"
                alt="Person reading The Singapore Way book with Singapore skyline"
                className="w-full max-w-[520px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-12 bg-[#fef9f6]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#C8102E] text-lg md:text-xl italic font-semibold leading-relaxed">
            "Don't borrow the fruit. Borrow the root." – <strong className="not-italic font-bold">Maher Kaddoura</strong>
          </p>
        </div>
      </section>

      {/* Framework Section */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="flex justify-center">
              <img
                src="/assets/home/framework.png"
                alt="A Practical Framework for National and Local Transformation"
                className="w-full max-w-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                <span className="inline bg-[#C8102E] text-white px-1.5 py-0.5 leading-[1.5] box-decoration-clone">A Practical Framework for</span>
                <br />
                <span className="inline bg-[#C8102E] text-white px-1.5 py-0.5 leading-[1.5] box-decoration-clone">National and Local Transformation</span>
              </h2>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-3">
                Too many countries are asked to admire success stories…<br />
                But they're rarely given the tools to build their own.
              </p>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-3">
                Singapore's rise wasn't luck. It was systems thinking, designed for decades, not cycles.
              </p>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-9">
                This book and platform share a framework and principles—not to copy them, but to understand them, teach them, and adapt them to build new, local futures.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md">
                  Watch Video
                </button>
                <button className="bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md">
                  Download Free Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-7">
                <span className="inline bg-[#C8102E] text-white px-2 py-1 box-decoration-clone">who is it for?</span>
              </h2>
              <ul className="space-y-4 mb-9">
                <li className="flex items-start gap-3 text-[15px] text-gray-700">
                  <span className="text-[#C8102E] font-bold mt-0.5 flex-shrink-0">—</span>
                  <span>Educators, who want to teach systems, not just policies.</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-gray-700">
                  <span className="text-[#C8102E] font-bold mt-0.5 flex-shrink-0">—</span>
                  <span>Government leaders, who want to pilot reforms with clarity.</span>
                </li>
                <li className="flex items-start gap-3 text-[15px] text-gray-700">
                  <span className="text-[#C8102E] font-bold mt-0.5 flex-shrink-0">—</span>
                  <span>Social innovators, who want to design smart from the start.</span>
                </li>
              </ul>
              <Link
                to="/q-a"
                className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Questions & answers
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src="/assets/home/who-is-it-for.png"
                alt="Who is The Singapore Way for"
                className="w-full max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="h-52 overflow-hidden bg-[#faf8f4]">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-contain p-5"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-lg font-extrabold text-gray-900 tracking-tight mb-2.5">{pillar.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed mb-6">{pillar.description}</p>
                  <Link
                    to={pillar.href}
                    className="inline-flex items-center gap-2 bg-[#C8102E] text-white text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md"
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
