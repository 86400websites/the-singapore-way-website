-- 0006_course_final_content.sql — S13: replace the sample course with the
-- final approved course content.
--
-- File: supabase/sql/0006_course_final_content.sql
-- Run AFTER 0001, 0002, 0003, 0005 and the original seed (0004 stays skipped).
-- Rollback: 0006_course_final_content.down.sql (restores the SAMPLE content
-- shape only — it cannot restore deleted learner history).
--
-- WHAT THIS DOES
--   * Updates the course row (slug stays 'the-singapore-way') to the approved
--     title, subtitle, and description.
--   * Deletes and rebuilds the course CONTENT: 5 modules, 16 required video
--     lessons (real YouTube URLs), 5 required quiz lessons, 25 questions.
--   * Deletes this course's lesson_progress and quiz_attempts rows.
--   * DOES NOT touch public.certificates — issued certificates stay valid.
--   * Touches no other course, table, function, policy, or grant.
--
-- CLASSIFICATION: DESTRUCTIVE (Path A of the S13 runbook).
--   The owner ran the read-only preflight on 2026-07-23 (17 lesson_progress /
--   5 quiz_attempts / 1 certificate for this course) and confirmed all of it
--   is disposable test data, authorising Path A. If the preflight were re-run
--   today and showed REAL learner rows, STOP and use the Path B reconciliation
--   described in docs/update-course-content.md instead.
--
-- The whole change runs in one do-block, i.e. one transaction: it either
-- completes fully or leaves the database untouched. The course row is locked
-- for the duration to serialise against concurrent RPC writers.

do $$
declare
  v_course_id uuid;
  v_mod1_id   uuid;
  v_mod2_id   uuid;
  v_mod3_id   uuid;
  v_mod4_id   uuid;
  v_mod5_id   uuid;
  v_quiz1_id  uuid;
  v_quiz2_id  uuid;
  v_quiz3_id  uuid;
  v_quiz4_id  uuid;
  v_quiz5_id  uuid;
