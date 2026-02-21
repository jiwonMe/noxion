# Theme System Redesign: 3-Layer Progressive Customization Architecture

## TL;DR

> **Quick Summary**: Noxion의 테마 시스템을 CSS 변수 only "스킨"에서 Design Tokens → Layout System → Page Templates 3-Layer 아키텍처로 재설계. npm 테마 패키지 컨벤션 수립, 모든 컴포넌트를 inline style에서 CSS class 기반으로 마이그레이션, 슬롯 기반 레이아웃 + React 컴포넌트 템플릿 시스템 구현.
>
> **Deliverables**:
> - 새로운 테마 타입 시스템 (`NoxionTheme` v2, `SlotMap`, `TemplateMap`, `ThemePackage` 인터페이스)
> - CSS class 기반 컴포넌트 (기존 8개 + 레이아웃/템플릿 컴포넌트)
> - BEM 기반 기본 스타일시트 (`noxion.css`)
> - 슬롯 기반 레이아웃 시스템 (BlogLayout, DocsLayout 등)
> - React 컴포넌트 페이지 템플릿 (HomePage, PostPage 등)
> - `@noxion/theme-default` 패키지 (기본 테마)
> - ThemeProvider v2 (progressive resolution)
> - `@noxion/core` 타입 브릿지 업데이트
> - `apps/web` 마이그레이션
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 3 → Task 5 → Task 7 → Task 9 → Task 11

---

## Context

### Original Request
현재 CSS 변수 기반 테마 시스템은 색상/폰트만 변경 가능한 "스킨" 수준. 미니멀 블로그, 매거진 블로그, 포트폴리오, 랜딩 페이지, 문서 사이트 등 자유도 높은 웹사이트 구현이 불가. 3-Layer progressive customization 아키텍처로 재설계 필요.

### Interview Summary
**Key Discussions**:
- 타겟 사용자: 개발자 + 비개발자가 사용하는 LLM 코드 에이전트 → 타입이 문서, 컨벤션 기반 예측 가능한 구조 필수
- 지원 사이트: 미니멀 블로그, 매거진 블로그, 포트폴리오, 랜딩 페이지, 문서 사이트 전부
- 접근: 하이브리드 C — zero-config 기본 작동 + 점진적 커스터마이징
- 테마 단위: npm 패키지 (@noxion/theme-*)
- 템플릿: React 컴포넌트 with named slots
- 스타일링: inline style → CSS class (BEM)
- 테스트: TDD with bun test

**Research Findings**:
- `packages/core/src/types.ts`: `NoxionThemeConfig = unknown`, `ComponentOverrides = unknown` — placeholder 상태. 새 타입 시스템과 브릿지 필요
- `packages/renderer/src/theme/`: 5개 파일 (types.ts, define-theme.ts, css-generator.ts, ThemeProvider.tsx, component-resolver.ts)
- 기존 ComponentOverrides: 8개 컴포넌트 교체 가능 (Header, Footer, PostCard, PostList, NotionPage, TOC, Search, TagFilter)
- NotionPage는 `react-notion-x`의 NotionRenderer를 wrapping — 자체 CSS 존재
- `apps/web/app/providers.tsx`: 고정 구조 (Header → main → Footer)
- 기존 테스트: `bun:test` 기반, theme.test.ts (30 tests), hooks.test.ts 존재

### Gap Analysis (Self-performed, Metis unavailable)
**Identified Gaps** (addressed in plan):
- `@noxion/core` config 타입이 `unknown`으로 placeholder → Task 10에서 브릿지 타입 정의
- react-notion-x CSS 공존 문제 → Task 4 NotionPage 마이그레이션 시 처리
- SSR/FOUC 방지 → Task 7 ThemeProvider에서 CSS injection 순서 보장
- 테마 패키지에 모든 템플릿이 없을 때 fallback → Task 7 resolution logic에 포함
- CSS class naming이 public API가 됨 → Guardrail에 반영
- create-noxion CLI 변경 → OUT OF SCOPE (별도 작업)
- 반응형 디자인 (breakpoints) → 토큰 시스템에 포함하되 구현은 기본 테마 범위

---

## Work Objectives

### Core Objective
Noxion 테마 시스템을 3-Layer progressive customization 아키텍처로 재설계하여, LLM 코드 에이전트가 zero-config부터 full eject까지 점진적으로 사이트를 커스터마이징할 수 있게 한다.

### Concrete Deliverables
- `packages/renderer/src/theme/types.ts` — v2 타입 시스템
- `packages/renderer/src/theme/css-generator.ts` — v2 CSS 생성 (BEM class 기반)
- `packages/renderer/src/theme/ThemeProvider.tsx` — v2 progressive resolution
- `packages/renderer/src/theme/slot-resolver.ts` — 슬롯 resolution 로직
- `packages/renderer/src/theme/template-resolver.ts` — 템플릿 resolution 로직
- `packages/renderer/src/layouts/` — 슬롯 기반 레이아웃 컴포넌트들
- `packages/renderer/src/templates/` — 페이지 템플릿 컴포넌트들
- `packages/renderer/src/styles/noxion.css` — 기본 스타일시트
- `packages/renderer/src/components/*.tsx` — inline style → CSS class 마이그레이션
- `packages/theme-default/` — @noxion/theme-default 패키지
- `packages/core/src/types.ts` — NoxionThemeConfig/ComponentOverrides 타입 업데이트
- `apps/web/` — 새 테마 시스템으로 마이그레이션

### Definition of Done
- [ ] `bun test` — 모든 기존 + 새 테스트 통과
- [ ] `bun run build` — packages/renderer, packages/core, packages/theme-default 빌드 성공
- [ ] `apps/web`이 @noxion/theme-default로 zero-config 실행 가능
- [ ] Level 1 (토큰 override), Level 2 (슬롯 override), Level 3 (템플릿 override) 시나리오가 타입 안전하게 동작

### Must Have
- Zero-config 기본 동작 (기존과 동일하게 `bun create noxion` → 바로 실행)
- CSS class 기반 스타일링 (모든 inline style 제거)
- BEM 네이밍 컨벤션 (`noxion-{block}__{element}--{modifier}`)
- 강력한 TypeScript 타입 (LLM 에이전트가 타입으로 API 파악)
- 다크/라이트/시스템 모드 유지 (기존 `data-theme` 메커니즘)
- 슬롯 기반 레이아웃 (Header, Sidebar, Content, Footer 최소 슬롯)
- 페이지 템플릿 (최소 HomePage, PostPage)
- 기본 테마 패키지 (@noxion/theme-default)

