---
title: Frontmatter
description: "@noxion/core frontmatter API"
---

# Frontmatter

```ts
import { parseFrontmatter, parseKeyValuePairs, applyFrontmatter } from "@noxion/core";
```

Noxion reads frontmatter from the **first code block** of a Notion page. The block must be of type `code` and contain `key: value` pairs.

## `parseFrontmatter()`

```ts
function parseFrontmatter(
  recordMap: ExtendedRecordMap,
  pageId: string
): Record<string, string> | null
```

Extracts key-value pairs from the first code block of a page. Returns `null` if no code block is found.

```ts
const frontmatter = parseFrontmatter(recordMap, post.id);
// { cleanUrl: "/my-post", title: "My SEO Title", description: "..." }
```

---

## `parseKeyValuePairs()`

```ts
function parseKeyValuePairs(text: string): Record<string, string>
```

Parses a multi-line string of `key: value` pairs. Lines starting with `#` are treated as comments and ignored.

```ts
parseKeyValuePairs(`
cleanUrl: /my-post
title: My Post
# description: (draft)
floatFirstTOC: right
`);
// { cleanUrl: "/my-post", title: "My Post", floatFirstTOC: "right" }
```

---

## `applyFrontmatter()`

```ts
function applyFrontmatter(
  post: BlogPost,
  frontmatter: Record<string, string>
): BlogPost
```

Applies frontmatter values to a `BlogPost`. Known keys are mapped to specific fields:

| Frontmatter key | `BlogPost` field |
|-----------------|-----------------|
| `cleanUrl` | `slug` (leading `/` stripped) |
| `slug` | `slug` |
| `title` | `title` |
| `description` | `description` |
| `date` | `date` |
| `category` | `category` |
| `tags` | `tags` (comma-separated) |
| `coverImage` / `cover` | `coverImage` |

All keys (including unknown ones) are preserved in `post.frontmatter`.
