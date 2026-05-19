import { useState } from 'react'
import { Link } from 'react-router-dom'

const useCases = [
  {
    icon: '🌱',
    title: 'Climate by Design',
    desc: "Embeds mandatory climate-positive urban-design studies at the University of Ghana so graduates can future-proof Accra.",
  },
  {
    icon: '🔵',
    title: 'Digital Twins for All',
    desc: "CityTwin SaaS gives cash-strapped cities mobile digital-twin tools to test infrastructure scenarios before they build.",
  },
  {
    icon: '💰',
    title: 'From Informal to Investable',
    desc: "Investable Bamako turns informal micro-enterprises into bankable industrial clusters through micro-parks and e-ID finance access.",
  },
  {
    icon: '👥',
    title: 'My City, My Chapter',
    desc: "Neighborhood Chapters in Lalitpur let citizens co-design plans, budgets, and policies for their own streets.",
  },
  {
    icon: '🏛️',
    title: 'Redesigning the State',
    desc: "Statecraft Studio Addis swaps rote policy study for live simulations that let students prototype real governance reforms.",
  },
  {
    icon: '🌳',
    title: 'Roots in the Sky',
    desc: "Skycool Nairobi converts unsafe rooftop shanties into modular green micro-villages with housing, farms, and services.",
  },
  {
    icon: '🗺️',
    title: 'Smart Streets, Safe Cities',
    desc: "Port Louis Smart Street Grid links sensors, smart lights, and live dashboards to cut crime and smooth traffic.",
  },
  {
    icon: '🌐',
    title: 'Sovereignty as Strategy',
    tag: 'Available via app',
    desc: "Belmora 2040 equips Saint Calade to steer long-term development with a sovereign foresight framework and diaspora bonds.",
  },
  {
    icon: '⚡',
    title: 'City as a Service',
    desc: "GridBlocks in Gulu delivers prepaid, high-uptake power via modular micro-grids that treat energy as a civic service.",
  },
  {
    icon: '📚',
    title: 'From Learning to Earning',
    desc: "W-Connect in Asmara gives women micro-training credits and an app to translate new skills directly into higher income.",
  },
  {
    icon: '🔬',
    title: 'Scenario Labs for Clients',
    desc: "Cobalt Strategies' Scenario Labs lets companies co-create modular simulations that bake long-term foresight into strategy.",
  },
  {
    icon: '❤️',
    title: 'Unity by Platform',
    desc: "UbuntuConnect gamifies civic missions, tracks a Unity Index, and rewards diverse users to build social cohesion across Johannesburg.",
  },
]

export default function Possibilities() {
  const [email, setEmail] = useState('')

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-xs text-gray-400">
          <Link to="/localization-kits" className="hover:text-gray-600 transition-colors">Localization Kits</Link>
          <span className="mx-2">/</span>
          <span className="text-[#C8102E]">Examples</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#C8102E] mb-3">
          Examples: Explore Illustrative Use Cases of The Singapore Way
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-1 max-w-3xl">
          Welcome to <strong>Illustrative Use Cases</strong>, where the principles of The Singapore Way meet complex challenges.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-3xl">
          Explore how communities adapt these principles to address challenges across cities, ministries, and public systems.
        </p>

        {/* Email CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Get a curated list of Use Cases by email"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C8102E] flex-1 max-w-xs"
          />
          <button className="bg-[#C8102E] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#a50d26] transition-colors whitespace-nowrap">
            Get the Use Cases
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-3 mb-8">
          <button className="border border-[#C8102E] text-[#C8102E] text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#C8102E] hover:text-white transition-colors">
            What You'll Find Here
          </button>
          <button className="border border-[#C8102E] text-[#C8102E] text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#C8102E] hover:text-white transition-colors">
            Why Use Cases?
          </button>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-6">Explore the Cases</h2>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {useCases.map(({ icon, title, desc, tag }) => (
            <div key={title} className="border border-gray-200 rounded-lg p-5 hover:border-[#C8102E] hover:shadow-sm transition-all relative">
              {tag && (
                <span className="absolute top-3 right-3 bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {tag}
                </span>
              )}
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
