---
sidebar_position: 999
title: 변경 이력
description: Noxion 버전 히스토리 및 릴리스 노트.
---

# 변경 이력

Noxion 프로젝트의 주요 변경 사항을 기록합니다.

---

## v0.2.0

**릴리스: 2026-02-23**

Noxion이 블로그 빌더에서 **완전한 웹사이트 빌더**로 진화합니다. 이 릴리스에서는 다중 페이지 타입(Blog, Docs, Portfolio), 멀티 데이터베이스 컬렉션, 향상된 플러그인 생태계, 테마 상속을 추가합니다.

### 신규: 다중 페이지 타입

- **`NoxionPage`** — `BlogPost`를 대체하는 새 제네릭 페이지 타입. `BlogPost`는 하위 호환성을 위한 타입 별칭으로 유지됨.
- **`BlogPage`** — `date`, `tags`, `category`, `author` 메타데이터가 있는 블로그 포스트
- **`DocsPage`** — `section`, `order`, `version` 메타데이터가 있는 문서 페이지
- **`PortfolioPage`** — `technologies`, `projectUrl`, `year`, `featured` 메타데이터가 있는 포트폴리오 프로젝트
- **타입 가드**: `isBlogPage()`, `isDocsPage()`, `isPortfolioPage()`
- **`PageTypeRegistry`** — 페이지 타입 정의를 관리. 플러그인이 `registerPageTypes` 훅을 통해 커스텀 타입을 등록 가능.

### 신규: 멀티 데이터베이스 컬렉션

- **`collections`** 설정 옵션 — 여러 Notion 데이터베이스를 다른 페이지 타입에 매핑, 각각 자체 URL 접두사와 스키마 매핑
- **`fetchCollection()`** — 페이지 타입 인식 스키마 매핑으로 단일 컬렉션에서 페이지 페치
- **`fetchAllCollections()`** — 모든 컬렉션을 병렬로 페치
- **스키마 매퍼** — 페이지 타입별 규칙 기반 Notion 속성 매핑, 수동 오버라이드 지원
- **`defaultPageType`** 설정 옵션 — 기본 페이지 타입 설정 (기본값: `"blog"`)

### 신규: 향상된 플러그인 시스템

- **`registerPageTypes`** 훅 — 커스텀 페이지 타입 등록
- **`onRouteResolve`** 훅 — 페이지 타입별 URL 생성 커스터마이징
- **`extendSlots`** 훅 — 이름이 지정된 템플릿 슬롯에 콘텐츠 주입
- **`configSchema`** — 플러그인이 검증을 위한 설정 스키마 선언 가능
- **`PluginFactory<T>`** 타입 — 설정 가능한 플러그인을 위한 표준화된 팩토리 함수 타입

### 신규: `@noxion/plugin-utils` 패키지

- **목 데이터 생성기**: `createMockPage`, `createMockBlogPage`, `createMockDocsPage`, `createMockPortfolioPage`, `createMockPages`
- **테스트 헬퍼**: `createTestConfig`, `createTestPlugin`
- **매니페스트 검증**: `NoxionPluginManifest`, `validatePluginManifest`

### 신규: `noxion-plugin-reading-time` 예제

- `transformPosts`, `extendSlots`, `configSchema`를 시연하는 커뮤니티 플러그인 예제
- `@noxion/plugin-utils`를 사용한 전체 테스트 스위트

### 신규: 템플릿 시스템

- **네임스페이스 템플릿 해석** — `docs/page`, `portfolio/grid` 등
- **폴백 체인**: 정확한 매치 → 레거시↔네임스페이스 매핑 → 베이스이름 → 폴백 → 홈
- **문서 템플릿**: `DocsSidebar`, `DocsBreadcrumb`, `DocsPage` (사이드바 내비게이션)
- **포트폴리오 템플릿**: `PortfolioProjectCard`, `PortfolioFilter`, `PortfolioGrid`, `PortfolioProject`

### 신규: 테마 상속

- **`extendTheme()`** — 기본 테마 위에 테마 오버라이드를 딥 머지
- **`NoxionThemeMetadata`** — 테마 메타데이터 (name, author, version, description, preview URL)
- **`supports` 필드** — 테마가 지원하는 페이지 타입 선언
- **`DeepPartialTokens`** 타입 — 부분 색상/폰트 오버라이드 허용

