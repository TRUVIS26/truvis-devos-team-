# Cloud / sandbox-environment notes for AI agents

The Cloud agent runs without access to real production credentials, so manual browser tests requiring a live Supabase / Stripe / Resend connection or an authenticated admin / vendor session **will not work** unless the environment is configured first.

## Setting up `.env` for browser testing

1. **Copy the example file:**

   ```bash
   cp .env.example .env
   ```

2. **Fill in Supabase credentials**

   | Variable | Where to find it |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase Dashboard → Settings → API → `anon` / `public` key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` key (**keep secret**) |
   | `DATABASE_URL` | Supabase Dashboard → Settings → Database → Connection string (Transaction / Pooler, port 6543) — append `?pgbouncer=true` |
   | `DIRECT_URL` | Supabase Dashboard → Settings → Database → Connection string (Session / Direct, port 5432) |

   > **Preview branches:** if testing against a PR preview branch, use the branch-specific values from
   > Supabase Dashboard → Branching → select your branch → Settings → API.

3. **Fill in the remaining secrets** (only those needed for the feature under test). See `.env.example` for the full list.

4. **Run Prisma generate then start the dev server:**

   ```bash
   npm install
   npx prisma generate
   npm run dev
   ```

## Creating an authenticated admin / vendor session

Without a seeded database, the login page will have no accounts to sign in with. Three options:

**Option A — seed via SQL (fastest):** open the Supabase SQL Editor and run your project's seed template (typically `supabase/seed.sql`).

**Option B — create an admin user via API:**

```bash
# Start the dev server first, then:
curl -X POST http://localhost:3000/api/admin/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","secret":"<ADMIN_SETUP_SECRET>"}'
```

(This assumes your project has shipped `app/api/admin/setup-admin/route.ts`. If not, create the user manually in Supabase Dashboard → Authentication → Users and set `app_metadata.roles = ["admin"]`.)

**Option C — sign up through the UI:** go to `/register`, sign up with a test email, confirm the email link (or disable email confirmation in Supabase Dashboard → Authentication → Providers → Email).

## Why the Cloud agent skips browser tests

The Cloud `.env` typically contains placeholder values (e.g. `your-project.supabase.co`, `your-anon-key`). Any route that touches Supabase, Prisma, Stripe, or other external services will fail at runtime until the real credentials above are provided. Complete the steps above before asking the agent to perform a browser-based end-to-end test.

## What QA can run without real credentials

QA Engineer's regression suite runs successfully even with placeholder env values:
- `npm run lint`
- `npx tsc --noEmit`
- `npm run check:foundations`
- `npm run check:env` (informational only — passes without credentials, but warns if placeholders detected)
- `npm run lint:migrations`
- `npm run test:privacy` (and any other unit-level `test:*` scripts your project ships)

For browser-level scenarios that require real credentials, QA writes a `.qa/manual-verification-<slug>.md` file. Docs-Sync aggregates these into `MANUAL_QA_BACKLOG.md` so the human reviewer knows what to test in a real environment before merging.
