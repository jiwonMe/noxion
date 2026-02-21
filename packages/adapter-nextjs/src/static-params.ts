import type { NotionAPI } from "notion-client";
import { fetchAllSlugs } from "@noxion/core";

export async function generateNoxionStaticParams(
  client: NotionAPI,
  databasePageId: string
): Promise<{ slug: string }[]> {
  const slugs = await fetchAllSlugs(client, databasePageId);
  return slugs.map((slug) => ({ slug }));
}
