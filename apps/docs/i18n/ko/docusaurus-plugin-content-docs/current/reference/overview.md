---
sidebar_position: 1
title: API 개요
description: Noxion 패키지 API 레퍼런스 — 모든 익스포트, 타입, 함수
---

# API 레퍼런스

Noxion은 다섯 개의 npm 패키지와 CLI 스캐폴딩 도구로 배포됩니다. 이 섹션은 공개 API 표면과 각 패키지의 상세 레퍼런스로 연결되는 링크를 제공합니다.

---

## 패키지

| 패키지 | 목적 |
|--------|------|
| [`@noxion/core`](./core/config) | 설정, 데이터 페칭, 플러그인 시스템, TypeScript 타입 |
| [`@noxion/notion-renderer`](./notion-renderer/overview) | Notion 블록 렌더러: 30+ 블록 타입, KaTeX SSR, Shiki 구문 강조 |
| [`@noxion/renderer`](./renderer/notion-page) | Notion 콘텐츠 렌더링용 React 컴포넌트 |
| [`@noxion/adapter-nextjs`](./adapter-nextjs/metadata) | Next.js App Router 통합: metadata, JSON-LD, sitemap, robots |
| [`create-noxion`](./cli/create-noxion) | CLI 스캐폴딩 도구 (`bun create noxion`) |

---

## @noxion/core

기반 패키지입니다. 다른 모든 패키지가 이에 의존합니다.

### 설치

```bash
npm install @noxion/core
# 또는
bun add @noxion/core
```

### 익스포트

#### 설정

| 익스포트 | 설명 |
|---------|------|
| [`defineConfig(input)`](./core/config) | 기본값이 적용된 `NoxionConfig` 생성 |
| [`loadConfig()`](./core/config) | 런타임에 `noxion.config.ts`에서 설정 로드 |

#### 데이터 페칭

