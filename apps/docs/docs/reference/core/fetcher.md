---
title: Fetcher
description: "@noxion/core data fetching API — Notion client and post fetching functions"
---

# Fetcher

```ts
import {
  createNotionClient,
  fetchBlogPosts,
  fetchPostBySlug,
  fetchPage,
  fetchAllSlugs,
} from "@noxion/core";
```

These functions are the data layer of Noxion. They use the **unofficial Notion API** (via [`notion-client`](https://www.npmjs.com/package/notion-client)) to fetch page data, then normalize it into typed `BlogPost` objects.

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
| `options.authToken` | `string \| undefined` | Notion integration token (`secret_xxx...`). Required for private pages; omit for public pages. |

### Returns

`NotionAPI` — an instance of `notion-client`'s `NotionAPI` class. This is the client you pass to all other fetcher functions.

### Example

```ts
import { createNotionClient } from "@noxion/core";

// Public pages (no auth token needed)
const notion = createNotionClient();

// Private pages (requires NOTION_TOKEN env var)
const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN,
});
```

In the generated `lib/notion.ts`, this is already set up:

```ts
// lib/notion.ts (generated)
import { createNotionClient } from "@noxion/core";

export const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN,
});
```

---

## `fetchBlogPosts()`

Fetches all published posts from a Notion database, normalizes them into `BlogPost` objects, and sorts them by date descending.

### Signature

```ts
async function fetchBlogPosts(
  client: NotionAPI,
  databasePageId: string
): Promise<BlogPost[]>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `client` | `NotionAPI` | The Notion client from `createNotionClient()` |
| `databasePageId` | `string` | The root database page ID |

### Returns

`Promise<BlogPost[]>` — array of published posts, sorted by `date` descending (newest first).

### Internal algorithm

1. **`client.getPage(databasePageId)`** — fetches the full record map for the database page, including all collection views and their block IDs
2. **Schema extraction** — reads the collection schema to find which property key corresponds to `Title`, `Public`, `Tags`, `Slug`, etc. (matched case-insensitively)
3. **Block enumeration** — collects all block IDs from all views, including `collection_group_results` (for grouped views)
4. **Post extraction** — for each block ID:
   - Skips non-page blocks
   - Reads properties using the schema map
   - Extracts inline frontmatter from the first code block
   - Applies frontmatter overrides
   - Filters out unpublished posts (`Public` not checked)
5. **Sort** — sorts by `date` descending

### Slug resolution order

1. Frontmatter `cleanUrl` (leading `/` stripped)
2. Frontmatter `slug`
3. Notion `Slug` property
4. Notion page ID (as fallback — always unique)

### Caching

In the generated app, `fetchBlogPosts()` is called inside Next.js App Router page components with `export const revalidate = config.revalidate`. Next.js caches the result and revalidates it automatically. You can also use React's [`cache()`](https://react.dev/reference/react/cache) to deduplicate requests within a single render:

```ts
import { cache } from "react";
import { fetchBlogPosts } from "@noxion/core";

// Deduplicated: multiple calls in the same render return the same promise
export const getAllPosts = cache(async () => {
  return fetchBlogPosts(notion, siteConfig.rootNotionPageId);
});
```

### Example

```ts
import { createNotionClient, fetchBlogPosts } from "@noxion/core";

const notion = createNotionClient();
const posts = await fetchBlogPosts(notion, "abc123def456...");
// posts: BlogPost[] sorted by date descending
// posts[0].title → "My Most Recent Post"
// posts[0].slug  → "my-most-recent-post"
// posts[0].tags  → ["react", "typescript"]
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
): Promise<BlogPost | undefined>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `client` | `NotionAPI` | The Notion client |
| `databasePageId` | `string` | The root database page ID |
| `slug` | `string` | The URL slug to look up |

### Returns

`Promise<BlogPost | undefined>` — the matching post, or `undefined` if not found.

### Notes

This function calls `fetchBlogPosts()` internally and filters the result. It does **not** make an additional Notion API call — only one API call is made per invocation.

If you need to fetch multiple posts by slug in a single render, consider fetching all posts once with `fetchBlogPosts()` and filtering yourself to avoid redundant API calls:

```ts
// Efficient: one API call, multiple lookups
const allPosts = await getAllPosts();
const post = allPosts.find(p => p.slug === slug);
```

### Example

```ts
// app/[slug]/page.tsx
export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await fetchPostBySlug(notion, siteConfig.rootNotionPageId, slug);

  if (!post) {
    notFound(); // Next.js 404
  }

  return <PostContent post={post} />;
}
```

---

## `fetchPage()`

Fetches the full block data (`ExtendedRecordMap`) for a single Notion page. This is the data needed to render a Notion page with `react-notion-x`.

### Signature

```ts
async function fetchPage(
  client: NotionAPI,
  pageId: string
): Promise<ExtendedRecordMap>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `client` | `NotionAPI` | The Notion client |
| `pageId` | `string` | The page ID to fetch (e.g. `post.id`) |

### Returns

`Promise<ExtendedRecordMap>` — the full Notion page data, including:
- All blocks (paragraphs, headings, code, images, etc.)
- Collection data (for inline databases in the page)
- Signed URLs (automatically converted to stable proxy URLs)
- User data and space data

This object is passed directly to `<NotionPage recordMap={recordMap} />`.

### Example

```ts
// app/[slug]/page.tsx
import { fetchPage } from "@noxion/core";
import { NotionPage } from "@noxion/renderer";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const recordMap = await fetchPage(notion, post.id);

  return (
    <NotionPage
      recordMap={recordMap}
      rootPageId={post.id}
      nextImage={Image}
    />
  );
}
```

---

## `fetchAllSlugs()`

Fetches all published post slugs. Primarily used for `generateStaticParams()` in the `[slug]/page.tsx` route.

### Signature

```ts
async function fetchAllSlugs(
  client: NotionAPI,
  databasePageId: string
): Promise<string[]>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `client` | `NotionAPI` | The Notion client |
| `databasePageId` | `string` | The root database page ID |

### Returns

`Promise<string[]>` — array of slug strings for all published posts.

### Example

```ts
// app/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = await fetchAllSlugs(notion, siteConfig.rootNotionPageId);
  return slugs.map((slug) => ({ slug }));
}
```

This is equivalent to `generateNoxionStaticParams()` from `@noxion/adapter-nextjs`, which wraps this function:

```ts
// Equivalent:
export const generateStaticParams = () =>
  generateNoxionStaticParams(notion, siteConfig.rootNotionPageId);
```
