# LinkedIn-style portfolio (John Carlo Misa)

A personal portfolio that looks and feels like LinkedIn: a project feed with
likes and comments, a profile, experience timeline, certificates, contact form,
an AI chatbot (Gemini) and a voice assistant (Vapi). Deployed on Vercel.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 6 ·
Tailwind v4 + shadcn/ui · Clerk auth · Neon Postgres + Drizzle ORM ·
next-safe-action + zod 4 · TanStack Query 5 · react-hook-form · nuqs ·
Cloudinary (signed direct uploads) · AI SDK 7 (`@ai-sdk/google`) · Vapi ·
Upstash Redis rate limits (`lib/rate-limit.ts`). Vercel functions, Neon and
Upstash all live in Singapore (`ap-southeast-1` / `sin1`); keep new services
there too.
Node **24.x** (pinned in `package.json` `engines`, matches Vercel).

## Commands

```bash
npm run dev            # local dev (Turbopack)
npm run typecheck      # tsc --noEmit
npm run lint           # eslint (flat config); lint:fix to autofix
npm run format:check   # prettier (format to write)
npm run build          # production build, the final gate
npm run db:generate    # drizzle migration from db/schema.ts (review the SQL)
npm run db:migrate     # apply migrations (the owner runs this)
```

Before calling work done: `typecheck`, `lint` and `build` must pass with zero
errors. For UI work, also look at the page in light **and** dark mode at
390px and 1280px.

## Layout

```
app/                 routes only: page/layout/loading/error/not-found, metadata, api/
  (routes)/          public pages · (auth)/ Clerk sign-in/up
  api/               route handlers (read APIs, AI chat, Clerk webhook)
features/<name>/     one folder per domain: projects, certificates, profile,
                     contact, chatbot, users
  actions/ or actions.ts   "use server" mutations (next-safe-action)
  queries.ts               server-only reads (import "server-only")
  schemas.ts               zod schemas shared by actions and forms
  hooks.ts                 TanStack Query hooks (only where the client reads)
  constants.ts             zod-free values safe to import in client code
  components/              feature UI (+ admin-dialogs.tsx: lazy admin dialogs)
components/ui/       shadcn primitives (edit sparingly)
components/{forms,layout,shared,providers}/   cross-feature UI
lib/                 env, auth, safe-action, seo, accent, cloudinary, utils…
db/                  drizzle client, schema, relations, migrations/
hooks/               generic client hooks
proxy.ts             Clerk middleware (Next 16 name for middleware.ts)
```

## Non-negotiables

- **Git:** never `git add`, `commit`, `push` or `stash`. The owner commits via
  VS Code Source Control. End a finished task with a suggested commit message
  (Conventional Commits) and **no AI attribution** trailer or line.
- **Dependencies:** never use `--force` or `--legacy-peer-deps`. If peers
  conflict, find the root cause or hold the package back and say why.
- **Secrets:** read env only through `lib/env.ts` (t3-env validates at build).
  Never print, log or commit `.env*` values. Never send personal data to
  third-party services.
- **Auth:** every mutation goes through `authActionClient` / `adminActionClient`
  (`lib/safe-action.ts`), which call `requireUser`/`requireAdmin`. Never trust a
  client-sent user id. `proxy.ts` only protects a short explicit list; pages and
  APIs must check the session themselves.
- **Styling:** semantic tokens only (`bg-card`, `text-muted-foreground`,
  `bg-primary`…). No hex colors or raw palette classes in components; colors
  live in `app/globals.css`. The accent is user-selectable, so never hardcode blue.

Path-specific detail lives in `.claude/rules/` (UI, data layer, routes/SEO,
security) and loads when you touch matching files. Repeatable workflows live in
`.claude/skills/`.

## Gotchas (each one has bitten this repo)

- **Client bundles:** a client component that value-imports from a
  `schemas.ts` pulls all of zod into the browser (+30 KB). Import constants
  from a zod-free module (e.g. `features/projects/constants.ts`); type-only
  imports are fine.
- **Caching:** reads use `unstable_cache` with tags; mutations call
  `updateTag(...)`. `cacheComponents` / `"use cache"` is not enabled (Clerk
  session reads need Suspense boundaries first).
- **Metadata:** a page-level `openGraph`/`twitter` object replaces the root's
  file-based OG image. Use `pageMetadata()` from `lib/seo.ts`, which sets it.
- **Clerk webhook (svix 2):** verify the raw `await req.text()`, then
  `JSON.parse`. `verify()` no longer returns the payload.
- **Streaming 404s:** `notFound()` after a `loading.tsx` shell returns HTTP 200
  plus `noindex`; that is expected.
- **Windows dev box:** Git Bash mangles backslashes in inline `node -e`
  scripts; write the script to a file instead. Files use LF (`.gitattributes`).
- **Held packages:** ESLint stays on 9 (eslint-config-next plugins lack ESLint
  10 peers), TypeScript on 6.0 (typescript-eslint supports <6.1).
