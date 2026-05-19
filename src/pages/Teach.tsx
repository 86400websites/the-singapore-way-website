import { Link } from 'react-router-dom'

export default function Teach() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#C8102E] text-center tracking-tight mb-12 max-w-2xl mx-auto leading-snug">
          Teach The Singapore Way: Equip Students with Proven Principles
        </h1>
        <div className="max-w-sm mx-auto">
          <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
            <div className="h-52 bg-[#faf8f4] overflow-hidden flex items-center justify-center">
              <img src="/assets/teach/case-studies.png" alt="Case Studies" className="w-full h-full object-contain p-5" />
            </div>
            <div className="p-7 flex flex-col flex-1">
              <div className="flex items-center gap-2.5 text-gray-800 font-extrabold text-[15px] tracking-tight mb-3">
                <svg className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Case Studies
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-7 flex-1">
                Download 17 practical case studies linked to The Singapore Way principles, showing how systems were built, scaled, and sustained for deeper learning.
              </p>
              <div>
                <Link
                  to="/teaching-materials"
                  className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-7 py-2.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Browse Cases
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
