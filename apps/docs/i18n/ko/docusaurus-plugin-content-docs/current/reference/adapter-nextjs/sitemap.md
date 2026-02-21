---
title: 사이트맵 & Robots
description: "@noxion/adapter-nextjs 사이트맵 및 robots API"
---

# 사이트맵 & Robots

## `generateNoxionSitemap()`

```ts
import { generateNoxionSitemap } from "@noxion/adapter-nextjs";

function generateNoxionSitemap(posts: BlogPost[], config: NoxionConfig): MetadataRoute.Sitemap
```

다음에 대한 사이트맵 엔트리를 반환합니다:
- 홈페이지 (우선순위 1.0, 매일)
- 모든 포스트 (우선순위 0.8, 매주)
- 모든 태그 페이지 (우선순위 0.5, 매주)

### 사용법

```ts
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllPosts();
  return generateNoxionSitemap(posts, siteConfig);
}
```

---

## `generateNoxionRobots()`

```ts
import { generateNoxionRobots } from "@noxion/adapter-nextjs";

function generateNoxionRobots(config: NoxionConfig): MetadataRoute.Robots
```

다음 내용의 robots.txt를 생성합니다:
- `Allow: /`
- `Disallow: /api/`, `Disallow: /_next/`
- 사이트맵 URL
- host 디렉티브

### 사용법

```ts
// app/robots.ts
export default function robots() {
  return generateNoxionRobots(siteConfig);
}
```

---

## `generateNoxionStaticParams()`

```ts
import { generateNoxionStaticParams } from "@noxion/adapter-nextjs";

async function generateNoxionStaticParams(
  client: NotionAPI,
  rootPageId: string
): Promise<{ slug: string }[]>
```

`[slug]/page.tsx`의 `generateStaticParams()`에서 사용할 모든 포스트 슬러그를 반환합니다.