### 신규: 멀티 페이지 타입 라우팅

- **`generateNoxionRoutes()`** — 컬렉션에서 라우트 설정 생성
- **`resolvePageType()`** — URL 경로에서 페이지 타입 결정
- **`buildPageUrl()`** — 컬렉션의 경로 접두사를 사용하여 페이지 URL 빌드
- **`generateStaticParamsForRoute()`** — 특정 페이지 타입 라우트의 static params

### 신규: 페이지 타입 인식 SEO

- **`generateTechArticleLD()`** — 문서 페이지용 `TechArticle` JSON-LD
- **`generateCreativeWorkLD()`** — 포트폴리오 페이지용 `CreativeWork` JSON-LD
- **`generatePageLD()`** — `pageType`에 따라 JSON-LD 타입 자동 선택
- 페이지 타입 인식 사이트맵 우선순위 (blog: 0.8, docs: 0.7, portfolio: 0.6)
- 모든 `NoxionPage` 하위 타입에서 메타데이터 생성 작동

### 신규: `create-noxion` 템플릿

- **`--template` 플래그** — blog, docs, portfolio, 또는 full (멀티 타입) 선택
- **`--plugin` 플래그** — 플러그인 스타터 프로젝트 스캐폴딩
- **`--theme` 플래그** — 테마 스타터 프로젝트 스캐폴딩
- 템플릿별 데이터베이스 ID에 대한 대화형 프롬프트

### 호환성 변경 사항

- **`BlogPost` 필드가 `metadata`로 이동** — `post.date` → `post.metadata.date`, `post.tags` → `post.metadata.tags`, `post.category` → `post.metadata.category`, `post.author` → `post.metadata.author`. 기존 `BlogPost` 타입은 `BlogPage`의 별칭으로 한 버전 주기 동안 유지됩니다.
- **`loadConfig()`가 새 옵션을 받음** — `collections`, `defaultPageType` 필드 추가
- **메타데이터/SEO 함수가 `NoxionPage`를 받음** — `generateNoxionMetadata()`, `generateBlogPostingLD()`, `generateNoxionSitemap()`가 `BlogPost` 대신 `NoxionPage`를 받음

단계별 업그레이드 안내는 [마이그레이션 가이드](./learn/migration-v02)를 참조하세요.

### 신규: 독립 테마 패키지

테마가 이제 독립적인 npm 패키지로 배포되며, 각각 `@noxion/theme-default`를 확장합니다:

| 패키지 | 스타일 | 설명 |
|--------|--------|------|
| `@noxion/theme-default` | 깔끔 & 모던 | 시스템 폰트, 둥근 카드, 고정 헤더의 균형 잡힌 레이아웃. 모든 테마의 기본이 되는 베이스 테마. |
| `@noxion/theme-ink` | 미니멀 & 모노스페이스 | 점선 테두리, `~/` 로고 접두사, 모노스페이스 타이포그래피의 터미널 감성 디자인. |
| `@noxion/theme-editorial` | 매거진 & 세리프 | 중앙 마스트헤드, 굵은 테두리, 세리프 디스플레이 폰트, 대문자 내비게이션의 신문 스타일 레이아웃. |
| `@noxion/theme-folio` | 포트폴리오 & 갤러리 | 투명 헤더, 대문자 로고, 갤러리에 최적화된 카드 그리드의 미니멀 크롬. |
| `@noxion/theme-beacon` | 콘텐츠 중심 | 넓은 콘텐츠 영역(1320px), 정적 헤더, 긴 글 읽기에 적합한 큰 타이포그래피. 커스텀 홈/포스트 페이지 컴포넌트. |

테마 설치 및 적용:

```bash
bun add @noxion/theme-ink
```

```ts
import { inkThemePackage } from "@noxion/theme-ink";
// noxion.config.ts에서 사용
```

### 신규: 히어로 섹션 & 홈페이지 리디자인

- **`HeroSection`** — 추천 포스트 스포트라이트와 테마별 스타일링이 있는 풀 너비 히어로
- **`FeaturedPostCard`** — 그라데이션 배경과 반응형 브레이크포인트가 있는 오버레이 카드 디자인
- **히어로+피드 레이아웃** — 홈페이지에 포스트 피드 위에 히어로 섹션 표시
- **테마별 컴포넌트 오버라이드** — 테마가 커스텀 CSS를 주입하고 페이지 컴포넌트(예: `HomePage`, `PostPage`)를 오버라이드 가능
- **콘텐츠 컨테이너 확대** — 모던 와이드스크린 레이아웃을 위해 720px에서 1080px로 확장

