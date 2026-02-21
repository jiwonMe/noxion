---
title: 구조화된 데이터
description: "@noxion/adapter-nextjs JSON-LD API"
---

# 구조화된 데이터 (JSON-LD)

```ts
import {
  generateBlogPostingLD,
  generateBreadcrumbLD,
  generateWebSiteLD,
  generateCollectionPageLD,
} from "@noxion/adapter-nextjs";
```

## `generateBlogPostingLD()`

포스트 페이지용 `BlogPosting` JSON-LD 객체를 생성합니다.

```ts
function generateBlogPostingLD(post: BlogPost, config: NoxionConfig): JsonLd
```

포함 내용: `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`, `image` (`ImageObject` 타입), `keywords`, `articleSection`, `inLanguage`, `isAccessibleForFree`.

---

## `generateBreadcrumbLD()`

포스트 페이지용 `BreadcrumbList`를 생성합니다.

```ts
function generateBreadcrumbLD(post: BlogPost, config: NoxionConfig): JsonLd
```

3단계 구조: **홈 → 카테고리 → 포스트** (카테고리 없으면 2단계).

---

## `generateWebSiteLD()`

홈페이지용 `WebSite` JSON-LD를 생성합니다. Google Sitelinks 검색창을 위한 `SearchAction`이 포함됩니다.

```ts
function generateWebSiteLD(config: NoxionConfig): JsonLd
```

---

## `generateCollectionPageLD()`

홈페이지용 포스트 `ItemList`가 포함된 `CollectionPage`를 생성합니다.

```ts
function generateCollectionPageLD(posts: BlogPost[], config: NoxionConfig): JsonLd
```

최대 30개 포스트를 `ListItem` 엔트리로 포함합니다.

---

## 사용법

```tsx
// app/[slug]/page.tsx
const blogPostingLd = generateBlogPostingLD(post, siteConfig);
const breadcrumbLd = generateBreadcrumbLD(post, siteConfig);

return (
  <article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    <NotionPage recordMap={recordMap} rootPageId={post.id} />
  </article>
);
```
