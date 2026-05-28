import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import CourseFAQ from '@/components/course/CourseFAQ'
import RevealStagger from '@/components/motion/RevealStagger'
import {
  getCourseBySlug,
  getFirstLessonHref,
  getRequiredLessonCount,
  getTotalLessonCount,
  getTotalQuizCount,
} from '@/data/course'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type CoursePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    return pageMetadata({
      title: 'Course not found',
      description: 'The course you are looking for could not be found.',
      path: `/courses/${slug}`,
      noindex: true,
    })
  }

  return pageMetadata({
    title: course.title,
    description: course.subtitle,
    path: `/courses/${course.slug}`,
  })
}

export default async function CourseLandingPage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  // Session-aware CTA. We only read the user when Supabase is configured;
  // otherwise the page degrades to a safe, generic CTA.
  let isLoggedIn = false
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    isLoggedIn = !!user
  }

  const firstLessonHref = getFirstLessonHref(course)
  const totalLessons = getTotalLessonCount(course)
  const requiredLessons = getRequiredLessonCount(course)
  const totalQuizzes = getTotalQuizCount(course)

  const primaryCtaHref = isLoggedIn
    ? firstLessonHref
    : `/login?next=${encodeURIComponent(firstLessonHref)}`
  const primaryCtaLabel = isLoggedIn
    ? course.landing.hero.primaryCtaLabel
    : 'Sign in to start course'

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'The Singapore Way',
      sameAs: 'https://maherkaddoura.com/english',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      inLanguage: 'en',
    },
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#fbf5f2] border-b border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-5">{course.landing.hero.eyebrow}</p>
              <h1 className="text-3xl sm:text-4xl md:text-[44px] lg:text-5xl font-bold text-[#111111] leading-[1.12] tracking-[-0.01em] mb-6">
                {course.landing.hero.title}
              </h1>
              <span className="editorial-rule mb-7" aria-hidden="true" />
              <p className="lede mb-9 max-w-xl">{course.landing.hero.description}</p>
              <div className="flex flex-wrap gap-3">
                <Link href={primaryCtaHref} className="btn-pill">
                  {primaryCtaLabel}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <Link href={course.landing.hero.secondaryCtaHref} className="btn-pill-outline">
                  {course.landing.hero.secondaryCtaLabel}
                </Link>
              </div>
              <dl className="grid grid-cols-3 gap-6 mt-10 max-w-md">
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">
                    Modules
                  </dt>
                  <dd className="text-2xl font-bold text-[#111111] mt-1">
                    {course.modules.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">
                    Lessons
                  </dt>
                  <dd className="text-2xl font-bold text-[#111111] mt-1">{totalLessons}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">
                    Quizzes
                  </dt>
                  <dd className="text-2xl font-bold text-[#111111] mt-1">{totalQuizzes}</dd>
                </div>
              </dl>
            </div>
            <div className="lg:col-span-5">
              <div className="card-editorial p-8 md:p-10">
                <p className="eyebrow mb-4">Inside the course</p>
                <h2 className="text-xl md:text-2xl font-bold text-[#111111] leading-[1.25] mb-4">
                  {course.subtitle}
                </h2>
                <ul className="space-y-3 text-[15px] text-[#444444] leading-[1.65]">
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C8102E]"
                      aria-hidden="true"
                    />
                    {requiredLessons} required lessons across {course.modules.length} modules.
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C8102E]"
                      aria-hidden="true"
                    />
                    {totalQuizzes} multiple-choice quizzes with an 80% pass bar.
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C8102E]"
                      aria-hidden="true"
                    />
                    Progress saved as you go — pick up where you left off.
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C8102E]"
                      aria-hidden="true"
                    />
                    A web-based certificate with a public verification page.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book + course connection */}
      <section className="py-16 md:py-24 bg-white border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-4">{course.landing.bookConnection.eyebrow}</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]">
                {course.landing.bookConnection.title}
              </h2>
              <span className="editorial-rule mt-5" aria-hidden="true" />
            </div>
            <div className="lg:col-span-7">
              <p className="prose-body">{course.landing.bookConnection.body}</p>
              <div className="mt-7">
                <Link
                  href="/thebook"
                  className="link-arrow"
                >
                  Read about the book
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you will learn */}
      <section className="py-16 md:py-24 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 md:mb-14">
            <p className="eyebrow mb-4">What you will learn</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]">
              Four outcomes — clearly stated.
            </h2>
            <span className="editorial-rule mt-5" aria-hidden="true" />
          </div>
          <RevealStagger className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {course.landing.outcomes.map((o) => (
              <article key={o.title} className="card-editorial p-7 md:p-8">
                <h3 className="text-lg md:text-xl font-bold text-[#111111] leading-[1.3] mb-3">
                  {o.title}
                </h3>
                <p className="prose-body">{o.body}</p>
              </article>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Curriculum preview */}
      <section className="py-16 md:py-24 bg-white border-t border-[#ECECEC]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 md:mb-14">
            <p className="eyebrow mb-4">Curriculum</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]">
              {course.modules.length} modules. {totalLessons} lessons. {totalQuizzes} quizzes.
            </h2>
            <span className="editorial-rule mt-5" aria-hidden="true" />
          </div>
          <ol className="space-y-6">
            {course.modules.map((module, mi) => (
              <li
                key={module.slug}
                className="bg-white rounded-2xl border border-[#ECECEC] overflow-hidden"
              >
                <div className="px-6 md:px-8 pt-6 md:pt-7 pb-4 border-b border-[#F0F0F0]">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[11px] font-bold tracking-[0.14em] text-[#C8102E] uppercase">
                      Module {mi + 1}
                    </span>
                    <span className="text-[11px] tracking-[0.06em] text-[#888888] uppercase">
                      {module.lessons.length} lessons
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[#111111] leading-[1.3] mt-2">
                    {module.title}
                  </h3>
                  {module.description && (
                    <p className="prose-body mt-2 max-w-2xl">{module.description}</p>
                  )}
                </div>
                <ul className="divide-y divide-[#F0F0F0]">
                  {module.lessons.map((lesson, li) => (
                    <li
                      key={lesson.slug}
                      className="flex items-start gap-4 px-6 md:px-8 py-4"
                    >
                      <span className="flex-shrink-0 mt-0.5 text-[12px] font-bold tracking-[0.08em] text-[#888888] tabular-nums uppercase w-8">
                        {String(li + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="text-[15px] md:text-[16px] font-bold text-[#111111] leading-[1.35]">
                            {lesson.title}
                          </p>
                          {lesson.contentType === 'quiz' && (
                            <span className="inline-flex items-center text-[10px] font-bold tracking-[0.12em] text-[#C8102E] uppercase bg-[#C8102E]/10 rounded-full px-2.5 py-0.5">
                              Quiz
                            </span>
                          )}
                          {lesson.contentType === 'video' && (
                            <span className="inline-flex items-center text-[10px] font-bold tracking-[0.12em] text-[#111111] uppercase bg-[#F0F0F0] rounded-full px-2.5 py-0.5">
                              Video
                            </span>
                          )}
                        </div>
                        {lesson.description && (
                          <p className="text-[14px] text-[#666666] leading-[1.6] mt-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                      {typeof lesson.durationMinutes === 'number' && (
                        <span className="flex-shrink-0 text-[12px] text-[#888888] tabular-nums">
                          {lesson.durationMinutes} min
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-16 md:py-24 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 md:mb-14">
            <p className="eyebrow mb-4">Who this is for</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]">
              Built for people who want to do something with what they learn.
            </h2>
            <span className="editorial-rule mt-5" aria-hidden="true" />
          </div>
          <RevealStagger className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {course.landing.audience.map((a) => (
              <article key={a.title} className="card-editorial p-7 md:p-8">
                <h3 className="text-lg md:text-xl font-bold text-[#111111] leading-[1.3] mb-3">
                  {a.title}
                </h3>
                <p className="prose-body">{a.body}</p>
              </article>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* How the course works */}
      <section className="py-16 md:py-24 bg-white border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 md:mb-14">
            <p className="eyebrow mb-4">How it works</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]">
              Simple format. Real method.
            </h2>
            <span className="editorial-rule mt-5" aria-hidden="true" />
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {course.landing.howItWorks.map((step, i) => (
              <li
                key={step.title}
                className="card-editorial p-7 md:p-8 flex flex-col h-full"
              >
                <span
                  className="text-[11px] font-bold tracking-[0.14em] text-[#C8102E] uppercase mb-4"
                  aria-hidden="true"
                >
                  Step {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-[#111111] leading-[1.3] mb-3">
                  {step.title}
                </h3>
                <p className="prose-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Quiz + Certificate */}
      <section className="py-16 md:py-24 bg-[#111111] text-white border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#F5A6B2] mb-5">
                {course.landing.quizAndCertificate.eyebrow}
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-[1.15] tracking-[-0.01em]">
                {course.landing.quizAndCertificate.title}
              </h2>
              <span
                className="block w-10 h-[3px] bg-[#C8102E] rounded-full mt-5"
                aria-hidden="true"
              />
            </div>
            <div className="lg:col-span-7">
              <p className="text-[17px] md:text-[18px] text-[#BBBBBB] leading-[1.7]">
                {course.landing.quizAndCertificate.body}
              </p>
              <ul className="mt-7 space-y-3 text-[15px] md:text-[16px] text-white leading-[1.65]">
                {course.landing.quizAndCertificate.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      className="mt-2.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C8102E]"
                      aria-hidden="true"
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor / Authority */}
      <section className="py-16 md:py-24 bg-white border-t border-[#ECECEC]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="card-editorial p-8 md:p-12">
            <p className="eyebrow mb-4">{course.landing.authority.eyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mb-2">
              {course.landing.authority.name}
            </h2>
            <p className="text-[14px] font-bold tracking-[0.06em] text-[#666666] uppercase mb-5">
              {course.landing.authority.title}
            </p>
            <span className="editorial-rule mb-7" aria-hidden="true" />
            <p className="prose-body max-w-2xl">{course.landing.authority.bio}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-10 md:mb-12">
            <p className="eyebrow mb-4">FAQ</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]">
              Questions, answered.
            </h2>
            <span className="editorial-rule mt-5" aria-hidden="true" />
          </div>
          <CourseFAQ faqs={course.landing.faq} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-white border-t border-[#ECECEC]">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="card-editorial p-8 md:p-12 text-center">
            <p className="eyebrow mb-4">{course.landing.finalCta.eyebrow}</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em] mb-5">
              {course.landing.finalCta.title}
            </h2>
            <span className="editorial-rule mx-auto mb-7" aria-hidden="true" />
            <p className="lede mb-9 max-w-xl mx-auto">{course.landing.finalCta.body}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={primaryCtaHref} className="btn-pill">
                {isLoggedIn ? course.landing.finalCta.primaryLabel : 'Sign in to start course'}
              </Link>
              {!isLoggedIn && (
                <Link
                  href={`/signup?next=${encodeURIComponent(firstLessonHref)}`}
                  className="btn-pill-outline"
                >
                  Create account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
    </div>
  )
}
