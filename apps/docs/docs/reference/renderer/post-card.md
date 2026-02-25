---
title: PostCard
description: "PostCard component — individual blog post card"
---

# `<PostCard />`

:::info Theme component
`PostCard` is exported directly from theme packages. The type `PostCardProps` is exported from `@noxion/renderer`.

```tsx
import { PostCard } from "@noxion/theme-default";
import type { PostCardProps } from "@noxion/renderer";
```
:::

Renders a single post card, typically used inside `<PostList>`. Exact markup/styling is theme-specific.

---

## Props (`PostCardProps`)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | ✅ | Notion page ID. Used as the React `key` when rendered in a list. |
| `title` | `string` | ✅ | Post title. |
| `slug` | `string` | ✅ | URL slug. Commonly used for the post link target. |
| `date` | `string` | ✅ | Publication date value (e.g. `"2025-02-01"`). Formatting is theme-specific. |
| `tags` | `string[]` | ✅ | Post tag values. Theme may render them or ignore them. |
| `coverImage` | `string` | — | Optional cover image URL. |
| `category` | `string` | — | Optional category label. |
| `description` | `string` | — | Optional post description/excerpt. |
| `author` | `string` | — | Optional author name. |

---

## Usage

```tsx
"use client";
import { PostCard } from "@noxion/theme-default";

function MyPostCard({ post }) {

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

`PostCard` output depends on the theme package. For example, `@noxion/theme-default` currently renders a minimal text-first card (title, description, date) and may ignore optional fields like tags or cover image.

---

## Cover image behavior

`coverImage` is part of `PostCardProps`, but a theme can choose whether and how to render it (`<img>`, `next/image`, or hidden). Check your selected theme's `PostCard` source for exact behavior.

---

## Date formatting

Date formatting is theme-controlled. `@noxion/theme-default` currently formats dates to a localized short format internally.

If you need full control, format the value before passing it and/or provide your own `PostCard` implementation:

```tsx
import { PostList } from "@noxion/theme-default";

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

To customize `<PostCard>`, either:

- style the classes exposed by your current theme implementation, or
- provide your own `PostCard` component and style it directly.

Example custom class styling:

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

For structural changes (layout, extra metadata fields), create your own card component in your app/theme package and render it from your chosen layout/template.
