---
title: PostCard
description: "PostCard component — individual blog post card"
---

# `<PostCard />`

:::info Theme contract component
`PostCard` is no longer exported directly from `@noxion/renderer`. It is now part of theme contracts. The type `PostCardProps` is still exported from `@noxion/renderer`.

To use the component, access it from the theme contract:
```tsx
import { useThemeComponent } from "@noxion/renderer";

const PostCard = useThemeComponent("PostCard");
```
:::

Renders a single blog post card, typically used inside `<PostList>`. Displays the post cover image, title, publication date, category, tags, and description excerpt.

---

## Props (`PostCardProps`)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | ✅ | Notion page ID. Used as the React `key` when rendered in a list. |
| `title` | `string` | ✅ | Post title. |
| `slug` | `string` | ✅ | URL slug. The card links to `/${slug}`. |
| `date` | `string` | ✅ | Publication date string. Displayed as-is (e.g. `"2025-02-01"`). |
| `tags` | `string[]` | ✅ | Post tags. Rendered as clickable links to `/tag/[tag]`. |
| `coverImage` | `string` | — | Cover image URL (from `post.coverImage`). If absent, no image is shown. |
| `category` | `string` | — | Post category. Shown as a badge above the title. |
| `description` | `string` | — | Post description/excerpt. Shown below the title. |
| `author` | `string` | — | Author name. Shown below the description. |

---

## Usage

```tsx
"use client";
import { useThemeComponent } from "@noxion/renderer";

function MyPostCard({ post }) {
  const PostCard = useThemeComponent("PostCard");

  return (
    <PostCard
      id={post.id}
      title={post.title}
      slug={post.slug}
      date={post.date}
      tags={post.tags}
      coverImage={post.coverImage}
      category={post.category}
      description={post.description}
    />
  );
}
```

---

## Card anatomy

```
+--------------------------------------+
| [Cover Image]                         |
|                                       |
| [Category Badge]                      |
| Post Title                            |
| Description excerpt text...           |
|                                       |
| Feb 1, 2025  .  Jane Doe             |
| [react] [typescript] [tutorial]       |
+--------------------------------------+
```

- **Cover image** — rendered with lazy loading. Pass `next/image`-proxied URLs for optimized loading. The image is contained within a fixed aspect-ratio container (16:9 by default) to prevent layout shift.
- **Category badge** — shown as a small pill above the title, links to `/tag/[category]`
- **Tags** — each tag is a link to `/tag/[tag]`

---

## Cover image behavior

The cover image is rendered as an `<img>` tag (not `next/image`) in `<PostCard>`. This is intentional — cover images in the post list are typically small thumbnails and the overhead of `next/image` optimization is not worth it for list pages.

However, if you're using [build-time image download](../../learn/image-optimization#option-build-time-image-download) (`NOXION_DOWNLOAD_IMAGES=true`), the `coverImage` URL will already be a local path (`/images/[hash].webp`), which is served as a static asset.

For post detail pages, cover images **are** optimized via `next/image` in the `<NotionPage>` renderer.

---

## Date formatting

The `date` prop is displayed as-is. If you want localized date formatting, format it before passing:

```tsx
const PostList = useThemeComponent("PostList");

<PostList
  posts={posts.map((p) => ({
    ...p,
    date: new Date(p.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    // "February 1, 2025"
  }))}
/>
```

---

## Customizing the card

To customize `<PostCard>` styling, use CSS variable overrides:

```css
/* globals.css */
.notion-post-card {
  --card-radius: 0.75rem;
  border: 1px solid var(--noxion-border);
  transition: transform 0.2s ease;
}

.notion-post-card:hover {
  transform: translateY(-2px);
}
```

For structural changes (different layout, additional metadata fields), create your own card component and include it in your theme contract.
