-- 0006_course_final_content.down.sql — DESTRUCTIVE ROLLBACK of 0006.
--
-- Do NOT run this file unless you are deliberately rolling back the S13
-- course-finalisation content migration.
--
-- WHAT THIS DOES
--   * Restores the course row and course CONTENT to the pre-S13 SAMPLE shape
--     (4 modules, 9 placeholder video lessons, 3 quizzes, 15 questions) —
--     the same content the original seed created.
--   * Deletes the final course content (21 lessons, 25 questions) plus this
--     course's lesson_progress and quiz_attempts rows accumulated since 0006.
--   * DOES NOT touch public.certificates.
--
-- ROLLBACK REALITY
--   * This file restores content SHAPE only. The learner history (progress and
--     quiz attempts) deleted by 0006 was disposable test data and is NOT
--     recreated by running this file.
--   * Any real learner progress earned on the final course will be destroyed
--     by this rollback. Prefer a forward fix once real learners exist.

do $$
declare
  v_course_id  uuid;
  v_mod1_id    uuid;
  v_mod2_id    uuid;
  v_mod3_id    uuid;
  v_mod4_id    uuid;
  v_quiz1_id   uuid;
  v_quiz2_id   uuid;
  v_quiz3_id   uuid;
begin
  -- ---------- resolve + lock the course ----------
  select id into v_course_id
  from public.courses
  where slug = 'the-singapore-way'
  for update;

  if v_course_id is null then
    raise exception 'Course "the-singapore-way" not found; nothing to roll back.';
  end if;

  -- ---------- course identity: back to the sample course ----------
  update public.courses
     set title       = 'The Singapore Way Companion Course',
         subtitle    = 'A practical guided course to apply the ideas from the book.',
         description = 'A focused, web-based sample course that walks through the principles in the book and helps you turn them into a plan for your own country, city, organisation, or team.',
         status      = 'published'
   where id = v_course_id;

  -- ---------- remove the final course content, scoped to this course ----------
  delete from public.quiz_questions  where course_id = v_course_id;
  delete from public.quiz_attempts   where course_id = v_course_id;
  delete from public.lesson_progress where course_id = v_course_id;
  delete from public.course_lessons  where course_id = v_course_id;
  delete from public.course_modules  where course_id = v_course_id;

  -- ---------- restore the sample modules ----------
  insert into public.course_modules (course_id, title, description, position)
  values (
    v_course_id,
    'Foundations — Method, not Miracle',
    'Reset your mental model. Singapore is not a miracle to admire — it is a method to learn from.',
    1
  )
  returning id into v_mod1_id;

  insert into public.course_modules (course_id, title, description, position)
  values (
    v_course_id,
    'The Pillars',
    'Five principles that show up across housing, water, education, and governance — and how they reinforce one another.',
    2
  )
  returning id into v_mod2_id;

  insert into public.course_modules (course_id, title, description, position)
  values (
    v_course_id,
    'Adapt — don''t copy',
    'Borrow the root, not the fruit. A simple framework for adapting Singapore''s method to your context.',
    3
  )
  returning id into v_mod3_id;

  insert into public.course_modules (course_id, title, description, position)
  values (
    v_course_id,
    'Apply at home',
    'Turn the framework into a one-page case for change — for your country, your city, your organisation, or your team.',
    4
  )
  returning id into v_mod4_id;

  -- ---------- restore the sample lessons: module 1 ----------
  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, video_url, position, is_required, content)
  values
    (v_course_id, v_mod1_id, 'welcome',
     'Welcome — Why Singapore matters now',
     'How to get the most out of this course and the book it accompanies.',
     'video', null, 1, true,
     'Welcome to the companion course. This first lesson sets the table: what to expect, how to pace yourself, and how the course is built to work alongside the book.'),

    (v_course_id, v_mod1_id, 'method-not-miracle',
     'The mindset shift: Method, not Miracle',
     'The single idea that unlocks every other lesson in this course.',
     'video', null, 2, true,
     'Singapore is widely admired and frequently misunderstood. The headline story treats it as a miracle. This lesson reframes it as a method — a set of repeatable choices that produced repeatable results.');

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, position, is_required, content)
  values
    (v_course_id, v_mod1_id, 'foundations-quiz',
     'Foundations check',
     'A short quiz to make sure the foundations are clear before you go further.',
     'quiz', 3, true,
     null)
  returning id into v_quiz1_id;

  -- ---------- restore the sample lessons: module 2 ----------
  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, video_url, position, is_required, content)
  values
    (v_course_id, v_mod2_id, 'long-term-thinking',
     'Long-term thinking over short-term wins',
     'Why Singapore plans in decades, and what that looks like in practice.',
     'video', null, 1, true,
     'Long-term thinking is not slogan — it is a discipline of sequencing, compounding, and patience that shows up in housing, water, and talent policy.'),

    (v_course_id, v_mod2_id, 'trust-and-governance',
     'Trust, governance, and a meritocratic state',
     'How honest institutions and clear rules compound over time.',
     'video', null, 2, true,
     'Singapore''s institutions are not perfect. They are honest enough that citizens and capital can plan around them. This lesson examines the trade-offs and what to copy.'),

    (v_course_id, v_mod2_id, 'systems-thinking',
     'Systems thinking: housing, water, talent',
     'Three case studies that show one operating system at work.',
     'video', null, 3, true,
     'Three case studies — housing, water, and talent — show how a small set of principles, applied consistently, generated a coherent operating system.');

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, position, is_required, content)
  values
    (v_course_id, v_mod2_id, 'pillars-quiz',
     'Pillars check',
     'A short quiz on the five principles and how they connect.',
     'quiz', 4, true,
     null)
  returning id into v_quiz2_id;

  -- ---------- restore the sample lessons: module 3 ----------
  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, video_url, position, is_required, content)
  values
    (v_course_id, v_mod3_id, 'borrow-the-root',
     'Borrow the root, not the fruit',
     'Why copying policies fails — and what to copy instead.',
     'video', null, 1, true,
     'Copying Singapore''s outputs is a category error. The transferable layer is the underlying reasoning — the "root" — not the surface policy ("fruit").'),

    (v_course_id, v_mod3_id, 'adaptation-playbook',
     'A simple adaptation playbook',
     'A four-step playbook you can use this week.',
     'video', null, 2, true,
     'A four-step playbook: name the principle, audit your context, define the smallest viable intervention, and design for honest measurement.');

  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, position, is_required, content)
  values
    (v_course_id, v_mod3_id, 'adaptation-quiz',
     'Adaptation check',
     'A short quiz to lock in the playbook before you apply it.',
     'quiz', 3, true,
     null)
  returning id into v_quiz3_id;

  -- ---------- restore the sample lessons: module 4 ----------
  insert into public.course_lessons
    (course_id, module_id, slug, title, description, content_type, video_url, position, is_required, content)
  values
    (v_course_id, v_mod4_id, 'build-your-case',
     'Build your case for change',
     'A guided exercise to draft a one-page case using the framework.',
     'video', null, 1, true,
     'A guided exercise that produces a one-page case for change you can take to a stakeholder, a board, or a class.'),

    (v_course_id, v_mod4_id, 'final-reflection',
     'Final reflection and certificate',
     'A short reflection to close the course. Complete the required lessons and quizzes to earn your certificate.',
     'video', null, 2, true,
     'A short reflection on what changed in your thinking. Once you have completed the required lessons and passed every required quiz, your certificate will be issued.');

  -- ---------- restore the sample quiz questions: foundations ----------
  insert into public.quiz_questions
    (course_id, lesson_id, question, choices, correct_choice, explanation, position)
  values
    (v_course_id, v_quiz1_id,
     'What does the phrase "Method, not Miracle" emphasise?',
     '["Singapore''s success was a lucky accident",
       "Singapore''s success was driven by repeatable choices",
       "Singapore''s success is the result of one charismatic leader",
       "Singapore''s success cannot be studied or transferred"]'::jsonb,
     1,
     'The framework treats Singapore as a method — repeatable choices applied with discipline over time, not a one-off miracle.',
     1),

    (v_course_id, v_quiz1_id,
     'The course argues Singapore''s outcomes are best understood as the product of:',
     '["A unique culture that other countries cannot share",
       "Geography and natural resources",
       "Coherent principles applied consistently across decades",
       "Foreign direct investment alone"]'::jsonb,
     2,
     'The thesis is that consistent application of a small set of principles compounded into the outcomes we see today.',
     2),

    (v_course_id, v_quiz1_id,
     '"Borrow the root, not the fruit" means:',
     '["Copy the specific policies Singapore used",
       "Reject Singapore''s lessons because they are context-specific",
       "Translate the underlying reasoning to your context, not the surface policy",
       "Focus only on Singapore''s economic statistics"]'::jsonb,
     2,
     'Surface policies are the "fruit". The reusable "root" is the reasoning behind them.',
     3),

    (v_course_id, v_quiz1_id,
     'Which statement best describes the course''s view of Singapore''s leaders?',
     '["They were lucky beneficiaries of timing",
       "They were ordinary leaders making disciplined choices over decades",
       "They had access to resources unavailable to other countries",
       "They followed a single foreign blueprint"]'::jsonb,
     1,
     'The framework deliberately moves attention from individual heroism to consistent decision-making.',
     4),

    (v_course_id, v_quiz1_id,
     'Why is the mindset shift in this module described as a precondition for the rest of the course?',
     '["Because the rest of the course will not be examinable otherwise",
       "Because without it, every later lesson collapses back into ''miracle'' framing",
       "Because the book contains a quiz on it",
       "Because the certificate depends on this single quiz"]'::jsonb,
     1,
     'If you keep treating Singapore as a miracle, the principles in the later modules read as anecdotes instead of methods.',
     5);

  -- ---------- restore the sample quiz questions: pillars ----------
  insert into public.quiz_questions
    (course_id, lesson_id, question, choices, correct_choice, explanation, position)
  values
    (v_course_id, v_quiz2_id,
     'What unifies the five pillars covered in this module?',
     '["A focus on rapid wins over a single electoral cycle",
       "A commitment to long-term thinking, honest institutions, and systems coherence",
       "An emphasis on foreign aid as the primary lever",
       "A reliance on a single dominant industry"]'::jsonb,
     1,
     'The pillars are different facets of the same operating system — long-term, honest, coherent.',
     1),

    (v_course_id, v_quiz2_id,
     'Long-term thinking in the framework is closest to:',
     '["Patience without a plan",
       "A discipline of sequencing and compounding decisions over decades",
       "A refusal to act until conditions are perfect",
       "Pure ideological commitment to free markets"]'::jsonb,
     1,
     'It is an active discipline — sequence, compound, persist — not passive patience.',
     2),

    (v_course_id, v_quiz2_id,
     'Honest institutions are treated in the course as:',
     '["A nice-to-have feature in mature democracies",
       "A precondition for long-term planning to compound at all",
       "A cultural trait that cannot be designed for",
       "A short-term cost to be tolerated"]'::jsonb,
     1,
     'Without honest institutions, long-term plans never reach the compounding stage.',
     3),

    (v_course_id, v_quiz2_id,
     'Systems thinking in housing means:',
     '["Building as many units as possible without planning",
       "Treating housing as one node in a coherent system with transport, jobs, and schooling",
       "Privatising all housing decisions",
       "Restricting housing to a single income group"]'::jsonb,
     1,
     'The housing case study shows that the unit of analysis is the system, not the building.',
     4),

    (v_course_id, v_quiz2_id,
     'Which of the following best describes the "operating system" framing?',
     '["A list of unrelated best practices",
       "A coherent set of principles that show up across housing, water, talent, and governance",
       "A digital platform Singapore licenses to other countries",
       "A description of the cabinet office"]'::jsonb,
     1,
     'The framing is that the same small set of principles is visible across every domain.',
     5);

  -- ---------- restore the sample quiz questions: adaptation ----------
  insert into public.quiz_questions
    (course_id, lesson_id, question, choices, correct_choice, explanation, position)
  values
    (v_course_id, v_quiz3_id,
     'Adaptation differs from imitation primarily because:',
     '["Adaptation copies policies; imitation copies principles",
       "Adaptation copies principles; imitation copies surface policies",
       "Adaptation only works in democracies",
       "There is no meaningful difference"]'::jsonb,
     1,
     'Adaptation transfers the reusable principle. Imitation copies the policy without the reasoning, and tends to fail.',
     1),

    (v_course_id, v_quiz3_id,
     'The four-step adaptation playbook begins with:',
     '["Naming the principle you want to adapt",
       "Drafting a press release",
       "Hiring a consultancy",
       "Writing the legislation"]'::jsonb,
     0,
     'You cannot adapt what you have not named. Step one is to articulate the principle in plain language.',
     2),

    (v_course_id, v_quiz3_id,
     'A common failure mode when applying Singapore''s model elsewhere is:',
     '["Adapting too slowly",
       "Copying the surface policy without the supporting institutions",
       "Focusing on principles instead of policies",
       "Investing too much in measurement"]'::jsonb,
     1,
     'The classic failure is to import the policy without the institutional preconditions that made it work.',
     3),

    (v_course_id, v_quiz3_id,
     'The right unit of adaptation in the framework is:',
     '["The whole country, all at once",
       "The smallest viable intervention that tests the principle in your context",
       "A symbolic announcement",
       "A blanket policy borrowed from another country"]'::jsonb,
     1,
     'The playbook favours small, honest experiments over large symbolic ones.',
     4),

    (v_course_id, v_quiz3_id,
     'Honest measurement matters in the adaptation playbook because:',
     '["Funders demand it",
       "Without it, you cannot tell whether the adapted principle is actually working",
       "It substitutes for principle",
       "It guarantees political support"]'::jsonb,
     1,
     'Measurement is what converts a pilot into a learning system.',
     5);
end $$;
