import {
  createNotionClient,
  fetchBlogPosts,
  fetchPage,
  fetchPostBySlug,
  parseFrontmatter,
  applyFrontmatter,
  downloadImages,
  mapImages,
} from "@noxion/core";
import type { BlogPage, ExtendedRecordMap, PaginatedResponse } from "@noxion/core";
import { join } from "node:path";
import { siteConfig } from "./config";

const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN || undefined,
});

export const DEFAULT_PAGE_SIZE = 12;

export async function getAllPosts(): Promise<BlogPage[]> {
  if (!siteConfig.rootNotionPageId) return [];
  try {
    return await fetchBlogPosts(notion, siteConfig.rootNotionPageId);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export interface GetPaginatedPostsOptions {
  page?: number;
  pageSize?: number;
  tag?: string;
  search?: string;
}

export async function getPaginatedPosts(
  options: GetPaginatedPostsOptions = {},
): Promise<PaginatedResponse<BlogPage>> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, tag, search } = options;

  let posts = await getAllPosts();

  if (tag) {
    posts = posts.filter((p) => p.metadata.tags.includes(tag));
  }

  if (search) {
    const lower = search.toLowerCase();
    posts = posts.filter((p) => {
      if (p.title.toLowerCase().includes(lower)) return true;
      if (p.metadata.tags.some((t: string) => t.toLowerCase().includes(lower))) return true;
      if (p.metadata.category?.toLowerCase().includes(lower)) return true;
      if (p.description?.toLowerCase().includes(lower)) return true;
      return false;
    });
  }

  const total = posts.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = posts.slice(start, end);

  return { data, page, pageSize, total, hasMore: end < total };
}

export async function getPostBySlug(slug: string): Promise<BlogPage | undefined> {
  if (!siteConfig.rootNotionPageId) return undefined;
  try {
    return (await fetchPostBySlug(
      notion,
      siteConfig.rootNotionPageId,
      slug,
    )) as BlogPage | undefined;
  } catch (error) {
    console.error(`Failed to fetch post "${slug}":`, error);
    return undefined;
  }
}

const downloadImagesAtBuild = process.env.NOXION_DOWNLOAD_IMAGES === "true";

export async function getPageRecordMap(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await fetchPage(notion, pageId);

  if (downloadImagesAtBuild && process.env.NODE_ENV === "production") {
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

export async function resolvePostWithFrontmatter(slug: string) {
  const post = await getPostBySlug(slug);
  if (!post) return null;

  const recordMap = await getPageRecordMap(post.id);
  const frontmatter = parseFrontmatter(recordMap, post.id);
  const resolvedPost = frontmatter ? applyFrontmatter(post, frontmatter) : post;

  return { post: resolvedPost, recordMap };
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