### Must NOT Have (Guardrails)
- Visual theme editor/dashboard (GUI) — OUT OF SCOPE
- 5개 사이트 유형 모두를 위한 별도 테마 패키지 — 기본 테마 1개만
- 페이지 라우팅 로직 변경 — Next.js App Router 영역
- Animation/transition 시스템 — 토큰에 변수만 제공, 시스템 미구현
- Typography scale 시스템 — 폰트 변수만 제공
- `create-noxion` CLI 변경 — 별도 작업
- 불필요한 추상화 (모든 것에 factory/builder pattern 적용 금지)
- JSDoc 과잉 — TypeScript 타입이 self-documenting
- CSS 변수명 변경 시 breaking change 무시 — `--noxion-*` prefix 유지

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: YES (bun:test, packages/renderer/src/__tests__/)
- **User wants tests**: TDD
- **Framework**: bun test

### TDD Workflow
Each TODO follows RED-GREEN-REFACTOR:
1. **RED**: Write failing test first
2. **GREEN**: Implement minimum code to pass
3. **REFACTOR**: Clean up while keeping green

Test commands:
- 단일 파일: `bun test packages/renderer/src/__tests__/{file}.test.ts`
- 전체: `bun test`
- 빌드: `bun run build`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: 타입 시스템 v2 설계
└── Task 2: CSS 아키텍처 (BEM 컨벤션 + noxion.css)

Wave 2 (After Wave 1):
├── Task 3: CSS Generator v2
├── Task 4: 컴포넌트 마이그레이션 (inline → CSS class)
├── Task 5: 슬롯 기반 레이아웃 시스템
└── Task 6: 페이지 템플릿 시스템

Wave 3 (After Wave 2):
├── Task 7: ThemeProvider v2 (progressive resolution)
├── Task 8: @noxion/theme-default 패키지
├── Task 9: @noxion/core 타입 브릿지
├── Task 10: apps/web 마이그레이션
└── Task 11: 통합 테스트 + 빌드 검증
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 4, 5, 6, 7, 8, 9 | 2 |
| 2 | None | 3, 4 | 1 |
| 3 | 1, 2 | 7, 8 | 4, 5, 6 |
| 4 | 1, 2 | 8, 10 | 3, 5, 6 |
| 5 | 1 | 7, 8, 10 | 3, 4, 6 |
| 6 | 1 | 7, 8, 10 | 3, 4, 5 |
| 7 | 3, 5, 6 | 8, 10 | 9 |
| 8 | 3, 4, 5, 6, 7 | 10 | 9 |
| 9 | 1 | 10 | 7, 8 |
| 10 | 7, 8, 9 | 11 | None |
| 11 | 10 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Approach |
|------|-------|---------------------|
| 1 | 1, 2 | 2 parallel agents (types + CSS) |
| 2 | 3, 4, 5, 6 | 4 parallel agents (generator, components, layouts, templates) |
| 3 | 7, 8, 9 → 10 → 11 | 7+8+9 parallel → 10 sequential → 11 sequential |

---

## TODOs

- [x] 1. 타입 시스템 v2 설계

  **What to do**:
  - `packages/renderer/src/theme/types.ts` 에 새로운 타입 추가 (기존 타입은 유지하면서 확장)
  - 새 타입 정의:
    - `NoxionThemeTokens` — 확장된 디자인 토큰 (기존 NoxionThemeColors + fonts + spacing + 새 토큰: shadows, transitions, breakpoints)
    - `NoxionSlotMap` — 레이아웃 슬롯 정의 (header, sidebar, content, footer, hero, breadcrumb 등)
    - `NoxionTemplateMap` — 페이지 템플릿 맵 (home, post, archive, tag, custom)
    - `NoxionThemePackage` — npm 테마 패키지가 export하는 인터페이스 (tokens, layouts, templates, components, stylesheetPath)
    - `NoxionLayoutProps` — 레이아웃 컴포넌트의 공통 props (slots, children, className)
    - `NoxionTemplateProps` — 템플릿 컴포넌트의 공통 props (data, layout, slots override)
  - 기존 `NoxionTheme` 인터페이스는 `NoxionThemeTokens` 확장으로 리팩터
  - 기존 `ComponentOverrides` → `NoxionSlotMap`으로 진화 (하위 호환 유지)
  - 기존 `NoxionLayout` 유니온 타입 → enum 확장 (custom layout 지원)
  - TDD: 테스트에서 타입이 올바른 구조를 강제하는지 확인 (컴파일 타임 검증)

  **Must NOT do**:
  - 기존 export된 타입 삭제 금지 (하위 호환)
  - runtime validation 추가 금지 (타입만으로 충분)
  - 과도한 generic 중첩 금지 (LLM이 읽기 어려움)

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: 타입 시스템 설계는 깊은 논리적 사고 + 하위 호환 고려 필요
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 컴포넌트 인터페이스와 슬롯/템플릿 구조 도메인 이해

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: 3, 4, 5, 6, 7, 8, 9
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `packages/renderer/src/theme/types.ts:1-97` — 현재 전체 타입 시스템. NoxionTheme, NoxionThemeColors, ComponentOverrides 등이 정의됨. 이를 확장해야 함 (삭제 아닌 확장)
  - `packages/renderer/src/theme/component-resolver.ts:1-21` — 현재 ComponentOverrides 해석 패턴. defaults + overrides 머지 로직. 새 SlotMap에서도 동일 패턴 유지 필요

  **API/Type References**:
  - `packages/core/src/types.ts:66-68` — `NoxionThemeConfig = unknown`, `ComponentOverrides = unknown` — 현재 placeholder. Task 9에서 이 타입들이 새 타입 시스템을 참조하도록 업데이트됨. 여기서는 renderer 내부 타입만 설계
  - `packages/core/src/types.ts:10-25` — `NoxionConfig` 인터페이스의 `theme?`, `layout?`, `components?` 필드가 새 타입과 호환되어야 함

  **Test References**:
  - `packages/renderer/src/__tests__/theme.test.ts:8-47` — defineTheme 테스트 패턴. 새 타입이 defineTheme과 호환되어야 함
  - `packages/renderer/src/__tests__/theme.test.ts:142-181` — resolveComponents 테스트 패턴. 새 slot resolver 테스트의 기반

  **Acceptance Criteria**:

  - [ ] 테스트 파일 생성: `packages/renderer/src/__tests__/types-v2.test.ts`
  - [ ] 타입 검증 테스트: 올바른 ThemePackage 구조가 타입 체크 통과
  - [ ] 타입 검증 테스트: 잘못된 ThemePackage 구조가 컴파일 에러 (ts-expect-error)
  - [ ] 기존 `defineTheme(defaultTheme)` 호출이 여전히 타입 체크 통과
  - [ ] 기존 `resolveComponents` 호출이 여전히 타입 체크 통과
  - [ ] `bun test packages/renderer/src/__tests__/types-v2.test.ts` → PASS

  ```bash
  bun test packages/renderer/src/__tests__/types-v2.test.ts
  # Assert: All tests PASS
  bun test packages/renderer/src/__tests__/theme.test.ts
  # Assert: All existing tests still PASS (backward compat)
  ```

  **Commit**: YES
  - Message: `feat(renderer): add v2 type system for 3-layer theme architecture`
  - Files: `packages/renderer/src/theme/types.ts`, `packages/renderer/src/__tests__/types-v2.test.ts`
  - Pre-commit: `bun test packages/renderer/src/__tests__/`

