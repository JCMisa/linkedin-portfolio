import type { MetadataRoute } from "next";
import { getProjectSitemapEntries } from "@/features/projects/queries";
import { siteConfig } from "@/lib/seo";

// Rebuild hourly so new projects show up without a redeploy
export const revalidate = 3600;

const staticRoutes: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/profile", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
  { path: "/experiences", priority: 0.7, changeFrequency: "monthly" },
  { path: "/certificates", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectSitemapEntries().catch(() => []);

  return [
    ...staticRoutes.map(({ path, priority, changeFrequency }) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    ...projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project.id}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
