---
title: NotionRenderer
description: "@noxion/notion-renderer 최상위 컴포넌트 — ExtendedRecordMap에서 전체 Notion 페이지 렌더링"
---

# `<NotionRenderer />`

```tsx
import { NotionRenderer } from "@noxion/notion-renderer";
```

최상위 렌더러 컴포넌트입니다. 전체 렌더러 컨텍스트와 함께 [`NotionRendererProvider`](./hooks#notionrendererprovider)를 래핑하고, [`NotionBlock`](./blocks#notionblock)을 통해 루트 블록을 렌더링합니다.

**클라이언트 컴포넌트** (`"use client"`)입니다.

---

## Props

| Prop | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `recordMap` | `ExtendedRecordMap` | ✅ | — | `fetchPage()`에서 가져온 전체 페이지 데이터. 모든 블록, 이미지, 컬렉션 데이터, 사용자 정보 포함. |
| `rootPageId` | `string` | — | `recordMap.block`의 첫 번째 키 | 렌더링을 시작할 루트 페이지 블록의 ID. 단일 포스트 페이지에서는 `post.id` 전달. |
| `fullPage` | `boolean` | — | `true` | `true`이면 페이지 제목 헤더를 포함한 전체 페이지 렌더링. `false`이면 하위 블록(본문)만 렌더링. |
| `darkMode` | `boolean` | — | `false` | 다크 모드 강제. `true`이면 `noxion-renderer--dark` CSS 클래스를 추가하고 모든 블록 컴포넌트에 `darkMode: true` 전달. |
| `previewImages` | `boolean` | — | `false` | 블러업 이미지 미리보기 활성화 (`recordMap`에 미리보기 이미지 데이터 필요). |
| `mapPageUrl` | `MapPageUrlFn` | — | `(id) => '/${id}'` | Notion 페이지 ID를 URL 경로로 매핑. 리치 텍스트의 내부 페이지 링크에 사용. |
| `mapImageUrl` | `MapImageUrlFn` | — | `(url) => url` | 이미지 URL 매핑 (S3 URL → 프록시 URL 변환 등). |
| `highlightCode` | `HighlightCodeFn` | — | `undefined` | 구문 강조 함수. `createShikiHighlighter()`를 호출하여 얻음. |
| `components` | `Partial<NotionComponents>` | — | `{}` | 특정 블록 렌더러, 링크/이미지 컴포넌트 오버라이드. |
| `className` | `string` | — | `undefined` | 외부 `<div.noxion-renderer>`에 추가할 CSS 클래스. |
| `header` | `ReactNode` | — | `undefined` | 페이지 콘텐츠 위(페이지 제목 외부)에 렌더링. |
| `footer` | `ReactNode` | — | `undefined` | 페이지 콘텐츠 아래에 렌더링. |
| `pageHeader` | `ReactNode` | — | `undefined` | `header`와 루트 블록 사이에 렌더링. |
| `pageFooter` | `ReactNode` | — | `undefined` | 루트 블록과 `footer` 사이에 렌더링. |
| `defaultPageIcon` | `string \| null` | — | `undefined` | 아이콘이 없는 페이지의 폴백 이모지 또는 이미지 URL. |
| `defaultPageCover` | `string \| null` | — | `undefined` | 커버가 없는 페이지의 폴백 커버 이미지 URL. |
| `defaultPageCoverPosition` | `number` | — | `undefined` | 폴백 커버 수직 위치 (0–1). |

---

## 렌더링된 HTML 구조

```html
<div class="noxion-renderer [noxion-renderer--dark] [className]">
  <!-- header 슬롯 -->
  <!-- pageHeader 슬롯 -->
  <!-- 루트 NotionBlock (페이지/블록) -->
  <!-- pageFooter 슬롯 -->
  <!-- footer 슬롯 -->
</div>
```

---

## 기본 사용법

```tsx
"use client";
import { NotionRenderer } from "@noxion/notion-renderer";
import type { ExtendedRecordMap } from "notion-types";

export function PostBody({
  recordMap,
  pageId,
}: {
  recordMap: ExtendedRecordMap;
  pageId: string;
}) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      rootPageId={pageId}
      fullPage={true}
    />
  );
}
```

---

## Shiki 구문 강조와 함께 사용

```tsx
"use client";
import { useEffect, useState } from "react";
import { NotionRenderer, createShikiHighlighter } from "@noxion/notion-renderer";
import type { HighlightCodeFn, ExtendedRecordMap } from "@noxion/notion-renderer";

export function PostBody({ recordMap, pageId }: { recordMap: ExtendedRecordMap; pageId: string }) {
  const [highlightCode, setHighlightCode] = useState<HighlightCodeFn | undefined>();

  useEffect(() => {
    createShikiHighlighter().then(setHighlightCode);
  }, []);

  return (
    <NotionRenderer
      recordMap={recordMap}
      rootPageId={pageId}
      highlightCode={highlightCode}
    />
  );
}
```

:::tip
`@noxion/renderer`의 `<NotionPage />`는 이미 Shiki를 자동으로 설정합니다. 수동 제어가 필요할 때만 `NotionRenderer`를 직접 사용하세요.
:::

---

## 커스텀 이미지 컴포넌트와 함께 사용

`components.Image`를 사용하여 `next/image` 또는 다른 최적화된 이미지 컴포넌트를 연결하세요:

```tsx
import NextImage from "next/image";
import { NotionRenderer } from "@noxion/notion-renderer";

<NotionRenderer
  recordMap={recordMap}
  components={{
    Image: ({ src, alt, width, height, className }) => (
      <NextImage
        src={src}
        alt={alt}
        width={width ?? 1200}
        height={height ?? 630}
        className={className}
      />
    ),
  }}
/>
```

---

## 커스텀 링크 컴포넌트와 함께 사용

```tsx
import Link from "next/link";
import { NotionRenderer } from "@noxion/notion-renderer";

<NotionRenderer
  recordMap={recordMap}
  components={{
    Link: ({ href, children, className }) => (
      <Link href={href} className={className}>
        {children}
      </Link>
    ),
    PageLink: ({ href, children, className }) => (
      <Link href={href} className={className}>
        {children}
      </Link>
    ),
  }}
/>
```

---

## 블록 렌더러 오버라이드

`components.blockOverrides`를 통해 커스텀 컴포넌트를 전달하여 특정 블록 타입을 교체하세요:

```tsx
import { NotionRenderer } from "@noxion/notion-renderer";
import type { NotionBlockProps } from "@noxion/notion-renderer";

function MyCallout({ block, children }: NotionBlockProps) {
  const icon = (block.format as { page_icon?: string } | undefined)?.page_icon;
  return (
    <div className="my-callout" data-icon={icon}>
      {children}
    </div>
  );
}

<NotionRenderer
  recordMap={recordMap}
  components={{
    blockOverrides: {
      callout: MyCallout,
    },
  }}
/>
```

오버라이드 키는 Notion 블록 `type` 문자열입니다 (예: `"callout"`, `"code"`, `"image"`). 모든 타입 문자열은 [블록 컴포넌트](./blocks)를 참조하세요.

---

## `NotionComponents` 타입

```ts
interface NotionComponents {
  // 커스텀 이미지 렌더러 (next/image 등 연결)
  Image?: ComponentType<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
  }>;

  // 리치 텍스트의 외부 URL을 위한 커스텀 링크 렌더러
  Link?: ComponentType<{
    href: string;
    className?: string;
    children?: ReactNode;
  }>;

  // 내부 Notion 페이지 링크를 위한 커스텀 링크 렌더러
  PageLink?: ComponentType<{
    href: string;
    className?: string;
    children?: ReactNode;
  }>;

  // Notion 타입 문자열로 특정 블록 타입 오버라이드
  blockOverrides?: Partial<Record<BlockType | string, ComponentType<NotionBlockProps>>>;
}
```

---

## 컨텍스트 & 내부 구조

`NotionRenderer`는 [`NotionRendererContextValue`](./hooks)를 생성하고 모든 자식을 `NotionRendererProvider`로 래핑합니다. 모든 블록 컴포넌트(커스텀 오버라이드 포함)는 [`useNotionRenderer()`](./hooks#usenotionrenderer)를 통해 이 컨텍스트에 접근할 수 있습니다.

렌더 트리:

```
<NotionRenderer>
  <NotionRendererProvider value={contextValue}>
    <div.noxion-renderer>
      {header}
      {pageHeader}
      <NotionBlock blockId={rootPageId} level={0} />
      {pageFooter}
      {footer}
    </div>
  </NotionRendererProvider>
```

각 `NotionBlock`은 `block.content` ID를 통해 자식 블록을 재귀적으로 렌더링합니다.