---

- [x] 2. CSS 아키텍처 설계 (BEM 컨벤션 + 기본 스타일시트)

  **What to do**:
  - BEM 네이밍 컨벤션 문서화 및 기본 스타일시트 생성
  - 네이밍 규칙:
    - Block: `noxion-{component}` (예: `noxion-header`, `noxion-post-card`)
    - Element: `noxion-{component}__{element}` (예: `noxion-header__nav`, `noxion-post-card__title`)
    - Modifier: `noxion-{component}--{modifier}` (예: `noxion-header--sticky`, `noxion-post-card--featured`)
  - `packages/renderer/src/styles/noxion.css` 생성:
    - 모든 기존 컴포넌트의 기본 스타일을 CSS class로 정의
    - CSS 변수 (`--noxion-*`) 참조
    - `:root` 블록에 기본 토큰 값
    - `[data-theme="dark"]` 블록에 다크 모드 값
    - 반응형 breakpoint 변수 정의 (`--noxion-breakpoint-sm`, `md`, `lg`, `xl`)
  - 각 컴포넌트별 CSS 블록 작성:
    - `.noxion-header` (+ `__nav`, `__logo`, `__actions`)
    - `.noxion-footer` (+ `__copyright`, `__powered-by`)
    - `.noxion-post-card` (+ `__cover`, `__title`, `__date`, `__tags`, `__tag`, `__category`)
    - `.noxion-post-list` (+ `--grid`, `--list`)
    - `.noxion-search` (+ `__input`, `__icon`)
    - `.noxion-tag-filter` (+ `__tag`, `__tag--selected`)
    - `.noxion-toc` (+ `__item`, `__item--active`, `__link`)
    - `.noxion-theme-toggle`
    - `.noxion-empty-state` (+ `__message`)
  - 레이아웃용 CSS 클래스:
    - `.noxion-layout` (+ `--single-column`, `--sidebar-left`, `--sidebar-right`)
    - `.noxion-layout__header`, `__sidebar`, `__content`, `__footer`
  - TDD: CSS 파일이 올바른 클래스 네임을 포함하는지 테스트

  **Must NOT do**:
  - Tailwind/CSS-in-JS/CSS modules 도입 금지 — 순수 CSS만
  - 지나치게 세분화된 utility 클래스 생성 금지 — BEM semantic class만
  - 하드코딩된 색상값 금지 — 모든 값은 CSS 변수 참조

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: CSS 아키텍처 설계는 프론트엔드 스타일링 전문성 필요
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: BEM CSS 구조와 디자인 시스템 CSS 작성 도메인

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: 3, 4
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `packages/renderer/src/components/Header.tsx:6-44` — 현재 Header의 inline style 전체. 이를 `.noxion-header` CSS class로 변환해야 함. flex layout, border-bottom, padding 등 모든 스타일 속성을 CSS로 이동
  - `packages/renderer/src/components/PostCard.tsx:1-109` — PostCard의 inline style 전체. 카드 레이아웃, 커버 이미지, 태그 badge 등. 가장 복잡한 컴포넌트
  - `packages/renderer/src/components/Footer.tsx:6-31` — Footer inline style
  - `packages/renderer/src/components/PostList.tsx:16-30` — PostList grid 레이아웃 스타일
  - `packages/renderer/src/components/ThemeToggle.tsx:28-50` — ThemeToggle 버튼 스타일
  - `packages/renderer/src/components/TOC.tsx` — TOC 컴포넌트 스타일
  - `packages/renderer/src/components/Search.tsx` — Search 컴포넌트 스타일
  - `packages/renderer/src/components/TagFilter.tsx` — TagFilter 컴포넌트 스타일

  **API/Type References**:
  - `packages/renderer/src/theme/define-theme.ts:7-47` — defaultTheme의 모든 토큰값. CSS의 `:root` 기본값으로 사용
  - `packages/renderer/src/theme/css-generator.ts:3-17` — 현재 CSS 변수 생성 로직. `:root` 와 `[data-theme="dark"]` 셀렉터 패턴 참고

  **Acceptance Criteria**:

  - [ ] `packages/renderer/src/styles/noxion.css` 파일 생성
  - [ ] 모든 기존 컴포넌트에 대응하는 CSS class 포함 (8개 컴포넌트)
  - [ ] 모든 색상값이 `var(--noxion-*)` 변수 참조 (하드코딩 색상 0개)
  - [ ] `:root` 블록에 기본 토큰 값 정의
  - [ ] `[data-theme="dark"]` 블록에 다크 모드 override 정의
  - [ ] 레이아웃용 CSS class 정의 (`.noxion-layout--*`)

  ```bash
  # CSS 파일 존재 확인
  test -f packages/renderer/src/styles/noxion.css && echo "EXISTS" || echo "MISSING"
  # Assert: EXISTS

  # 하드코딩 색상 없는지 확인 (var() 참조만 허용, :root의 정의는 제외)
  grep -c "color: #" packages/renderer/src/styles/noxion.css
  # Assert: 0 (모든 color 속성은 var() 사용)
  ```

  **Commit**: YES
  - Message: `feat(renderer): add BEM-based default stylesheet (noxion.css)`
  - Files: `packages/renderer/src/styles/noxion.css`
  - Pre-commit: `bun test packages/renderer/src/__tests__/`

---

