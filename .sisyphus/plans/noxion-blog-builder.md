# Noxion — Notion-Powered SEO Blog Builder

## TL;DR

> **Quick Summary**: Notion을 CMS로 활용하여 SEO-friendly한 블로그 웹사이트를 빌드하는 self-hosted 오픈소스 도구. 플러그인 시스템 + 테마 시스템으로 확장 가능. 모노레포 구조의 npm 패키지 + CLI 스캐폴딩으로 배포.
>
> **Deliverables**:
> - `@noxion/core` — Notion 데이터 페칭, 이미지 다운로더, 설정 파서, **Plugin 시스템 코어**
> - `@noxion/renderer` — React 렌더링 컴포넌트 (react-notion-x wrapper + **Theme 시스템**)
> - `@noxion/adapter-nextjs` — Next.js App Router 통합 (SEO, ISR, 라우팅 헬퍼, **Plugin Hook 통합**)
> - `create-noxion` — CLI 스캐폴딩 도구
> - `apps/web` — 데모/예제 블로그 앱
>
> **Estimated Effort**: XL (15 tasks across 6 waves)
> **Parallel Execution**: YES - 6 waves
> **Critical Path**: T1 → T3 → T13 → T6 → T10 → T12

---

## Context

### Original Request
super.so나 oopy.io처럼 Notion을 CMS 삼아 SEO-friendly한 웹페이지를 빌드하는 서비스. npm package 혹은 template 형식으로 누구든 self-hosting 할 수 있도록.

### Interview Summary
**Key Discussions**:
- MVP Scope: 블로그 우선, 확장 가능한 구조
- Architecture: 프레임워크 독립적 코어 + 어댑터 패턴 (Next.js 우선, Astro 추후)
- API: 비공식 Notion API (notion-client) — react-notion-x 네이티브 호환
- Distribution: CLI 스캐폴딩 (`npm create noxion`)
- Monorepo: Turborepo + Bun
- Styling: Tailwind CSS (react-notion-x CSS 위에)
- Images: 빌드 시 다운로드 + 로컬 서빙 (URL 만료 문제 해결)
- Testing: TDD with `bun test`
- Deploy: Vercel / Static Export / Docker 모두 지원
- Runtime/Tooling: Bun 전면 채용 (패키지 매니저, 테스트 러너, 런타임)

**Research Findings**:
- `react-notion-x` (5.3k★, v7.8.1, MIT, 2026-02-14 최신 릴리즈)가 Notion 렌더링 사실상 표준
- `notion-client` (비공식 API)는 Public 페이지에 토큰 불필요, react-notion-x와 네이티브 호환
- `nextjs-notion-starter-kit`의 `site.config.ts` 패턴 (rootNotionPageId, domain 등)이 검증됨
- Notion 이미지 URL은 presigned S3 URL로 ~1시간 후 만료 → 빌드 시 다운로드로 해결
- `notion-compat` 브릿지가 공식↔비공식 API 변환을 제공하지만, 이번 프로젝트에서는 비공식 API 직접 사용
- NotCMS, notehost, nooxy 등 유사 프로젝트 존재하나 완성도/범위가 다름

### Gap Analysis (Self-Review, Metis unavailable)
**Identified Gaps** (addressed in plan):
1. Notion DB 스키마 미정의 → 기본 스키마 제안 (title, slug, date, tags, category, cover, published)
2. npm scope 미결정 → `@noxion/*` 사용
3. Private 페이지 접근 → 환경변수 NOTION_TOKEN으로 선택적 지원
4. 빌드 시 이미지 다운로드 실패 핸들링 → fallback URL 전략 포함
5. Non-Latin 슬러그 (한국어 등) → slugify with transliteration or raw encoding
6. 빈 데이터베이스 → 빈 상태 UI 포함

---

## Work Objectives

### Core Objective
Notion 데이터베이스를 블로그 CMS로 활용하여 SEO 최적화된 정적/ISR 블로그 사이트를 생성하는 모노레포 도구 세트를 구축한다.

### Concrete Deliverables
- `@noxion/core` npm 패키지 (데이터 페칭 + 이미지 + 설정)
- `@noxion/renderer` npm 패키지 (React 컴포넌트 + 테마)
- `@noxion/adapter-nextjs` npm 패키지 (Next.js App Router 통합)
- `create-noxion` npm 패키지 (CLI 스캐폴딩)
- `apps/web` 데모 블로그 앱 (동작하는 예제)
- 배포 가이드 (Vercel, Static Export, Docker)

### Definition of Done
- [ ] `bun create noxion my-blog`으로 새 프로젝트 생성 가능
- [ ] 생성된 프로젝트에서 Notion 페이지 ID만 설정하면 블로그 동작
- [ ] Lighthouse SEO 점수 90+ (메타태그, sitemap, robots.txt, JSON-LD)
- [ ] 다크모드 토글 동작
- [ ] 코드 블록 신택스 하이라이팅 동작
- [ ] TOC 자동 생성
- [ ] 태그/카테고리 필터링 동작
- [ ] 클라이언트 사이드 검색 동작
- [ ] 빌드 시 이미지 다운로드 + 로컬 서빙 동작
- [ ] 플러그인 시스템으로 Analytics/RSS/Comments 활성화 가능
- [ ] defineTheme으로 색상/폰트/간격 커스터마이징 가능
- [ ] ComponentOverrides로 기본 컴포넌트 교체 가능
- [ ] `bun test` 전체 통과
- [ ] Vercel, Static Export, Docker 배포 가능

### Must Have
- Notion 데이터베이스 → 블로그 포스트 목록 변환
- Notion 페이지 → 풀 렌더링 (react-notion-x 기반)
- SSG + ISR 지원 (Next.js generateStaticParams + revalidate)
- 이미지 URL 만료 문제 해결 (빌드 시 다운로드)
- `noxion.config.ts` 기반 설정 시스템

### Must NOT Have (Guardrails)
- react-notion-x를 대체하는 커스텀 Notion 블록 렌더러 만들지 않음
- 멀티 테마 프리셋 배포 안 함 (하나의 기본 테마, defineTheme + CSS 변수로 커스터마이징 가능)
- Full-text 검색 인덱서 만들지 않음 (클라이언트 사이드 title/tag 기반 필터링)
- Notion Database views (collection views) 렌더링은 MVP 범위 아님
- 자체 댓글 시스템 구축 안 함 (Giscus/Utterances/Disqus embed 플러그인으로 대체)
- 자체 Analytics 구축 안 함 (GA/Plausible/Umami 스크립트 주입 플러그인으로 대체)
- i18n, 인증/비밀번호 보호 포함하지 않음
- 플러그인 간 의존성 그래프 없음 (단순 순차 실행)
- Webpack/Vite 빌드 도구 설정 변경 훅 없음 (프레임워크 독립적 유지)
- CSS-in-JS 런타임 없음 (정적 CSS 변수만 사용)
- 과도한 추상화 — 각 패키지는 명확한 단일 책임

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (새 프로젝트)
- **User wants tests**: TDD
- **Framework**: bun test (Jest 호환 API)

### TDD 적용 범위

| 패키지 | TDD 적용 | 검증 방식 |
|--------|---------|---------|
| @noxion/core | ✅ 전면 TDD | bun test — 데이터 페칭, 이미지 다운로드, 설정 파싱 |
| @noxion/renderer | ⚠️ 부분 TDD | bun test — 유틸리티 함수만. React 컴포넌트는 빌드 확인 + 브라우저 수동 검증 |
| @noxion/adapter-nextjs | ⚠️ 부분 TDD | bun test — 메타데이터 생성, 유틸리티. 라우팅은 통합 테스트 |
| create-noxion | ✅ 전면 TDD | bun test — 스캐폴딩 로직, 파일 생성, 템플릿 처리 |
| apps/web | ❌ | 빌드 성공 확인 + Playwright 브라우저 검증 |

### TDD Task Structure
각 TDD 대상 태스크는:
1. **RED**: 실패하는 테스트 먼저 작성
2. **GREEN**: 테스트 통과하는 최소 구현
3. **REFACTOR**: 코드 정리 (테스트 여전히 통과)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── T1: Monorepo Foundation Setup
└── T2: @noxion/core — Config System + Types

Wave 2 (After Wave 1):
├── T3: @noxion/core — Notion Client + Data Fetchers
├── T4: @noxion/core — Image Download Pipeline
└── T5: @noxion/core — URL/Slug Utilities

Wave 3 (After Wave 2) — Plugin & Theme Architecture:
├── T13: @noxion/core — Plugin System Architecture (lifecycle hooks, loader, executor)
└── T14: @noxion/renderer — Theme System Architecture (CSS vars, component overrides, layout)

Wave 4 (After Wave 3) — Components & SEO:
├── T6: @noxion/renderer — NotionPage + react-notion-x Integration (with Theme integration)
├── T7: @noxion/renderer — Blog UI Components (overridable via Theme)
├── T8: @noxion/renderer — Interactive Components (Theme Toggle, TOC, Search)
├── T9: @noxion/adapter-nextjs — SEO Utilities (with Plugin hook integration)
└── T15: Built-in Plugins (Analytics, RSS, Comments)

Wave 5 (After Wave 4):
├── T10: apps/web — Demo Blog Application (with plugins + theme demo)
└── T11: Deploy Configs (Vercel, Static, Docker)

Wave 6 (After Wave 5):
└── T12: create-noxion — CLI Scaffolding Tool

Critical Path: T1 → T3 → T13 → T6 → T10 → T12
Parallel Speedup: ~50% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|-----------|--------|---------------------|
| T1 | None | T2,T3,T4,T5 | T2 |
| T2 | None | T3,T4,T5,T6,T9 | T1 |
| T3 | T1,T2 | T6,T7,T10 | T4, T5 |
| T4 | T1,T2 | T10 | T3, T5 |
| T5 | T1,T2 | T9,T10 | T3, T4 |
| T13 | T3 | T6,T7,T9,T15 | T14 |
| T14 | T3 | T6,T7,T8 | T13 |
| T6 | T13,T14 | T10 | T7, T8, T9, T15 |
| T7 | T13,T14 | T10 | T6, T8, T9, T15 |
| T8 | T14 | T10 | T6, T7, T9, T15 |
| T9 | T5,T13 | T10 | T6, T7, T8, T15 |
| T15 | T13 | T10 | T6, T7, T8, T9 |
| T10 | T6,T7,T8,T9,T15 | T11,T12 | T11 |
| T11 | T10 | T12 | T10 (partial) |
| T12 | T10 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Dispatch |
|------|-------|---------------------|
| 1 | T1, T2 | 2x parallel: delegate_task(category="unspecified-high") |
| 2 | T3, T4, T5 | 3x parallel: delegate_task(category="unspecified-high") |
| 3 | T13, T14 | 2x parallel: delegate_task(category="ultrabrain") — 아키텍처 설계 중심 |
| 4 | T6, T7, T8, T9, T15 | 5x parallel: T6,T7=visual-engineering, T8=visual-engineering, T9=unspecified-high, T15=unspecified-high |
| 5 | T10, T11 | 2x parallel: T10=visual-engineering, T11=quick |
| 6 | T12 | 1x: delegate_task(category="unspecified-high") |

