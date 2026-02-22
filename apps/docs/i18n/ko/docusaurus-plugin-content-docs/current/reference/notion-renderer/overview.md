---
sidebar_position: 1
title: 개요
description: "@noxion/notion-renderer — 30+ 블록 타입, KaTeX SSR, Shiki 구문 강조를 지원하는 커스텀 Notion 블록 렌더러"
---

# @noxion/notion-renderer

```bash
npm install @noxion/notion-renderer
# 또는
bun add @noxion/notion-renderer
```

Notion 페이지를 위한 완전 커스텀 React 렌더러입니다. Noxion의 렌더링 코어로서 `react-notion-x`를 대체하며, 마크업, CSS, 접근성, 렌더링 동작에 대한 완전한 제어권을 제공합니다.

**피어 의존성**: `react >= 18.0.0`, `notion-types >= 7.0.0`, `notion-utils >= 7.0.0`

---

## 왜 커스텀 렌더러인가?

`react-notion-x`는 강력한 라이브러리이지만 렌더링과 스타일링이 강하게 결합되어 있어 CSS 오버라이드가 어렵고, 서버 사이드 KaTeX가 없으며, Shiki가 내장되어 있지 않고, 블록 컴포넌트의 트리 셰이킹이 불가능합니다. `@noxion/notion-renderer`는 이 모든 문제를 해결하기 위해 만들어졌습니다:

| 기능 | `react-notion-x` | `@noxion/notion-renderer` |
|------|-----------------|--------------------------|
| 블록 커버리지 | ✅ | ✅ 30+ 블록 타입 |
| KaTeX 렌더링 | 클라이언트 전용 | ✅ `katex.renderToString()` SSR |
| 구문 강조 | Prism (클라이언트) | ✅ Shiki (듀얼 테마 CSS 변수) |
| CSS 오버라이드 | 어려움 | ✅ BEM + CSS 커스텀 속성 |
| 트리 셰이킹 | ❌ | ✅ 각 블록이 named export |
| 커스텀 블록 오버라이드 | 제한적 | ✅ `components.blockOverrides` |
| 다크 모드 | 테마 기반 | ✅ CSS 변수 + `darkMode` prop |

---

## 설치 및 설정

### 1. 설치

```bash
bun add @noxion/notion-renderer
# 피어 의존성 (보통 @noxion/core를 통해 이미 설치됨)
bun add notion-types notion-utils react
```

### 2. 스타일 임포트

```css
/* app/globals.css 또는 동일한 파일 */
@import '@noxion/notion-renderer/styles';

/* 선택 사항: 수식을 위한 KaTeX 스타일 */
@import '@noxion/notion-renderer/katex-css';
```

### 3. 페이지 렌더링

```tsx
"use client";
import { NotionRenderer } from "@noxion/notion-renderer";
import type { ExtendedRecordMap } from "notion-types";

interface Props {
  recordMap: ExtendedRecordMap;
  pageId: string;
}

export function MyNotionPage({ recordMap, pageId }: Props) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      rootPageId={pageId}
      fullPage={true}
      darkMode={false}
    />
  );
}
```

---

## 익스포트

### 메인 컴포넌트

| 익스포트 | 설명 |
|---------|------|
| [`<NotionRenderer />`](./renderer-api) | 최상위 렌더러 — `NotionRendererProvider` + `NotionBlock`을 래핑 |

### 컨텍스트 & 훅

