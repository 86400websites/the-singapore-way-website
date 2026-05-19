import { useState } from 'react'

const caseStudies = [
  {
    icon: '🏛️',
    title: 'Leadership and Governance',
    desc: 'Foundations of Singapore\'s governance — from its founding crisis to the institutions that made it work.',
  },
  {
    icon: '🏠',
    title: 'Smart Housing',
    desc: 'From makeshift settlements to one of the world\'s most successful public housing systems.',
  },
  {
    icon: '📈',
    title: 'Economic Transformation',
    desc: 'How Singapore engineered rapid GDP growth through strategic FDI, meritocracy, and industrial policy.',
  },
  {
    icon: '🎓',
    title: 'Talent Development and Education',
    desc: 'Education as national survival — Singapore\'s investment in human capital from the ground up.',
  },
  {
    icon: '🏥',
    title: 'Public Health and Healthcare System Development',
    desc: 'Building for Singapore Country: The Singapore Healthcare System.',
  },
  {
    icon: '🌐',
    title: 'Smart Nation',
    desc: 'Smart Nation Planning for the Digital Era: Smart Nation Support Singapore.',
  },
  {
    icon: '🚌',
    title: 'Urban Mobility and Sustainable Transport',
    desc: 'Shaping to Design Transport: Singapore\'s Four-Year Sustainable Transport.',
  },
  {
    icon: '💧',
    title: 'Water and Resources Management',
    desc: 'Four Taps: Water Singapore\'s Resource to Water Resilient Approach.',
  },
  {
    icon: '🤝',
    title: 'Singapore as a Business and Trade Hub',
    desc: 'Open State, Free Port: How Singapore Became a Global Business Centre.',
  },
  {
    icon: '⚖️',
    title: 'Public Trust and Governance',
    desc: 'Clean Government, Trusted State: Singapore\'s Anti-Corruption Journey in Policy.',
  },
  {
    icon: '🏳️',
    title: 'National Identity and Multiculturalism',
    desc: 'Unity in Diversity: How Singapore Supports a Shared Identity.',
  },
  {
    icon: '🌿',
    title: "Singapore's Green Strategy",
    desc: 'Garden City to Green Smart City: Singapore Balances Progress with Sustainability.',
  },
  {
    icon: '💡',
    title: 'Fostering Innovation and Entrepreneurship',
    desc: 'From Follower to Innovation: How Singapore Embraced Ecosystem-Supported Entrepreneurship.',
  },
  {
    icon: '🎨',
    title: 'The Role of Culture and the Arts in Nation Building',
    desc: "Building a Nation's Soul: The Role of Culture and Arts in Singapore.",
  },
  {
    icon: '💻',
    title: 'Harnessing Technology for the Future',
    desc: "Smart, Safe, Sustainable: Singapore's Tech-Led Approach to Long-Term Resilience.",
  },
  {
    icon: '👥',
    title: 'Civic Engagement and Community Building',
    desc: "Beyond Compliance, Towards Belonging: Singapore's Approach to Civic Engagement and Community Building.",
  },
  {
    icon: '🔮',
    title: 'The Future of Singapore',
    desc: 'Charting Resilience: Singapore Confronts Tomorrow.',
  },
]

export default function TeachingMaterials() {
  const [email, setEmail] = useState('')

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-xs text-gray-400">
          <span className="text-[#C8102E]">Case Studies</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#C8102E] mb-3">
          Case Studies: Real Systems, Real Lessons
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-2 max-w-3xl">
          Explore how Singapore's principles are applied across sectors—from housing to education, water to governance, innovation to culture—and see how each principle becomes a teachable, transferable lesson.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-3xl">
          These 17 case studies bring the book to life in the classroom, in policy circles, and in national strategy discussions.
        </p>

        {/* Email CTA + button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Get a free Study by email"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C8102E] w-64"
          />
          <button className="bg-[#C8102E] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#a50d26] transition-colors whitespace-nowrap">
            Get Free Study
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <select className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#C8102E] bg-white">
            <option>Free Chapter</option>
            {caseStudies.map((c) => <option key={c.title}>{c.title}</option>)}
          </select>
          <select className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#C8102E] bg-white">
            <option>Country by Chapter</option>
            <option>Singapore</option>
            <option>Rwanda</option>
            <option>South Africa</option>
            <option>Kazakhstan</option>
          </select>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {caseStudies.map(({ icon, title, desc }) => (
            <div key={title} className="border border-gray-200 rounded-lg p-5 hover:border-[#C8102E] hover:shadow-sm transition-all">
              <div className="text-2xl mb-2">{icon}</div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{desc}</p>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 border border-[#C8102E] text-[#C8102E] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#C8102E] hover:text-white transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Teacher's Guide
                </button>
                <button className="flex items-center gap-1.5 border border-[#C8102E] text-[#C8102E] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#C8102E] hover:text-white transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Student's Guide
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
