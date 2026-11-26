import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // APIs, auth screens and the signed-in voice assistant have nothing to index
      disallow: ["/api/", "/sign-in", "/sign-up", "/contact/assistant"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
