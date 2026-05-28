import type { CourseLessonPreview } from '@/lib/course/types'

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
          {lesson.description ??
            'This lesson is a multiple-choice quiz. The quiz interface is being prepared and will be available here soon.'}
        </p>
        <p className="text-[13px] text-[#888888]">
          Quizzes are multiple-choice with an 80% pass bar. You will have unlimited retries.
        </p>
      </div>
    )
  }

  if (lesson.contentType === 'video') {
    return (
      <div className="space-y-6">
        <div className="aspect-video w-full rounded-2xl bg-[#111111] flex items-center justify-center text-white">
          {lesson.videoUrl ? (
            <p className="text-sm text-[#BBBBBB]">Video player will render here.</p>
          ) : (
            <p className="text-sm text-[#BBBBBB]">Video coming soon.</p>
          )}
        </div>
        {lesson.content && (
          <div className="prose-body space-y-5">
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
    <div className="prose-body space-y-5">
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
