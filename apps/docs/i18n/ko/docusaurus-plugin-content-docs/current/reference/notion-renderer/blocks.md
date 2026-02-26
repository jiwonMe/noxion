---
title: 블록 컴포넌트
description: "@noxion/notion-renderer 개별 블록 컴포넌트 — Notion 블록 타입별 컴포넌트"
---

# 블록 컴포넌트

```ts
import {
  TextBlock,
  HeadingBlock,
  CodeBlock,
  ImageBlock,
  // ... 모든 named export
} from "@noxion/notion-renderer";
```

모든 Notion 블록 타입은 독립적인 React 컴포넌트입니다. 모두 클라이언트 컴포넌트(`"use client"`)이며 `useNotionRenderer()`를 통해 렌더러 컨텍스트를 사용합니다.

---

## `NotionBlock`과 `NotionBlockList`

내부 디스패치 컴포넌트입니다. 직접 사용할 필요는 드물지만, 커스텀 블록 래퍼를 만들 때 유용합니다.

### `NotionBlock`

```ts
import { NotionBlock } from "@noxion/notion-renderer";
```

`recordMap`에서 ID로 블록을 조회하고, 적절한 컴포넌트(내장 또는 오버라이드)를 선택하여 자식과 함께 렌더링합니다.

```ts
interface NotionBlockRendererProps {
  blockId: string;  // Notion 블록 ID
  level: number;    // 중첩 깊이 (0 = 루트)
}
```

**선택 우선순위:**
1. `components.blockOverrides[blockType]` (커스텀 오버라이드)
2. `blockType`에 대한 내장 컴포넌트
3. `null` (프로덕션) 또는 개발 경고 `<div>` (개발 환경)

### `NotionBlockList`

ID 목록으로 블록들을 순서대로 렌더링합니다:

```tsx
import { NotionBlockList } from "@noxion/notion-renderer";

<NotionBlockList blockIds={["id1", "id2", "id3"]} level={0} />
```

---

## `NotionBlockProps`

모든 블록 컴포넌트가 받는 Props:

```ts
interface NotionBlockProps {
  block: Block;         // notion-types의 전체 Notion 블록 객체
  blockId: string;      // 블록의 ID 문자열
  level: number;        // 중첩 깊이 (0 = 루트 페이지)
  children?: ReactNode; // 미리 렌더링된 자식 블록
}
```

---

## 블록 레퍼런스

### `TextBlock`

**Notion 타입**: `text`

단락을 렌더링합니다. 모든 리치 텍스트 데코레이션(굵기, 기울임, 코드, 링크, 색상, 인라인 수식, 멘션)을 지원합니다.

```html
<p class="noxion-text">{리치 텍스트 콘텐츠}</p>
```

빈 텍스트 블록은 Notion 간격을 유지하기 위해 `<p class="noxion-text noxion-text--empty">&nbsp;</p>`로 렌더링됩니다.

---

### `HeadingBlock`

**Notion 타입**: `header` (H1), `sub_header` (H2), `sub_sub_header` (H3)

앵커 링크를 위해 자동으로 생성된 URL 안전 ID와 함께 제목을 렌더링합니다. ID는 `generateHeadingId()`를 통해 생성되며, `headingIds` 컨텍스트 세트를 사용하여 페이지 내에서 자동으로 중복이 제거됩니다.

각 제목에는 호버 시 표시되는 `HeadingAnchor` 컴포넌트가 포함되어 있으며, 클릭 시 제목 링크를 클립보드에 복사합니다.

```html
<h2 id="my-heading" class="noxion-heading noxion-heading--2">
  <a class="noxion-heading-anchor" href="#my-heading" aria-label="Link to heading my-heading">#</a>
  {텍스트}
</h2>
```

제목 ID는 다음 규칙을 따릅니다:
- 소문자로 변환
- 공백을 하이픈으로 대체
- 특수 문자 제거 (한글은 보존됨)
- 중복된 경우 `-1`, `-2` 접미사 추가

---

### `BulletedListBlock`

**Notion 타입**: `bulleted_list`

글머리 기호 목록 항목을 렌더링합니다. 연속된 글머리 기호 목록 항목은 CSS의 인접 형제 선택자를 통해 공유 `<ul>`로 래핑됩니다.

```html
<li class="noxion-bulleted-list">{텍스트}</li>
```

---

### `NumberedListBlock`

**Notion 타입**: `numbered_list`

