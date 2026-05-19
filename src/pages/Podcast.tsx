import { Link } from 'react-router-dom'

const episodes = [
  {
    num: 'EP 01',
    title: 'What is The Singapore Way?',
    desc: 'An introduction to the framework and why Singapore\'s story matters for the Global Majority.',
    duration: '45 min',
  },
  {
    num: 'EP 02',
    title: 'Why People Failed to Copy Singapore',
    desc: 'Why most attempts to replicate Singapore\'s success fail — and what they miss.',
    duration: '52 min',
  },
  {
    num: 'EP 03',
    title: 'Teaching The Singapore Way to Leaders of Tomorrow',
    desc: 'How educators and trainers are bringing these principles into classrooms and boardrooms.',
    duration: '38 min',
  },
  {
    num: 'EP 04',
    title: 'How to Adapt Singapore\'s Lessons Without Copying Them',
    desc: 'A practical discussion on the adaptation process — what to take and what to leave.',
    duration: '41 min',
  },
  {
    num: 'EP 05',
    title: 'Fixing What\'s Broken: Tackling Service Delivery Failures',
    desc: 'Applying Singapore\'s governance principles to chronic service delivery failures.',
    duration: '49 min',
  },
  {
    num: 'EP 06',
    title: 'From Cadres to Competence: Reforming the Public Service',
    desc: 'How to build a merit-based public service culture in patronage-heavy systems.',
    duration: '55 min',
  },
]

export default function Podcast() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Podcast</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                The Singapore Way Podcast
              </h1>
              <p className="text-[#AAAAAA] text-xl leading-relaxed mb-8">
                Join us to learn and apply the practical ideas behind Singapore's rise — a must-listen for those who want to teach, lead, and innovate.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-[#C8102E] text-white font-semibold px-6 py-3 text-sm tracking-wide hover:bg-[#a50d26] transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Listen on Spotify
                </button>
                <button className="border-2 border-white text-white font-semibold px-6 py-3 text-sm tracking-wide hover:bg-white hover:text-[#111111] transition-colors">
                  Apple Podcasts
                </button>
              </div>
            </div>
            <div className="relative flex justify-center">
              <img
                src="/assets/learn/podcast.png"
                alt="The Singapore Way Podcast"
                className="w-full max-w-sm shadow-2xl rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Episodes */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Episodes</p>
            <h2 className="text-4xl font-bold text-[#111111]">All Episodes</h2>
          </div>
          <div className="space-y-4">
            {episodes.map(({ num, title, desc, duration }) => (
              <div key={num} className="group flex items-start gap-6 p-7 border border-[#E5E5E5] hover:border-[#C8102E] hover:shadow-md transition-all cursor-pointer">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#111111] group-hover:bg-[#C8102E] flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[#C8102E] text-xs font-bold tracking-widest uppercase mb-2">{num}</p>
                  <h3 className="text-[#111111] font-bold text-lg mb-2 group-hover:text-[#C8102E] transition-colors">{title}</h3>
                  <p className="text-[#666666] text-sm leading-relaxed">{desc}</p>
                </div>
                <div className="flex-shrink-0 text-[#999999] text-sm font-medium">{duration}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-[#111111] mb-2">Never Miss an Episode</h2>
            <p className="text-[#666666] text-lg">Subscribe on your favourite podcast platform.</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-[#C8102E] text-white font-bold px-7 py-3.5 text-sm tracking-wide hover:bg-[#a50d26] transition-colors">
              Spotify
            </button>
            <button className="bg-[#111111] text-white font-bold px-7 py-3.5 text-sm tracking-wide hover:bg-[#333333] transition-colors">
              Apple Podcasts
            </button>
            <button className="border-2 border-[#111111] text-[#111111] font-bold px-7 py-3.5 text-sm tracking-wide hover:bg-[#111111] hover:text-white transition-colors">
              Google Podcasts
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
