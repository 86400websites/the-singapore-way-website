import { useState } from 'react'

const episodes = [
  { num: '01', title: 'What Is The Singapore Way', duration: '08:04' },
  { num: '02', title: 'Bridging Singapore to the World', duration: '05:13' },
  { num: '03', title: "Adapting Singapore's Principles Globally", duration: '12:30' },
  { num: '04', title: 'How Singapore Solved Its Housing Crisis', duration: '13:38' },
  { num: '05', title: 'Building Through Meritocracy', duration: '11:41' },
  { num: '06', title: "Nations that have Adapted Singapore's Development Model", duration: '08:06' },
  { num: '07', title: 'Teaching The Singapore Way', duration: '05:03' },
  { num: '08', title: 'Beyond Singapore - Adaptation Not Imitation', duration: '13:38' },
]

export default function Podcast() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Podcast Header Card */}
        <div className="bg-white rounded-2xl border border-[#C8102E]/20 shadow-sm p-6 mb-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <img
              src="/assets/learn/podcast.png"
              alt="The Singapore Way Podcast"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">Learn the Singapore Way</p>
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight mb-1.5">Learn the Singapore Way</h1>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-2.5">
              Join us for in-depth dives into the ideas and innovations behind Singapore's rise.
            </p>
            <p className="text-[12px] text-gray-400 mb-4">Updated 2025 • 7 Episodes</p>
            <button className="bg-[#C8102E] text-white text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md">
              Let's Begin
            </button>
          </div>
        </div>

        {/* Audio Player Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
            <img src="/assets/logo/logo-red.png" alt="" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-gray-700 font-semibold truncate">
              {selected ? episodes.find(e => e.num === selected)?.title : 'Select an episode to start listening'}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">The Singapore Way</p>
          </div>
          <div className="flex items-center gap-3 text-gray-400 flex-shrink-0">
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-[#C8102E] text-white flex items-center justify-center hover:bg-[#a50d26] transition-colors shadow-sm">
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <button className="hover:text-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8l-5.5 4zM18 6h2v12h-2z"/></svg>
            </button>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-32">
            <div className="w-2 h-2 bg-[#C8102E] rounded-full flex-shrink-0"></div>
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-[#C8102E] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Episode List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {episodes.map((ep, i) => (
            <button
              key={ep.num}
              onClick={() => setSelected(ep.num)}
              className={`w-full flex items-center gap-5 py-4 px-6 text-left transition-colors ${
                i !== episodes.length - 1 ? 'border-b border-gray-50' : ''
              } ${selected === ep.num ? 'bg-red-50' : 'hover:bg-gray-50'}`}
            >
              <span className={`text-[13px] font-bold w-6 flex-shrink-0 tabular-nums ${selected === ep.num ? 'text-[#C8102E]' : 'text-gray-300'}`}>
                {ep.num}
              </span>
              <span className={`flex-1 text-[14px] font-medium ${selected === ep.num ? 'text-[#C8102E]' : 'text-gray-700'}`}>
                {ep.title}
              </span>
              <span className="text-[12px] text-gray-400 flex-shrink-0 tabular-nums">{ep.duration}</span>
              <span className={`flex-shrink-0 transition-colors ${selected === ep.num ? 'text-[#C8102E]' : 'text-gray-200'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
