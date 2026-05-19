import { useState } from 'react'
import { Link } from 'react-router-dom'

const kits = [
  {
    icon: '🏛️',
    title: 'Leadership and Governance',
    desc: 'This guide provides a structural reference for localising the guiding leadership and governance practices distilled from Singapore\'s journey.',
  },
  {
    icon: '🏠',
    title: 'Smart Housing',
    desc: 'This guide provides a detailed framework to help stakeholders adapt what Singapore\'s Smart Housing principles to their local context.',
  },
  {
    icon: '📈',
    title: 'Economic Transformation',
    desc: 'This guide provides a comprehensive framework for the detailed localisation of Singapore\'s economic transformation model into your local context.',
  },
  {
    icon: '🎓',
    title: 'Talent Development and Education',
    desc: 'This guide provides a comprehensive framework for localising Singapore\'s value development and education strategy into your national or regional context.',
  },
  {
    icon: '🏥',
    title: 'Public Health and Healthcare System',
    desc: 'This guide provides a structured framework for adapting Singapore\'s public health and healthcare development compare to your local context.',
  },
  {
    icon: '🌐',
    title: 'Smart Nation',
    desc: 'This guide offers a step-by-step framework to adapt Singapore\'s Smart Nation strategy into a local, context-intuitive, innovation-driven digital transformation initiative.',
  },
  {
    icon: '🚌',
    title: 'Urban Mobility and Sustainable Transport',
    desc: 'This guide provides a structured roadmap to adapt and localise Singapore\'s urban mobility strategy to your context.',
  },
  {
    icon: '💧',
    title: 'Water and Resources Management',
    desc: 'This guide provides a strategic framework for Singapore\'s integrated approach to water and resource management into your national or subnational context.',
  },
  {
    icon: '🤝',
    title: 'Business and Trade Hub',
    desc: "This guide provides a comprehensive roadmap to adapt Singapore's business and trade hub strategy into your national or regional context.",
  },
  {
    icon: '⚖️',
    title: 'Public Trust and Governance',
    desc: "This guide equips government, educators, and civic leaders with tools to adapt Singapore's trust-building and governance strategies to boost contexts.",
  },
  {
    icon: '🏳️',
    title: 'National Identity',
    desc: "This guide supports policymakers, educators, and urban planners to localise the Singapore model of multicultural nation-building.",
  },
  {
    icon: '🌿',
    title: 'Green Strategy',
    desc: "This guide supports planners, developers, and environmental advocates to adapt Singapore's green strategy to local contexts.",
  },
  {
    icon: '💡',
    title: 'Fostering Innovation and Entrepreneurship',
    desc: "This guide provides a comprehensive framework for localising Singapore's experience in fostering innovation and entrepreneurship.",
  },
  {
    icon: '🎨',
    title: 'Culture and Arts in Nation Building',
    desc: "This guide offers a comprehensive framework to adapt Singapore's strategy of leveraging culture and the arts in nation building.",
  },
  {
    icon: '💻',
    title: 'Harnessing Technology for the Future',
    desc: 'This guide provides a comprehensive roadmap to help localise Singapore\'s approach to national digital transformation.',
  },
  {
    icon: '👥',
    title: 'Civic Engagement and Community Building',
    desc: "This guide supports stakeholders in localising Singapore's strategic approach to civic engagement and community building.",
  },
]

export default function LocalizationKits() {
  const [email, setEmail] = useState('')

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-xs text-gray-400">
          <span>Localization Kits</span>
          <span className="mx-2">/</span>
          <span className="text-[#C8102E]">Examples</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#C8102E] mb-3">
          Localization Kits: Apply The Singapore Way Where You Are
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-2 max-w-3xl">
          Each Localization Kit breaks down a key principle from The Singapore Way and retasks it for your local reality. Whether you're redesigning housing policy, education reform, or governance systems—these kits help you adapt, not copy.
        </p>

        {/* Email signup */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8 mt-5">
          <span className="text-sm text-gray-600">Get a curated list of Localization Kits by email</span>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#C8102E] w-48"
            />
            <button className="bg-[#C8102E] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#a50d26] transition-colors whitespace-nowrap">
              Get the Localization Kits
            </button>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <select className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#C8102E] bg-white">
            <option>Filter Kits</option>
            <option>Governance</option>
            <option>Economy</option>
            <option>Education</option>
            <option>Health</option>
            <option>Urban</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#C8102E] bg-white">
            <option>Kits by Chapter</option>
            {kits.map((k) => <option key={k.title}>{k.title}</option>)}
          </select>
        </div>

        {/* Kits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {kits.map(({ icon, title, desc }) => (
            <div key={title} className="border border-gray-200 rounded-lg p-5 hover:border-[#C8102E] hover:shadow-sm transition-all">
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