---

## TODOs

---

- [x] 1. Monorepo Foundation Setup

  **What to do**:
  - Turborepo + Bun workspaces 모노레포 초기화
  - Root `package.json` (workspaces 설정)
  - `turbo.json` (build, test, lint 파이프라인)
  - `bunfig.toml` (Bun 설정)
  - 공유 TypeScript config (`tsconfig.base.json`)
  - ESLint + Prettier 공유 설정
  - `.gitignore` 설정
  - 4개 패키지 디렉토리 스캐폴드: `packages/core`, `packages/renderer`, `packages/adapter-nextjs`, `packages/create-noxion`
  - 1개 앱 디렉토리: `apps/web`
  - 각 패키지별 `package.json` 초기화 (이름, 버전, main/types 엔트리포인트)
  - 각 패키지별 `tsconfig.json` (tsconfig.base.json 확장)
  - `bun install` 성공 확인
  - `turbo build` 빈 빌드 성공 확인

  **Must NOT do**:
  - 패키지 내부 소스 코드 작성 (구조만 잡음)
  - 불필요한 devDependencies 추가
  - nx, lerna 등 다른 모노레포 도구 사용

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 인프라/설정 중심 작업. 프레임워크 독립적 구조 작업
  - **Skills**: [`git-master`]
    - `git-master`: 초기 커밋 관리
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: UI 작업 없음
    - `playwright`: 브라우저 작업 없음

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T2)
  - **Blocks**: T3, T4, T5 (모든 패키지가 이 구조 필요)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `transitive-bullshit/nextjs-notion-starter-kit` — `site.config.ts`, `lib/config.ts` 패턴 참고 (https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
  - Turborepo 공식 모노레포 구조: `turbo.json`, workspace 설정 패턴

  **External References**:
  - Turborepo docs: https://turbo.build/repo/docs — 모노레포 설정 가이드
  - Bun workspaces: https://bun.sh/docs/install/workspaces — Bun workspace 설정
  - TypeScript project references: https://www.typescriptlang.org/docs/handbook/project-references.html

  **WHY Each Reference Matters**:
  - nextjs-notion-starter-kit: 검증된 Notion 프로젝트 설정 패턴 확인
  - Turborepo docs: turbo.json pipeline 설정, 캐시 전략
  - Bun workspaces: bunfig.toml과 workspace 프로토콜 사용법

  **Acceptance Criteria**:

  ```bash
  # 디렉토리 구조 확인
  ls packages/core/package.json packages/renderer/package.json packages/adapter-nextjs/package.json packages/create-noxion/package.json apps/web/package.json
  # Assert: 모든 파일 존재

  # Bun 설치 확인
  bun install
  # Assert: exit code 0, bun.lockb 생성

  # Turborepo 빌드 파이프라인 확인
  bunx turbo build
  # Assert: exit code 0 (빈 빌드 성공)

  # TypeScript 설정 확인
  bunx tsc --noEmit -p packages/core/tsconfig.json
  # Assert: exit code 0

  # 패키지 이름 확인
  bun -e "const p = require('./packages/core/package.json'); console.log(p.name)"
  # Assert: Output is "@noxion/core"
  ```

  **Commit**: YES
  - Message: `chore: initialize monorepo with Turborepo + Bun workspaces`
  - Files: `package.json`, `turbo.json`, `bunfig.toml`, `tsconfig.base.json`, `.gitignore`, `packages/*/package.json`, `packages/*/tsconfig.json`, `apps/web/package.json`
  - Pre-commit: `bun install && bunx turbo build`

---

- [x] 2. @noxion/core — Config System + Types

  **What to do**:
  - `packages/core/src/types.ts` — 공유 타입 정의:
    - `NoxionConfig` (사이트 설정): rootNotionPageId, rootNotionSpaceId?, name, domain, author, description, language, defaultTheme, revalidate? (ISR 주기, 기본 3600초), revalidateSecret? (on-demand revalidation용 시크릿), plugins? (T13에서 확장), theme? (T14에서 확장), layout? (T14에서 확장), components? (T14에서 확장)
    - `BlogPost` (블로그 포스트 메타): id, title, slug, date, tags, category, coverImage, published, lastEditedTime
    - `NoxionPageData` (페이지 데이터): recordMap (ExtendedRecordMap), post metadata
  - `packages/core/src/config.ts` — 설정 파서:
    - `defineConfig()` 함수 (타입 안전한 설정 헬퍼)
    - `loadConfig()` 함수 (noxion.config.ts 로드 + 유효성 검사)
    - 기본값 처리 (defaultTheme: 'system', language: 'en')
  - `packages/core/src/index.ts` — 패키지 엔트리포인트
  - TDD: 각 함수에 대한 테스트 작성
    - `defineConfig()` 타입 검증
    - `loadConfig()` 기본값 적용 확인
    - 필수 필드 누락 시 에러

  **Must NOT do**:
  - Notion API 호출 코드 (T3에서 구현)
  - React 컴포넌트 (renderer 영역)
  - Zod 등 무거운 유효성 검사 라이브러리 추가 (TypeScript로 충분)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 타입 시스템 + 설정 파서. 순수 TypeScript 로직
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: UI 작업 없음

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1)
  - **Blocks**: T3, T4, T5, T6, T9 (타입 정의가 모든 패키지에서 사용됨)
  - **Blocked By**: None (can start immediately, but needs T1 directory structure — can be done sequentially within the same agent)

  **References**:

  **Pattern References**:
  - `transitive-bullshit/nextjs-notion-starter-kit/lib/site-config.ts` — SiteConfig 인터페이스 패턴: rootNotionPageId, domain, author 등 (https://github.com/transitive-bullshit/nextjs-notion-starter-kit/blob/main/lib/site-config.ts)
  - `transitive-bullshit/nextjs-notion-starter-kit/site.config.ts` — siteConfig() 함수 호출 패턴 (https://github.com/transitive-bullshit/nextjs-notion-starter-kit/blob/main/site.config.ts)

  **API/Type References**:
  - `notion-types` npm 패키지 — `ExtendedRecordMap` 타입 (react-notion-x의 recordMap 형식)

  **External References**:
  - notion-types: https://github.com/NotionX/react-notion-x/tree/master/packages/notion-types — ExtendedRecordMap 등 타입 정의
  - Bun test docs: https://bun.sh/docs/cli/test — bun test 사용법

  **WHY Each Reference Matters**:
  - nextjs-notion-starter-kit의 SiteConfig: 검증된 설정 구조. 우리 NoxionConfig의 기초
  - notion-types: ExtendedRecordMap 타입을 re-export해야 하므로 의존성 파악 필요
  - bun test: TDD 워크플로 설정

  **Acceptance Criteria**:

  **TDD:**
  - [ ] Test file: `packages/core/src/__tests__/config.test.ts`
  - [ ] Tests cover: defineConfig 반환값 구조, loadConfig 기본값 적용, 필수 필드 누락 에러
  - [ ] `bun test packages/core` → PASS

  **Automated Verification:**
  ```bash
  # 타입 체크
  bunx tsc --noEmit -p packages/core/tsconfig.json
  # Assert: exit code 0

  # 테스트 실행
  bun test packages/core
  # Assert: All tests pass

  # 엔트리포인트 임포트 확인
  bun -e "import { defineConfig } from './packages/core/src/index.ts'; console.log(typeof defineConfig)"
  # Assert: Output is "function"
  ```

  **Commit**: YES
  - Message: `feat(core): add config system and shared types`
  - Files: `packages/core/src/**`
  - Pre-commit: `bun test packages/core`

---

- [x] 3. @noxion/core — Notion Client + Data Fetchers

  **What to do**:
  - `packages/core/src/client.ts` — Notion 클라이언트 래퍼:
    - `createNotionClient(config?)` — NotionAPI 인스턴스 생성 (선택적 authToken 지원)
    - 래퍼 이유: notion-client 직접 노출 대신 설정 기반 초기화 + 에러 핸들링
  - `packages/core/src/fetcher.ts` — 데이터 페칭 함수들:
    - `fetchBlogPosts(notionClient, databasePageId)` — Notion DB에서 블로그 포스트 목록 가져오기
      - DB의 collection에서 포스트 메타데이터 추출 (title, slug, date, tags, category, cover, published)
      - published 필터링 (published === true인 것만)
      - 날짜 기준 정렬
    - `fetchPage(notionClient, pageId)` — 개별 Notion 페이지 가져오기 (ExtendedRecordMap 반환)
    - `fetchAllSlugs(notionClient, databasePageId)` — 모든 슬러그 목록 (generateStaticParams용)
    - `fetchPostBySlug(notionClient, databasePageId, slug)` — 슬러그로 포스트 찾기
  - TDD: mock notion-client 사용
    - fetchBlogPosts: 올바른 포스트 목록 반환, published 필터링, 날짜 정렬
    - fetchPage: ExtendedRecordMap 반환
    - fetchAllSlugs: 슬러그 배열 반환
    - 에러 핸들링 (네트워크 에러, 잘못된 pageId)

  **Must NOT do**:
  - notion-client의 내부 API를 직접 호출하는 커스텀 HTTP 클라이언트 만들기
  - Notion 공식 API (@notionhq/client) 사용 — 비공식 API (notion-client) 사용
  - 이미지 처리 (T4에서)
  - 캐싱 레이어 (MVP 범위 밖)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: API 통합 + 데이터 변환. 순수 TypeScript 로직
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T4, T5)
  - **Blocks**: T6, T7, T10 (렌더러와 앱이 데이터 페칭에 의존)
  - **Blocked By**: T1 (디렉토리 구조), T2 (타입 정의)

  **References**:

  **Pattern References**:
  - `NotionX/react-notion-x/examples/full/lib/notion.ts` — notion-client 사용 패턴: `const notion = new NotionAPI(); const recordMap = await notion.getPage(pageId)` (https://github.com/NotionX/react-notion-x/blob/master/examples/full/lib/notion.ts)
  - `morethanmin/morethan-log/src/apis/notion-client/getPosts.ts` — DB에서 포스트 목록 추출: collection schema 접근, block 순회, properties 추출 (https://github.com/morethanmin/morethan-log/blob/main/src/apis/notion-client/getPosts.ts)
  - `morethanmin/morethan-log/src/apis/notion-client/getRecordMap.ts` — 단순 getPage 래퍼 (https://github.com/morethanmin/morethan-log/blob/main/src/apis/notion-client/getRecordMap.ts)

  **API/Type References**:
  - `notion-client` npm — `NotionAPI` 클래스, `getPage(pageId)` 메서드
  - `notion-types` npm — `ExtendedRecordMap`, `CollectionPropertySchemaMap`, `BlockMap`
  - `notion-utils` npm — `getPageTitle()`, `idToUuid()`, `getTextContent()`, `getPageProperties()`

  **External References**:
  - react-notion-x packages overview: https://github.com/NotionX/react-notion-x#packages — notion-client, notion-types, notion-utils 설명
  - Notion 비공식 API 분석: https://www.pynotion.com/official-vs-unnofficial-api/ — 공식 vs 비공식 API 차이

  **WHY Each Reference Matters**:
  - react-notion-x examples: NotionAPI 초기화 및 getPage 호출의 정확한 패턴
  - morethan-log: Notion DB에서 블로그 포스트 목록을 추출하는 실전 검증된 방법 (collection, schema, properties 접근)
  - notion-utils: getPageTitle, idToUuid 등 유틸리티 함수를 직접 만들 필요 없이 활용

  **Acceptance Criteria**:

  **TDD:**
  - [ ] Test file: `packages/core/src/__tests__/fetcher.test.ts`
  - [ ] Tests cover: fetchBlogPosts (목록, 필터링, 정렬), fetchPage (recordMap), fetchAllSlugs, 에러 핸들링
  - [ ] `bun test packages/core` → PASS

  **Automated Verification:**
  ```bash
  bun test packages/core
  # Assert: All tests pass (including new fetcher tests)

  bunx tsc --noEmit -p packages/core/tsconfig.json
  # Assert: exit code 0
  ```

  **Commit**: YES
  - Message: `feat(core): add Notion client wrapper and data fetchers`
  - Files: `packages/core/src/client.ts`, `packages/core/src/fetcher.ts`, `packages/core/src/__tests__/fetcher.test.ts`
  - Pre-commit: `bun test packages/core`

---

- [ ] 4. @noxion/core — Image Download Pipeline

  **What to do**:
  - `packages/core/src/image-downloader.ts` — 빌드 시 이미지 다운로드:
    - `downloadImages(recordMap, outputDir)` — ExtendedRecordMap에서 모든 이미지 URL 추출 후 다운로드
    - Notion presigned S3 URL 파싱 (secure.notion-static.com, S3 URL 패턴)
    - 이미지를 `{outputDir}/images/{hash}.{ext}` 로 저장 (URL hash로 파일명 생성, 중복 방지)
    - 다운로드 실패 시 원본 URL fallback (recordMap 변경 없이 반환)
    - 동시 다운로드 제한 (concurrency limit: 5)
    - 진행상황 콜백 (optional onProgress)
    - 반환값: URL 매핑 맵 `Record<originalUrl, localPath>`
  - `packages/core/src/image-mapper.ts` — recordMap 내 이미지 URL 교체:
    - `mapImages(recordMap, urlMap)` — recordMap 내 모든 이미지 URL을 로컬 경로로 교체
    - block.format.page_cover, block.properties.source 등의 이미지 필드 처리
  - TDD:
    - URL 추출: 다양한 block 타입에서 이미지 URL 정확히 추출
    - 파일명 해싱: 동일 URL은 같은 파일명, 다른 URL은 다른 파일명
    - 다운로드 실패 fallback: 실패 시 원본 URL 유지
    - URL 매핑: recordMap 내 URL이 올바르게 교체됨

  **Must NOT do**:
  - 이미지 리사이징/최적화 (Next.js의 Image Optimization에 위임)
  - 영구적 이미지 캐시 서버 구축
  - Cloudflare Workers 프록시 (별도 인프라 불필요)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: I/O 중심 + 데이터 변환 로직
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T3, T5)
  - **Blocks**: T10 (데모 앱이 이미지 파이프라인 사용)
  - **Blocked By**: T1 (디렉토리), T2 (타입)

  **References**:

  **Pattern References**:
  - `alexmacarthur/cloudflare-image-proxying` — Notion 이미지 프록시 패턴. presigned URL 구조 파악 (https://github.com/alexmacarthur/cloudflare-image-proxying)
  - `transitive-bullshit/nextjs-notion-starter-kit/lib/map-image-url.ts` — mapImageUrl 패턴 (Notion 이미지 URL 변환)

  **Documentation References**:
  - Notion File Object 문서: https://developers.notion.com/reference/file-object — Notion 이미지 URL 구조 (presigned, file_upload, external)
  - Alex MacArthur 블로그: https://macarthur.me/posts/serving-notion-presigned-images-with-cloudflare — Notion presigned 이미지 문제와 해결 방법

  **WHY Each Reference Matters**:
  - cloudflare-image-proxying: Notion presigned URL의 구조와 만료 메커니즘 이해
  - nextjs-notion-starter-kit의 map-image-url: recordMap 내 이미지 URL을 변환하는 패턴
  - Notion File Object 문서: file 타입별 URL 형식 이해 (file vs file_upload vs external)

  **Acceptance Criteria**:

  **TDD:**
  - [ ] Test file: `packages/core/src/__tests__/image-downloader.test.ts`
  - [ ] Tests cover: URL 추출, 해시 파일명, 다운로드 성공, 실패 fallback, URL 매핑
  - [ ] `bun test packages/core` → PASS

  **Automated Verification:**
  ```bash
  bun test packages/core
  # Assert: All tests pass

  bunx tsc --noEmit -p packages/core/tsconfig.json
  # Assert: exit code 0
  ```

  **Commit**: YES
  - Message: `feat(core): add build-time image download pipeline`
  - Files: `packages/core/src/image-downloader.ts`, `packages/core/src/image-mapper.ts`, tests
  - Pre-commit: `bun test packages/core`

---

- [ ] 5. @noxion/core — URL/Slug Utilities

  **What to do**:
  - `packages/core/src/slug.ts` — URL/슬러그 유틸리티:
    - `generateSlug(title)` — 제목에서 URL-safe 슬러그 생성
      - 영문: kebab-case 변환 (e.g., "Hello World" → "hello-world")
      - 한국어/CJK: URL-safe 인코딩 또는 그대로 유지 (e.g., "안녕하세요" → "안녕하세요")
      - 특수문자 제거, 공백→하이픈, 연속 하이픈 병합
    - `parseNotionPageId(idOrUrl)` — Notion 페이지 ID/URL에서 ID 추출 (notion-utils의 parsePageId 래핑)
    - `buildPageUrl(slug, config)` — 슬러그에서 최종 URL 생성
    - `resolveSlug(post)` — BlogPost에서 슬러그 결정 (명시적 slug 프로퍼티 > 타이틀에서 자동 생성)
  - TDD:
    - 영문 슬러그 생성
    - 한국어 슬러그 생성
    - 특수문자 처리
    - Notion URL/ID 파싱
    - 슬러그 우선순위 (명시적 > 자동)

  **Must NOT do**:
  - 라우팅 로직 (adapter-nextjs 영역)
  - URL rewrite/redirect 규칙

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 순수 유틸리티 함수. 단순 문자열 변환
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T3, T4)
  - **Blocks**: T9 (SEO 유틸리티에서 URL 빌드 사용), T10
  - **Blocked By**: T1 (디렉토리), T2 (타입)

  **References**:

  **Pattern References**:
  - `notion-utils` npm — `parsePageId()` 함수 패턴
  - `transitive-bullshit/nextjs-notion-starter-kit/lib/config.ts:23-37` — pageUrlOverrides, pageUrlAdditions 패턴

  **External References**:
  - notion-utils source: https://github.com/NotionX/react-notion-x/tree/master/packages/notion-utils — parsePageId, idToUuid 등

  **WHY Each Reference Matters**:
  - notion-utils: parsePageId를 래핑하므로 원본 동작 확인 필요
  - nextjs-notion-starter-kit: URL 오버라이드 패턴의 실전 사용 예

  **Acceptance Criteria**:

  **TDD:**
  - [ ] Test file: `packages/core/src/__tests__/slug.test.ts`
  - [ ] Tests cover: 영문 slugify, 한국어 slugify, 특수문자, parsePageId, resolveSlug
  - [ ] `bun test packages/core` → PASS

  **Automated Verification:**
  ```bash
  bun test packages/core
  # Assert: All tests pass

  bun -e "import { generateSlug } from './packages/core/src/slug.ts'; console.log(generateSlug('Hello World'))"
  # Assert: Output is "hello-world"
  ```

  **Commit**: YES
  - Message: `feat(core): add URL and slug utilities`
  - Files: `packages/core/src/slug.ts`, tests
  - Pre-commit: `bun test packages/core`

---

- [ ] 6. @noxion/renderer — NotionPage + react-notion-x Integration

  **What to do**:
  - Dependencies 설치: `react-notion-x`, `react`, `react-dom`, `prismjs`, `katex`
  - `packages/renderer/src/components/NotionPage.tsx` — 메인 Notion 페이지 렌더러:
    - react-notion-x의 `NotionRenderer`를 래핑
    - dynamic import로 무거운 컴포넌트 지연 로딩 (Code, Equation, Pdf, Modal, Collection)
    - `components` prop으로 Next.js Image/Link 통합 지원
    - darkMode prop 연결
    - fullPage, showTableOfContents 등 설정 전달
    - **Theme 통합**: `useNoxionComponents()`에서 NotionBlock 오버라이드를 react-notion-x의 `components` prop에 매핑
    - **Theme 통합**: `NoxionThemeProvider` 내부에서 렌더링하여 CSS 변수 적용
  - `packages/renderer/src/styles/globals.css` — 기본 스타일:
    - Tailwind CSS 설정 (@tailwind base, components, utilities)
    - react-notion-x 기본 CSS import (`react-notion-x/src/styles.css`)
    - Notion 스타일 오버라이드 (블로그에 맞는 타이포그래피, 간격 등)
    - 다크모드 CSS 변수 (`prefers-color-scheme` + `data-theme` attribute)
    - Prism.js 테마 (코드 하이라이팅)
    - KaTeX 스타일 (수학 수식)
  - `packages/renderer/src/index.ts` — 패키지 엔트리포인트 (모든 컴포넌트 re-export)
  - `packages/renderer/tailwind.config.ts` — Tailwind 설정 (패키지용 preset)
  - 빌드 확인: `bunx turbo build --filter=@noxion/renderer`

  **Must NOT do**:
  - 커스텀 Notion 블록 렌더러 직접 구현 (react-notion-x에 위임)
  - 페이지 라우팅 로직 (adapter 영역)
  - 서버 사이드 데이터 페칭 (core 영역)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: React 컴포넌트 + CSS 스타일링 중심 작업
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 컴포넌트 구조 + 스타일링 + 반응형 디자인
  - **Skills Evaluated but Omitted**:
    - `playwright`: 브라우저 테스트는 T10에서

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T7, T8, T9, T15)
  - **Blocks**: T10 (데모 앱)
  - **Blocked By**: T13 (플러그인 시스템), T14 (테마 시스템)

  **References**:

  **Pattern References**:
  - `NotionX/react-notion-x/examples/full/components/NotionPage.tsx` — NotionRenderer 래핑 + dynamic import 패턴 (https://github.com/NotionX/react-notion-x/blob/master/examples/full/components/NotionPage.tsx)
  - `NotionX/react-notion-x/examples/cra/src/App.tsx` — 기본 NotionRenderer 사용 + 컴포넌트 전달 (https://github.com/NotionX/react-notion-x/blob/master/examples/cra/src/App.tsx)
  - `morethanmin/morethan-log/src/routes/Detail/components/NotionRenderer/index.tsx` — dynamic import 패턴 (Code, Collection, Equation, Pdf)
  - `NotionX/react-notion-x/packages/react-notion-x/src/renderer.tsx` — NotionRenderer props 전체 목록
  - **T14에서 구현할 `useNoxionComponents()` 훅** — NotionBlock 오버라이드를 react-notion-x components prop에 연결
  - **T14에서 구현할 `NoxionThemeProvider`** — CSS 변수 기반 스타일링 컨텍스트

  **API/Type References**:
  - `react-notion-x` — `NotionRenderer` component props: recordMap, fullPage, darkMode, previewImages, components, mapPageUrl, mapImageUrl, showTableOfContents, minTableOfContentsItems
  - `notion-types` — `ExtendedRecordMap`

  **External References**:
  - react-notion-x README: https://github.com/NotionX/react-notion-x — 설치, 사용법, 지원 블록 목록
  - react-notion-x styles: https://github.com/NotionX/react-notion-x#styles — CSS import 방법
  - react-notion-x optional components: https://github.com/NotionX/react-notion-x#optional-components — 지연 로딩 패턴

  **WHY Each Reference Matters**:
  - examples/full/NotionPage.tsx: 가장 완전한 NotionRenderer 래핑 예제. dynamic import, 컴포넌트 매핑 패턴
  - renderer.tsx: NotionRenderer가 받는 모든 props 확인 (무엇을 외부에 노출할지 결정)
  - morethan-log: 실제 블로그에서 사용되는 dynamic import 패턴

  **Acceptance Criteria**:

  **Automated Verification:**
  ```bash
  # 빌드 성공 확인
  bunx turbo build --filter=@noxion/renderer
  # Assert: exit code 0

  # TypeScript 체크
  bunx tsc --noEmit -p packages/renderer/tsconfig.json
  # Assert: exit code 0

  # 엔트리포인트 export 확인
  bun -e "const r = require('./packages/renderer/dist/index.js'); console.log(Object.keys(r).join(','))"
  # Assert: Output includes "NotionPage"
  ```

  **Commit**: YES
  - Message: `feat(renderer): add NotionPage component with react-notion-x integration`
  - Files: `packages/renderer/src/**`
  - Pre-commit: `bunx turbo build --filter=@noxion/renderer`

---

- [ ] 7. @noxion/renderer — Blog UI Components

  **What to do**:
  - `packages/renderer/src/components/PostList.tsx` — 블로그 포스트 목록:
    - BlogPost[] 받아서 그리드/리스트 형태로 표시
    - 카버 이미지, 제목, 날짜, 태그, 카테고리 표시
    - 반응형 (모바일: 1열, 태블릿: 2열, 데스크톱: 3열)
  - `packages/renderer/src/components/PostCard.tsx` — 개별 포스트 카드:
    - 커버 이미지 (fallback: 그라데이션 배경)
    - 제목, 날짜, 태그 뱃지, 카테고리
    - 링크 (slug 기반)
  - `packages/renderer/src/components/TagFilter.tsx` — 태그/카테고리 필터:
    - 가용 태그 목록 표시
    - 선택 시 포스트 필터링
    - URL query param 연동 (?tag=xxx)
  - `packages/renderer/src/components/Header.tsx` — 사이트 헤더:
    - 사이트 이름/로고
    - 네비게이션 (Home, Tags)
    - 테마 토글 버튼 위치
  - `packages/renderer/src/components/Footer.tsx` — 사이트 푸터:
    - 저작권 표시
    - "Powered by Noxion" 링크
  - `packages/renderer/src/components/EmptyState.tsx` — 빈 상태 UI:
    - 포스트 없을 때, 검색 결과 없을 때
  - 모든 컴포넌트: Tailwind CSS 사용, 다크모드 지원 (dark: 프리픽스)
  - **Theme 통합**: 모든 컴포넌트는 CSS 변수 (`var(--noxion-*)`) 사용하여 테마 변경 가능
  - **Theme 통합**: 각 컴포넌트는 `ComponentOverrides`에서 재정의 가능하도록 독립적 props 설계
  - **Theme 통합**: `useNoxionComponents()` 훅을 통해 오버라이드된 컴포넌트 자동 사용

  **Must NOT do**:
  - 서버 사이드 로직 (순수 React 컴포넌트)
  - 복잡한 애니메이션 (MVP는 심플)
  - Infinite scroll 또는 pagination (MVP는 전체 목록 표시)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: React UI 컴포넌트 + Tailwind 스타일링
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 미적 디자인 + 반응형 레이아웃

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T6, T8, T9, T15)
  - **Blocks**: T10
  - **Blocked By**: T13 (플러그인 시스템), T14 (테마 시스템)

  **References**:

  **Pattern References**:
  - `morethanmin/morethan-log/src/routes/` — 블로그 레이아웃 구조
  - `itsEricWu/ericwu.me/app/blog/` — 블로그 포스트 목록 + 개별 페이지 패턴

  **External References**:
  - Tailwind UI examples: https://tailwindui.com/components — 카드, 그리드 레이아웃 참고
  - Tailwind dark mode: https://tailwindcss.com/docs/dark-mode — dark: 프리픽스 사용법

  **WHY Each Reference Matters**:
  - morethan-log: Notion 기반 블로그의 실전 UI 구조
  - Tailwind docs: dark mode 클래스 전략 (class vs media)

  **Acceptance Criteria**:

  **Automated Verification:**
  ```bash
  bunx turbo build --filter=@noxion/renderer
  # Assert: exit code 0

  bunx tsc --noEmit -p packages/renderer/tsconfig.json
  # Assert: exit code 0
  ```

  **Commit**: YES
  - Message: `feat(renderer): add blog UI components (PostList, PostCard, TagFilter, Header, Footer)`
  - Files: `packages/renderer/src/components/**`
  - Pre-commit: `bunx turbo build --filter=@noxion/renderer`

---

- [ ] 8. @noxion/renderer — Interactive Components (Theme, TOC, Search)

  **What to do**:
  - `packages/renderer/src/components/ThemeToggle.tsx` — 다크모드 토글:
    - System / Light / Dark 3가지 모드
    - localStorage에 선택 저장
    - `document.documentElement.dataset.theme` 변경
    - 아이콘 (Sun/Moon/Monitor)
  - `packages/renderer/src/hooks/useTheme.ts` — 테마 상태 관리:
    - localStorage 동기화
    - system preference 감지 (`prefers-color-scheme`)
    - SSR 안전 (hydration mismatch 방지)
  - `packages/renderer/src/components/TOC.tsx` — Table of Contents:
    - 포스트 내 h1/h2/h3에서 목차 추출
    - 스크롤 위치에 따라 활성 항목 하이라이트
    - 모바일에서는 숨김 (lg: 이상에서 사이드바)
    - react-notion-x의 `showTableOfContents` 옵션과 통합 또는 독립 구현
  - `packages/renderer/src/components/Search.tsx` — 클라이언트 사이드 검색:
    - 포스트 제목 + 태그 기반 필터링 (full-text 아님)
    - 디바운스 입력
    - Cmd/Ctrl+K 단축키로 열기
    - 검색 결과 하이라이트
  - `packages/renderer/src/hooks/useSearch.ts` — 검색 로직:
    - BlogPost[] 를 받아서 query로 필터링
    - fuzzy matching (간단한 수준)

  **Must NOT do**:
  - Full-text search index 구축 (Lunr, Algolia 등)
  - 서버 사이드 검색 API
  - 복잡한 애니메이션 라이브러리 (Framer Motion 등)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 인터랙티브 React 컴포넌트 + 브라우저 API (localStorage, IntersectionObserver)
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T6, T7, T9, T15)
  - **Blocks**: T10
  - **Blocked By**: T14 (테마 시스템 — ThemeProvider, CSS 변수 통합)

  **References**:

  **Pattern References**:
  - `transitive-bullshit/nextjs-notion-starter-kit/lib/use-dark-mode.ts` — 다크모드 훅 패턴
  - react-notion-x의 `showTableOfContents`, `minTableOfContentsItems` props — TOC 내장 기능
  - **T14에서 구현할 `NoxionTheme.dark`** — useTheme 훅이 CSS 변수 다크모드 오버라이드와 연동

  **External References**:
  - Tailwind dark mode (class strategy): https://tailwindcss.com/docs/dark-mode

  **WHY Each Reference Matters**:
  - nextjs-notion-starter-kit의 useDarkMode: hydration mismatch 방지 패턴 확인
  - react-notion-x TOC: 내장 TOC 옵션이 있으므로 중복 구현 방지

  **Acceptance Criteria**:

  **Automated Verification:**
  ```bash
  bunx turbo build --filter=@noxion/renderer
  # Assert: exit code 0

  bunx tsc --noEmit -p packages/renderer/tsconfig.json
  # Assert: exit code 0

  # Hook 유틸 테스트
  bun test packages/renderer
  # Assert: useSearch, useTheme utility tests pass
  ```

  **Commit**: YES
  - Message: `feat(renderer): add ThemeToggle, TOC, and Search components`
  - Files: `packages/renderer/src/components/ThemeToggle.tsx`, `TOC.tsx`, `Search.tsx`, hooks
  - Pre-commit: `bunx turbo build --filter=@noxion/renderer`

---

- [ ] 9. @noxion/adapter-nextjs — SEO Utilities

  **What to do**:
  - `packages/adapter-nextjs/src/metadata.ts` — Next.js Metadata 생성:
    - `generateNoxionMetadata(post, config)` — BlogPost + NoxionConfig에서 Next.js Metadata 객체 생성
      - title, description (포스트 첫 줄 또는 커스텀)
      - Open Graph: title, description, images (커버 이미지), type, url
      - Twitter: card, title, description, images
      - canonical URL
      - alternates
    - `generateNoxionListMetadata(config)` — 포스트 목록 페이지용 메타데이터
  - `packages/adapter-nextjs/src/sitemap.ts` — Sitemap 생성:
    - `generateNoxionSitemap(posts, config)` — Next.js sitemap() 형식 반환
    - 각 포스트의 URL, lastModified, changeFrequency, priority
    - 홈페이지, 태그 페이지 포함
  - `packages/adapter-nextjs/src/robots.ts` — Robots.txt:
    - `generateNoxionRobots(config)` — Next.js robots() 형식 반환
    - sitemap URL 포함
  - `packages/adapter-nextjs/src/structured-data.ts` — JSON-LD:
    - `generateBlogPostingLD(post, config)` — BlogPosting JSON-LD
    - `generateWebSiteLD(config)` — WebSite JSON-LD
    - Schema.org 표준 준수
  - `packages/adapter-nextjs/src/static-params.ts` — SSG 헬퍼:
    - `generateNoxionStaticParams(notionClient, config)` — generateStaticParams에서 사용
  - `packages/adapter-nextjs/src/revalidate.ts` — On-demand Revalidation 헬퍼:
    - `createRevalidateHandler(config)` — Next.js Route Handler 생성기
    - `POST /api/revalidate` 엔드포인트용
    - secret token 검증 (`config.revalidateSecret` 또는 `REVALIDATE_SECRET` 환경변수)
    - `revalidatePath('/')` + 개별 slug 페이지 갱신
    - 사용 시나리오: Notion Automation → HTTP 요청 → 즉시 갱신
  - `packages/adapter-nextjs/src/plugin-integration.ts` — 플러그인 훅 통합:
    - **Plugin 통합**: `applyMetadataPlugins(plugins, metadata, post, config)` — extendMetadata 훅 실행 후 Next.js Metadata에 병합
    - **Plugin 통합**: `applyHeadPlugins(plugins, post, config)` — injectHead 훅 실행 → Next.js head 태그로 변환
    - **Plugin 통합**: `applySitemapPlugins(plugins, entries, config)` — extendSitemap 훅 실행 후 사이트맵에 추가
  - `packages/adapter-nextjs/src/index.ts` — 엔트리포인트
  - TDD: 메타데이터 생성, sitemap 구조, JSON-LD 스키마 검증, 플러그인 훅 통합

  **Must NOT do**:
  - 실제 Next.js 페이지 파일 (app/page.tsx 등) — 이건 데모 앱(T10)과 CLI 템플릿(T12)
  - 서버 사이드 렌더링 로직
  - Next.js 설정 파일 (next.config.ts)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: SEO 표준 + Next.js API 통합. TypeScript 유틸리티 중심
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T6, T7, T8, T15)
  - **Blocks**: T10
  - **Blocked By**: T5 (URL/slug 유틸리티), T13 (플러그인 시스템)

  **References**:

  **Pattern References**:
  - `itsEricWu/ericwu.me/app/blog/[blogId]/page.tsx` — generateMetadata + Notion 통합 (https://github.com/itsEricWu/ericwu.me/blob/main/app/blog/%5BblogId%5D/page.tsx)
  - `howznguyen/howz.dev/src/app/post/[slug]/page.tsx` — generateMetadata 패턴 (OG, keywords, canonical) (https://github.com/howznguyen/howz.dev/blob/main/src/app/post/%5Bslug%5D/page.tsx)
  - `wildcatco/notion-blog/src/app/blog/[slug]/page.tsx` — generateMetadata + generateStaticParams (https://github.com/wildcatco/notion-blog/blob/main/src/app/blog/%5Bslug%5D/page.tsx)
  - `sooros5132/notion-blog-kit/src/app/layout.tsx` — Root metadata with Notion (https://github.com/sooros5132/notion-blog-kit/blob/main/src/app/layout.tsx)

  **API/Type References**:
  - Next.js Metadata API: `Metadata` type from `next`
  - Next.js Sitemap: `MetadataRoute.Sitemap` type
  - Next.js Robots: `MetadataRoute.Robots` type

  **External References**:
  - Next.js Metadata docs: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
  - Next.js Sitemap: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
  - Schema.org BlogPosting: https://schema.org/BlogPosting
  - Schema.org WebSite: https://schema.org/WebSite

  **WHY Each Reference Matters**:
  - ericwu.me / howz.dev: Notion 데이터에서 Next.js Metadata를 생성하는 실전 패턴
  - Next.js docs: generateMetadata, sitemap, robots의 정확한 반환 타입
  - Schema.org: JSON-LD 구조 표준

  **Acceptance Criteria**:

  **TDD:**
  - [ ] Test file: `packages/adapter-nextjs/src/__tests__/metadata.test.ts`
  - [ ] Tests cover: OG 태그 생성, 누락 필드 기본값, sitemap URL 구조, JSON-LD 스키마
  - [ ] `bun test packages/adapter-nextjs` → PASS

  **Automated Verification:**
  ```bash
  bun test packages/adapter-nextjs
  # Assert: All tests pass

  bunx turbo build --filter=@noxion/adapter-nextjs
  # Assert: exit code 0

  bunx tsc --noEmit -p packages/adapter-nextjs/tsconfig.json
  # Assert: exit code 0
  ```

  **Commit**: YES
  - Message: `feat(adapter-nextjs): add SEO utilities (metadata, sitemap, robots, JSON-LD)`
  - Files: `packages/adapter-nextjs/src/**`
  - Pre-commit: `bun test packages/adapter-nextjs`

---

- [ ] 10. apps/web — Demo Blog Application

  **What to do**:
  - Next.js App Router 프로젝트 (`apps/web`):
    - `next.config.ts` — Next.js 설정 (images remote patterns, transpilePackages)
    - `noxion.config.ts` — 데모 설정 (Notion 페이지 ID는 환경변수로, 플러그인 + 테마 설정 포함)
    - `tailwind.config.ts` — Tailwind 설정 (@noxion/renderer preset 확장)
    - `.env.example` — 필요한 환경변수 목록 (NOTION_PAGE_ID, NOTION_TOKEN?, REVALIDATE_SECRET?)
  - App Router 페이지:
    - `app/layout.tsx` — Root layout (Header, Footer, ThemeProvider, globals.css)
    - `app/page.tsx` — 홈 (포스트 목록 + TagFilter + Search)
    - `app/[slug]/page.tsx` — 개별 포스트 (NotionPage + TOC + generateMetadata + generateStaticParams)
    - `app/tag/[tag]/page.tsx` — 태그별 포스트 목록
    - `app/sitemap.ts` — Sitemap (generateNoxionSitemap 사용)
    - `app/robots.ts` — Robots.txt (generateNoxionRobots 사용)
    - `app/not-found.tsx` — 404 페이지
  - 서버 사이드 로직:
    - `lib/notion.ts` — Notion 클라이언트 초기화 + 이미지 다운로드 파이프라인
    - 빌드 시 이미지 다운로드 → `public/images/` 에 저장
    - ISR 설정 (revalidate: 3600 — 1시간, noxion.config.ts에서 설정 가능)
  - On-demand Revalidation:
    - `app/api/revalidate/route.ts` — 즉시 갱신 API 엔드포인트
      - `POST /api/revalidate` + secret token으로 호출
      - `revalidatePath('/')` + `revalidatePath('/[slug]')` 실행
      - Notion Automation 또는 수동 호출로 트리거 가능
      - secret은 환경변수 `REVALIDATE_SECRET`으로 관리
    - 사용 시나리오: Notion에서 draft→publish 변경 시, Notion Automation에서 이 API 호출
  - 동작 검증:
    - `bun run dev` → 로컬에서 블로그 동작
    - `bun run build` → 정적 빌드 성공
    - 모든 페이지 접근 가능

  **Must NOT do**:
  - @noxion 패키지 소스 수정 (import만)
  - 복잡한 커스터마이징 (CLI 템플릿의 기본이 될 것)
  - 하드코딩된 Notion 데이터 (반드시 환경변수로)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Next.js App Router 풀 애플리케이션 조립
  - **Skills**: [`frontend-ui-ux`, `playwright`]
    - `frontend-ui-ux`: UI 조립 + 레이아웃
    - `playwright`: 브라우저에서 실제 동작 검증

  **Parallelization**:
  - **Can Run In Parallel**: NO (Sequential — Wave 4 완료 후)
  - **Parallel Group**: Wave 5 (with T11)
  - **Blocks**: T11, T12
  - **Blocked By**: T6, T7, T8, T9, T15 (모든 패키지 + 빌트인 플러그인 필요)

  **References**:

  **Pattern References**:
  - 이 플랜의 T1~T15에서 구현한 모든 패키지를 통합 (T13: 플러그인 시스템, T14: 테마 시스템, T15: 빌트인 플러그인 포함)
  - `transitive-bullshit/nextjs-notion-starter-kit` — 전체 프로젝트 구조 참고 (but modernized to App Router)

  **External References**:
  - Next.js App Router docs: https://nextjs.org/docs/app

  **WHY Each Reference Matters**:
  - nextjs-notion-starter-kit: 검증된 Notion 블로그 프로젝트의 전체 구조. App Router로 현대화하여 적용

  **Acceptance Criteria**:

  **Automated Verification (using playwright skill):**
  ```
  # 1. 빌드 성공 확인
  bun run build (in apps/web)
  # Assert: exit code 0

  # 2. 로컬 서버 시작 + 페이지 검증 (playwright)
  bun run dev (in apps/web, background)
  
  # 홈페이지 검증:
  Navigate to: http://localhost:3000
  Assert: 포스트 카드 1개 이상 표시
  Assert: Header에 사이트 이름 표시
  Assert: TagFilter 표시
  Screenshot: .sisyphus/evidence/t10-home.png
  
  # 포스트 페이지 검증:
  Click: first post card
  Assert: NotionPage 렌더링 (notion-page 클래스 존재)
  Assert: TOC 표시 (데스크톱)
  Screenshot: .sisyphus/evidence/t10-post.png
  
  # 다크모드 검증:
  Click: ThemeToggle
  Assert: data-theme="dark" on html element
  Screenshot: .sisyphus/evidence/t10-dark.png
  
  # SEO 검증:
  Navigate to: http://localhost:3000/sitemap.xml
  Assert: XML content with <urlset>
  
  Navigate to: http://localhost:3000/robots.txt
  Assert: Contains "Sitemap:"
  
  # 메타 태그 검증:
  Navigate to: http://localhost:3000 (first post page)
  Assert: <meta property="og:title"> exists
  Assert: <meta property="og:description"> exists
  Assert: <script type="application/ld+json"> exists
  ```

  **Commit**: YES
  - Message: `feat(web): add demo blog application with all features integrated`
  - Files: `apps/web/**`
  - Pre-commit: `bun run build` (in apps/web)

---

- [ ] 11. Deploy Configs (Vercel, Static Export, Docker)

  **What to do**:
  - **Vercel**:
    - `apps/web/vercel.json` — Vercel 설정 (빌드 커맨드, output 설정)
    - 또는 Vercel 자동 감지 확인 (Next.js 프로젝트)
    - ISR 설정 확인 (revalidate가 Vercel에서 동작)
  - **Static Export**:
    - `next.config.ts`에 `output: 'export'` 옵션 문서화
    - 정적 빌드 테스트: `bun run build` → `out/` 디렉토리 확인
    - ISR 사용 불가 안내 (정적 모드에서)
    - Image Optimization 대안 안내 (unoptimized: true 또는 외부 로더)
  - **Docker**:
    - `Dockerfile` — Multi-stage build (bun 기반)
      - Stage 1: Dependencies 설치 (`bun install --frozen-lockfile`)
      - Stage 2: 빌드 (`bun run build`)
      - Stage 3: Production runtime (standalone output)
    - `docker-compose.yml` — 로컬 Docker 실행용
    - `.dockerignore`
  - 각 배포 방법의 README 섹션 작성 (간략한 가이드)

  **Must NOT do**:
  - CI/CD 파이프라인 구성 (GitHub Actions 등)
  - Kubernetes 설정
  - CDN 설정

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 설정 파일 작성. 복잡한 로직 없음
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with T10)
  - **Blocks**: T12 (CLI 템플릿에 배포 설정 포함)
  - **Blocked By**: T10 (데모 앱 기반)

  **References**:

  **External References**:
  - Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
  - Next.js Standalone: https://nextjs.org/docs/pages/api-reference/config/next-config-js/output#automatically-copying-traced-files
  - Bun Docker image: https://hub.docker.com/r/oven/bun

  **WHY Each Reference Matters**:
  - Next.js Static Export: output: 'export' 설정과 제약 사항
  - Next.js Standalone: Docker 이미지 최적화를 위한 standalone output
  - Bun Docker: 공식 Bun Docker 이미지로 런타임 설정

  **Acceptance Criteria**:

  **Automated Verification:**
  ```bash
  # Docker 빌드 확인
  docker build -t noxion-demo -f apps/web/Dockerfile .
  # Assert: exit code 0

  # Docker 실행 확인
  docker run -d -p 3001:3000 --name noxion-test noxion-demo
  sleep 5
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
  # Assert: HTTP 200
  docker stop noxion-test && docker rm noxion-test

  # Static export 확인
  # (next.config.ts에 output: 'export' 설정 후)
  # bun run build (in apps/web)
  # Assert: apps/web/out/ 디렉토리 존재
  # Assert: apps/web/out/index.html 존재
  ```

  **Commit**: YES
  - Message: `feat(web): add deployment configs (Vercel, Static Export, Docker)`
  - Files: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `vercel.json`
  - Pre-commit: `docker build -t noxion-demo -f apps/web/Dockerfile .`

---

- [ ] 12. create-noxion — CLI Scaffolding Tool

  **What to do**:
  - `packages/create-noxion/src/index.ts` — CLI 메인 엔트리:
    - `bun create noxion my-blog` 또는 `bunx create-noxion my-blog`로 실행
    - Interactive prompts:
      1. 프로젝트 이름 (default: 인자에서)
      2. Notion 페이지 ID (필수)
      3. 사이트 이름
      4. 사이트 설명
      5. 프레임워크 선택 (Next.js — 현재 유일한 옵션)
  - `packages/create-noxion/src/templates/nextjs/` — Next.js 템플릿:
    - apps/web의 구조를 기반으로 한 템플릿 파일들
    - `noxion.config.ts` (사용자 입력 반영)
    - `package.json` (@noxion/* 의존성 포함)
    - `next.config.ts`, `tailwind.config.ts`
    - App Router 페이지들 (app/layout.tsx, page.tsx, [slug]/page.tsx 등)
    - `.env.example`
    - `Dockerfile`, `docker-compose.yml`
  - `packages/create-noxion/src/scaffold.ts` — 스캐폴딩 로직:
    - 디렉토리 생성
    - 템플릿 파일 복사 + 변수 치환 (프로젝트명, Notion ID 등)
    - `bun install` 자동 실행
    - 완료 후 안내 메시지 출력
  - `packages/create-noxion/bin/index.js` — Bin 엔트리포인트
  - `package.json`의 `bin` 필드 설정
  - TDD: 스캐폴딩 로직 테스트 (파일 생성, 변수 치환, 디렉토리 구조)

  **Must NOT do**:
  - 여러 프레임워크 템플릿 (Astro 등은 2차)
  - Git init 자동 실행 (사용자에게 안내만)
  - npm publish 자동화

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: CLI 도구 + 파일 시스템 조작 + 템플릿 엔진
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (최종 태스크)
  - **Parallel Group**: Wave 6 (single)
  - **Blocks**: None (최종)
  - **Blocked By**: T10, T11 (데모 앱 기반 템플릿)

  **References**:

  **Pattern References**:
  - `create-t3-app` source: https://github.com/t3-oss/create-t3-app — CLI 스캐폴딩 패턴, 프롬프트 구조
  - `create-next-app` source: https://github.com/vercel/next.js/tree/canary/packages/create-next-app — 간단한 스캐폴딩 접근

  **External References**:
  - Bun `create` command: https://bun.sh/docs/cli/bunx#bun-create — `bun create` 프로토콜
  - `@clack/prompts`: https://github.com/bombshell-dev/clack — 모던 CLI 프롬프트 라이브러리

  **WHY Each Reference Matters**:
  - create-t3-app: Interactive prompt + 템플릿 복사의 가장 세련된 구현
  - Bun create: `bun create` 명령어와 호환되는 패키지 구조 확인
  - @clack/prompts: 아름다운 CLI UI (create-t3-app이 사용)

  **Acceptance Criteria**:

  **TDD:**
  - [ ] Test file: `packages/create-noxion/src/__tests__/scaffold.test.ts`
  - [ ] Tests cover: 디렉토리 생성, 템플릿 변수 치환, package.json 생성, noxion.config.ts 생성
  - [ ] `bun test packages/create-noxion` → PASS

  **Automated Verification:**
  ```bash
  # CLI 실행 테스트 (non-interactive)
  cd /tmp && bunx /path/to/create-noxion test-blog --notion-id=test123 --name="Test Blog" --yes
  # Assert: /tmp/test-blog/ 디렉토리 생성
  # Assert: /tmp/test-blog/noxion.config.ts 존재
  # Assert: /tmp/test-blog/package.json 존재, @noxion/core 의존성 포함
  # Assert: /tmp/test-blog/app/page.tsx 존재
  
  # 생성된 프로젝트 빌드 테스트
  cd /tmp/test-blog && bun install && bun run build
  # Assert: exit code 0

  # 정리
  rm -rf /tmp/test-blog
  ```

  **Commit**: YES
  - Message: `feat(create-noxion): add CLI scaffolding tool with Next.js template`
  - Files: `packages/create-noxion/**`
  - Pre-commit: `bun test packages/create-noxion`

---

- [ ] 13. @noxion/core — Plugin System Architecture

  **What to do**:
  - `packages/core/src/plugin.ts` — 플러그인 타입 정의 + 로더 + 실행기:
    - `NoxionPlugin<Content>` 인터페이스 (Docusaurus Plugin 패턴 기반):
      ```typescript
      interface NoxionPlugin<Content = unknown> {
        name: string;
        // Content lifecycle
        loadContent?: () => Promise<Content> | Content;
        contentLoaded?: (args: { content: Content; actions: PluginActions }) => Promise<void> | void;
        allContentLoaded?: (args: { allContent: AllContent; actions: PluginActions }) => Promise<void> | void;
        // Build lifecycle
        onBuildStart?: (args: { config: NoxionConfig }) => Promise<void> | void;
        postBuild?: (args: { config: NoxionConfig; routes: RouteInfo[] }) => Promise<void> | void;
        // Content transformation
        transformContent?: (args: { recordMap: ExtendedRecordMap; post: BlogPost }) => ExtendedRecordMap;
        transformPosts?: (args: { posts: BlogPost[] }) => BlogPost[];
        // SEO & Head
        extendMetadata?: (args: { metadata: NoxionMetadata; post?: BlogPost; config: NoxionConfig }) => NoxionMetadata;
        injectHead?: (args: { post?: BlogPost; config: NoxionConfig }) => HeadTag[];
        extendSitemap?: (args: { entries: SitemapEntry[]; config: NoxionConfig }) => SitemapEntry[];
        // Route extension
        extendRoutes?: (args: { routes: RouteInfo[]; config: NoxionConfig }) => RouteInfo[];
      }
      ```
    - `PluginActions` 인터페이스:
      ```typescript
      interface PluginActions {
        addRoute: (route: RouteInfo) => void;
        setGlobalData: (key: string, data: unknown) => void;
        getGlobalData: (pluginName: string, key: string) => unknown;
      }
      ```
    - 보조 타입들: `AllContent`, `HeadTag`, `SitemapEntry`, `RouteInfo`, `NoxionMetadata`
  - `packages/core/src/plugin-loader.ts` — 플러그인 로딩 + 검증:
    - `loadPlugins(config: NoxionConfig)` — config.plugins 배열에서 플러그인 인스턴스 생성
    - 플러그인 설정 형식: `[pluginModule, options]` 또는 `pluginModule` (옵션 없이)
    - `definePlugin(factory)` — 타입 안전한 플러그인 팩토리 헬퍼
    - 플러그인 이름 중복 검사
    - 순서 보장 (config.plugins 배열 순서 = 실행 순서)
  - `packages/core/src/plugin-executor.ts` — 라이프사이클 훅 실행기:
    - `executeHook(plugins, hookName, args)` — 모든 플러그인의 특정 훅을 순차 실행
    - `executeTransformHook(plugins, hookName, initialValue, args)` — 변환 훅 체이닝 (reduce 패턴: 이전 결과를 다음 입력으로)
    - 에러 핸들링: 개별 플러그인 에러가 전체를 중단하지 않음 (경고 + 스킵)
    - 훅 실행 타이밍 로깅 (debug 모드)
  - `packages/core/src/types.ts` 확장:
    - `NoxionConfig`에 `plugins?: PluginConfig[]` 필드 추가
    - `PluginConfig = [PluginModule, PluginOptions] | PluginModule | false`
  - TDD:
    - definePlugin: 팩토리 함수 호출 + 옵션 전달
    - loadPlugins: 유효한 플러그인 로딩, 잘못된 플러그인 에러, 중복 이름 경고
    - executeHook: 순차 실행, 에러 격리, 빈 플러그인 배열
    - executeTransformHook: 체이닝 동작 (A→B→C), 중간 에러 시 이전 값 유지

  **Must NOT do**:
  - Webpack/Vite 설정 수정 훅 (빌드 도구 독립적으로 유지)
  - 플러그인 간 의존성 그래프 (단순 순차 실행으로 충분)
  - 플러그인 핫 리로드 (빌드 시에만 실행)
  - 원격 플러그인 로딩 (로컬 패키지만)

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: 아키텍처 설계 중심. 타입 시스템 + 실행 모델 설계가 핵심
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: UI 작업 없음

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T14)
  - **Blocks**: T6, T7, T9, T15 (플러그인 훅을 렌더러/어댑터/빌트인 플러그인에서 사용)
  - **Blocked By**: T3 (데이터 페처 타입 의존)

  **References**:

  **Pattern References**:
  - `facebook/docusaurus/packages/docusaurus-types/src/plugin.d.ts` — Docusaurus Plugin 타입 전체 정의. loadContent, contentLoaded, allContentLoaded, postBuild, injectHtmlTags, getClientModules, getThemePath 등 (https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-types/src/plugin.d.ts)
  - `facebook/docusaurus/packages/docusaurus-plugin-content-blog/src/index.ts` — 실전 블로그 플러그인 구현체. loadContent에서 블로그 포스트 로딩, contentLoaded에서 라우트 등록 (https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-blog/src/index.ts)

  **API/Type References**:
  - Docusaurus `PluginContentLoadedActions`: `addRoute`, `createData`, `setGlobalData` — 플러그인이 시스템에 데이터/라우트를 주입하는 패턴
  - Docusaurus `PluginModule`: `(context, options) => Plugin` — 플러그인 팩토리 패턴
  - Docusaurus `HtmlTagObject`: `{ tagName, attributes, innerHTML }` — head 태그 주입 구조

  **External References**:
  - Docusaurus Plugin Lifecycle: https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis — 공식 라이프사이클 문서
  - Docusaurus Creating Plugins: https://docusaurus.io/docs/creating-plugins — 플러그인 생성 가이드

  **WHY Each Reference Matters**:
  - Docusaurus plugin.d.ts: 가장 성숙한 문서 사이트 플러그인 시스템. 우리 NoxionPlugin 인터페이스의 직접 참고 모델
  - content-blog plugin: loadContent→contentLoaded 패턴이 우리의 데이터 페칭→라우트 생성 흐름과 동일
  - PluginContentLoadedActions: addRoute, setGlobalData는 우리 PluginActions에 직접 매핑

  **Acceptance Criteria**:

  **TDD:**
  - [ ] Test file: `packages/core/src/__tests__/plugin.test.ts`
  - [ ] Tests cover: definePlugin 팩토리, loadPlugins 로딩/검증, executeHook 순차실행, executeTransformHook 체이닝, 에러 격리
  - [ ] `bun test packages/core` → PASS

  **Automated Verification:**
  ```bash
  bun test packages/core
  # Assert: All tests pass (including plugin tests)

  bunx tsc --noEmit -p packages/core/tsconfig.json
  # Assert: exit code 0

  # 플러그인 타입 export 확인
  bun -e "import { definePlugin } from './packages/core/src/index.ts'; console.log(typeof definePlugin)"
  # Assert: Output is "function"
  ```

  **Commit**: YES
  - Message: `feat(core): add plugin system architecture (types, loader, executor)`
  - Files: `packages/core/src/plugin.ts`, `packages/core/src/plugin-loader.ts`, `packages/core/src/plugin-executor.ts`, tests
  - Pre-commit: `bun test packages/core`

---

- [ ] 14. @noxion/renderer — Theme System Architecture

  **What to do**:
  - `packages/renderer/src/theme/types.ts` — 테마 타입 정의:
    - `NoxionTheme` 인터페이스:
      ```typescript
      interface NoxionTheme {
        name: string;
        // CSS Variables
        colors: {
          // Base palette
          primary: string;
          primaryForeground: string;
          background: string;
          foreground: string;
          muted: string;
          mutedForeground: string;
          border: string;
          accent: string;
          accentForeground: string;
          // Semantic
          card: string;
          cardForeground: string;
          // Custom (extensible)
          [key: string]: string;
        };
        fonts?: {
          sans?: string;
          serif?: string;
          mono?: string;
          display?: string;
        };
        spacing?: {
          content: string; // max-width of content area
          sidebar: string; // sidebar width (if layout uses it)
        };
        borderRadius?: string;
        // Dark mode overrides
        dark?: Partial<Omit<NoxionTheme, 'name' | 'dark'>>;
      }
      ```
    - `NoxionLayout` 타입: `'single-column' | 'sidebar-left' | 'sidebar-right'`
    - `ComponentOverrides` 인터페이스: 사용자가 재정의 가능한 컴포넌트 맵
      ```typescript
      interface ComponentOverrides {
        Header?: ComponentType<HeaderProps>;
        Footer?: ComponentType<FooterProps>;
        PostCard?: ComponentType<PostCardProps>;
        PostList?: ComponentType<PostListProps>;
        NotionPage?: ComponentType<NotionPageProps>;
        TOC?: ComponentType<TOCProps>;
        Search?: ComponentType<SearchProps>;
        TagFilter?: ComponentType<TagFilterProps>;
        // Notion block overrides
        NotionBlock?: Record<string, ComponentType<any>>; // block type → component
      }
      ```
  - `packages/renderer/src/theme/define-theme.ts` — 테마 정의 헬퍼:
    - `defineTheme(theme: NoxionTheme)` — 타입 안전 테마 정의 (Directus 패턴)
    - 기본 테마 (`defaultTheme`) 제공 — shadcn/ui 스타일 기본 색상
  - `packages/renderer/src/theme/css-generator.ts` — CSS 변수 생성:
    - `generateCSSVariables(theme: NoxionTheme)` — TypeScript 테마 객체 → CSS custom properties 문자열
    - 중첩 객체를 flat CSS 변수로 변환 (e.g., `colors.primary` → `--noxion-primary`)
    - 다크모드 변수 별도 생성 (`[data-theme="dark"]` selector)
    - `injectThemeCSS(theme)` — 생성된 CSS를 `<style>` 태그로 주입
  - `packages/renderer/src/theme/ThemeProvider.tsx` — React 테마 컨텍스트:
    - `NoxionThemeProvider` — 테마 CSS 변수 주입 + 컴포넌트 오버라이드 제공
    - `useNoxionTheme()` — 현재 테마 객체 접근 훅
    - `useNoxionComponents()` — 오버라이드된 컴포넌트 접근 훅
    - Layout 선택 로직 (`layout` prop에 따라 다른 레이아웃 래퍼)
  - `packages/renderer/src/theme/component-resolver.ts` — 컴포넌트 오버라이드 해석:
    - `resolveComponents(defaults, overrides)` — 기본 컴포넌트와 사용자 오버라이드 병합
    - 오버라이드 없는 컴포넌트는 기본값 사용
    - Notion 블록 오버라이드: react-notion-x의 `components` prop에 매핑
  - `packages/core/src/types.ts` 확장:
    - `NoxionConfig`에 `theme?: NoxionTheme`, `layout?: NoxionLayout`, `components?: ComponentOverrides` 필드 추가
  - TDD:
    - defineTheme: 테마 객체 생성 + 기본값 병합
    - generateCSSVariables: 올바른 CSS 변수 문자열 생성, 다크모드 오버라이드
    - resolveComponents: 기본/오버라이드 병합, 부분 오버라이드

  **Must NOT do**:
  - 런타임 테마 전환 UI (ThemeToggle은 이미 T8에서 다크/라이트만 담당)
  - 여러 테마 프리셋 배포 (MVP에서는 하나의 기본 테마 + 사용자 커스터마이징)
  - Notion 블록 렌더러 재구현 (react-notion-x의 components prop 활용)
  - CSS-in-JS 런타임 (정적 CSS 변수만 사용)

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: 아키텍처 설계 중심. 타입 시스템 + CSS 변수 생성 알고리즘 + 컴포넌트 해석 로직
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: CSS 변수 구조 + 컴포넌트 오버라이드 UX 패턴
  - **Skills Evaluated but Omitted**:
    - `playwright`: 브라우저 테스트는 T10에서

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T13)
  - **Blocks**: T6, T7, T8 (렌더러 컴포넌트들이 ThemeProvider와 useNoxionComponents 사용)
  - **Blocked By**: T3 (데이터 타입 의존)

  **References**:

  **Pattern References**:
  - `directus/directus/packages/themes/src/utils/define-theme.ts` — defineTheme 유틸리티: `export const defineTheme = <T extends Theme>(theme: T) => theme` (https://github.com/directus/directus/blob/main/packages/themes/src/utils/define-theme.ts)
  - `directus/directus/packages/themes/src/themes/light/default.ts` — 테마 정의 실전 예제: id, name, appearance, rules(colors, fonts, borders, scopes) (https://github.com/directus/directus/blob/main/packages/themes/src/themes/light/default.ts)
  - `directus/directus/packages/types/src/extensions/themes.ts` — Theme 타입 스키마: ThemeSchema = {id, name, appearance, rules}. Rules에는 foreground/background/primary/secondary/fonts/navigation/header/sidebar 등 (https://github.com/directus/directus/blob/main/packages/types/src/extensions/themes.ts)
  - `facebook/docusaurus/packages/docusaurus-types/src/plugin.d.ts` — getSwizzleConfig, getSwizzleComponentList — 컴포넌트 오버라이드 가능 여부 선언 패턴

  **External References**:
  - shadcn/ui theming: https://ui.shadcn.com/docs/theming — CSS 변수 기반 테마. `--background`, `--foreground`, `--primary` 등의 변수 네이밍
  - Tailwind CSS theme config: https://tailwindcss.com/docs/theme — Tailwind 테마 프리셋 확장 패턴
  - Docusaurus Swizzling: https://docusaurus.io/docs/swizzling — 컴포넌트 오버라이드 패턴 (Wrapping vs Ejecting)
  - CSS Custom Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties — CSS 변수 문법

  **WHY Each Reference Matters**:
  - Directus defineTheme + Theme type: CSS 변수 기반 테마의 가장 체계적인 구현. colors/fonts/spacing/scopes 구조를 우리 NoxionTheme에 적용
  - shadcn/ui: React 생태계에서 가장 널리 사용되는 CSS 변수 테마 패턴. 변수 네이밍 컨벤션 참고
  - Docusaurus Swizzling: 컴포넌트 오버라이드의 DX 패턴. "안전/위험" 표시, 래핑 vs 교체 구분

  **Acceptance Criteria**:

  **TDD:**
  - [ ] Test file: `packages/renderer/src/__tests__/theme.test.ts`
  - [ ] Tests cover: defineTheme 기본값 병합, generateCSSVariables 변환 정확성, 다크모드 오버라이드, resolveComponents 병합
  - [ ] `bun test packages/renderer` → PASS

  **Automated Verification:**
  ```bash
  bun test packages/renderer
  # Assert: All tests pass

  bunx tsc --noEmit -p packages/renderer/tsconfig.json
  # Assert: exit code 0

  # CSS 변수 생성 확인
  bun -e "import { generateCSSVariables } from './packages/renderer/src/theme/css-generator.ts'; import { defaultTheme } from './packages/renderer/src/theme/define-theme.ts'; console.log(generateCSSVariables(defaultTheme).substring(0, 100))"
  # Assert: Output contains "--noxion-"

  # defineTheme export 확인
  bun -e "import { defineTheme } from './packages/renderer/src/index.ts'; console.log(typeof defineTheme)"
  # Assert: Output is "function"
  ```

  **Commit**: YES
  - Message: `feat(renderer): add theme system architecture (CSS variables, component overrides, layout)`
  - Files: `packages/renderer/src/theme/**`, tests
  - Pre-commit: `bun test packages/renderer`

---

- [ ] 15. Built-in Plugins (Analytics, RSS, Comments)

  **What to do**:
  - 3개의 빌트인 플러그인을 `packages/core/src/plugins/` 디렉토리에 구현:

  - **`packages/core/src/plugins/analytics.ts`** — Analytics 플러그인:
    - `createAnalyticsPlugin(options)`:
      - `options.provider`: `'google' | 'plausible' | 'umami' | 'custom'`
      - `options.trackingId`: 추적 ID
      - `options.customScript?`: 커스텀 스크립트 URL (provider='custom'일 때)
    - `injectHead` 훅으로 `<script>` 태그 주입
    - Google Analytics: gtag.js 스크립트
    - Plausible: plausible.js 스크립트
    - Umami: umami.js 스크립트 (data-website-id 포함)
    - Custom: 사용자 제공 스크립트 URL

  - **`packages/core/src/plugins/rss.ts`** — RSS 피드 플러그인:
    - `createRSSPlugin(options)`:
      - `options.feedPath?`: 피드 경로 (기본: `/feed.xml`)
      - `options.limit?`: 최대 포스트 수 (기본: 20)
      - `options.fullContent?`: 전체 콘텐츠 포함 여부 (기본: false, 요약만)
    - `postBuild` 훅으로 RSS XML 생성 + 파일 쓰기
    - `injectHead` 훅으로 `<link rel="alternate" type="application/rss+xml">` 주입
    - `extendSitemap` 훅으로 feed.xml을 사이트맵에 추가
    - RSS 2.0 형식 (title, link, description, pubDate, guid, dc:creator)

  - **`packages/core/src/plugins/comments.ts`** — 댓글 플러그인:
    - `createCommentsPlugin(options)`:
      - `options.provider`: `'giscus' | 'utterances' | 'disqus'`
      - `options.config`: provider별 설정 (repo, repoId, category 등)
    - `injectHead` 훅으로 필요한 스크립트 로드
    - `extendMetadata` 훅으로 댓글 관련 메타데이터 추가
    - React 컴포넌트 export: `CommentsSection` (각 provider의 embed 래핑)
    - Giscus: `<script src="https://giscus.app/client.js">` + 설정 data attributes
    - Utterances: `<script src="https://utteranc.es/client.js">`
    - Disqus: `<div id="disqus_thread">` + embed 스크립트

  - `packages/core/src/plugins/index.ts` — 빌트인 플러그인 re-export
  - TDD:
    - Analytics: provider별 올바른 script 태그 생성, trackingId 포함
    - RSS: XML 생성 (유효한 RSS 2.0), 포스트 제한, head link 생성
    - Comments: provider별 설정 매핑, 스크립트 태그 생성

  **Must NOT do**:
  - 실제 외부 서비스 연동 테스트 (목 데이터로만)
  - 댓글 시스템 자체 구현 (제3자 서비스 embed만)
  - RSS 파싱 (생성만)
  - 복잡한 Analytics 이벤트 트래킹 (페이지뷰 스크립트 주입만)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 플러그인 인터페이스 구현 + 외부 서비스 통합 코드 생성
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Comments 컴포넌트는 단순 embed 래퍼

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T6, T7, T8, T9)
  - **Blocks**: T10 (데모 앱에서 빌트인 플러그인 데모)
  - **Blocked By**: T13 (플러그인 시스템 아키텍처)

  **References**:

  **Pattern References**:
  - T13에서 정의할 `NoxionPlugin` 인터페이스 — 모든 빌트인 플러그인이 이 인터페이스를 구현
  - `facebook/docusaurus/packages/docusaurus-plugin-google-analytics/src/index.ts` — GA 플러그인: injectHtmlTags로 gtag 스크립트 주입 (https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-plugin-google-analytics)
  - `facebook/docusaurus/packages/docusaurus-plugin-sitemap/src/index.ts` — Sitemap 플러그인: postBuild에서 sitemap.xml 생성 (https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-plugin-sitemap)

  **External References**:
  - Giscus setup: https://giscus.app — Giscus 댓글 위젯 설정 및 스크립트 태그
  - Utterances: https://utteranc.es — Utterances 댓글 위젯
  - RSS 2.0 Specification: https://www.rssboard.org/rss-specification — RSS XML 구조
  - Google Analytics gtag.js: https://developers.google.com/analytics/devguides/collection/gtagjs — GA4 스크립트 설정
  - Plausible docs: https://plausible.io/docs/plausible-script — Plausible 스크립트 설정
  - Umami docs: https://umami.is/docs/collect-data — Umami 트래킹 설정

  **WHY Each Reference Matters**:
  - Docusaurus GA plugin: injectHtmlTags로 script 주입하는 실전 패턴. 우리 injectHead 훅의 직접 참고
  - Giscus/Utterances: 스크립트 태그 + data attributes 형식 확인 필요
  - RSS 2.0 Spec: XML 구조 정확성 보장

  **Acceptance Criteria**:

  **TDD:**
  - [ ] Test file: `packages/core/src/__tests__/plugins/analytics.test.ts`
  - [ ] Test file: `packages/core/src/__tests__/plugins/rss.test.ts`
  - [ ] Test file: `packages/core/src/__tests__/plugins/comments.test.ts`
  - [ ] Analytics tests: Google/Plausible/Umami/Custom 각 provider의 script 태그 생성
  - [ ] RSS tests: RSS XML 생성 (channel, item 구조), 포스트 limit, head link
  - [ ] Comments tests: Giscus/Utterances/Disqus 각 provider의 script/config
  - [ ] `bun test packages/core` → PASS

  **Automated Verification:**
  ```bash
  bun test packages/core
  # Assert: All tests pass (including plugin tests)

  bunx tsc --noEmit -p packages/core/tsconfig.json
  # Assert: exit code 0

  # 빌트인 플러그인 export 확인
  bun -e "import { createAnalyticsPlugin, createRSSPlugin, createCommentsPlugin } from './packages/core/src/plugins/index.ts'; console.log([typeof createAnalyticsPlugin, typeof createRSSPlugin, typeof createCommentsPlugin].join(','))"
  # Assert: Output is "function,function,function"

  # Analytics 플러그인 생성 확인
  bun -e "import { createAnalyticsPlugin } from './packages/core/src/plugins/analytics.ts'; const p = createAnalyticsPlugin({ provider: 'google', trackingId: 'G-TEST' }); console.log(p.name)"
  # Assert: Output is "noxion-plugin-analytics"

  # RSS 플러그인 생성 확인
  bun -e "import { createRSSPlugin } from './packages/core/src/plugins/rss.ts'; const p = createRSSPlugin({}); console.log(p.name)"
  # Assert: Output is "noxion-plugin-rss"
  ```

  **Commit**: YES
  - Message: `feat(core): add built-in plugins (analytics, RSS, comments)`
  - Files: `packages/core/src/plugins/**`, tests
  - Pre-commit: `bun test packages/core`

---

## Commit Strategy

| After Task | Message | Key Files | Verification |
|------------|---------|-----------|--------------|
| T1 | `chore: initialize monorepo with Turborepo + Bun workspaces` | turbo.json, package.json, tsconfig | `bun install && bunx turbo build` |
| T2 | `feat(core): add config system and shared types` | packages/core/src/ | `bun test packages/core` |
| T3 | `feat(core): add Notion client wrapper and data fetchers` | packages/core/src/ | `bun test packages/core` |
| T4 | `feat(core): add build-time image download pipeline` | packages/core/src/ | `bun test packages/core` |
| T5 | `feat(core): add URL and slug utilities` | packages/core/src/ | `bun test packages/core` |
| T6 | `feat(renderer): add NotionPage with react-notion-x integration` | packages/renderer/src/ | `bunx turbo build --filter=@noxion/renderer` |
| T7 | `feat(renderer): add blog UI components` | packages/renderer/src/components/ | `bunx turbo build --filter=@noxion/renderer` |
| T8 | `feat(renderer): add ThemeToggle, TOC, and Search` | packages/renderer/src/ | `bunx turbo build --filter=@noxion/renderer` |
| T9 | `feat(adapter-nextjs): add SEO utilities` | packages/adapter-nextjs/src/ | `bun test packages/adapter-nextjs` |
| T10 | `feat(web): add demo blog application` | apps/web/ | `bun run build` |
| T11 | `feat(web): add deployment configs` | Dockerfile, vercel.json | `docker build` |
| T12 | `feat(create-noxion): add CLI scaffolding tool` | packages/create-noxion/ | `bun test packages/create-noxion` |
| T13 | `feat(core): add plugin system architecture` | packages/core/src/plugin*.ts | `bun test packages/core` |
| T14 | `feat(renderer): add theme system architecture` | packages/renderer/src/theme/ | `bun test packages/renderer` |
| T15 | `feat(core): add built-in plugins (analytics, RSS, comments)` | packages/core/src/plugins/ | `bun test packages/core` |

---

## Success Criteria

### Verification Commands
```bash
# 전체 빌드
bunx turbo build
# Expected: 모든 패키지 빌드 성공

# 전체 테스트
bunx turbo test
# Expected: 모든 테스트 통과 (plugin, theme 테스트 포함)

# 플러그인 시스템 확인
bun -e "import { definePlugin, createAnalyticsPlugin, createRSSPlugin, createCommentsPlugin } from '@noxion/core'; console.log('Plugins OK')"
# Expected: "Plugins OK"

# 테마 시스템 확인
bun -e "import { defineTheme, generateCSSVariables } from '@noxion/renderer'; console.log('Theme OK')"
# Expected: "Theme OK"

# CLI 동작
bunx create-noxion test-site --yes --notion-id=DEMO_ID --name="My Blog"
# Expected: 프로젝트 생성 성공

# 데모 앱 동작
bun run dev (in apps/web)
# Expected: localhost:3000에서 블로그 동작 (플러그인 + 테마 적용)
```

### Final Checklist
- [ ] 모노레포 구조 (Turborepo + Bun) 정상 동작
- [ ] @noxion/core: Notion 데이터 페칭 + 이미지 다운로드 + 설정 파싱
- [ ] @noxion/core: 플러그인 시스템 (definePlugin, loadPlugins, executeHook, executeTransformHook)
- [ ] @noxion/core: 빌트인 플러그인 (Analytics, RSS, Comments) 동작
- [ ] @noxion/renderer: NotionPage 렌더링 + 블로그 UI + 테마/검색/TOC
- [ ] @noxion/renderer: 테마 시스템 (defineTheme, CSS 변수 생성, 컴포넌트 오버라이드)
- [ ] @noxion/adapter-nextjs: SEO 메타데이터 + Sitemap + JSON-LD + 플러그인 훅 통합
- [ ] create-noxion: CLI 스캐폴딩 동작
- [ ] apps/web: 데모 블로그 동작 (플러그인 + 테마 데모 포함)
- [ ] TDD 테스트 전체 통과
- [ ] Docker 빌드 성공
- [ ] Lighthouse SEO 90+ (데모 앱)
- [ ] 다크모드, 코드 하이라이팅, TOC, 검색, 태그 필터 모두 동작
- [ ] 플러그인 에러 격리 (개별 플러그인 실패 시 전체 중단 없음)
- [ ] 컴포넌트 오버라이드로 PostCard 교체 가능 (테마 시스템 검증)
