---
title: Frontmatter
description: "@noxion/core frontmatter parsing API"
---

# Frontmatter API

```ts
import {
  parseFrontmatter,
  parseKeyValuePairs,
  applyFrontmatter,
} from "@noxion/core";
```

Noxion supports per-post metadata overrides via **frontmatter** — a code block at the very top of a Notion page containing `key: value` pairs. This lets you set custom slugs, SEO titles, and other metadata from within Notion without changing your database schema.

See [Notion Setup → Frontmatter overrides](../../learn/notion-setup#frontmatter-overrides) for user-facing documentation.

---

## `parseFrontmatter()`

Extracts `key: value` pairs from the **first code block** of a Notion page.

### Signature

```ts
function parseFrontmatter(
  recordMap: ExtendedRecordMap,
  pageId: string
): Record<string, string> | null
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `recordMap` | `ExtendedRecordMap` | The full page data (from `fetchPage()` or from the database fetch) |
| `pageId` | `string` | The page's block ID |

### Returns

`Record<string, string> | null`

- A key-value map if a code block was found and parsed successfully
- `null` if the first content block is not a code block (no frontmatter)

### How it works

1. Reads `pageBlock.content` (the array of child block IDs)
2. If the array is empty or non-existent, returns `null`
3. Reads the first child block
4. If the block type is not `"code"`, returns `null`
5. Extracts the text content from the block's `properties.title`
6. Calls `parseKeyValuePairs()` on the text content

### Example

```ts
import { createNotionClient, fetchPage, parseFrontmatter } from "@noxion/core";

const notion = createNotionClient();
const recordMap = await fetchPage(notion, "abc123...");
const frontmatter = parseFrontmatter(recordMap, "abc123...");

// If the first code block contains:
// cleanUrl: /my-post
// title: Custom SEO Title
// description: A great description
//
// Then:
// frontmatter → { cleanUrl: "/my-post", title: "Custom SEO Title", description: "A great description" }
// Or:
// frontmatter → null (if no code block at the top)
```

---

## `parseKeyValuePairs()`

Parses a multi-line string of `key: value` pairs into an object.

### Signature

```ts
function parseKeyValuePairs(text: string): Record<string, string>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | `string` | Multi-line string to parse |

### Returns

`Record<string, string>` — parsed key-value pairs. Always returns an object (never `null`).

### Parsing rules

| Rule | Example |
|------|---------|
| Lines with `key: value` are parsed | `title: My Post` → `{ title: "My Post" }` |
| Lines starting with `#` are comments | `# this is ignored` |
| Empty lines are ignored | |
| Keys are trimmed of whitespace | `  key  : value` → `{ key: "value" }` |
| Values include everything after the first `:` | `url: https://example.com/path?a=b:c` → `{ url: "https://example.com/path?a=b:c" }` |
| Lines without `:` are ignored | `just some text` |

### Example

```ts
import { parseKeyValuePairs } from "@noxion/core";

parseKeyValuePairs(`
cleanUrl: /my-custom-slug
title: My SEO-Optimized Title
# description: (draft — not included)
description: The published description
tags: react, typescript, web
floatFirstTOC: right
`);
// Returns:
// {
//   cleanUrl: "/my-custom-slug",
//   title: "My SEO-Optimized Title",
//   description: "The published description",
//   tags: "react, typescript, web",
//   floatFirstTOC: "right",
// }
```

---

## `applyFrontmatter()`

Applies frontmatter key-value pairs to a `BlogPost` object, mapping known keys to specific fields and preserving all keys in `post.frontmatter`.

### Signature

```ts
function applyFrontmatter(
  post: BlogPost,
  frontmatter: Record<string, string>
): BlogPost
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `post` | `BlogPost` | The source post object |
| `frontmatter` | `Record<string, string>` | Parsed frontmatter (from `parseFrontmatter()` or `parseKeyValuePairs()`) |

### Returns

`BlogPost` — a new post object with frontmatter overrides applied. The original `post` is **not** mutated.

### Known key mappings

| Frontmatter key | `BlogPost` field | Transformation |
|-----------------|-----------------|----------------|
| `cleanUrl` | `slug` | Leading `/` is stripped: `/my-post` → `my-post` |
| `slug` | `slug` | Used as-is |
| `title` | `title` | Direct replacement |
| `description` | `description` | Direct replacement |
| `date` | `date` | Direct replacement (should be `YYYY-MM-DD` format) |
| `category` | `category` | Direct replacement |
| `tags` | `tags` | Split by `,` and trimmed: `"react, ts"` → `["react", "ts"]` |
| `coverImage` | `coverImage` | Direct replacement |
| `cover` | `coverImage` | Alias for `coverImage` |

All frontmatter keys (including unknown/custom ones) are preserved in `post.frontmatter` as a `Record<string, string>`.

### Example

```ts
import { applyFrontmatter } from "@noxion/core";

const post = {
  id: "abc123",
  title: "Original Notion Title",
  slug: "abc123",  // Fallback: page ID
  tags: [],
  // ...
};

const frontmatter = {
  cleanUrl: "/better-slug",
  title: "SEO-Optimized Title",
  tags: "react, typescript, tutorial",
  myCustomKey: "some-value",
};

const updatedPost = applyFrontmatter(post, frontmatter);
// updatedPost.slug          → "better-slug"  (leading / stripped)
// updatedPost.title         → "SEO-Optimized Title"
// updatedPost.tags          → ["react", "typescript", "tutorial"]
// updatedPost.frontmatter   → { cleanUrl: "/better-slug", title: "SEO-Optimized Title", tags: "react, typescript, tutorial", myCustomKey: "some-value" }
```

### Custom frontmatter in your app

Unknown frontmatter keys are accessible via `post.frontmatter`:

```tsx
// app/[slug]/page.tsx
const post = await getPostBySlug(slug);

// Check if this post should show comments
const showComments = post.frontmatter?.comments !== "false";

// Use a custom layout hint
const layoutHint = post.frontmatter?.layout ?? "default";
```
