---
title: PostCard
description: "PostCard 컴포넌트 — 개별 블로그 포스트 카드"
---

# `<PostCard />`

:::info 테마 컴포넌트
`PostCard`는 테마 패키지에서 직접 익스포트됩니다. `PostCardProps` 타입은 `@noxion/renderer`에서 익스포트됩니다.

```tsx
import { PostCard } from "@noxion/theme-default";
import type { PostCardProps } from "@noxion/renderer";
```
:::

단일 포스트 카드를 렌더링하며, 일반적으로 `<PostList>` 내부에서 사용됩니다. 실제 마크업/스타일은 테마 구현에 따라 달라집니다.

---

## Props (`PostCardProps`)

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | `string` | ✅ | Notion 페이지 ID. 리스트에서 렌더링될 때 React `key`로 사용. |
| `title` | `string` | ✅ | 포스트 제목. |
| `slug` | `string` | ✅ | URL slug. 일반적으로 포스트 링크 경로에 사용됩니다. |
| `date` | `string` | ✅ | 발행일 값 (예: `"2025-02-01"`). 포맷팅은 테마 구현에 따릅니다. |
| `tags` | `string[]` | ✅ | 태그 값 배열. 테마가 렌더링할 수도, 무시할 수도 있습니다. |
| `coverImage` | `string` | — | 선택적 커버 이미지 URL |
| `category` | `string` | — | 선택적 카테고리 라벨 |
| `description` | `string` | — | 선택적 설명/발췌문 |
| `author` | `string` | — | 선택적 작성자 이름 |

---

## 사용법

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

## 카드 구조

`PostCard` 출력은 테마 패키지에 따라 달라집니다. 예를 들어 현재 `@noxion/theme-default`는 텍스트 중심 카드(제목/설명/날짜) 형태이며, `tags`나 `coverImage` 같은 선택 필드를 렌더링하지 않을 수 있습니다.

---

## 커버 이미지 동작

`coverImage`는 `PostCardProps`에 포함되어 있지만, 테마는 이를 `<img>`, `next/image`, 숨김 등 어떤 방식으로든 렌더링(또는 미렌더링)할 수 있습니다. 정확한 동작은 사용하는 테마의 `PostCard` 구현을 확인하세요.

---

## 날짜 포맷팅

날짜 포맷팅은 테마 구현이 결정합니다. 현재 `@noxion/theme-default`는 내부에서 로컬 포맷으로 날짜를 변환합니다.

완전히 제어하려면 값을 미리 포맷해서 전달하거나, 자체 `PostCard` 구현을 사용하세요:

```tsx
import { PostList } from "@noxion/theme-default";

<PostList
  posts={posts.map((p) => ({
    ...p,
    date: new Date(p.date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    // "2025년 2월 1일"
  }))}
/>
```

---

## 카드 커스터마이징

`<PostCard>`를 커스터마이즈하려면:

- 현재 테마 구현이 노출하는 클래스를 스타일링하거나,
- 앱/테마 패키지에서 자체 `PostCard`를 구현해 사용하세요.

예시 스타일링:

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

구조적 변경(레이아웃, 추가 메타데이터 필드)은 앱/테마 패키지에 자체 카드 컴포넌트를 만들어 레이아웃/템플릿에서 직접 렌더링하세요.
