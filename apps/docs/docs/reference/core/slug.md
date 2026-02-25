---
title: Slug Utilities
description: "@noxion/core slug and page-id utilities — generateSlug, parseNotionPageId, buildPageUrl, resolveSlug"
---

# Slug Utilities

```ts
import {
  generateSlug,
  parseNotionPageId,
  buildPageUrl,
  resolveSlug,
} from "@noxion/core";
```

---

## `generateSlug()`

Generates a URL-safe slug from a title.

### Signature

```ts
function generateSlug(title: string): string
```

### Behavior

- Lowercases the input
- Preserves Unicode letters/numbers (including CJK)
- Replaces whitespace with `-`
- Collapses repeated hyphens and trims edges

### Example

```ts
generateSlug("Hello, Noxion World!"); // "hello-noxion-world"
generateSlug("노션 CMS 시작하기");        // "노션-cms-시작하기"
```

---

## `parseNotionPageId()`

Normalizes a Notion page ID into UUID format (`8-4-4-4-12`).

### Signature

```ts
function parseNotionPageId(input: string): string
```

### Behavior

- Accepts plain 32-char IDs, hyphenated IDs, or URLs ending with a 32-char ID
- Returns a hyphenated UUID when input is parseable
- Returns the original input when it cannot parse a 32-char hex ID

### Example

```ts
parseNotionPageId("abc123def4567890abc123def4567890");
// "abc123de-f456-7890-abc1-23def4567890"

parseNotionPageId("https://notion.so/workspace/Page-abc123def4567890abc123def4567890");
// "abc123de-f456-7890-abc1-23def4567890"
```

---

## `buildPageUrl()`

Ensures a slug has a leading `/`.

### Signature

```ts
function buildPageUrl(slug: string): string
```

### Example

```ts
buildPageUrl("my-post"); // "/my-post"
buildPageUrl("/my-post"); // "/my-post"
```

---

## `resolveSlug()`

Resolves a post slug with fallback to title-based generation.

### Signature

```ts
function resolveSlug(post: BlogPost): string
```

### Behavior

- Returns `post.slug` when present
- Falls back to `generateSlug(post.title)` when slug is empty
