---
paths:
  - "app/**/page.tsx"
  - "app/**/layout.tsx"
  - "app/**/loading.tsx"
  - "app/**/*-image.tsx"
  - "app/sitemap.ts"
  - "app/robots.ts"
  - "app/manifest.ts"
  - "lib/seo.ts"
  - "proxy.ts"
---

# Routes, metadata and SEO

## Every new page

1. `export const metadata = pageMetadata({ title, description, path })` from
   `lib/seo.ts` (or `generateMetadata` returning `pageMetadata(...)` for
   dynamic pages). Title is short ("Projects"); the root template adds
   " | John Carlo Misa". Description ≤ 160 characters, written for humans.
2. Exactly one `<h1>`; `<main id="main-content">` (the skip link targets it).
3. A `loading.tsx` skeleton that mirrors the layout.
4. Public, indexable page → add it to `app/sitemap.ts`. Private or utility
   page (auth, assistant) → `robots: { index: false, follow: false }` and list
   it in `app/robots.ts` `disallow`.
5. Needs sign-in → add it to `isProtectedRoute` in `proxy.ts` **and** check
   the session in the page itself, inside a `<Suspense>` boundary (see
   below).

## Static shells (Cache Components)

`cacheComponents` and `partialPrefetching` are on: each page prerenders a
static shell, and anything that reads the request streams in behind
`<Suspense>`. Keep shells real (content, not a skeleton):

- **Session:** don't read it in a page or layout just to show admin controls.
  Wrap them in `<AdminOnly>` (`features/users/components/AdminOnly.tsx`) or
  use `useCurrentUser().isAdmin` in client components. Read the session on
  the server only for user-specific data (feed "liked by me", the voice
  assistant), in an async component inside `<Suspense>` with a skeleton.
- **URL data** (`usePathname`, `useSearchParams`, nuqs filters, Clerk
  `<SignIn>`/`<SignUp>`) needs a `<Suspense>` boundary too (see the
  navbar's `MainNavItems`).
- **Time and randomness:** no `new Date()`, `Date.now()` or `Math.random()`
  during render. Compare stored dates, use `useNow()` (`hooks/use-now.ts`)
  in client components, or a `"use cache"` + `cacheLife` component (the
  footer year).
- **No segment config:** `export const revalidate/dynamic` is rejected; use
  `"use cache"` + `cacheLife` (see `app/sitemap.ts`).
- **`loading.tsx` hides blockers:** with a loading file, a blocked route
  quietly ships the skeleton as its shell and the build still passes. To
  audit, temporarily move the route's `loading.tsx` (and `app/loading.tsx`)
  aside and build: the error names the blocking component. Restore them after.
  The build's route table shows ○ (fully static) or ◐ (shell + streamed
  parts).

## Metadata details

- Don't hand-write `openGraph`/`twitter` blocks: a page-level object replaces
  the root's file-based OG image, and `pageMetadata()` restores it.
- Pass `image: { url, alt }` for content with its own picture (projects use
  their Cloudinary image).
- Absolute URLs come from `metadataBase` (`NEXT_PUBLIC_SITE_URL`); use paths.
- Structured data: render `<JsonLd data={...} />` (escapes `<`). Person
  schema comes from `personJsonLd()`.
- Brand images: the browser-tab icon (`app/icon.png`, `favicon.ico`) is
  generated from `public/logo.png`, the same "JC" logo as the navbar,
  footer and loader. `apple-icon.png`, `public/icons/*` and the OG card
  (`lib/og-image.tsx`) use the `public/jcm-logo.svg` brand mark.

## proxy.ts (Clerk middleware)

- Public by default. Only routes in `isProtectedRoute` require sign-in, so
  unknown URLs return a real 404 instead of redirecting to sign-in.
- Metadata routes without a file extension (`/opengraph-image`,
  `/twitter-image`) pass through the matcher; keep them public.
