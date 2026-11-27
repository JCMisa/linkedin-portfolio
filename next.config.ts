import type { NextConfig } from "next";

// Validate environment variables at build time (fails fast on missing keys)
import { env } from "./lib/env";

const nextConfig: NextConfig = {
  // Partial prerendering: static shells, dynamic parts stream inside <Suspense>
  cacheComponents: true,
  // Links prefetch each route's shared App Shell (no legacy full prefetches here)
  partialPrefetching: true,
  images: {
    // Only hosts that actually serve this site's images. A wildcard would let
    // anyone use our image optimizer as a free proxy for arbitrary URLs.
    remotePatterns: [
      // Our Cloudinary account only (project, certificate, profile uploads)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
      },
      // Clerk user avatars (comments, likes)
      { protocol: "https", hostname: "img.clerk.com" },
      // Older project images hosted on ImgBB
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },
  // Server actions keep Next's default 1 MB body limit: image files upload
  // straight to Cloudinary (see lib/upload-image.ts), not through actions.
};

export default nextConfig;
