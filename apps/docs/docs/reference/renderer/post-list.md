---
title: PostList
description: "@noxion/renderer PostList component"
---

# `<PostList />`

```tsx
import { PostList } from "@noxion/renderer";
```

Renders a responsive grid of `<PostCard>` components. Client component.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `posts` | `PostCardProps[]` | Array of post card data |

## Example

```tsx
<PostList posts={posts.map(p => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  date: p.date,
  tags: p.tags,
  coverImage: p.coverImage,
  category: p.category,
  description: p.description,
}))} />
```
