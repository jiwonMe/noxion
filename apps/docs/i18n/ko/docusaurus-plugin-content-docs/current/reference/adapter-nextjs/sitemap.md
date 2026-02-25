---
title: 사이트맵, Robots, 라우팅 & Static Params
description: "@noxion/adapter-nextjs 사이트맵, robots.txt, 멀티 페이지 타입 라우팅, generateStaticParams 헬퍼"
---

# 사이트맵, Robots, 라우팅 & Static Params

```ts
import {
  generateNoxionSitemap,
  generateNoxionRobots,
  generateNoxionStaticParams,
  generateNoxionRoutes,
  resolvePageType,
  buildPageUrl,
  generateStaticParamsForRoute,
} from "@noxion/adapter-nextjs";
```

---

## `generateNoxionSitemap()`

페이지 타입 인식 우선순위 레벨로 사이트맵을 생성합니다.

### 시그니처

```ts
function generateNoxionSitemap(
  pages: NoxionPage[],
  config: NoxionConfig,
  routePrefix?: Record<string, string>
): MetadataRoute.Sitemap
```

### 페이지 타입별 우선순위

| 페이지 타입 | 우선순위 |
|-----------|---------|
| 홈페이지 | 1.0 |
| 블로그 포스트 | 0.8 |
| 문서 페이지 | 0.7 |
| 포트폴리오 프로젝트 | 0.6 |
| 태그 페이지 | 0.5 |

### 사용법

```ts
// app/sitemap.ts
import { generateNoxionSitemap } from "@noxion/adapter-nextjs";

export default async function sitemap() {
  const pages = await getAllPages();
  return generateNoxionSitemap(pages, siteConfig);
}
```

---

## `generateNoxionRoutes()`

모든 컬렉션에 대한 라우트 설정을 생성합니다. 멀티 페이지 타입 라우팅에 사용됩니다.

### 시그니처

```ts
function generateNoxionRoutes(
  config: NoxionConfig
): NoxionRouteConfig[]
```

### 반환값

```ts
interface NoxionRouteConfig {
  pageType: string;
  pathPrefix: string;
  paramName: string;
}
```

---

## `resolvePageType()`

설정된 라우트 접두사와 매칭하여 URL 경로에서 페이지 타입을 결정합니다.

### 시그니처

```ts
function resolvePageType(
  path: string,
  routes: NoxionRouteConfig[]
): NoxionRouteConfig | undefined
```

### 예시

```ts
const routes = generateNoxionRoutes(config);

resolvePageType("/docs/getting-started", routes);
// => { pageType: "docs", pathPrefix: "/docs", paramName: "slug" }
```

---

## `buildPageUrl()`

컬렉션의 `pathPrefix`를 사용하여 페이지의 전체 URL 경로를 빌드합니다.

### 시그니처

```ts
function buildPageUrl(
  page: NoxionPage,
  routes: NoxionRouteConfig[]
): string
```

### 예시

```ts
const routes = generateNoxionRoutes(config);
buildPageUrl(docsPage, routes);      // "/docs/getting-started"
buildPageUrl(blogPage, routes);      // "/my-post"
buildPageUrl(portfolioPage, routes); // "/portfolio/noxion" (pathPrefix를 /portfolio로 설정한 경우)
```

---

## `generateStaticParamsForRoute()`

특정 페이지 타입 라우트에 대한 static params를 생성합니다.

### 시그니처

```ts
function generateStaticParamsForRoute(
  pages: NoxionPage[],
  route: NoxionRouteConfig
): { slug: string }[]
```

---

## `generateNoxionRobots()`

사이트맵 참조가 포함된 robots.txt를 생성합니다.

```ts
function generateNoxionRobots(config: NoxionConfig): MetadataRoute.Robots
```

### 생성되는 robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://mysite.com/sitemap.xml
Host: https://mysite.com
```

---

## `generateNoxionStaticParams()`

Next.js `generateStaticParams()`용 `{ slug: string }[]`를 생성합니다.

```ts
async function generateNoxionStaticParams(
  client: NotionAPI,
  rootPageId: string
): Promise<{ slug: string }[]>
```

### 사용법

```ts
// app/[slug]/page.tsx
export async function generateStaticParams() {
  return generateNoxionStaticParams(notion, siteConfig.rootNotionPageId);
}
```
