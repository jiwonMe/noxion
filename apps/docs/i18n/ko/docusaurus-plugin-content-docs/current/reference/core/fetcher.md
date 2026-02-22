---
title: 데이터 페처
description: "@noxion/core 데이터 페칭 API"
---

# 데이터 페처

```ts
import { createNotionClient, fetchBlogPosts, fetchPostBySlug, fetchPage } from "@noxion/core";
```

## `createNotionClient()`

```ts
function createNotionClient(options: { authToken?: string }): NotionAPI
```

Notion API 클라이언트를 생성합니다. 비공개 페이지에는 `authToken`을 전달하세요.

```ts
const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN,
});
```

---

## `fetchBlogPosts()`

Notion 데이터베이스에서 공개된 모든 포스트를 페치하고, 프론트매터를 적용해 날짜 내림차순으로 정렬합니다.

```ts
async function fetchBlogPosts(
  client: NotionAPI,
  rootPageId: string
): Promise<BlogPost[]>
```

### 동작 방식

1. `client.getPage(rootPageId)`로 컬렉션과 모든 뷰 데이터를 가져옵니다
2. **모든 뷰**의 blockIds를 수집합니다 (`collection_group_results` 포함)
3. `Public` 체크박스가 `Yes`인 페이지만 필터링합니다
4. 스키마 속성을 `BlogPost` 필드에 매핑합니다
5. 각 페이지의 첫 번째 코드 블록에서 프론트매터를 파싱합니다
6. 프론트매터 적용 (`cleanUrl`, `title`, `description` 등)
7. `date` 기준 내림차순 정렬

### 슬러그 결정 순서

1. 프론트매터 `cleanUrl` (예: `/my-post` → `my-post`)
2. Notion `Slug` 속성
3. Notion 페이지 ID (최후 fallback)

---

## `fetchPostBySlug()`

```ts
async function fetchPostBySlug(
  client: NotionAPI,
  rootPageId: string,
  slug: string
): Promise<BlogPost | undefined>
```

모든 포스트를 페치한 뒤 슬러그가 일치하는 포스트를 반환합니다. 없으면 `undefined`를 반환합니다.

---

## `fetchPage()`

```ts
async function fetchPage(
  client: NotionAPI,
  pageId: string
): Promise<ExtendedRecordMap>
```

Notion 페이지의 전체 레코드 맵(블록, 컬렉션, signed URL)을 페치합니다. `@noxion/notion-renderer`로 렌더링할 때 사용됩니다.

---

## `fetchAllSlugs()`

```ts
async function fetchAllSlugs(
  client: NotionAPI,
  rootPageId: string
): Promise<string[]>
```

공개된 모든 포스트 슬러그를 반환합니다. `generateStaticParams()`에서 사용됩니다.
