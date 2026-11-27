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
   the session in the page itself.

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
