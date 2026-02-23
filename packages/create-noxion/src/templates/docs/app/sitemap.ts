import type { MetadataRoute } from "next";
import { generateNoxionSitemap } from "@noxion/adapter-nextjs";
import { getAllPosts } from "../lib/notion";
import { siteConfig } from "../lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return generateNoxionSitemap(posts, siteConfig);
}