- [x] 3. CSS Generator v2

  **What to do**:
  - `packages/renderer/src/theme/css-generator.ts` 업데이트:
    - 기존 `generateCSSVariables(theme)` → 확장하여 새 토큰 타입 지원
    - 새 함수 `generateThemeStylesheet(themePackage)` 추가:
      - 테마 패키지의 토큰으로 CSS 변수 생성
      - 테마 패키지의 커스텀 CSS가 있으면 머지
    - breakpoint 변수 생성 지원
    - shadow, transition 변수 생성 지원
  - 기존 `generateCSSVariables` 함수 시그니처 유지 (하위 호환)
  - TDD: 기존 테스트 유지 + 새 토큰 타입에 대한 테스트 추가

  **Must NOT do**:
  - 기존 `generateCSSVariables` 함수 시그니처 변경 금지
  - PostCSS/SCSS 등 전처리기 도입 금지
  - 런타임에 동적 CSS class 생성 금지 (변수만 동적)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 기존 패턴 확장 수준의 작업, 깊은 판단 필요 없음
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: CSS 변수 시스템과 스타일시트 생성 도메인

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5, 6)
  - **Blocks**: 7, 8
  - **Blocked By**: 1, 2

  **References**:

  **Pattern References**:
  - `packages/renderer/src/theme/css-generator.ts:1-45` — 현재 전체 구현. `generateCSSVariables` 함수와 내부 `buildVariables` 헬퍼. 이 패턴을 확장
  - `packages/renderer/src/theme/define-theme.ts:7-47` — defaultTheme 구조. 새 토큰 (shadows, transitions, breakpoints)이 추가될 구조

  **Test References**:
  - `packages/renderer/src/__tests__/theme.test.ts:49-139` — 기존 generateCSSVariables 테스트 12개. 모든 테스트가 계속 통과해야 함

  **Acceptance Criteria**:

  - [ ] 기존 `generateCSSVariables` 테스트 12개 모두 통과
  - [ ] 새 함수 `generateThemeStylesheet` 추가
  - [ ] breakpoint 변수 생성 테스트 통과
  - [ ] shadow/transition 변수 생성 테스트 통과

  ```bash
  bun test packages/renderer/src/__tests__/theme.test.ts
  # Assert: All existing tests PASS + new tests PASS
  ```

  **Commit**: YES
  - Message: `feat(renderer): extend CSS generator for v2 theme tokens`
  - Files: `packages/renderer/src/theme/css-generator.ts`, `packages/renderer/src/__tests__/theme.test.ts`
  - Pre-commit: `bun test packages/renderer/src/__tests__/theme.test.ts`

---

- [x] 4. 컴포넌트 마이그레이션 (inline style → CSS class)

  **What to do**:
  - 8개 기존 컴포넌트를 inline style에서 CSS class 기반으로 마이그레이션:
    - `Header.tsx`: `style={{...}}` → `className="noxion-header"`, elements에 `noxion-header__nav` 등
    - `Footer.tsx`: 동일 패턴
    - `PostCard.tsx`: 가장 복잡. cover, title, tags, category 각각 BEM element class
    - `PostList.tsx`: grid layout class
    - `TOC.tsx`: item, active state class
    - `Search.tsx`: input, icon class
    - `TagFilter.tsx`: tag, selected state class
    - `ThemeToggle.tsx`: 버튼 class
  - 각 컴포넌트에서:
    - `style={{...}}` 속성 전부 제거
    - 대응하는 `className` 추가
    - CSS fallback값 제거 (CSS 파일에서 처리)
    - `className` prop 지원 추가 (외부 override 가능)
  - EmptyState 컴포넌트도 포함

  **Must NOT do**:
  - 컴포넌트의 props 인터페이스 변경 금지 (className 추가만 허용)
  - 컴포넌트 로직 변경 금지 (스타일만 변경)
  - conditional style을 className 외부에서 처리 금지 (modifier class 사용)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 컴포넌트별 스타일 마이그레이션은 시각적 결과물에 영향
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: React 컴포넌트와 CSS class 기반 스타일링 도메인

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5, 6)
  - **Blocks**: 8, 10
  - **Blocked By**: 1, 2

  **References**:

  **Pattern References**:
  - `packages/renderer/src/components/Header.tsx:1-47` — Header 전체. inline style → `noxion-header`, `noxion-header__logo`, `noxion-header__nav`, `noxion-header__nav-link`
  - `packages/renderer/src/components/Footer.tsx:1-32` — Footer 전체. → `noxion-footer`, `noxion-footer__copyright`, `noxion-footer__powered-by`
  - `packages/renderer/src/components/PostCard.tsx:1-109` — PostCard 전체. 가장 복잡. → `noxion-post-card`, `__cover`, `__cover-image`, `__cover-placeholder`, `__body`, `__category`, `__title`, `__date`, `__tags`, `__tag`
  - `packages/renderer/src/components/PostList.tsx:1-45` — PostList 전체. → `noxion-post-list` (grid), `noxion-empty-state`
  - `packages/renderer/src/components/ThemeToggle.tsx:1-51` — ThemeToggle. → `noxion-theme-toggle`
  - `packages/renderer/src/components/TOC.tsx` — TOC 컴포넌트
  - `packages/renderer/src/components/Search.tsx` — Search 컴포넌트
  - `packages/renderer/src/components/TagFilter.tsx` — TagFilter 컴포넌트

  **CSS References**:
  - `packages/renderer/src/styles/noxion.css` — Task 2에서 생성된 스타일시트. 각 컴포넌트의 class가 여기에 정의됨

  **Acceptance Criteria**:

  - [ ] 8개 컴포넌트 + EmptyState에서 `style={{...}}` 속성 0개
  - [ ] 모든 컴포넌트가 `className="noxion-{block}"` 패턴 사용
  - [ ] 모든 컴포넌트가 외부 `className` prop 지원
  - [ ] 기존 테스트 통과

  ```bash
  # inline style 잔존 확인
  grep -r "style={{" packages/renderer/src/components/ | wc -l
  # Assert: 0

  # 모든 컴포넌트가 noxion- className 사용
  grep -r "className=\"noxion-" packages/renderer/src/components/ | wc -l
  # Assert: >= 8

  bun test packages/renderer/src/__tests__/
  # Assert: All tests PASS
  ```

  **Commit**: YES
  - Message: `refactor(renderer): migrate all components from inline style to CSS classes`
  - Files: `packages/renderer/src/components/*.tsx`
  - Pre-commit: `bun test packages/renderer/src/__tests__/`

---

