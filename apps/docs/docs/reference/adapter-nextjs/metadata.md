---
title: Metadata
description: "@noxion/adapter-nextjs metadata API"
---

# Metadata

```ts
import { generateNoxionMetadata, generateNoxionListMetadata } from "@noxion/adapter-nextjs";
```

## `generateNoxionMetadata()`

Generates Next.js `Metadata` for a single post page.

```ts
function generateNoxionMetadata(post: BlogPost, config: NoxionConfig): Metadata
```

### Generated fields

| Field | Value |
|-------|-------|
| `title` | `post.title` (template appends `| Site Name`) |
| `description` | `post.description` (160-char truncated) |
| `authors` | `[{ name: post.author ?? config.author }]` |
| `openGraph.type` | `"article"` |
| `openGraph.publishedTime` | `post.date` as ISO string |
| `openGraph.modifiedTime` | `post.lastEditedTime` |
| `openGraph.authors` | `[post.author ?? config.author]` |
| `openGraph.section` | `post.category` |
| `openGraph.tags` | `post.tags` |
| `openGraph.images` | Cover image with `width: 1200, height: 630, alt` |
| `openGraph.locale` | `ko_KR` / `en_US` / `ja_JP` |
| `twitter.card` | `"summary_large_image"` |
| `alternates.canonical` | `https://domain.com/slug` |

### Usage

```tsx
// app/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  return generateNoxionMetadata(post, siteConfig);
}
```

---

## `generateNoxionListMetadata()`

Generates `Metadata` for the homepage / list pages.

```ts
function generateNoxionListMetadata(config: NoxionConfig): Metadata
```

### Generated fields

- `title.default` + `title.template: "%s | Site Name"`
- `metadataBase` — enables relative URL resolution
- `robots.googleBot` — `max-image-preview: large`, `max-snippet: -1`
- `alternates.types["application/rss+xml"]` — RSS feed link
