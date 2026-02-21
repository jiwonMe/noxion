---
title: defineConfig
description: "@noxion/core 설정 API"
---

# `defineConfig()`

```ts
import { defineConfig } from "@noxion/core";
```

기본값이 적용된 `NoxionConfig` 객체를 생성합니다.

## 시그니처

```ts
function defineConfig(input: NoxionConfigInput): NoxionConfig
```

## 파라미터

### `NoxionConfigInput`

| 속성 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `rootNotionPageId` | `string` | ✅ | — | 루트 Notion 데이터베이스 페이지 ID |
| `name` | `string` | ✅ | — | 사이트 이름 |
| `domain` | `string` | ✅ | — | 프로덕션 도메인 (프로토콜 없음) |
| `author` | `string` | ✅ | — | 기본 작성자 이름 |
| `description` | `string` | ✅ | — | 사이트 설명 |
| `rootNotionSpaceId` | `string` | — | — | Notion 워크스페이스 ID |
| `language` | `string` | — | `"en"` | 사이트 언어 코드 |
| `defaultTheme` | `ThemeMode` | — | `"system"` | 기본 색 구성표 |
| `revalidate` | `number` | — | `3600` | ISR 재검증 간격 (초) |
| `revalidateSecret` | `string` | — | — | 온디맨드 재검증 시크릿 |
| `plugins` | `PluginConfig[]` | — | `[]` | 활성화할 플러그인 |

## 반환값

`NoxionConfig` — 모든 기본값이 적용된 정규화된 설정.

## 예시

```ts
import { defineConfig } from "@noxion/core";

export default defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  name: "내 블로그",
  domain: "myblog.com",
  author: "이름",
  description: "나의 블로그",
  language: "ko",
  defaultTheme: "system",
  revalidate: 3600,
});
```

---

# `loadConfig()`

```ts
import { loadConfig } from "@noxion/core";
```

런타임에 `noxion.config.ts`에서 설정을 로드합니다. 생성된 앱 내부에서 사용됩니다.

## 시그니처

```ts
function loadConfig(): NoxionConfig
```
