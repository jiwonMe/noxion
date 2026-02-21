---
sidebar_position: 5
title: Image Optimization
description: How Noxion handles Notion images.
---

# Image Optimization

## Default: next/image proxy

By default, Noxion serves images through **Notion's image proxy** (`notion.so/image/`) and optimizes them on-the-fly using Next.js Image:

- AVIF and WebP auto-conversion
- Responsive `srcset` generation
- Lazy loading and blur placeholder
- CDN caching via Vercel or your host

These proxy URLs **do not expire** — unlike Notion's presigned S3 URLs (which expire in ~1 hour).

```ts
// next.config.ts — already configured by create-noxion
images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    { protocol: "https", hostname: "www.notion.so" },
    { protocol: "https", hostname: "file.notion.so" },
    // ...
  ],
}
```

## Option: Build-time download

For full independence from Notion's infrastructure, set:

```bash
# .env
NOXION_DOWNLOAD_IMAGES=true
```

When enabled (production builds only):
1. Images are downloaded to `public/images/` during the build
2. `mapImages()` rewrites all URLs to local paths
3. Next.js serves images as static assets — no external dependency at runtime

Development always uses the proxy regardless of this setting.

## Cover images

Post cover images use `defaultMapImageUrl()` from `notion-utils`, which converts `attachment:` internal references to proper proxy URLs. This runs at data fetch time in `fetchBlogPosts()`.
