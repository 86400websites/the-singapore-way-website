# New Website Setup Gate — [PROJECT_NAME]

Run once after the signed predevelopment handoff. This gate creates the safe delivery foundation; Stage 0 builds the actual barebones website afterward.

## 1. Confirm the handoff

- [ ] Predevelopment Approval Gate is signed.
- [ ] Handoff links the approved sitemap, feature list, flows, design system, mockups, copy, and decisions.
- [ ] No missing decision blocks stack selection or Stage 0.

## 2. Initialize and protect GitHub

- [ ] Create `[REPO_NAME]` on GitHub, initialized with a minimal README so `main` exists.
- [ ] Protect `main` immediately: Pull Request required, required CI checks, no direct or force pushes.
- [ ] Clone the repo and create `[SETUP_BRANCH]` from the latest `main`.
- [ ] Record the branch owner; one worker per branch.

There is no direct-push exception for the scaffold or docs pack.

## 3. Copy a self-contained docs pack

- [ ] `README-TEMPLATE.md` → repo root as `README.md`.
- [ ] `CLAUDE.md` and `AGENTS.md` → repo root.
- [ ] Core development Markdown, including `SPRINT-PROMPT-TEMPLATE.md` and `CODEX-REVIEW-PROMPT.md` → `docs/`.
- [ ] Entire SOP `templates/` folder → `docs/templates/`.
- [ ] Create `docs/sprint-prompts/` and `docs/code-reviews/` with their first real record; do not rely on empty folders surviving Git.

Do not copy the Operating Room workbook into the app repo unless the owner explicitly wants it there.

## 4. Lock decisions before scaffolding

- [ ] Fill `docs/TECH-ARCHITECTURE.md`: actual stack, versions, package manager, commands, routes/shells, host/Preview, data/auth decision, env **names**, and rollback action.
- [ ] Fill `docs/DESIGN.md` from approved design deliverables.
- [ ] Fill `docs/ROADMAP.md` from the approved feature list; Setup Gate precedes Stage 0.
- [ ] Fill `docs/PROJECT-STATUS.md` with current stage, branch, next action, blockers, and record paths.
- [ ] Customize `README.md`, `CLAUDE.md`, and `AGENTS.md`.
- [ ] Search governing files for unresolved `[BRACKETED_PLACEHOLDERS]`; resolve or explicitly mark each optional field `N/A — reason`.

## 5. Scaffold on the setup branch

- [ ] Scaffold only the locked `[TECH_STACK]` with `[PACKAGE_MANAGER]`; do not add optional product features.
- [ ] Create `.env.example` with names and unmistakably fake placeholders only.
- [ ] The owner may create the local live env file outside the AI workflow. Agents never open, print, copy, or edit it.
- [ ] Verify the live env filename is ignored without opening it (for example, `git check-ignore .env.local`) and is not tracked or staged.
- [ ] Run `[TYPECHECK_COMMAND]`, `[LINT_COMMAND]`, `[TEST_COMMAND_OR_N/A]`, and `[BUILD_COMMAND]`.

## 6. Configure CI and the deployed Preview

- [ ] CI uses the locked package manager/version and runs the recorded checks plus secret scanning.
- [ ] Connect `[HOSTING_PROVIDER]` to GitHub. The supplied profile is Vercel; another host must provide equivalent isolated PR Previews.
- [ ] Confirm PR branches create Previews and only `main` deploys Production.
- [ ] Record env names/scopes; the owner sets values in the provider dashboard. Never copy Production credentials into Preview.
- [ ] Prove the Preview pipeline on `[SETUP_BRANCH]` before merge.

## 7. Optional data/auth profile

- [ ] Record `None` if the approved architecture has no database or auth.
- [ ] If Supabase is selected, follow `docs/SUPABASE-VERCEL-SETUP.md`: isolated non-production and Production projects, public/publishable values only in browser code, RLS before user data.
- [ ] If another provider is selected, document its equivalent isolation, access controls, migrations, and recovery plan in `TECH-ARCHITECTURE.md`.

## 8. Pass the setup PR through the full chain

- [ ] Review the changed-file list; only setup, scaffold, and governing-doc files changed.
- [ ] Local checks pass and no live env file or secret-like value is in the diff.
- [ ] Commit/push only if the owner explicitly authorizes both actions.
- [ ] Open the setup PR; CI passes.
- [ ] Test the deployed Preview and record its tested head SHA.
- [ ] Codex reviews the immutable merge-base-to-head range and returns Approve.
- [ ] The owner confirms the head has not changed, merges, and runs the Production smoke test.
- [ ] Update the Operating Room after the repository records are final.

## Exit condition

The protected repo, governing docs, CI, Preview pipeline, and rollback path are ready. No product feature is claimed complete. Begin Stage 0 in `docs/ROADMAP.md`: the smallest complete website with its primary journey working end to end.

**Next:** create `docs/sprint-prompts/[SPRINT_ID]-[SLUG].md` from `docs/templates/CLAUDE-SPRINT-PROMPT-TEMPLATE.md`.
