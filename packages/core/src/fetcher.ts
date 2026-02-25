import type { NotionAPI } from "notion-client";
import type { ExtendedRecordMap, CollectionPropertySchemaMap, Block, Collection } from "notion-types";
import { getTextContent, defaultMapImageUrl } from "notion-utils";
import type { NoxionPage, BlogPage, NoxionCollection, NoxionConfig } from "./types";
import { applyFrontmatter, parseKeyValuePairs } from "./frontmatter";
import { buildPropertyMapping, type PropertyMapping } from "./schema-mapper";

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
): Promise<BlogPage[]> {
  const recordMap = await client.getPage(databasePageId);
  return extractPagesFromRecordMap(recordMap, "blog") as BlogPage[];
}

export async function fetchCollection(
  client: NotionAPI,
  collection: NoxionCollection,
): Promise<NoxionPage[]> {
  const recordMap = await client.getPage(collection.databaseId);
  return extractPagesFromRecordMap(recordMap, collection.pageType, collection.schema);
}

export async function fetchAllCollections(
  client: NotionAPI,
  config: NoxionConfig,
): Promise<NoxionPage[]> {
  const collections = config.collections ?? [];
  const allPages: NoxionPage[] = [];
  for (const collection of collections) {
    const pages = await fetchCollection(client, collection);
    allPages.push(...pages);
  }
  return allPages;
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
): Promise<BlogPage | undefined> {
  const posts = await fetchBlogPosts(client, databasePageId);
  return posts.find((p) => p.slug === slug);
}

function extractPagesFromRecordMap(
  recordMap: ExtendedRecordMap,
  pageType: string,
  schemaOverrides?: Record<string, string>,
): NoxionPage[] {
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

  const propertyMap = buildPropertyMapping(schema, pageType, schemaOverrides);

  const pages: NoxionPage[] = [];
  for (const blockId of blockIds) {
    const block = unwrapValue<Block>(recordMap.block[blockId] as never);
    if (!block || block.type !== "page") continue;

    const properties = block.properties as Record<string, unknown[][]> | undefined;
    if (!properties) continue;

    const detectedPageType = detectPageType(properties, propertyMap, pageType);
    let page = extractPage(blockId, properties, propertyMap, block, detectedPageType);

    const frontmatter = extractInlineFrontmatter(recordMap, block);
    if (frontmatter) {
      page = applyFrontmatter(page, frontmatter);
    }

    if (page.published) {
      pages.push(page);
    }
  }

  if (pageType === "blog") {
    pages.sort((a, b) => {
      const dateA = new Date(String(a.metadata.date ?? "")).getTime();
      const dateB = new Date(String(b.metadata.date ?? "")).getTime();
      return dateB - dateA;
    });
  }

  return pages;
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

function detectPageType(
  properties: Record<string, unknown[][]>,
  propertyMap: PropertyMapping,
  fallbackType: string,
): string {
  if (!propertyMap.typeKey) return fallbackType;
  const typeValue = getTextContent(properties[propertyMap.typeKey] as never)?.toLowerCase();
  return typeValue || fallbackType;
}

function extractPage(
  id: string,
  properties: Record<string, unknown[][]>,
  mapping: PropertyMapping,
  block: { id?: string; space_id?: string; last_edited_time?: number; format?: { page_cover?: string } },
  pageType: string,
): NoxionPage {
  const title = mapping.titleKey ? getTextContent(properties[mapping.titleKey] as never) : "";
  const rawSlug = mapping.slugKey ? getTextContent(properties[mapping.slugKey] as never) : "";
  const slug = rawSlug || id;
  const description = mapping.descriptionKey
    ? getTextContent(properties[mapping.descriptionKey] as never) || undefined
    : undefined;
  const author = mapping.authorKey
    ? getTextContent(properties[mapping.authorKey] as never) || undefined
    : undefined;
  const publishedRaw = mapping.publishedKey
    ? getTextContent(properties[mapping.publishedKey] as never)
    : "";
  const published = publishedRaw === "Yes" || publishedRaw === "yes" || publishedRaw === "true";

  const dateRaw = mapping.dateKey ? getTextContent(properties[mapping.dateKey] as never) : "";
  const date = parseDateValue(dateRaw, properties[mapping.dateKey ?? ""] as unknown[][]);

  const rawCover = block.format?.page_cover;
  const coverImage = rawCover
    ? defaultMapImageUrl(rawCover, block as Parameters<typeof defaultMapImageUrl>[1])
    : undefined;
  const lastEditedTime = block.last_edited_time
    ? new Date(block.last_edited_time).toISOString()
    : new Date().toISOString();

  const metadata = buildMetadata(properties, mapping, date, author);

  return {
    id,
    title,
    slug,
    pageType,
    published,
    lastEditedTime,
    coverImage,
    description,
    metadata,
  };
}

function buildMetadata(
  properties: Record<string, unknown[][]>,
  mapping: PropertyMapping,
  date: string,
  author: string | undefined,
): Record<string, unknown> {
  const metadata: Record<string, unknown> = {};

  if (date) metadata.date = date;
  if (author) metadata.author = author;

  for (const [field, key] of Object.entries(mapping.metadataKeys)) {
    const val = getTextContent(properties[key] as never);
    if (!val) continue;

    if (field === "tags" || field === "technologies") {
      metadata[field] = val.split(",").map((t: string) => t.trim()).filter(Boolean);
    } else if (field === "order") {
      metadata[field] = parseInt(val, 10) || 0;
    } else if (field === "featured") {
      metadata[field] = val === "Yes" || val === "yes" || val === "true";
    } else {
      metadata[field] = val;
    }
  }

  return metadata;
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
