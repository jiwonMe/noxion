import { createNotionClient, fetchCollection, fetchPage, downloadImages, mapImages } from "@noxion/core";
import type { NoxionPage, BlogPage, ExtendedRecordMap } from "@noxion/core";
import { join } from "node:path";
import { siteConfig } from "./config";

const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN || undefined,
});

export async function getAllPages(): Promise<NoxionPage[]> {
  const collections = siteConfig.collections ?? [];
  if (collections.length === 0) return [];

  try {
    const results = await Promise.all(
      collections.map((col) => fetchCollection(notion, col))
    );
    return results.flat();
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    return [];
  }
}

export async function getPagesByType(pageType: string): Promise<NoxionPage[]> {
  const pages = await getAllPages();
  return pages.filter((p) => p.pageType === pageType);
}

export async function getPageBySlug(slug: string): Promise<NoxionPage | undefined> {
  const pages = await getAllPages();
  return pages.find((p) => p.slug === slug);
}

export async function getPageRecordMap(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await fetchPage(notion, pageId);

  if (process.env.NODE_ENV === "production") {
    try {
      const outputDir = join(process.cwd(), "public");
      const urlMap = await downloadImages(recordMap, outputDir, { concurrency: 5 });
      const localUrlMap: Record<string, string> = {};
      for (const [originalUrl, localPath] of Object.entries(urlMap)) {
        localUrlMap[originalUrl] = `/images/${localPath.split("/images/").pop()}`;
      }
      return mapImages(recordMap, localUrlMap);
    } catch (error) {
      console.error("Image download failed, using original URLs:", error);
    }
  }

  return recordMap;
}

export function getAllTags(posts: NoxionPage[]): string[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    const tags = post.metadata.tags;
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        tagSet.add(tag as string);
      }
    }
  }
  return [...tagSet].sort();
}