### 신규: 테마 개발 앱 (`apps/theme-dev`)

- **실시간 미리보기** — 데스크톱/태블릿/모바일 뷰포트 토글이 있는 iframe 기반 미리보기
- **테마 전환기** — 설치된 모든 테마를 실시간으로 전환
- **비교 모드** — 테마 나란히 비교
- **검증 패널** — 테마 검증 검사를 통과/실패 리포팅
- **토큰 인스펙터** — 모든 CSS 변수 토큰 탐색 및 검색
- **Notion 페이지 페치** — 테스트용 실제 Notion 콘텐츠 로드
- **다크 모드** — 토글이 있는 완전한 다크 모드 지원

### 신규: Notion 웹훅 자동 퍼블리시

- **`/api/notion-webhook`** 라우트 (`@noxion/adapter-nextjs`) — Notion 웹훅 이벤트를 수신하고 즉시 퍼블리싱을 위한 온디맨드 재검증을 트리거

### 개선 사항

- **테마별 헤더 스타일링** — 각 테마가 고유한 헤더 CSS 적용 (높이, 테두리, 로고 스타일, 내비게이션 레이아웃)
- **반응형 브레이크포인트** — 히어로 섹션과 추천 카드가 모바일/태블릿/데스크톱에 적응
- **카드 레이아웃 일관성** — 이미지 있는/없는 상태 간 통일된 카드 레이아웃
- **포트폴리오 카드 커버** — 일관된 그리드 정렬을 위해 항상 커버 컨테이너 렌더링
- **아티클 페이지 레이아웃** — 개선된 타이포그래피 및 간격
- 모든 패키지에서 **392개 테스트** 통과 (core: 168, renderer: 83, adapter-nextjs: 51, plugin-utils: 36, create-noxion: 29, plugin-reading-time: 25)
- 모든 v0.2 기능에 대한 **포괄적인 문서** 업데이트

---

## v0.1.1

**릴리스: 2026-02-22**

`@noxion/notion-renderer` 렌더링 품질과 새로운 고정 TOC 기능에 집중한 패치 릴리스.

### 수정

- **3+ 컬럼 레이아웃 오버플로우** — `.noxion-column`에 `min-width: 0`과 `overflow: hidden`을 추가하여 3개 이상의 컬럼 사용 시 flex 아이템이 컨테이너 너비를 초과하지 않도록 방지.
- **컬럼 내 이미지 크기** — 이미지 figure의 인라인 `width`를 `maxWidth`로 변경하여 좁은 컬럼 컨테이너에 맞게 축소하면서도 원래 Notion 지정 너비를 상한으로 유지.
- **캡션 줄바꿈** — 이미지 캡션의 `word-break: break-word`를 `overflow-wrap: break-word`로 교체하여 적절한 단어 경계 줄바꿈 적용.
- **프론트매터 코드 블록 표시** — 프론트매터 key:value 쌍에 사용되는 첫 번째 코드 블록이 렌더링된 출력에서 자동으로 숨겨지도록 변경.

### 신규

- **고정 TOC 사이드바** (`floatFirstTOC: right`) — 이 프론트매터 속성이 설정되면, 인라인 `table_of_contents` 블록이 숨겨지고 콘텐츠 영역 오른쪽에 위치한 고정 사이드바 TOC로 대체됩니다. 40% 뷰포트 임계값으로 스크롤 시 활성 제목을 추적합니다. 1280px 화면 너비 이하에서 자동으로 숨겨집니다.

### 개선 사항

- **기본 타이포그래피** — 기본 `line-height`를 1.5에서 1.6으로 변경, 더 조밀한 본문 텍스트를 위한 `letter-spacing: -0.01em` 추가.

---

## v0.1.0

**릴리스: 2026-02-22**

첫 번째 마일스톤 릴리스. Noxion이 자체 Notion 블록 렌더러(`@noxion/notion-renderer`)를 탑재하여 서드파티 `react-notion-x` 의존성을 완전히 대체했습니다. 렌더링, 스타일링, 성능을 완전히 제어할 수 있게 되었습니다.

