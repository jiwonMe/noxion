# Copy, Don't Import — shadcn/ui 모델로 테마 시스템 전환 + pageType 탈하드코딩

## TL;DR

> **Quick Summary**: Noxion의 런타임 테마 contract/provider 시스템을 전면 제거하고, shadcn/ui처럼 컴포넌트를 사용자 프로젝트에 복사하여 소유하는 모델로 전환. 동시에 core/adapter의 blog|docs|portfolio 하드코딩을 제거하여 커스텀 페이지 타입을 자유롭게 추가 가능하게.
>
> **Deliverables**:
> - `@noxion/renderer` 최소화 (contract/provider 제거, NotionPage + hooks만 잔존)
> - `@noxion/theme-default` Tailwind-only 컴포넌트 레지스트리로 전환 (VE 제거)
> - `@noxion/theme-beacon` Tailwind-only 레지스트리로 전환
> - `@noxion/core` pageType 탈하드코딩 (fetcher, schema-mapper, page-type-registry)
> - `@noxion/adapter-nextjs` pageType 탈하드코딩 (routes, sitemap, structured-data, metadata)
> - `create-noxion` 스캐폴딩: 컴포넌트를 프로젝트에 복사하는 모델로 전환
> - `noxion add` CLI 명령: 개별 컴포넌트 추가/교체 (의존성 자동 해석)
> - `apps/web` 마이그레이션: provider 제거, 직접 import
>
> **Estimated Effort**: XL
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 2 → Task 4 → Task 6/7/8 → Task 9

---

## Context

### Original Request
Noxion 아키텍처 재설계 논의에서 3가지 제안(A: Contract 수정, B: Composition over Contract, C: Copy Don't Import) 중 제안 C를 선택. 추가로 pageType 하드코딩 제거 및 `noxion add` CLI까지 이번 플랜에 포함.

### Interview Summary
**Key Discussions**:
- 제안 A 거부 이유: contract 추상화 안에서만 노는 것, 근본적 변화 필요
- 제안 B 보류 이유: provider가 얇지만 존재, 여전히 npm 의존성 import 모델
- 제안 C 선택 이유: 런타임 추상화 제로, 컴포넌트 = 소유한 소스 코드, shadcn/ui 성공 모델
- 스타일링 결정: Tailwind-only (VE 제거) — 복사된 파일이 추가 빌드 설정 없이 동작
- 범위 결정: Theme system + pageType 하드코딩 제거 + `noxion add` 명령

**Research Findings**:
- ghost-overhaul Tasks 1-5에서 theme-default 16개 VE 컴포넌트 + 3 레이아웃 + 7 템플릿 작성됨 → VE→Tailwind 재작성 필요
- core의 plugin.ts에 `extendSlots` 훅 존재 — C 모델에서 무의미해짐 (deprecated 처리)
- PageTypeDefinition에 이미 `schemaConventions` 필드 존재하나 buildPropertyMapping에서 미사용 → 연결 필요
- create-noxion에 4개 템플릿(blog/docs/portfolio/full) + plugin/theme 스캐폴드 존재
- apps/web의 providers.tsx가 NoxionThemeProvider + defaultThemeContract 래핑 중 → 제거 대상

### Gap Analysis (Self-performed, agents unavailable)
**Identified Gaps** (addressed in plan):
- **다크모드**: `useThemePreference`는 ThemeProvider와 독립적 (`document.documentElement.dataset.theme` 사용). Tailwind `dark:` variant과 `[data-theme="dark"]` 셀렉터 조합으로 동작 → Task 4에서 처리
- **extendSlots 훅**: C 모델에서 Provider 없으므로 슬롯 주입 불가. 플러그인이 UI 주입 필요 시 컴포넌트를 제공하고 사용자가 직접 배치하는 모델로 전환 → Task 1에서 deprecated 처리
- **컴포넌트 의존성**: PostList→PostCard, HeroSection→PostCard 등 의존 관계 존재. `noxion add`가 의존성 해석해야 함 → Task 7에서 registry.json으로 관리
- **Prop 타입 인터페이스**: HeaderProps, PostCardProps 등은 contract 제거 후에도 유용. renderer에 타입만 유지 → Task 1에서 처리
- **apps/theme-dev**: 테마 개발 앱. C 모델에서 "테마 개발" = "컴포넌트 개발". Storybook-like 역할 유지 가능 → Task 8에서 간소화
- **기존 4개 template (nextjs/docs/portfolio/full)**: 모든 템플릿이 @noxion/renderer import + ThemeProvider 사용 → Task 6에서 전면 재작성
- **schema-mapper METADATA_CONVENTIONS**: blog/docs/portfolio 하드코딩. PageTypeDefinition.schemaConventions와 연결 필요 → Task 3에서 처리

---

## Work Objectives

### Core Objective
런타임 테마 추상화(contract/provider)를 전면 제거하고, 컴포넌트가 사용자 프로젝트의 소유 소스 코드가 되는 shadcn/ui 모델로 전환. 동시에 pageType 하드코딩을 제거하여 임의의 페이지 타입을 지원하는 열린 아키텍처 구현.

### Concrete Deliverables
- `packages/renderer/src/theme/` — contract.ts, ThemeProvider.tsx 제거. types.ts에서 contract 타입 제거 (prop 인터페이스는 유지)
- `packages/theme-default/src/` — 16 컴포넌트 + 3 레이아웃 + 7 템플릿 Tailwind-only 재작성, registry.json 추가
- `packages/theme-beacon/src/` — Tailwind-only 재작성, registry.json 추가
- `packages/core/src/fetcher.ts` — buildMetadata에서 하드코딩된 pageType 분기를 PageTypeDefinition 기반으로 전환
- `packages/core/src/schema-mapper.ts` — METADATA_CONVENTIONS를 PageTypeDefinition.schemaConventions에서 동적으로 로드
- `packages/adapter-nextjs/src/` — sitemap, structured-data, metadata에서 pageType switch문을 config 기반으로 전환
- `packages/create-noxion/` — 템플릿 재작성 (컴포넌트 복사 모델), `noxion add` 명령 구현
- `apps/web/` — provider 제거, 직접 import 패턴

### Definition of Done
- [ ] `bun test` — 모든 테스트 통과
- [ ] `bun run build` — 12/12 빌드 성공
- [ ] `apps/web`이 NoxionThemeProvider 없이 동작
- [ ] theme-default, theme-beacon에 vanilla-extract 의존성 제로
- [ ] `bunx create-noxion test-project --yes`로 생성된 프로젝트에 src/components/noxion/ 존재
- [ ] noxion.config.ts에 커스텀 pageType 정의 시 fetcher/adapter가 정상 처리

### Must Have
- 모든 prop 인터페이스 (HeaderProps, PostCardProps 등) renderer에서 계속 export
- 다크모드 동작 유지 (useThemePreference + Tailwind dark: variant)
- zero-config 기본 동작 유지 (create-noxion으로 생성하면 즉시 동작)
- `noxion add` 명령의 의존성 자동 해석
- 커스텀 pageType에 대한 metadata convention 확장 가능

### Must NOT Have (Guardrails)
- NoxionThemeContract 인터페이스 잔존 (완전 제거)
- NoxionThemeProvider 컴포넌트 잔존 (완전 제거)
- useThemeComponent/Layout/Template 훅 잔존 (완전 제거)
- defineThemeContract, validateThemeContract 잔존 (완전 제거)
- vanilla-extract 의존성 잔존 (모든 패키지에서 완전 제거)
- .css.ts 파일 잔존 (전부 제거)
- 런타임 컴포넌트 resolution (import 시점에 확정)
- 새로운 추상화 레이어 추가 (Provider, Context, HOC 등)
- fetchBlogPosts의 blog 전용 API 제거 (하위 호환성 유지, deprecated 마킹)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (bun:test)
- **User wants tests**: TDD
- **Framework**: bun test

### TDD Workflow
1. **RED**: 실패 테스트 작성
2. **GREEN**: 최소 구현으로 통과
3. **REFACTOR**: 정리 (테스트 유지)

Test commands:
- 단일: `export PATH="$HOME/.bun/bin:$PATH" && bun test packages/{pkg}/src/__tests__/{file}.test.ts`
- 전체: `export PATH="$HOME/.bun/bin:$PATH" && bun test`
- 빌드: `bun run build`

### Pre-existing Failures (무시)
- `create-noxion` 테스트 2개 실패 (missing `@noxion/plugin-utils`) — 기존 문제

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 3 independent tracks):
├── Task 1: renderer 최소화 (contract/provider 제거)
├── Task 2: vanilla-extract 인프라 제거 (전 패키지)
└── Task 3: pageType 탈하드코딩 (core + adapter-nextjs)

