---
title: PostList
description: "PostList 컴포넌트 — 포스트 카드의 반응형 그리드"
---

# `<PostList />`

:::info 테마 컨트랙트 컴포넌트
`PostList`는 더 이상 `@noxion/renderer`에서 직접 익스포트되지 않습니다. 이제 테마 컨트랙트의 일부입니다. `PostListProps` 타입은 여전히 `@noxion/renderer`에서 익스포트됩니다.

컴포넌트를 사용하려면 테마 컨트랙트에서 접근하세요:
```tsx
import { useThemeComponent } from "@noxion/renderer";

const PostList = useThemeComponent("PostList");
```
:::

[`<PostCard>`](./post-card) 컴포넌트의 반응형 그리드를 렌더링합니다. 클라이언트 컴포넌트.

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
import { useThemeComponent } from "@noxion/renderer";
import type { PostCardProps } from "@noxion/renderer";

export function HomeContent({ posts }: { posts: PostCardProps[] }) {
  const PostList = useThemeComponent("PostList");
  return <PostList posts={posts} />;
}
```

---

## 태그 필터링

`PostList`는 각 카드의 태그를 `/tag/[tag]`로 연결되는 클릭 가능한 링크로 렌더링합니다. `app/tag/[tag]/page.tsx`의 태그 필터 페이지는 `create-noxion`에 의해 생성되며 태그별로 `getAllPosts()`를 필터링합니다.

---

## 그리드 레이아웃

`PostList`는 반응형 CSS 그리드를 렌더링합니다. 기본 레이아웃:

| 뷰포트 | 컬럼 |
|---------|------|
| 모바일 (`< 640px`) | 1 컬럼 |
| 태블릿 (`640px - 1024px`) | 2 컬럼 |
| 데스크톱 (`> 1024px`) | 3 컬럼 |

그리드는 CSS 변수로 스타일링되므로 간격을 오버라이드할 수 있습니다:

```css
/* globals.css */
.notion-post-list {
  gap: 2rem;       /* 카드 간격 오버라이드 */
}
```

---

## 빈 상태

`posts`가 빈 배열이면 `PostList`는 아무것도 렌더링하지 않습니다 (카드도, 빈 상태 메시지도 없음). 필요하다면 부모 컴포넌트에서 자체 빈 상태를 추가하세요:

```tsx
{posts.length === 0 ? (
  <p>아직 게시된 포스트가 없습니다.</p>
) : (
  <PostList posts={posts} />
)}
```
