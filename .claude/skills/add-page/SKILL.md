---
name: add-page
description: Add a new route/page to this Next.js App Router portfolio with everything it needs - metadata via pageMetadata, a single h1, a loading skeleton, sitemap/robots entries and auth protection when required. Use when asked to create a page, route or section of the site.
---

# Add a page

Follow `.claude/rules/routes-seo.md` and `.claude/rules/ui-design.md`.

1. **Place it.** Public pages: `app/(routes)/<name>/page.tsx`. Auth screens
   live in `app/(auth)`. Data and UI belong to a feature folder
   (`features/<name>/`), not to `app/`.
2. **Server component by default.** Fetch with the feature's `queries.ts`
   (parallelize with `Promise.all`); push interactivity into small client
   components.
3. **Metadata.**
   ```ts
   export const metadata: Metadata = pageMetadata({
     title: "Name",
     description: "≤160 characters, for humans.",
     path: "/name",
   });
   ```
   Dynamic route: `generateMetadata` that validates the param, loads the row
   through a React `cache()`-wrapped query and returns `pageMetadata(...)`.
4. **Markup.** `<main id="main-content" className="relative px-6 py-18
md:px-10 lg:px-16">`, exactly one `<h1>` (visible or `sr-only`), cards as
   `rounded-lg border bg-card`, sidebar as `<aside aria-label>`.
5. **Loading.** Add `loading.tsx` composed from
   `components/shared/skeletons.tsx` that mirrors the layout.
6. **Empty and error states.** Use `EmptyState`; invalid params → `notFound()`.
7. **Indexing.**
   - Public → add to `staticRoutes` in `app/sitemap.ts` (dynamic rows: add a
     lightweight query like `getProjectSitemapEntries`).
   - Private/utility → `robots: { index: false, follow: false }` and add to
     `disallow` in `app/robots.ts`.
8. **Auth.** If it needs a signed-in user: check `getSessionUser()` in an
   async component inside `<Suspense>` (`proxy.ts` has no path rules) (redirect to `/sign-in` when
   missing; see `app/(routes)/contact/assistant/page.tsx`). Admin-only
   controls on public pages use `<AdminOnly>`, not a server session read.
   Confirm the page still prerenders (the "Static shells" section of
   `.claude/rules/routes-seo.md`).
9. **Navigation.** If it belongs in the navbar or footer, update
   `components/layout/Navbar.tsx` (`menuItems`) and `Footer.tsx`, plus
   `components/layout/search-paths.ts` for the search dialog.
10. Run the `verify` skill, then `visual-check` for the new page.