- [x] 5. 슬롯 기반 레이아웃 시스템 (Layer 2)

  **What to do**:
  - `packages/renderer/src/theme/slot-resolver.ts` 생성:
    - `resolveSlots(defaults: NoxionSlotMap, overrides: Partial<NoxionSlotMap>): NoxionSlotMap`
    - 기존 `resolveComponents` 패턴 확장
    - slot이 `null`이면 해당 슬롯 비활성화
    - slot이 컴포넌트면 교체
  - `packages/renderer/src/layouts/` 디렉토리 생성
  - 레이아웃 컴포넌트 구현:
    - `BaseLayout.tsx` — 모든 레이아웃의 기반. 슬롯 렌더링 로직
      - slots: header, content, footer (필수), sidebar, hero, breadcrumb (선택)
      - 각 slot은 React.ReactNode | ComponentType | null
    - `BlogLayout.tsx` — header + content + footer (미니멀 블로그용)
    - `DocsLayout.tsx` — header + sidebar-left + content + footer (문서 사이트용)
    - `MagazineLayout.tsx` — header + hero + content(grid) + footer (매거진용)
  - 각 레이아웃은 CSS class 기반 (`noxion-layout--blog`, `noxion-layout--docs` 등)
  - 레이아웃은 slot 컴포넌트를 props로 받거나 ThemeProvider context에서 resolve

  **Must NOT do**:
  - 5개 이상의 레이아웃 생성 금지 — 3개(Blog, Docs, Magazine)면 충분
  - 레이아웃 내에 비즈니스 로직 금지 — 순수 구조 컴포넌트만
  - CSS Grid/Flexbox를 JavaScript로 계산 금지 — CSS class로만 처리

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 레이아웃 시스템은 시각적 구조 설계
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 슬롯 기반 레이아웃 컴포넌트 설계 도메인

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4, 6)
  - **Blocks**: 7, 8, 10
  - **Blocked By**: 1

  **References**:

  **Pattern References**:
  - `packages/renderer/src/theme/component-resolver.ts:1-21` — 기존 resolveComponents 패턴. defaults + overrides 머지. 새 slot-resolver도 동일 패턴 사용
  - `apps/web/app/providers.tsx:11-44` — 현재 고정 레이아웃 (Header → main → Footer). 이 구조가 슬롯 기반 BaseLayout으로 대체됨

  **API/Type References**:
  - `packages/renderer/src/theme/types.ts` — Task 1에서 정의된 NoxionSlotMap, NoxionLayoutProps 타입 사용

  **Test References**:
  - `packages/renderer/src/__tests__/theme.test.ts:142-181` — resolveComponents 테스트 패턴. slot resolver 테스트도 동일 패턴

  **Acceptance Criteria**:

  - [ ] `slot-resolver.ts` 생성 + 테스트
  - [ ] `layouts/BaseLayout.tsx` 생성 — slot 렌더링 동작
  - [ ] `layouts/BlogLayout.tsx` — BaseLayout 기반, header+content+footer
  - [ ] `layouts/DocsLayout.tsx` — BaseLayout 기반, header+sidebar+content+footer
  - [ ] `layouts/MagazineLayout.tsx` — BaseLayout 기반, header+hero+content(grid)+footer
  - [ ] slot이 null이면 해당 영역 렌더링 안 됨
  - [ ] slot에 커스텀 컴포넌트 전달 시 교체 동작

  ```bash
  bun test packages/renderer/src/__tests__/slot-resolver.test.ts
  # Assert: PASS

  bun test packages/renderer/src/__tests__/layouts.test.ts
  # Assert: PASS
  ```

  **Commit**: YES
  - Message: `feat(renderer): add slot-based layout system (Blog, Docs, Magazine)`
  - Files: `packages/renderer/src/theme/slot-resolver.ts`, `packages/renderer/src/layouts/*.tsx`, `packages/renderer/src/__tests__/slot-resolver.test.ts`, `packages/renderer/src/__tests__/layouts.test.ts`
  - Pre-commit: `bun test packages/renderer/src/__tests__/`

---

- [x] 6. 페이지 템플릿 시스템 (Layer 3)

  **What to do**:
  - `packages/renderer/src/theme/template-resolver.ts` 생성:
    - `resolveTemplate(templateMap: NoxionTemplateMap, pageType: string): ComponentType`
    - 테마 패키지의 templateMap에서 pageType에 해당하는 템플릿 컴포넌트 반환
    - fallback 체인: 프로젝트 override → 테마 패키지 → 기본 템플릿
  - `packages/renderer/src/templates/` 디렉토리 생성
  - 기본 페이지 템플릿 구현:
    - `HomePage.tsx` — 포스트 리스트 + 선택적 히어로 섹션 + 태그 필터
    - `PostPage.tsx` — 단일 포스트 렌더링 (NotionPage) + TOC + 메타데이터
    - `ArchivePage.tsx` — 날짜/카테고리별 포스트 아카이브
    - `TagPage.tsx` — 특정 태그의 포스트 리스트
  - 각 템플릿은 레이아웃 컴포넌트를 감싸고, slot에 적절한 컴포넌트를 배치
  - 템플릿은 `data` prop으로 페이지 데이터를 받음 (포스트 목록, 단일 포스트 등)

  **Must NOT do**:
  - 데이터 fetching 로직 포함 금지 — 템플릿은 순수 렌더링만
  - Next.js routing에 의존하는 로직 금지 — framework-agnostic 유지
  - 5개 이상의 템플릿 생성 금지 — 4개(Home, Post, Archive, Tag)면 충분

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 페이지 템플릿은 시각적 페이지 구조 설계
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 페이지 레벨 컴포넌트 설계와 데이터/뷰 분리 도메인

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4, 5)
  - **Blocks**: 7, 8, 10
  - **Blocked By**: 1

  **References**:

  **Pattern References**:
  - `packages/renderer/src/components/NotionPage.tsx:1-63` — 현재 포스트 렌더링 로직. PostPage 템플릿에서 이 컴포넌트를 사용
  - `packages/renderer/src/components/PostList.tsx:1-45` — 현재 포스트 리스트. HomePage 템플릿에서 이 컴포넌트를 사용
  - `apps/web/app/providers.tsx:11-44` — 현재 "사실상의 템플릿". 이 단일 구조가 HomePage/PostPage 등 다수 템플릿으로 분화

  **API/Type References**:
  - `packages/renderer/src/theme/types.ts` — Task 1에서 정의된 NoxionTemplateMap, NoxionTemplateProps 사용
  - `packages/core/src/types.ts:44-62` — BlogPost, NoxionPageData 타입. 템플릿의 data prop 타입으로 사용

  **Acceptance Criteria**:

  - [ ] `template-resolver.ts` 생성 + 테스트
  - [ ] `templates/HomePage.tsx` — 포스트 리스트 렌더링
  - [ ] `templates/PostPage.tsx` — 단일 포스트(NotionPage) 렌더링
  - [ ] `templates/ArchivePage.tsx` — 아카이브 렌더링
  - [ ] `templates/TagPage.tsx` — 태그별 포스트 리스트
  - [ ] fallback 동작: templateMap에 없는 pageType → 기본 템플릿 사용

  ```bash
  bun test packages/renderer/src/__tests__/template-resolver.test.ts
  # Assert: PASS

  bun test packages/renderer/src/__tests__/templates.test.ts
  # Assert: PASS
  ```

  **Commit**: YES
  - Message: `feat(renderer): add page template system (Home, Post, Archive, Tag)`
  - Files: `packages/renderer/src/theme/template-resolver.ts`, `packages/renderer/src/templates/*.tsx`, `packages/renderer/src/__tests__/template-resolver.test.ts`, `packages/renderer/src/__tests__/templates.test.ts`
  - Pre-commit: `bun test packages/renderer/src/__tests__/`

