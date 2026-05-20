# Singapore Way Website — Claude Code Instructions

## Project context

This repository contains the Singapore Way website originally built in Replit and now pushed to GitHub.

GitHub is the source of truth. Replit is used for previewing, running, testing, and publishing the website. Claude Code is used for focused code changes, debugging, cleanup, and improvements.

## Core workflow

Before making changes:

1. Inspect the repository structure.
2. Identify the framework, package manager, scripts, and app entry points.
3. Read the relevant files before editing.
4. Summarize the intended change briefly.
5. Keep the task focused.

When making changes:

1. Work only on the current branch.
2. Do not make unrelated refactors.
3. Do not change unrelated UI, copy, routing, environment variables, or project structure unless required.
4. Preserve the current website behavior unless the requested task explicitly changes it.
5. Follow the existing coding style and file organization.
6. Avoid adding new dependencies unless clearly necessary.
7. Never hardcode secrets, API keys, tokens, credentials, or private URLs.
8. Use environment variables for secrets or configuration that should not be committed.

After making changes:

1. Run the relevant checks available in the repo, such as install, lint, typecheck, test, or build commands.
2. If no formal tests exist, run the app/build command and explain what was verified.
3. Fix errors caused by the change.
4. Do not ignore failing checks.
5. If a check fails for a pre-existing reason, explain that clearly.

## Git rules

GitHub main is the stable branch.

Preferred process:

1. Start from latest main.
2. Create or use a focused task branch.
3. Make the requested change.
4. Test locally.
5. Commit with a clear message.
6. Push the branch or prepare changes for review.
7. Merge into main only after review/testing.

Do not push directly to main unless I explicitly ask for direct-to-main changes.

Use branch names like:

- `claude/fix-mobile-header`
- `claude/update-homepage-copy`
- `claude/improve-contact-section`
- `claude/fix-build-error`

Use commit messages like:

- `Fix mobile header layout`
- `Update homepage section copy`
- `Improve contact form validation`
- `Fix production build error`

## Replit compatibility

This project was originally built in Replit, so preserve Replit compatibility.

Do not remove Replit-specific files or configuration unless they are clearly obsolete and you explain why.

If changing run/build configuration, consider whether the app will still run in Replit.

## Output format after each task

At the end of every task, respond with:

1. Summary of what changed.
2. Files changed.
3. Commands/checks run.
4. Results of those checks.
5. Any risks or follow-up items.
6. Suggested commit message.

## Clarification behavior

If the task is clear, proceed.

Ask a clarification question only if the missing information would significantly change the implementation.

When in doubt, choose the smallest safe change.