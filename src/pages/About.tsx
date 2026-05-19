import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">About</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Maher Kaddoura | Author, Strategist & Founder
          </h1>
          <p className="text-[#AAAAAA] text-xl max-w-2xl leading-relaxed">
            A visionary strategist dedicated to empowering nations through innovation, leadership, and transformation.
          </p>
        </div>
      </section>

      {/* About the Author */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="overflow-hidden">
              <img
                src="/assets/about/author.png"
                alt="Portrait of Maher Kaddoura, Founder of The Singapore Way"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">The Author</p>
              <h2 className="text-4xl font-bold text-[#111111] mb-6">About the Author</h2>
              <p className="text-[#555555] text-lg leading-relaxed mb-6">
                Maher Kaddoura is a strategist, author, and former Accenture consultant driven by one core mission: turning bold ideas into real impact. He leads The Singapore Way, combining deep research with hands-on leadership experience to reveal how nations can rise from adversity to prosperity.
              </p>
              <p className="text-[#555555] text-lg leading-relaxed mb-8">
                Through his work, he empowers change-makers from around the world to adapt Singapore's principles for innovation, leadership, and sustainable success. He serves on the Advisory Board of the National University of Singapore.
              </p>
              <a
                href="https://maherkaddoura.com/english"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-semibold px-7 py-3.5 text-sm tracking-wide hover:bg-[#a50d26] transition-colors"
              >
                Get to Know Maher
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Our Origin</p>
              <h2 className="text-4xl font-bold text-[#111111] mb-6">Our Story: From Question to Framework</h2>
              <p className="text-[#555555] text-lg leading-relaxed mb-6">
                It started with one question: can transformation be replicated without imitation?
              </p>
              <p className="text-[#555555] text-lg leading-relaxed mb-6">
                Our answer was a mindset—not just a platform. We distilled Singapore's journey into 15 adaptable principles, supported by real-world tools.
              </p>
              <p className="text-[#555555] text-lg leading-relaxed mb-8">
                The goal isn't to glorify a country, but to empower changemakers—in cities, classrooms, and communities—to tailor proven strategies to their own local challenges.
              </p>
              <div className="space-y-6">
                <blockquote className="border-l-4 border-[#C8102E] pl-5">
                  <p className="text-[#333333] text-lg italic">"We're not here to copy Singapore. We're here to build with what we have, boldly, and together."</p>
                  <cite className="text-[#C8102E] text-sm font-semibold mt-2 block">— Maher Kaddoura</cite>
                </blockquote>
                <blockquote className="border-l-4 border-[#C8102E] pl-5">
                  <p className="text-[#333333] text-lg italic">"Don't borrow the fruit. Borrow the root. Then plant it where you stand."</p>
                  <cite className="text-[#C8102E] text-sm font-semibold mt-2 block">— Maher Kaddoura</cite>
                </blockquote>
              </div>
              <div className="mt-10">
                <a
                  href="mailto:info@thesingaporeway.com"
                  className="inline-flex items-center gap-2 border-2 border-[#111111] text-[#111111] font-semibold px-7 py-3.5 text-sm tracking-wide hover:bg-[#111111] hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="overflow-hidden">
              <img
                src="/assets/about/our-story.png"
                alt="About The Singapore Way"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">What We Stand For</p>
            <h2 className="text-4xl font-bold">Our Mission & Vision</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#1a1a1a] border border-[#333333] p-10">
              <img src="/assets/about/mission-icon.png" alt="Mission" className="h-12 w-auto mb-6 opacity-80" />
              <h3 className="text-2xl font-bold text-white mb-4">Mission</h3>
              <p className="text-[#AAAAAA] leading-relaxed">
                To empower leaders, educators, and innovators across the Global Majority with a practical, principle-based framework for national and local transformation — rooted in Singapore's proven success story.
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#333333] p-10">
              <img src="/assets/about/vision-icon.png" alt="Vision" className="h-12 w-auto mb-6 opacity-80" />
              <h3 className="text-2xl font-bold text-white mb-4">Vision</h3>
              <p className="text-[#AAAAAA] leading-relaxed">
                A world where every nation has access to the tools, knowledge, and frameworks needed to build resilient, equitable, and prosperous societies — adapted to their own context, culture, and constraints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C8102E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Connect with us</h2>
            <p className="text-white/80">Have questions or want to collaborate? We'd love to hear from you.</p>
          </div>
          <a
            href="mailto:info@thesingaporeway.com"
            className="bg-white text-[#C8102E] font-bold px-8 py-4 text-sm tracking-wide hover:bg-[#F5F5F5] transition-colors flex-shrink-0"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  )
}
