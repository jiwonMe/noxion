import type { MetadataRoute } from "next";
import type { NoxionPage, NoxionConfig } from "@noxion/core";

function getPageUrl(page: NoxionPage, baseUrl: string, routePrefix?: Record<string, string>): string {
  const prefix = routePrefix?.[page.pageType] ?? "";
  if (prefix) {
    return `${baseUrl}${prefix}/${page.slug}`;
  }
  return `${baseUrl}/${page.slug}`;
}

function getPriority(pageType: string): number {
  switch (pageType) {
    case "blog": return 0.8;
    case "docs": return 0.7;
    case "portfolio": return 0.6;
    default: return 0.5;
  }
}

function getChangeFrequency(pageType: string): "daily" | "weekly" | "monthly" {
  switch (pageType) {
    case "blog": return "weekly";
    case "docs": return "weekly";
    case "portfolio": return "monthly";
    default: return "weekly";
  }
}

export function generateNoxionSitemap(
  pages: NoxionPage[],
  config: NoxionConfig,
  routePrefix?: Record<string, string>
): MetadataRoute.Sitemap {
  const baseUrl = `https://${config.domain}`;

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  for (const page of pages) {
    entries.push({
      url: getPageUrl(page, baseUrl, routePrefix),
      lastModified: new Date(page.lastEditedTime),
      changeFrequency: getChangeFrequency(page.pageType),
      priority: getPriority(page.pageType),
    });
  }

  const tagSet = new Set<string>();
  for (const page of pages) {
    const tags = page.metadata.tags;
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (typeof tag === "string") tagSet.add(tag);
      }
    }
  }

  for (const tag of tagSet) {
    entries.push({
      url: `${baseUrl}/tag/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  return entries;
}
