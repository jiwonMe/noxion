---
title: 컨텍스트 & 훅
description: "@noxion/notion-renderer React 컨텍스트, 프로바이더, 훅"
---

# 컨텍스트 & 훅

```ts
import {
  NotionRendererProvider,
  useNotionRenderer,
  useNotionBlock,
} from "@noxion/notion-renderer";
```

렌더러는 React 컨텍스트를 사용하여 설정(레코드 맵, URL 매퍼, 컴포넌트 오버라이드, 테마 설정)을 모든 하위 블록 컴포넌트에 전달합니다. 커스텀 블록 오버라이드에서 이 컨텍스트에 접근할 수 있습니다.

---

## `NotionRendererProvider`

컨텍스트 프로바이더입니다. `<NotionRenderer />`에서 내부적으로 사용되므로, 처음부터 커스텀 렌더러를 만들지 않는 한 직접 사용할 필요가 없습니다.

### Props

```ts
interface NotionRendererProviderProps {
  value: NotionRendererContextValue;
  children: ReactNode;
}
```

### 사용법

```tsx
import { NotionRendererProvider } from "@noxion/notion-renderer";

<NotionRendererProvider value={contextValue}>
  {children}
</NotionRendererProvider>
```

---

## `useNotionRenderer()`

블록 컴포넌트나 커스텀 오버라이드 내에서 전체 렌더러 컨텍스트에 접근합니다.

### 시그니처

```ts
function useNotionRenderer(): NotionRendererContextValue
```

### 반환값

전체 `NotionRendererContextValue` 객체. 형태는 [컨텍스트 값](#컨텍스트-값)을 참조하세요.

### 사용법

```tsx
import { useNotionRenderer } from "@noxion/notion-renderer";

function MyCustomBlock({ block }: NotionBlockProps) {
  const { recordMap, darkMode, mapImageUrl, components } = useNotionRenderer();

  return (
    <div className={darkMode ? "dark" : "light"}>
      {/* 커스텀 렌더링 */}
    </div>
  );
}
```

:::note
`<NotionRendererProvider>` 내에서 렌더링되는 컴포넌트 내부에서만 호출해야 합니다. `<NotionRenderer />`가 모든 것을 프로바이더로 래핑하므로, 블록 컴포넌트(`blockOverrides` 포함)에서 안전하게 이 훅을 호출할 수 있습니다.
:::

---

## `useNotionBlock(blockId)` {#usenotionblock}

`recordMap`에서 ID로 Notion 블록을 조회합니다. 비공식 Notion API가 때때로 반환하는 중첩된 `{ role, value }` 래퍼를 처리합니다.

### 시그니처

```ts
function useNotionBlock(blockId: string): Block | undefined
```

### 매개변수

| 매개변수 | 타입 | 설명 |
|---------|------|------|
| `blockId` | `string` | 조회할 Notion 블록 ID |

### 반환값

`Block | undefined` — `notion-types`의 조회된 `Block` 객체, 또는 레코드 맵에 없으면 `undefined`.

### 내부 동작

비공식 Notion API는 때때로 블록 값을 다음과 같이 래핑합니다:

```json
{
  "role": "reader",
  "value": { ...실제 블록 데이터... }
}
```

`useNotionBlock()`은 이를 자동으로 언래핑하여 래퍼 형식에 관계없이 내부 `Block`을 반환합니다.

### 사용법

```tsx
import { useNotionBlock } from "@noxion/notion-renderer";

function MyCustomBlock({ blockId }: { blockId: string }) {
  const block = useNotionBlock(blockId);

  if (!block) return null;
  if (!block.alive) return null;

  return <div>{block.type}</div>;
}
```

---

## 컨텍스트 값

### `NotionRendererContextValue`

```ts
interface NotionRendererContextValue {
  // 전체 Notion 페이지 데이터
  recordMap: ExtendedRecordMap;

  // Notion 페이지 ID를 URL 경로로 매핑
  // 기본값: (id) => `/${id}`
  mapPageUrl: MapPageUrlFn;

  // 이미지 URL 매핑 (S3 → 안정적인 프록시)
  // 기본값: (url) => url
  mapImageUrl: MapImageUrlFn;

  // 컴포넌트 오버라이드 (Image, Link, PageLink, blockOverrides)
  components: NotionComponents;

  // 페이지 제목 헤더를 포함한 전체 페이지 렌더링 여부
  fullPage: boolean;

  // 현재 다크 모드 상태
  darkMode: boolean;

  // 블러업 이미지 미리보기 활성화 여부
  previewImages: boolean;

  // 선택적 Shiki 기반 코드 하이라이터
  highlightCode?: HighlightCodeFn;

  // 조회된 루트 페이지 ID
  rootPageId?: string;

  // 폴백 페이지 아이콘 (이모지 또는 이미지 URL)
  defaultPageIcon?: string | null;

  // 폴백 커버 이미지 URL
  defaultPageCover?: string | null;

  // 폴백 커버 수직 위치 (0–1)
  defaultPageCoverPosition?: number;
}
```

### 기본 컨텍스트 값

프로바이더 외부에서 접근할 때 `useNotionRenderer()`는 안전한 기본값을 반환합니다:

```ts
{
  recordMap: { block: {}, collection: {}, collection_view: {}, collection_query: {}, notion_user: {}, signed_urls: {} },
  mapPageUrl: (id) => `/${id}`,
  mapImageUrl: (url) => url,
  components: {},
  fullPage: true,
  darkMode: false,
  previewImages: false,
}
```

---

## 타입 함수 시그니처

```ts
// Notion 페이지 ID를 URL로 매핑
type MapPageUrlFn = (pageId: string) => string;

// 이미지 소스 URL 매핑 (S3/Notion URL → 안정적인 프록시로 변환)
type MapImageUrlFn = (url: string, block: Block) => string;

// 원본 코드와 언어 식별자를 받아 HTML 문자열 반환
type HighlightCodeFn = (code: string, language: string) => string;
```

---

## 커스텀 렌더러 만들기

`NotionRendererProvider`, `NotionBlock`, `NotionBlockList`를 조합하여 자체 렌더러를 만들 수 있습니다:

```tsx
"use client";
import {
  NotionRendererProvider,
  NotionBlock,
  useNotionRenderer,
} from "@noxion/notion-renderer";
import type { NotionRendererContextValue, ExtendedRecordMap } from "@noxion/notion-renderer";

function MyCustomHeader() {
  const { rootPageId, recordMap } = useNotionRenderer();
  // recordMap에서 페이지 제목 읽기...
  return <h1 className="my-title">...</h1>;
}

export function MyRenderer({
  recordMap,
  rootPageId,
}: {
  recordMap: ExtendedRecordMap;
  rootPageId: string;
}) {
  const contextValue: NotionRendererContextValue = {
    recordMap,
    mapPageUrl: (id) => `/posts/${id}`,
    mapImageUrl: (url) => url,
    components: {},
    fullPage: false,
    darkMode: false,
    previewImages: false,
    rootPageId,
  };

  return (
    <NotionRendererProvider value={contextValue}>
      <article>
        <MyCustomHeader />
        <NotionBlock blockId={rootPageId} level={0} />
      </article>
    </NotionRendererProvider>
  );
}
```
