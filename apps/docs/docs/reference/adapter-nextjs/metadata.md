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

These functions generate [Next.js Metadata objects](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) for use in the App Router's `generateMetadata()` export. They produce fully-populated `<head>` tags for SEO: `<title>`, `<meta description>`, Open Graph, Twitter Cards, canonical URL, and robots directives.

---

## `generateNoxionMetadata()`

Generates `Metadata` for a single post page.

### Signature

```ts
function generateNoxionMetadata(
  post: BlogPost,
  config: NoxionConfig
): Metadata
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `post` | `BlogPost` | The post to generate metadata for |
| `config` | `NoxionConfig` | Your site configuration |

### Returns

Next.js [`Metadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-object) object.

### Generated fields

| Metadata field | Value | Source |
|----------------|-------|--------|
| `title` | `post.title` (template: `%s \| config.name`) | `post.title` |
| `description` | Post description, max 160 chars | `post.description ?? post.title` |
| `authors` | `[{ name: post.author ?? config.author }]` | `post.author \|\| config.author` |
| `openGraph.type` | `"article"` | — |
| `openGraph.title` | `post.title` | — |
| `openGraph.description` | Same as `description` | — |
| `openGraph.url` | `https://${config.domain}/${post.slug}` | — |
| `openGraph.publishedTime` | ISO datetime | `post.date` |
| `openGraph.modifiedTime` | ISO datetime | `post.lastEditedTime` |
| `openGraph.authors` | `[post.author ?? config.author]` | — |
| `openGraph.section` | Category name | `post.category` |
| `openGraph.tags` | Array of tag strings | `post.tags` |
| `openGraph.images` | `[{ url, width: 1200, height: 630, alt }]` | `post.coverImage` |
| `openGraph.locale` | `"en_US"` / `"ko_KR"` / `"ja_JP"` / etc. | `config.language` |
| `twitter.card` | `"summary_large_image"` | — |
| `twitter.title` | `post.title` | — |
| `twitter.description` | Same as `description` | — |
| `twitter.images` | `[post.coverImage]` | — |
| `alternates.canonical` | `https://${config.domain}/${post.slug}` | — |

### `og:image` behavior

If `post.coverImage` is set, it's used as the OG image with `width: 1200, height: 630`. If no cover image is available, `openGraph.images` is an empty array (no OG image). Social platforms will fall back to their default display.

### Language → locale mapping

The `og:locale` is derived from `config.language` using this mapping:

| `language` | `og:locale` |
|------------|-------------|
| `"en"` | `"en_US"` |
| `"ko"` | `"ko_KR"` |
| `"ja"` | `"ja_JP"` |
| `"zh"` | `"zh_CN"` |
| `"de"` | `"de_DE"` |
| `"fr"` | `"fr_FR"` |
| `"es"` | `"es_ES"` |
| others | `"en_US"` (fallback) |

### Usage

```tsx
// app/[slug]/page.tsx
import type { Metadata } from "next";
import { generateNoxionMetadata } from "@noxion/adapter-nextjs";
import { siteConfig } from "@/lib/config";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};  // Next.js will use parent layout's metadata

  return generateNoxionMetadata(post, siteConfig);
}
```

---

## `generateNoxionListMetadata()`

Generates `Metadata` for the homepage and any list/collection pages.

### Signature

```ts
function generateNoxionListMetadata(config: NoxionConfig): Metadata
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `NoxionConfig` | Your site configuration |

### Returns

Next.js `Metadata` object.

### Generated fields

| Metadata field | Value | Notes |
|----------------|-------|-------|
| `title.default` | `config.name` | Used when no child `title` is set |
| `title.template` | `"%s \| config.name"` | Template for child pages |
| `description` | `config.description` | |
| `metadataBase` | `new URL("https://${config.domain}")` | Enables relative URL resolution |
| `openGraph.type` | `"website"` | |
| `openGraph.title` | `config.name` | |
| `openGraph.description` | `config.description` | |
| `openGraph.url` | `https://${config.domain}/` | |
| `openGraph.locale` | Mapped from `config.language` | |
| `openGraph.siteName` | `config.name` | |
| `twitter.card` | `"summary_large_image"` | |
| `robots.index` | `true` | Allow indexing |
| `robots.follow` | `true` | Follow links |
| `robots.googleBot` | `{ "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }` | Instructs Google's bot |
| `alternates.types["application/rss+xml"]` | RSS feed discovery `<link>` | Added if RSS plugin is configured |

### `title.template` explained

Setting `title.template: "%s | My Blog"` in the root layout means every child page's `title` string is automatically appended with `| My Blog`. For example, a post with `title: "Getting Started"` will produce:

```html
<title>Getting Started | My Blog</title>
```

without any extra configuration in the post page. See [Next.js Metadata title docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title).

### `metadataBase` explained

[`metadataBase`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase) is required by Next.js to resolve relative URL strings in metadata fields (like `og:image`). Setting it to your domain ensures that relative paths like `/images/cover.jpg` resolve to `https://myblog.com/images/cover.jpg`.

### Usage

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { generateNoxionListMetadata } from "@noxion/adapter-nextjs";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = generateNoxionListMetadata(siteConfig);

export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>;
}
```

The metadata generated here serves as the **base metadata** for the entire site. Individual post pages override it via `generateMetadata()`.
