---
paths:
  - "app/api/**"
  - "lib/auth.ts"
  - "lib/env.ts"
  - "lib/safe-action.ts"
  - "lib/cloudinary.ts"
  - "lib/upload-*.ts"
  - "features/**/actions*"
  - "features/**/actions/**"
  - "proxy.ts"
  - "next.config.ts"
---

# Security checklist

Apply to any change that touches auth, data access, uploads, webhooks or env.

- **Authorization on the server, every time.** UI checks (`isAdminRole`) only
  hide buttons. Actions use `authActionClient`/`adminActionClient`; route
  handlers call `getSessionUser()`/`requireUser()`; pages that need a user
  redirect themselves. `lib/auth.ts` is the single source of truth.
- **Identity comes from the session**, not from request bodies or query
  params (`ctx.user.id`, never `input.userId`).
- **Input validation:** zod for every action input, API body and dynamic
  route param. Reject, don't coerce, unexpected shapes.
- **Env and secrets:** add new variables to `lib/env.ts` (server vs client
  section). Only `NEXT_PUBLIC_*` values may reach the browser. Never log
  secrets, tokens or full request bodies.
- **Uploads:** browser uploads go straight to Cloudinary with a signature from
  `getUploadSignature` (admin only, folder must be in `UPLOAD_FOLDERS`,
  formats restricted). Replacing an image deletes the old one
  (`deleteReplacedImage`). Never accept arbitrary folders or URLs.
- **Remote images:** `next.config.ts` `images.remotePatterns` is an allowlist
  (own Cloudinary cloud, Clerk, i.ibb.co). Don't add wildcards.
- **Webhooks:** verify signatures on the raw body (`await req.text()`)
  before parsing; reject on failure with 400.
- **Data exposure:** public APIs return only public fields (no emails, roles
  or credits of other users).
- **Rate-limited endpoints** (AI chat, inquiry processing) keep their limits
  and atomic credit spends; don't bypass them for convenience.
- **Third-party calls:** never put personal data (names, emails) in URLs,
  headers or payloads to services that don't need it.