| 익스포트 | 설명 |
|---------|------|
| [`NotionRendererProvider`](./hooks#notionrendererprovider) | 렌더러 상태를 위한 React 컨텍스트 프로바이더 |
| [`useNotionRenderer()`](./hooks#usenotionrenderer) | 전체 렌더러 컨텍스트 접근 |
| [`useNotionBlock(blockId)`](./hooks#usenotionblock) | 레코드 맵에서 ID로 블록 조회 |

### 블록 컴포넌트

30개 이상의 블록 컴포넌트가 named export로 제공됩니다. `components.blockOverrides`를 통해 직접 사용하거나 오버라이드할 수 있습니다. 전체 목록은 [블록 컴포넌트](./blocks)를 참조하세요.

| 익스포트 | 렌더링 대상 |
|---------|-----------|
| `TextBlock` | 단락 / 일반 텍스트 |
| `HeadingBlock` | H1, H2, H3 (Notion: `header`, `sub_header`, `sub_sub_header`) |
| `BulletedListBlock` | 글머리 기호 목록 항목 |
| `NumberedListBlock` | 번호 매기기 목록 항목 |
| `ToDoBlock` | 체크박스 / 할 일 항목 |
| `QuoteBlock` | 인용 블록 |
| `CalloutBlock` | 이모지 아이콘이 있는 콜아웃 |
| `DividerBlock` | 수평선 |
| `ToggleBlock` | 접을 수 있는 토글 |
| `PageBlock` | 하위 페이지 링크 |
| `EquationBlock` | 블록 수식 (KaTeX SSR) |
| `CodeBlock` | Shiki 구문 강조 코드 블록 |
| `ImageBlock` | 캡션이 있는 이미지 (`mapImageUrl` 적용) |
| `VideoBlock` | 동영상 임베드 |
| `AudioBlock` | 오디오 임베드 |
| `EmbedBlock` | 일반 iframe 임베드 |
| `BookmarkBlock` | 풍부한 링크 미리보기 |
| `FileBlock` | 파일 첨부 |
| `PdfBlock` | PDF 임베드 |
| `TableBlock` | 표 |
| `ColumnListBlock` | 열 레이아웃 컨테이너 |
| `ColumnBlock` | 개별 열 |
| `SyncedContainerBlock` | 동기화된 블록 (원본) |
| `SyncedReferenceBlock` | 동기화된 블록 (참조) |
| `AliasBlock` | 블록 별칭 |
| `TableOfContentsBlock` | 자동 목차 |
| `CollectionViewPlaceholder` | 데이터베이스 / 컬렉션 뷰 (플레이스홀더) |

### 인라인 컴포넌트

| 익스포트 | 설명 |
|---------|------|
| [`<Text />`](./components#text) | 리치 텍스트 렌더러 — 모든 Notion 인라인 데코레이션 처리 |
| [`<InlineEquation />`](./components#inlineequation) | 인라인 KaTeX 수식 |

### 유틸리티

| 익스포트 | 설명 |
|---------|------|
| [`formatNotionDate(dateValue)`](./utils#formatnotiondate) | Notion 날짜 값을 사람이 읽을 수 있는 문자열로 변환 |
| [`unwrapBlockValue(record)`](./utils#unwrapblockvalue) | Notion 레코드에서 `{ role, value }` 래퍼 언래핑 |
| [`getBlockTitle(block)`](./utils#getblocktitle) | 블록의 properties에서 일반 텍스트 제목 추출 |
| [`cs(...classes)`](./utils#cs) | 조건부 클래스명 유틸리티 (`clsx`와 유사) |

### Shiki

| 익스포트 | 설명 |
|---------|------|
| [`createShikiHighlighter(options)`](./shiki#createshikihighlighter) | Shiki 기반 `HighlightCodeFn` 생성 |
| [`normalizeLanguage(language)`](./shiki#normalizelanguage) | Notion 언어명을 Shiki 언어 ID로 변환 |

### 타입

| 익스포트 | 설명 |
|---------|------|
| `NotionRendererProps` | `<NotionRenderer />`의 Props |
| `NotionRendererContextValue` | 렌더러 컨텍스트 형태 |
| `NotionBlockProps` | 모든 블록 컴포넌트에 전달되는 Props |
| `NotionComponents` | 컴포넌트 오버라이드 맵 |
| `MapPageUrlFn` | `(pageId: string) => string` |
| `MapImageUrlFn` | `(url: string, block: Block) => string` |
| `HighlightCodeFn` | `(code: string, language: string) => string` |
| `ExtendedRecordMap` | `notion-types`에서 재익스포트 |
| `Block` | `notion-types`에서 재익스포트 |
| `BlockType` | `notion-types`에서 재익스포트 |
| `Decoration` | `notion-types`에서 재익스포트 |

---

## CSS 익스포트

| 임포트 경로 | 내용 |
|-----------|------|
| `@noxion/notion-renderer/styles` | 모든 블록 스타일 (BEM, CSS 커스텀 속성) |
| `@noxion/notion-renderer/katex-css` | KaTeX 수식 스타일시트 |

---

## 지원하는 Notion 블록 타입

| Notion 블록 타입 | 컴포넌트 | 비고 |
|----------------|---------|------|
| `text` | `TextBlock` | 일반 단락 |
| `header` | `HeadingBlock` | `<h1>` |
| `sub_header` | `HeadingBlock` | `<h2>` |
| `sub_sub_header` | `HeadingBlock` | `<h3>` |
| `bulleted_list` | `BulletedListBlock` | `<ul>` 내 `<li>` |
| `numbered_list` | `NumberedListBlock` | `<ol>` 내 `<li>` |
| `to_do` | `ToDoBlock` | 체크박스 |
| `quote` | `QuoteBlock` | `<blockquote>` |
| `callout` | `CalloutBlock` | 아이콘이 있는 콜아웃 |
| `divider` | `DividerBlock` | `<hr>` |
| `toggle` | `ToggleBlock` | `<details><summary>` |
| `page` | `PageBlock` | 하위 페이지 링크 |
| `equation` | `EquationBlock` | 블록 KaTeX |
| `code` | `CodeBlock` | Shiki 구문 강조 코드 |
| `image` | `ImageBlock` | `<figure><img>` |
| `video` | `VideoBlock` | 동영상 임베드 |
| `audio` | `AudioBlock` | 오디오 임베드 |
| `embed` | `EmbedBlock` | 일반 iframe |
| `gist` | `EmbedBlock` | GitHub Gist |
| `figma` | `EmbedBlock` | Figma 임베드 |
| `tweet` | `EmbedBlock` | Twitter/X 임베드 |
| `maps` | `EmbedBlock` | Google 지도 |
| `miro` | `EmbedBlock` | Miro 보드 |
| `codepen` | `EmbedBlock` | CodePen |
| `excalidraw` | `EmbedBlock` | Excalidraw |
| `bookmark` | `BookmarkBlock` | 풍부한 링크 미리보기 |
| `file` | `FileBlock` | 파일 첨부 |
| `pdf` | `PdfBlock` | PDF 뷰어 |
| `table` | `TableBlock` | Notion 표 |
| `table_row` | `TextBlock` | 표 행 |
| `column_list` | `ColumnListBlock` | 열 레이아웃 |
| `column` | `ColumnBlock` | 열 |
| `transclusion_container` | `SyncedContainerBlock` | 동기화된 블록 (원본) |
| `transclusion_reference` | `SyncedReferenceBlock` | 동기화된 블록 (참조) |
| `alias` | `AliasBlock` | 블록 별칭 |
| `table_of_contents` | `TableOfContentsBlock` | 목차 |
| `collection_view` | `CollectionViewPlaceholder` | 데이터베이스 뷰 |
| `collection_view_page` | `CollectionViewPlaceholder` | 전체 페이지 데이터베이스 |
| `breadcrumb` | `DividerBlock` | 브레드크럼 (구분선으로 렌더링) |
| `external_object_instance` | `EmbedBlock` | 외부 객체 |
