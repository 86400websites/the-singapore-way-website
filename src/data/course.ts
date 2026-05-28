import type { Course } from '@/lib/course/types'

export const COURSE_SLUG = 'the-singapore-way'

const courses: Course[] = [
  {
    slug: COURSE_SLUG,
    title: 'The Singapore Way Companion Course',
    subtitle: 'A practical guided course to apply the ideas from the book.',
    description:
      'A focused, web-based sample course that walks through the principles in the book and helps you turn them into a plan for your own country, city, organisation, or team.',
    status: 'published',
    modules: [
      {
        slug: 'foundations',
        title: 'Foundations — Method, not Miracle',
        description:
          'Reset your mental model. Singapore is not a miracle to admire — it is a method to learn from.',
        lessons: [
          {
            slug: 'welcome',
            title: 'Welcome — Why Singapore matters now',
            description: 'How to get the most out of this course and the book it accompanies.',
            contentType: 'text',
            durationMinutes: 6,
            isRequired: true,
            content:
              'Welcome to the companion course. This first lesson sets the table: what to expect, how to pace yourself, and how the course is built to work alongside the book.',
          },
          {
            slug: 'method-not-miracle',
            title: 'The mindset shift: Method, not Miracle',
            description: 'A short video lesson — the single idea that unlocks every other lesson.',
            contentType: 'video',
            videoUrl: null,
            durationMinutes: 12,
            isRequired: true,
            content:
              'Singapore is widely admired and frequently misunderstood. The headline story treats it as a miracle. This lesson reframes it as a method — a set of repeatable choices that produced repeatable results.',
          },
          {
            slug: 'foundations-quiz',
            title: 'Foundations check',
            description: 'A short quiz to make sure the foundations are clear before you go further.',
            contentType: 'quiz',
            durationMinutes: 5,
            isRequired: true,
            content: null,
          },
        ],
      },
      {
        slug: 'the-pillars',
        title: 'The Pillars',
        description:
          'Five principles that show up across housing, water, education, and governance — and how they reinforce one another.',
        lessons: [
          {
            slug: 'long-term-thinking',
            title: 'Long-term thinking over short-term wins',
            description: 'Why Singapore plans in decades, and what that looks like in practice.',
            contentType: 'text',
            durationMinutes: 14,
            isRequired: true,
            content:
              'Long-term thinking is not slogan — it is a discipline of sequencing, compounding, and patience that shows up in housing, water, and talent policy.',
          },
          {
            slug: 'trust-and-governance',
            title: 'Trust, governance, and a meritocratic state',
            description: 'How honest institutions and clear rules compound over time.',
            contentType: 'text',
            durationMinutes: 16,
            isRequired: true,
            content:
              "Singapore's institutions are not perfect. They are honest enough that citizens and capital can plan around them. This lesson examines the trade-offs and what to copy.",
          },
          {
            slug: 'systems-thinking',
            title: 'Systems thinking: housing, water, talent',
            description: 'Three case studies that show one operating system at work.',
            contentType: 'text',
            durationMinutes: 18,
            isRequired: true,
            content:
              'Three case studies — housing, water, and talent — show how a small set of principles, applied consistently, generated a coherent operating system.',
          },
          {
            slug: 'pillars-quiz',
            title: 'Pillars check',
            description: 'A short quiz on the five principles and how they connect.',
            contentType: 'quiz',
            durationMinutes: 7,
            isRequired: true,
            content: null,
          },
        ],
      },
      {
        slug: 'adapt-dont-copy',
        title: "Adapt — don't copy",
        description:
          "Borrow the root, not the fruit. A simple framework for adapting Singapore's method to your context.",
        lessons: [
          {
            slug: 'borrow-the-root',
            title: 'Borrow the root, not the fruit',
            description: 'Why copying policies fails — and what to copy instead.',
            contentType: 'text',
            durationMinutes: 12,
            isRequired: true,
            content:
              "Copying Singapore's outputs is a category error. The transferable layer is the underlying reasoning — the \"root\" — not the surface policy (\"fruit\").",
          },
          {
            slug: 'adaptation-playbook',
            title: 'A simple adaptation playbook',
            description: 'A four-step playbook you can use this week.',
            contentType: 'text',
            durationMinutes: 14,
            isRequired: true,
            content:
              'A four-step playbook: name the principle, audit your context, define the smallest viable intervention, and design for honest measurement.',
          },
          {
            slug: 'adaptation-quiz',
            title: 'Adaptation check',
            description: 'A short quiz to lock in the playbook before you apply it.',
            contentType: 'quiz',
            durationMinutes: 6,
            isRequired: true,
            content: null,
          },
        ],
      },
      {
        slug: 'apply-at-home',
        title: 'Apply at home',
        description:
          'Turn the framework into a one-page case for change — for your country, your city, your organisation, or your team.',
        lessons: [
          {
            slug: 'build-your-case',
            title: 'Build your case for change',
            description: 'A guided exercise to draft a one-page case using the framework.',
            contentType: 'text',
            durationMinutes: 18,
            isRequired: true,
            content:
              'A guided exercise that produces a one-page case for change you can take to a stakeholder, a board, or a class.',
          },
          {
            slug: 'final-reflection',
            title: 'Final reflection and certificate',
            description:
              'A short reflection to close the course. Complete the required lessons and quizzes to earn your certificate.',
            contentType: 'text',
            durationMinutes: 8,
            isRequired: true,
            content:
              'A short reflection on what changed in your thinking. Once you have completed the required lessons and passed every required quiz, your certificate will be issued.',
          },
        ],
      },
    ],
    landing: {
      hero: {
        eyebrow: 'Online Course',
        title: 'The companion course to The Singapore Way.',
        description:
          'A focused, web-based course that turns the book into a method you can use. Twelve lessons, three quizzes, one certificate — built to help you apply the framework, not just read about it.',
        primaryCtaLabel: 'Start the course',
        secondaryCtaLabel: 'Read about the book',
        secondaryCtaHref: '/thebook',
      },
      bookConnection: {
        eyebrow: 'Book + Course',
        title: 'Designed to be taken alongside the book.',
        body: 'The book gives you the framework in 17 focused chapters. The course turns that framework into a practical method — with short lessons, multiple-choice quizzes that check your understanding, and a guided exercise that produces a one-page case for change in your own context.',
      },
      outcomes: [
        {
          title: 'See the method behind the miracle',
          body:
            "Move past the headline story of Singapore and into the principles, institutions, and trade-offs that actually produced its results.",
        },
        {
          title: 'Apply five reusable principles',
          body:
            'Long-term thinking, honest institutions, meritocratic talent, systems design, and pragmatic adaptation — explained in plain language with case studies.',
        },
        {
          title: 'Adapt, don’t copy',
          body:
            "Use a simple playbook to translate Singapore's method to your own country, city, organisation, or team — without pretending you are Singapore.",
        },
        {
          title: 'Leave with a one-page case for change',
          body:
            'A guided final exercise turns what you have learned into a one-page document you can take to a stakeholder, a board, or a class.',
        },
      ],
      audience: [
        {
          title: 'Government and policy leaders',
          body:
            'You want a clear, honest framework to pilot reforms that hold up beyond a single election cycle.',
        },
        {
          title: 'Educators and program leads',
          body:
            'You want a coherent way to teach systems thinking and long-term governance without resorting to slogans.',
        },
        {
          title: 'Founders and operators',
          body:
            'You want to apply Singapore-style discipline — long-term thinking, honest measurement, real institutions — to the organisation you are building.',
        },
        {
          title: 'Curious citizens',
          body:
            'You read the book and want a structured way to think harder about what it would mean for your own country.',
        },
      ],
      howItWorks: [
        {
          title: 'Move at your own pace',
          body:
            'Short lessons grouped into four modules. Read, watch, reflect — there is no timer and no drip schedule.',
        },
        {
          title: 'Check your understanding',
          body:
            'Each module ends with a multiple-choice quiz. Pass at 80% to unlock the next stage, with unlimited retries.',
        },
        {
          title: 'Track your progress',
          body:
            'A simple progress indicator follows you through the course. Pick up exactly where you left off.',
        },
        {
          title: 'Earn a verifiable certificate',
          body:
            'Finish the required lessons and quizzes and receive a web-based certificate with a public verification page.',
        },
      ],
      quizAndCertificate: {
        eyebrow: 'Quizzes and Certificate',
        title: 'Pass the quizzes. Earn the certificate.',
        body:
          'The course uses short multiple-choice quizzes to check that the ideas have actually landed. They are designed to be helpful, not punitive — you have unlimited retries, and the passing bar is the same for every learner.',
        bullets: [
          'Multiple-choice questions with one correct answer.',
          'Passing score: 80%.',
          'Unlimited retries — your latest passing attempt counts.',
          "Finish the required lessons and quizzes to earn a web-based certificate that anyone can verify by code.",
        ],
      },
      authority: {
        eyebrow: 'Your instructor',
        name: 'Maher Kaddoura',
        title: 'Author, The Singapore Way',
        bio:
          "Maher Kaddoura is the author of The Singapore Way and the founder of 86400 Studio. The course is built on the same fieldwork, interviews, and case studies that produced the book — and on years of work with leaders applying Singapore's method outside Singapore.",
      },
      faq: [
        {
          question: 'Do I need to have read the book first?',
          answer:
            'No. The course stands on its own. Most learners take it alongside the book because the two reinforce each other — the book provides depth, the course provides method and practice.',
        },
        {
          question: 'How long does the course take?',
          answer:
            'About three to four focused hours end-to-end, depending on how deep you go on the final exercise. You can spread that across as many sessions as you like.',
        },
        {
          question: 'How do I get access?',
          answer:
            'Create a free account or sign in. Any signed-in learner can access the course player, take the quizzes, save progress, and earn the certificate. There is no manual enrollment step.',
        },
        {
          question: 'Is there a payment to take the course?',
          answer:
            'Not in this first release. The course is offered as a companion to the book during the MVP. Pricing and bundling decisions will come after we have a stable learner experience.',
        },
        {
          question: 'How do quizzes work?',
          answer:
            "Each module ends with a short multiple-choice quiz. There is one correct answer per question. You need 80% to pass, and you can retry as many times as you need. Your latest passing attempt is what counts toward the certificate.",
        },
        {
          question: 'What does the certificate prove?',
          answer:
            "It confirms that you completed the required lessons and passed every required quiz. Anyone can verify it through a public verification page using the certificate's code — without seeing your private progress.",
        },
        {
          question: 'Will there be a PDF or LinkedIn share button?',
          answer:
            'Not in this first release. The certificate is web-based with a public verification URL. Downloadable formats and share buttons may come later.',
        },
      ],
      finalCta: {
        eyebrow: 'Ready to start',
        title: 'Method, not Miracle — start today.',
        body:
          'Create a free account or sign in. The first lesson is waiting on the other side.',
        primaryLabel: 'Start the course',
      },
    },
  },
]

export function getAllCourses(): Course[] {
  return courses
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug && c.status === 'published')
}

export function getFirstLessonHref(course: Course): string {
  const firstModule = course.modules[0]
  const firstLesson = firstModule?.lessons[0]
  if (!firstLesson) return `/courses/${course.slug}`
  return `/courses/${course.slug}/learn/${firstLesson.slug}`
}

export function getTotalLessonCount(course: Course): number {
  return course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
}

export function getRequiredLessonCount(course: Course): number {
  return course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.isRequired).length,
    0,
  )
}

export function getTotalQuizCount(course: Course): number {
  return course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.contentType === 'quiz').length,
    0,
  )
}
