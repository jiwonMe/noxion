---
sidebar_position: 4
title: 설정
description: 전체 noxion.config.ts 레퍼런스.
---

# 설정

모든 사이트 레벨 설정은 프로젝트 루트의 `noxion.config.ts`에 있습니다. 모든 Noxion 패키지가 읽는 단일 소스입니다.

---

## 전체 예시

### 단일 데이터베이스 (블로그 전용)

```ts
import {
  defineConfig,
  createRSSPlugin,
  createAnalyticsPlugin,
  createCommentsPlugin,
} from "@noxion/core";

export default defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  name: "My Blog",
  domain: "myblog.com",
  author: "Jane Doe",
  description: "A blog about web development, tooling, and open source.",
  language: "en",
  defaultTheme: "system",
  revalidate: 3600,
  revalidateSecret: process.env.REVALIDATE_SECRET,
  plugins: [
    createRSSPlugin({ feedPath: "/feed.xml", limit: 20 }),
    createAnalyticsPlugin({ provider: "google", trackingId: process.env.NEXT_PUBLIC_GA_ID }),
  ],
});
```

### 멀티 데이터베이스 (멀티 타입 사이트)

```ts
import { defineConfig, createRSSPlugin } from "@noxion/core";

export default defineConfig({
  name: "My Site",
  domain: "mysite.com",
  author: "Jane Doe",
  description: "Blog, docs, and portfolio — all powered by Notion.",
  defaultPageType: "blog",
  collections: [
    {
      name: "Blog",
      databaseId: process.env.NOTION_PAGE_ID!,
      pageType: "blog",
    },
    {
      name: "Documentation",
      databaseId: process.env.DOCS_NOTION_ID!,
      pageType: "docs",
      pathPrefix: "docs",
    },
    {
      name: "Portfolio",
      databaseId: process.env.PORTFOLIO_NOTION_ID!,
      pageType: "portfolio",
      pathPrefix: "portfolio",
    },
  ],
  plugins: [createRSSPlugin({ feedPath: "/feed.xml" })],
});
```

---

## 옵션

### 필수

단일 데이터베이스 모드에서는 `rootNotionPageId`와 사이트 메타데이터 필드가 필요합니다. 멀티 데이터베이스 모드에서는 `collections`를 대신 사용합니다.

#### `rootNotionPageId`

**타입:** `string`

Notion 데이터베이스 페이지의 32자 16진수 ID. 단일 데이터베이스 모드에서 사용됩니다. `collections`가 제공되면 필수가 아닙니다.

```ts
rootNotionPageId: process.env.NOTION_PAGE_ID!,
```

