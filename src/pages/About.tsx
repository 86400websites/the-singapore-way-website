import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="bg-white">

      {/* About the Author */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            <div className="flex justify-center">
              <div className="overflow-hidden rounded-2xl shadow-lg w-full max-w-sm">
                <img
                  src="/assets/about/author.png"
                  alt="Maher Kaddoura"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-5">About the Author</h2>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-8">
                Maher Kaddoura is a strategist, author, and former Accenture consultant driven by one core mission: turning bold ideas into real impact. He leads The Singapore Way, combining deep research with hands-on leadership experience to reveal how nations can rise from adversity to prosperity. Through his work, He empowers change-makers from around the world to adapt Singapore's principles for innovation, leadership, and sustainable success. He serves on the Advisory Board of the National University of Singapore
              </p>
              <div>
                <a
                  href="https://maherkaddoura.com/english"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Get to know Maher
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-5">Our Story: From Question to Framework</h2>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
                It started with one question: can transformation be replicated without imitation?
              </p>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
                Our answer was a mindset—not just a platform. We distilled Singapore's journey into 15 adaptable principles, supported by real-world tools.
              </p>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-8">
                The goal isn't to glorify a country, but to empower changemakers—in cities, classrooms, and communities—to tailor proven strategies to their own local challenges.
              </p>
              <div>
                <a
                  href="mailto:info@thesingaporeway.com"
                  className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="overflow-hidden rounded-2xl shadow-lg w-full max-w-sm">
                <img
                  src="/assets/about/our-story.png"
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Red Quote */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#C8102E] text-lg md:text-xl italic font-semibold leading-relaxed">
            "We're not here to copy Singapore. We're here to build with what we have, boldly, and together." – <span className="not-italic font-bold">Maher Kaddoura</span>
          </p>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">What We Stand For</h2>
            <p className="text-[15px] text-gray-500 max-w-xl">
              We believe every nation, no matter how constrained, can build resilient, effective systems—with the right mindset and tools.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
              <img src="/assets/about/mission-icon.png" alt="Mission" className="h-12 w-auto mb-5 opacity-75" />
              <h3 className="text-[15px] font-extrabold text-gray-900 tracking-tight mb-3">Our Mission: Building Systems that Last</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Equip governments, educators, and changemakers across the Global Majority with proven frameworks for equity, dignity, and long-term progress.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow duration-200">
              <img src="/assets/about/vision-icon.png" alt="Vision" className="h-12 w-auto mb-5 opacity-75" />
              <h3 className="text-[15px] font-extrabold text-gray-900 tracking-tight mb-3">Our Vision: A rise of global majority</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Our vision is to see global majority countries design sovereign, cohesive, sustainable systems—inspired by Singapore, adapted to their own reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Quote */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#C8102E] text-lg md:text-xl italic font-semibold leading-relaxed">
            "Don't borrow the fruit. Borrow the root. Then plant it where you stand." – <span className="not-italic font-bold">Maher Kaddoura</span>
          </p>
        </div>
      </section>

    </div>
  )
}
