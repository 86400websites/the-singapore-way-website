import { Link } from 'react-router-dom'

const learnCards = [
  {
    title: 'Online Course',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Explore 15 principles through practical case studies, videos, and interactive lessons.',
    image: '/assets/learn/online-course.png',
    href: '/online-course',
    cta: 'Coming Soon',
  },
  {
    title: 'Podcast',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    description: "Join us for in-depth dives into the ideas and innovations behind Singapore's rise.",
    image: '/assets/learn/podcast.png',
    href: '/podcasts',
    cta: 'Tune In',
  },
  {
    title: 'Blogs',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    description: "Simple lessons from Singapore's success—clear, practical, and ready to use.",
    image: '/assets/learn/blog.png',
    href: '/blog',
    cta: 'Read Now',
  },
]

export default function Learn() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-[#C8102E] text-center mb-10">
          Learn The Singapore Way: Foundations Behind Singapore's Success
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {learnCards.map((card) => (
            <div key={card.title} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-44 bg-[#f9f5ee] overflow-hidden flex items-center justify-center">
                <img src={card.image} alt={card.title} className="w-full h-full object-contain p-4" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-gray-800 font-bold text-base mb-3">
                  <span className="text-gray-700">{card.icon}</span>
                  {card.title}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">{card.description}</p>
                <div>
                  <Link
                    to={card.href}
                    className="inline-block bg-[#C8102E] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-colors"
                  >
                    {card.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
