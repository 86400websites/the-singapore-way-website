import type { Course } from '@/lib/course/types'

export const COURSE_SLUG = 'the-singapore-way'

const courses: Course[] = [
  {
    slug: COURSE_SLUG,
    title: 'The Singapore Way Online Course',
    subtitle: '15 guiding principles for building systems that work.',
    description:
      'A practical 16-video course for leaders, policymakers, educators, and changemakers who want to turn values, trust, systems thinking, and long-term leadership into action in their own context.',
    status: 'published',
    modules: [
      {
        slug: 'purpose-constraints-and-pragmatism',
        title: 'Purpose, Constraints, and Pragmatism',
        description:
          'Begin with the right mental model: use Singapore as an example, build on values, work with real constraints, and choose evidence over ego.',
        lessons: [
          {
            slug: 'start-here',
            title: 'Start Here — The Bridge from Singapore to You',
            description:
              'Welcome to The Singapore Way. In this introduction, discover how Singapore’s experience can serve as a practical toolkit for changemakers, leaders, educators, and policymakers. Learn how the course’s 15 guiding principles can help you build better systems, adapt ideas to your local context, and turn vision into action.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/tVoscHU9Qas',
            isRequired: true,
            content:
              'Core idea: Singapore is not the destination or a model to copy. It is a practical example that helps learners examine how values, systems, trust, and disciplined execution can be adapted to their own context.\n\nSingapore example: The course uses Singapore’s experience as a toolkit rather than a tribute. Each principle is presented with a question: what would this look like in your country, city, ministry, school, organisation, or team?\n\nApply it: Choose one system you want to improve. Write down who it serves, what is currently failing, and what a better result would look like in everyday life.',
          },
          {
            slug: 'build-on-values-not-just-vision',
            title: 'Build on Values, Not Just Vision',
            description:
              'Can a nation succeed without shared values? In this episode of The Singapore Way, explore why lasting progress starts with principles, not just plans. Discover how values like integrity, unity, and trust helped shape Singapore’s transformation—and how leaders can apply the same lesson to build stronger, more resilient societies.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/lUHOOGJ-9HQ',
            isRequired: true,
            content:
              'Core idea: Vision describes where you want to go. Values determine how people behave while getting there. Without shared principles, plans become fragile and public trust erodes.\n\nSingapore example: Singapore treated discipline, integrity, racial harmony, and clean government as operating principles that informed laws, budgets, institutions, and daily choices.\n\nApply it: Before proposing a policy or programme, name the values it must express. Test whether the design would still feel fair and credible after a change in leadership.',
          },
          {
            slug: 'turn-constraints-into-strength',
            title: 'Turn Constraints into Strength',
            description:
              'What if your greatest limitation could become your greatest advantage? In this episode of The Singapore Way, discover how constraints can drive innovation, sharpen focus, and inspire smarter solutions. Learn how Singapore transformed scarcity into strength—and how leaders can turn challenges into opportunities for progress.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/Hh-QgSDPj-k',
            isRequired: true,
            content:
              'Core idea: Constraints are not an excuse to delay action. Naming them clearly can sharpen priorities, force better design, and reveal where limited resources will have the greatest effect.\n\nSingapore example: Singapore responded to shortages of land, water, and natural resources by building vertically, investing in water technology, and developing human capital.\n\nApply it: Name your most important constraint without softening it. Then identify one design choice that turns that limitation into focus, discipline, or innovation.',
          },
          {
            slug: 'lead-with-pragmatism-not-ego',
            title: 'Lead with Pragmatism, Not Ego',
            description:
              'Should leaders focus on ideology—or results? In this episode of The Singapore Way, explore why pragmatism is one of the most powerful tools in leadership. Learn how Singapore prioritized solutions over politics, tested what worked, and built progress through evidence, adaptability, and a relentless focus on results.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/EXvZ0eBH5P0',
            isRequired: true,
            content:
              'Core idea: Pragmatism means putting evidence, outcomes, and learning ahead of ego, ideology, or the need to appear right.\n\nSingapore example: Singapore tested policies, used public-private partnerships where they made sense, and changed approaches when evidence showed that something was not working.\n\nApply it: Identify one debate that is stuck in ideology or pride. Reframe it around the result citizens need, the evidence available, and the smallest test that could reduce uncertainty.',
          },
          {
            slug: 'purpose-constraints-pragmatism-quiz',
            title: 'Foundations in action',
            description:
              'Five questions on the course purpose, values, constraints, and pragmatic leadership.',
            contentType: 'quiz',
            isRequired: true,
            content: null,
          },
        ],
      },
      {
        slug: 'systems-capital-and-discipline',
        title: 'Systems, Capital, and Daily Discipline',
        description:
          'Turn plans into delivery systems, build economic confidence from within, and make strategy a repeated operating practice.',
        lessons: [
          {
            slug: 'build-systems-that-solve-not-plans-that-impress',
            title: 'Build Systems That Solve, Not Just Plans That Impress',
            description:
              'Why do so many ambitious plans fail to create real change? In this episode of The Singapore Way, discover why lasting progress depends on strong systems, not just bold strategies. Learn how Singapore connected planning, execution, and accountability to turn vision into results—and how leaders can build systems that deliver real impact.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/YMkJiS48CGU',
            isRequired: true,
            content:
              'Core idea: A plan is a promise; a system is the machinery that repeatedly delivers the result. Systems clarify ownership, resources, measurement, maintenance, and feedback.\n\nSingapore example: Singapore connected planning, execution, and maintenance through lead agencies, accountable owners, and feedback loops.\n\nApply it: Take one current plan and write down who owns delivery, how progress is measured, what happens when performance slips, and who maintains the result after launch.',
          },
          {
            slug: 'grow-capital-locally',
            title: 'Don’t Just Attract Capital — Grow It Locally',
            description:
              'Why do some nations build lasting prosperity while others remain dependent on outside funding? In this episode of The Singapore Way, explore why local trust is the foundation of economic independence. Learn how Singapore grew wealth from within by building confidence, encouraging savings, and creating systems that empowered citizens to invest in their own future.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/ZZkbYyO8Co4',
            isRequired: true,
            content:
              'Core idea: Local capital is not only money. It is confidence that savings are safe, contracts will be honoured, rules will be applied fairly, and investments can grow at home.\n\nSingapore example: Singapore built domestic trust and used long-term savings to invest in housing, healthcare, infrastructure, and human capacity.\n\nApply it: Assess what prevents citizens or local businesses from investing at home. Focus on one trust barrier—such as transparency, access to credit, contract enforcement, or predictable rules.',
          },
          {
            slug: 'strategy-is-a-daily-discipline',
            title: 'Strategy Isn’t a Document — It’s a Daily Discipline',
            description:
              'Why do so many strategies fail to create lasting change? In this episode of The Singapore Way, discover why progress depends on daily discipline, not just ambitious plans. Learn how Singapore turned strategy into a culture of continuous learning, adaptation, and accountability—and how leaders can build momentum through consistency and focus.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/dl4GwF9QDbo',
            isRequired: true,
            content:
              'Core idea: Strategy lives in repeated decisions, follow-up, adaptation, and honest review. A document that is not used to guide daily work is not a functioning strategy.\n\nSingapore example: Singapore planned for decades while reviewing performance continuously, scaling what worked, and correcting what failed.\n\nApply it: Define a practical review rhythm for one priority: what will be checked, by whom, how often, and what evidence will trigger a course correction?',
          },
          {
            slug: 'systems-capital-discipline-quiz',
            title: 'Systems and capacity check',
            description:
              'Five questions on delivery systems, local capital, trust, and strategy as a daily discipline.',
            contentType: 'quiz',
            isRequired: true,
            content: null,
          },
        ],
      },
      {
        slug: 'trust-integrity-and-long-term-leadership',
        title: 'Trust, Integrity, and Long-Term Leadership',
        description:
          'Earn trust through service, design corruption out of institutions, and build reforms that survive beyond one political term.',
        lessons: [
          {
            slug: 'build-trust-before-you-build-policy',
            title: 'Build Trust Before You Build Policy',
            description:
              'Why do so many reforms fail despite good intentions? In this episode of The Singapore Way, discover why trust is the foundation of every successful policy and institution. Learn how Singapore built credibility through integrity, accountability, and consistent service—and why lasting transformation begins with earning the confidence of the people.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/DhZjaFhv3LM',
            isRequired: true,
            content:
              'Core idea: Trust is earned through what citizens experience: dignity, consistency, service, fairness, and accountability. It cannot be created by branding or speeches.\n\nSingapore example: Singapore built credibility when institutions delivered, rules were enforced, leaders modelled integrity, and mistakes were faced rather than hidden.\n\nApply it: Map one citizen interaction with your system. Identify the moment where trust is most likely to be gained or lost, and redesign that moment.',
          },
          {
            slug: 'keep-corruption-out-by-design',
            title: 'Keep Corruption Out by Design, Not Just Hope',
            description:
              'Why do corruption problems persist even when leaders promise change? In this episode of The Singapore Way, explore why integrity must be built into the system itself. Learn how transparency, accountability, and strong institutional design can prevent corruption before it starts—and create the trust needed for long-term progress.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/E5TXUTQ_uAg',
            isRequired: true,
            content:
              'Core idea: Corruption is often a predictable output of opaque decisions, weak oversight, inconsistent rules, and incentives that reward loyalty over competence.\n\nSingapore example: Singapore used independent audits, transparent procurement, conflict-of-interest rules, traceable decisions, and consistent enforcement.\n\nApply it: Choose one decision involving money, contracts, hiring, or permissions. Make the decision path visible: criteria, approver, evidence, record, oversight, and appeal.',
          },
          {
            slug: 'think-beyond-your-term',
            title: 'Think Beyond Your Term — Plan for the Next Generation',
            description:
              'Why do some reforms endure while others disappear with the next administration? In this episode of The Singapore Way, explore the power of long-term thinking and why true leadership is measured by what lasts beyond a single term. Learn how Singapore built institutions and systems designed to serve future generations—and how leaders can create legacies that outlive them.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/e0529zpg1Jk',
            isRequired: true,
            content:
              'Core idea: Leadership is not only about finishing projects during one term. It is about building institutions, capabilities, and continuity that continue to serve people after leadership changes.\n\nSingapore example: Singapore’s education, housing, and transport systems evolved over decades instead of restarting with every administration.\n\nApply it: Test one proposed initiative against a twenty-year horizon. Ask what institution, funding model, capability, and public value must remain after its original sponsor leaves.',
          },
          {
            slug: 'trust-integrity-long-term-quiz',
            title: 'Trust and long-term leadership check',
            description:
              'Five questions on trust, corruption prevention, integrity, continuity, and intergenerational leadership.',
            contentType: 'quiz',
            isRequired: true,
            content: null,
          },
        ],
      },
      {
        slug: 'people-services-and-inclusion',
        title: 'People, Services, and Inclusion',
        description:
          'Measure progress through people’s lives, repair services before expanding them, and design belonging into public systems.',
        lessons: [
          {
            slug: 'make-people-your-priority',
            title: 'Make People Your Priority — Not Your Projects',
            description:
              'What is the true measure of progress? In this episode of The Singapore Way, discover why people—not projects—are a nation’s most important investment. Learn how Singapore focused on improving everyday lives through housing, education, and healthcare, and why lasting development begins by putting citizens at the center of every decision.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/CiUfsL0ACe0',
            isRequired: true,
            content:
              'Core idea: Development is hollow when impressive projects do not improve people’s daily lives, dignity, safety, health, learning, or sense of belonging.\n\nSingapore example: Singapore treated housing as belonging, education as broad capability, and healthcare as protection for families—not only as infrastructure or expenditure.\n\nApply it: Rewrite one project objective as a human outcome. Replace an output such as “build facilities” with the experience or improvement people should feel.',
          },
          {
            slug: 'fix-services-before-expanding',
            title: 'Fix Services, Don’t Just Expand Them',
            description:
              'Why do public services often struggle despite growing budgets and new programs? In this episode of The Singapore Way, discover why lasting improvement starts with fixing what already exists. Learn how Singapore strengthened service delivery through simplicity, accountability, and quality execution—and why repairing broken systems is the foundation of sustainable progress.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/X58WaF0gfwI',
            isRequired: true,
            content:
              'Core idea: Expanding a broken service multiplies failure. Quality, clarity, coordination, training, and dignity should improve before scale.\n\nSingapore example: Singapore simplified processes, clarified responsibility, trained frontline workers, and designed services to be fast, fair, and transparent.\n\nApply it: Walk through one existing service from the citizen’s perspective. Find the most damaging delay, handoff, confusion, or dignity failure and fix that before adding capacity.',
          },
          {
            slug: 'make-diversity-your-strength',
            title: 'Make Diversity Your Strength, Not a Slogan',
            description:
              'How can diversity become a true national strength? In this episode of The Singapore Way, explore why inclusion requires more than good intentions—it requires thoughtful design. Learn how Singapore transformed diversity into unity through policies that fostered belonging, equal opportunity, and shared purpose, creating a stronger and more resilient society.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/vOdz4yyY1wk',
            isRequired: true,
            content:
              'Core idea: Diversity becomes strength when systems create belonging, fair access, equal dignity, and shared ownership. Statements of inclusion are not enough.\n\nSingapore example: Singapore used housing, education, language, and legal protections to build interaction and shared purpose across racial and religious differences.\n\nApply it: Audit one policy for who can access it, who is missing, whose voice shaped it, and whether the result treats minority groups with equal dignity.',
          },
          {
            slug: 'people-services-inclusion-quiz',
            title: 'People, services, and inclusion check',
            description:
              'Five questions on people-centred development, service quality, dignity, diversity, and inclusion by design.',
            contentType: 'quiz',
            isRequired: true,
            content: null,
          },
        ],
      },
      {
        slug: 'innovation-sustainability-and-shared-progress',
        title: 'Innovation, Sustainability, and Shared Progress',
        description:
          'Create safe space for experimentation, protect tomorrow in today’s decisions, and strengthen progress by sharing what works.',
        lessons: [
          {
            slug: 'create-space-for-innovation-within-structure',
            title: 'Create Space for Innovation Within Structure',
            description:
              'How can nations encourage innovation without sacrificing stability? In this episode of The Singapore Way, discover why lasting progress requires both freedom and structure. Learn how Singapore created environments where new ideas could be tested, refined, and scaled—showing that innovation thrives best when supported by strong institutions and clear direction.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/XTjVAYZz9W8',
            isRequired: true,
            content:
              'Core idea: Innovation without structure can become chaos; structure without innovation becomes rigid. Progress requires clear guardrails, safe experimentation, feedback, and disciplined scaling.\n\nSingapore example: Singapore used pilots, sandboxes, digital transformation teams, and structured experimentation inside accountable institutions.\n\nApply it: Define a safe pilot for one new idea: the problem, guardrails, test group, success measures, review date, and decision to stop, adapt, or scale.',
          },
          {
            slug: 'build-sustainability-into-every-decision',
            title: 'Build Sustainability Into Every Decision',
            description:
              'How can nations grow without sacrificing their future? In this episode of The Singapore Way, explore why sustainability must be built into every decision, not treated as an afterthought. Learn how Singapore combined economic growth with environmental resilience—and why lasting progress depends on creating systems that protect both people and the planet for generations to come.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/MJEf8oS9Fyw',
            isRequired: true,
            content:
              'Core idea: Sustainability should be a decision filter across infrastructure, budgets, education, transport, water, energy, and urban planning—not a separate side project.\n\nSingapore example: Singapore linked river clean-up, public transport, water security, green space, and economic development as parts of long-term resilience.\n\nApply it: Apply a future-impact test to one current decision. Identify what it consumes, what risk it transfers to the next generation, and how the design can protect both present needs and future capacity.',
          },
          {
            slug: 'pay-it-forward-grow-by-helping-others',
            title: 'Pay It Forward — Grow by Helping Others',
            description:
              'Why does sharing knowledge make nations stronger? In this final episode of The Singapore Way, explore how collaboration, learning, and generosity can accelerate progress across the Global Majority. Discover why the most effective leaders and nations don’t just solve problems for themselves—they share what works, helping others grow while strengthening their own future.',
            contentType: 'video',
            videoUrl: 'https://youtu.be/W8xjpBUG3PA',
            isRequired: true,
            content:
              'Core idea: Knowledge grows when it is shared. Teaching, documenting, and collaborating force systems to become clearer, more honest, and more useful.\n\nSingapore example: Singapore shared lessons through international training and policy exchange, strengthening its own systems and relevance while helping others adapt—not copy—what worked.\n\nApply it: Document one solution that works in your context. Share the principle, conditions, evidence, limitations, and adaptation questions so others can learn without copying blindly.',
          },
          {
            slug: 'innovation-sustainability-sharing-quiz',
            title: 'Future-ready leadership check',
            description:
              'Five questions on structured innovation, sustainability, adaptation, collaboration, and sharing what works.',
            contentType: 'quiz',
            isRequired: true,
            content: null,
          },
        ],
      },
    ],
    landing: {
      hero: {
        eyebrow: 'Online Course',
        title: 'Build systems that work — wherever you lead.',
        description:
          'Learn from Singapore without copying it. Across 16 practical video lessons, you will explore 15 guiding principles for building trust, strengthening institutions, improving services, and turning ambition into systems that deliver in your own country, city, organisation, school, or ministry.',
        primaryCtaLabel: 'Start the course',
        secondaryCtaLabel: 'Explore the curriculum',
        secondaryCtaHref: '#curriculum',
      },
      bookConnection: {
        eyebrow: 'Book + Course',
        title: 'Move from ideas to application.',
        body:
          'The Singapore Way introduces a way of thinking about progress. This course turns that thinking into a guided learning journey. Each lesson explains a principle, shows how it appeared in Singapore’s experience, and asks what it could mean in your own context. The goal is not imitation. It is disciplined adaptation.',
      },
      outcomes: [
        {
          title: 'Build from values, not slogans.',
          body:
            'Identify the principles that should guide decisions when plans, politics, and conditions change.',
        },
        {
          title: 'Turn constraints into design choices.',
          body:
            'Use real limitations to sharpen priorities and create more practical solutions.',
        },
        {
          title: 'Build systems that deliver.',
          body:
            'Connect ownership, execution, measurement, maintenance, and feedback so progress does not stop at the announcement.',
        },
        {
          title: 'Earn trust through institutions.',
          body:
            'Understand how service, integrity, transparency, and consistent rules make reform credible.',
        },
        {
          title: 'Lead beyond the immediate term.',
          body:
            'Design policies and institutions that protect people today while building capability for the next generation.',
        },
        {
          title: 'Adapt and share what works.',
          body:
            'Translate principles into your own context, test them honestly, and help others learn without encouraging copy-paste reform.',
        },
      ],
      audience: [
        {
          title: 'Government and policy leaders.',
          body:
            'You want practical principles for designing reforms that deliver, earn trust, and survive beyond one political cycle.',
        },
        {
          title: 'Mayors and local leaders.',
          body:
            'You are close to everyday service problems and need approaches that can be tested, measured, and improved.',
        },
        {
          title: 'Educators and programme leaders.',
          body:
            'You want a clear way to teach values, systems thinking, inclusion, and long-term leadership.',
        },
        {
          title: 'Founders and operators.',
          body:
            'You want to build an organisation with disciplined execution, trusted rules, and the ability to adapt.',
        },
        {
          title: 'Young leaders and engaged citizens.',
          body:
            'You want to move from frustration and admiration to informed, practical action.',
        },
      ],
      howItWorks: [
        {
          title: 'Watch 16 focused lessons.',
          body:
            'Begin with the course orientation, then work through the 15 guiding principles in sequence.',
        },
        {
          title: 'Apply each idea to your context.',
          body:
            'Every lesson includes concise notes and an action prompt that connects the principle to a real system you care about.',
        },
        {
          title: 'Complete five module quizzes.',
          body:
            'Each quiz contains five multiple-choice questions. Score 80% or higher to pass. Retries are unlimited.',
        },
        {
          title: 'Track your progress.',
          body: 'Your completed lessons and passed quizzes are saved to your account.',
        },
        {
          title: 'Earn a verifiable certificate.',
          body:
            'Complete every required lesson and pass every required quiz to receive a personalised certificate with a public verification link.',
        },
      ],
      quizAndCertificate: {
        eyebrow: 'Quizzes and Certificate',
        title: 'Learn it. Apply it. Prove you completed it.',
        body:
          'The quizzes are designed to check understanding, not punish mistakes. Each module ends with five source-grounded questions. You need four correct answers to pass, and you can retry as often as needed. Once every required lesson and quiz is complete, your certificate is issued automatically.',
        bullets: [
          'Five module quizzes with five questions each.',
          'Passing score: 80%.',
          'Unlimited retries.',
          'Server-side grading keeps the answer key private.',
          'Personalised certificate with date, certificate code, and public verification page.',
          'Print or save the certificate as PDF from your browser.',
        ],
      },
      authority: {
        eyebrow: 'Your instructor',
        name: 'Maher Kaddoura',
        title: 'Author of The Singapore Way',
        bio:
          'Maher Kaddoura is an author, entrepreneur, and advocate for practical leadership and system-level change. The Singapore Way course translates the book’s core ideas into a guided learning experience for people working to improve countries, cities, institutions, and communities across the Global Majority.',
      },
      faq: [
        {
          question: 'Do I need to read the book first?',
          answer:
            'No. The course stands on its own, while the book provides additional context and depth.',
        },
        {
          question: 'How long do I have to complete the course?',
          answer:
            'The course is self-paced. Your progress is saved so you can return and continue.',
        },
        {
          question: 'How do I access the course?',
          answer:
            'Create a free account or sign in. Any signed-in learner can open the course player, save progress, take quizzes, and earn the certificate.',
        },
        {
          question: 'How many lessons are included?',
          answer:
            'The course includes 16 required video lessons: one introduction and 15 guiding principles.',
        },
        {
          question: 'How do the quizzes work?',
          answer:
            'Each of the five modules ends with a five-question multiple-choice quiz. You need 80% to pass and may retry without limit.',
        },
        {
          question: 'When do I receive the certificate?',
          answer:
            'The certificate is issued automatically after all required videos are marked complete and all required quizzes are passed.',
        },
        {
          question: 'Can someone verify my certificate?',
          answer:
            'Yes. Every issued certificate has a unique public verification page that shows only the safe certificate fields.',
        },
        {
          question: 'Can I download the certificate?',
          answer:
            'The certificate view is print-friendly so you can print it or save it as a PDF from your browser.',
        },
      ],
      finalCta: {
        eyebrow: 'Ready to begin',
        title: 'Start with what you have. Build what your context needs.',
        body:
          'The Singapore Way is not a course to admire from a distance. It is an invitation to examine one real system, apply the principles honestly, and begin.',
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

export function getVideoLessonCount(course: Course): number {
  return course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.contentType === 'video').length,
    0,
  )
}

export function getTotalQuizCount(course: Course): number {
  return course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.contentType === 'quiz').length,
    0,
  )
}
