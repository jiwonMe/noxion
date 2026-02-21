---
title: PostCard
description: "@noxion/renderer PostCard 컴포넌트"
---

# `<PostCard />`

```tsx
import { PostCard } from "@noxion/renderer";
```

커버 이미지, 제목, 날짜, 태그가 있는 블로그 포스트 카드를 렌더링합니다.

## Props (`PostCardProps`)

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | `string` | ✅ | Notion 페이지 ID (React key로 사용) |
| `title` | `string` | ✅ | 포스트 제목 |
| `slug` | `string` | ✅ | URL 슬러그 |
| `date` | `string` | ✅ | 표시할 날짜 |
| `tags` | `string[]` | ✅ | 포스트 태그 |
| `coverImage` | `string` | — | 커버 이미지 URL |
| `category` | `string` | — | 포스트 카테고리 |
| `description` | `string` | — | 포스트 설명 |
| `author` | `string` | — | 포스트 작성자 |

## 커버 이미지

커버 이미지는 `loading="lazy"`와 `decoding="async"` 속성이 적용된 `<img>` 태그로 렌더링됩니다. 최적의 성능을 위해 `next/image`로 최적화된 URL을 전달하세요.
