---
sidebar_position: 5
title: Image Optimization
description: How Noxion handles Notion images — proxy URLs, Next.js Image, and build-time downloads.
---

# Image Optimization

Images in Notion have always been a pain point for static site generators. This page explains exactly how Noxion handles them, and what your options are.

---

## The Notion image URL problem

Notion stores uploaded images (photos, screenshots, etc.) as files in Amazon S3. When you access a Notion page via the API, the returned image URLs are **presigned S3 URLs** that include a time-limited signature:

```
https://prod-files-secure.s3.us-west-2.amazonaws.com/workspace-id/file-id/image.png
  ?X-Amz-Algorithm=AWS4-HMAC-SHA256
  &X-Amz-Credential=...
  &X-Amz-Expires=3600    ← expires in 1 hour
  &X-Amz-Signature=...
```

These URLs **expire after ~1 hour**. For a static blog where pages are cached for hours or days, this is a fundamental problem — images would show as broken within the hour.

---

## Default: Notion image proxy

Noxion solves the expiration problem by routing all images through **Notion's own image proxy**:

```
https://www.notion.so/image/ENCODED_S3_URL?table=block&id=PAGE_ID&...
```

This proxy URL:
- **Does not expire** — Notion keeps it stable for as long as the page exists
- Is served from Notion's CDN
- Supports query parameters for width-based resizing

Noxion uses `defaultMapImageUrl()` from the [`notion-utils`](https://www.npmjs.com/package/notion-utils) package to convert raw S3 URLs into these stable proxy URLs at render time.

### next/image optimization on top

These stable proxy URLs are then passed to **[`next/image`](https://nextjs.org/docs/app/api-reference/components/image)**, which applies a second layer of optimization:

- **Format conversion** — AVIF (preferred) and WebP fallback, saving 50–70% over JPEG/PNG
- **Responsive `srcset`** — multiple sizes generated automatically
- **Lazy loading** — images load only when they enter the viewport
- **Blur placeholder** — low-resolution placeholder shown while the full image loads
- **CDN caching** — Vercel's image optimization CDN caches the result globally

### next.config.ts setup

The scaffolded project includes the necessary `next.config.ts`:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.notion.so",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "file.notion.so",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        // Fallback for direct S3 URLs in older content
      },
    ],
  },
};

export default nextConfig;
```

:::tip Vercel Image Optimization
On Vercel, `next/image` optimization uses [Vercel's Image Optimization](https://vercel.com/docs/image-optimization) service, which is included in the free tier (up to 1,000 source images/month). For high-traffic blogs, consider the Pro plan or a self-hosted image optimization solution.
:::

---

## Option: Build-time image download

For **complete independence from Notion's infrastructure**, you can configure Noxion to download all images locally at build time:

```bash
# .env
NOXION_DOWNLOAD_IMAGES=true
```

### What happens when enabled

During a production build (`next build`), Noxion's `downloadImages()` function:

1. Fetches all published posts and collects every image URL
2. Downloads each image to `public/images/[hash].[ext]`
3. Rewrites all image URLs in the `BlogPost` data to local paths (`/images/[hash].[ext]`)
4. The rendered pages reference local static assets — no Notion dependency at runtime

```
Before: https://www.notion.so/image/...
After:  /images/abc123.avif
```

### Trade-offs

| | Default (proxy) | Build-time download |
|---|---|---|
| Image freshness | Always up-to-date | Locked to build time |
| External dependency at runtime | Notion CDN | None |
| Build time | Fast | Slower (downloads all images) |
| Self-hosted without internet | ❌ | ✅ |
| Disk space | None | ~MB–GB depending on content |

### Development behavior

`NOXION_DOWNLOAD_IMAGES=true` only activates during **production builds** (`NODE_ENV=production`). Development always uses the proxy, regardless of this setting. This prevents slow dev server startups.

---

## Cover images

Post cover images are set in Notion via the **page cover** feature (the banner at the top of a page, set by clicking "Add cover").

Noxion reads the cover from `block.format.page_cover` in the block data and converts it to a stable proxy URL using `defaultMapImageUrl()`. The result is stored in `BlogPost.coverImage` (a string URL or `undefined` if no cover).

Cover images are rendered in `<PostCard>` and can be overridden per-post using the `coverImage` frontmatter key:

```
# In a Notion code block at the top of the page:
coverImage: https://example.com/my-custom-cover.jpg
```

### Cover image size

For best OG/Twitter Card appearance, Notion covers are displayed at `1200×630` pixels (the standard Open Graph image size). Notion allows any aspect ratio for covers, but the `og:image` meta tag specifies `width: 1200, height: 630` regardless — the image may be cropped or letterboxed by social media platforms.

---

## Image dimensions and CLS

[Cumulative Layout Shift (CLS)](https://web.dev/cls/) is a Core Web Vital that measures visual stability. Unexpected image resizing is a common CLS cause.

Noxion addresses this by:

1. **`next/image` with `fill` layout** — for cover images in `PostCard`, using CSS aspect-ratio containers prevents layout shift
2. **Width/height from Notion** — for inline images in posts, `@noxion/notion-renderer` reads the block dimensions from Notion's data and sets explicit `width` and `height` attributes

For custom image blocks without explicit dimensions, the renderer uses a fixed aspect-ratio container to prevent CLS.

---

## Inline images in posts

Images inserted directly into a Notion page body (via `/image` block or drag-and-drop) are rendered by `@noxion/notion-renderer`'s image block component. The `<NotionPage>` component from `@noxion/renderer` automatically wires `mapImageUrl` to convert all image references to stable `notion.so/image/` proxy URLs:

```tsx
import { NotionPage } from "@noxion/renderer";

export default function PostPage({ recordMap, post }) {
  return (
    <NotionPage
      recordMap={recordMap}
      rootPageId={post.id}
    />
  );
}
```

Image URLs are automatically routed through Notion's image proxy for stable, non-expiring access.
