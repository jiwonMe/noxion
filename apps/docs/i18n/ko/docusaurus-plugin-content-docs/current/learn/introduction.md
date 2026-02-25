---
sidebar_position: 1
title: 소개
description: Noxion이란 무엇이며 왜 만들었나요?
---

# 소개

**Noxion**은 **Notion을 CMS로 사용**하는 오픈소스, 셀프호스팅 **웹사이트 빌더**입니다. 하나 이상의 Notion 데이터베이스를 연결하면 완전히 렌더링된 SEO 최적화 웹사이트를 얻을 수 있습니다 — 블로그, 문서 사이트, 포트폴리오, 또는 이들의 조합 — 벤더 종속 없이, 반복 비용 없이, 인프라를 완전히 소유합니다.

[super.so](https://super.so)나 [oopy.io](https://oopy.io)와 비슷하지만 — 무료이고, 오픈소스이며, 완전히 직접 소유합니다.

---

## 왜 Noxion인가?

대부분의 개발자는 Notion의 편리한 에디터에서 글을 쓰고 싶지만, 빠르고 SEO가 최적화된 직접 제어 가능한 사이트에 게시하고 싶어합니다. 기존 대안들은 모두 상당한 트레이드오프가 있습니다:

| 옵션 | 문제점 |
|------|-------|
| Notion 기본 공유 | 느림 (서버 사이드 렌더링, CDN 없음), 커스텀 도메인 없음, SEO 거의 불가 |
| super.so / oopy.io | 월 $16–$32, 비공개 소스, 완전한 벤더 종속 |
| 내보내기 → 정적 사이트 | 수동 작업, 시간 소모, 내보내기 후 실시간 동기화 없음 |
| 공식 Notion API | presigned S3 이미지 URL이 ~1시간 후 만료 |

Noxion은 이 모든 문제를 해결합니다. 핵심 아키텍처 결정:

### 비공식 Notion API

Noxion은 **비공식 Notion API**를 사용합니다 — Notion 자체 웹앱을 구동하는 동일한 JSON 엔드포인트입니다. [공식 퍼블릭 API](https://developers.notion.com/)에 비해 훨씬 풍부한 데이터 접근이 가능하며, 인라인 스타일을 포함한 전체 블록 트리 데이터, 컬렉션 뷰, 중첩 페이지 구조 등을 제공합니다.

트레이드오프는 이 API가 문서화되지 않았고 예고 없이 변경될 수 있다는 점입니다. 실제로는 관련 생태계(`notion-client`, `notion-types` 등)가 Notion이 자체 앱에서 이 API를 사용하기 때문에 수년간 안정적으로 유지되고 있습니다.

### ISR (증분 정적 재생성)

페이지는 빌드 시 정적으로 생성되고 [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)을 사용하여 백그라운드에서 자동으로 재생성됩니다. 기본적으로 콘텐츠는 매시간 갱신됩니다(`revalidate: 3600`). 즉시 업데이트를 위해 [온디맨드 재검증 API](./configuration#온디맨드-재검증)를 사용하면 Notion에서 게시하는 순간 갱신을 트리거할 수 있습니다.

### 만료되지 않는 이미지 URL

Notion의 공식 API는 ~1시간 후 만료되는 presigned S3 URL을 반환합니다 — 정적 사이트에서는 사용할 수 없습니다. Noxion은 모든 이미지를 `notion.so/image/`를 통해 라우팅합니다. 이 안정적인 프록시는 **만료되지 않습니다**. 이 URL은 Next.js Image에 의해 AVIF/WebP로 추가 최적화됩니다.

---

## Noxion이 제공하는 것

| 기능 | 상세 |
|------|------|
| **빠른 시작** | `bun create noxion`으로 1분 안에 Next.js 16 App Router 사이트 스캐폴딩 — 블로그, 문서, 포트폴리오, 또는 전체 멀티 타입 선택 |
| **다중 페이지 타입** | 블로그 포스트, 문서 페이지, 포트폴리오 프로젝트 — 각각 자체 Notion 데이터베이스, URL 구조, 템플릿 보유 |
| **Notion에서 작성** | Notion의 전체 에디터 사용 — 페이지는 1시간 이내, 또는 온디맨드 재검증으로 즉시 사이트에 반영 |
| **완전한 SEO 스택** | Open Graph, Twitter Cards, JSON-LD (BlogPosting, TechArticle, CreativeWork, BreadcrumbList, WebSite + SearchAction), RSS 2.0, XML 사이트맵, robots.txt — 전부 자동 생성 |
| **이미지 최적화** | `next/image`를 통한 AVIF/WebP 자동 변환, 만료되지 않는 안정적 프록시 URL. 선택적 빌드 시 이미지 다운로드로 완전한 오프라인 독립 |
| **플러그인 시스템** | 애널리틱스, RSS, 댓글, 읽기 시간 — 플러그인 SDK(`@noxion/plugin-utils`)로 직접 제작도 가능 |
| **테마 시스템** | `defineThemeContract()`를 통한 컨트랙트 기반 테마와 CSS 변수 커스터마이징. 라이트/다크/시스템 모드 기본 제공 |
| **구문 강조** | [Shiki](https://shiki.style) 기반 VS Code 수준의 코드 블록, 듀얼 테마 지원 — 클라이언트 사이드 JS 불필요 |
| **수식 렌더링** | KaTeX SSR — 서버 사이드 수식 렌더링, 클라이언트 사이드 수학 런타임 불필요 |
| **어디서나 배포** | Vercel (원클릭), Docker, 정적 내보내기 |

---

## 페이지 타입

Noxion은 세 가지 내장 페이지 타입을 지원하며, 각각 자체 Notion 데이터베이스 스키마, URL 라우팅, 템플릿, SEO 메타데이터를 가집니다:

| 타입 | 사용 용도 | URL 패턴 | JSON-LD |
|------|----------|---------|---------|
| **Blog** | 글, 포스트 | `/blog/[slug]` 또는 `/[slug]` | `BlogPosting` |
| **Docs** | 문서, 가이드 | `/docs/[slug]` | `TechArticle` |
| **Portfolio** | 프로젝트, 사례 연구 | `/portfolio/[slug]` | `CreativeWork` |

각 페이지 타입은 별도의 Notion 데이터베이스에 매핑됩니다. `noxion.config.ts`의 `collections`를 통해 설정합니다:

```ts
export default defineConfig({
  name: "My Site",
  domain: "mysite.com",
  author: "Jane Doe",
  description: "My personal website",
  collections: [
    { databaseId: process.env.BLOG_NOTION_ID!, pageType: "blog" },
    { databaseId: process.env.DOCS_NOTION_ID!, pageType: "docs", pathPrefix: "docs" },
    { databaseId: process.env.PORTFOLIO_NOTION_ID!, pageType: "portfolio", pathPrefix: "portfolio" },
  ],
});
```

플러그인은 `registerPageTypes` 훅을 통해 추가 커스텀 페이지 타입을 등록할 수 있습니다.

---

## 아키텍처

Noxion은 조합 가능한 **npm 패키지 모노레포**입니다:

```
noxion/
├── packages/
│   ├── @noxion/core              — 데이터 페칭, 설정, 플러그인 시스템, 타입
│   ├── @noxion/notion-renderer   — Notion 블록 렌더러 (KaTeX SSR, Shiki 구문 강조)
│   ├── @noxion/renderer          — React 컴포넌트, 템플릿, 테마 시스템
│   ├── @noxion/adapter-nextjs    — SEO 유틸리티 (Metadata, JSON-LD, sitemap, routing)
│   ├── @noxion/plugin-utils      — 플러그인 SDK (목 데이터, 테스트 헬퍼, 매니페스트 검증)
│   └── create-noxion             — CLI 스캐폴딩 도구
└── apps/
    ├── docs/                     — 이 문서 사이트 (Docusaurus)
    └── web/                      — 데모/참조용 Next.js 사이트
```

### 데이터 흐름

```
Notion 데이터베이스 (Blog, Docs, Portfolio)
    │
    ▼
@noxion/core (fetchCollection / fetchAllCollections)
    │  ├─ 비공식 Notion API 호출 (notion-client)
    │  ├─ 스키마 매퍼 → 페이지 타입별 속성 추출
    │  ├─ 타입이 지정된 NoxionPage[] 반환 (BlogPage, DocsPage, PortfolioPage)
    │  ├─ 첫 번째 코드 블록에서 프론트매터 파싱
    │  └─ 플러그인 적용 (transformPosts, registerPageTypes 훅)
    │
    ▼
Next.js App Router (ISR, revalidate: 3600)
    │
    ├─ @noxion/adapter-nextjs → generateMetadata(), JSON-LD, sitemap, routing
    ├─ @noxion/notion-renderer → 블록 렌더링 (30+ 타입), KaTeX SSR, Shiki
    └─ @noxion/renderer → 템플릿, 컴포넌트, ThemeProvider
```

### `create-noxion` CLI

`bun create noxion my-site`을 실행하면 Next.js 16 App Router 프로젝트를 생성합니다. 템플릿을 선택하세요:

| 템플릿 | 설명 |
|--------|------|
| `blog` (기본) | 포스트 목록과 상세 페이지가 있는 단일 블로그 |
| `docs` | 사이드바 내비게이션이 있는 문서 사이트 |
| `portfolio` | 프로젝트 그리드와 상세 페이지가 있는 포트폴리오 |
| `full` | 세 가지 페이지 타입을 모두 결합 |

플러그인과 테마 스타터 프로젝트도 스캐폴딩할 수 있습니다:

```bash
bun create noxion my-plugin --plugin
bun create noxion my-theme --theme
```

**생성된 앱은 직접 소유합니다** — Noxion 패키지는 단순히 npm 의존성입니다. 모든 파일을 커스터마이징하거나, 컴포넌트를 오버라이드하거나, 필요하면 완전히 분리할 수 있습니다.

---

## 핵심 개념

### `NoxionConfig`

`noxion.config.ts`에 정의된 중앙 설정 객체. 모든 패키지가 이 단일 소스를 읽습니다. 단일 데이터베이스 모드(`rootNotionPageId`)와 멀티 데이터베이스 모드(`collections`) 모두 지원합니다. [설정](./configuration)에서 모든 옵션을 확인하세요.

### `NoxionPage`

페처가 출력하는 정규화된 페이지 데이터 타입. `pageType` 기반의 구별된 유니온(discriminated union)입니다:

- `BlogPage` — `date`, `tags`, `category`, `author`가 있는 블로그 포스트
- `DocsPage` — `section`, `order`, `version`이 있는 문서 페이지
- `PortfolioPage` — `technologies`, `projectUrl`, `year`, `featured`가 있는 포트폴리오 프로젝트

모든 페이지 타입은 공통 필드를 공유합니다: `id`, `title`, `slug`, `description`, `coverImage`, `published`, `lastEditedTime`, `frontmatter`, 그리고 타입별 데이터를 위한 `metadata` 레코드.

`BlogPost`는 하위 호환성을 위해 `BlogPage`의 타입 별칭으로 유지됩니다. [타입 레퍼런스](../reference/core/types)를 참조하세요.

### 프론트매터

Noxion은 Notion 페이지 상단의 특별한 **코드 블록**을 읽어 페이지별 메타데이터 오버라이드로 사용합니다. Notion을 떠나지 않고 커스텀 슬러그, SEO 제목, 설명을 설정할 수 있습니다. [Notion 설정 → 프론트매터](./notion-setup#프론트매터-오버라이드)를 참조하세요.

### 플러그인

플러그인은 잘 정의된 라이프사이클 훅에서 Noxion을 확장합니다: `transformPosts`, `registerPageTypes`, `extendSlots`, `configSchema` 등. 내장 플러그인으로 애널리틱스, RSS, 댓글을 지원합니다. 테스트와 개발에는 `@noxion/plugin-utils`를 사용하세요. [플러그인](./plugins/overview)을 참조하세요.

### 테마

테마는 `defineThemeContract()`를 통해 정의되는 컨트랙트 기반 패키지로, 컴포넌트, 레이아웃, 템플릿을 번들링합니다. 기본 테마는 블로그와 문서 페이지 타입을 지원합니다. 커뮤니티 테마는 지원하는 페이지 타입을 선언할 수 있습니다. [테마](./themes)를 참조하세요.

---

## 대안과의 비교

| | Noxion | super.so | Docusaurus | Hugo |
|---|---|---|---|---|
| CMS | Notion | Notion | Markdown 파일 | Markdown 파일 |
| 가격 | 무료 | 월 $16–32 | 무료 | 무료 |
| 셀프호스팅 | ✅ | ❌ | ✅ | ✅ |
| 오픈소스 | ✅ | ❌ | ✅ | ✅ |
| 다중 페이지 타입 | ✅ | ❌ | ❌ | ✅ |
| SEO (JSON-LD, OG) | ✅ | 제한적 | 제한적 | 제한적 |
| ISR / 실시간 동기화 | ✅ | ✅ | ❌ | ❌ |
| 커스텀 도메인 | ✅ | ✅ | ✅ | ✅ |
| 플러그인 생태계 | ✅ | ❌ | ✅ | ✅ |

---

## 다음 단계

- [빠른 시작](./quick-start) — 5분 안에 사이트 스캐폴딩
- [Notion 설정](./notion-setup) — Notion 데이터베이스 구성하기
- [설정](./configuration) — 전체 `noxion.config.ts` 레퍼런스
- [문서 사이트 만들기](./building-docs) — 문서 사이트 설정
- [포트폴리오 만들기](./building-portfolio) — 포트폴리오 설정
- [SEO](./seo) — Noxion이 자동 생성하는 SEO 이해하기
