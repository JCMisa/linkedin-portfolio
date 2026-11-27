---
paths:
  - "components/**/*.tsx"
  - "features/**/components/**/*.tsx"
  - "app/**/*.tsx"
  - "app/globals.css"
---

# UI: LinkedIn look, tokens, accessibility

## Colors (no hex in components)

- Use semantic Tailwind tokens only: `bg-background` (page), `bg-card` (cards,
  navbar), `text-foreground`, `text-muted-foreground`, `border`/`border-input`,
  `bg-accent` (hover surface), `bg-primary`/`text-primary` (brand),
  `bg-primary-soft`/`bg-primary-hover`, `text-destructive`, `text-success`.
- Never hardcode the brand color: it is user-selectable (`lib/accent.ts`,
  `[data-accent]` presets in `app/globals.css`). `text-primary-foreground` is
  the readable text color on `bg-primary` in both modes.
- New colors go into `app/globals.css` as variables for **both** `:root` and
  `.dark`, checked for WCAG AA contrast (4.5:1 for text).
- Allowed exceptions: dialog scrims/photo viewers (`bg-black/80`) and code that
  can't read CSS variables (OG images in `lib/og-image.tsx`, `<meta
theme-color>` in `lib/seo.ts`), which mirror the tokens with a comment.

## LinkedIn components

- **Card surface:** `rounded-lg border bg-card`, flat (no `shadow-*`). Inner
  padding `p-4 sm:p-6` for sections, `px-3 py-2` for feed posts.
- **Section title:** `<h2 className="text-xl font-semibold">`, sentence case.
  Small card titles: `text-base font-semibold`. No uppercase eyebrow headings.
- **Buttons** (`components/ui/button.tsx`, pill-shaped): `default` = primary
  action, `outline` = secondary brand action, `secondary` = neutral outline,
  `ghost` = tertiary/icon. Don't restyle radius per use.
- **Copy:** sentence case everywhere ("Send message", not "Send Message").
  Use "…" (ellipsis character) for loading text.
- **Empty states:** `components/shared/EmptyState.tsx` (`size="compact"` inside
  lists; `titleAs="h1"` when it is the whole page). Never show skeletons for
  data that is already known to be empty.
- **Loading:** every route has a `loading.tsx` built from
  `components/shared/skeletons.tsx` that mirrors the real layout.

## Responsive

- Check 390px, 768px and 1280px. No horizontal page scroll.
- Long text: `line-clamp-*` / `truncate` + `min-w-0` on the flex child.
- Don't hide a control's label on mobile unless it keeps an `aria-label`.

## Accessibility (also SEO)

- One `<h1>` per page (visible, or `sr-only` on feed-style pages); headings
  go in order. Landmarks: `<header>`, `<nav aria-label>`, `<main
id="main-content">`, `<aside>`, `<footer>`; feed/grid items are `<article>`.
- Anything clickable is a `<button type="button">` or a link, never a
  `div`/`span`/`svg` with `onClick`. Don't nest interactive elements; with
  Radix triggers use `asChild`.
- Icon-only controls need `aria-label`. Lucide icons are `aria-hidden` by
  default, so the label must come from the control. Toggles use
  `aria-pressed`; disclosures use `aria-expanded`.
- Images: meaningful `alt`, or `alt=""` when decorative or beside visible text
  (avatars next to names).
- External links: `target="_blank" rel="noopener noreferrer"`.
- Keyboard focus must stay visible (global `:focus-visible` outline in
  `globals.css`; don't remove outlines).

## Performance

- Admin-only dialogs load lazily via each feature's `admin-dialogs.tsx`
  (`next/dynamic`). Keep heavy libraries (motion, markdown, Vapi) out of the
  initial bundle the same way.
- Use `next/image` with real `width`/`height` (not 1000×1000 placeholders) and
  `sizes` for responsive images.
