# JCM: a LinkedIn-style portfolio

The portfolio of **John Carlo Misa**, built to look and feel like LinkedIn: a
project feed with likes and comments, a profile with experience, skills and
testimonials, certificates, a contact page, an AI chatbot and a voice
assistant.

**Live:** [jcm-portfolio.vercel.app](https://jcm-portfolio.vercel.app)

![JCM portfolio preview](https://jcm-portfolio.vercel.app/opengraph-image)

## Features

- **Project feed** with likes, comments, "Load more" pagination, and search
  and category filters that live in the URL, so filtered views are shareable
- **Profile, experience timeline and certificates**, editable in place by the
  owner through validated forms with direct image uploads
- **AI chatbot** (Gemini) that answers questions about John's work, rate
  limited per user
- **Voice assistant** (Vapi) that takes an inquiry by voice, extracts the
  details with Gemini and drafts the email for review
- **LinkedIn look** in light and dark mode, plus a visitor-selectable theme
  color (six accessible accents, remembered per device)
- **Fast and findable:** skeleton loading on every route, per-page metadata,
  generated Open Graph images, sitemap, robots, JSON-LD and semantic HTML

## Tech stack

| Area         | Tools                                                      |
| ------------ | ---------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack), React 19, TypeScript 6 |
| UI           | Tailwind CSS v4, shadcn/ui (Radix), lucide icons, motion   |
| Auth         | Clerk (+ webhook that syncs users to the database)         |
| Data         | Neon Postgres, Drizzle ORM                                 |
| Server logic | next-safe-action server actions, zod 4 validation          |
| Client data  | TanStack Query 5, react-hook-form, nuqs (URL state)        |
| Media        | Cloudinary (signed, direct-from-browser uploads)           |
| AI           | AI SDK 7 with Google Gemini, Vapi voice                    |
| Hosting      | Vercel, Node.js 24                                         |

## Getting started

### Prerequisites

- **Node.js 24** (`node -v`; the version is pinned in `package.json`)
- Free accounts on [Neon](https://neon.tech), [Clerk](https://clerk.com),
  [Cloudinary](https://cloudinary.com),
  [Google AI Studio](https://aistudio.google.com) and [Vapi](https://vapi.ai)

### 1. Install

```bash
npm install
```

### 2. Environment variables

Create `.env.local` in the project root. Every variable is validated at
build time by [`lib/env.ts`](lib/env.ts), so a missing or malformed value
fails the build with a clear message.

```env
# Site: public URL, used for canonical links, sitemap and share images
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Neon: Console > project > Connection details (pooled connection string)
DATABASE_URL=

# Clerk: Dashboard > API keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
# Clerk: Dashboard > Webhooks > endpoint <site>/api/webhooks/clerk
# (events user.created, user.updated, user.deleted) > Signing secret
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Google AI Studio: Get API key
GOOGLE_GENERATIVE_AI_API_KEY=

# Cloudinary: Console > Settings > API Keys
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# Optional, also read by the Cloudinary SDK: cloudinary://<key>:<secret>@<cloud>
CLOUDINARY_URL=

# Vapi: Dashboard > API Keys > Public key
NEXT_PUBLIC_VAPI_API_KEY=
```

Only `NEXT_PUBLIC_*` values reach the browser. Never commit `.env.local`.

### 3. Database

```bash
npm run db:migrate   # applies db/migrations to your Neon database
```

### 4. Run

```bash
npm run dev          # http://localhost:3000
```

To receive Clerk webhooks locally, expose the dev server with a tunnel
(e.g. ngrok) and point the Clerk webhook endpoint at
`<tunnel-url>/api/webhooks/clerk`.

### Admin access

Editing tools appear for users whose `role` is `admin` or `owner`. Sign in
once (the webhook creates your row in `users`), then set your role in the
`users` table, e.g. with `npm run db:studio`.

## Scripts

| Command                           | What it does                           |
| --------------------------------- | -------------------------------------- |
| `npm run dev`                     | Dev server with Turbopack              |
| `npm run build` / `npm start`     | Production build / serve it            |
| `npm run typecheck`               | `tsc --noEmit`                         |
| `npm run lint` / `lint:fix`       | ESLint (flat config)                   |
| `npm run format` / `format:check` | Prettier (with Tailwind class sorting) |
| `npm run db:generate`             | Create a migration from `db/schema.ts` |
| `npm run db:migrate`              | Apply migrations                       |
| `npm run db:studio`               | Browse the database                    |

## Project structure

```
app/                Routes only: pages, layouts, loading/error states, metadata,
                    API route handlers, sitemap/robots/manifest, OG images
features/<domain>/  projects, certificates, profile, contact, chatbot, users
  schemas.ts          zod schemas shared by server actions and forms
  queries.ts          server-only database reads
  actions.ts          server actions (mutations)
  hooks.ts            TanStack Query hooks for client-side reads
  components/         the feature's UI
components/         shadcn primitives (ui/) and shared layout, form and state
                    components
lib/                env, auth, safe-action clients, SEO, theme color, uploads
db/                 Drizzle client, schema, relations, migrations
proxy.ts            Clerk middleware (protects only the routes that need it)
```

## How it works

- **Reads** happen in server components through each feature's
  `queries.ts`, cached with `unstable_cache` and tagged so mutations can
  refresh exactly what changed. The feed loads in a single SQL query (counts
  and "liked by me" included) and continues on the client with TanStack Query.
- **Writes** are next-safe-action server actions. Every one runs through a
  public, signed-in or admin client that checks the session on the server,
  validates input with zod and only exposes intentional error messages.
- **Uploads** go straight from the browser to Cloudinary with a short-lived
  signature issued by an admin-only action, so files never pass through the
  server and the API secret never reaches the client. Replaced images are
  deleted.
- **Auth:** Clerk handles sign-in; a signed webhook keeps the `users` table
  in sync. The site is public by default, and `proxy.ts` only guards the voice
  assistant and the AI endpoints, which also check the session themselves.
- **Design system:** colors are semantic tokens defined once in
  `app/globals.css` for light and dark mode. The brand accent comes from a
  single variable, which is what makes the theme color picker possible.

## Deployment (Vercel)

1. Import the repository and add the environment variables above, with
   `NEXT_PUBLIC_SITE_URL` set to the production URL.
2. Project Settings > Build and Deployment > **Node.js Version: 24.x**
   (it must match `engines.node`).
3. Point the Clerk webhook at `https://<your-domain>/api/webhooks/clerk`.

## Working on this repo with Claude Code

[`CLAUDE.md`](CLAUDE.md) holds the conventions and known pitfalls.
`.claude/rules/` adds guidance for UI, the data layer, routes/SEO and
security when matching files are edited, and `.claude/skills/` has
step-by-step workflows (`verify`, `visual-check`, `add-page`,
`server-action`, `db-change`, `upgrade-deps`, `commit-message`).
`.claude/settings.json` auto-formats edits with Prettier and blocks git
writes, forced installs and reading `.env` files.

## Roadmap

- **Distributed rate limiting:** the chatbot limiter keeps counts in memory,
  so each serverless instance counts separately; move it to a shared store
  such as Upstash Redis.
- **`"use cache"` / Cache Components:** migrate from `unstable_cache` once
  the Clerk session reads are wrapped in Suspense boundaries.
- **ESLint 10 and TypeScript 7:** upgrade when `eslint-config-next`'s plugins
  and `typescript-eslint` support them (held back to avoid forced installs).
