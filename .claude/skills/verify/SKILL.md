---
name: verify
description: Run this repo's full quality gate before calling any code change done - typecheck, lint, Prettier, production build, and (for client-side changes) a first-load JavaScript size check. Use after finishing a feature, fix, refactor or dependency change, or when asked to "verify", "check everything" or "make sure it builds".
---

# Verify a change

Run in order and stop at the first failure; fix the cause, then re-run from
the failed step. Report real output; never claim a step passed without
running it.

1. `npm run typecheck`
2. `npm run lint` (must be 0 errors and 0 warnings)
3. `npm run format:check` (if it fails: `npm run format`, then re-check)
4. `npm run build` (watch for new warnings, not just errors)

## Bundle check

Do this for any change under `components/`, `features/**/components`,
`hooks/`, client-imported `lib/` files, or new dependencies.

Start the production server from the fresh build, then measure the routes
the change can affect:

```bash
npx next start -p 3123            # run in the background
node .claude/skills/verify/scripts/first-load-js.mjs . http://localhost:3123 / /projects /profile /certificates /contact
```

The script sums the gzip size of every JS file a route's HTML loads.
Reference numbers (end of Phase 8): `/` ≈ 317 KB, `/projects` ≈ 319 KB,
`/profile` ≈ 321 KB, `/certificates` ≈ 308 KB, `/contact` ≈ 349 KB.

A jump of more than ~5 KB on a route needs an explanation. Common causes:

- A client file value-imports from a `schemas.ts` → zod lands in the bundle.
  Move the value to a zod-free `constants.ts`.
- A heavy library imported eagerly → load it with `next/dynamic` (see each
  feature's `admin-dialogs.tsx`).

On Windows Git Bash, prefix commands that take `/route` arguments with
`MSYS_NO_PATHCONV=1` so paths aren't rewritten.

## Finish

Summarize what ran and the results. For UI changes, also run the
`visual-check` skill.
