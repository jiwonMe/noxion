---
title: Fetcher
description: "@noxion/core data fetching API"
---

# Fetcher

```ts
import { createNotionClient, fetchBlogPosts, fetchPostBySlug, fetchPage } from "@noxion/core";
```

## `createNotionClient()`

```ts
function createNotionClient(options: { authToken?: string }): NotionAPI
```

Creates a Notion API client. Pass `authToken` for private pages.

```ts
const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN,
});
```

---

## `fetchBlogPosts()`

Fetches all published posts from a Notion database, applies frontmatter, and sorts by date descending.

```ts
async function fetchBlogPosts(
  client: NotionAPI,
  rootPageId: string
): Promise<BlogPost[]>
```

### What it does

1. Calls `client.getPage(rootPageId)` to get the collection and all views
2. Collects block IDs from **all views** (including `collection_group_results`)
3. Filters to pages where `Public` checkbox is `Yes`
4. Maps schema properties to `BlogPost` fields
5. Parses frontmatter from the first code block of each page
6. Applies frontmatter (`cleanUrl`, `title`, `description`, etc.)
7. Sorts by `date` descending

### Slug resolution

1. Frontmatter `cleanUrl` (e.g. `/my-post` → `my-post`)
2. Notion `Slug` property
3. Notion page ID as fallback

---

## `fetchPostBySlug()`

```ts
async function fetchPostBySlug(
  client: NotionAPI,
  rootPageId: string,
  slug: string
): Promise<BlogPost | undefined>
```

Fetches all posts and finds the one matching the slug. Returns `undefined` if not found.

---

## `fetchPage()`

```ts
async function fetchPage(
  client: NotionAPI,
  pageId: string
): Promise<ExtendedRecordMap>
```

Fetches a Notion page's full record map (blocks, collections, signed URLs). Used for rendering with `react-notion-x`.

---

## `fetchAllSlugs()`

```ts
async function fetchAllSlugs(
  client: NotionAPI,
  rootPageId: string
): Promise<string[]>
```

Returns all published post slugs. Used by `generateStaticParams()`.
