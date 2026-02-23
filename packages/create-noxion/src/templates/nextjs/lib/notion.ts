import { createNotionClient, fetchBlogPosts, fetchPage, fetchPostBySlug, downloadImages, mapImages } from "@noxion/core";
import type { BlogPage, ExtendedRecordMap } from "@noxion/core";
import { join } from "node:path";
import { siteConfig } from "./config";

const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN || undefined,
});

export async function getAllPosts(): Promise<BlogPage[]> {
  if (!siteConfig.rootNotionPageId) return [];
  try {
    return await fetchBlogPosts(notion, siteConfig.rootNotionPageId);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPage | undefined> {
  if (!siteConfig.rootNotionPageId) return undefined;
  try {
    return await fetchPostBySlug(notion, siteConfig.rootNotionPageId, slug);
  } catch (error) {
    console.error(`Failed to fetch post "${slug}":`, error);
    return undefined;
  }
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

export function getAllTags(posts: BlogPage[]): string[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.metadata.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}
