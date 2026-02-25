---
title: Metadata
description: "@noxion/adapter-nextjs Next.js App Router용 메타데이터 생성"
---

# Metadata API

```ts
import {
  generateNoxionMetadata,
  generateNoxionListMetadata,
} from "@noxion/adapter-nextjs";
```

App Router의 `generateMetadata()` 내보내기에서 사용할 [Next.js Metadata 객체](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)를 생성합니다.

---

## `generateNoxionMetadata()`

단일 페이지를 위한 `Metadata`를 생성합니다. 모든 페이지 타입(`NoxionPage`)에서 작동합니다: blog, docs, portfolio, 또는 커스텀.

### 시그니처

```ts
function generateNoxionMetadata(
  page: NoxionPage,
  config: NoxionConfig,
  registry?: PageTypeRegistry
): Metadata
```

### 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `page` | `NoxionPage` | 메타데이터를 생성할 페이지 (모든 페이지 타입) |
| `config` | `NoxionConfig` | 사이트 설정 |

### 생성되는 필드

| 메타데이터 필드 | 소스 |
|---------------|------|
| `title` | `page.title` |
| `description` | `page.description` 또는 폴백 `"<page title> - <site name>"` (최대 160자) |
| `authors` | `page.metadata.author ?? config.author` |
| `openGraph.type` | 블로그 페이지는 `"article"`, 그 외는 `"website"` |
| `openGraph.publishedTime` | `page.metadata.date` (블로그 페이지) |
| `openGraph.modifiedTime` | `page.lastEditedTime` |
| `openGraph.tags` | `page.metadata.tags` (블로그 페이지) |
| `openGraph.section` | `page.metadata.category` (존재하는 경우) |
| `openGraph.images` | `page.coverImage` (1200×630) |
| `twitter.card` | `"summary_large_image"` |
| `alternates.canonical` | `https://{domain}/{slug}` |

메타데이터 필드는 내부 헬퍼 함수 `getMetaString()`과 `getMetaStringArray()`를 사용하여 `page.metadata`에서 접근됩니다.

### 사용법

```tsx
// app/[slug]/page.tsx
import { generateNoxionMetadata } from "@noxion/adapter-nextjs";

export async function generateMetadata({ params }) {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  return generateNoxionMetadata(post, siteConfig);
}
```

---

## `generateNoxionListMetadata()`

홈페이지와 목록/컬렉션 페이지를 위한 `Metadata`를 생성합니다.

### 시그니처

```ts
function generateNoxionListMetadata(config: NoxionConfig): Metadata
```

### 생성되는 필드

| 메타데이터 필드 | 값 |
|---------------|-----|
| `title.default` | `config.name` |
| `title.template` | `"%s \| config.name"` |
| `description` | `config.description` |
| `metadataBase` | `new URL("https://<site-domain>")` |
| `openGraph.type` | `"website"` |
| `robots.index` / `robots.follow` | `true` |
| `alternates.types["application/rss+xml"]` | RSS 피드 디스커버리 (RSS 플러그인이 설정된 경우) |

### 사용법

```tsx
// app/layout.tsx
import { generateNoxionListMetadata } from "@noxion/adapter-nextjs";

export const metadata = generateNoxionListMetadata(siteConfig);
```