---

- [ ] 7. ThemeProvider v2 (Progressive Resolution)

  **What to do**:
  - `packages/renderer/src/theme/ThemeProvider.tsx` 리팩터:
    - 새 context 값 확장: `theme`, `components` → `tokens`, `slots`, `templates`, `layout`, `stylesheet`
    - Progressive resolution 로직:
      1. 테마 패키지의 기본값 로드
      2. `noxion.config.ts`의 토큰 override 적용 (Level 1)
      3. slot override 적용 (Level 2)
      4. template override 적용 (Level 3)
    - CSS 주입 순서 보장:
      1. 기본 `noxion.css` (reset + component styles)
      2. 테마 패키지의 CSS 변수 (토큰)
      3. 사용자 override CSS
    - SSR 지원: `<style>` 태그로 critical CSS 주입 (FOUC 방지)
    - 기존 hooks 유지 + 새 hooks 추가:
      - `useNoxionTheme()` → 유지 (하위 호환)
      - `useNoxionTokens()` → 새 토큰 접근
      - `useNoxionSlots()` → 슬롯 맵 접근
      - `useNoxionTemplate(pageType)` → 특정 페이지 템플릿 접근
  - 기존 `useNoxionComponents()`, `useNoxionLayout()` deprecated 마킹 (제거 아님)

  **Must NOT do**:
  - 기존 public API 제거 금지 (deprecated 마킹만)
  - context 분리 금지 — 단일 context 유지 (너무 많은 provider 중첩 방지)
  - 런타임 타입 체크 과잉 금지 — TypeScript 타입으로 충분

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: Provider resolution 로직은 복잡한 머지/우선순위 로직 + 하위호환 고려
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: React Context/Provider 패턴과 테마 시스템 도메인

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: 8, 10
  - **Blocked By**: 3, 5, 6

  **References**:

  **Pattern References**:
  - `packages/renderer/src/theme/ThemeProvider.tsx:1-69` — 현재 전체 구현. 이 파일을 리팩터. context 구조, CSS injection, hooks 패턴 참고
  - `packages/renderer/src/theme/component-resolver.ts:1-21` — 현재 resolution 패턴. 새 progressive resolution의 기반
  - `packages/renderer/src/hooks/useTheme.ts:1-48` — 다크/라이트 모드 훅. 이 훅과 새 ThemeProvider가 조화되어야 함

  **API/Type References**:
  - `packages/renderer/src/theme/types.ts` — Task 1의 NoxionThemePackage 인터페이스가 Provider의 입력
  - `packages/renderer/src/theme/slot-resolver.ts` — Task 5의 resolveSlots 사용
  - `packages/renderer/src/theme/template-resolver.ts` — Task 6의 resolveTemplate 사용
  - `packages/renderer/src/theme/css-generator.ts` — Task 3의 generateThemeStylesheet 사용

  **Test References**:
  - `packages/renderer/src/__tests__/hooks.test.ts` — 기존 훅 테스트. 새 훅 테스트도 동일 패턴

  **Acceptance Criteria**:

  - [ ] 기존 `NoxionThemeProvider` API 하위 호환 유지
  - [ ] 새 `NoxionThemeProvider` 가 `themePackage` prop 지원
  - [ ] Progressive resolution: tokens → slots → templates 순서 적용
  - [ ] CSS 주입 순서: base CSS → theme tokens → user overrides
  - [ ] `useNoxionTokens()`, `useNoxionSlots()`, `useNoxionTemplate()` hooks 동작
  - [ ] 기존 `useNoxionTheme()`, `useNoxionComponents()` 여전히 동작

  ```bash
  bun test packages/renderer/src/__tests__/theme-provider-v2.test.ts
  # Assert: PASS

  bun test packages/renderer/src/__tests__/hooks.test.ts
  # Assert: All existing tests still PASS
  ```

  **Commit**: YES
  - Message: `feat(renderer): implement ThemeProvider v2 with progressive resolution`
  - Files: `packages/renderer/src/theme/ThemeProvider.tsx`, `packages/renderer/src/__tests__/theme-provider-v2.test.ts`
  - Pre-commit: `bun test packages/renderer/src/__tests__/`

---

