---
title: Metadata
description: "@noxion/adapter-nextjs metadata API"
---

# Metadata

```ts
import { generateNoxionMetadata, generateNoxionListMetadata } from "@noxion/adapter-nextjs";
```

## `generateNoxionMetadata()`

단일 포스트 페이지를 위한 Next.js `Metadata`를 생성합니다.

```ts
function generateNoxionMetadata(post: BlogPost, config: NoxionConfig): Metadata
```

### 생성되는 필드

| 필드 | 값 |
|------|-----|
| `title` | `post.title` (template이 `\| 사이트 이름` 추가) |
| `description` | `post.description` (최대 160자 truncate) |
| `authors` | `[{ name: post.author ?? config.author }]` |
| `openGraph.type` | `"article"` |
| `openGraph.publishedTime` | `post.date` ISO 문자열 |
| `openGraph.modifiedTime` | `post.lastEditedTime` |
| `openGraph.authors` | `[post.author ?? config.author]` |
| `openGraph.section` | `post.category` |
| `openGraph.tags` | `post.tags` |
| `openGraph.images` | 커버 이미지 (`width: 1200, height: 630, alt` 포함) |
| `openGraph.locale` | `ko_KR` / `en_US` / `ja_JP` |
| `twitter.card` | `"summary_large_image"` |
| `alternates.canonical` | `https://domain.com/slug` |

### 사용법

```tsx
// app/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  return generateNoxionMetadata(post, siteConfig);
}
```

---

## `generateNoxionListMetadata()`

홈페이지/목록 페이지를 위한 `Metadata`를 생성합니다.

```ts
function generateNoxionListMetadata(config: NoxionConfig): Metadata
```

### 생성되는 필드

- `title.default` + `title.template: "%s | 사이트 이름"`
- `metadataBase` — 상대 URL 자동 해결
- `robots.googleBot` — `max-image-preview: large`, `max-snippet: -1`
- `alternates.types["application/rss+xml"]` — RSS 피드 링크