Wave 2 (After Wave 1):
├── Task 4: theme-default Tailwind-only 재작성 (dep: 2)
└── Task 5: theme-beacon Tailwind-only 재작성 (dep: 2)

Wave 3 (After Wave 2):
├── Task 6: create-noxion 스캐폴드 업데이트 (dep: 4)
├── Task 7: noxion add 명령 구현 (dep: 4)
└── Task 8: apps/web + apps/theme-dev 마이그레이션 (dep: 1, 4)

Wave 4 (After Wave 3):
└── Task 9: 통합 테스트 + 빌드 검증 (dep: all)
```

### Dependency Matrix

| Task | Depends On | Blocks | Parallel With |
|------|------------|--------|---------------|
| 1 | None | 8 | 2, 3 |
| 2 | None | 4, 5 | 1, 3 |
| 3 | None | 9 | 1, 2 |
| 4 | 2 | 6, 7, 8 | 5 |
| 5 | 2 | 9 | 4 |
| 6 | 4 | 9 | 7, 8 |
| 7 | 4 | 9 | 6, 8 |
| 8 | 1, 4 | 9 | 6, 7 |
| 9 | all | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended |
|------|-------|-------------|
| 1 | 1, 2, 3 | 3 parallel agents (category: unspecified-high) |
| 2 | 4, 5 | 2 parallel agents (category: visual-engineering) |
| 3 | 6, 7, 8 | 3 parallel agents (6,7: unspecified-high / 8: visual-engineering) |
| 4 | 9 | 1 agent (category: unspecified-high) |

---

## TODOs

- [x] 0. (완료됨) ghost-overhaul Tasks 1-5 — theme-default에 VE 컴포넌트 작성됨. 이 작업의 **prop 인터페이스와 컴포넌트 구조**는 유지하되 스타일링만 VE→Tailwind로 전환.

---

- [ ] 1. renderer 최소화 — contract/provider 전면 제거

  **What to do**:
  - `packages/renderer/src/theme/ThemeProvider.tsx` 삭제 (NoxionThemeProvider, useThemeContract, useThemeComponent, useThemeLayout, useThemeTemplate 전부 제거)
  - `packages/renderer/src/theme/contract.ts` 삭제 (defineThemeContract, validateThemeContract 제거)
  - `packages/renderer/src/theme/types.ts` 에서:
    - 삭제: `NoxionThemeContract`, `NoxionThemeContractComponents`, `NoxionThemeContractLayouts`, `NoxionThemeContractTemplates` 인터페이스
    - 유지: 모든 prop 인터페이스 (HeaderProps, FooterProps, PostCardProps, PostListProps, TOCProps, SearchProps, TagFilterProps, DocsSidebarProps, DocsBreadcrumbProps, DocsPageProps, PortfolioCardProps, PortfolioFilterProps, HeroSectionProps, EmptyStateProps, ThemeToggleProps, NotionPageProps), NoxionLayoutProps, NoxionTemplateProps, NoxionSlotMap, NoxionTemplateMap, NoxionTheme, NoxionThemeTokens 및 관련 토큰 인터페이스, NoxionThemeMetadata
  - `packages/renderer/src/theme/slot-resolver.ts` — 유지 여부 확인 후 삭제 (ThemeProvider 없이 의미 없을 경우)
  - `packages/renderer/src/theme/template-resolver.ts` — 유지 여부 확인 후 삭제
  - `packages/renderer/src/index.ts` 정리:
    - 삭제 export: NoxionThemeProvider, useThemeContract, useThemeComponent, useThemeLayout, useThemeTemplate, NoxionThemeProviderProps, validateThemeContract, defineThemeContract, ValidationResult, ValidationIssue, ValidationSeverity, NoxionThemeContract, NoxionThemeContractComponents, NoxionThemeContractLayouts, NoxionThemeContractTemplates
    - resolveSlots, resolveTemplate — 파일 존재하면 삭제
    - 유지 export: NotionPage, NoxionLogo, useThemePreference, useSearch, 모든 prop 타입, NoxionLayoutProps, NoxionTemplateProps 등
  - `packages/core/src/plugin.ts`의 `extendSlots` 훅에 `@deprecated` JSDoc 추가 (제거는 안 함, 하위 호환)
  - 기존 테스트 업데이트: contract/provider 관련 테스트 삭제 또는 수정

  **Must NOT do**:
  - prop 인터페이스 (HeaderProps 등) 삭제 금지 — 이들은 컴포넌트 간 계약으로 여전히 유용
  - useThemePreference, useSearch 삭제 금지
  - NotionPage, NoxionLogo 삭제 금지

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`git-master`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 8
  - **Blocked By**: None

  **References**:
  - `packages/renderer/src/theme/ThemeProvider.tsx` — 삭제 대상 전체 (66줄). NoxionThemeProvider, ThemeContext, useThemeContract, useThemeComponent, useThemeLayout, useThemeTemplate.
  - `packages/renderer/src/theme/contract.ts` — 삭제 대상 전체 (175줄). REQUIRED_COMPONENTS 배열(16개), validateThemeContract, defineThemeContract.
  - `packages/renderer/src/theme/types.ts:224-267` — 삭제 대상: NoxionThemeContractComponents, NoxionThemeContractLayouts, NoxionThemeContractTemplates, NoxionThemeContract. Lines 1-222 유지.
  - `packages/renderer/src/index.ts` — 현재 export 목록 전체. 삭제 대상 export 식별용.
  - `packages/renderer/src/theme/slot-resolver.ts` — 존재 확인 후 처리
  - `packages/renderer/src/theme/template-resolver.ts` — 존재 확인 후 처리
  - `packages/renderer/src/__tests__/` — contract/provider 관련 테스트 파일 확인
  - `packages/core/src/plugin.ts:75` — `extendSlots` 훅 위치. @deprecated 추가 대상.

  **Acceptance Criteria**:
  - [ ] `packages/renderer/src/theme/ThemeProvider.tsx` 파일 삭제됨
  - [ ] `packages/renderer/src/theme/contract.ts` 파일 삭제됨
  - [ ] `bun -e "import { NoxionThemeProvider } from '@noxion/renderer'" 2>&1` → import error
  - [ ] `bun -e "import { defineThemeContract } from '@noxion/renderer'" 2>&1` → import error
  - [ ] `bun -e "import { HeaderProps, PostCardProps, useThemePreference, useSearch } from '@noxion/renderer'" 2>&1` → success
  - [ ] `bun -e "import { NotionPage, NoxionLogo } from '@noxion/renderer'" 2>&1` → success
  - [ ] `export PATH="$HOME/.bun/bin:$PATH" && bun test packages/renderer/` → 모든 테스트 통과 (contract 테스트는 삭제됨)
  - [ ] `bun run build --filter=@noxion/renderer` → 빌드 성공

  **Commit**: YES
  - Message: `refactor(renderer): remove theme contract/provider runtime system`
  - Files: `packages/renderer/src/theme/`, `packages/renderer/src/index.ts`, `packages/core/src/plugin.ts`

---

- [ ] 2. vanilla-extract 인프라 전면 제거

  **What to do**:
  - **theme-default**: `packages/theme-default/src/components/*.css.ts` 16개 파일 전부 삭제
  - **theme-default**: `packages/theme-default/src/layouts/*.css.ts` 파일 삭제 (존재 시)
  - **theme-default**: `packages/theme-default/src/templates/*.css.ts` 파일 삭제 (존재 시)
  - **theme-default**: `packages/theme-default/src/styles/` 디렉토리 중 VE 관련 파일 삭제. Tailwind CSS 설정은 유지.
  - **theme-beacon**: 동일하게 모든 .css.ts 파일 삭제
  - **package.json 정리**: 모든 패키지의 `@vanilla-extract/*` 의존성 제거 (`@vanilla-extract/css`, `@vanilla-extract/next-plugin`, `@vanilla-extract/recipes` 등)
  - **apps/web**: `next.config` 에서 `@vanilla-extract/next-plugin` 래핑 제거 (존재 시)
  - **apps/theme-dev**: 동일 처리
  - **tsconfig**: VE 관련 설정 제거 (존재 시)
  - **Tailwind v4 설정 확인**: `@tailwindcss/postcss` 또는 `@tailwindcss/vite` 플러그인이 독립적으로 동작하는지 확인
  - 컴포넌트 .tsx 파일에서 `.css.ts` import 문 제거 (className 할당은 빈 문자열이나 Tailwind 클래스로 임시 대체 — Task 4/5에서 본격 재작성)

  **Must NOT do**:
  - Tailwind CSS 설정 삭제 금지 (VE만 제거)
  - 컴포넌트 .tsx 파일 자체 삭제 금지 (스타일만 제거, 구조 유지)
  - theme-default/theme-beacon의 contract.ts 는 이 Task에서 건드리지 않음 (Task 4/5에서 처리)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`git-master`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 4, 5
  - **Blocked By**: None

  **References**:
  - `packages/theme-default/src/components/` — 16개 .css.ts 파일 목록: DocsBreadcrumb.css.ts, DocsSidebar.css.ts, EmptyState.css.ts, FeaturedPostCard.css.ts, Footer.css.ts, Header.css.ts, HeroSection.css.ts, NotionPage.css.ts, PortfolioFilter.css.ts, PortfolioProjectCard.css.ts, PostCard.css.ts, PostList.css.ts, Search.css.ts, TagFilter.css.ts, ThemeToggle.css.ts, TOC.css.ts
  - `packages/theme-default/src/styles/` — Tailwind 설정 vs VE 파일 구분 필요
  - `packages/theme-beacon/src/components/` — 동일 패턴 확인
  - 루트 `package.json` 및 각 패키지 `package.json` — `@vanilla-extract/*` 의존성 검색
  - `apps/web/next.config.*` — VE 플러그인 래핑 확인
  - `apps/web/app/layout.tsx:6` — `import "@noxion/theme-default/styles/tailwind"` — Tailwind import는 유지

  **Acceptance Criteria**:
  - [ ] `find packages/ -name "*.css.ts" | wc -l` → 0
  - [ ] `grep -r "vanilla-extract" packages/*/package.json | wc -l` → 0
  - [ ] `grep -r "vanilla-extract" apps/*/package.json | wc -l` → 0 (또는 파일 없음)
  - [ ] `bun run build --filter=@noxion/theme-default` → 빌드 성공 (스타일 없는 컴포넌트지만 빌드는 됨)
  - [ ] `bun run build --filter=@noxion/theme-beacon` → 빌드 성공

  **Commit**: YES
  - Message: `refactor: remove vanilla-extract infrastructure across all packages`
  - Files: `packages/theme-default/`, `packages/theme-beacon/`, `apps/web/`, root configs

---

- [ ] 3. pageType 탈하드코딩 (core + adapter-nextjs)

  **What to do**:

  **core/fetcher.ts:**
  - `detectPageType()` (line 137-147): `["blog", "docs", "portfolio"].includes(typeValue)` 체크 제거. typeValue가 있으면 그대로 반환, 없으면 fallbackType.
  - `extractPagesFromRecordMap()` (line 111-117): `if (pageType === "blog")` 정렬 로직 → PageTypeDefinition에 `sortBy` 옵션 추가하여 레지스트리 기반으로 정렬. 기본값: 정렬 없음. blog의 경우 `sortBy: { field: 'date', order: 'desc' }`.
  - `buildMetadata()` (line 196-257): blog/docs/portfolio switch문 → PageTypeDefinition의 schemaConventions에서 매핑 가져오기. METADATA_CONVENTIONS를 동적으로 빌드.

  **core/schema-mapper.ts:**
  - `METADATA_CONVENTIONS` (line 36-52): 하드코딩된 blog/docs/portfolio conventions → `getMetadataConventions(pageType)` 함수가 먼저 레지스트리에서 찾고, 없으면 기존 빌트인 폴백.
  - `buildPropertyMapping()`: pageType의 PageTypeDefinition.schemaConventions를 참조하도록 확장.

  **core/page-type-registry.ts:**
  - `BUILTIN_PAGE_TYPES` (line 30-46): 기존 3개 유지하되 `schemaConventions`와 `sortBy` 필드 추가.
  - `PageTypeDefinition` 인터페이스 확장 (`types.ts`):
    ```typescript
    sortBy?: { field: string; order: 'asc' | 'desc' };
    sitemapConfig?: { priority: number; changefreq: string };
    structuredDataType?: string; // 'BlogPosting', 'TechArticle', 'CreativeWork', etc.
    metadataConfig?: { openGraphType: string };
    ```

  **adapter-nextjs/sitemap.ts:**
  - `getPriority()` / `getChangeFrequency()` (line 12-28): switch문 → `PageTypeDefinition.sitemapConfig`에서 읽기. 미설정 시 기본값(priority: 0.5, changefreq: 'weekly').

  **adapter-nextjs/structured-data.ts:**
  - `generatePageLD()` (line 162-176): switch문 → `PageTypeDefinition.structuredDataType` 기반 디스패치. 'BlogPosting'→generateBlogPostingLD, 'TechArticle'→generateTechArticleLD, 'CreativeWork'→generateCreativeWorkLD. 미지정 시 generateBlogPostingLD 폴백.

  **adapter-nextjs/metadata.ts:**
  - `isBlog` (line 37): `page.pageType === "blog"` → `PageTypeDefinition.metadataConfig?.openGraphType === 'article'`. 또는 pageType의 config에서 결정.

  **API 호환성**: `fetchBlogPosts()`는 `@deprecated` 마킹하되 유지. 내부적으로 `fetchCollection({ pageType: 'blog' })`를 호출하도록 리팩터.

  **Must NOT do**:
  - fetchBlogPosts, fetchPostBySlug, fetchAllSlugs 삭제 금지 (deprecated, 하위 호환)
  - 빌트인 3개 타입(blog/docs/portfolio) 등록 제거 금지 (기본값으로 유지)
  - generateBlogPostingLD, generateTechArticleLD, generateCreativeWorkLD 개별 함수 삭제 금지 (public API)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`git-master`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 9
  - **Blocked By**: None

  **References**:
  - `packages/core/src/fetcher.ts:111-117` — blog 전용 정렬 로직
  - `packages/core/src/fetcher.ts:137-147` — detectPageType 하드코딩
  - `packages/core/src/fetcher.ts:196-257` — buildMetadata switch문 (blog/docs/portfolio)
  - `packages/core/src/schema-mapper.ts:36-52` — METADATA_CONVENTIONS 하드코딩
  - `packages/core/src/schema-mapper.ts:89-149` — buildPropertyMapping (getMetadataConventions 호출)
  - `packages/core/src/page-type-registry.ts:30-46` — BUILTIN_PAGE_TYPES
  - `packages/core/src/types.ts:173-184` — PageTypeDefinition 인터페이스 (확장 대상)
  - `packages/adapter-nextjs/src/sitemap.ts:12-28` — getPriority, getChangeFrequency switch문
  - `packages/adapter-nextjs/src/structured-data.ts:162-176` — generatePageLD switch문
  - `packages/adapter-nextjs/src/metadata.ts:37` — isBlog 체크
  - `packages/adapter-nextjs/src/routes.ts:9-13` — DEFAULT_ROUTE_CONFIGS (blog/docs/portfolio) — config 기반으로 전환 가능하나, generateNoxionRoutes가 이미 collections에서 동적으로 처리하므로 DEFAULT는 폴백으로 유지

  **Acceptance Criteria**:
  - [ ] 테스트: 커스텀 pageType "gallery" 등록 후 fetchCollection → NoxionPage 반환, pageType="gallery"
  - [ ] 테스트: "gallery" pageType의 sitemapConfig가 sitemap 생성에 반영됨
  - [ ] 테스트: "gallery" pageType의 structuredDataType이 generatePageLD에서 처리됨
  - [ ] 테스트: 기존 blog/docs/portfolio 타입은 변경 없이 동작
  - [ ] `grep -rn '"blog"\|"docs"\|"portfolio"' packages/core/src/fetcher.ts` → buildMetadata에 직접 분기 없음 (레지스트리 경유만)
  - [ ] `export PATH="$HOME/.bun/bin:$PATH" && bun test packages/core/` → 통과
  - [ ] `export PATH="$HOME/.bun/bin:$PATH" && bun test packages/adapter-nextjs/` → 통과
  - [ ] `bun run build --filter=@noxion/core --filter=@noxion/adapter-nextjs` → 성공

  **Commit**: YES
  - Message: `refactor(core,adapter): de-hardcode pageType, use PageTypeDefinition registry`
  - Files: `packages/core/src/`, `packages/adapter-nextjs/src/`

---

- [ ] 4. theme-default Tailwind-only 재작성 (16 컴포넌트 + 3 레이아웃 + 7 템플릿)

  **What to do**:
  - 16개 컴포넌트 각각을 Tailwind 유틸리티 클래스만으로 재스타일링
  - 3개 레이아웃 (BaseLayout, BlogLayout, DocsLayout) Tailwind 전환
  - 7개 템플릿 (HomePage, PostPage, ArchivePage, TagPage, DocsPage, PortfolioGrid, PortfolioProject) Tailwind 전환
  - **contract.ts 삭제** — defineThemeContract 호출, NoxionThemeContract 임포트 제거
  - **index.ts 수정** — contract export 제거, 개별 컴포넌트/레이아웃/템플릿만 export
  - **registry.json 생성** — 컴포넌트 목록, 의존성, 카테고리 등 메타데이터 (noxion add가 사용)
  - 다크모드: `dark:` variant 사용. `[data-theme="dark"]` 셀렉터가 html 요소에 설정되므로 Tailwind config에서 `darkMode: { selector: '[data-theme="dark"]' }` (v4에서는 `@variant dark (&:where([data-theme="dark"] *))`)
  - 컬러 토큰: CSS 변수 (`--color-primary`, `--color-background` 등)를 Tailwind theme에 연결. globals.css에서 정의, 컴포넌트에서 `text-primary`, `bg-background` 등으로 사용.

  **registry.json 구조**:
  ```json
  {
    "name": "default",
    "components": {
      "header": {
        "file": "components/Header.tsx",
        "dependencies": [],
        "category": "layout"
      },
      "post-card": {
        "file": "components/PostCard.tsx",
        "dependencies": [],
        "category": "content"
      },
      "post-list": {
        "file": "components/PostList.tsx",
        "dependencies": ["post-card"],
        "category": "content"
      },
      "hero-section": {
        "file": "components/HeroSection.tsx",
        "dependencies": ["post-card"],
        "category": "content"
      }
    },
    "layouts": {
      "blog-layout": {
        "file": "layouts/BlogLayout.tsx",
        "dependencies": []
      }
    },
    "templates": {
      "home-page": {
        "file": "templates/HomePage.tsx",
        "dependencies": ["hero-section", "post-list", "tag-filter", "search"]
      }
    },
    "styles": {
      "globals": "styles/globals.css"
    }
  }
  ```

  **Must NOT do**:
  - Prop 인터페이스 변경 금지 (HeaderProps, PostCardProps 등은 @noxion/renderer에서 import)
  - 컴포넌트 로직/기능 변경 금지 (스타일링만 전환)
  - 새 컴포넌트 추가 금지 (기존 26개만 전환)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Tailwind 스타일링, 다크모드, 반응형 레이아웃

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 5)
  - **Blocks**: Tasks 6, 7, 8
  - **Blocked By**: Task 2

  **References**:
  - `packages/theme-default/src/components/Header.tsx` — 현재 컴포넌트 구조 (VE import 제거 후 Tailwind 적용)
  - `packages/theme-default/src/components/index.ts` — export 목록 (16개 컴포넌트)
  - `packages/theme-default/src/layouts/` — BaseLayout, BlogLayout, DocsLayout
  - `packages/theme-default/src/templates/` — 7개 템플릿
  - `packages/theme-default/src/contract.ts` — 삭제 대상. defineThemeContract 호출 구조 참조.
  - `packages/renderer/src/theme/types.ts:68-181` — prop 인터페이스 정의 (변경 금지, 참조만)
  - `packages/renderer/src/hooks/useTheme.ts:14-17` — applyTheme 함수. `document.documentElement.dataset.theme = resolved` → Tailwind dark mode selector와 연결
  - shadcn/ui 패턴 참고: 각 컴포넌트가 `className` prop을 받고, `cn()` 유틸 사용 (clsx + tailwind-merge)

  **Acceptance Criteria**:
  - [ ] `packages/theme-default/src/contract.ts` 파일 삭제됨
  - [ ] `find packages/theme-default -name "*.css.ts" | wc -l` → 0 (Task 2에서 이미 삭제됨, 확인)
  - [ ] `packages/theme-default/src/registry.json` 존재하며 모든 컴포넌트/레이아웃/템플릿 등록
  - [ ] 모든 컴포넌트 .tsx에서 `import ... from './*.css'` 구문 없음
  - [ ] 모든 컴포넌트 .tsx에서 Tailwind 유틸리티 클래스 사용
  - [ ] `bun run build --filter=@noxion/theme-default` → 성공
  - [ ] `export PATH="$HOME/.bun/bin:$PATH" && bun test packages/theme-default/` → 통과

  **Commit**: YES
  - Message: `refactor(theme-default): convert to Tailwind-only component registry, remove contract`
  - Files: `packages/theme-default/src/`

---

- [ ] 5. theme-beacon Tailwind-only 재작성

  **What to do**:
  - theme-beacon의 모든 컴포넌트, 레이아웃, 템플릿을 Tailwind-only로 전환
  - contract.ts 삭제
  - index.ts에서 contract export 제거
  - registry.json 생성 (Task 4와 동일 구조)
  - beacon의 디자인 특성 유지 (wide layout, content-first)

  **Must NOT do**:
  - beacon의 디자인 언어 변경 금지 (wide layout, 특유의 spacing)
  - default와 동일한 스타일 적용 금지 (별개 테마)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:
  - `packages/theme-beacon/src/` — 현재 구조 (components, layouts, templates, contract.ts, index.ts, styles)
  - `packages/theme-beacon/src/contract.ts` — 삭제 대상
  - Task 4의 registry.json 구조 — 동일 패턴 적용

  **Acceptance Criteria**:
  - [ ] `packages/theme-beacon/src/contract.ts` 삭제됨
  - [ ] `find packages/theme-beacon -name "*.css.ts" | wc -l` → 0
  - [ ] `packages/theme-beacon/src/registry.json` 존재
  - [ ] `bun run build --filter=@noxion/theme-beacon` → 성공
  - [ ] `export PATH="$HOME/.bun/bin:$PATH" && bun test packages/theme-beacon/` → 통과

  **Commit**: YES
  - Message: `refactor(theme-beacon): convert to Tailwind-only component registry, remove contract`
  - Files: `packages/theme-beacon/src/`

---

- [ ] 6. create-noxion 스캐폴드 업데이트 — 컴포넌트 복사 모델

  **What to do**:
  - 4개 사이트 템플릿 (nextjs, docs, portfolio, full) 전면 재작성:
    - `providers.tsx` 제거 (NoxionThemeProvider 없음)
    - `layout.tsx`에서 직접 `import { Header } from "@/components/noxion/header"` 패턴
    - `globals.css`에 CSS 변수 토큰 정의 (color, font, spacing)
    - 컴포넌트를 `src/components/noxion/` 디렉토리에 포함
  - **scaffold.ts** 확장:
    - theme-default (또는 지정 테마)의 registry.json 읽기
    - 템플릿 타입에 필요한 컴포넌트만 선별 복사
      - blog: Header, Footer, PostCard, FeaturedPostCard, PostList, HeroSection, TOC, Search, TagFilter, ThemeToggle, EmptyState, NotionPage + BlogLayout + HomePage, PostPage, ArchivePage, TagPage
      - docs: + DocsSidebar, DocsBreadcrumb, DocsLayout, DocsPage
      - portfolio: + PortfolioProjectCard, PortfolioFilter, PortfolioGrid, PortfolioProject
      - full: 전부
    - 복사된 컴포넌트의 import 경로 재작성 (`@noxion/renderer` → `@/components/noxion/...` 등)
  - **ScaffoldOptions** 확장: `theme?: string` (default: 'default', 선택: 'beacon')
  - **package.json 템플릿**: @noxion/theme-default 의존성 제거 (컴포넌트가 복사되므로 불필요). @noxion/renderer는 축소된 상태로 유지 (NotionPage, hooks용).
  - `--theme` 플래그 추가: `bunx create-noxion my-blog --theme=beacon`
  - theme scaffold 제거 또는 수정 (C 모델에서 "테마 만들기" = "컴포넌트 레지스트리 만들기")

  **Must NOT do**:
  - plugin scaffold 변경 금지 (별도 기능)
  - @noxion/core, @noxion/adapter-nextjs 의존성 제거 금지
  - 비-interactive 모드(--yes) 깨트리기 금지

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`git-master`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 4

  **References**:
  - `packages/create-noxion/src/scaffold.ts` — 현재 스캐폴딩 로직 (101줄). resolveTemplateVariables, scaffoldProject, copyTemplateDir.
  - `packages/create-noxion/src/index.ts` — CLI 엔트리. runSiteScaffold, runPluginScaffold, runThemeScaffold, parseFlags.
  - `packages/create-noxion/src/templates/` — 6개 템플릿 디렉토리 (nextjs, docs, portfolio, full, plugin, theme)
  - `packages/theme-default/src/registry.json` — Task 4에서 생성되는 컴포넌트 메타데이터
  - `apps/web/app/providers.tsx` — 현재 Provider 패턴 (삭제 대상 참조)
  - `apps/web/app/layout.tsx` — 새 패턴 참조 (직접 import)

  **Acceptance Criteria**:
  - [ ] `bunx create-noxion test-project --yes --template=blog` → `test-project/src/components/noxion/` 디렉토리 존재
  - [ ] 생성된 프로젝트에 `providers.tsx` 없음 (NoxionThemeProvider 사용 안 함)
  - [ ] 생성된 프로젝트의 `package.json`에 `@noxion/theme-default` 의존성 없음
  - [ ] 생성된 프로젝트의 컴포넌트 .tsx에서 `@noxion/theme-default` import 없음
  - [ ] `--theme=beacon` 옵션으로 beacon 컴포넌트 복사 확인
  - [ ] `export PATH="$HOME/.bun/bin:$PATH" && bun test packages/create-noxion/` → 통과 (기존 2개 실패 제외)

  **Commit**: YES
  - Message: `feat(create-noxion): scaffold with copied components instead of theme dependency`
  - Files: `packages/create-noxion/src/`, `packages/create-noxion/src/templates/`

---

- [ ] 7. `noxion add` CLI 명령 구현

  **What to do**:
  - 새 CLI 명령: `bunx noxion add <component-name> [--from=<theme>] [--overwrite]`
  - 기능:
    - registry.json에서 컴포넌트 찾기
    - 의존성 자동 해석 (post-list → post-card 자동 포함)
    - 소스 파일 복사 → `src/components/noxion/`
    - import 경로 재작성
    - 이미 존재하는 파일 처리 (--overwrite 없으면 skip + 경고)
  - **noxion diff** 서브커맨드: `bunx noxion diff <component-name>` — 현재 파일과 레지스트리 원본 비교
  - **noxion list** 서브커맨드: `bunx noxion list [--from=<theme>]` — 사용 가능한 컴포넌트 목록
  - CLI 엔트리 포인트: `packages/create-noxion/src/index.ts`에 `add`, `diff`, `list` 커맨드 추가 (또는 별도 `packages/noxion-cli/` 패키지)
  - 레지스트리 접근: theme 패키지가 npm에 설치되어 있으면 `node_modules/`에서, 아니면 모노레포 워크스페이스에서 resolve

  **Must NOT do**:
  - create-noxion의 기존 `bun create noxion` 흐름 변경 금지
  - 레지스트리에 없는 컴포넌트 추가 시도 금지 (에러 반환)
  - 사용자 코드 자동 수정 금지 (파일 복사만, import 추가는 사용자 몫)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`git-master`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 4

  **References**:
  - `packages/create-noxion/src/index.ts` — CLI 구조 참조. @clack/prompts 사용, parseFlags 패턴.
  - `packages/create-noxion/src/scaffold.ts` — 파일 복사 유틸리티 (copyTemplateDir, resolveTemplateVariables).
  - `packages/theme-default/src/registry.json` — Task 4에서 생성. 컴포넌트 의존성 그래프.
  - shadcn/ui CLI 참고: `npx shadcn@latest add button` 패턴. 의존성 해석, 파일 복사, 충돌 처리.

  **Acceptance Criteria**:
  - [ ] `bunx noxion list` → 사용 가능한 컴포넌트 목록 출력
  - [ ] `bunx noxion add post-card` → `src/components/noxion/post-card.tsx` 생성
  - [ ] `bunx noxion add post-list` → post-card도 자동으로 함께 복사 (의존성)
  - [ ] `bunx noxion add post-card` (이미 존재 시) → skip 경고 메시지
  - [ ] `bunx noxion add post-card --overwrite` → 덮어쓰기
  - [ ] `bunx noxion add post-card --from=beacon` → beacon 레지스트리에서 복사
  - [ ] `bunx noxion diff post-card` → 현재 파일과 레지스트리 원본 diff 출력
  - [ ] `export PATH="$HOME/.bun/bin:$PATH" && bun test packages/create-noxion/` → 통과

  **Commit**: YES
  - Message: `feat(cli): implement noxion add/diff/list commands for component management`
  - Files: `packages/create-noxion/src/`

---

- [ ] 8. apps/web + apps/theme-dev 마이그레이션

  **What to do**:

  **apps/web:**
  - `app/providers.tsx` 삭제 — NoxionThemeProvider, defaultThemeContract import 제거
  - `app/layout.tsx` 수정:
    - Header, Footer를 로컬 컴포넌트에서 직접 import (또는 theme-default에서)
    - BlogLayout으로 직접 래핑
    - ThemeProvider 없이 동작
  - `app/home-content.tsx` 수정: useThemeComponent 호출 있으면 직접 import으로 전환
  - 모든 페이지에서 `useThemeComponent`, `useThemeLayout`, `useThemeTemplate` 사용 제거
  - `package.json`: @noxion/theme-default는 의존성으로 유지 (monorepo 내이므로, 컴포넌트 소스로 참조)
  - `globals.css` 확장: CSS 변수 토큰 정의 (theme-default의 기본값)

  **apps/theme-dev:**
  - Provider 패턴 제거
  - 직접 import 패턴으로 전환
  - 테마 프리뷰 기능은 유지 (다른 테마 컴포넌트 미리보기)

  **Must NOT do**:
  - Notion 데이터 페칭 로직 변경 금지
  - SEO/메타데이터 로직 변경 금지
  - 라우팅 구조 변경 금지

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 7)
  - **Blocks**: Task 9
  - **Blocked By**: Tasks 1, 4

  **References**:
  - `apps/web/app/providers.tsx` — 삭제 대상 (36줄). NoxionThemeProvider + defaultThemeContract + Header/Footer/BlogLayout import.
  - `apps/web/app/layout.tsx` — 수정 대상. 현재 `<Providers>` 래핑 → 직접 Header/Footer/Layout 사용.
  - `apps/web/app/page.tsx` — HomeContent import 확인.
  - `apps/web/app/home-content.tsx` — useThemeComponent 사용 여부 확인.
  - `apps/web/app/[slug]/page.tsx` — 포스트 페이지 구조.
  - `apps/theme-dev/` — 현재 구조 확인 필요.

  **Acceptance Criteria**:
  - [ ] `apps/web/app/providers.tsx` 삭제됨
  - [ ] `grep -r "NoxionThemeProvider" apps/web/ | wc -l` → 0
  - [ ] `grep -r "useThemeComponent\|useThemeLayout\|useThemeTemplate" apps/web/ | wc -l` → 0
  - [ ] `grep -r "defaultThemeContract" apps/web/ | wc -l` → 0
  - [ ] `bun run build --filter=web` → 성공 (apps/web은 `--webpack` 플래그 필요할 수 있음)
  - [ ] `bun run dev` (apps/web) → localhost:3000 정상 렌더링 (Playwright로 확인)

  **Commit**: YES
  - Message: `refactor(apps): migrate to direct component imports, remove theme provider`
  - Files: `apps/web/app/`, `apps/theme-dev/`

---

- [ ] 9. 통합 테스트 + 빌드 검증

  **What to do**:
  - `bun run build` — 12/12 패키지 빌드 성공 확인
  - `bun test` — 전체 테스트 통과 확인 (기존 create-noxion 2개 실패 제외)
  - **E2E 검증**:
    - `bunx create-noxion e2e-test --yes` → 프로젝트 생성
    - 생성된 프로젝트에서 `bun install && bun run build` → 성공
    - src/components/noxion/ 디렉토리에 컴포넌트 존재 확인
  - **커스텀 pageType 검증**: noxion.config.ts에 커스텀 타입 등록 → fetcher가 처리하는지 테스트
  - **다크모드 검증**: data-theme 속성 전환 시 Tailwind dark: 스타일 적용 확인
  - **Breaking change 목록 작성**: CHANGELOG에 포함할 breaking changes 정리
  - 문서 업데이트 필요 사항 목록 작성 (실제 업데이트는 별도 플랜)

  **Must NOT do**:
  - 문서 업데이트 (이 Task에서는 목록만)
  - 새 기능 추가
  - 성능 최적화

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`, `git-master`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (single task)
  - **Blocks**: None (final)
  - **Blocked By**: All (1-8)

  **References**:
  - 모든 이전 Task의 acceptance criteria — 최종 확인
  - `turbo.json` — 빌드 파이프라인 순서
  - `apps/web/` — E2E 검증 대상

  **Acceptance Criteria**:
  - [ ] `bun run build` → 12/12 성공 (0 failures)
  - [ ] `export PATH="$HOME/.bun/bin:$PATH" && bun test` → 473+ 테스트 통과 (create-noxion 기존 2개 실패 제외)
  - [ ] E2E: `bunx create-noxion e2e-test --yes` → 프로젝트 생성 성공
  - [ ] E2E: 생성된 프로젝트 `bun install && bun run build` → 성공
  - [ ] `grep -r "NoxionThemeContract\|NoxionThemeProvider\|defineThemeContract\|validateThemeContract" packages/renderer/src/ | wc -l` → 0
  - [ ] `find packages/ -name "*.css.ts" | wc -l` → 0
  - [ ] Breaking changes 목록 파일 생성: `.sisyphus/evidence/breaking-changes.md`

  **Commit**: YES
  - Message: `test: verify integration after copy-dont-import migration`
  - Files: test files, `.sisyphus/evidence/`

---

## Commit Strategy

| After Task | Message | Key Files | Verification |
|------------|---------|-----------|--------------|
| 1 | `refactor(renderer): remove theme contract/provider runtime system` | renderer/ | bun test packages/renderer/ && bun run build --filter=@noxion/renderer |
| 2 | `refactor: remove vanilla-extract infrastructure across all packages` | theme-default/, theme-beacon/, apps/ | bun run build |
| 3 | `refactor(core,adapter): de-hardcode pageType, use PageTypeDefinition registry` | core/, adapter-nextjs/ | bun test packages/core/ && bun test packages/adapter-nextjs/ |
| 4 | `refactor(theme-default): convert to Tailwind-only component registry, remove contract` | theme-default/ | bun run build --filter=@noxion/theme-default |
| 5 | `refactor(theme-beacon): convert to Tailwind-only component registry, remove contract` | theme-beacon/ | bun run build --filter=@noxion/theme-beacon |
| 6 | `feat(create-noxion): scaffold with copied components instead of theme dependency` | create-noxion/ | bun test packages/create-noxion/ |
| 7 | `feat(cli): implement noxion add/diff/list commands for component management` | create-noxion/ | bun test packages/create-noxion/ |
| 8 | `refactor(apps): migrate to direct component imports, remove theme provider` | apps/ | bun run build --filter=web |
| 9 | `test: verify integration after copy-dont-import migration` | tests, evidence | bun run build && bun test |

---

## Success Criteria

### Verification Commands
```bash
# 전체 빌드
bun run build  # Expected: 12/12 success

# 전체 테스트
export PATH="$HOME/.bun/bin:$PATH" && bun test  # Expected: 473+ pass, 2 known failures

# contract 제거 확인
grep -r "NoxionThemeContract\|NoxionThemeProvider\|defineThemeContract" packages/renderer/src/
# Expected: 0 matches

# VE 제거 확인
find packages/ -name "*.css.ts"
# Expected: 0 files

# E2E scaffold
bunx create-noxion e2e-test --yes && ls e2e-test/src/components/noxion/
# Expected: header.tsx, footer.tsx, post-card.tsx, ...
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass
- [ ] 12/12 builds succeed
- [ ] create-noxion produces working projects with copied components
- [ ] noxion add command works with dependency resolution
- [ ] Custom pageType can be registered and used end-to-end
- [ ] Dark mode works without ThemeProvider
