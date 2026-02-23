---
title: Sitemap, Robots, Routing & Static Params
description: "@noxion/adapter-nextjs sitemap, robots.txt, multi-page-type routing, and generateStaticParams helpers"
---

# Sitemap, Robots, Routing & Static Params

```ts
import {
  generateNoxionSitemap,
  generateNoxionRobots,
  generateNoxionStaticParams,
  generateNoxionRoutes,
  resolvePageType,
  buildPageUrl,
  generateStaticParamsForRoute,
} from "@noxion/adapter-nextjs";
```

---

## `generateNoxionSitemap()`

Generates a sitemap with page-type-aware priority levels.

### Signature

```ts
function generateNoxionSitemap(
  pages: NoxionPage[],
  config: NoxionConfig
): MetadataRoute.Sitemap
```

### Page-type priorities

| Page type | Priority |
|-----------|----------|
| Homepage | 1.0 |
| Blog posts | 0.8 |
| Docs pages | 0.7 |
| Portfolio projects | 0.6 |
| Tag pages | 0.5 |

### Usage

```ts
// app/sitemap.ts
import { generateNoxionSitemap } from "@noxion/adapter-nextjs";

export default async function sitemap() {
  const pages = await getAllPages();
  return generateNoxionSitemap(pages, siteConfig);
}
```

---

## `generateNoxionRoutes()`

Generates route configurations for all collections. Used for multi-page-type routing.

### Signature

```ts
function generateNoxionRoutes(
  config: NoxionConfig
): NoxionRouteConfig[]
```

### Returns

```ts
interface NoxionRouteConfig {
  pageType: string;
  pathPrefix?: string;
  databaseId: string;
}
```

---

## `resolvePageType()`

Determines the page type from a URL path by matching against configured route prefixes.

### Signature

```ts
function resolvePageType(
  path: string,
  config: NoxionConfig
): string
```

### Example

```ts
resolvePageType("/docs/getting-started", config);  // "docs"
resolvePageType("/portfolio/noxion", config);       // "portfolio"
resolvePageType("/my-post", config);                // "blog"
```

---

## `buildPageUrl()`

Builds the full URL path for a page, using its collection's `pathPrefix`.

### Signature

```ts
function buildPageUrl(
  page: NoxionPage,
  config: NoxionConfig
): string
```

### Example

```ts
buildPageUrl(docsPage, config);      // "/docs/getting-started"
buildPageUrl(blogPage, config);      // "/my-post"
buildPageUrl(portfolioPage, config); // "/portfolio/noxion"
```

---

## `generateStaticParamsForRoute()`

Generates static params for a specific page type route.

### Signature

```ts
async function generateStaticParamsForRoute(
  client: NotionAPI,
  route: NoxionRouteConfig
): Promise<{ slug: string }[]>
```

---

## `generateNoxionRobots()`

Generates robots.txt with sitemap reference.

```ts
function generateNoxionRobots(config: NoxionConfig): MetadataRoute.Robots
```

### Generated robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://mysite.com/sitemap.xml
Host: https://mysite.com
```

---

## `generateNoxionStaticParams()`

Generates `{ slug: string }[]` for Next.js `generateStaticParams()`.

```ts
async function generateNoxionStaticParams(
  client: NotionAPI,
  rootPageId: string
): Promise<{ slug: string }[]>
```

### Usage

```ts
// app/[slug]/page.tsx
export async function generateStaticParams() {
  return generateNoxionStaticParams(notion, siteConfig.rootNotionPageId);
}
```
