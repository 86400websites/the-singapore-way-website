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
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
                More Than a Theory, a Practical Toolkit Empowering You to Create…
              </h1>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-9">
                The Singapore Way is not theory—it's a practical toolkit for change. In 17 focused chapters, it shows how scalable systems are built in areas like housing, water, education, and governance—using clear principles and real case studies.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Buy Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </a>
                <button className="inline-flex items-center gap-2 bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md">
                  Download Free Summary
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-50 rounded-2xl blur-3xl opacity-40 scale-95"></div>
                <img
                  src="/assets/book/book-cover.png"
                  alt="The Singapore Way by Maher Kaddoura"
                  className="relative w-56 md:w-72 shadow-2xl rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center tracking-tight mb-12">
            Don't just take our word for it
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map(({ quote, author }) => (
              <div
                key={author}
                className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-[#C8102E] text-4xl font-serif leading-none mb-3 opacity-60">"</div>
                <p className="text-[15px] text-gray-700 italic leading-relaxed mb-5">"{quote}"</p>
                <p className="text-[13px] text-gray-400 font-medium text-right">— {author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