`BulletedListBlock`과 동일하지만 CSS `<ol>` 래퍼와 함께 `<li>`를 렌더링합니다.

```html
<li class="noxion-numbered-list">{텍스트}</li>
```

---

### `ToDoBlock`

**Notion 타입**: `to_do`

체크박스 항목을 렌더링합니다. 체크박스는 `disabled`(읽기 전용)이며 Notion의 체크 상태를 반영합니다. 키보드 접근성이 포함되어 있어 Enter와 Space 키로 체크박스 시각적 피드백을 트리거할 수 있습니다.

```html
<div class="noxion-to-do [noxion-to-do--checked]"
     role="checkbox" aria-checked="true|false"
     tabindex="0" onkeydown="handleKeyboardActivation">
  <input type="checkbox" disabled [checked] />
  <span class="noxion-to-do__label">{텍스트}</span>
</div>
```

---

### `QuoteBlock`

**Notion 타입**: `quote`

왼쪽 보더가 있는 인용 블록을 렌더링합니다.

```html
<blockquote class="noxion-quote">{텍스트}</blockquote>
```

---

### `CalloutBlock`

**Notion 타입**: `callout`

`block.format.page_icon`의 이모지 또는 커스텀 아이콘이 있는 콜아웃 박스를 렌더링합니다.

```html
<div class="noxion-callout">
  <div class="noxion-callout__icon">{이모지}</div>
  <div class="noxion-callout__content">{텍스트}</div>
</div>
```

---

### `DividerBlock`

**Notion 타입**: `divider`, `breadcrumb`에도 사용

```html
<hr class="noxion-divider" />
```

---

### `ToggleBlock`

**Notion 타입**: `toggle`

`useState`를 사용하여 접을 수 있는 토글을 렌더링하는 클라이언트 컴포넌트(`"use client"`)입니다. 전체 키보드 접근성이 포함되어 있어 Enter와 Space 키로 콘텐츠를 토글할 수 있습니다.

```html
<div class="noxion-toggle" aria-expanded="true|false">
  <div class="noxion-toggle__summary" role="button" tabindex="0"
       aria-controls="toggle-content-{blockId}">
    {요약 텍스트}
  </div>
  <div class="noxion-toggle__content" id="toggle-content-{blockId}">
    {자식}
  </div>
</div>
```

토글 상태는 클라이언트 사이드에서 관리됩니다. `aria-expanded` 속성과 콘텐츠 가시성이 동적으로 업데이트됩니다.
,

### `PageBlock`

**Notion 타입**: `page`

Notion 하위 페이지로의 링크를 렌더링합니다. URL은 `mapPageUrl(blockId)`로 생성됩니다.

```html
<div class="noxion-page">
  <a href="{url}" class="noxion-page__link">
    <span class="noxion-page__icon">{아이콘}</span>
    <span class="noxion-page__title">{제목}</span>
  </a>
</div>
```

---

### `EquationBlock`

**Notion 타입**: `equation`

`katex.renderToString()`을 통해 서버 사이드에서 블록 레벨 KaTeX 수식을 렌더링합니다. `@noxion/notion-renderer/katex-css`를 임포트해야 합니다.

```html
<div class="noxion-equation noxion-equation--block">
  <!-- KaTeX HTML 출력 -->
</div>
```

렌더링 오류 시 `<code class="noxion-equation-error">{원본 수식}</code>`으로 폴백됩니다.

---

### `CodeBlock`

**Notion 타입**: `code`

선택적 Shiki 구문 강조가 있는 코드 블록을 렌더링합니다. 성능을 위해 `highlightCode` 결과는 `useMemo`로 메모이제이션됩니다. `highlightCode`가 제공되지 않으면 일반 `<pre><code>`로 폴백됩니다.

```html
<div class="noxion-code">
  <div class="noxion-code__header">
    <span class="noxion-code__language">{언어}</span>
  </div>
  <!-- Shiki 사용 시: -->
  <div class="noxion-code__body">{shiki HTML}</div>
  <!-- Shiki 미사용 시: -->
  <pre class="noxion-code__body">
    <code class="noxion-code__content language-{lang}"
          role="code"
          aria-label="{언어} 코드 블록">{코드}</code>
  </pre>
  <!-- 선택적 캡션: -->
  <figcaption class="noxion-code__caption">{캡션}</figcaption>
</div>
```

스크린 리더의 정확성을 위해 `aria-label`은 외부 래퍼가 아닌 `<code>` 엘리먼트에 배치됩니다. 구문 강조 설정은 [Shiki](./shiki)를 참조하세요.
,

