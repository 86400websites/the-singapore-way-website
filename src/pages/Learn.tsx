import { Link } from 'react-router-dom'

const learnOptions = [
  {
    title: 'Online Course',
    subtitle: 'Coming Soon',
    description: 'A comprehensive online course to understand and apply the principles behind Singapore\'s remarkable national transformation in your own context.',
    image: '/assets/learn/online-course.png',
    href: '/online-course',
    tag: 'Coming Soon',
    tagColor: 'bg-[#111111]',
    cta: 'Learn More',
  },
  {
    title: 'Podcast',
    subtitle: 'Episodes Available',
    description: 'Join us to learn and apply the practical ideas behind Singapore\'s rise — deep conversations with leaders, educators, and change-makers.',
    image: '/assets/learn/podcast.png',
    href: '/podcasts',
    tag: 'Available',
    tagColor: 'bg-[#C8102E]',
    cta: 'Listen Now',
  },
  {
    title: 'Blog',
    subtitle: 'Insights & Articles',
    description: 'Explore articles that break down Singapore\'s principles and show how they apply to real-world challenges across the Global Majority.',
    image: '/assets/learn/blog.png',
    href: '/blog',
    tag: 'New Posts',
    tagColor: 'bg-[#C8102E]',
    cta: 'Read Articles',
  },
]

export default function Learn() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Learn</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Learn The Singapore Way: Apply the Principles That Built a Nation
          </h1>
          <p className="text-[#AAAAAA] text-xl max-w-2xl leading-relaxed">
            Unlock Singapore's proven success principles through flashcards, podcast, blog, online course and Q&A and start to apply your strategic transformation today.
          </p>
        </div>
      </section>

      {/* Learn Options */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {learnOptions.map((option) => (
              <div key={option.title} className="group border border-[#E5E5E5] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden h-56">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-4 left-4 ${option.tagColor} text-white text-xs font-bold px-3 py-1.5 tracking-wide`}>
                    {option.tag}
                  </span>
                </div>
                <div className="p-8">
                  <p className="text-[#C8102E] text-xs font-semibold tracking-widest uppercase mb-2">{option.subtitle}</p>
                  <h3 className="text-2xl font-bold text-[#111111] mb-4">{option.title}</h3>
                  <p className="text-[#666666] text-sm leading-relaxed mb-6">{option.description}</p>
                  <Link
                    to={option.href}
                    className="inline-flex items-center gap-2 text-[#111111] font-bold text-sm tracking-wide border-b-2 border-[#C8102E] pb-0.5 hover:text-[#C8102E] transition-colors group-hover:gap-4"
                  >
                    {option.cta}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Q&A Banner */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-[#111111] mb-2">Have Questions?</h2>
            <p className="text-[#666666] text-lg">Browse our Q&A section for answers about the framework and how to apply it.</p>
          </div>
          <Link
            to="/q-a"
            className="bg-[#C8102E] text-white font-bold px-8 py-4 text-sm tracking-wide hover:bg-[#a50d26] transition-colors flex-shrink-0"
          >
            Questions & Answers
          </Link>
        </div>
      </section>
    </div>
  )
}
