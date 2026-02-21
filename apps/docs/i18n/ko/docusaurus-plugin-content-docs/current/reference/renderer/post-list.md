---
title: PostList
description: "@noxion/renderer PostList 컴포넌트"
---

# `<PostList />`

```tsx
import { PostList } from "@noxion/renderer";
```

`<PostCard>` 컴포넌트의 반응형 그리드를 렌더링합니다. 클라이언트 컴포넌트.

## Props

| Prop | 타입 | 설명 |
|------|------|------|
| `posts` | `PostCardProps[]` | 포스트 카드 데이터 배열 |

## 예시

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
