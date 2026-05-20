import { useState } from 'react'
import PageHero from '../components/PageHero'

const faqs = [
  {
    q: 'What is The Singapore Way?',
    a: "The Singapore Way is a practical framework for national and local transformation, derived from Singapore's remarkable rise from a small city-state with no natural resources to one of the world's most prosperous nations. It distils the principles, systems, and approaches that drove Singapore's success into a form that can be adapted — not copied — by leaders, educators, and change-makers in diverse contexts.",
  },
  {
    q: 'Is this about copying Singapore?',
    a: "Absolutely not. \"Don't borrow the fruit. Borrow the root.\" The Singapore Way is explicitly about extracting the underlying principles — not the specific policies — and adapting them to your own context. What we share are the principles of thinking and decision-making that produced Singapore's solutions.",
  },
  {
    q: 'Who is this for?',
    a: "The Singapore Way is designed for educators who want to teach systems thinking, government leaders and policy-makers who want to pilot informed reforms, and social innovators who want to design effective interventions from the start.",
  },
  {
    q: "Is Singapore's model relevant to larger, more diverse countries?",
    a: "Yes — with adaptation. Singapore's size makes certain interventions easier, but the principles themselves scale. Countries like Rwanda, Kazakhstan, and Vietnam have already begun drawing lessons from Singapore's playbook, adapting them to vastly different contexts.",
  },
  {
    q: 'What does "The Global Majority" mean?',
    a: '"The Global Majority" refers to the countries and populations outside of Western Europe and North America — Africa, Asia, Latin America, the Middle East — that make up the majority of the world\'s population.',
  },
  {
    q: 'How do I get started?',
    a: "The best starting point is the book — it provides the full framework in 17 focused chapters. From there, you can explore the platform's learning resources (podcast, blog, online course), apply through localization kits, or engage with the case studies for teaching.",
  },
  {
    q: 'Are there any free resources?',
    a: "Yes. The blog is free and regularly updated with articles applying Singapore's principles to real-world challenges. The podcast episodes are also freely available. We will also publish a free summary of the book.",
  },
  {
    q: "Can I teach The Singapore Way in my university or program?",
    a: "We actively support educators who want to use The Singapore Way in their curriculum. We provide case studies, discussion frameworks, and teaching materials. Contact us at info@thesingaporeway.com to discuss institutional access.",
  },
]

export default function QA() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions."
        description="Everything you need to know about The Singapore Way platform — the framework, the audience, and how to get started."
        align="left"
        variant="light"
      />

      <section className="py-14 md:py-20 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => {
              const isOpen = open === i
              return (
                <div
                  key={i}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? 'border-[#C8102E]/30 shadow-[0_8px_28px_-12px_rgba(200,16,46,0.18)]'
                      : 'border-[#ECECEC] hover:border-[#DDDDDD]'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between px-6 md:px-7 py-5 text-left transition-colors"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-[#111111] text-[16px] md:text-[17px] pr-6 leading-[1.4]">{q}</span>
                    <span className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#C8102E]' : 'text-[#888888]'}`} aria-hidden="true">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 md:px-7 pb-6 border-t border-[#F0F0F0]">
                      <p className="text-[15px] md:text-[16px] text-[#444444] leading-[1.7] pt-5">{a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 md:mt-16 card-editorial p-8 md:p-10 text-center">
            <p className="eyebrow mb-4">Still curious?</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mb-3">
              We're happy to help.
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#666666] leading-[1.65] mb-7 max-w-md mx-auto">
              Reach out and our team will follow up — usually within a day or two.
            </p>
            <a href="mailto:info@thesingaporeway.com" className="btn-pill">
              Contact Us
            </a>
          </div>

        </div>
      </section>
    </div>
  )
}
