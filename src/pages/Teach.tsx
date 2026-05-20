import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

export default function Teach() {
  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Teach"
        title="Equip students with proven principles."
        description="Seventeen case studies, ready for the classroom, the boardroom, and policy briefings — built around the systems behind Singapore's rise."
        align="left"
        variant="light"
      />

      <section className="py-16 md:py-24 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <article className="card-editorial flex flex-col group">
            <div className="aspect-[16/9] bg-[#faf8f4] overflow-hidden flex items-center justify-center border-b border-[#ECECEC]">
              <img
                src="/assets/teach/case-studies.png"
                alt="Case Studies"
                className="w-full h-full object-contain p-8 group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col">
              <p className="eyebrow-muted mb-3">17 Studies</p>
              <h3 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mb-4">
                Case Studies
              </h3>
              <p className="prose-body mb-8">
                Download 17 practical case studies linked to The Singapore Way principles, showing how systems were built, scaled, and sustained — for deeper learning in classrooms and leadership programs.
              </p>
              <div>
                <Link to="/teaching-materials" className="btn-pill">
                  Browse Cases
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
