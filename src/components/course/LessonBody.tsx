import type { CourseLessonPreview } from '@/lib/course/types'
import { parseYouTubeId, youTubeEmbedUrl } from '@/lib/course/youtube'

type LessonBodyProps = {
  lesson: CourseLessonPreview
}

export default function LessonBody({ lesson }: LessonBodyProps) {
  if (lesson.contentType === 'quiz') {
    return (
      <div className="card-editorial p-7 md:p-10">
        <p className="eyebrow mb-4">Quiz</p>
        <h3 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-3">
          A short check on what you just learned.
        </h3>
        <p className="prose-body mb-6">
          {lesson.description ?? 'This lesson is a multiple-choice quiz.'}
        </p>
        <p className="text-[13px] text-[#888888]">
          Quizzes are multiple-choice with an 80% pass bar. You will have unlimited retries.
        </p>
      </div>
    )
  }

  if (lesson.contentType === 'video') {
    const videoId = lesson.videoUrl ? parseYouTubeId(lesson.videoUrl) : null
    return (
      <div className="space-y-6">
        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#222222] bg-[radial-gradient(circle_at_30%_30%,#222222_0%,#111111_60%)] flex items-center justify-center text-white relative">
          {videoId ? (
            <iframe
              src={youTubeEmbedUrl(videoId)}
              title={`${lesson.title} — video lesson`}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-center px-6">
              <span
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
                aria-hidden="true"
              >
                <svg className="w-7 h-7 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <p className="text-[15px] font-bold tracking-[0.02em] text-white">
                Video unavailable. Please report this lesson so we can restore it.
              </p>
              <p className="text-[13px] text-[#BBBBBB] max-w-sm leading-[1.6]">
                The lesson notes below cover the same ground.
              </p>
            </div>
          )}
        </div>
        {lesson.content && (
          <div className="prose-body space-y-5 max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase mb-1">
              Lesson notes
            </p>
            {splitParagraphs(lesson.content).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!lesson.content) {
    return (
      <div className="card-editorial p-7 md:p-10">
        <p className="prose-body">
          Lesson content is being finalised. Check back shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="prose-body space-y-5 max-w-2xl">
      {splitParagraphs(lesson.content).map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  )
}

function splitParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}
