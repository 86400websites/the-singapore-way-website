# Supabase MCP Safety & Governance

> The rulebook for how Claude Code (and any agent) may use the **Supabase MCP** in this repo. Companion to [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md), [`SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md), [`SECURITY-CHECKLIST.md`](./SECURITY-CHECKLIST.md), [`WORKFLOW.md`](./WORKFLOW.md), [`../supabase/sql/README.md`](../supabase/sql/README.md), and the agent rules in [`../CLAUDE.md`](../CLAUDE.md) / [`../AGENTS.md`](../AGENTS.md).

## Purpose

The Supabase MCP lets Claude talk to the Supabase project **directly** — list tables, read rows, inspect schema/RLS, read logs. This repo wires **exactly one** connection, deliberately the least-powerful one that still does the job:

| Connection | Database | Power | Claude may… |
|---|---|---|---|
| `supabase-prod-readonly` | The single shared project (serves local / Preview / Production — see decision **D-2**) | **Read only** | Verify (read) after the owner runs SQL by hand. **Never write.** |

There is deliberately **no write connection and no separate test connection** in this repo today — one Supabase project serves every environment (accepted interim risk **D-2**). This can change later: if a genuinely separate **test** project is created, add a read+write `supabase-test` connection scoped to *that* project, following the same pattern. **Never point a write connection at the shared/production project.**

The governing principle that never changes:

> **Claude drafts SQL as numbered files in `supabase/sql/` and proves them by reasoning + review — it does NOT execute them through any MCP. The owner runs every change by hand in the Supabase SQL Editor. Claude may _verify_ the result read-only, but never _change_ it.**

Because one project serves all environments here, the usual "prove on test, ship to prod" split is **not available**. The compensating rule is therefore **stricter**: Claude has **no write path to the database at all**; the owner is the sole applier. This matches decision **D-pre-b** (hand-applied numbered SQL, no Supabase CLI).

---

## 1. The non-negotiables (🔴 = never violate)

- [ ] 🔴 `supabase-prod-readonly` is **read-only** (`read_only=true`) and scoped (`project_ref=kdawymeskszjfqbbcknj`). Claude **cannot** write, update, delete, or drop through the MCP — ever.
- [ ] 🔴 **Claude never writes to the database through any channel.** Every change is run **by the owner**, by hand, in the Supabase SQL Editor.
- [ ] 🔴 The connection authenticates via Supabase **browser login (OAuth)** — **no** secret key / `service_role` / JWT secret / DB password / personal access token in `.env.local` or `.mcp.json`.
- [ ] 🔴 `.mcp.json` is **committed** (it holds only the hosted MCP URL + project ref + `read_only` flag — safe). **No secret ever goes in it.**
- [ ] 🔴 The connection is **named unmistakably** — `supabase-prod-readonly` — never a bare, ambiguous `supabase`.
- [ ] 🔴 **No write/test connection is added against the shared project.** A write connection may only ever point at a genuinely separate non-production project.

If any box can't be ticked, **stop and fix the connection before using the MCP**.

---

## 2. `supabase-prod-readonly` — what Claude may do (read only)

- **Verify after the owner's manual run** — read tables/rows/counts to confirm the hand-applied SQL landed correctly.
- **Read schema / RLS** to compare intended vs actual before and after the owner ships.
- **Read logs / advisors** for debugging and [`SECURITY-CHECKLIST.md`](./SECURITY-CHECKLIST.md) inputs.

Claude must **never** (there is no test DB to fall back to):
- ✗ Run `INSERT` / `UPDATE` / `DELETE` / `DROP` / `ALTER` / `TRUNCATE` / any migration.
- ✗ Apply schema or RLS changes.
- ✗ Anything that isn't a pure read. (`read_only=true` enforces this; the rule restates intent so it is never ambiguous.)

---

## 3. The standard loop (how a DB task actually runs here)

1. **Look (read-only).** Inspect the real schema/RLS via `supabase-prod-readonly`. Never assume names.
2. **Draft in files.** Write the SQL as a numbered file in `supabase/sql/` **+ paired `.down.sql` + RLS**, per [`../supabase/sql/README.md`](../supabase/sql/README.md) and [`WORKFLOW.md`](./WORKFLOW.md). **Do NOT execute it via MCP.**
3. **Explain** in plain language what it does and the rollback. Flag anything destructive loudly; classify additive / reversible / destructive.
4. **Owner ships.** The **owner** runs the saved, verified SQL on the project by hand via the SQL Editor. Claude does **not**.
5. **Verify (read-only).** Claude reads the project through `supabase-prod-readonly` to confirm it landed as intended.
6. **Record** anything noteworthy (schema change, new RLS) so the docs stay accurate.

> Golden line: **Claude drafts and proves on files; the owner ships; Claude verifies read-only.**

---

## 4. Connection setup (one-time per repo, then committed)

Committed in `.mcp.json` at the repo root — equivalent to running this once with `--scope project`:

```bash
# PRODUCTION (single shared project) — READ-ONLY, scoped, committed
claude mcp add --scope project --transport http supabase-prod-readonly \
  "https://mcp.supabase.com/mcp?project_ref=kdawymeskszjfqbbcknj&read_only=true"
```

Then authenticate (browser login — no token to copy):
- Run `/mcp`, select `supabase-prod-readonly`, authenticate. Choose the **org that owns this project**.
- New servers are picked up on the next message — no restart needed (a fresh clone approves the project-scoped server once).

**Verify the guardrail before trusting it:**
- [ ] `claude mcp list` shows `supabase-prod-readonly` connected.
- [ ] "List the tables — use MCP tools" returns this project's schema (`courses`, `course_lessons`, …).
- [ ] A trivial write is **refused** (read-only proof) — the critical test.
- [ ] The connected project ref is `kdawymeskszjfqbbcknj`.

### Fresh-clone checklist (every new machine / clone)
- [ ] Open the repo in the IDE → approve the project-scoped server when prompted (the one-time trust gate).
- [ ] `/mcp` → authenticate via browser.
- [ ] Re-run the read-only write-refusal test above.

---

## 5. Pre-use quick gate (before each MCP-assisted DB task)

1. 🔴 The only connection is read-only; no write is aimed at the database through any channel.
2. Final SQL is saved to `supabase/sql/` with `.down.sql` + RLS before the owner ships.
3. No secret appears in chat, files, `.mcp.json`, or the diff.
4. Production verification is read-only, done **after** the owner's manual run.

## 6. Red flags — stop immediately

- A write is about to run through the MCP, or the `read_only` flag is missing from the URL.
- The connection is missing its `project_ref`, or a write connection is pointed at the shared project.
- Claude proposes to "just run it for you" against the database.
- Any request to read, print, or store a secret / `service_role` key / DB password / PAT, or to put one in `.mcp.json`.
- The connected project ref doesn't match `kdawymeskszjfqbbcknj`.

On any red flag: stop, re-check §1, and fall back to the fully manual flow.

---

## 7. Project values (this repo)

- **Production (shared) project ref:** `kdawymeskszjfqbbcknj`
- **Test project ref:** *none* — one shared project serves all environments (open decision **D-2** to split test/prod)
- **Supabase SQL folder:** `supabase/sql/`
- **Tables to routinely verify:** `public.courses`, `public.course_modules`, `public.course_lessons`, `public.quiz_questions`, `public.lesson_progress`, `public.quiz_attempts`, `public.certificates`.
- **Answer-key invariant:** `public.quiz_questions.correct_choice` must never be exposed to any client query, prop, or bundle — verify it stays DB-only (read-only spot checks are fine).

> Keep this file in sync with [`SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md) and [`SECURITY-CHECKLIST.md`](./SECURITY-CHECKLIST.md). When any two disagree, [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md) is the source of truth.
