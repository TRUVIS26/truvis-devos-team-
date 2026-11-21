# Install — drop-in retrofit recipe

How to add the TRUVIS DevOs Team to an existing Next.js + Prisma + Supabase project. Time: ≈10 minutes.

## Pre-flight

Confirm the target project has:

- Next.js 16+ App Router (`app/` directory).
- React 19.
- Prisma 7 + Postgres + `@prisma/client` already installed.
- Supabase Auth wired (`lib/supabase/server.ts`, cookie-based SSR).
- TypeScript strict mode enabled.

If your project deviates from this stack, the lib primitives and scripts may need light edits (e.g. swap Prisma for Drizzle in `lib/audit/log.ts`). The agent SKILL files are stack-agnostic enough to survive minor drift.

## Step 1 — Copy the team folders into your target project

From a clone of `TRUVIS26/truvis-devos-team-` and the target-project root:

```bash
TEAM=/path/to/truvis-devos-team-          # this repo (note trailing hyphen)
TARGET=/path/to/your-project              # your project

# Agents + slash command
mkdir -p $TARGET/.claude/agents $TARGET/.claude/commands
cp $TEAM/.claude/agents/*.md       $TARGET/.claude/agents/
cp $TEAM/.claude/commands/*.md     $TARGET/.claude/commands/
# Optional: create a per-project .claude/settings.local.json if you want
# to pre-allow specific Bash patterns for the team. This file is per-env
# and globally git-ignored on most setups, so it does NOT ship in this
# repo. Example contents:
#   {"permissions":{"allow":["Bash(mkdir -p .claude/scratch)"]}}

# Scripts
mkdir -p $TARGET/scripts/_qa
cp $TEAM/scripts/check-foundations.ts        $TARGET/scripts/
cp $TEAM/scripts/check-architect-triggers.ts $TARGET/scripts/
cp $TEAM/scripts/check-migration-safety.ts   $TARGET/scripts/
cp $TEAM/scripts/check-env-readiness.ts      $TARGET/scripts/
cp $TEAM/scripts/_qa/assert.ts               $TARGET/scripts/_qa/

# Lib primitives
mkdir -p $TARGET/lib/audit $TARGET/lib/notifications $TARGET/lib/validate $TARGET/lib/public
cp $TEAM/lib/audit/log.ts               $TARGET/lib/audit/log.ts
cp $TEAM/lib/notifications/idempotency.ts $TARGET/lib/notifications/idempotency.ts
cp $TEAM/lib/validate/params.ts         $TARGET/lib/validate/params.ts
# Only copy constants.ts if it doesn't exist — otherwise extend in place.
[ -e $TARGET/lib/public/constants.ts ] || cp $TEAM/lib/public/constants.ts $TARGET/lib/public/constants.ts
cp $TEAM/lib/public/example.ts $TARGET/lib/public/example.ts

# Env example and QA backlog (required by gate scripts)
[ -e $TARGET/.env.example ] || cp $TEAM/.env.example $TARGET/.env.example
[ -e $TARGET/MANUAL_QA_BACKLOG.md ] || cp $TEAM/MANUAL_QA_BACKLOG.template.md $TARGET/MANUAL_QA_BACKLOG.md

# Docs
mkdir -p $TARGET/docs/adr
cp $TEAM/docs/development-workflow.md            $TARGET/docs/development-workflow.md
[ -e $TARGET/docs/adr/INDEX.md ] || cp $TEAM/docs/adr/INDEX.md $TARGET/docs/adr/INDEX.md
[ -e $TARGET/docs/adr/0001-foundation-primitives.md ] || cp $TEAM/docs/adr/0001-foundation-primitives.md $TARGET/docs/adr/
[ -e $TARGET/docs/adr/0002-madr-v4-template.md ] || cp $TEAM/docs/adr/0002-madr-v4-template.md $TARGET/docs/adr/
```

## Step 2 — Merge npm scripts into `package.json`

Add the following to your target's `package.json` (do NOT overwrite — is merge):

