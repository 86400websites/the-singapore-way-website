import { useState } from 'react'
import { Link } from 'react-router-dom'

const faqs = [
  {
    q: 'What is The Singapore Way?',
    a: 'The Singapore Way is a practical framework for national and local transformation, derived from Singapore\'s remarkable rise from a small city-state with no natural resources to one of the world\'s most prosperous nations. It distils the principles, systems, and approaches that drove Singapore\'s success into a form that can be adapted — not copied — by leaders, educators, and change-makers in diverse contexts.',
  },
  {
    q: 'Is this about copying Singapore?',
    a: 'Absolutely not. "Don\'t borrow the fruit. Borrow the root." The Singapore Way is explicitly about extracting the underlying principles — not the specific policies — and adapting them to your own context. Singapore\'s specific solutions (HDB flats, NEWater, the CPF system) emerged from its unique conditions. What we share are the principles of thinking and decision-making that produced those solutions.',
  },
  {
    q: 'Who is this for?',
    a: 'The Singapore Way is designed for three primary audiences: educators who want to teach systems thinking and governance principles; government leaders and policy-makers who want to pilot informed reforms; and social innovators who want to design effective interventions from the start. If you believe tough problems can be solved with clear thinking and good systems, this is for you.',
  },
  {
    q: 'Is Singapore\'s model relevant to larger, more diverse countries?',
    a: 'Yes — with adaptation. Singapore\'s size makes certain interventions easier, but the principles themselves scale. Countries like Rwanda, Kazakhstan, and Vietnam have already begun drawing lessons from Singapore\'s playbook, adapting them to vastly different contexts. The key is understanding why Singapore\'s approaches worked, not just what they were.',
  },
  {
    q: 'What does "The Global Majority" mean?',
    a: '"The Global Majority" refers to the countries and populations outside of Western Europe and North America — Africa, Asia, Latin America, the Middle East — that make up the majority of the world\'s population. These are often the societies that have the most to gain from practical, proven development frameworks.',
  },
  {
    q: 'How do I get started?',
    a: 'The best starting point is the book — it provides the full framework in 17 focused chapters. From there, you can explore the platform\'s learning resources (podcast, blog, online course), apply through localization kits, or engage with the case studies for teaching.',
  },
  {
    q: 'Are there any free resources?',
    a: 'Yes. The blog is free and regularly updated with articles applying Singapore\'s principles to real-world challenges. The podcast episodes are also freely available. We will also publish a free summary of the book. Sign up to be notified.',
  },
  {
    q: 'Can I teach The Singapore Way in my university or program?',
    a: 'We actively support educators who want to use The Singapore Way in their curriculum. We provide case studies, discussion frameworks, and teaching materials. Contact us at info@thesingaporeway.com to discuss institutional access.',
  },
]

export default function QA() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Q&A</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Questions & Answers
          </h1>
          <p className="text-[#AAAAAA] text-xl max-w-2xl leading-relaxed">
            Everything you need to know about The Singapore Way, the framework, and how to engage with the platform.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="border border-[#E5E5E5] overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-7 py-5 text-left hover:bg-[#F9F9F9] transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-bold text-[#111111] text-base pr-4">{q}</span>
                  <span className={`text-[#C8102E] flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {open === i && (
                  <div className="px-7 pb-7 border-t border-[#F0F0F0] bg-[#FAFAFA]">
                    <p className="text-[#555555] text-base leading-relaxed pt-5">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 p-10 bg-[#111111] text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Still have a question?</h3>
            <p className="text-[#AAAAAA] mb-6">Reach out directly — we'd love to hear from you.</p>
            <a
              href="mailto:info@thesingaporeway.com"
              className="inline-block bg-[#C8102E] text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-[#a50d26] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#111111] mb-8 text-center">Explore the Framework</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'The Book', href: '/thebook' },
              { label: 'Learn', href: '/learn' },
              { label: 'Apply', href: '/apply' },
              { label: 'Teach', href: '/teach' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className="bg-white border border-[#E5E5E5] p-6 text-center font-semibold text-[#111111] text-sm hover:border-[#C8102E] hover:text-[#C8102E] transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
