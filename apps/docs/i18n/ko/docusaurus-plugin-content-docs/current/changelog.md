---
sidebar_position: 999
title: 변경 이력
description: Noxion 버전 히스토리 및 릴리스 노트.
---

# 변경 이력

Noxion 프로젝트의 주요 변경 사항을 기록합니다.

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
