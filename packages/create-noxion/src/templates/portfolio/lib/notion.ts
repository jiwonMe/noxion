import { createNotionClient, fetchCollection, fetchPage, downloadImages, mapImages } from "@noxion/core";
import type { NoxionPage, ExtendedRecordMap } from "@noxion/core";
import { join } from "node:path";
import { siteConfig } from "./config";

const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN || undefined,
});

export async function getAllProjects(): Promise<NoxionPage[]> {
  const collections = siteConfig.collections ?? [];
  if (collections.length === 0) return [];

  try {
    const results = await Promise.all(
      collections.map((col) => fetchCollection(notion, col))
    );
    return results.flat();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<NoxionPage | undefined> {
  const projects = await getAllProjects();
  return projects.find((p) => p.slug === slug);
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