값을 찾는 방법은 [Notion 설정 → 페이지 ID 가져오기](./notion-setup#페이지-id-가져오기)를 참조하세요.

#### `name`

**타입:** `string`

사이트 이름. 다음에서 사용됩니다:
- `<title>` 템플릿: `페이지 제목 | name`
- Open Graph `og:site_name`
- JSON-LD `WebSite.name`
- RSS 피드 `<title>`

```ts
name: "My Blog",
```

#### `domain`

**타입:** `string`

**프로토콜 없는** 프로덕션 도메인. 캐노니컬 태그, Open Graph, 사이트맵, RSS, JSON-LD의 절대 URL 생성에 사용됩니다.

```ts
domain: "myblog.com",
```

#### `author`

**타입:** `string`

기본 작성자 이름. 페이지에 자체 `Author` 속성이 설정되지 않은 경우 사용됩니다.

```ts
author: "Jane Doe",
```

#### `description`

**타입:** `string`

사이트 레벨 메타 설명. 최적의 SEO를 위해 160자 이내로 유지하세요.

```ts
description: "A blog about web development, tooling, and open source.",
```

---

### 멀티 데이터베이스 옵션

#### `collections`

**타입:** `NoxionCollection[]`
**기본값:** `undefined`

Notion 데이터베이스 설정의 배열. 각 컬렉션은 Notion 데이터베이스를 페이지 타입에 매핑하며, 선택적 URL 접두사와 스키마 오버라이드를 지원합니다.

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
| `pageType` | `string` | ✅ | 페이지 타입: `"blog"`, `"docs"`, `"portfolio"`, 또는 커스텀 타입 |
| `pathPrefix` | `string` | — | URL 접두사 (예: `"docs"` → `/docs/[slug]`) |
| `schema` | `Record<string, string>` | — | 수동 속성 이름 매핑 오버라이드 |

`collections`가 제공되면 `rootNotionPageId`는 필수가 아닙니다. 둘 다 설정된 경우, `rootNotionPageId`는 기본 블로그 컬렉션을 생성하는 데 사용됩니다.

```ts
collections: [
  { databaseId: "abc123...", pageType: "blog" },
  { databaseId: "def456...", pageType: "docs", pathPrefix: "docs" },
],
```

#### `defaultPageType`

**타입:** `string`
**기본값:** `"blog"`

컬렉션에 페이지 타입이 지정되지 않았거나 단일 데이터베이스 모드에서 사용되는 기본 페이지 타입.

```ts
defaultPageType: "blog",
```

---

### 선택사항

#### `rootNotionSpaceId`

**타입:** `string | undefined`
**기본값:** `undefined`

Notion 워크스페이스(스페이스) ID. 일반적으로 필요 없으며 — 특정 비공개 워크스페이스 설정에서만 필요합니다. 비공개 페이지 접근에 문제가 있다면 `NOTION_TOKEN`과 함께 이 값을 설정해보세요.

#### `language`

**타입:** `string`
**기본값:** `"en"`

사이트의 [BCP 47 언어 태그](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang). `<html lang>`, `og:locale`, JSON-LD `inLanguage`에 사용됩니다.

지원 로케일 매핑: `en` → `en_US`, `ko` → `ko_KR`, `ja` → `ja_JP`, `zh` → `zh_CN`, `de` → `de_DE`, `fr` → `fr_FR`, `es` → `es_ES`.

#### `defaultTheme`

**타입:** `"light" | "dark" | "system"`
**기본값:** `"system"`

사이트의 초기 색상 모드.

- `"light"` — 항상 라이트, OS 설정 무시
- `"dark"` — 항상 다크, OS 설정 무시
- `"system"` — 사용자의 OS 다크/라이트 모드 설정을 따름

색상과 테마 토글 커스터마이징은 [테마](./themes)를 참조하세요.

#### `revalidate`

**타입:** `number`
**기본값:** `3600`

[ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) 재검증 간격 (**초** 단위).

```ts
revalidate: 3600,    // 1시간 (기본값)
revalidate: 600,     // 10분 — 자주 게시하는 경우
revalidate: 86400,   // 24시간 — 드물게 게시하는 경우
```

간격을 기다리지 않고 즉시 업데이트하려면 [온디맨드 재검증](#온디맨드-재검증)을 사용하세요.

#### `revalidateSecret`

**타입:** `string | undefined`
**기본값:** `undefined`

온디맨드 재검증 요청을 인증하는 데 필요한 시크릿 토큰. 설정하지 않으면 `/api/revalidate` 엔드포인트가 비활성화됩니다.

```ts
revalidateSecret: process.env.REVALIDATE_SECRET,
```

#### `plugins`

**타입:** `PluginConfig[]`
**기본값:** `[]`

활성화할 플러그인 배열. 사용 가능한 모든 플러그인과 커스텀 플러그인 작성 방법은 [플러그인](./plugins/overview)을 참조하세요.

---

## 환경 변수

환경 변수는 빌드 시 로드되며 해당 설정 값을 오버라이드합니다. git에 커밋하면 안 되는 시크릿(API 키, 토큰)을 처리하는 권장 방법입니다.

| 변수 | 필수 | Config 대응 | 설명 |
|------|------|-------------|------|
| `NOTION_PAGE_ID` | ✅ | `rootNotionPageId` | 루트 Notion 데이터베이스 페이지 ID |
| `NOTION_TOKEN` | — | *(config 대응 없음)* | 비공개 페이지용 통합 토큰 |
| `DOCS_NOTION_ID` | — | `collections[].databaseId` | Docs 데이터베이스 페이지 ID (멀티 타입 사이트) |
| `PORTFOLIO_NOTION_ID` | — | `collections[].databaseId` | Portfolio 데이터베이스 페이지 ID (멀티 타입 사이트) |
| `SITE_NAME` | — | `name` | `name` 설정 옵션 오버라이드 |
| `SITE_DOMAIN` | — | `domain` | `domain` 설정 옵션 오버라이드 |
| `SITE_AUTHOR` | — | `author` | `author` 설정 옵션 오버라이드 |
| `SITE_DESCRIPTION` | — | `description` | `description` 설정 옵션 오버라이드 |
| `REVALIDATE_SECRET` | — | `revalidateSecret` | 온디맨드 ISR 재검증 시크릿 |
| `NOTION_WEBHOOK_SECRET` | — | *(config 대응 없음)* | 자동 배포를 위한 Notion 웹훅 검증 토큰 ([설정 가이드](./auto-publish)) |
| `NEXT_PUBLIC_GA_ID` | — | *(플러그인 옵션)* | Google Analytics 추적 ID |
| `NOXION_DOWNLOAD_IMAGES` | — | *(config 대응 없음)* | `"true"`로 설정하면 빌드 시 이미지 다운로드 |

:::note NEXT_PUBLIC_ 접두사
`NEXT_PUBLIC_` 접두사가 붙은 변수는 빌드 시 **클라이언트 사이드 번들**에 포함되어 브라우저에서 볼 수 있습니다. 애널리틱스 ID와 같이 비밀이 아닌 값에만 이 접두사를 사용하세요.
:::

---

## 온디맨드 재검증

기본적으로 Noxion은 매 `revalidate` 초마다 Notion에서 콘텐츠를 다시 가져옵니다. 온디맨드 재검증을 사용하면 즉시 캐시 갱신을 트리거할 수 있습니다 — 페이지를 게시하거나 업데이트한 후 즉시 반영하고 싶을 때 유용합니다.

### 설정

1. 환경 변수에 `REVALIDATE_SECRET` 설정
2. 생성된 앱에 이미 `/api/revalidate` 라우트 핸들러가 포함되어 있음

### 사용법

```bash
# 특정 페이지 재검증
curl -X POST "https://yourdomain.com/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET","slug":"my-post-slug"}'

# 홈페이지 재검증
curl -X POST "https://yourdomain.com/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET"}'

# 문서 페이지 재검증
curl -X POST "https://yourdomain.com/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET","slug":"docs/getting-started"}'
```

### Notion과 자동화

Notion 오토메이션 또는 웹훅에서 재검증을 트리거할 수 있습니다. 또는 간단한 크론 잡(예: GitHub Actions 예약 워크플로우)으로 5분마다 재검증 엔드포인트를 호출할 수 있습니다:

```yaml
# .github/workflows/revalidate.yml
name: Revalidate Noxion Cache
on:
  schedule:
    - cron: '*/5 * * * *'
jobs:
  revalidate:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger revalidation
        run: |
          curl -X POST "${{ secrets.SITE_URL }}/api/revalidate" \
            -H "Content-Type: application/json" \
            -d "{\"secret\":\"${{ secrets.REVALIDATE_SECRET }}\"}"
```

---

## 설정 로딩 순서

앱이 시작될 때 설정은 다음 우선순위로 로드됩니다 (높은 우선순위가 우선):

1. **환경 변수** — `SITE_NAME`, `SITE_DOMAIN` 등
2. **`noxion.config.ts`** — 명시적 설정
3. **내장 기본값** — `language: "en"`, `revalidate: 3600`, `defaultTheme: "system"`, `defaultPageType: "blog"`, `plugins: []`

이를 통해 `noxion.config.ts`를 변경하지 않고 다른 환경 변수를 설정하여 동일한 코드베이스를 여러 환경(스테이징, 프로덕션)에 배포할 수 있습니다.
