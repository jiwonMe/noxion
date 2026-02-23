---
title: 구조화된 데이터 (JSON-LD)
description: "@noxion/adapter-nextjs schema.org 타입용 JSON-LD 구조화된 데이터 생성기"
---

# 구조화된 데이터 (JSON-LD)

```ts
import {
  generateBlogPostingLD,
  generateTechArticleLD,
  generateCreativeWorkLD,
  generatePageLD,
  generateBreadcrumbLD,
  generateWebSiteLD,
  generateCollectionPageLD,
} from "@noxion/adapter-nextjs";
```

[schema.org](https://schema.org/) 어휘를 따르는 [JSON-LD](https://json-ld.org/) 구조화된 데이터를 생성합니다.

---

## `generatePageLD()`

`page.pageType`에 따라 올바른 JSON-LD 타입을 자동 선택합니다. 대부분의 사용 사례에 권장되는 함수입니다.

### 시그니처

```ts
function generatePageLD(
  page: NoxionPage,
  config: NoxionConfig
): Record<string, unknown>
```

### 동작

| `page.pageType` | 생성되는 `@type` | 사용되는 함수 |
|-----------------|-----------------|-------------|
| `"blog"` | `BlogPosting` | `generateBlogPostingLD()` |
| `"docs"` | `TechArticle` | `generateTechArticleLD()` |
| `"portfolio"` | `CreativeWork` | `generateCreativeWorkLD()` |
| 기타 | `Article` | 제네릭 아티클 스키마 |

### 사용법

```tsx
import { generatePageLD, generateBreadcrumbLD } from "@noxion/adapter-nextjs";

export default async function PageDetail({ params }) {
  const page = await getPageBySlug((await params).slug);
  const pageLd = generatePageLD(page, siteConfig);
  const breadcrumbLd = generateBreadcrumbLD(page, siteConfig);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {/* 페이지 콘텐츠 */}
    </article>
  );
}
```

---

## `generateBlogPostingLD()`

블로그 포스트용 [`BlogPosting`](https://schema.org/BlogPosting) 스키마를 생성합니다.

### 시그니처

```ts
function generateBlogPostingLD(
  page: NoxionPage,
  config: NoxionConfig
): Record<string, unknown>
```

### 생성되는 스키마

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "description": "Post description...",
  "datePublished": "2025-02-01",
  "dateModified": "2025-02-10T12:34:56.789Z",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "publisher": { "@type": "Organization", "name": "My Blog", "url": "https://myblog.com" },
  "image": { "@type": "ImageObject", "url": "...", "width": 1200, "height": 630 },
  "keywords": "react, typescript",
  "articleSection": "Web Dev",
  "inLanguage": "en",
  "url": "https://myblog.com/my-post"
}
```

---

## `generateTechArticleLD()`

문서 페이지용 [`TechArticle`](https://schema.org/TechArticle) 스키마를 생성합니다. `proficiencyLevel`과 `dependencies` 필드를 포함합니다.

### 시그니처

```ts
function generateTechArticleLD(
  page: NoxionPage,
  config: NoxionConfig
): Record<string, unknown>
```

### 생성되는 스키마

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Configuration Guide",
  "description": "How to configure Noxion...",
  "dateModified": "2025-02-10T12:34:56.789Z",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "publisher": { "@type": "Organization", "name": "My Docs" },
  "inLanguage": "en",
  "url": "https://mysite.com/docs/configuration"
}
```

---

## `generateCreativeWorkLD()`

포트폴리오 프로젝트용 [`CreativeWork`](https://schema.org/CreativeWork) 스키마를 생성합니다. `technology`, `url`, `dateCreated` 필드를 포함합니다.

### 시그니처

```ts
function generateCreativeWorkLD(
  page: NoxionPage,
  config: NoxionConfig
): Record<string, unknown>
```

### 생성되는 스키마

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Noxion",
  "description": "A Notion-powered website builder",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "url": "https://nox.io",
  "dateCreated": "2026",
  "keywords": "TypeScript, React, Next.js"
}
```

---

## `generateBreadcrumbLD()`

[`BreadcrumbList`](https://schema.org/BreadcrumbList) 스키마를 생성합니다. 페이지 타입에 맞게 조정됩니다 — 블로그 페이지는 카테고리를 중간 크럼으로, 문서 페이지는 섹션을, 포트폴리오는 "Portfolio"를 사용합니다.

### 시그니처

```ts
function generateBreadcrumbLD(
  page: NoxionPage,
  config: NoxionConfig
): Record<string, unknown>
```

---

## `generateWebSiteLD()`

[`SearchAction`](https://schema.org/SearchAction)이 포함된 [`WebSite`](https://schema.org/WebSite) 스키마를 생성합니다.

```ts
function generateWebSiteLD(config: NoxionConfig): Record<string, unknown>
```

---

## `generateCollectionPageLD()`

홈페이지 포스트 목록용 [`ItemList`](https://schema.org/ItemList)가 포함된 [`CollectionPage`](https://schema.org/CollectionPage)를 생성합니다.

```ts
function generateCollectionPageLD(
  pages: NoxionPage[],
  config: NoxionConfig
): Record<string, unknown>
```

---

## 구조화된 데이터 검증

[Google Rich Results Test](https://search.google.com/test/rich-results)를 사용하여 JSON-LD를 검증하세요. 일반적인 요구사항:
- `datePublished`는 ISO 8601 형식이어야 함
- `headline`은 110자 이하여야 함
- 이미지는 `summary_large_image` Twitter Cards를 위해 최소 696px 너비여야 함