begin
  -- ---------- resolve + lock the course ----------
  select id into v_course_id
  from public.courses
  where slug = 'the-singapore-way'
  for update;

  if v_course_id is null then
    raise exception 'Course "the-singapore-way" not found. On a fresh project run seed-the-singapore-way.sql instead of this migration.';
  end if;

  -- ---------- course identity (slug unchanged) ----------
  update public.courses
     set title       = 'The Singapore Way Online Course',
         subtitle    = '15 guiding principles for building systems that work.',
         description = 'A practical 16-video course for leaders, policymakers, educators, and changemakers who want to turn values, trust, systems thinking, and long-term leadership into action in their own context.',
         status      = 'published'
   where id = v_course_id;

  -- ---------- remove existing content, scoped to this course only ----------
  -- Cascades from course_lessons would cover the child rows, but explicit
  -- course-scoped deletes keep the blast radius auditable. Order respects FKs.
  delete from public.quiz_questions  where course_id = v_course_id;
  delete from public.quiz_attempts   where course_id = v_course_id;  -- test data (Path A)
  delete from public.lesson_progress where course_id = v_course_id;  -- test data (Path A)
  delete from public.course_lessons  where course_id = v_course_id;
  delete from public.course_modules  where course_id = v_course_id;

  -- ---------- module 1 ----------
  insert into public.course_modules (course_id, title, description, position)
  values (
    v_course_id,
    'Purpose, Constraints, and Pragmatism',
    'Begin with the right mental model: use Singapore as an example, build on values, work with real constraints, and choose evidence over ego.',
    1
  )
  returning id into v_mod1_id;

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, video_url, position, is_required, content)
  values
    (v_course_id, v_mod1_id, 'start-here',
     'Start Here — The Bridge from Singapore to You',
     'Welcome to The Singapore Way. In this introduction, discover how Singapore’s experience can serve as a practical toolkit for changemakers, leaders, educators, and policymakers. Learn how the course’s 15 guiding principles can help you build better systems, adapt ideas to your local context, and turn vision into action.',
     'video', 'https://youtu.be/tVoscHU9Qas', 1, true,
     $notes$Core idea: Singapore is not the destination or a model to copy. It is a practical example that helps learners examine how values, systems, trust, and disciplined execution can be adapted to their own context.

Singapore example: The course uses Singapore’s experience as a toolkit rather than a tribute. Each principle is presented with a question: what would this look like in your country, city, ministry, school, organisation, or team?

Apply it: Choose one system you want to improve. Write down who it serves, what is currently failing, and what a better result would look like in everyday life.$notes$),

    (v_course_id, v_mod1_id, 'build-on-values-not-just-vision',
     'Build on Values, Not Just Vision',
     'Can a nation succeed without shared values? In this episode of The Singapore Way, explore why lasting progress starts with principles, not just plans. Discover how values like integrity, unity, and trust helped shape Singapore’s transformation—and how leaders can apply the same lesson to build stronger, more resilient societies.',
     'video', 'https://youtu.be/lUHOOGJ-9HQ', 2, true,
     $notes$Core idea: Vision describes where you want to go. Values determine how people behave while getting there. Without shared principles, plans become fragile and public trust erodes.

Singapore example: Singapore treated discipline, integrity, racial harmony, and clean government as operating principles that informed laws, budgets, institutions, and daily choices.

Apply it: Before proposing a policy or programme, name the values it must express. Test whether the design would still feel fair and credible after a change in leadership.$notes$),

    (v_course_id, v_mod1_id, 'turn-constraints-into-strength',
     'Turn Constraints into Strength',
     'What if your greatest limitation could become your greatest advantage? In this episode of The Singapore Way, discover how constraints can drive innovation, sharpen focus, and inspire smarter solutions. Learn how Singapore transformed scarcity into strength—and how leaders can turn challenges into opportunities for progress.',
     'video', 'https://youtu.be/Hh-QgSDPj-k', 3, true,
     $notes$Core idea: Constraints are not an excuse to delay action. Naming them clearly can sharpen priorities, force better design, and reveal where limited resources will have the greatest effect.

Singapore example: Singapore responded to shortages of land, water, and natural resources by building vertically, investing in water technology, and developing human capital.

Apply it: Name your most important constraint without softening it. Then identify one design choice that turns that limitation into focus, discipline, or innovation.$notes$),

    (v_course_id, v_mod1_id, 'lead-with-pragmatism-not-ego',
     'Lead with Pragmatism, Not Ego',
     'Should leaders focus on ideology—or results? In this episode of The Singapore Way, explore why pragmatism is one of the most powerful tools in leadership. Learn how Singapore prioritized solutions over politics, tested what worked, and built progress through evidence, adaptability, and a relentless focus on results.',
     'video', 'https://youtu.be/EXvZ0eBH5P0', 4, true,
     $notes$Core idea: Pragmatism means putting evidence, outcomes, and learning ahead of ego, ideology, or the need to appear right.

Singapore example: Singapore tested policies, used public-private partnerships where they made sense, and changed approaches when evidence showed that something was not working.

Apply it: Identify one debate that is stuck in ideology or pride. Reframe it around the result citizens need, the evidence available, and the smallest test that could reduce uncertainty.$notes$);

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, position, is_required, content)
  values
    (v_course_id, v_mod1_id, 'purpose-constraints-pragmatism-quiz',
     'Foundations in action',
     'Five questions on the course purpose, values, constraints, and pragmatic leadership.',
     'quiz', 5, true,
     null)
  returning id into v_quiz1_id;

  -- ---------- module 2 ----------
  insert into public.course_modules (course_id, title, description, position)
  values (
    v_course_id,
    'Systems, Capital, and Daily Discipline',
    'Turn plans into delivery systems, build economic confidence from within, and make strategy a repeated operating practice.',
    2
  )
  returning id into v_mod2_id;

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, video_url, position, is_required, content)
  values
    (v_course_id, v_mod2_id, 'build-systems-that-solve-not-plans-that-impress',
     'Build Systems That Solve, Not Just Plans That Impress',
     'Why do so many ambitious plans fail to create real change? In this episode of The Singapore Way, discover why lasting progress depends on strong systems, not just bold strategies. Learn how Singapore connected planning, execution, and accountability to turn vision into results—and how leaders can build systems that deliver real impact.',
     'video', 'https://youtu.be/YMkJiS48CGU', 1, true,
     $notes$Core idea: A plan is a promise; a system is the machinery that repeatedly delivers the result. Systems clarify ownership, resources, measurement, maintenance, and feedback.

Singapore example: Singapore connected planning, execution, and maintenance through lead agencies, accountable owners, and feedback loops.

Apply it: Take one current plan and write down who owns delivery, how progress is measured, what happens when performance slips, and who maintains the result after launch.$notes$),

    (v_course_id, v_mod2_id, 'grow-capital-locally',
     'Don’t Just Attract Capital — Grow It Locally',
     'Why do some nations build lasting prosperity while others remain dependent on outside funding? In this episode of The Singapore Way, explore why local trust is the foundation of economic independence. Learn how Singapore grew wealth from within by building confidence, encouraging savings, and creating systems that empowered citizens to invest in their own future.',
     'video', 'https://youtu.be/ZZkbYyO8Co4', 2, true,
     $notes$Core idea: Local capital is not only money. It is confidence that savings are safe, contracts will be honoured, rules will be applied fairly, and investments can grow at home.

Singapore example: Singapore built domestic trust and used long-term savings to invest in housing, healthcare, infrastructure, and human capacity.

Apply it: Assess what prevents citizens or local businesses from investing at home. Focus on one trust barrier—such as transparency, access to credit, contract enforcement, or predictable rules.$notes$),

    (v_course_id, v_mod2_id, 'strategy-is-a-daily-discipline',
     'Strategy Isn’t a Document — It’s a Daily Discipline',
     'Why do so many strategies fail to create lasting change? In this episode of The Singapore Way, discover why progress depends on daily discipline, not just ambitious plans. Learn how Singapore turned strategy into a culture of continuous learning, adaptation, and accountability—and how leaders can build momentum through consistency and focus.',
     'video', 'https://youtu.be/dl4GwF9QDbo', 3, true,
     $notes$Core idea: Strategy lives in repeated decisions, follow-up, adaptation, and honest review. A document that is not used to guide daily work is not a functioning strategy.

Singapore example: Singapore planned for decades while reviewing performance continuously, scaling what worked, and correcting what failed.

Apply it: Define a practical review rhythm for one priority: what will be checked, by whom, how often, and what evidence will trigger a course correction?$notes$);

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, position, is_required, content)
  values
    (v_course_id, v_mod2_id, 'systems-capital-discipline-quiz',
     'Systems and capacity check',
     'Five questions on delivery systems, local capital, trust, and strategy as a daily discipline.',
     'quiz', 4, true,
     null)
  returning id into v_quiz2_id;

  -- ---------- module 3 ----------
  insert into public.course_modules (course_id, title, description, position)
  values (
    v_course_id,
    'Trust, Integrity, and Long-Term Leadership',
    'Earn trust through service, design corruption out of institutions, and build reforms that survive beyond one political term.',
    3
  )
  returning id into v_mod3_id;

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, video_url, position, is_required, content)
  values
    (v_course_id, v_mod3_id, 'build-trust-before-you-build-policy',
     'Build Trust Before You Build Policy',
     'Why do so many reforms fail despite good intentions? In this episode of The Singapore Way, discover why trust is the foundation of every successful policy and institution. Learn how Singapore built credibility through integrity, accountability, and consistent service—and why lasting transformation begins with earning the confidence of the people.',
     'video', 'https://youtu.be/DhZjaFhv3LM', 1, true,
     $notes$Core idea: Trust is earned through what citizens experience: dignity, consistency, service, fairness, and accountability. It cannot be created by branding or speeches.

Singapore example: Singapore built credibility when institutions delivered, rules were enforced, leaders modelled integrity, and mistakes were faced rather than hidden.

Apply it: Map one citizen interaction with your system. Identify the moment where trust is most likely to be gained or lost, and redesign that moment.$notes$),

    (v_course_id, v_mod3_id, 'keep-corruption-out-by-design',
     'Keep Corruption Out by Design, Not Just Hope',
     'Why do corruption problems persist even when leaders promise change? In this episode of The Singapore Way, explore why integrity must be built into the system itself. Learn how transparency, accountability, and strong institutional design can prevent corruption before it starts—and create the trust needed for long-term progress.',
     'video', 'https://youtu.be/E5TXUTQ_uAg', 2, true,
     $notes$Core idea: Corruption is often a predictable output of opaque decisions, weak oversight, inconsistent rules, and incentives that reward loyalty over competence.

Singapore example: Singapore used independent audits, transparent procurement, conflict-of-interest rules, traceable decisions, and consistent enforcement.

Apply it: Choose one decision involving money, contracts, hiring, or permissions. Make the decision path visible: criteria, approver, evidence, record, oversight, and appeal.$notes$),

    (v_course_id, v_mod3_id, 'think-beyond-your-term',
     'Think Beyond Your Term — Plan for the Next Generation',
     'Why do some reforms endure while others disappear with the next administration? In this episode of The Singapore Way, explore the power of long-term thinking and why true leadership is measured by what lasts beyond a single term. Learn how Singapore built institutions and systems designed to serve future generations—and how leaders can create legacies that outlive them.',
     'video', 'https://youtu.be/e0529zpg1Jk', 3, true,
     $notes$Core idea: Leadership is not only about finishing projects during one term. It is about building institutions, capabilities, and continuity that continue to serve people after leadership changes.

Singapore example: Singapore’s education, housing, and transport systems evolved over decades instead of restarting with every administration.

Apply it: Test one proposed initiative against a twenty-year horizon. Ask what institution, funding model, capability, and public value must remain after its original sponsor leaves.$notes$);

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, position, is_required, content)
  values
    (v_course_id, v_mod3_id, 'trust-integrity-long-term-quiz',
     'Trust and long-term leadership check',
     'Five questions on trust, corruption prevention, integrity, continuity, and intergenerational leadership.',
     'quiz', 4, true,
     null)
  returning id into v_quiz3_id;

  -- ---------- module 4 ----------
  insert into public.course_modules (course_id, title, description, position)
  values (
    v_course_id,
    'People, Services, and Inclusion',
    'Measure progress through people’s lives, repair services before expanding them, and design belonging into public systems.',
    4
  )
  returning id into v_mod4_id;

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, video_url, position, is_required, content)
  values
    (v_course_id, v_mod4_id, 'make-people-your-priority',
     'Make People Your Priority — Not Your Projects',
     'What is the true measure of progress? In this episode of The Singapore Way, discover why people—not projects—are a nation’s most important investment. Learn how Singapore focused on improving everyday lives through housing, education, and healthcare, and why lasting development begins by putting citizens at the center of every decision.',
     'video', 'https://youtu.be/CiUfsL0ACe0', 1, true,
     $notes$Core idea: Development is hollow when impressive projects do not improve people’s daily lives, dignity, safety, health, learning, or sense of belonging.

Singapore example: Singapore treated housing as belonging, education as broad capability, and healthcare as protection for families—not only as infrastructure or expenditure.

Apply it: Rewrite one project objective as a human outcome. Replace an output such as “build facilities” with the experience or improvement people should feel.$notes$),

    (v_course_id, v_mod4_id, 'fix-services-before-expanding',
     'Fix Services, Don’t Just Expand Them',
     'Why do public services often struggle despite growing budgets and new programs? In this episode of The Singapore Way, discover why lasting improvement starts with fixing what already exists. Learn how Singapore strengthened service delivery through simplicity, accountability, and quality execution—and why repairing broken systems is the foundation of sustainable progress.',
     'video', 'https://youtu.be/X58WaF0gfwI', 2, true,
     $notes$Core idea: Expanding a broken service multiplies failure. Quality, clarity, coordination, training, and dignity should improve before scale.

Singapore example: Singapore simplified processes, clarified responsibility, trained frontline workers, and designed services to be fast, fair, and transparent.

Apply it: Walk through one existing service from the citizen’s perspective. Find the most damaging delay, handoff, confusion, or dignity failure and fix that before adding capacity.$notes$),

    (v_course_id, v_mod4_id, 'make-diversity-your-strength',
     'Make Diversity Your Strength, Not a Slogan',
     'How can diversity become a true national strength? In this episode of The Singapore Way, explore why inclusion requires more than good intentions—it requires thoughtful design. Learn how Singapore transformed diversity into unity through policies that fostered belonging, equal opportunity, and shared purpose, creating a stronger and more resilient society.',
     'video', 'https://youtu.be/vOdz4yyY1wk', 3, true,
     $notes$Core idea: Diversity becomes strength when systems create belonging, fair access, equal dignity, and shared ownership. Statements of inclusion are not enough.

Singapore example: Singapore used housing, education, language, and legal protections to build interaction and shared purpose across racial and religious differences.

Apply it: Audit one policy for who can access it, who is missing, whose voice shaped it, and whether the result treats minority groups with equal dignity.$notes$);

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, position, is_required, content)
  values
    (v_course_id, v_mod4_id, 'people-services-inclusion-quiz',
     'People, services, and inclusion check',
     'Five questions on people-centred development, service quality, dignity, diversity, and inclusion by design.',
     'quiz', 4, true,
     null)
  returning id into v_quiz4_id;

  -- ---------- module 5 ----------
  insert into public.course_modules (course_id, title, description, position)
  values (
    v_course_id,
    'Innovation, Sustainability, and Shared Progress',
    'Create safe space for experimentation, protect tomorrow in today’s decisions, and strengthen progress by sharing what works.',
    5
  )
  returning id into v_mod5_id;

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, video_url, position, is_required, content)
  values
    (v_course_id, v_mod5_id, 'create-space-for-innovation-within-structure',
     'Create Space for Innovation Within Structure',
     'How can nations encourage innovation without sacrificing stability? In this episode of The Singapore Way, discover why lasting progress requires both freedom and structure. Learn how Singapore created environments where new ideas could be tested, refined, and scaled—showing that innovation thrives best when supported by strong institutions and clear direction.',
     'video', 'https://youtu.be/XTjVAYZz9W8', 1, true,
     $notes$Core idea: Innovation without structure can become chaos; structure without innovation becomes rigid. Progress requires clear guardrails, safe experimentation, feedback, and disciplined scaling.

Singapore example: Singapore used pilots, sandboxes, digital transformation teams, and structured experimentation inside accountable institutions.

Apply it: Define a safe pilot for one new idea: the problem, guardrails, test group, success measures, review date, and decision to stop, adapt, or scale.$notes$),

    (v_course_id, v_mod5_id, 'build-sustainability-into-every-decision',
     'Build Sustainability Into Every Decision',
     'How can nations grow without sacrificing their future? In this episode of The Singapore Way, explore why sustainability must be built into every decision, not treated as an afterthought. Learn how Singapore combined economic growth with environmental resilience—and why lasting progress depends on creating systems that protect both people and the planet for generations to come.',
     'video', 'https://youtu.be/MJEf8oS9Fyw', 2, true,
     $notes$Core idea: Sustainability should be a decision filter across infrastructure, budgets, education, transport, water, energy, and urban planning—not a separate side project.

Singapore example: Singapore linked river clean-up, public transport, water security, green space, and economic development as parts of long-term resilience.

Apply it: Apply a future-impact test to one current decision. Identify what it consumes, what risk it transfers to the next generation, and how the design can protect both present needs and future capacity.$notes$),

    (v_course_id, v_mod5_id, 'pay-it-forward-grow-by-helping-others',
     'Pay It Forward — Grow by Helping Others',
     'Why does sharing knowledge make nations stronger? In this final episode of The Singapore Way, explore how collaboration, learning, and generosity can accelerate progress across the Global Majority. Discover why the most effective leaders and nations don’t just solve problems for themselves—they share what works, helping others grow while strengthening their own future.',
     'video', 'https://youtu.be/W8xjpBUG3PA', 3, true,
     $notes$Core idea: Knowledge grows when it is shared. Teaching, documenting, and collaborating force systems to become clearer, more honest, and more useful.

Singapore example: Singapore shared lessons through international training and policy exchange, strengthening its own systems and relevance while helping others adapt—not copy—what worked.

Apply it: Document one solution that works in your context. Share the principle, conditions, evidence, limitations, and adaptation questions so others can learn without copying blindly.$notes$);

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, position, is_required, content)
  values
    (v_course_id, v_mod5_id, 'innovation-sustainability-sharing-quiz',
     'Future-ready leadership check',
     'Five questions on structured innovation, sustainability, adaptation, collaboration, and sharing what works.',
     'quiz', 4, true,
     null)
  returning id into v_quiz5_id;

  -- ---------- quiz questions: module 1 — Foundations in action ----------
  insert into public.quiz_questions
    (course_id, lesson_id, question, choices, correct_choice, explanation, position)
  values
    (v_course_id, v_quiz1_id,
     'What is the course’s central reason for using Singapore as an example?',
     '["To give every country a policy blueprint to copy exactly",
       "To provide a practical toolkit that learners adapt to their own context",
       "To prove that small countries always outperform large countries",
       "To celebrate Singapore without asking learners to take action"]'::jsonb,
     1,
     'The course presents Singapore as an example and toolkit. The learner’s own country, city, institution, or community is the real focus.',
     1),

    (v_course_id, v_quiz1_id,
     'Why does the course place values before vision?',
     '["Values make detailed planning unnecessary",
       "Values ensure that every political party uses the same policies",
       "Values provide an enduring foundation for trust and decisions",
       "Values are easier to announce than measurable goals"]'::jsonb,
     2,
     'Visions and goals can change, but shared values guide behaviour, strengthen trust, and help reforms survive leadership changes.',
     2),

    (v_course_id, v_quiz1_id,
     'Which response best reflects the lesson on constraints?',
     '["Wait until resources and institutions are strong enough",
       "Hide the constraint so it does not reduce confidence",
       "Copy a solution from a country without the same limitation",
       "Define the constraint clearly and design around it"]'::jsonb,
     3,
     'The lesson treats constraints as a source of focus. Naming the limitation makes it possible to redesign around real conditions.',
     3),

    (v_course_id, v_quiz1_id,
     'What does pragmatic leadership prioritise?',
     '["Evidence, learning, and results",
       "Protecting the leader’s original position",
       "Ideological consistency even when outcomes fail",
       "Policies that attract the most public applause"]'::jsonb,
     0,
     'Pragmatism asks what works, tests assumptions, and adapts based on evidence rather than ego or ideology.',
     4),

    (v_course_id, v_quiz1_id,
     'A ministry has a limited budget and a disputed reform idea. Which action best combines the first module’s principles?',
     '["Launch the full national reform immediately to show confidence",
       "Define the public value, design a small pilot around the constraint, and measure results",
       "Delay all action until every stakeholder agrees",
       "Choose the proposal supported by the most senior person"]'::jsonb,
     1,
     'The strongest approach connects values, constraints, pragmatism, and disciplined experimentation.',
     5);

  -- ---------- quiz questions: module 2 — Systems and capacity check ----------
  insert into public.quiz_questions
    (course_id, lesson_id, question, choices, correct_choice, explanation, position)
  values
    (v_course_id, v_quiz2_id,
     'What most clearly distinguishes a system from a plan?',
     '["A system has a longer written document",
       "A system always requires a new government agency",
       "A system defines delivery, ownership, maintenance, measurement, and feedback",
       "A system focuses on announcements before implementation"]'::jsonb,
     2,
     'Plans state intentions. Systems connect the people, responsibilities, resources, measures, and feedback required to deliver repeatedly.',
     1),

    (v_course_id, v_quiz2_id,
     'In the course, local capital is primarily a sign of what?',
     '["A country’s ability to avoid all foreign investment",
       "The size of a country’s natural-resource exports",
       "A government’s willingness to borrow quickly",
       "Citizens’ confidence in their own institutions and economy"]'::jsonb,
     3,
     'Local capital grows when people trust that savings are safe, rules are fair, contracts are honoured, and investment at home is worthwhile.',
     2),

    (v_course_id, v_quiz2_id,
     'Which condition is most likely to encourage people to invest locally?',
     '["Predictable rules and institutions that deliver",
       "Frequent changes to contracts and regulations",
       "Opaque spending decisions",
       "Dependence on one outside funder"]'::jsonb,
     0,
     'Trust grows through predictable, fair, transparent institutions. Money follows that confidence.',
     3),

    (v_course_id, v_quiz2_id,
     'What makes strategy a daily discipline?',
     '["Publishing a new vision document every year",
       "Reviewing results, learning, following up, and adapting",
       "Keeping the original plan unchanged to show consistency",
       "Separating strategy from frontline work"]'::jsonb,
     1,
     'Strategy becomes real through repeated review, follow-through, and course correction—not through paperwork alone.',
     4),

    (v_course_id, v_quiz2_id,
     'Which operating practice best connects all three lessons in this module?',
     '["A public launch event followed by informal implementation",
       "A strategy team with no responsibility for delivery",
       "A named owner, clear measures, regular review, and transparent follow-through",
       "An external investor making all key decisions"]'::jsonb,
     2,
     'Ownership, measurement, transparency, and disciplined review turn plans into trusted systems that can attract and grow capital.',
     5);

  -- ---------- quiz questions: module 3 — Trust and long-term leadership check ----------
  insert into public.quiz_questions
    (course_id, lesson_id, question, choices, correct_choice, explanation, position)
  values
    (v_course_id, v_quiz3_id,
     'According to the course, where does institutional trust begin?',
     '["In a persuasive national branding campaign",
       "In a single high-profile reform announcement",
       "In avoiding all public discussion of mistakes",
       "In citizens’ repeated experience of fair and reliable service"]'::jsonb,
     3,
     'Trust is a result of service, dignity, consistency, fairness, and accountability experienced over time.',
     1),

    (v_course_id, v_quiz3_id,
     'Why does the course describe corruption as a design problem?',
     '["Because opaque decisions, weak oversight, and unequal rules predictably create opportunities for abuse",
       "Because corruption only happens in digital systems",
       "Because individual conduct has no role in corruption",
       "Because every complex system is automatically corrupt"]'::jsonb,
     0,
     'The lesson does not excuse individual misconduct. It explains that bad system design makes misconduct easier, safer, and more routine.',
     2),

    (v_course_id, v_quiz3_id,
     'Which control most directly helps prevent corruption before it occurs?',
     '["Keeping procurement criteria confidential",
       "Making decisions, criteria, approvals, and money flows traceable",
       "Allowing verbal approvals for urgent contracts",
       "Relying on leaders to promise personal honesty"]'::jsonb,
     1,
     'Traceability, transparency, oversight, and consistent enforcement make integrity part of the system rather than a personal hope.',
     3),

    (v_course_id, v_quiz3_id,
     'What is the strongest sign of long-term leadership?',
     '["Projects that receive immediate media attention",
       "A reform that depends on one leader’s personal involvement",
       "Institutions and capabilities that continue after leadership changes",
       "Policies that are replaced whenever a new administration arrives"]'::jsonb,
     2,
     'Long-term leadership builds continuity, institutions, and public value that outlive the original sponsor.',
     4),

    (v_course_id, v_quiz3_id,
     'A reform survives three administrations while its measures and delivery standards remain stable. Which principle does this demonstrate most directly?',
     '["Expansion is always better than repair",
       "Innovation requires no structure",
       "Foreign capital should replace local capital",
       "Continuity creates credibility"]'::jsonb,
     3,
     'A mission that survives political turnover shows institutional continuity and a focus on the next generation.',
     5);

  -- ---------- quiz questions: module 4 — People, services, and inclusion check ----------
  insert into public.quiz_questions
    (course_id, lesson_id, question, choices, correct_choice, explanation, position)
  values
    (v_course_id, v_quiz4_id,
     'What is the course’s preferred measure of progress?',
     '["The improvement people experience in daily life",
       "The number of projects announced",
       "The visibility of new infrastructure",
       "The size of a ministry’s annual budget"]'::jsonb,
     0,
     'Projects matter when they improve safety, health, education, dignity, opportunity, and belonging.',
     1),

    (v_course_id, v_quiz4_id,
     'Why should a broken service be repaired before it is expanded?',
     '["Because expansion is never useful",
       "Because scaling a broken process multiplies failure",
       "Because citizens prefer smaller services",
       "Because training frontline staff is unnecessary"]'::jsonb,
     1,
     'Quality, clarity, coordination, and accountability must improve before scale or the system reproduces the same harm.',
     2),

    (v_course_id, v_quiz4_id,
     'In the service-delivery lesson, good service is ultimately described as a form of what?',
     '["Public relations",
       "Control",
       "Respect",
       "Competition"]'::jsonb,
     2,
     'A working service tells citizens that their time, needs, and dignity matter.',
     3),

    (v_course_id, v_quiz4_id,
     'What turns diversity from a slogan into a system?',
     '["A yearly celebration with no policy changes",
       "Avoiding discussion of differences",
       "Giving one group permanent control to preserve stability",
       "Equal access, fair opportunity, visible respect, and belonging"]'::jsonb,
     3,
     'Inclusion is designed through fair systems and shared ownership, not declared through slogans alone.',
     4),

    (v_course_id, v_quiz4_id,
     'Which redesign best reflects this module?',
     '["Map the citizen experience, repair the worst failure, and test access across different groups",
       "Add another service location without reviewing why the current service fails",
       "Measure a project only by cost and construction speed",
       "Use one standard process even when it excludes some citizens"]'::jsonb,
     0,
     'The module combines people-centred outcomes, service repair, dignity, and inclusive access.',
     5);

  -- ---------- quiz questions: module 5 — Future-ready leadership check ----------
  insert into public.quiz_questions
    (course_id, lesson_id, question, choices, correct_choice, explanation, position)
  values
    (v_course_id, v_quiz5_id,
     'Why does innovation need structure?',
     '["To prevent all experimentation",
       "To provide guardrails, accountability, and a path to safe scaling",
       "To ensure only government employees can propose ideas",
       "To keep successful pilots permanently small"]'::jsonb,
     1,
     'Structure helps experimentation remain safe, measurable, aligned to public value, and capable of scaling.',
     1),

    (v_course_id, v_quiz5_id,
     'Which approach best supports innovation within a public institution?',
     '["Punish every unsuccessful pilot",
       "Adopt every new idea nationwide immediately",
       "Use a bounded pilot with measures, feedback, and a stop/adapt/scale decision",
       "Remove all standards before testing"]'::jsonb,
     2,
     'A disciplined pilot creates room to learn while protecting the wider system.',
     2),

    (v_course_id, v_quiz5_id,
     'How should sustainability influence government decisions?',
     '["As a separate environmental project after growth is achieved",
       "Only when international funding is available",
       "Only in countries that have already become wealthy",
       "As a filter applied across budgets, infrastructure, services, and policy"]'::jsonb,
     3,
     'The course treats sustainability as part of every major decision, not as an optional add-on.',
     3),

    (v_course_id, v_quiz5_id,
     'Why can sharing knowledge strengthen the organisation or country that shares it?',
     '["Teaching forces the solution to become clearer, tested, and adaptable",
       "Sharing guarantees that others will copy the policy exactly",
       "Knowledge becomes more valuable when kept secret",
       "Collaboration removes the need for local context"]'::jsonb,
     0,
     'Documenting and teaching what works exposes assumptions, improves clarity, and creates new learning.',
     4),

    (v_course_id, v_quiz5_id,
     'Which final action best reflects the course as a whole?',
     '["Copy a successful policy and launch it without adaptation",
       "Document the principle, evidence, limits, and adaptation questions, then share it",
       "Keep a working local solution private",
       "Wait for perfect conditions before acting"]'::jsonb,
     1,
     'The course ends by asking learners to build, adapt, teach, and share—without encouraging copy-paste reform.',
     5);
