---
title: NotionPage
description: "@noxion/renderer NotionPage component"
---

# `<NotionPage />`

```tsx
import { NotionPage } from "@noxion/renderer";
```

Renders a Notion page using `react-notion-x`. Client component (`"use client"`).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `recordMap` | `ExtendedRecordMap` | required | Page data from `fetchPage()` |
| `rootPageId` | `string` | — | Root page ID for link resolution |
| `fullPage` | `boolean` | `true` | Render full page with header |
| `darkMode` | `boolean` | — | Force dark mode (auto-detects from theme) |
| `previewImages` | `boolean` | `false` | Enable image previews |
| `showTableOfContents` | `boolean` | `false` | Show TOC sidebar |
| `minTableOfContentsItems` | `number` | `3` | Min items before TOC renders |
| `pageUrlPrefix` | `string` | `"/"` | Prefix for internal page links |
| `nextImage` | `unknown` | — | Pass `next/image` for optimization |
| `className` | `string` | — | CSS class on wrapper div |

## Image optimization

Pass `next/image` to enable automatic AVIF/WebP conversion:

```tsx
import Image from "next/image";
import { NotionPage } from "@noxion/renderer";

<NotionPage
  recordMap={recordMap}
  rootPageId={post.id}
  nextImage={Image}
/>
```

## Signed URLs

The component reads `recordMap.signed_urls` automatically. Previously, signed URLs from Notion (which expire in ~1 hour) were used — now the component relies on `defaultMapImageUrl` from `notion-utils`, which produces persistent `notion.so/image/` proxy URLs.
