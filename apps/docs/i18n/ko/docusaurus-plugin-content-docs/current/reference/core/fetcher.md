---
title: 데이터 페처
description: "@noxion/core 데이터 페칭 API — Notion 클라이언트와 페이지 페칭 함수"
---

# 데이터 페처

```ts
import {
  createNotionClient,
  fetchBlogPosts,
  fetchCollection,
  fetchAllCollections,
  fetchPostBySlug,
  fetchPage,
  fetchAllSlugs,
} from "@noxion/core";
```

이 함수들은 Noxion의 데이터 레이어입니다. **비공식 Notion API** ([`notion-client`](https://www.npmjs.com/package/notion-client))를 사용하여 페이지 데이터를 페치하고, 타입이 지정된 `NoxionPage` 객체로 정규화합니다.

---

## `createNotionClient()`

인증된 Notion API 클라이언트를 생성합니다.

### 시그니처

```ts
function createNotionClient(options?: {
  authToken?: string;
}): NotionAPI
```

### 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `options.authToken` | `string?` | Notion 통합 토큰. 비공개 페이지에 필수; 공개 페이지에서는 생략. |

### 예시

```ts
import { createNotionClient } from "@noxion/core";

const notion = createNotionClient();

const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN,
});
```

---

## `fetchBlogPosts()`

Notion 데이터베이스에서 모든 공개 포스트를 페치합니다. 날짜 내림차순으로 정렬된 `BlogPage[]`를 반환합니다. v0.1 API이며 — 단일 데이터베이스 블로그 사이트에서 v0.2에서도 계속 작동합니다.

### 시그니처

```ts
async function fetchBlogPosts(
  client: NotionAPI,
  databasePageId: string
): Promise<BlogPage[]>
```

### 내부 알고리즘

1. `client.getPage(databasePageId)`로 전체 레코드 맵 호출
2. 컬렉션 스키마를 읽어 속성 키 찾기 (대소문자 구분 없이 매칭)
3. 모든 뷰의 블록 ID 열거
4. 각 페이지 추출: 속성, 프론트매터, 미게시 필터링
5. `metadata.date` 내림차순 정렬

### 슬러그 결정 순서

1. 프론트매터 `cleanUrl` (앞의 `/` 제거)
2. 프론트매터 `slug`
3. Notion `Slug` 속성
4. Notion 페이지 ID (폴백)

### 예시

```ts
const posts = await fetchBlogPosts(notion, siteConfig.rootNotionPageId);
// posts[0].title → "My Most Recent Post"
// posts[0].metadata.tags → ["react", "typescript"]
```

---

## `fetchCollection()`

Notion 데이터베이스에서 모든 공개 페이지를 페이지 타입 인식 스키마 매핑과 함께 페치합니다. 멀티 데이터베이스 사이트를 위한 v0.2 API입니다.

### 시그니처

```ts
async function fetchCollection(
  client: NotionAPI,
  collection: NoxionCollection
): Promise<NoxionPage[]>
```

### 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `client` | `NotionAPI` | Notion 클라이언트 |
| `collection` | `NoxionCollection` | `databaseId`, `pageType`, 선택적 `schema` 오버라이드가 있는 컬렉션 설정 |

### 반환값

`Promise<NoxionPage[]>` — 컬렉션의 `pageType`에 따라 타입이 지정된 페이지 배열. 블로그 페이지는 날짜 내림차순, 문서 페이지는 섹션 후 순서로 정렬됩니다.

### 스키마 매핑

페처는 페이지 타입별 **규칙 기반 속성 매핑**을 사용합니다. 각 페이지 타입에 기본 Notion 속성 이름이 있습니다:

| 페이지 타입 | 예상 속성 |
|-----------|----------|
| Blog | Title, Public, Published (날짜), Tags (다중 선택), Category (선택), Slug, Description, Author |
| Docs | Title, Public, Section (선택), Order (숫자), Version (텍스트), Slug, Description |
| Portfolio | Title, Public, Technologies (다중 선택), Project URL (url/텍스트), Year (텍스트), Featured (체크박스), Slug, Description |

`schema` 필드로 오버라이드:

```ts
const collection: NoxionCollection = {
  databaseId: "abc123...",
  pageType: "docs",
  schema: {
    section: "Department",
    order: "Sort Order",
  },
};
const pages = await fetchCollection(notion, collection);
```

### 예시

```ts
import { fetchCollection } from "@noxion/core";

const blogPages = await fetchCollection(notion, {
  databaseId: process.env.NOTION_PAGE_ID!,
  pageType: "blog",
});

const docsPages = await fetchCollection(notion, {
  databaseId: process.env.DOCS_NOTION_ID!,
  pageType: "docs",
  pathPrefix: "docs",
});
```

---

## `fetchAllCollections()`

설정된 모든 컬렉션에서 페이지를 병렬로 페치합니다.

### 시그니처

```ts
async function fetchAllCollections(
  client: NotionAPI,
  collections: NoxionCollection[]
): Promise<NoxionPage[]>
```

### 반환값

`Promise<NoxionPage[]>` — 모든 컬렉션의 모든 페이지를 단일 배열로 평탄화.

### 예시

```ts
const allPages = await fetchAllCollections(notion, siteConfig.collections!);
const blogPages = allPages.filter(isBlogPage);
const docsPages = allPages.filter(isDocsPage);
```

---

## `fetchPostBySlug()`

모든 공개 포스트를 페치하고 주어진 슬러그와 일치하는 것을 반환합니다.

### 시그니처

```ts
async function fetchPostBySlug(
  client: NotionAPI,
  databasePageId: string,
  slug: string
): Promise<BlogPage | undefined>
```

내부적으로 `fetchBlogPosts()`를 호출합니다 — API 호출은 한 번만 이루어집니다.

### 예시

```ts
const post = await fetchPostBySlug(notion, siteConfig.rootNotionPageId, "my-post");
```

---

## `fetchPage()`

단일 Notion 페이지의 전체 블록 데이터(`ExtendedRecordMap`)를 페치합니다. `<NotionPage recordMap={...} />`에 전달하는 것입니다.

### 시그니처

```ts
async function fetchPage(
  client: NotionAPI,
  pageId: string
): Promise<ExtendedRecordMap>
```

### 예시

```ts
const recordMap = await fetchPage(notion, post.id);
return <NotionPage recordMap={recordMap} rootPageId={post.id} />;
```

---

## `fetchAllSlugs()`

모든 공개 포스트 슬러그를 페치합니다. `generateStaticParams()`에 사용됩니다.

### 시그니처

```ts
async function fetchAllSlugs(
  client: NotionAPI,
  databasePageId: string
): Promise<string[]>
```

### 예시

```ts
export async function generateStaticParams() {
  const slugs = await fetchAllSlugs(notion, siteConfig.rootNotionPageId);
  return slugs.map((slug) => ({ slug }));
}
```
