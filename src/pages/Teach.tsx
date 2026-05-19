import { Link } from 'react-router-dom'

export default function Teach() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-[#C8102E] text-center mb-10">
          Teach The Singapore Way: Equip Students with Proven Principles
        </h1>
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 bg-[#f9f5ee] overflow-hidden flex items-center justify-center">
              <img src="/assets/teach/case-studies.png" alt="Case Studies" className="w-full h-full object-contain p-4" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-base mb-3">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Case Studies
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
                Download 17 practical case studies linked to The Singapore Way principles, showing how systems were built, scaled, and sustained for deeper learning.
              </p>
              <div>
                <Link
                  to="/teaching-materials"
                  className="inline-block bg-[#C8102E] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-colors"
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
