import { useState } from 'react'
import { Link } from 'react-router-dom'

const kits = [
  { icon: '🏛️', title: 'Leadership and Governance', desc: "This guide provides a structural reference for localising the guiding leadership and governance practices distilled from Singapore's journey." },
  { icon: '🏠', title: 'Smart Housing', desc: "This guide provides a detailed framework to help stakeholders adapt what Singapore's Smart Housing principles to their local context." },
  { icon: '📈', title: 'Economic Transformation', desc: "This guide provides a comprehensive framework for the detailed localisation of Singapore's economic transformation model into your local context." },
  { icon: '🎓', title: 'Talent Development and Education', desc: "This guide provides a comprehensive framework for localising Singapore's value development and education strategy into your national or regional context." },
  { icon: '🏥', title: 'Public Health and Healthcare System', desc: "This guide provides a structured framework for adapting Singapore's public health and healthcare development compare to your local context." },
  { icon: '🌐', title: 'Smart Nation', desc: "This guide offers a step-by-step framework to adapt Singapore's Smart Nation strategy into a local, context-intuitive, innovation-driven digital transformation initiative." },
  { icon: '🚌', title: 'Urban Mobility and Sustainable Transport', desc: "This guide provides a structured roadmap to adapt and localise Singapore's urban mobility strategy to your context." },
  { icon: '💧', title: 'Water and Resources Management', desc: "This guide provides a strategic framework for Singapore's integrated approach to water and resource management into your national or subnational context." },
  { icon: '🤝', title: 'Business and Trade Hub', desc: "This guide provides a comprehensive roadmap to adapt Singapore's business and trade hub strategy into your national or regional context." },
  { icon: '⚖️', title: 'Public Trust and Governance', desc: "This guide equips government, educators, and civic leaders with tools to adapt Singapore's trust-building and governance strategies to boost contexts." },
  { icon: '🏳️', title: 'National Identity', desc: "This guide supports policymakers, educators, and urban planners to localise the Singapore model of multicultural nation-building." },
  { icon: '🌿', title: 'Green Strategy', desc: "This guide supports planners, developers, and environmental advocates to adapt Singapore's green strategy to local contexts." },
  { icon: '💡', title: 'Fostering Innovation and Entrepreneurship', desc: "This guide provides a comprehensive framework for localising Singapore's experience in fostering innovation and entrepreneurship." },
  { icon: '🎨', title: 'Culture and Arts in Nation Building', desc: "This guide offers a comprehensive framework to adapt Singapore's strategy of leveraging culture and the arts in nation building." },
  { icon: '💻', title: 'Harnessing Technology for the Future', desc: "This guide provides a comprehensive roadmap to help localise Singapore's approach to national digital transformation." },
  { icon: '👥', title: 'Civic Engagement and Community Building', desc: "This guide supports stakeholders in localising Singapore's strategic approach to civic engagement and community building." },
]

export default function LocalizationKits() {
  const [email, setEmail] = useState('')

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="text-[12px] text-gray-400 mb-6 flex items-center gap-1.5">
          <span className="font-medium">Localization Kits</span>
          <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#C8102E] font-medium">Examples</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#C8102E] tracking-tight mb-3 leading-snug">
            Localization Kits: Apply The Singapore Way Where You Are
          </h1>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            Each Localization Kit breaks down a key principle from The Singapore Way and retasks it for your local reality. Whether you're redesigning housing policy, education reform, or governance systems—these kits help you adapt, not copy.
          </p>
        </div>

        {/* Email signup */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <p className="text-[14px] text-gray-600 font-medium mb-4">Get a curated list of Localization Kits by email</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border border-gray-200 rounded-full px-4 py-2.5 text-[14px] text-gray-700 focus:outline-none focus:border-[#C8102E] flex-1 bg-gray-50 transition-colors"
            />
            <button className="bg-[#C8102E] text-white text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap">
              Get the Localization Kits
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <select className="border border-gray-200 rounded-full px-4 py-2.5 text-[13px] text-gray-600 focus:outline-none focus:border-[#C8102E] bg-white shadow-sm pr-8">
            <option>Filter Kits</option>
            <option>Governance</option>
            <option>Economy</option>
            <option>Education</option>
            <option>Health</option>
            <option>Urban</option>
          </select>
          <select className="border border-gray-200 rounded-full px-4 py-2.5 text-[13px] text-gray-600 focus:outline-none focus:border-[#C8102E] bg-white shadow-sm pr-8">
            <option>Kits by Chapter</option>
            {kits.map((k) => <option key={k.title}>{k.title}</option>)}
          </select>
        </div>

        {/* Kits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kits.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-[#C8102E]/30 hover:shadow-md transition-all duration-200"
            >
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
