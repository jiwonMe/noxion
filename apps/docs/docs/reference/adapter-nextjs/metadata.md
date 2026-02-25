---
title: Metadata
description: "@noxion/adapter-nextjs metadata generation for Next.js App Router"
---

# Metadata API

```ts
import {
  generateNoxionMetadata,
  generateNoxionListMetadata,
} from "@noxion/adapter-nextjs";
```

These functions generate [Next.js Metadata objects](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) for use in the App Router's `generateMetadata()` export.

---

## `generateNoxionMetadata()`

Generates `Metadata` for a single page. Works with all page types (`NoxionPage`): blog, docs, portfolio, or custom.

### Signature

```ts
function generateNoxionMetadata(
  page: NoxionPage,
  config: NoxionConfig,
  registry?: PageTypeRegistry
): Metadata
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `NoxionPage` | The page to generate metadata for (any page type) |
| `config` | `NoxionConfig` | Your site configuration |

### Generated fields

| Metadata field | Source |
|----------------|--------|
| `title` | `page.title` |
| `description` | `page.description` or fallback `"<page title> - <site name>"` (max 160 chars) |
| `authors` | `page.metadata.author ?? config.author` |
| `openGraph.type` | `"article"` for blog pages, otherwise `"website"` |
| `openGraph.publishedTime` | `page.metadata.date` (blog pages) |
| `openGraph.modifiedTime` | `page.lastEditedTime` |
| `openGraph.tags` | `page.metadata.tags` (blog pages) |
| `openGraph.section` | `page.metadata.category` (when present) |
| `openGraph.images` | `page.coverImage` (1200×630) |
| `twitter.card` | `"summary_large_image"` |
| `alternates.canonical` | `https://{domain}/{slug}` |

Metadata fields are accessed from `page.metadata` using internal helper functions `getMetaString()` and `getMetaStringArray()`.

### Usage

```tsx
// app/[slug]/page.tsx
import { generateNoxionMetadata } from "@noxion/adapter-nextjs";

export async function generateMetadata({ params }) {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  return generateNoxionMetadata(post, siteConfig);
}
```

---

## `generateNoxionListMetadata()`

Generates `Metadata` for the homepage and list/collection pages.

### Signature

```ts
function generateNoxionListMetadata(config: NoxionConfig): Metadata
```

### Generated fields

| Metadata field | Value |
|----------------|-------|
| `title.default` | `config.name` |
| `title.template` | `"%s \| config.name"` |
| `description` | `config.description` |
| `metadataBase` | `new URL("https://<site-domain>")` |
| `openGraph.type` | `"website"` |
| `robots.index` / `robots.follow` | `true` |
| `alternates.types["application/rss+xml"]` | RSS feed discovery (if RSS plugin configured) |

### Usage

```tsx
// app/layout.tsx
import { generateNoxionListMetadata } from "@noxion/adapter-nextjs";

export const metadata = generateNoxionListMetadata(siteConfig);
```
