# Singapore Way Website — Agent Instructions

## Repository purpose

This repository contains the Singapore Way website. The project was originally created in Replit and is now stored in GitHub.

GitHub is the source of truth. Replit is used for running, previewing, testing, and publishing. Coding agents should make focused, reviewable changes.

## Working agreements

Before editing:

- Inspect the repository structure.
- Detect the framework, package manager, scripts, and app entry points.
- Read relevant files before changing them.
- Explain the planned change briefly.
- Keep the scope narrow.

While editing:

- Make the smallest safe change that solves the task.
- Follow existing code style and file organization.
- Do not make unrelated refactors.
- Do not change unrelated copy, layout, routing, configs, or dependencies.
- Do not add new production dependencies unless necessary.
- Do not hardcode secrets, credentials, API keys, tokens, or private URLs.
- Preserve Replit compatibility.

After editing:

- Run the relevant available checks, such as lint, typecheck, tests, or build.
- If the repository has no formal test setup, run the app/build command when possible.
- Fix failures caused by the change.
- Clearly identify any pre-existing failures.
- Summarize the final result.

## Git workflow

GitHub main is the stable branch.

Default workflow:

1. Start from the latest main branch.
2. Create a focused task branch.
3. Make the requested changes.
4. Run checks.
5. Commit with a clear message.
6. Push the branch.
7. Open or prepare a pull request into main.

Do not merge automatically unless explicitly instructed.

Do not allow multiple agents to work on the same branch at the same time.

Suggested branch names:

- `codex/fix-mobile-header`
- `codex/update-homepage-copy`
- `codex/improve-contact-section`
- `codex/fix-build-error`

Suggested commit messages:

- `Fix mobile header layout`
- `Update homepage copy`
- `Improve contact section`
- `Fix build error`

## Completion response

At the end of a task, provide:

1. Summary.
2. Files changed.
3. Checks run.
4. Check results.
5. Risks or follow-up items.
6. Suggested PR title and description.