### `ImageBlock`

**Notion 타입**: `image`

이미지를 렌더링합니다. URL 변환에 컨텍스트의 `mapImageUrl()`을 사용합니다. `next/image` 통합을 위해 `components.Image` 오버라이드를 지원합니다.

```html
<figure class="noxion-image [noxion-image--full-width] [noxion-image--page-width]">
  <img
    src="{매핑된 url}"
    alt="{alt}"
    width="{width}"
    height="{height}"
    loading="lazy"
    decoding="async"
    class="noxion-image__img"
  />
  <figcaption class="noxion-image__caption">{캡션}</figcaption>
</figure>
```

`components.Image`가 설정된 경우 `<img>` 대신 해당 컴포넌트를 렌더링합니다.

---

### `VideoBlock`

**Notion 타입**: `video`

YouTube, Vimeo 등은 `<iframe>`으로, 직접 파일 URL은 `<video>`로 렌더링합니다.

---

### `AudioBlock`

**Notion 타입**: `audio`

```html
<div class="noxion-audio">
  <audio src="{url}" controls class="noxion-audio__player" />
</div>
```

---

### `EmbedBlock`

**Notion 타입**: `embed`, `gist`, `figma`, `typeform`, `replit`, `codepen`, `excalidraw`, `tweet`, `maps`, `miro`, `drive`, `external_object_instance`

모든 임베드 타입을 `<iframe>`으로 렌더링합니다.

---

### `BookmarkBlock`

**Notion 타입**: `bookmark`

`block.properties`의 제목, 설명, URL로 풍부한 링크 미리보기를 렌더링합니다.

```html
<a href="{url}" class="noxion-bookmark" target="_blank" rel="noopener noreferrer">
  <div class="noxion-bookmark__content">
    <div class="noxion-bookmark__title">{제목}</div>
    <div class="noxion-bookmark__description">{설명}</div>
    <div class="noxion-bookmark__url">{url}</div>
  </div>
</a>
```

---

### `TableBlock`

**Notion 타입**: `table`

Notion 표를 렌더링합니다. `block.content`를 사용하여 `table_row` 자식을 찾습니다.

---

### `ColumnListBlock` / `ColumnBlock`

**Notion 타입**: `column_list`, `column`

`ColumnListBlock`은 CSS Grid 컨테이너를 렌더링합니다. `ColumnBlock`은 개별 열을 렌더링합니다.

```html
<div class="noxion-column-list">
  <div class="noxion-column">{열 콘텐츠}</div>
  <div class="noxion-column">{열 콘텐츠}</div>
</div>
```

---

### `TableOfContentsBlock`

**Notion 타입**: `table_of_contents`

페이지의 모든 제목 블록을 수집하고 탐색 가능한 목록을 렌더링합니다.

```html
<nav class="noxion-toc">
  <ul class="noxion-toc__list">
    <li class="noxion-toc__item noxion-toc__item--1">
      <a href="#heading-id">{제목 텍스트}</a>
    </li>
    ...
  </ul>
</nav>
```

---

### `CollectionViewBlock`

**Notion 타입**: `collection_view`, `collection_view_page`

Notion 데이터베이스의 대화형 테이블 뷰를 렌더링합니다. 성능을 위해 대화형 컴포넌트는 `createLazyBlock`을 통해 지연 로딩되며, 컬렉션 뷰 블록이 나타날 때만 로드됩니다.

기능:
- **테이블 렌더링** — 컬렉션 데이터를 정렬 가능한 테이블로 표시합니다.
- **열 정렬** — 열 헤더를 클릭하여 오름차순/내림차순으로 정렬합니다.
- **필터링** — 열 값으로 행을 필터링합니다.
- **지연 로딩** — 대화형 컴포넌트는 `React.lazy` + Suspense를 통해 필요할 때 로드됩니다.

```html
<!-- 로딩 중: -->
<div class="noxion-loading-placeholder">로딩 중...</div>

<!-- 로드 후: -->
<div class="noxion-collection-view">
  <table class="noxion-collection-view__table">
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>
```

:::note
1단계에서는 테이블 뷰만 지원합니다. 다른 데이터베이스 뷰(갤러리, 보드, 캘린더, 리스트)는 아직 구현되지 않았습니다.
:::

레거시 `CollectionViewPlaceholder` 컴포넌트는 하위 호환성을 위해 여전히 익스포트됩니다.
