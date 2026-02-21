---
title: PostCard
description: "@noxion/renderer PostCard component"
---

# `<PostCard />`

```tsx
import { PostCard } from "@noxion/renderer";
```

Renders a single blog post card with cover image, title, date, and tags.

## Props (`PostCardProps`)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | ✅ | Notion page ID (used as React key) |
| `title` | `string` | ✅ | Post title |
| `slug` | `string` | ✅ | URL slug |
| `date` | `string` | ✅ | Display date |
| `tags` | `string[]` | ✅ | Post tags |
| `coverImage` | `string` | — | Cover image URL |
| `category` | `string` | — | Post category |
| `description` | `string` | — | Post description |
| `author` | `string` | — | Post author |

## Cover image

The cover image is rendered as an `<img>` tag with `loading="lazy"` and `decoding="async"`. Pass a `next/image`-optimized URL for best performance.
