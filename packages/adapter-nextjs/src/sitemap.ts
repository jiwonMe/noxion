import type { MetadataRoute } from "next";
import type { BlogPost, NoxionConfig } from "@noxion/core";

export function generateNoxionSitemap(
  posts: BlogPost[],
  config: NoxionConfig
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

  for (const post of posts) {
    entries.push({
      url: `${baseUrl}/${post.slug}`,
      lastModified: new Date(post.lastEditedTime),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
