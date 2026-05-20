import { useState } from 'react'
import { Link } from 'react-router-dom'

const useCases = [
  { icon: '🌱', title: 'Climate by Design', desc: "Embeds mandatory climate-positive urban-design studies at the University of Ghana so graduates can future-proof Accra." },
  { icon: '🔵', title: 'Digital Twins for All', desc: "CityTwin SaaS gives cash-strapped cities mobile digital-twin tools to test infrastructure scenarios before they build." },
  { icon: '💰', title: 'From Informal to Investable', desc: "Investable Bamako turns informal micro-enterprises into bankable industrial clusters through micro-parks and e-ID finance access." },
  { icon: '👥', title: 'My City, My Chapter', desc: "Neighborhood Chapters in Lalitpur let citizens co-design plans, budgets, and policies for their own streets." },
  { icon: '🏛️', title: 'Redesigning the State', desc: "Statecraft Studio Addis swaps rote policy study for live simulations that let students prototype real governance reforms." },
  { icon: '🌳', title: 'Roots in the Sky', desc: "Skycool Nairobi converts unsafe rooftop shanties into modular green micro-villages with housing, farms, and services." },
  { icon: '🗺️', title: 'Smart Streets, Safe Cities', desc: "Port Louis Smart Street Grid links sensors, smart lights, and live dashboards to cut crime and smooth traffic." },
  { icon: '🌐', title: 'Sovereignty as Strategy', tag: 'Available via app', desc: "Belmora 2040 equips Saint Calade to steer long-term development with a sovereign foresight framework and diaspora bonds." },
  { icon: '⚡', title: 'City as a Service', desc: "GridBlocks in Gulu delivers prepaid, high-uptake power via modular micro-grids that treat energy as a civic service." },
  { icon: '📚', title: 'From Learning to Earning', desc: "W-Connect in Asmara gives women micro-training credits and an app to translate new skills directly into higher income." },
  { icon: '🔬', title: 'Scenario Labs for Clients', desc: "Cobalt Strategies' Scenario Labs lets companies co-create modular simulations that bake long-term foresight into strategy." },
  { icon: '❤️', title: 'Unity by Platform', desc: "UbuntuConnect gamifies civic missions, tracks a Unity Index, and rewards diverse users to build social cohesion across Johannesburg." },
]

export default function Possibilities() {
  const [email, setEmail] = useState('')

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="text-[12px] text-gray-400 mb-6 flex items-center gap-1.5">
          <Link to="/localization-kits" className="hover:text-gray-600 transition-colors font-medium">Localization Kits</Link>
          <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#C8102E] font-medium">Examples</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#C8102E] tracking-tight mb-3 leading-snug">
            Examples: Explore Illustrative Use Cases of The Singapore Way
          </h1>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-1">
            Welcome to <strong>Illustrative Use Cases</strong>, where the principles of The Singapore Way meet complex challenges.
          </p>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            Explore how communities adapt these principles to address challenges across cities, ministries, and public systems.
          </p>
        </div>

        {/* Email CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-7">
          <p className="text-[14px] text-gray-600 font-medium mb-4">Get a curated list of Use Cases by email</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border border-gray-200 rounded-full px-4 py-2.5 text-[14px] text-gray-700 focus:outline-none focus:border-[#C8102E] flex-1 bg-gray-50 transition-colors"
            />
            <button className="bg-[#C8102E] text-white text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap">
              Get the Use Cases
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button className="border border-[#C8102E] text-[#C8102E] text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-[#C8102E] hover:text-white transition-all duration-200">
            What You'll Find Here
          </button>
          <button className="border border-[#C8102E] text-[#C8102E] text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-[#C8102E] hover:text-white transition-all duration-200">
            Why Use Cases?
          </button>
        </div>

        <h2 className="text-lg font-extrabold text-gray-900 tracking-tight mb-6">Explore the Cases</h2>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map(({ icon, title, desc, tag }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-[#C8102E]/30 hover:shadow-md transition-all duration-200 relative"
            >
              {tag && (
                <span className="absolute top-4 right-4 bg-[#C8102E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              )}
              <div className="text-2xl mb-3 leading-none">{icon}</div>
              <h3 className="text-[14px] font-extrabold text-gray-900 tracking-tight mb-2">{title}</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
