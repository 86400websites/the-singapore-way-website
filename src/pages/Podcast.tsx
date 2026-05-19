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
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Podcast Header Card */}
        <div className="flex flex-col sm:flex-row gap-5 items-start mb-8 p-5 border border-[#C8102E] rounded-lg">
          <div className="flex-shrink-0 w-36 h-28 border border-gray-200 rounded overflow-hidden">
            <img
              src="/assets/learn/podcast.png"
              alt="The Singapore Way Podcast"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Learn the Singapore Way</p>
            <h1 className="text-lg font-bold text-gray-900 mb-1">Learn the Singapore Way</h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Join us for in-depth dives into the ideas and innovations behind Singapore's rise.
            </p>
            <p className="text-xs text-gray-400 mb-3">Updated 2025 • 7 Episodes</p>
            <button className="bg-[#C8102E] text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-[#a50d26] transition-colors">
              Let's Begin
            </button>
          </div>
        </div>

        {/* Audio Player Bar */}
        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg mb-6 bg-gray-50">
          <div className="w-10 h-10 border border-gray-300 rounded overflow-hidden flex-shrink-0">
            <img src="/assets/logo/logo-red.png" alt="" className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">
              {selected ? episodes.find(e => e.num === selected)?.title : 'Select an episode to start listening'}
            </p>
            <p className="text-xs text-gray-400">—</p>
          </div>
          <div className="flex items-center gap-3 text-gray-500 flex-shrink-0">
            <button className="hover:text-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
              </svg>
            </button>
            <button className="hover:text-gray-800 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <button className="hover:text-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8l-5.5 4zM18 6h2v12h-2z"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-32">
            <div className="w-3 h-3 bg-[#C8102E] rounded-full"></div>
            <div className="flex-1 h-0.5 bg-gray-200 rounded">
              <div className="h-full w-1/3 bg-[#C8102E] rounded"></div>
            </div>
          </div>
        </div>

        {/* Episode List */}
        <div className="divide-y divide-gray-100">
          {episodes.map((ep) => (
            <button
              key={ep.num}
              onClick={() => setSelected(ep.num)}
              className={`w-full flex items-center gap-5 py-4 px-2 text-left hover:bg-gray-50 transition-colors rounded group ${selected === ep.num ? 'bg-red-50' : ''}`}
            >
              <span className={`text-sm font-medium w-6 flex-shrink-0 ${selected === ep.num ? 'text-[#C8102E]' : 'text-gray-400'}`}>{ep.num}</span>
              <span className={`flex-1 text-sm ${selected === ep.num ? 'text-[#C8102E] font-semibold' : 'text-gray-700'}`}>{ep.title}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">{ep.duration}</span>
              <span className={`flex-shrink-0 ${selected === ep.num ? 'text-[#C8102E]' : 'text-gray-300 group-hover:text-[#C8102E]'} transition-colors`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
