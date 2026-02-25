---
title: PostList
description: "PostList component — theme-provided list renderer"
---

# `<PostList />`

:::info Theme component
`PostList` is exported directly from theme packages. The type `PostListProps` is exported from `@noxion/renderer`.

```tsx
import { PostList } from "@noxion/theme-default";
import type { PostListProps } from "@noxion/renderer";
```
:::

Renders a list of [`<PostCard>`](./post-card) components. Client Component. Exact layout and empty-state behavior are theme-specific.

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `posts` | `PostCardProps[]` | ✅ | Array of post card data objects |

---

## `PostCardProps`

Each item in the `posts` array should conform to `PostCardProps`:

```ts
import type { PostCardProps } from "@noxion/renderer";

interface PostCardProps {
  id: string;           // Notion page ID — used as React key
  title: string;        // Post title
  slug: string;         // URL slug for the link
  date: string;         // Display date string
  tags: string[];       // Array of tag strings
  coverImage?: string;  // Cover image URL (optional)
  category?: string;    // Category (optional)
  description?: string; // Post excerpt (optional)
  author?: string;      // Author name (optional)
}
```

---

## Usage

```tsx
// app/page.tsx (Server Component)
import { getAllPosts } from "@/lib/notion";
import { HomeContent } from "./home-content";

export default async function HomePage() {
  const posts = await getAllPosts();
  return <HomeContent posts={posts} />;
}
```

```tsx
// app/home-content.tsx (Client Component)
"use client";
import { PostList } from "@noxion/theme-default";
import type { PostCardProps } from "@noxion/renderer";

export function HomeContent({ posts }: { posts: PostCardProps[] }) {
  return <PostList posts={posts} />;
}
```

---

## Tag filtering

Tag-filter UX is implemented by your app/theme, not by `PostListProps` itself. The default scaffold includes a tag page at `app/tag/[tag]/page.tsx` that filters posts by tag before rendering `PostList`.

---

## Layout behavior

`PostList` layout is controlled by the selected theme package.

For example, `@noxion/theme-default` currently renders a vertically divided list (not a card grid).

Customize spacing/layout in your own theme component:

```css
/* globals.css */
.post-list {
  gap: 2rem;
}
```

---

## Empty state

Empty-state rendering is theme-specific.

`@noxion/theme-default` currently renders a built-in "No posts found." message when `posts` is empty.

If you want custom empty-state UI, branch in the parent component:

```tsx
{posts.length === 0 ? (
  <p>No posts published yet.</p>
) : (
  <PostList posts={posts} />
)}
```
