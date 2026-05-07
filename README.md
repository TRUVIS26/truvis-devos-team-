# TRUVIS DevOs Team

A multi-subagent development workflow extracted from a real Next.js + Prisma + Supabase production project. Drop it into any new project and you get a 6-agent team — Architect, Tech Lead, Frontend Dev, Backend Dev, QA Engineer, Docs-Sync — Orchestrated by a single `/develop-next-module` slash command.

## What ships in this repo

- `.claude/agents/*.md` — 6 specialised agent SKILL files
- `.claude/commands/develop-next-module.md` — slash command that kicks off the per-module workflow
- `lib/audit/log.ts` — audit-log primitives (`writeAuditLog`, `withAuditedMutation`)
- `lib/notifications/idempotency.ts` — idempotency-key helpers
- `lib/validate/params.ts` — shared param validators (`isUuid`)
- `lib/public/constants.ts` — `FORBIDDEN_FIELD_SET` privacy gate (per-project — fill in your fields)
- `lib/public/example.ts` — `toPublic<Model>` privacy-strip template
- `scripts/check-foundations.ts` — Phase-0 gate run by the Tech Lead at session start
- `scripts/check-architect-triggers.ts` — 11-rule architect-escalation trigger detector
- `scripts/check-migration-safety.ts` — Postgres migration safety linter
- `scripts/check-env-readiness.ts` — env-var readiness gate
- `scripts/_qa/assert.ts` — QA test helpers
- `docs/development-workflow.md` — workflow SOP
- `docs/adr/INDEX.md` + ADR-0001 (legacy Nygard) + ADR-0002 (MADR v4 template)
- Templates: `PROJECT.template.md`, `CLAUDE.template.md`, `AGENTS.template.md`, `MANUAL_QA_BACKLOG.template.md`, `package.template.json`
- `.env.example` — required env-var list with placeholder values
- `docker/Dockerfile` + `docker/docker-compose.yml` — container setup for local dev
- `scripts/healthcheck.sh` — container health probe

## Stack assumption

Next.js 16+ App Router · React 19 · TypeScript 5 strict · Prisma 7 + Postgres · Supabase Auth + Storage · Vercel deploy. Most of the team is reusable across stacks, but the lib primitives, scripts, and agent file-ownership rules assume the above stack.

## Quickstart (drop-in retrofit)

1. Clone this repo locally:
   ```bash
   git clone git@github.com:truvis25/truvis-devos-team-.git
   ```
2. Read [`INSTALL.md`](./INSTALL.md) — full retrofit recipe (≈10 minutes per project).
3. In your target project, fill in `PROJECT.md` from the template and populate `lib/public/constants.ts` with your project's internal-only field names.
4. Run `npm run check:foundations` in the target project. If it returns `OK`, you're ready.
5. In Claude Code (or claude.ai/code in the target project), type `/develop-next-module` — Tech Lead asks the user to confirm the next module pick and runs the 12-step sequence end-to-end.

## How the team works

```
User: /develop-next-module
  │
  ▼
[Tech Lead]  picks next launch-checklist item (PROJECT.md tells it where the checklist lives)
  │           writes Module Spec at .claude/scratch/module-<slug>-spec.md
  │           inserts <!-- PROJECT:<slug> --> anchor in CLAUDE.md
  │           runs scripts/check-architect-triggers.ts
  │
  ├──> [Architect] (only if triggers fire) — opus model, ≤500 word output
  │
  ▼
[Tech Lead]  branch + draft PR
  │           dispatches FE + BE in parallel (or be-first / be-first-stub)
  │
  ▼
[QA Engineer]  regression suite + adversarial scenarios + riskTag bug blocks
  │             may SELF_PROMOTE_OPUS for b��2 concurrency / payment scenarios
  │
  ▼
[Docs-Sync]  CLAUDE.md + launch-checklist + external spec + PR description sync
  │
  ▼
[Tech Lead]  sign-off → reports PR # + manual gap list + risk: <NONE|PRIVACY|AUTH|DATA>
```

## Per-issue triage (the most valuable rule in the playbook)

Every signal — bug fix, restyle, refactor, schema change, new feature — routes through Tech Lead. **Tech Lead then triages each sub-task and dispatches the right specialists only:** FE-only for restyles, BE-only for query bugs, FE+BE for cross-surface changes, Architect+BE+QA-Opus for auth / privacy / payment, full team for schema changes or new modules.

Blanket-dispatching every agent on every cycle was the original mistake. The smart rule is: every signal routes through Tech Lead, but Tech Lead right-sizes the dispatch. Full classification table lives in `.claude/agents/tech-lead.md` under "Per-issue triage".

## Repo updates

When you discover an improvement to the playbook in your downstream project (a new triage rule, a missing trigger, a tighter regression script), open a PR back to `truvis25/truvis-devos-team-`. The team gets smarter with every cycle.
