import { Link } from 'react-router-dom'

export default function Apply() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#C8102E] text-center tracking-tight mb-12">
          Apply &amp; Adapt The Singapore Way Locally
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Localization Kits */}
          <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
            <div className="h-52 bg-[#faf8f4] overflow-hidden flex items-center justify-center">
              <img src="/assets/apply/localization-kits.png" alt="Localization Kits" className="w-full h-full object-contain p-5" />
            </div>
            <div className="p-7 flex flex-col flex-1">
              <div className="flex items-center gap-2.5 text-gray-800 font-extrabold text-[15px] tracking-tight mb-3">
                <svg className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Localization Kits
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-7 flex-1">
                Practical guides that apply the 15+ principles of The Singapore Way to diverse challenges through adaptation, not imitation.
              </p>
              <div>
                <Link
                  to="/localization-kits"
                  className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-7 py-2.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Explore Kits
                </Link>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
            <div className="h-52 bg-[#faf8f4] overflow-hidden flex items-center justify-center">
              <img src="/assets/apply/examples.png" alt="Examples" className="w-full h-full object-contain p-5" />
            </div>
            <div className="p-7 flex flex-col flex-1">
              <div className="flex items-center gap-2.5 text-gray-800 font-extrabold text-[15px] tracking-tight mb-3">
                <svg className="w-[18px] h-[18px] text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Examples
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-7 flex-1">
                Illustrative use cases showing how The Singapore Way can be adapted to solve complex challenges across communities.
              </p>
              <div>
                <Link
                  to="/possibilities"
                  className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-7 py-2.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Explore Cases
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
