export type CourseLessonContentType = 'text' | 'video' | 'quiz'

export type CourseLessonPreview = {
  // DB UUID when sourced from Supabase. Undefined in local-data fallback mode.
  id?: string
  slug: string
  title: string
  description?: string
  contentType: CourseLessonContentType
  durationMinutes?: number
  isRequired: boolean
  // Lesson body. Plain prose for text lessons; null for quiz lessons.
  content?: string | null
  videoUrl?: string | null
}

export type CourseModulePreview = {
  id?: string
  slug: string
  title: string
  description?: string
  lessons: CourseLessonPreview[]
}

export type CourseFaq = {
  question: string
  answer: string
}

export type CourseLandingCopy = {
  hero: {
    eyebrow: string
    title: string
    description: string
    primaryCtaLabel: string
    secondaryCtaLabel: string
    secondaryCtaHref: string
  }
  bookConnection: {
    eyebrow: string
    title: string
    body: string
  }
  outcomes: {
    title: string
    body: string
  }[]
  audience: {
    title: string
    body: string
  }[]
  howItWorks: {
    title: string
    body: string
  }[]
  quizAndCertificate: {
    eyebrow: string
    title: string
    body: string
    bullets: string[]
  }
  authority: {
    eyebrow: string
    name: string
    title: string
    bio: string
  }
  faq: CourseFaq[]
  finalCta: {
    eyebrow: string
    title: string
    body: string
    primaryLabel: string
  }
}

export type Course = {
  id?: string
  slug: string
  title: string
  subtitle: string
  description: string
  status: 'draft' | 'published'
  modules: CourseModulePreview[]
  landing: CourseLandingCopy
}
