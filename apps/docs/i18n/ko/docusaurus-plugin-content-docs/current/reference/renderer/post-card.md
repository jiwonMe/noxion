---
title: PostCard
description: "PostCard 컴포넌트 — 개별 블로그 포스트 카드"
---

# `<PostCard />`

:::info 테마 컨트랙트 컴포넌트
`PostCard`는 더 이상 `@noxion/renderer`에서 직접 익스포트되지 않습니다. 이제 테마 컨트랙트의 일부입니다. `PostCardProps` 타입은 여전히 `@noxion/renderer`에서 익스포트됩니다.

컴포넌트를 사용하려면 테마 컨트랙트에서 접근하세요:
```tsx
import { useThemeComponent } from "@noxion/renderer";

const PostCard = useThemeComponent("PostCard");
```
:::

단일 블로그 포스트 카드를 렌더링하며, 일반적으로 `<PostList>` 내부에서 사용됩니다. 포스트 커버 이미지, 제목, 발행일, 카테고리, 태그, 설명 발췌문을 표시합니다.

---

## Props (`PostCardProps`)

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | `string` | ✅ | Notion 페이지 ID. 리스트에서 렌더링될 때 React `key`로 사용. |
| `title` | `string` | ✅ | 포스트 제목. |
| `slug` | `string` | ✅ | URL slug. 카드가 `/${slug}`로 링크됩니다. |
| `date` | `string` | ✅ | 발행일 문자열. 그대로 표시 (예: `"2025-02-01"`). |
| `tags` | `string[]` | ✅ | 포스트 태그. `/tag/[tag]`로 연결되는 클릭 가능한 링크로 렌더링. |
| `coverImage` | `string` | — | 커버 이미지 URL (`post.coverImage`). 없으면 이미지를 표시하지 않음. |
| `category` | `string` | — | 포스트 카테고리. 제목 위에 배지로 표시. |
| `description` | `string` | — | 포스트 설명/발췌문. 제목 아래에 표시. |
| `author` | `string` | — | 저자 이름. 설명 아래에 표시. |

---

## 사용법

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

## 카드 구조

```
+--------------------------------------+
| [커버 이미지]                          |
|                                       |
| [카테고리 배지]                        |
| 포스트 제목                            |
| 설명 발췌문 텍스트...                   |
|                                       |
| 2025. 2. 1.  .  홍길동                |
| [react] [typescript] [tutorial]       |
+--------------------------------------+
```

- **커버 이미지** — 지연 로딩으로 렌더링. 최적화된 로딩을 위해 `next/image` 프록시 URL을 전달하세요. 이미지는 레이아웃 이동을 방지하기 위해 고정 종횡비 컨테이너(기본 16:9) 안에 포함됩니다.
- **카테고리 배지** — 제목 위에 작은 필 형태로 표시, `/tag/[category]`로 링크
- **태그** — 각 태그는 `/tag/[tag]`로 연결되는 링크

---

## 커버 이미지 동작

커버 이미지는 `<PostCard>`에서 `<img>` 태그로 렌더링됩니다 (`next/image`가 아님). 이는 의도적인 것입니다 — 포스트 리스트의 커버 이미지는 일반적으로 작은 썸네일이며, 리스트 페이지에서 `next/image` 최적화의 오버헤드는 가치가 없습니다.

그러나 [빌드 시 이미지 다운로드](../../learn/image-optimization#option-build-time-image-download) (`NOXION_DOWNLOAD_IMAGES=true`)를 사용하는 경우, `coverImage` URL은 이미 로컬 경로(`/images/[hash].webp`)이며 정적 에셋으로 제공됩니다.

포스트 상세 페이지에서 커버 이미지는 `<NotionPage>` 렌더러에서 `next/image`를 통해 **최적화됩니다**.

---

## 날짜 포맷팅

`date` prop은 그대로 표시됩니다. 로컬라이즈된 날짜 포맷이 필요하면 전달하기 전에 포맷하세요:

```tsx
const PostList = useThemeComponent("PostList");

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

`<PostCard>` 스타일을 커스터마이즈하려면 CSS 변수 오버라이드를 사용하세요:

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

구조적 변경(다른 레이아웃, 추가 메타데이터 필드)이 필요하면 자체 카드 컴포넌트를 만들어 테마 컨트랙트에 포함하세요.
