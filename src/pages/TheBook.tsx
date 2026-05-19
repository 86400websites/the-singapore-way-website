import { Link } from 'react-router-dom'

const testimonials = [
  {
    quote: "This book doesn't romanticise success — it explains it. The Singapore Way shows how disciplined leadership and long-term governance actually work.",
    author: "Dr. Adrian Koh, Public Policy Advisor",
  },
  {
    quote: "Clear, grounded, and intellectually honest. A rare balance of research, storytelling, and real-world relevance.",
    author: "Prof. Eleanor Matthews, Governance Lecturer",
  },
  {
    quote: "This book reframes how you think about change. It's not about copying Singapore — it's about learning how to think long-term.",
    author: "Aisha Ralamato, Social Impact Leader",
  },
  {
    quote: "What stood out is the focus on execution, not ideology. It explains why trust, consistency, and pragmatism matter.",
    author: "Marcus Lim, Former Civil Service Director",
  },
  {
    quote: "A powerful reminder that constraints don't limit progress — poor decisions do. Highly relevant for leaders everywhere.",
    author: "Jonathan Reed, Development Strategy Consultant",
  },
  {
    quote: "Few books translate national success into practical principles. This one does — clearly, and without fluff.",
    author: "Daniel Niema, Startup Founder",
  },
]

export default function TheBook() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                More Than a Theory, a Practical Toolkit Empowering You to Create…
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                The Singapore Way is not theory—it's a practical toolkit for change. In 17 focused chapters, it shows how scalable systems are built in areas like housing, water, education, and governance—using clear principles and real case studies.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#C8102E] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-colors"
                >
                  Buy Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </a>
                <button className="inline-flex items-center gap-2 bg-[#C8102E] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-colors">
                  Download Free Summary
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="/assets/book/book-cover.png"
                alt="The Singapore Way by Maher Kaddoura"
                className="w-56 md:w-64 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            Don't just take our word for it
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map(({ quote, author }) => (
              <div key={author} className="border border-gray-200 rounded-lg p-6">
                <div className="text-[#C8102E] text-3xl font-serif leading-none mb-3">"</div>
                <p className="text-sm text-gray-700 italic leading-relaxed mb-4">"{quote}"</p>
                <div className="flex justify-end">
                  <div>
                    <p className="text-xs text-gray-500 text-right">— {author}</p>
                  </div>
                </div>
                <div className="text-[#C8102E] text-3xl font-serif leading-none text-right mt-2">"</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
