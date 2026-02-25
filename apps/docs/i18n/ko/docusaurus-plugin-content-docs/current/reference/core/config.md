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

`noxion.config.ts` 작성을 위한 타입 헬퍼입니다. 입력을 그대로 반환하므로 에디터 타입 추론을 제공합니다.

### 시그니처

```ts
function defineConfig(input: NoxionConfigInput): NoxionConfigInput
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
| `plugins` | `PluginConfig[]` | — | `undefined` | 활성화할 플러그인 |

### `defineConfig`이 하는 일

- 설정 필드에 대한 컴파일 타임 타입 체크를 제공합니다.
- 입력 객체를 그대로 반환합니다.
- 런타임 기본값 적용/검증은 수행하지 않습니다.

런타임 기본값 적용/검증은 `loadConfig(input)`에서 수행됩니다.

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

`NoxionConfigInput`을 검증하고 기본값이 적용된 `NoxionConfig`를 반환합니다.

### 시그니처

```ts
function loadConfig(input: NoxionConfigInput): NoxionConfig
```

### 런타임 동작

- `rootNotionPageId`와 `collections`가 모두 없으면 에러를 던집니다.
- `name`, `domain` 등 필수 필드가 없으면 에러를 던집니다.
- `language`, `defaultTheme`, `defaultPageType`, `revalidate` 기본값을 적용합니다.
- `rootNotionPageId`만 제공되면 기본 `collections` 항목을 생성합니다.

### 사용법

`loadConfig()`는 생성된 `lib/config.ts` 내부에서 호출됩니다:

```ts
// lib/config.ts (create-noxion이 생성)
import { loadConfig } from "@noxion/core";
import noxionConfigInput from "../noxion.config";

export const siteConfig = loadConfig(noxionConfigInput);
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
