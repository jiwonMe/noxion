---
title: PostList
description: "PostList 컴포넌트 — 테마 제공 리스트 렌더러"
---

# `<PostList />`

:::info 테마 컴포넌트
`PostList`는 테마 패키지에서 직접 익스포트됩니다. `PostListProps` 타입은 `@noxion/renderer`에서 익스포트됩니다.

```tsx
import { PostList } from "@noxion/theme-default";
import type { PostListProps } from "@noxion/renderer";
```
:::

[`<PostCard>`](./post-card) 컴포넌트 목록을 렌더링합니다. 클라이언트 컴포넌트이며, 레이아웃/빈 상태 동작은 테마 구현에 따라 달라집니다.

---

## Props

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `posts` | `PostCardProps[]` | ✅ | 포스트 카드 데이터 객체 배열 |

---

## `PostCardProps`

`posts` 배열의 각 항목은 `PostCardProps`를 준수해야 합니다:

```ts
import type { PostCardProps } from "@noxion/renderer";

interface PostCardProps {
  id: string;           // Notion 페이지 ID — React key로 사용
  title: string;        // 포스트 제목
  slug: string;         // 링크용 URL slug
  date: string;         // 표시 날짜 문자열
  tags: string[];       // 태그 문자열 배열
  coverImage?: string;  // 커버 이미지 URL (선택)
  category?: string;    // 카테고리 (선택)
  description?: string; // 포스트 발췌문 (선택)
  author?: string;      // 저자 이름 (선택)
}
```

---

## 사용법

```tsx
// app/page.tsx (서버 컴포넌트)
import { getAllPosts } from "@/lib/notion";
import { HomeContent } from "./home-content";

export default async function HomePage() {
  const posts = await getAllPosts();
  return <HomeContent posts={posts} />;
}
```

```tsx
// app/home-content.tsx (클라이언트 컴포넌트)
"use client";
import { PostList } from "@noxion/theme-default";
import type { PostCardProps } from "@noxion/renderer";

export function HomeContent({ posts }: { posts: PostCardProps[] }) {
  return <PostList posts={posts} />;
}
```

---

## 태그 필터링

태그 필터 UX는 `PostListProps` 자체가 아니라 앱/테마 구현이 담당합니다. 기본 스캐폴드에는 `app/tag/[tag]/page.tsx`가 포함되며, 태그별로 포스트를 필터링한 뒤 `PostList`를 렌더링합니다.

---

## 레이아웃 동작

`PostList`의 레이아웃은 선택한 테마 패키지 구현이 결정합니다.

예를 들어 현재 `@noxion/theme-default`는 카드 그리드가 아니라 세로 분할 리스트 형태를 렌더링합니다.

간격/레이아웃을 커스터마이즈하려면 자체 테마 컴포넌트에서 조정하세요:

```css
/* globals.css */
.post-list {
  gap: 2rem;
}
```

---

## 빈 상태

빈 상태 렌더링은 테마 구현에 따라 달라집니다.

현재 `@noxion/theme-default`는 `posts`가 비어 있으면 기본 메시지("No posts found.")를 렌더링합니다.

커스텀 빈 상태 UI가 필요하면 부모 컴포넌트에서 분기하세요:

```tsx
{posts.length === 0 ? (
  <p>아직 게시된 포스트가 없습니다.</p>
) : (
  <PostList posts={posts} />
)}
```
