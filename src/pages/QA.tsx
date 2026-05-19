import { useState } from 'react'
import { Link } from 'react-router-dom'

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
    a: 'Yes. The blog is free and regularly updated with articles applying Singapore\'s principles to real-world challenges. The podcast episodes are also freely available. We will also publish a free summary of the book.',
  },
  {
    q: "Can I teach The Singapore Way in my university or program?",
    a: "We actively support educators who want to use The Singapore Way in their curriculum. We provide case studies, discussion frameworks, and teaching materials. Contact us at info@thesingaporeway.com to discuss institutional access.",
  },
]

export default function QA() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold text-[#C8102E] mb-2">Frequently Asked Questions</h1>
        <p className="text-sm text-gray-500 mb-10">Everything you need to know about The Singapore Way platform.</p>

        <div className="space-y-2">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
                <span className={`text-gray-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed pt-4">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-3">Still have a question?</p>
          <a
            href="mailto:info@thesingaporeway.com"
            className="inline-block bg-[#C8102E] text-white text-sm font-semibold px-7 py-2.5 rounded-full hover:bg-[#a50d26] transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
