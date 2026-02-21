import type { NotionAPI } from "notion-client";
import type { ExtendedRecordMap, CollectionPropertySchemaMap, Block, Collection } from "notion-types";
import { getTextContent, defaultMapImageUrl } from "notion-utils";
import type { BlogPost } from "./types";
import { applyFrontmatter, parseKeyValuePairs } from "./frontmatter";

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
  const blockIds: string[] = collectAllBlockIds(queryResults);

  const schemaMap = buildSchemaMap(schema);

  const posts: BlogPost[] = [];
  for (const blockId of blockIds) {
    const block = unwrapValue<Block>(recordMap.block[blockId] as never);
    if (!block || block.type !== "page") continue;

    const properties = block.properties as Record<string, unknown[][]> | undefined;
    if (!properties) continue;

    let post = extractPost(blockId, properties, schemaMap, block);

    const frontmatter = extractInlineFrontmatter(recordMap, block);
    if (frontmatter) {
      post = applyFrontmatter(post, frontmatter);
    }

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

type ViewResult = {
  blockIds?: string[];
  collection_group_results?: { blockIds?: string[] };
};

function collectAllBlockIds(queryResults: Record<string, unknown> | undefined): string[] {
  if (!queryResults) return [];
  const seen = new Set<string>();
  for (const view of Object.values(queryResults) as ViewResult[]) {
    const ids = view?.blockIds ?? view?.collection_group_results?.blockIds ?? [];
    for (const id of ids) seen.add(id);
  }
  return [...seen];
}

interface SchemaMap {
  titleKey: string | null;
  slugKey: string | null;
  dateKey: string | null;
  tagsKey: string | null;
  categoryKey: string | null;
  publishedKey: string | null;
  coverKey: string | null;
  descriptionKey: string | null;
  authorKey: string | null;
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
    descriptionKey: null,
    authorKey: null,
  };

  for (const [key, value] of Object.entries(schema)) {
    const name = value.name?.toLowerCase();
    if (value.type === "title") map.titleKey = key;
    else if (name === "slug") map.slugKey = key;
    else if (name === "tags") map.tagsKey = key;
    else if (name === "category") map.categoryKey = key;
    else if (name === "cover") map.coverKey = key;
    else if (name === "description") map.descriptionKey = key;
    else if (name === "author") map.authorKey = key;
    else if ((name === "public" || name === "published") && value.type === "checkbox") map.publishedKey = key;
    else if ((name === "date" || name === "published") && (value.type === "date" || value.type === "last_edited_time")) map.dateKey = key;
  }

  return map;
}

function extractPost(
  id: string,
  properties: Record<string, unknown[][]>,
  schema: SchemaMap,
  block: { id?: string; space_id?: string; last_edited_time?: number; format?: { page_cover?: string } }
): BlogPost {
  const title = schema.titleKey ? getTextContent(properties[schema.titleKey] as never) : "";
  const rawSlug = schema.slugKey ? getTextContent(properties[schema.slugKey] as never) : "";
  const slug = rawSlug || id;
  const dateRaw = schema.dateKey ? getTextContent(properties[schema.dateKey] as never) : "";
  const date = parseDateValue(dateRaw, properties[schema.dateKey ?? ""] as unknown[][]);
  const tagsRaw = schema.tagsKey ? getTextContent(properties[schema.tagsKey] as never) : "";
  const tags = tagsRaw ? tagsRaw.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
  const category = schema.categoryKey
    ? getTextContent(properties[schema.categoryKey] as never)
    : undefined;
  const description = schema.descriptionKey
    ? getTextContent(properties[schema.descriptionKey] as never)
    : undefined;
  const author = schema.authorKey
    ? getTextContent(properties[schema.authorKey] as never)
    : undefined;
  const publishedRaw = schema.publishedKey
    ? getTextContent(properties[schema.publishedKey] as never)
    : "";
  const published = publishedRaw === "Yes" || publishedRaw === "yes" || publishedRaw === "true";

  const rawCover = block.format?.page_cover;
  const coverImage = rawCover
    ? defaultMapImageUrl(rawCover, block as Parameters<typeof defaultMapImageUrl>[1])
    : undefined;
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
    description: description || undefined,
    author: author || undefined,
    coverImage,
    published,
    lastEditedTime,
  };
}

function extractInlineFrontmatter(
  recordMap: ExtendedRecordMap,
  pageBlock: Block
): Record<string, string> | null {
  const childIds = (pageBlock as { content?: string[] }).content;
  if (!childIds || childIds.length === 0) return null;

  const firstChild = unwrapValue<Block>(recordMap.block[childIds[0]] as never);
  if (!firstChild || firstChild.type !== "code") return null;

  const props = firstChild.properties as Record<string, unknown[][]> | undefined;
  if (!props?.title) return null;

  const codeText = getTextContent(props.title as never);
  if (!codeText.trim()) return null;

  return parseKeyValuePairs(codeText);
}

function parseDateValue(textContent: string, rawProperty: unknown[][] | undefined): string {
  if (rawProperty) {
    for (const segment of rawProperty) {
      if (Array.isArray(segment) && segment.length >= 2) {
        const annotations = segment[1] as unknown[];
        if (Array.isArray(annotations)) {
          for (const ann of annotations) {
            if (Array.isArray(ann) && ann[0] === "d" && ann[1]?.start_date) {
              return ann[1].start_date;
            }
          }
        }
      }
    }
  }
  if (textContent) return textContent;
  return "";
}
