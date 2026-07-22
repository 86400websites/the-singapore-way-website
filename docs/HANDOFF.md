# Handoff

*Not at handoff stage — fill the remaining fields when handoff is scheduled.*

How to hand The Singapore Way over to Maher Kaddoura (or an incoming team) so they own everything,
nothing depends on you personally, and the site stays maintainable.

## 1. Accounts and access inventory

Fill this table first. Every row must end up owned by the client.

| Service | Account | Owner after handoff | How transferred |
|---|---|---|---|
| GitHub — [`86400websites/the-singapore-way-website`](https://github.com/86400websites/the-singapore-way-website) | `86400websites` org | Maher Kaddoura | N/A — not at handoff stage |
| Hosting — Vercel | N/A — not at handoff stage | Maher Kaddoura | N/A — not at handoff stage |
| Domain registrar — `thesingaporeway.com` (registrar: TBD-OWNER: registrar name) | N/A — not at handoff stage | Maher Kaddoura | N/A — not at handoff stage |
| Database/auth — Supabase | N/A — not at handoff stage | Maher Kaddoura | N/A — not at handoff stage |
| Newsletter — Mailchimp (`/api/newsletter`) | N/A — not at handoff stage | Maher Kaddoura | N/A — not at handoff stage |
| Contact email — Resend (`/api/contact`) | N/A — not at handoff stage | Maher Kaddoura | N/A — not at handoff stage |
| Analytics — PostHog | N/A — not at handoff stage | Maher Kaddoura | N/A — not at handoff stage |
| Error tracking — Sentry | N/A — not at handoff stage | Maher Kaddoura | N/A — not at handoff stage |
| Rate limiting — Upstash Redis | N/A — not at handoff stage | Maher Kaddoura | N/A — not at handoff stage |
| Bot protection — Cloudflare Turnstile | N/A — not at handoff stage | Maher Kaddoura | N/A — not at handoff stage |

Inventory notes:

- `thesingaporeway.com` is registered but NOT yet connected to the site — production today is `https://the-singapore-way-website.vercel.app`; real-domain migration is a backlog item in [`ROADMAP.md`](./ROADMAP.md).
- One Supabase project serves all environments (local/Preview/Production) — recorded as an accepted risk with an open decision to split, tracked in [`ROADMAP.md`](./ROADMAP.md).

- [ ] Every service used by the site appears in the table — check the env variable names in [`.env.example`](../.env.example) for ones you forgot.
- [ ] Each row states WHO owns it and HOW it was transferred or shared.

**Why this matters:** the most common post-handoff failure is a renewal or password owned by someone who left.

## 2. Credentials handling

- [ ] Never email or message passwords in plain text — use a password manager share or the provider's own invite/transfer flow.
- [ ] The client owns their accounts. You are removed, or downgraded to the minimum agreed role, at handoff.
- [ ] Rotate anything that was shared during the build: API keys, tokens, any password more than one person saw.
- [ ] After rotation, update the values in the host's env vars (and redeploy) — never in committed files.
- [ ] Confirm billing on every service points at the client's payment method, not yours.

**Never do this:**
- Never keep silent admin access "just in case" — access after handoff is agreed in writing or removed.
- Never hand over a key that was ever pasted into a chat without rotating it first.

## 3. Docs handoff — the repo docs pack IS the manual

There is no separate manual to write. Walk the client (or their next developer) through:

- [ ] [`README.md`](../README.md) — what the project is, how to run it, where everything lives.
- [ ] [`PROJECT-STATUS.md`](./PROJECT-STATUS.md) — the current state and the decision log (why things are the way they are).
- [ ] [`ROADMAP.md`](./ROADMAP.md) — the post-launch backlog: what was deliberately deferred and where it's tracked.
- [ ] [`WORKFLOW.md`](./WORKFLOW.md) — how changes are made safely (their next developer starts here).
- [ ] Env vars: [`.env.example`](../.env.example) lists every name; values live only in approved local/host secret stores and are never shown during the walkthrough.
- [ ] 30–60 minute walkthrough call: run the site locally, make a trivial change on a branch, open a PR, show the Preview.

## 4. Maintenance notes (leave these in writing)

- [ ] **How to request changes:** one change = one branch = one PR — even post-handoff, even for a typo.
      The workflow chain still applies: branch → build → local checks → PR → tested Vercel Preview → Codex review → owner merge → Production smoke test.
- [ ] **Dependency updates:** agree a cadence (e.g. monthly), always on a branch, always Preview-tested before merge.
- [ ] **When Production breaks:** who to call (name + channel), the host rollback action, the Git revert path, and database recovery limits in [`ROLLBACK.md`](./ROLLBACK.md).
- [ ] **Content edits:** canonical source, editor roles, draft/review/publish flow, media ownership, redirects, and backup/export process (for this site: blog posts live in `src/data/blogPosts.ts`; course content is edited per [`update-course-content.md`](./update-course-content.md)). Approved launch copy changes deliberately, not ad hoc in components.
- [ ] **Locked facts/numbers:** hand over the list of exact claims the site makes so future edits keep them consistent.

## 5. Final checklist and sign-off

- [ ] All accounts transferred per §1; your access removed or downgraded as agreed.
- [ ] All shared credentials rotated per §2.
- [ ] Docs walkthrough completed; client knows where the manual lives.
- [ ] Maintenance notes delivered in writing.
- [ ] Open items from the backlog reviewed with the client — nothing surprising left.

**Sign-off**

| | Name | Date | Signature |
|---|---|---|---|
| Delivered by | | N/A — not at handoff stage | |
| Accepted by (Maher Kaddoura) | | N/A — not at handoff stage | |

Next step → project closed. Future work re-enters through [`WORKFLOW.md`](./WORKFLOW.md), one branch at a time.