```json
{
  "scripts": {
    "check:foundations": "tsx scripts/check-foundations.ts",
    "check:architect-triggers": "tsx scripts/check-architect-triggers.ts",
    "check:env": "tsx scripts/check-env-readiness.ts",
    "lint:migrations": "tsx scripts/check-migration-safety.ts"
  },
  "devDependencies": {
    "tsx": "^4.7.0",
    "typescript": "^5.4.0",
    "dotenv": "^16.4.0"
  }
}
```

Then `npm install`.

## Step 3 — Create `PROJECT.md` at the target project root

Copy `PROJECT.template.md` to `<target>/PROJECT.md` and fill it in:

```bash
cp $TEAM/PROJECT.template.md $TARGET/PROJECT.md
$EDITOR $TARGET/PROJECT.md
```

The template has placeholders for: project name, launch-checklist source path + offsets, branch convention, anchor token, module taxonomy (or "no formal taxonomy"), payment-pipeline scope (informs QA-Opus auto-promotion), brand tokens, external spec sources (Notion / wiki — optional), and skip-set heuristics.

## Step 4 — Create or extend `CLAUDE.md` at the target project root

If your project doesn't have a `CLAUDE.md`:

```bash
cp $TEAM/CLAUDE.template.md $TARGET/CLAUDE.md
$EDITOR $TARGET/CLAUDE.md
```

If your project already has one, the critical paragraph to add is the **standing operating-mode** paragraph (every signal routes through Tech Lead, Tech Lead triages and dispatches the right specialists only). That paragraph + the launch-status anchor block are the minimum.

## Step 5 — Create or extend `AGENTS.md` at the target project root

```bash
[ -e $TARGET/AGENTS.md ] || cp $TEAM/AGENTS.template.md $TARGET/AGENTS.md
```

Add your project's specifics (DB seed instructions, admin-bootstrap script, etc.).

## Step 6 — Populate `lib/public/constants.ts`

Open `$TARGET/lib/public/constants.ts` and replace the example placeholder list with your project's actual internal-only field names. This is the single source of truth that every per-model `toPublic<Model>` strip function and the QA `assertNoForbiddenFields` helper read from.

## Step 7 — Generate Prisma client and verify

In the target project:

```bash
npx prisma generate        # populates @prisma/client from your schema
npx prisma migrate deploy  # applies all pending migrations to the target DB
                           # (on a greenfield project, run 'prisma migrate dev' instead)
```

Then run the gate scripts:

```bash
npm run check:foundations
```

Expected: `OK — N foundations present`. If you see `FOUNDATIONS_INCOMPLETE`, the missing files are listed — add them before continuing. (On a fresh clone, `prisma/schema.prisma` must exist from your project, not from this template.)

```bash
npm run check:env
```

Will warn on placeholder credentials — expected until you fill in `.env`. Just confirms the script runs.

```bash
npm run lint:migrations
```

If `supabase/migrations/` is empty, prints `No migrations found.` Otherwise lints all existing migrations.

## Step 8 — Try `/develop-next-module`

Open Claude Code (or claude.ai/code) in the target project. Type:

```
/develop-next-module
```

Tech Lead should:
1. Run `npm run check:foundations` — pass.
2. Read `PROJECT.md` for the launch-checklist source path.
3. Read that file's checklist section.
4. Ask the user to confirm the next module pick via `AskUserQuestion`.

If Tech Lead instead asks "I don't see a launch checklist — point me at one?", that means `PROJECT.md` isn't fully filled in. Edit `PROJECT.md` and try again.

## Optional — sync upstream improvements

When the team SOP improves in `TRUVIS26/truvis-devos-team-` (a new triage rule, a tighter trigger, a refactored helper), pull the changes manually:

```bash
cd $TEAM && git pull
# Re-run the diff-and-copy steps for whichever files changed.
diff -ru $TEAM/.claude/agents $TARGET/.claude/agents
diff -ru $TEAM/scripts $TARGET/scripts
# Apply the diffs that make sense for your project.
```

A future cycle could ship a `sync-team` script that automates this. Until then, manual sync keeps you in control of which improvements land.
