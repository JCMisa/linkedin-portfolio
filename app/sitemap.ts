import { MetadataRoute } from "next";

import { env } from "@/lib/env";
const baseURL = env.NEXT_PUBLIC_SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    // landing page
    {
      url: `${baseURL}`,
      lastModified: new Date(),
    },
    // dashboard
    {
      url: `${baseURL}/dashboard`,
    },
  ];
}