- [ ] 8. @noxion/theme-default 패키지 생성

  **What to do**:
  - `packages/theme-default/` 디렉토리 생성 (monorepo 신규 패키지)
  - `package.json`:
    - name: `@noxion/theme-default`
    - peerDependencies: `@noxion/renderer`, `react`
    - exports: `./index`, `./styles`
  - 패키지 구조:
    ```
    packages/theme-default/
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── index.ts          # 메인 export (ThemePackage 객체)
    │   ├── tokens.ts         # 기본 디자인 토큰 (현재 defaultTheme 이동)
    │   ├── layouts/
    │   │   ├── index.ts
    │   │   └── BlogLayout.tsx  # 기본 레이아웃 (re-export from renderer)
    │   ├── templates/
    │   │   ├── index.ts
    │   │   ├── HomePage.tsx    # 기본 홈 (re-export from renderer)
    │   │   └── PostPage.tsx    # 기본 포스트 (re-export from renderer)
    │   └── components/
    │       └── index.ts       # 기본 컴포넌트 (re-export from renderer)
    └── styles/
        └── theme.css          # 테마 specific CSS overrides (optional)
    ```
  - `src/index.ts`에서 `NoxionThemePackage` 인터페이스를 만족하는 객체 export:
    ```ts
    export const themeDefault: NoxionThemePackage = {
      name: "default",
      tokens: defaultTokens,
      layouts: { blog: BlogLayout, docs: DocsLayout, magazine: MagazineLayout },
      templates: { home: HomePage, post: PostPage, archive: ArchivePage, tag: TagPage },
      components: { Header, Footer, PostCard, ... },
      stylesheet: "@noxion/theme-default/styles",
    };
    ```
  - 현재 `packages/renderer/src/theme/define-theme.ts`의 `defaultTheme`을 이 패키지로 이동하되, renderer에서도 re-export 유지

  **Must NOT do**:
  - renderer 패키지에서 defaultTheme export 제거 금지 (하위 호환)
  - 테마 패키지에 데이터 fetching/routing 로직 포함 금지
  - 테마 패키지에 bundler 설정 요구 금지 (CSS는 직접 import 가능해야 함)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 신규 패키지 생성 + 여러 모듈 조합 + 빌드 설정
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 테마 패키지 구조와 export 설계 도메인

  **Parallelization**:
  - **Can Run In Parallel**: YES (partially)
  - **Parallel Group**: Wave 3 (with Tasks 7, 9) — but depends on 3, 4, 5, 6
  - **Blocks**: 10
  - **Blocked By**: 3, 4, 5, 6, 7

  **References**:

  **Pattern References**:
  - `packages/renderer/src/theme/define-theme.ts:7-47` — 현재 defaultTheme. 이 값을 theme-default/src/tokens.ts로 이동
  - `packages/renderer/package.json` — 패키지 설정 패턴 참조. peerDependencies, exports 구조
  - `packages/core/package.json` — 또 다른 패키지 패턴 참조

  **API/Type References**:
  - `packages/renderer/src/theme/types.ts` — Task 1의 NoxionThemePackage 인터페이스. 이 인터페이스를 만족하는 객체 생성
  - `packages/renderer/src/index.ts:1-43` — renderer의 전체 export 목록. theme-default가 이 중 일부를 re-export

  **Acceptance Criteria**:

  - [ ] `packages/theme-default/package.json` 생성
  - [ ] `packages/theme-default/src/index.ts`에서 `NoxionThemePackage` 타입의 객체 export
  - [ ] TypeScript 컴파일 성공: `bun run build` (theme-default 포함)
  - [ ] 테마 패키지가 NoxionThemePackage 인터페이스를 만족 (타입 체크)

  ```bash
  # 패키지 존재 확인
  test -f packages/theme-default/package.json && echo "EXISTS" || echo "MISSING"
  # Assert: EXISTS

  # 빌드 확인
  bun run build
  # Assert: packages/theme-default 빌드 성공
  ```

  **Commit**: YES
  - Message: `feat(theme-default): create default theme package`
  - Files: `packages/theme-default/**`
  - Pre-commit: `bun run build`

---

- [ ] 9. @noxion/core 타입 브릿지 업데이트

  **What to do**:
  - `packages/core/src/types.ts` 업데이트:
    - `NoxionThemeConfig = unknown` → `NoxionThemeConfig` 실제 타입 정의
      - `themePackage?: string` (npm 패키지 이름 또는 경로)
      - `tokens?: Partial<NoxionThemeTokens>` (토큰 override)
      - `slots?: Partial<NoxionSlotMap>` (슬롯 override)
    - `ComponentOverrides = unknown` → 실제 `ComponentOverrides` 타입 import 또는 재정의
  - core에서 renderer 타입을 직접 import하면 순환 의존 발생할 수 있음:
    - 방법 A: core에 최소한의 타입 재정의 (중복이지만 안전)
    - 방법 B: 공통 타입을 별도 패키지로 추출 (과도할 수 있음)
    - 방법 C: core의 타입을 generic으로 유지하되 constraint 추가
    - → 방법 A 채택 (가장 단순, LLM 에이전트가 이해하기 쉬움)
  - 기존 `defineConfig` 테스트가 계속 통과하는지 확인

  **Must NOT do**:
  - 순환 의존성 생성 금지 (core → renderer import 금지)
  - 기존 NoxionConfig 필수 필드 변경 금지
  - 과도한 타입 추출 (별도 @noxion/types 패키지) 금지 — 이 스코프에서는 과잉

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 타입 정의 업데이트 + 기존 테스트 통과 확인. 비교적 단순
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: TypeScript 타입 시스템 도메인

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: 10
  - **Blocked By**: 1

  **References**:

  **Pattern References**:
  - `packages/core/src/types.ts:1-68` — 현재 전체 타입 파일. NoxionConfig, NoxionThemeConfig = unknown, ComponentOverrides = unknown 이 타겟
  - `packages/core/src/config.ts:1-30` — defineConfig 함수. defaultTheme 필드 처리 패턴

  **Test References**:
  - `packages/core/src/__tests__/config.test.ts` — defineConfig 테스트. 모든 기존 테스트 통과 필수

  **API/Type References**:
  - `packages/renderer/src/theme/types.ts` — Task 1에서 정의된 타입. core에서 직접 import 불가 → 최소한의 재정의

  **Acceptance Criteria**:

  - [ ] `NoxionThemeConfig`가 `unknown`이 아닌 실제 타입
  - [ ] `ComponentOverrides`가 `unknown`이 아닌 실제 타입
  - [ ] 순환 의존성 없음 (core가 renderer를 import하지 않음)
  - [ ] 기존 defineConfig 테스트 전부 통과

  ```bash
  bun test packages/core/src/__tests__/config.test.ts
  # Assert: All existing tests PASS

  # 순환 의존성 확인
  grep -r "from.*@noxion/renderer" packages/core/src/ | wc -l
  # Assert: 0
  ```

  **Commit**: YES
  - Message: `feat(core): define concrete types for NoxionThemeConfig and ComponentOverrides`
  - Files: `packages/core/src/types.ts`
  - Pre-commit: `bun test packages/core/src/__tests__/`

---