| 익스포트 | 설명 |
|---------|------|
| [`createNotionClient(options)`](./core/fetcher#createnotionclient) | 인증된 Notion API 클라이언트 생성 |
| [`fetchBlogPosts(client, pageId)`](./core/fetcher#fetchblogposts) | 데이터베이스에서 공개된 모든 포스트 페치 |
| [`fetchCollection(client, collection)`](./core/fetcher#fetchcollection) | 컬렉션 설정에 맞는 공개 페이지 페치 |
| [`fetchAllCollections(client, config)`](./core/fetcher#fetchallcollections) | 모든 컬렉션 페이지를 페치해 단일 배열로 평탄화 |
| [`fetchPostBySlug(client, pageId, slug)`](./core/fetcher#fetchpostbyslug) | slug로 단일 포스트 페치 |
| [`fetchPage(client, pageId)`](./core/fetcher#fetchpage) | Notion 페이지의 전체 `ExtendedRecordMap` 페치 |
| [`fetchAllSlugs(client, pageId)`](./core/fetcher#fetchallslugs) | 공개된 모든 포스트 slug 페치 |

#### Slug 유틸리티

| 익스포트 | 설명 |
|---------|------|
| [`generateSlug(title)`](./core/slug#generateslug) | 제목에서 URL-safe slug 생성 |
| [`parseNotionPageId(input)`](./core/slug#parsenotionpageid) | Notion 페이지 ID를 UUID 형식으로 정규화 |
| [`buildPageUrl(slug)`](./core/slug#buildpageurl) | 페이지 URL에 선행 `/` 보장 |
| [`resolveSlug(post)`](./core/slug#resolveslug) | 포스트 slug를 해석하고 제목 기반 fallback 적용 |

#### 프론트매터

| 익스포트 | 설명 |
|---------|------|
| [`parseFrontmatter(recordMap, pageId)`](./core/frontmatter#parsefrontmatter) | 첫 번째 코드 블록에서 프론트매터 추출 |
| [`parseKeyValuePairs(text)`](./core/frontmatter#parsekeyvaluepairs) | 문자열에서 `key: value` 쌍 파싱 |
| [`applyFrontmatter(page, frontmatter)`](./core/frontmatter#applyfrontmatter) | `NoxionPage`에 프론트매터 오버라이드 적용 |

#### 플러그인 시스템

| 익스포트 | 설명 |
|---------|------|
| [`definePlugin(factory)`](./core/plugins#defineplugin) | 타입 안전 플러그인 팩토리 생성 |
| [`createAnalyticsPlugin(options)`](./core/plugins#createanalyticsplugin) | 내장 분석 플러그인 팩토리 |
| [`createRSSPlugin(options)`](./core/plugins#createrssplugin) | 내장 RSS 플러그인 팩토리 |
| `generateRSSXml(posts, config, options?)` | 블로그 페이지로 RSS 2.0 XML 생성 |
| [`createCommentsPlugin(options)`](./core/plugins#createcommentsplugin) | 내장 댓글 플러그인 팩토리 |

#### 고급 플러그인 런타임

| 익스포트 | 설명 |
|---------|------|
| `loadPlugins(entries)` | 플러그인 엔트리 인스턴스화 및 검증 |
| `executeHook(plugins, hookName, args)` | 비동기 플러그인 라이프사이클 훅 실행 |
| `executeTransformHook(plugins, hookName, initialValue, extraArgs)` | 체이닝 방식의 transform 훅 실행 |
| `executeRegisterPageTypes(plugins, registry)` | 플러그인에서 커스텀 페이지 타입 등록 |
| `executeRouteResolve(plugins, route)` | 플러그인 파이프라인으로 라우트 해석 |
| `executeExtendSlots(plugins, initialSlots)` | 레거시 슬롯 확장 파이프라인 |

#### 타입 (재익스포트)

| 익스포트 | 설명 |
|---------|------|
| [`BlogPost`](./core/types#blogpost) | 정규화된 포스트 데이터 타입 |
| [`NoxionConfig`](./core/types#noxionconfig) | 전체 설정 타입 |
| [`NoxionConfigInput`](./core/types) | `defineConfig()`의 입력 타입 |
| [`ThemeMode`](./core/types) | `"system" \| "light" \| "dark"` |
| [`NoxionPlugin`](./core/plugins) | 플러그인 인터페이스 |
| [`ExtendedRecordMap`](./core/types) | `notion-types`에서 재익스포트 |

---

## @noxion/notion-renderer

저수준 Notion 블록 렌더러입니다. `@noxion/renderer`의 `<NotionPage />`를 구동합니다. 렌더링에 대한 완전한 제어권이 필요하거나, 커스텀 블록 오버라이드를 원하거나, 표준 블로그 레이아웃 외부에 Notion 콘텐츠를 임베드하고 싶을 때 직접 사용하세요.

### 설치

```bash
npm install @noxion/notion-renderer
# 피어 의존성
npm install react notion-types notion-utils
# 또는
bun add @noxion/notion-renderer react notion-types notion-utils
```

**피어 의존성**: `react >= 18.0.0`, `notion-types >= 7.0.0`, `notion-utils >= 7.0.0`

### 설정

```css
/* 전역 CSS에서 스타일 임포트 */
@import '@noxion/notion-renderer/styles';
@import '@noxion/notion-renderer/katex-css'; /* 수식의 경우 */
```

### 메인 컴포넌트

| 익스포트 | 설명 |
|---------|------|
| [`<NotionRenderer />`](./notion-renderer/renderer-api) | 최상위 렌더러 — `ExtendedRecordMap`에서 전체 Notion 페이지 렌더링 |

### 컨텍스트 & 훅

| 익스포트 | 설명 |
|---------|------|
| [`NotionRendererProvider`](./notion-renderer/hooks#notionrendererprovider) | 렌더러 상태를 위한 React 컨텍스트 프로바이더 |
| [`useNotionRenderer()`](./notion-renderer/hooks#usenotionrenderer) | 렌더러 컨텍스트(레코드 맵, URL 매퍼, 테마, 컴포넌트) 접근 |
| [`useNotionBlock(blockId)`](./notion-renderer/hooks) | 레코드 맵에서 ID로 블록 조회 및 언래핑 |

### 블록 컴포넌트

30개 이상의 개별 익스포트 블록 컴포넌트. 전체 레퍼런스는 [블록 컴포넌트](./notion-renderer/blocks)를 참조하세요.

| 익스포트 | Notion 블록 타입 |
|---------|----------------|
| `TextBlock` | `text` |
| `HeadingBlock` | `header`, `sub_header`, `sub_sub_header` |
| `BulletedListBlock` | `bulleted_list` |
| `NumberedListBlock` | `numbered_list` |
| `ToDoBlock` | `to_do` |
| `QuoteBlock` | `quote` |
| `CalloutBlock` | `callout` |
| `DividerBlock` | `divider` |
| `ToggleBlock` | `toggle` |
| `PageBlock` | `page` |
| `EquationBlock` | `equation` |
| `CodeBlock` | `code` |
| `ImageBlock` | `image` |
| `VideoBlock` | `video` |
| `AudioBlock` | `audio` |
| `EmbedBlock` | `embed`, `gist`, `figma`, `tweet`, `maps` 등 |
| `BookmarkBlock` | `bookmark` |
| `FileBlock` | `file` |
| `PdfBlock` | `pdf` |
| `TableBlock` | `table` |
| `ColumnListBlock` | `column_list` |
| `ColumnBlock` | `column` |
| `TableOfContentsBlock` | `table_of_contents` |

### 인라인 컴포넌트

| 익스포트 | 설명 |
|---------|------|
| [`<Text />`](./notion-renderer/components) | 리치 텍스트 렌더러 — 모든 인라인 데코레이션 (굵기, 기울임, 링크, 색상, 인라인 수식) |
| [`<InlineEquation />`](./notion-renderer/components) | 인라인 KaTeX 수식 |

### Shiki

| 익스포트 | 설명 |
|---------|------|
| [`createShikiHighlighter(options?)`](./notion-renderer/shiki#createshikihighlighter) | 듀얼 테마 Shiki 기반 `HighlightCodeFn` 생성 |
| [`normalizeLanguage(lang)`](./notion-renderer/shiki#normalizelanguage) | Notion 언어명을 Shiki 언어 ID로 매핑 |

### 유틸리티

| 익스포트 | 설명 |
|---------|------|
| [`formatNotionDate(dateValue)`](./notion-renderer/utils#formatnotiondate) | Notion 날짜 객체를 읽기 쉬운 문자열로 형식화 |
| [`unwrapBlockValue(record)`](./notion-renderer/utils#unwrapblockvalue) | `{ role, value }` 레코드 맵 래퍼 언래핑 |
| [`getBlockTitle(block)`](./notion-renderer/utils#getblocktitle) | 블록에서 일반 텍스트 제목 추출 |
| [`cs(...classes)`](./notion-renderer/utils#cs) | 조건부 클래스명 결합기 |

---

## @noxion/renderer

Notion 콘텐츠와 블로그 UI 렌더링을 위한 React UI 컴포넌트 및 테마 시스템입니다.

### 설치

```bash
npm install @noxion/renderer react react-dom
# 또는
bun add @noxion/renderer react react-dom
```

**피어 의존성**: `react >= 18.0.0`, `react-dom >= 18.0.0`

### 컴포넌트

| 익스포트 | 설명 |
|---------|------|
| [`<NotionPage />`](./renderer/notion-page) | 전체 Notion 페이지 렌더링 — Shiki, 다크 모드, 이미지 URL 매핑이 포함된 `<NotionRenderer />` 래퍼 |
| `<NoxionLogo />` | Noxion 로고 컴포넌트 |
### 훅

| 익스포트 | 설명 |
|---------|------|
| [`useThemePreference()`](./renderer/theme-provider#usethemepreference) | 사용자의 테마 설정 반환 및 제어 (라이트/다크/시스템) |
| `useSearch()` | 검색 훅 |

### 타입

| 익스포트 | 설명 |
|---------|------|
| `NoxionTheme`, `NoxionThemeTokens` | 테마 토큰/타입 정의 |
| `NoxionSlotMap`, `NoxionTemplateMap`, `NoxionTemplateProps`, `NoxionLayoutProps` | 레이아웃/템플릿 조합 타입 |
| `NoxionThemeMetadata` | 테마 패키지 메타데이터 형태 |
| `PostCardProps`, `PostListProps`, `HeaderProps`, `FooterProps` 등 | 컴포넌트 prop 타입 (테마 저작자를 위해 여전히 익스포트됨) |

---

## @noxion/adapter-nextjs

SEO, 메타데이터, 구조화된 데이터, 정적 생성을 위한 Next.js App Router 통합 유틸리티입니다.

### 설치

```bash
npm install @noxion/adapter-nextjs @noxion/core
# 또는
bun add @noxion/adapter-nextjs @noxion/core
```

**피어 의존성**: `next >= 15.0.0`

### 메타데이터

| 익스포트 | 설명 |
|---------|------|
| [`generateNoxionMetadata(post, config)`](./adapter-nextjs/metadata#generatenoxionmetadata) | 포스트 페이지용 Next.js `Metadata` 생성 |
| [`generateNoxionListMetadata(config)`](./adapter-nextjs/metadata#generatenoxionlistmetadata) | 홈페이지용 Next.js `Metadata` 생성 |

### 구조화된 데이터 (JSON-LD)

| 익스포트 | 설명 |
|---------|------|
| [`generateBlogPostingLD(post, config)`](./adapter-nextjs/structured-data#generateblogpostingld) | `BlogPosting` JSON-LD 스키마 |
| [`generateBreadcrumbLD(post, config)`](./adapter-nextjs/structured-data#generatebreadcrumbld) | `BreadcrumbList` JSON-LD 스키마 |
| [`generateWebSiteLD(config)`](./adapter-nextjs/structured-data#generatewebsiteld) | `WebSite` + `SearchAction` JSON-LD 스키마 |
| [`generateCollectionPageLD(posts, config)`](./adapter-nextjs/structured-data#generatecollectionpageld) | `CollectionPage` + `ItemList` JSON-LD 스키마 |

### 사이트맵 & Robots

| 익스포트 | 설명 |
|---------|------|
| [`generateNoxionSitemap(posts, config)`](./adapter-nextjs/sitemap#generatenoxionsitemap) | `MetadataRoute.Sitemap` 항목 생성 |
| [`generateNoxionRobots(config)`](./adapter-nextjs/sitemap#generatenoxionrobots) | `MetadataRoute.Robots` 생성 |
| [`generateNoxionStaticParams(client, pageId)`](./adapter-nextjs/sitemap#generatenoxionstaticparams) | `generateStaticParams()`용 `{ slug: string }[]` 생성 |

### 라우팅

| 익스포트 | 설명 |
|---------|------|
| [`generateNoxionRoutes(config)`](./adapter-nextjs/sitemap#generatenoxionroutes) | 컬렉션 기반 라우트 설정 생성 |
| [`resolvePageType(path, routes)`](./adapter-nextjs/sitemap#resolvepagetype) | URL 경로에서 라우트 설정 해석 |
| [`buildPageUrl(page, routes)`](./adapter-nextjs/sitemap#buildpageurl) | 라우트 접두사를 반영한 URL 생성 |
| [`generateStaticParamsForRoute(pages, route)`](./adapter-nextjs/sitemap#generatestaticparamsforroute) | 특정 라우트 타입의 static params 생성 |

### 재검증 & 웹훅

| 익스포트 | 설명 |
|---------|------|
| [`createRevalidateHandler(options)`](./adapter-nextjs/revalidation#createrevalidatehandler) | 온디맨드 ISR 재검증 라우트 핸들러 |
| [`createNotionWebhookHandler(options)`](./adapter-nextjs/revalidation#createnotionwebhookhandler) | 서명 검증이 포함된 Notion 웹훅 핸들러 |

---

## 의존성 그래프

```
@noxion/adapter-nextjs
    └── @noxion/core
            └── notion-client (비공식 Notion API)
            └── notion-utils  (유틸리티)
            └── notion-types  (TypeScript 타입)

@noxion/renderer
    └── @noxion/notion-renderer (Notion 블록 렌더링)
            └── katex     (수식 SSR)
            └── shiki     (구문 강조)
    └── notion-types
    └── notion-utils
```

이것이 유일한 주요 런타임 의존성입니다. Noxion은 의도적으로 의존성 트리를 작게 유지합니다. `@noxion/notion-renderer` 패키지는 이전의 `react-notion-x` 의존성을 대체하여 렌더링과 스타일링을 완전히 제어할 수 있게 합니다.

---

## 버전 관리

모든 Noxion 패키지는 [시맨틱 버저닝](https://semver.org/)을 따릅니다. 호환성 보장을 위해 패키지들은 함께 버전 관리됩니다(모든 패키지에 동일한 major/minor 버전). 업그레이드 시 모든 `@noxion/*` 패키지를 동일한 버전으로 동시에 업데이트하세요.
