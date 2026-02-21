---
title: NotionPage
description: "@noxion/renderer NotionPage component — renders a full Notion page"
---

# `<NotionPage />`

```tsx
import { NotionPage } from "@noxion/renderer";
```

Renders a complete Notion page using [`react-notion-x`](https://github.com/NotionX/react-notion-x). This is a **Client Component** (`"use client"`), meaning it runs in the browser. The data fetching (`fetchPage()`) should happen in a Server Component; the rendering happens client-side.

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `recordMap` | `ExtendedRecordMap` | ✅ | — | Full page data from `fetchPage()`. Contains all blocks, images, and metadata. |
| `rootPageId` | `string` | — | `undefined` | The root page ID. Used to resolve internal links to other Notion pages. Should be `post.id`. |
| `fullPage` | `boolean` | — | `true` | When `true`, renders the full page with the page title header. When `false`, renders only the page body blocks. |
| `darkMode` | `boolean` | — | auto | Force dark mode rendering. If not provided, auto-detects from `useNoxionTheme()`. |
| `previewImages` | `boolean` | — | `false` | Enable blur-up image preview (requires `next/image` with placeholder support). |
| `showTableOfContents` | `boolean` | — | `false` | Show a table of contents sidebar. Only appears if the page has headings. |
| `minTableOfContentsItems` | `number` | — | `3` | Minimum number of heading items required before TOC is shown. |
| `pageUrlPrefix` | `string` | — | `"/"` | URL prefix for internal Notion page links. Set to `"/"` to route sub-pages to your app. |
| `nextImage` | `ComponentType` | — | `undefined` | Pass `next/image` to enable AVIF/WebP optimization for inline images. |
| `className` | `string` | — | `undefined` | CSS class applied to the outer wrapper `<div>`. |

---

## Basic usage

```tsx
// app/[slug]/page.tsx (Server Component)
import Image from "next/image";
import { fetchPage } from "@noxion/core";
import { NotionPage } from "@noxion/renderer";
import { notion } from "@/lib/notion";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const recordMap = await fetchPage(notion, post.id);

  return (
    <article>
      <NotionPage
        recordMap={recordMap}
        rootPageId={post.id}
        nextImage={Image}
        showTableOfContents={true}
      />
    </article>
  );
}
```

---

## `nextImage` prop

Pass the `next/image` component to enable **automatic image optimization** for all inline images in the Notion page:

```tsx
import Image from "next/image";

<NotionPage
  recordMap={recordMap}
  rootPageId={post.id}
  nextImage={Image}  // All images → AVIF/WebP + lazy load
/>
```

Without this prop, images are rendered as standard `<img>` tags (no optimization). Always pass this in production for better performance.

---

## Table of Contents

Enable the built-in TOC sidebar:

```tsx
<NotionPage
  recordMap={recordMap}
  rootPageId={post.id}
  showTableOfContents={true}
  minTableOfContentsItems={2}  // Show TOC if 2+ headings
/>
```

The TOC is rendered as a fixed sidebar on desktop and collapses on mobile. It's auto-generated from all `heading_1`, `heading_2`, and `heading_3` blocks in the page.

Alternatively, use frontmatter to control TOC per-post:

```
# In Notion code block:
floatFirstTOC: right
```

---

## Dark mode

The component auto-detects the current theme from `useNoxionTheme()`. You only need to set `darkMode` manually if you're using `<NotionPage>` outside of a `<NoxionThemeProvider>`:

```tsx
// Manual dark mode control (not recommended — use ThemeProvider)
<NotionPage
  recordMap={recordMap}
  darkMode={true}
/>
```

---

## Image URL handling

Noxion uses `defaultMapImageUrl()` from `notion-utils` to convert all image references to stable `notion.so/image/` proxy URLs at data-fetch time. This means:

1. S3 presigned URLs (which expire in ~1 hour) are **never** used in the rendered output
2. All image URLs are stable proxy URLs that don't expire
3. `next/image` can safely cache and optimize these URLs

See [Image Optimization](../../learn/image-optimization) for the full explanation.

---

## Supported Notion block types

`react-notion-x` renders the full range of Notion blocks. See [Notion Setup → Supported block types](../../learn/notion-setup#supported-notion-block-types) for the complete list.

---

## Custom block renderers

If you need to customize how specific block types are rendered, `react-notion-x` supports component overrides. You can extend `<NotionPage>` in your own wrapper:

```tsx
// components/CustomNotionPage.tsx
"use client";
import { NotionPage } from "@noxion/renderer";
import type { ExtendedRecordMap } from "@noxion/core";

interface Props {
  recordMap: ExtendedRecordMap;
  pageId: string;
}

export function CustomNotionPage({ recordMap, pageId }: Props) {
  return (
    <NotionPage
      recordMap={recordMap}
      rootPageId={pageId}
      nextImage={require("next/image").default}
      // Add your customizations here
      className="notion-custom-theme"
    />
  );
}
```

For deeper customization of specific block types (e.g., custom code block renderer), refer to the [react-notion-x documentation](https://github.com/NotionX/react-notion-x#props).
