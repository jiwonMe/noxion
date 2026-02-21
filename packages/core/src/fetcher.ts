import type { NotionAPI } from "notion-client";
import type { ExtendedRecordMap, CollectionPropertySchemaMap, Block, Collection } from "notion-types";
import { getTextContent } from "notion-utils";
import type { BlogPost } from "./types";

function unwrapValue<T>(boxed: { value: T | { role: string; value: T }; role?: string } | undefined): T | undefined {
  if (!boxed) return undefined;
  const val = boxed.value;
  if (val && typeof val === "object" && "role" in val && "value" in val) {
    return (val as { role: string; value: T }).value;
  }
  return val as T;
}

export { createNotionClient } from "./client";

export async function fetchPage(client: NotionAPI, pageId: string): Promise<ExtendedRecordMap> {
  return client.getPage(pageId);
}

export async function fetchBlogPosts(
  client: NotionAPI,
  databasePageId: string
): Promise<BlogPost[]> {
  const recordMap = await client.getPage(databasePageId);
  return extractPostsFromRecordMap(recordMap, databasePageId);
}

export async function fetchAllSlugs(
  client: NotionAPI,
  databasePageId: string
): Promise<string[]> {
  const posts = await fetchBlogPosts(client, databasePageId);
  return posts.map((p) => p.slug);
}

export async function fetchPostBySlug(
  client: NotionAPI,
  databasePageId: string,
  slug: string
): Promise<BlogPost | undefined> {
  const posts = await fetchBlogPosts(client, databasePageId);
  return posts.find((p) => p.slug === slug);
}

function extractPostsFromRecordMap(
  recordMap: ExtendedRecordMap,
  _databasePageId: string
): BlogPost[] {
  const collectionBox = Object.values(recordMap.collection)[0];
  const collection = unwrapValue<Collection>(collectionBox as never);
  if (!collection) return [];

  const schema = collection.schema as CollectionPropertySchemaMap;
  if (!schema) return [];

  const collectionQuery = recordMap.collection_query;
  const collectionId = Object.keys(recordMap.collection)[0];
  if (!collectionId) return [];

  const queryResults = collectionQuery?.[collectionId];
  const firstView = queryResults ? Object.values(queryResults)[0] : undefined;
  const blockIds: string[] = (firstView as { blockIds?: string[] })?.blockIds ?? [];

  const schemaMap = buildSchemaMap(schema);

  const posts: BlogPost[] = [];
  for (const blockId of blockIds) {
    const block = unwrapValue<Block>(recordMap.block[blockId] as never);
    if (!block || block.type !== "page") continue;

    const properties = block.properties as Record<string, unknown[][]> | undefined;
    if (!properties) continue;

    const post = extractPost(blockId, properties, schemaMap, block);
    if (post.published) {
      posts.push(post);
    }
  }

  posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return posts;
}

interface SchemaMap {
  titleKey: string | null;
  slugKey: string | null;
  dateKey: string | null;
  tagsKey: string | null;
  categoryKey: string | null;
  publishedKey: string | null;
  coverKey: string | null;
}

function buildSchemaMap(schema: CollectionPropertySchemaMap): SchemaMap {
  const map: SchemaMap = {
    titleKey: null,
    slugKey: null,
    dateKey: null,
    tagsKey: null,
    categoryKey: null,
    publishedKey: null,
    coverKey: null,
  };

  for (const [key, value] of Object.entries(schema)) {
    const name = value.name?.toLowerCase();
    if (value.type === "title") map.titleKey = key;
    else if (name === "slug") map.slugKey = key;
    else if (name === "date") map.dateKey = key;
    else if (name === "tags") map.tagsKey = key;
    else if (name === "category") map.categoryKey = key;
    else if (name === "published" || name === "public") map.publishedKey = key;
    else if (name === "cover") map.coverKey = key;
  }

  return map;
}

function extractPost(
  id: string,
  properties: Record<string, unknown[][]>,
  schema: SchemaMap,
  block: { last_edited_time?: number; format?: { page_cover?: string } }
): BlogPost {
  const title = schema.titleKey ? getTextContent(properties[schema.titleKey] as never) : "";
  const slug = schema.slugKey ? getTextContent(properties[schema.slugKey] as never) : "";
  const date = schema.dateKey ? getTextContent(properties[schema.dateKey] as never) : "";
  const tagsRaw = schema.tagsKey ? getTextContent(properties[schema.tagsKey] as never) : "";
  const tags = tagsRaw ? tagsRaw.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
  const category = schema.categoryKey
    ? getTextContent(properties[schema.categoryKey] as never)
    : undefined;
  const publishedRaw = schema.publishedKey
    ? getTextContent(properties[schema.publishedKey] as never)
    : "";
  const published = publishedRaw === "Yes" || publishedRaw === "yes" || publishedRaw === "true";

  const coverImage = block.format?.page_cover ?? undefined;
  const lastEditedTime = block.last_edited_time
    ? new Date(block.last_edited_time).toISOString()
    : new Date().toISOString();

  return {
    id,
    title,
    slug,
    date,
    tags,
    category: category || undefined,
    coverImage,
    published,
    lastEditedTime,
  };
}
