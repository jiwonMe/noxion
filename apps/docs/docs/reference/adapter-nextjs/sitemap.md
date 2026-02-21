---
title: Sitemap, Robots & Static Params
description: "@noxion/adapter-nextjs sitemap, robots.txt, and generateStaticParams helpers"
---

# Sitemap, Robots & Static Params

```ts
import {
  generateNoxionSitemap,
  generateNoxionRobots,
  generateNoxionStaticParams,
} from "@noxion/adapter-nextjs";
```

---

## `generateNoxionSitemap()`

Generates a [`MetadataRoute.Sitemap`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) array for Next.js's built-in sitemap generation.

### Signature

```ts
function generateNoxionSitemap(
  posts: BlogPost[],
  config: NoxionConfig
): MetadataRoute.Sitemap
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `posts` | `BlogPost[]` | All published posts (from `getAllPosts()`) |
| `config` | `NoxionConfig` | Your site configuration |

### Returns

[`MetadataRoute.Sitemap`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — an array of sitemap entry objects that Next.js converts to XML.

### Generated entries

| URL | Priority | `changefreq` | `lastmod` |
|-----|----------|--------------|-----------|
| Homepage (`/`) | 1.0 | `"daily"` | Current date |
| Each post (`/${slug}`) | 0.8 | `"weekly"` | `post.lastEditedTime` |
| Each unique tag page (`/tag/${tag}`) | 0.5 | `"weekly"` | Most recent post's lastEditedTime |

The `lastmod` date for tag pages is the `lastEditedTime` of the most recently edited post with that tag. This tells search engines when the tag page's content last changed.

### Generated XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://myblog.com/</loc>
    <lastmod>2025-02-21</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://myblog.com/getting-started-with-bun</loc>
    <lastmod>2025-02-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://myblog.com/tag/bun</loc>
    <lastmod>2025-02-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Usage

```ts
// app/sitemap.ts
import { generateNoxionSitemap } from "@noxion/adapter-nextjs";
import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/notion";

export default async function sitemap() {
  const posts = await getAllPosts();
  return generateNoxionSitemap(posts, siteConfig);
}
```

This file is picked up by Next.js automatically and served at `/sitemap.xml`. See [Next.js sitemap docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).

---

## `generateNoxionRobots()`

Generates a [`MetadataRoute.Robots`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) object for Next.js's built-in robots.txt generation.

### Signature

```ts
function generateNoxionRobots(config: NoxionConfig): MetadataRoute.Robots
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `NoxionConfig` | Your site configuration |

### Returns

[`MetadataRoute.Robots`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — Next.js converts this to a `robots.txt` text file.

### Generated robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://myblog.com/sitemap.xml
Host: https://myblog.com
```

**Directives explained:**

| Directive | Reason |
|-----------|--------|
| `Allow: /` | Allow all crawlers to index everything |
| `Disallow: /api/` | Prevent crawlers from hitting API routes (revalidation endpoint, etc.) |
| `Disallow: /_next/` | Prevent crawlers from indexing Next.js build artifacts |
| `Sitemap:` | Advertises the sitemap URL to all crawlers (per [sitemaps.org spec](https://www.sitemaps.org/protocol.html)) |
| `Host:` | Specifies the canonical host (used by Yandex and some other crawlers) |

### Usage

```ts
// app/robots.ts
import { generateNoxionRobots } from "@noxion/adapter-nextjs";
import { siteConfig } from "@/lib/config";

export default function robots() {
  return generateNoxionRobots(siteConfig);
}
```

### Customizing robots.txt

If you need to block specific pages from indexing, create your own `robots.ts` instead:

```ts
// app/robots.ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
    ],
    sitemap: `https://${siteConfig.domain}/sitemap.xml`,
    host: `https://${siteConfig.domain}`,
  };
}
```

---

## `generateNoxionStaticParams()`

Generates the `{ slug: string }[]` array for Next.js's [`generateStaticParams()`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params), enabling static pre-rendering of all post pages at build time.

### Signature

```ts
async function generateNoxionStaticParams(
  client: NotionAPI,
  rootPageId: string
): Promise<{ slug: string }[]>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `client` | `NotionAPI` | The Notion client from `createNotionClient()` |
| `rootPageId` | `string` | The root database page ID |

### Returns

`Promise<{ slug: string }[]>` — one object per published post.

### Usage

```ts
// app/[slug]/page.tsx
import { generateNoxionStaticParams } from "@noxion/adapter-nextjs";
import { notion } from "@/lib/notion";
import { siteConfig } from "@/lib/config";

export async function generateStaticParams() {
  return generateNoxionStaticParams(notion, siteConfig.rootNotionPageId);
}
```

At build time, Next.js calls `generateStaticParams()` once, gets all slugs, and pre-renders each post page as a static HTML file. This means:
- Zero Notion API calls at request time (for cached posts)
- Sub-millisecond response times when served from CDN
- Posts are updated via ISR after `config.revalidate` seconds

### How it works

Internally, this calls `fetchAllSlugs()` from `@noxion/core`:

```ts
// Equivalent to:
export async function generateStaticParams() {
  const slugs = await fetchAllSlugs(notion, siteConfig.rootNotionPageId);
  return slugs.map((slug) => ({ slug }));
}
```

### ISR and new posts

`generateStaticParams()` is only called at build time. New posts published after the build are **not** pre-rendered at build time. Instead, they're rendered on-demand on first request and then cached with ISR.

Set `dynamicParams = true` (the default in Next.js App Router) to enable this behavior:

```ts
// app/[slug]/page.tsx
export const dynamicParams = true;  // default — new posts render on-demand
```

If you set `dynamicParams = false`, requests for slugs not returned by `generateStaticParams()` will 404.
