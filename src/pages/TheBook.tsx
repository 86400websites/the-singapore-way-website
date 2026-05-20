const testimonials = [
  {
    quote: "This book doesn't romanticise success — it explains it. The Singapore Way shows how disciplined leadership and long-term governance actually work.",
    author: "Dr. Adrian Koh",
    role: "Public Policy Advisor",
  },
  {
    quote: "Clear, grounded, and intellectually honest. A rare balance of research, storytelling, and real-world relevance.",
    author: "Prof. Eleanor Matthews",
    role: "Governance Lecturer",
  },
  {
    quote: "This book reframes how you think about change. It's not about copying Singapore — it's about learning how to think long-term.",
    author: "Aisha Ralamato",
    role: "Social Impact Leader",
  },
  {
    quote: "What stood out is the focus on execution, not ideology. It explains why trust, consistency, and pragmatism matter.",
    author: "Marcus Lim",
    role: "Former Civil Service Director",
  },
  {
    quote: "A powerful reminder that constraints don't limit progress — poor decisions do. Highly relevant for leaders everywhere.",
    author: "Jonathan Reed",
    role: "Development Strategy Consultant",
  },
  {
    quote: "Few books translate national success into practical principles. This one does — clearly, and without fluff.",
    author: "Daniel Niema",
    role: "Startup Founder",
  },
]

export default function TheBook() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-[#fbf5f2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <p className="eyebrow mb-5">The Book</p>
              <h1 className="text-3xl sm:text-4xl md:text-[44px] lg:text-5xl font-bold text-[#111111] leading-[1.12] tracking-[-0.01em] mb-6">
                More than a theory — a practical toolkit for change.
              </h1>
              <span className="editorial-rule mb-7" aria-hidden="true" />
              <p className="lede mb-9 max-w-xl">
                The Singapore Way is not theory. In 17 focused chapters, it shows how scalable systems are built in housing, water, education, and governance — using clear principles and real case studies.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill"
                >
                  Buy Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </a>
                <button className="btn-pill-outline">
                  Download Free Summary
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] bg-white rounded-3xl p-3 sm:p-4 shadow-[0_28px_60px_-32px_rgba(17,17,17,0.22)]">
                <img
                  src="/assets/book/the-singapore-way-book.png"
                  alt="The Singapore Way by Maher Kaddoura"
                  className="block w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-white border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="eyebrow mb-4">What Readers Say</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111111] leading-[1.15]">
              Don't just take our word for it.
            </h2>
            <span className="editorial-rule mx-auto mt-6" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {testimonials.map(({ quote, author, role }) => (
              <figure
                key={author}
                className="card-editorial p-8 md:p-10 flex flex-col"
              >
                <div className="text-[#C8102E] font-bold text-5xl leading-none mb-4 opacity-50 select-none" aria-hidden="true">
                  &ldquo;
                </div>
                <blockquote className="text-[16px] md:text-[17px] text-[#222222] italic leading-[1.65] mb-6 flex-1">
                  {quote}
                </blockquote>
                <figcaption>
                  <p className="text-[14px] font-bold text-[#111111] not-italic">{author}</p>
                  <p className="text-[13px] text-[#888888] mt-0.5">{role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
