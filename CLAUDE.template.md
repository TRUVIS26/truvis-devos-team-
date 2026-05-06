# CLAUDE.md — [Your Project Name]

> Copy this file to `CLAUDE.md` in your target project root and fill in the
> placeholders. The two critical sections are "Operating mode" and "Launch status".
> Delete these instructions when done.

---

## Operating mode

Every inbound signal routes through **Tech Lead**. Tech Lead triages and dispatches
the right specialists. Do not bypass Tech Lead to talk directly to a specialist
agent — routing everything through Tech Lead is what keeps the Module Spec,
CLAUDE.md anchors, and QA chain consistent.

To start the per-module development cycle, use `/develop-next-module`.

---

## Project

- **Name:** `<your-project-name>`
- **Stack:** Next.js 16 App Router · React 19 · TypeScript 5 strict · Prisma 7 · Supabase Auth · Vercel
- **Launch checklist:** see `PROJECT.md → launchChecklistPath`

---

## Key paths

| Purpose | Path |
|---|---|
| App routes | `app/` |
| API routes | `app/api/` |
| Server actions | `app/**/actions.ts` |
| Shared components | `components/` |
| DB schema | `prisma/schema.prisma` |
| Migrations | `supabase/migrations/` |
| Auth helpers | `lib/supabase/` |
| Audit log | `lib/audit/log.ts` |
| Privacy gate | `lib/public/constants.ts` |
| Env example | `.env.example` |

---

## Invariants (never break these)

1. Every mutation on a sensitive table calls `withAuditedMutation`.
2. Every API response is filtered through `FORBIDDEN_FIELD_SET`.
3. Every migration runs `npm run lint:migrations` before merging.
4. `npm run check:foundations` passes before any build agent starts.
5. No `console.log` in production code.

---

## Launch status

> Tech Lead inserts `<!-- PROJECT:<slug> -->` anchors here when modules are in flight.
> Docs-Sync updates the status lines when modules ship.

### In-flight modules

<!-- Add in-flight module anchors below this line. Tech Lead manages this section. -->

---

## Completed modules

<!-- Docs-Sync appends shipped modules here. -->