### 신규: `@noxion/notion-renderer`

Noxion을 위해 처음부터 새로 만든 Notion 블록 렌더러.

- **30+ 블록 타입** — 문단, 제목(H1–H3), 글머리/번호/할일 목록, 인용, 콜아웃, 구분선, 토글, 수식, 코드, 이미지, 비디오, 오디오, 임베드, 북마크, 파일, PDF, 테이블, 컬럼 레이아웃, 동기화 블록, 별칭, 목차, 컬렉션 뷰 플레이스홀더
- **완전한 리치 텍스트 렌더링** — 볼드, 이탤릭, 취소선, 밑줄, 코드, 컬러, 링크, 인라인 수식, 인라인 멘션(사용자, 페이지, 날짜, 데이터베이스), 중첩 데코레이션
- **KaTeX 수식 (SSR)** — `katex.renderToString()`을 통한 서버 사이드 렌더링. 클라이언트 사이드 수학 JS 불필요.
- **Shiki 구문 강조** — VS Code 수준의 코드 블록, 듀얼 테마 지원(라이트 + 다크). 38개 주요 언어 사전 로드. `createShikiHighlighter()` 비동기 팩토리를 통해 실행 — Prism.js 없음, 클라이언트 사이드 하이라이팅 없음.
- **BEM 네이밍의 순수 CSS** — `noxion-{block}__{element}--{modifier}` 네이밍 규칙으로 작성된 ~1,250줄의 자체 CSS. `--noxion-*` CSS 커스텀 속성으로 테마 적용. Tailwind 없음, CSS-in-JS 없음.
- **다크 모드** — `.noxion-renderer--dark` 클래스와 `[data-theme="dark"]` 속성 이중 선택자 지원. 기존 테마 시스템과 바로 호환.
- **94개 유닛 테스트** 통과 (`bun test`)

### 호환성 변경 사항

- **`react-notion-x` 제거** — `@noxion/renderer` 패키지가 더 이상 `react-notion-x`, `prismjs`, 클라이언트 사이드 `katex`에 의존하지 않습니다. `react-notion-x`에서 직접 가져온 것이 있다면 `@noxion/notion-renderer` 익스포트로 마이그레이션하세요.
- **CSS 임포트 변경** — 웹 앱의 `globals.css`가 이제 `react-notion-x` 스타일 대신 `@noxion/notion-renderer` 스타일을 가져옵니다:
  ```css
  @import '@noxion/notion-renderer/styles';
  ```
- **`next.config.ts` 업데이트** — `transpilePackages`에 `react-notion-x` 대신 `@noxion/notion-renderer`가 포함됩니다.

### 개선 사항

- **테마 시스템** — CSS 변수 기반 테마가 이제 모든 Notion 블록 타입을 커버합니다. `--noxion-foreground`, `--noxion-muted`, `--noxion-border`, `--noxion-font-mono` 등의 변수가 일관되게 사용됩니다.
- **콜아웃 레이아웃** — 콜아웃 내 긴 콘텐츠가 레이아웃을 깨뜨리는 오버플로우 버그 수정 (flex 오버플로우 수정).
- **이미지 URL 처리** — `mapImageUrl`이 Notion 첨부 파일 URL을 안정적이고 만료되지 않는 `notion.so/image/` 프록시를 통해 올바르게 라우팅합니다.
- **코드 블록** — Shiki 듀얼 테마 출력이 인라인 `style`과 `--shiki-dark` CSS 변수를 사용하여 재하이라이팅 없이 매끄러운 라이트/다크 전환을 지원합니다.

### 내부 변경

- **모노레포 구조** — 새 `packages/notion-renderer/` 패키지에 깔끔한 익스포트: `NotionRenderer`, `NotionRendererProvider`, `useNotionRenderer`, `useNotionBlock`, `Text`, `createShikiHighlighter`, 모든 블록 컴포넌트, 완전한 TypeScript 타입.
- **`create-noxion` 템플릿** `@noxion/notion-renderer`를 사용하도록 업데이트.
- **모든 패키지** `0.1.0`으로 버전 업.
- **모노레포 전체 252개 테스트** 통과 (94 notion-renderer + 58 renderer + 116 core).
