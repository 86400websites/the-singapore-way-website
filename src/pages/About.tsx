import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="bg-white">
      {/* About the Author */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="flex justify-center">
              <img
                src="/assets/about/author.png"
                alt="Maher Kaddoura"
                className="w-full max-w-sm rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Author</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Maher Kaddoura is a strategist, author, and former Accenture consultant driven by one core mission: turning bold ideas into real impact. He leads The Singapore Way, combining deep research with hands-on leadership experience to reveal how nations can rise from adversity to prosperity. Through his work, He empowers change-makers from around the world to adapt Singapore's principles for innovation, leadership, and sustainable success. He serves on the Advisory Board of the National University of Singapore
              </p>
              <a
                href="https://maherkaddoura.com/english"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#C8102E] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-colors"
              >
                Get to know Maher
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story: From Question to Framework</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                It started with one question: can transformation be replicated without imitation?
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Our answer was a mindset—not just a platform. We distilled Singapore's journey into 15 adaptable principles, supported by real-world tools.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                The goal isn't to glorify a country, but to empower changemakers—in cities, classrooms, and communities—to tailor proven strategies to their own local challenges.
              </p>
              <a
                href="mailto:info@thesingaporeway.com"
                className="inline-block bg-[#C8102E] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-colors"
              >
                Contact Us
              </a>
            </div>
            <div className="flex justify-center">
              <img
                src="/assets/about/our-story.png"
                alt="Our Story"
                className="w-full max-w-sm rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Red Quote */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#C8102E] text-base md:text-lg italic font-bold leading-relaxed">
            "We're not here to copy Singapore. We're here to build with what we have, boldly, and together." – <span className="not-italic">Maher Kaddoura</span>
          </p>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What We Stand For</h2>
          <p className="text-sm text-gray-500 mb-10">
            We believe every nation, no matter how constrained, can build resilient, effective systems—with the right mindset and tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-8">
              <img src="/assets/about/mission-icon.png" alt="Mission" className="h-10 w-auto mb-5 opacity-80" />
              <h3 className="text-base font-bold text-gray-900 mb-3">Our Mission: Building Systems that Last</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Equip governments, educators, and changemakers across the Global Majority with proven frameworks for equity, dignity, and long-term progress.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-8">
              <img src="/assets/about/vision-icon.png" alt="Vision" className="h-10 w-auto mb-5 opacity-80" />
              <h3 className="text-base font-bold text-gray-900 mb-3">Our Vision: A rise of global majority</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our vision is to see global majority countries design sovereign, cohesive, sustainable systems—inspired by Singapore, adapted to their own reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Quote */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#C8102E] text-base md:text-lg italic font-bold leading-relaxed">
            "Don't borrow the fruit. Borrow the root. Then plant it where you stand." – <span className="not-italic">Maher Kaddoura</span>
          </p>
        </div>
      </section>
    </div>
  )
}
