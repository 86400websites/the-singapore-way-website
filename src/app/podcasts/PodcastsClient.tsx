'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import PageHero from '@/components/PageHero'

interface Episode {
  num: string
  title: string
  duration: string
  audio: string
}

const episodes: Episode[] = [
  { num: '01', title: 'What Is The Singapore Way', duration: '06:04', audio: 'https://static.wixstatic.com/mp3/d1daaa_dc8aba81c5dd4d25bd30d008d6d64f48.mp3' },
  { num: '02', title: 'Bridging Singapore to the World', duration: '05:13', audio: 'https://static.wixstatic.com/mp3/d1daaa_70f0bca943864a8b8a3c438fc5aece0b.mp3' },
  { num: '03', title: "Adapting Singapore's Principles Globally", duration: '12:30', audio: 'https://static.wixstatic.com/mp3/d1daaa_e61b008c78ae4ba88ad72eb10a2ee892.mp3' },
  { num: '04', title: 'How Singapore Solved Its Housing Crisis', duration: '13:38', audio: 'https://static.wixstatic.com/mp3/d1daaa_0f0b6a2d68fd4ee0adf52b5fd8cfbcb7.mp3' },
  { num: '05', title: 'Building Through Meritocracy', duration: '11:41', audio: 'https://static.wixstatic.com/mp3/d1daaa_30098956aa984278b00f38d19f70350e.mp3' },
  { num: '06', title: "Nations that have Adapted Singapore's Development Model", duration: '06:06', audio: 'https://static.wixstatic.com/mp3/d1daaa_db4bfb65d1b042d5981aa45d3f0b2b83.mp3' },
  { num: '07', title: 'Teaching The Singapore Way', duration: '05:03', audio: 'https://static.wixstatic.com/mp3/d1daaa_8ab5992955c94178baa08445dd8b287a.mp3' },
  { num: '08', title: 'Beyond Singapore — Adaptation Not Imitation', duration: '13:38', audio: 'https://static.wixstatic.com/mp3/d1daaa_2d54fb0d5d2b4c0995201678f0bf00c6.mp3' },
]

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PodcastsClient() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const current = currentIndex !== null ? episodes[currentIndex] : null

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration) {
        setDuration(audio.duration)
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }
    const onLoaded = () => {
      if (audio.duration) setDuration(audio.duration)
    }
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentIndex((i) => (i !== null && i < episodes.length - 1 ? i + 1 : i))
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || currentIndex === null) return
    audio.src = episodes[currentIndex].audio
    audio.play().catch(() => setIsPlaying(false))
  }, [currentIndex])

  const selectEpisode = (i: number) => {
    if (currentIndex === i) {
      togglePlay()
      return
    }
    setCurrentIndex(i)
    setProgress(0)
    setCurrentTime(0)
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (currentIndex === null) {
      setCurrentIndex(0)
      return
    }
    if (audio.paused) audio.play().catch(() => setIsPlaying(false))
    else audio.pause()
  }

  const playNext = () => {
    if (currentIndex === null) {
      setCurrentIndex(0)
      return
    }
    setCurrentIndex((i) => (i !== null && i < episodes.length - 1 ? i + 1 : 0))
  }

  const playPrev = () => {
    if (currentIndex === null) {
      setCurrentIndex(0)
      return
    }
    setCurrentIndex((i) => (i !== null && i > 0 ? i - 1 : episodes.length - 1))
  }

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const v = Number(e.target.value)
    audio.currentTime = (v / 100) * audio.duration
    setProgress(v)
  }

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Podcast"
        title="Learn The Singapore Way, in your ear."
        description="In-depth conversations on the ideas, innovations, and trade-offs behind Singapore's rise."
        align="left"
        variant="light"
        image="/assets/learn/podcast.png"
        imageAlt="Editorial illustration representing The Singapore Way podcast"
        priority
      />

      <section className="py-16 md:py-20 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Show header card */}
          <div className="card-editorial p-6 md:p-8 mb-6 flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-[#ECECEC]">
              <Image
                src="/assets/learn/podcast.png"
                alt="The Singapore Way Podcast"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="eyebrow mb-3">The Series</p>
              <h2 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-3">
                Learn the Singapore Way
              </h2>
              <p className="text-[15px] text-[#666666] leading-[1.65] mb-3">
                Join us for in-depth dives into the ideas and innovations behind Singapore's rise.
              </p>
              <p className="text-[12px] text-[#888888] mb-5">Updated 2025 · {episodes.length} Episodes</p>
              <button
                onClick={() => selectEpisode(0)}
                className="btn-pill"
                type="button"
              >
                Let's Begin
              </button>
            </div>
          </div>

          {/* Now playing bar */}
          <div className="card-editorial p-4 md:p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg border border-[#ECECEC] overflow-hidden flex-shrink-0 bg-[#F5F5F5] flex items-center justify-center">
                <Image src="/assets/logo/logo-red.png" alt="" width={28} height={28} className="w-7 h-7 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#111111] font-bold truncate">
                  {current ? current.title : 'Select an episode to start listening'}
                </p>
                <p className="text-[11px] text-[#888888] mt-0.5 tracking-[0.06em] uppercase">
                  {current ? `Episode ${current.num} · ${current.duration}` : 'The Singapore Way'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#888888] flex-shrink-0">
              <button
                onClick={playPrev}
                className="hover:text-[#111111] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous episode"
                disabled={currentIndex === null}
                type="button"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-[#C8102E] text-white flex items-center justify-center hover:bg-[#a50d26] transition-colors shadow-sm"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                type="button"
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
                ) : (
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <button
                onClick={playNext}
                className="hover:text-[#111111] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next episode"
                disabled={currentIndex === null}
                type="button"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8l-5.5 4zM18 6h2v12h-2z"/></svg>
              </button>
            </div>
          </div>

          {/* Seek + time */}
          {current && (
            <div className="card-editorial px-5 md:px-6 py-4 mb-6 flex items-center gap-4">
              <span className="text-[12px] text-[#888888] tabular-nums w-10 flex-shrink-0">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress}
                onChange={onSeek}
                aria-label="Seek"
                className="flex-1 h-1 accent-[#C8102E] cursor-pointer"
              />
              <span className="text-[12px] text-[#888888] tabular-nums w-10 flex-shrink-0 text-right">{formatTime(duration)}</span>
            </div>
          )}

          {/* Episode list */}
          <div className="card-editorial overflow-hidden">
            {episodes.map((ep, i) => (
              <button
                key={ep.num}
                onClick={() => selectEpisode(i)}
                type="button"
                className={`w-full flex items-center gap-4 sm:gap-5 py-4 px-5 sm:px-7 text-left transition-colors ${
                  i !== episodes.length - 1 ? 'border-b border-[#F0F0F0]' : ''
                } ${currentIndex === i ? 'bg-[#fbf5f2]' : 'hover:bg-[#FAFAFA]'}`}
              >
                <span className={`text-[13px] font-bold w-7 flex-shrink-0 tabular-nums tracking-[0.06em] ${currentIndex === i ? 'text-[#C8102E]' : 'text-[#BBBBBB]'}`}>
                  {ep.num}
                </span>
                <span className={`flex-1 text-[15px] leading-[1.4] ${currentIndex === i ? 'text-[#C8102E] font-bold' : 'text-[#111111]'}`}>
                  {ep.title}
                </span>
                <span className="text-[12px] text-[#888888] flex-shrink-0 tabular-nums">{ep.duration}</span>
                <span className={`flex-shrink-0 transition-colors ${currentIndex === i ? 'text-[#C8102E]' : 'text-[#DDDDDD]'}`} aria-hidden="true">
                  {currentIndex === i && isPlaying ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </span>
              </button>
            ))}
          </div>

          <audio ref={audioRef} preload="none" />

        </div>
      </section>
    </div>
  )
}