end $$;

-- =============================================================================
-- Verification (read-only; run after applying)
-- =============================================================================
--
-- Expected: 16 video lessons, 5 quiz lessons, 21 required.
--
--   select
--     count(*) filter (where l.content_type = 'video') as video_lessons,
--     count(*) filter (where l.content_type = 'quiz')  as quiz_lessons,
--     count(*) filter (where l.is_required)            as required_lessons
--   from public.course_lessons l
--   join public.courses c on c.id = l.course_id
--   where c.slug = 'the-singapore-way';
--
-- Expected: 25 questions, 5 per quiz lesson.
--
--   select l.slug, count(q.id) as questions
--   from public.quiz_questions q
--   join public.course_lessons l on l.id = q.lesson_id
--   join public.courses c on c.id = q.course_id
--   where c.slug = 'the-singapore-way'
--   group by l.slug
--   order by l.slug;
--
-- Expected: every video lesson has a non-null tracker URL; positions are
-- sequential within each module.
--
--   select m.position as module_position, l.position as lesson_position,
--          l.slug, l.content_type, l.video_url, l.is_required
--   from public.course_modules m
--   join public.courses c on c.id = m.course_id
--   join public.course_lessons l on l.module_id = m.id
--   where c.slug = 'the-singapore-way'
--   order by m.position, l.position;
--
-- Expected: certificates were preserved (count unchanged from preflight).
--
--   select count(*) as certificate_rows
--   from public.certificates x
--   join public.courses c on c.id = x.course_id
--   where c.slug = 'the-singapore-way';
