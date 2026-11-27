---
name: visual-check
description: Screenshot pages of this app with headless Chrome at mobile, tablet and desktop widths in light and dark mode (optionally with a theme color), and detect horizontal overflow. Use after any UI, layout, styling or copy change, or when asked how a page looks, to check responsiveness, dark mode, or the LinkedIn look.
---

# Visual check

Uses `scripts/cdp.mjs`, a dependency-free Chrome DevTools Protocol driver
(Node 24 global `WebSocket`).

## 1. Start the app and Chrome

```bash
npm run build && npx next start -p 3123          # background
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new \
  --remote-debugging-port=9333 --user-data-dir="$TEMP/chrome-cdp" \
  --no-first-run --disable-gpu about:blank      # background
```

Write screenshots to a temp/scratch folder, never into the repo.

## 2. Capture

```bash
S=.claude/skills/visual-check/scripts
export MSYS_NO_PATHCONV=1        # Git Bash: keep "/route" arguments intact
node $S/cdp.mjs shot http://localhost:3123/profile 390  light out/profile-390-l.png
node $S/cdp.mjs shot http://localhost:3123/profile 1280 dark  out/profile-1280-d.png
ACCENT=green node $S/cdp.mjs shot http://localhost:3123/ 1280 light out/home-green.png 0
node $S/cdp.mjs overflow http://localhost:3123/projects 390 light
```

- Last argument `0` = viewport only (default `1` = full page, max 5000px).
- `overflow` prints `documentWidth`; it must equal the viewport width. The
  `offenders` list may include intentionally clipped carousel slides.
- Widths to cover: 390 (phone), 768 (tablet: navbar is tightest), 1280.
- Pages: `/`, `/profile`, `/projects`, `/projects/<id>` (take an id from
  `/sitemap.xml`), `/experiences`, `/certificates`, `/contact`.
- Preview a loading skeleton by temporarily rendering the route's
  `loading.tsx` from a throwaway page, then delete that page.

## 3. Review against the LinkedIn look

Open the PNGs and check:

- Cards: `rounded-lg border bg-card`, flat, consistent padding.
- Section titles ~20px semibold, sentence case; no uppercase eyebrows.
- Nothing clipped or overlapping; long titles clamp instead of overflowing.
- Dark mode: no white islands, readable muted text, visible borders.
- Accent follows the selected theme color (nothing stuck on blue).

Report concrete issues with the page, width and mode where each appears.
