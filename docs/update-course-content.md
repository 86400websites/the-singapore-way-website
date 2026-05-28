# Updating course content

How to change titles, modules, lessons, quizzes, and the certificate after
launch — safely, without exposing answer keys, and without breaking the
runtime.

The current course is a **sample** designed to make the experience reviewable
end-to-end. Swapping in your real course is a routine content edit: the
schema, RLS posture, and RPC surface do not need to change.

---

## 1. Where content lives

Two sources of truth, and you should update both:

1. **Supabase** — the authoritative production source. Schema lives in
   `supabase/sql/0001_*` through `0005_*`. Content lives in
   `supabase/sql/seed-the-singapore-way.sql`.
2. **Local typed data** — `src/data/course.ts` and `src/lib/course/types.ts`.
   Used as a fallback when Supabase is not configured (dev environments) and
   as the source of *marketing landing copy* (`landing.*`), which is not
   stored in the database.

Database fields *only* in the seed/DB: `content`, `video_url`, quiz
questions, `correct_choice`, explanations.

Local-only fields: `landing` (hero, FAQ, outcomes, audience, instructor
authority, etc.), and the convenience `durationMinutes`.

When you change DB-stored content, edit the seed file (so a fresh project
re-creates the new state) **and** run the appropriate UPDATE in the Supabase
SQL editor against any already-seeded project.

---

## 2. Change course title / subtitle / description

**Local copy** (used on the landing page; affects logged-out and dev runs):

```ts
// src/data/course.ts
const courses: Course[] = [
  {
    slug: 'the-singapore-way',
    title: 'Your new title',         // ← edit
    subtitle: 'Your new subtitle',   // ← edit
    description: 'Your new description', // ← edit
    // ...
  },
]
```

**Seed** (used by a fresh DB):

```sql
-- supabase/sql/seed-the-singapore-way.sql
insert into public.courses (slug, title, subtitle, description, status)
values (
  'the-singapore-way',
  'Your new title',         -- ← edit
  'Your new subtitle',      -- ← edit
  'Your new description',   -- ← edit
  'published'
)
on conflict (slug) do nothing
returning id into v_course_id;
```

**Already-seeded DB** (run once, in Supabase SQL editor):

```sql
update public.courses
set title = 'Your new title',
    subtitle = 'Your new subtitle',
    description = 'Your new description'
where slug = 'the-singapore-way';
```

The slug should stay `the-singapore-way` unless you want every learner's
existing progress, certificate, and bookmarked URLs to break.

---

## 3. Change modules

The local data and seed both order modules by `position` (1, 2, 3, …). Keep
the two in sync.

**Add a module:**
1. Append it to `src/data/course.ts` under `modules`.
2. Add an `insert into public.course_modules` in the seed file under a new
   `v_modN_id` variable.
3. For an already-seeded DB: insert the new module row, capturing the new
   `course_modules.id` for the lesson inserts below.

**Reorder modules:** change the `position` integers. Positions must remain
unique within a course (the `unique (course_id, position)` constraint
enforces this).

**Rename a module:** UPDATE both the local data and the DB row.

**Delete a module:** delete from local data, then in the DB:
```sql
delete from public.course_modules where id = '<module-uuid>';
```
This cascades through lessons, progress, attempts, and questions for that
module's lessons.

---

## 4. Add / edit / reorder lessons

Lesson slugs are visible in URLs (`/courses/the-singapore-way/learn/<slug>`).
Changing a slug breaks existing bookmarks (progress is keyed on lesson UUID,
not slug, so progress survives renames — but a URL using the old slug 404s).

### Lesson `content_type` reference