- [ ] 10. apps/web 마이그레이션

  **What to do**:
  - `apps/web/app/providers.tsx` 리팩터:
    - 기존: `NoxionThemeProvider` + 하드코딩 Header/main/Footer
    - 새로운: `NoxionThemeProvider` + `@noxion/theme-default` 테마 패키지 사용
    - 레이아웃은 테마 패키지의 BlogLayout 사용
  - `apps/web/package.json`에 `@noxion/theme-default` 의존성 추가
  - 기본 스타일시트 import: `import "@noxion/theme-default/styles"`
  - noxion.css import: `import "@noxion/renderer/styles"`
  - 기존과 동일하게 동작하되, 새 테마 시스템 위에서 동작

  **Must NOT do**:
  - apps/web의 라우팅 구조 변경 금지
  - 새로운 페이지 추가 금지 (기존 페이지만 마이그레이션)
  - 기능 추가 금지 — 순수 마이그레이션만

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 기존 코드를 새 API로 전환하는 단순 마이그레이션
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Next.js 앱에서 테마 시스템 통합 도메인

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (after Wave 3)
  - **Blocks**: 11
  - **Blocked By**: 7, 8, 9

  **References**:

  **Pattern References**:
  - `apps/web/app/providers.tsx:1-45` — 현재 전체 코드. 이 파일이 마이그레이션 타겟
  - `apps/web/app/layout.tsx` — 루트 레이아웃. 스타일시트 import 위치

  **API/Type References**:
  - `packages/theme-default/src/index.ts` — Task 8에서 생성된 테마 패키지의 export
  - `packages/renderer/src/theme/ThemeProvider.tsx` — Task 7에서 업데이트된 Provider API

  **Acceptance Criteria**:

  - [ ] `apps/web`이 `@noxion/theme-default` 사용
  - [ ] `providers.tsx`에서 하드코딩된 Header/Footer 제거 → 테마 패키지에서 제공
  - [ ] `bun run dev` 실행 시 기존과 동일한 페이지 렌더링
  - [ ] 다크/라이트 모드 전환 동작

  ```bash
  # 의존성 확인
  grep "@noxion/theme-default" apps/web/package.json
  # Assert: found

  # 빌드 확인
  bun run build
  # Assert: 성공
  ```

  **Automated Verification (using playwright skill)**:
  ```
  1. Navigate to: http://localhost:3000
  2. Wait for: selector ".noxion-header" to be visible
  3. Assert: ".noxion-post-list" exists on page
  4. Click: ".noxion-theme-toggle"
  5. Assert: document.documentElement.dataset.theme changes
  6. Screenshot: .sisyphus/evidence/task-10-web-migration.png
  ```

  **Commit**: YES
  - Message: `refactor(web): migrate to new theme system with @noxion/theme-default`
  - Files: `apps/web/app/providers.tsx`, `apps/web/package.json`
  - Pre-commit: `bun run build`

---

- [ ] 11. 통합 테스트 + 빌드 검증

  **What to do**:
  - 전체 모노레포 빌드: `bun run build`
  - 전체 테스트: `bun test`
  - Progressive customization 시나리오 검증:
    - **Level 0**: `apps/web`이 zero-config로 동작 (테마 패키지 기본값만)
    - **Level 1**: `apps/web`에서 토큰 override 적용 → 색상 변경 확인
    - **Level 2**: `apps/web`에서 Header slot override → 커스텀 Header 확인
    - **Level 3**: `apps/web`에서 HomePage template override → 커스텀 홈페이지 확인
  - `packages/renderer/src/index.ts` export 목록 업데이트:
    - 새 layouts, templates, hooks, types 모두 export
  - 전체 export 목록이 타입 안전한지 확인

  **Must NOT do**:
  - 새 기능 추가 금지 — 검증만
  - 테스트를 위한 임시 코드 커밋 금지

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 여러 패키지 걸친 통합 검증, 시나리오 테스트
  - **Skills**: [`frontend-ui-ux`, `playwright`]
    - `frontend-ui-ux`: 테마 시스템 전체 검증 도메인
    - `playwright`: 브라우저에서 렌더링 결과 확인

  **Parallelization**:
  - **Can Run In Parallel**: NO (final task)
  - **Parallel Group**: Sequential
  - **Blocks**: None
  - **Blocked By**: 10

  **References**:

  **Pattern References**:
  - `packages/renderer/src/index.ts:1-43` — 현재 export 목록. 새 모듈 추가 필요

  **Acceptance Criteria**:

  - [ ] `bun run build` — 모든 패키지 빌드 성공
  - [ ] `bun test` — 모든 테스트 통과
  - [ ] Level 0 시나리오: zero-config로 apps/web 실행 + 페이지 렌더링 확인
  - [ ] Level 1 시나리오: 토큰 override 적용 확인
  - [ ] Level 2 시나리오: slot override 적용 확인
  - [ ] renderer의 index.ts에 새 모듈 전부 export

  ```bash
  bun run build
  # Assert: 0 errors

  bun test
  # Assert: All tests PASS
  ```

  **Automated Verification (using playwright skill)**:
  ```
  # Level 0: Zero-config
  1. Navigate to: http://localhost:3000
  2. Assert: ".noxion-header" visible
  3. Assert: ".noxion-post-list" visible
  4. Screenshot: .sisyphus/evidence/task-11-level0.png

  # Level 1: Token override (after applying in providers.tsx)
  5. Assert: CSS variable --noxion-primary has changed value
  6. Screenshot: .sisyphus/evidence/task-11-level1.png
  ```

  **Commit**: YES
  - Message: `feat(renderer): update exports for v2 theme system + integration verification`
  - Files: `packages/renderer/src/index.ts`
  - Pre-commit: `bun test && bun run build`

---

## Commit Strategy

| After Task | Message | Key Files | Verification |
|------------|---------|-----------|--------------|
| 1 | `feat(renderer): add v2 type system for 3-layer theme architecture` | types.ts | `bun test` |
| 2 | `feat(renderer): add BEM-based default stylesheet (noxion.css)` | noxion.css | `bun test` |
| 3 | `feat(renderer): extend CSS generator for v2 theme tokens` | css-generator.ts | `bun test` |
| 4 | `refactor(renderer): migrate all components from inline style to CSS classes` | components/*.tsx | `bun test` |
| 5 | `feat(renderer): add slot-based layout system` | layouts/*.tsx, slot-resolver.ts | `bun test` |
| 6 | `feat(renderer): add page template system` | templates/*.tsx, template-resolver.ts | `bun test` |
| 7 | `feat(renderer): implement ThemeProvider v2 with progressive resolution` | ThemeProvider.tsx | `bun test` |
| 8 | `feat(theme-default): create default theme package` | packages/theme-default/** | `bun run build` |
| 9 | `feat(core): define concrete types for NoxionThemeConfig and ComponentOverrides` | core/types.ts | `bun test` |
| 10 | `refactor(web): migrate to new theme system with @noxion/theme-default` | apps/web/** | `bun run build` |
| 11 | `feat(renderer): update exports for v2 theme system` | renderer/index.ts | `bun test && bun run build` |

---

## Success Criteria

### Verification Commands
```bash
bun test                    # Expected: All tests pass
bun run build               # Expected: All packages build successfully
cd apps/web && bun run dev  # Expected: Site renders with new theme system
```

### Final Checklist
- [ ] All "Must Have" items implemented and verified
- [ ] All "Must NOT Have" items confirmed absent
- [ ] All 11 tasks completed with individual commits
- [ ] apps/web runs with @noxion/theme-default zero-config
- [ ] Progressive customization L0-L3 demonstrated
- [ ] No inline styles remain in renderer components
- [ ] All TypeScript types compile without errors
- [ ] Backward compatibility maintained for existing API consumers
