import { MetadataRoute } from "next";

const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_BASE_URL_PROD;

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