| `content_type` | Player behaviour |
| --- | --- |
| `video` (the default for the sample course's teaching lessons) | Shows the polished "Video coming soon" placeholder when `video_url` is null. Plays the URL when set. Lesson `content`, if present, renders as **Lesson notes** under the placeholder. |
| `quiz` | Renders the QuizRunner. `content` is ignored. Use only for lessons that genuinely have questions in `quiz_questions`. |
| `text` | Renders the paragraphs in `content` directly. Reserved for written-only lessons. The sample seed does not use this; quizzes and videos cover the current MVP. |

### Replace a "Video coming soon" placeholder with a real video URL

The sample seed leaves every teaching lesson with `video_url = null` so the
placeholder is visible. To swap in a real video for one lesson:

```sql
update public.course_lessons
set video_url = 'https://your-cdn.example.com/lessons/welcome.mp4'
where slug = 'welcome';
```

The current `LessonBody` shows a "Video player will render here." stub when
`video_url` is set — wiring a real `<video>` or HLS player into that branch
is a small UI follow-up. (No security boundary changes are needed: the URL is
already returned only by `get_signed_in_lesson_body`, which is sign-in
gated.)

To swap in real videos for **every** teaching lesson at once:

```sql
update public.course_lessons l
set video_url = case l.slug
  when 'welcome'              then 'https://your-cdn.example.com/welcome.mp4'
  when 'method-not-miracle'   then 'https://your-cdn.example.com/method.mp4'
  when 'long-term-thinking'   then 'https://your-cdn.example.com/long-term.mp4'
  when 'trust-and-governance' then 'https://your-cdn.example.com/trust.mp4'
  when 'systems-thinking'     then 'https://your-cdn.example.com/systems.mp4'
  when 'borrow-the-root'      then 'https://your-cdn.example.com/root.mp4'
  when 'adaptation-playbook'  then 'https://your-cdn.example.com/playbook.mp4'
  when 'build-your-case'      then 'https://your-cdn.example.com/case.mp4'
  when 'final-reflection'     then 'https://your-cdn.example.com/reflection.mp4'
end
from public.courses c
where l.course_id = c.id
  and c.slug = 'the-singapore-way'
  and l.content_type = 'video';
```

Quiz lessons are not touched by this UPDATE (the `content_type = 'video'`
filter keeps them safe).

### Repair an already-seeded DB so every teaching lesson is a video lesson

If you applied an older seed where some teaching lessons were still
`content_type = 'text'`, run this once. Quizzes are explicitly excluded:

```sql
update public.course_lessons l
set
  content_type = 'video',
  video_url    = null
from public.courses c
where l.course_id = c.id
  and c.slug = 'the-singapore-way'
  and l.content_type <> 'quiz';
```

Then verify the lesson-type counts:

```sql
select l.content_type, count(*) as lesson_count
from public.course_lessons l
join public.courses c on c.id = l.course_id
where c.slug = 'the-singapore-way'
group by l.content_type
order by l.content_type;
-- expect:
--   quiz  | 3
--   video | 9
```

### Add a lesson

Do all three:

1. Append it to the matching `module.lessons` array in `src/data/course.ts`.
   Set `contentType` to `'video'` (the default for teaching lessons) or
   `'quiz'`. For a video lesson, include `videoUrl: null` to show the
   placeholder, or a real URL string.
2. Append a matching `insert into public.course_lessons` in the seed.
3. For an already-seeded DB, run the same insert manually.

### Edit a video lesson's notes (the `content` column)

- Local: change the `content` string in `src/data/course.ts`.
- Seed: change the `content` literal.
- Already-seeded DB:
  ```sql
  update public.course_lessons
  set content = $$your new notes, dollar-quoted so single quotes are fine$$
  where slug = 'the-lesson-slug';
  ```
The notes render under the video / placeholder, labelled "Lesson notes".

### Reorder lessons within a module

Update `position` on the lessons in question. Positions must remain unique
within their module.

### Mark a lesson optional

Set `isRequired: false` in local data and `is_required = false` in the DB.
The certificate function (and the progress bar) will exclude it from the
required-count.

---

## 5. Add / edit quizzes

Quizzes are an array of `quiz_questions` rows linked to a lesson whose
`content_type = 'quiz'`. The lesson holds the title and description; the
questions hold the prompts, the choices, the correct index, and an optional
explanation.

**Pass threshold** is `80`, hard-coded in
[`supabase/sql/0005_course_mvp_open_access_sample.sql`](../supabase/sql/0005_course_mvp_open_access_sample.sql)
inside `submit_quiz_attempt`. If you change it, change it there only — there
is no client-side copy of the threshold that affects grading.

**Add a question** to an already-seeded DB:

```sql
insert into public.quiz_questions
  (course_id, lesson_id, question, choices, correct_choice, explanation, position)
values (
  (select id from public.courses where slug = 'the-singapore-way'),
  (select id from public.course_lessons where slug = 'foundations-quiz'),
  'Your question text',
  '["Choice A", "Choice B", "Choice C", "Choice D"]'::jsonb,
  1,                            -- ← zero-indexed: 0 = A, 1 = B, 2 = C, 3 = D
  'Why B is right.',            -- ← optional explanation
  6                             -- ← position; must be unique within the lesson
);
```

**Edit the correct answer:**

```sql
update public.quiz_questions
set correct_choice = 2
where lesson_id = (select id from public.course_lessons where slug = 'foundations-quiz')
  and position = 3;
```

**Re-add the same question to the seed** so a fresh project starts in the
right state.

---

## 6. Set correct answers safely

The single rule: **`correct_choice` must never travel to the browser.**

The architecture already enforces this:

- The client-bound type [`QuizQuestionForClient`](../src/lib/course/types.ts)
  has no `correctChoice` field.
- The RPC `get_signed_in_quiz_questions` selects only `id, question, choices,
  question_position`. It does not return `correct_choice`.
- The Server Action `submitQuizAttempt` does NOT read `correct_choice` from
  the table — it calls `submit_quiz_attempt`, which reads the answer key
  inside the SECURITY DEFINER function and returns only `{score, passed,
  total, correct}`.
- RLS on `quiz_questions` denies all direct SELECT.

To verify after a content change:

```bash
# No client-bound code should reference correct_choice.
# These three comment matches in src/ are the only acceptable hits.
git grep "correct_choice" src
```

If `git grep` shows anything more than the three documentation comments in
`actions.ts`, `queries.ts`, and `types.ts`, something is wrong.

---

## 7. Update certificate text / branding

The certificate UI is in
[`src/components/course/CertificateView.tsx`](../src/components/course/CertificateView.tsx).
It renders:

- Site logo (`/assets/logo/logo-red.png`).
- "Certificate of Completion" eyebrow.
- Learner display name (from `auth.users.raw_user_meta_data.full_name`, or
  "Learner" on the own-cert page / "Verified learner" on the public verify
  page when no full name is set).
- Course title.
- "Date issued".
- "Certificate code" (the certificate UUID — also the public verify URL).
- A "Verified" badge on the public verify variant.

**To swap the logo:** drop a new file into
`public/assets/logo/logo-red.png`. Keep the same dimensions and the same
filename — code references it as a static path.

**To change the eyebrow / heading / labels:** edit
`CertificateView.tsx` directly. Re-run `pnpm run build` after.

**To change the display-name fallback:** the public fallback is hard-coded
in `get_public_certificate()` inside
[`0005_course_mvp_open_access_sample.sql`](../supabase/sql/0005_course_mvp_open_access_sample.sql).
Change the `'Verified learner'` literal there and re-apply the file. The
owner-side fallback is in
[`getLearnerDisplayName`](../src/lib/course/queries.ts) and currently
returns `'Learner'`.

**To require a real display name before issuing a certificate:** ask the
learner for their full name on the certificate page (small client form that
calls `supabase.auth.updateUser({ data: { full_name } })`), then re-render.
The current MVP does not do this; it is the recommended Sprint-11 polish.

---

## 8. Test after edits

After any content change, in order:

1. `pnpm run typecheck` — passes.
2. `pnpm run lint` — passes.
3. `pnpm run build` — passes cleanly.
4. Re-apply the relevant DB UPDATE (or re-seed in a fresh dev project).
5. Walk through the affected route in the browser:
   - Landing → CTA still resolves to a valid first lesson.
   - Player sidebar still shows every lesson, in the right order.
   - Edited lesson body renders.
   - Quizzes: take with deliberately wrong answers, then with correct
     answers. Confirm 80% threshold still triggers a pass at the right
     count.
   - Certificate: complete the course on a test account, confirm the
     cert page renders and the public verify URL works.
6. In DevTools → Sources, search the JS bundle for `correct_choice`. No
   result expected.

---

## 9. Avoiding answer-key exposure

Things that would expose an answer key (don't do these):

- Add `correctChoice` to `QuizQuestionForClient`.
- Pass `correct_choice` from a Server Component as a prop into a Client
  Component.
- Call `.from('quiz_questions').select('correct_choice')` from anywhere in
  `src/`.
- Add a new server action that returns the correct index.
- Re-enable the old `quiz_questions_select_enrolled` RLS policy.

Things that are safe:

- Read `correct_choice` inside `submit_quiz_attempt()` (SQL, inside the
  `SECURITY DEFINER` function).
- Keep `correct_choice` in `correct_choice` documentation comments inside
  `src/`.

---

## 10. Pre-push checklist (content edit)

- [ ] Local data and seed both updated; no drift.
- [ ] Already-seeded DB updated with the same change (UPDATE statements
      saved in your runbook).
- [ ] `pnpm run typecheck && pnpm run lint && pnpm run build` all pass.
- [ ] `git grep "correct_choice" src` shows only the three documentation
      comments.
- [ ] Walked the affected route in the browser.
- [ ] `git status` clean of `.env.local`, `.pnpm-store/`, `.next/`,
      `tsconfig.tsbuildinfo`.
- [ ] Open PR; let CI run; check Vercel Preview.

If anything fails, do not push.
