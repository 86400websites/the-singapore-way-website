export default function OnlineCourse() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-70px)] flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
          <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-relaxed">
          We're finalising the details to bring you the best experience.
        </h1>
      </div>
    </div>
  )
}
