---
title: defineConfig / loadConfig
description: "@noxion/core 설정 API"
---

# Config API

```ts
import { defineConfig, loadConfig } from "@noxion/core";
```

---

## `defineConfig()`

기본값이 모두 적용된 `NoxionConfig` 객체를 생성하고 필수 필드를 검증합니다.

### 시그니처

```ts
function defineConfig(input: NoxionConfigInput): NoxionConfig
```

### 파라미터

| 속성 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `rootNotionPageId` | `string` | * | — | 루트 Notion 데이터베이스 페이지 ID. `collections`가 설정되지 않은 경우 필수. |
| `name` | `string` | ✅ | — | 사이트 이름 |
| `domain` | `string` | ✅ | — | 프로토콜 없는 프로덕션 도메인 |
| `author` | `string` | ✅ | — | 기본 작성자 이름 |
| `description` | `string` | ✅ | — | 사이트 설명 |
| `collections` | `NoxionCollection[]` | — | `undefined` | 멀티 데이터베이스 설정 |
| `defaultPageType` | `string` | — | `"blog"` | 단일 데이터베이스 모드의 기본 페이지 타입 |
| `rootNotionSpaceId` | `string` | — | `undefined` | Notion 워크스페이스 ID |
| `language` | `string` | — | `"en"` | BCP 47 언어 태그 |
| `defaultTheme` | `ThemeMode` | — | `"system"` | 초기 색상 모드 |
| `revalidate` | `number` | — | `3600` | ISR 재검증 간격 (초) |
| `revalidateSecret` | `string` | — | `undefined` | 온디맨드 재검증 시크릿 |
| `plugins` | `PluginConfig[]` | — | `[]` | 활성화할 플러그인 |

### `defineConfig`이 하는 일

1. 입력을 기본값과 병합:
   ```ts
   const defaults = {
     language: "en",
     defaultTheme: "system",
     defaultPageType: "blog",
     revalidate: 3600,
     plugins: [],
   };
   ```
2. `rootNotionPageId`가 `collections` 없이 설정된 경우, 지정된 `defaultPageType`으로 기본 컬렉션을 생성
3. `collections` 항목에 `databaseId`와 `pageType`이 있는지 검증
4. 환경 변수 오버라이드 확인
5. 병합된 `NoxionConfig` 반환

### 단일 데이터베이스 모드

```ts
export default defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  name: "My Blog",
  domain: "myblog.com",
  author: "Jane Doe",
  description: "A blog about web development.",
  plugins: [createRSSPlugin({ feedPath: "/feed.xml" })],
});
```

### 멀티 데이터베이스 모드

```ts
export default defineConfig({
  name: "My Site",
  domain: "mysite.com",
  author: "Jane Doe",
  description: "Blog, docs, and portfolio.",
  collections: [
    { databaseId: process.env.NOTION_PAGE_ID!, pageType: "blog" },
    { databaseId: process.env.DOCS_NOTION_ID!, pageType: "docs", pathPrefix: "docs" },
    { databaseId: process.env.PORTFOLIO_NOTION_ID!, pageType: "portfolio", pathPrefix: "portfolio" },
  ],
});
```

---

## `loadConfig()`

런타임에 `noxion.config.ts`에서 설정을 로드하며, 환경 변수 오버라이드가 적용됩니다.

### 시그니처

```ts
function loadConfig(): NoxionConfig
```

### 환경 변수 오버라이드

| 환경 변수 | 오버라이드 대상 |
|-----------|---------------|
| `SITE_NAME` | `name` |
| `SITE_DOMAIN` | `domain` |
| `SITE_AUTHOR` | `author` |
| `SITE_DESCRIPTION` | `description` |
| `REVALIDATE_SECRET` | `revalidateSecret` |

### 사용법

`loadConfig()`는 생성된 `lib/config.ts` 내부에서 호출됩니다:

```ts
// lib/config.ts (create-noxion이 생성)
import { loadConfig } from "@noxion/core";

export const siteConfig = loadConfig();
```

---

## `NoxionCollection`

```ts
interface NoxionCollection {
  name?: string;
  databaseId: string;
  pageType: string;
  pathPrefix?: string;
  schema?: Record<string, string>;
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | `string` | — | 컬렉션 표시 이름 |
| `databaseId` | `string` | ✅ | Notion 데이터베이스 페이지 ID |
| `pageType` | `string` | ✅ | 페이지 타입: `"blog"`, `"docs"`, `"portfolio"`, 또는 커스텀 |
| `pathPrefix` | `string` | — | URL 접두사 (예: `"docs"` → `/docs/[slug]`) |
| `schema` | `Record<string, string>` | — | 기본 속성 이름 매핑 오버라이드 |

전체 타입 레퍼런스는 [타입](./types)을 참조하세요.
