# PROJECT.md — [Your Project Name]

> Copy this file to `PROJECT.md` in your target project root and fill in all
> placeholders (marked with `<...>`). Delete these instructions when done.

---

## Identity

- **Project name:** `<your-project-name>`
- **Domain:** `<one-line description, e.g. "B2B vendor management platform">`
- **Stack:** Next.js 16 App Router · React 19 · TypeScript 5 strict · Prisma 7 + Postgres · Supabase Auth · Vercel

---

## Launch checklist

Point Tech Lead at the checklist it should pick items from:

```
launchChecklistPath: <path-to-your-checklist-file, e.g. docs/LAUNCH_CHECKLIST.md>
launchChecklistOffsets:
  start: <line number where the checklist begins, e.g. 10>
  end: <line number where it ends, e.g. 80 — or omit for "to end of file">
```

The file at `launchChecklistPath` should contain markdown checkboxes (`- [ ] ...`).
Tech Lead reads the first unchecked items and asks you to confirm the next module.

---

## Branch convention

```
branchConvention: feat/<slug> | fix/<slug> | refactor/<slug> | chore/<slug>
anchorToken: <!-- PROJECT:<slug> -->
```

---

## Module taxonomy

> Describe how modules are categorised in your project, or write "no formal taxonomy".

```
moduleTaxonomy: |
  <e.g. "auth | admin | vendor | customer | billing | notifications | settings">
```

---

## Dispatch defaults

```
builderDefault: parallel        # parallel | be-first | be-first-stub
```

- `parallel` — Frontend Dev and Backend Dev run at the same time (most modules).
- `be-first` — Backend Dev runs first, Frontend Dev consumes its types/routes.
- `be-first-stub` — Backend Dev runs first and exports stub types; Frontend Dev
  starts immediately with stubs (use for complex API contracts).

---

## Payment pipeline scope

```
paymentScope: <none | stripe-subscriptions | stripe-one-time | stripe-connect>
```

Used by QA Engineer to decide whether to auto-escalate to opus for payment scenarios.

---

## Brand tokens

```
brandTokensPath: <path to your Tailwind config or CSS variables, e.g. tailwind.config.ts>
```

Frontend Dev reads this to use correct colours, spacing, and typography.

---

## External spec sources (optional)

Notion pages or wiki URLs that Docs-Sync should reference in PR descriptions.
Docs-Sync cannot write to these — it notes them for manual sync.

```yaml
externalSpecSources:
  - <https://www.notion.so/your-workspace/page-id>
  # Add more as needed
```

---

## Additional foundations (optional)

Files beyond the baseline that `check-foundations.ts` should require:

```yaml
additionalFoundations:
  - docs/ui-patterns.md
  # - docs/LAUNCH_CHECKLIST.md   ← already referenced above, no need to add
```

---

## Skip-set heuristics (optional)

Paths Tech Lead should never dispatch a full-team cycle for (use targeted dispatch instead):

```yaml
skipSetPaths:
  - app/(marketing)/
  - components/ui/         # shadcn primitives — FE-only
```

---

## Notes for agents

> Add any project-specific notes here that all agents should know: naming
> conventions, off-limits files, third-party integration quirks, etc.

```
agentNotes: |
  <e.g. "Admin routes live under app/(admin)/ and require role=admin in app_metadata.">
  <e.g. "Never modify supabase/seed.sql — it is maintained separately.">
```
