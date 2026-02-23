---
title: Fetcher
description: "@noxion/core data fetching API — Notion client and page fetching functions"
---

# Fetcher

```ts
import {
  createNotionClient,
  fetchBlogPosts,
  fetchCollection,
  fetchAllCollections,
  fetchPostBySlug,
  fetchPage,
  fetchAllSlugs,
} from "@noxion/core";
```

These functions are the data layer of Noxion. They use the **unofficial Notion API** (via [`notion-client`](https://www.npmjs.com/package/notion-client)) to fetch page data, then normalize it into typed `NoxionPage` objects.

---

## `createNotionClient()`

Creates an authenticated Notion API client.

### Signature

```ts
function createNotionClient(options?: {
  authToken?: string;
}): NotionAPI
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options.authToken` | `string?` | Notion integration token. Required for private pages; omit for public pages. |

### Example

```ts
import { createNotionClient } from "@noxion/core";

const notion = createNotionClient();

const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN,
});
```

---

## `fetchBlogPosts()`

Fetches all published posts from a Notion database. Returns `BlogPage[]` sorted by date descending. This is the v0.1 API — still works in v0.2 for single-database blog sites.

### Signature

```ts
async function fetchBlogPosts(
  client: NotionAPI,
  databasePageId: string
): Promise<BlogPage[]>
```

### Internal algorithm

1. Calls `client.getPage(databasePageId)` for the full record map
2. Reads the collection schema to find property keys (matched case-insensitively)
3. Enumerates all block IDs from all views
4. Extracts each page: properties, frontmatter, filters unpublished
5. Sorts by `metadata.date` descending

### Slug resolution order

1. Frontmatter `cleanUrl` (leading `/` stripped)
2. Frontmatter `slug`
3. Notion `Slug` property
4. Notion page ID (fallback)

### Example

```ts
const posts = await fetchBlogPosts(notion, siteConfig.rootNotionPageId);
// posts[0].title → "My Most Recent Post"
// posts[0].metadata.tags → ["react", "typescript"]
```

---

## `fetchCollection()`

Fetches all published pages from a Notion database, with page-type-aware schema mapping. This is the v0.2 API for multi-database sites.

### Signature

```ts
async function fetchCollection(
  client: NotionAPI,
  collection: NoxionCollection
): Promise<NoxionPage[]>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `client` | `NotionAPI` | The Notion client |
| `collection` | `NoxionCollection` | Collection config with `databaseId`, `pageType`, optional `schema` overrides |

### Returns

`Promise<NoxionPage[]>` — array of pages typed according to the collection's `pageType`. Blog pages are sorted by date descending. Docs pages are sorted by section then order.

### Schema mapping

The fetcher uses **convention-based property mapping** per page type. Each page type has default Notion property names:

| Page Type | Expected Properties |
|-----------|--------------------|
| Blog | Title, Public, Published (date), Tags (multi-select), Category (select), Slug, Description, Author |
| Docs | Title, Public, Section (select), Order (number), Version (text), Slug, Description |
| Portfolio | Title, Public, Technologies (multi-select), Project URL (url/text), Year (text), Featured (checkbox), Slug, Description |

Override with the `schema` field:

```ts
const collection: NoxionCollection = {
  databaseId: "abc123...",
  pageType: "docs",
  schema: {
    section: "Department",
    order: "Sort Order",
  },
};
const pages = await fetchCollection(notion, collection);
```

### Example

```ts
import { fetchCollection } from "@noxion/core";

const blogPages = await fetchCollection(notion, {
  databaseId: process.env.NOTION_PAGE_ID!,
  pageType: "blog",
});

const docsPages = await fetchCollection(notion, {
  databaseId: process.env.DOCS_NOTION_ID!,
  pageType: "docs",
  pathPrefix: "docs",
});
```

---

## `fetchAllCollections()`

Fetches pages from all configured collections in parallel.

### Signature

```ts
async function fetchAllCollections(
  client: NotionAPI,
  collections: NoxionCollection[]
): Promise<NoxionPage[]>
```

### Returns

`Promise<NoxionPage[]>` — all pages from all collections, flattened into a single array.

### Example

```ts
const allPages = await fetchAllCollections(notion, siteConfig.collections!);
const blogPages = allPages.filter(isBlogPage);
const docsPages = allPages.filter(isDocsPage);
```

---

## `fetchPostBySlug()`

Fetches all published posts and returns the one matching the given slug.

### Signature

```ts
async function fetchPostBySlug(
  client: NotionAPI,
  databasePageId: string,
  slug: string
): Promise<BlogPage | undefined>
```

This function calls `fetchBlogPosts()` internally — only one API call is made.

### Example

```ts
const post = await fetchPostBySlug(notion, siteConfig.rootNotionPageId, "my-post");
```

---

## `fetchPage()`

Fetches the full block data (`ExtendedRecordMap`) for a single Notion page. This is what you pass to `<NotionPage recordMap={...} />`.

### Signature

```ts
async function fetchPage(
  client: NotionAPI,
  pageId: string
): Promise<ExtendedRecordMap>
```

### Example

```ts
const recordMap = await fetchPage(notion, post.id);
return <NotionPage recordMap={recordMap} rootPageId={post.id} />;
```

---

## `fetchAllSlugs()`

Fetches all published post slugs. Used for `generateStaticParams()`.

### Signature

```ts
async function fetchAllSlugs(
  client: NotionAPI,
  databasePageId: string
): Promise<string[]>
```

### Example

```ts
export async function generateStaticParams() {
  const slugs = await fetchAllSlugs(notion, siteConfig.rootNotionPageId);
  return slugs.map((slug) => ({ slug }));
}
```
