import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

const learnCards = [
  {
    title: 'Online Course',
    description: 'Explore 15 principles through practical case studies, videos, and interactive lessons.',
    image: '/assets/learn/online-course.png',
    href: '/online-course',
    cta: 'Coming Soon',
  },
  {
    title: 'Podcast',
    description: "Join us for in-depth dives into the ideas and innovations behind Singapore's rise.",
    image: '/assets/learn/podcast.png',
    href: '/podcasts',
    cta: 'Tune In',
  },
  {
    title: 'Blog',
    description: "Simple lessons from Singapore's success — clear, practical, and ready to use.",
    image: '/assets/learn/blog.png',
    href: '/blog',
    cta: 'Read Now',
  },
]

export default function Learn() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Learn"
        title="The foundations behind Singapore's success."
        description="Course, podcast, and blog — three ways into the framework. Pick the format that fits how you learn best."
        align="left"
        variant="light"
      />

      <section className="py-16 md:py-24 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {learnCards.map((card) => (
              <article
                key={card.title}
                className="card-editorial flex flex-col group"
              >
                <div className="aspect-[4/3] bg-[#faf8f4] overflow-hidden flex items-center justify-center border-b border-[#ECECEC]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-contain p-6 group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="p-7 md:p-8 flex flex-col flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-3">
                    {card.title}
                  </h3>
                  <p className="prose-body mb-7 flex-1">{card.description}</p>
                  <div>
                    <Link to={card.href} className="btn-pill">
                      {card.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
