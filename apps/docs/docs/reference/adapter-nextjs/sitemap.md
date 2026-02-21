---
title: Sitemap & Robots
description: "@noxion/adapter-nextjs sitemap and robots API"
---

# Sitemap & Robots

## `generateNoxionSitemap()`

```ts
import { generateNoxionSitemap } from "@noxion/adapter-nextjs";

function generateNoxionSitemap(posts: BlogPost[], config: NoxionConfig): MetadataRoute.Sitemap
```

Returns sitemap entries for:
- Homepage (priority 1.0, daily)
- All posts (priority 0.8, weekly)  
- All unique tag pages (priority 0.5, weekly)

### Usage

```ts
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllPosts();
  return generateNoxionSitemap(posts, siteConfig);
}
```

---

## `generateNoxionRobots()`

```ts
import { generateNoxionRobots } from "@noxion/adapter-nextjs";

function generateNoxionRobots(config: NoxionConfig): MetadataRoute.Robots
```

Generates robots.txt with:
- `Allow: /`
- `Disallow: /api/`, `Disallow: /_next/`
- Sitemap URL
- Host directive

### Usage

```ts
// app/robots.ts
export default function robots() {
  return generateNoxionRobots(siteConfig);
}
```

---

## `generateNoxionStaticParams()`

```ts
import { generateNoxionStaticParams } from "@noxion/adapter-nextjs";

async function generateNoxionStaticParams(
  client: NotionAPI,
  rootPageId: string
): Promise<{ slug: string }[]>
```

Returns all post slugs for `generateStaticParams()` in `[slug]/page.tsx`.
