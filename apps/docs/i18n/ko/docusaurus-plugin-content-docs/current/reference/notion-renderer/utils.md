---
title: 유틸리티
description: "@noxion/notion-renderer 유틸리티 함수 — 날짜 형식화, 블록 언래핑, 제목 추출, 클래스명 결합"
---

# 유틸리티

```ts
import {
  formatNotionDate,
  unwrapBlockValue,
  getBlockTitle,
  cs,
} from "@noxion/notion-renderer";
```

블록 컴포넌트에서 내부적으로 사용하는 저수준 헬퍼 함수들입니다. 커스텀 블록 오버라이드를 만들 때 유용합니다.

---

## `formatNotionDate()`

Notion 날짜 값 객체를 사람이 읽을 수 있는 영어 문자열로 형식화합니다.

### 시그니처

```ts
function formatNotionDate(dateValue: {
  type: string;       // "date" | "datetime" | "daterange" | "datetimerange"
  start_date: string; // ISO 8601 날짜 (YYYY-MM-DD)
  start_time?: string;
  end_date?: string;
  end_time?: string;
}): string
```

### 반환값

`type`에 따른 형식화된 문자열:

| `type` | 출력 형식 |
|--------|---------|
| `"date"` | `"Jan 1, 2024"` |
| `"datetime"` | `"Jan 1, 2024 10:30"` |
| `"daterange"` | `"Jan 1, 2024 → Jan 7, 2024"` |
| `"datetimerange"` | `"Jan 1, 2024 10:30 → Jan 7, 2024"` |

### 예제

```ts
formatNotionDate({
  type: "date",
  start_date: "2024-01-15",
});
// → "Jan 15, 2024"

formatNotionDate({
  type: "daterange",
  start_date: "2024-01-01",
  end_date: "2024-01-07",
});
// → "Jan 1, 2024 → Jan 7, 2024"

formatNotionDate({
  type: "datetime",
  start_date: "2024-03-20",
  start_time: "14:30",
});
// → "Mar 20, 2024 14:30"
```

### 참고

- `Date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })` 사용
- 유효하지 않은 날짜 문자열은 그대로 반환 (에러 없음)
- 로케일은 `"en-US"`로 고정 — 항상 `"Mon DD, YYYY"` 형식

---

## `unwrapBlockValue()`

Notion 레코드 맵 항목을 기본 값으로 언래핑합니다. 비공식 Notion API가 때때로 반환하는 `{ role, value }` 래퍼를 처리합니다.

### 시그니처

```ts
function unwrapBlockValue<T>(record: unknown): T | undefined
```

### 반환값

언래핑된 값, 또는 `record`가 null/undefined이면 `undefined`.

### 배경

비공식 Notion API는 레코드 맵 항목을 두 가지 형태로 반환합니다:

**형태 1** (직접 값):
```json
{ "type": "text", "id": "abc123", "content": [...], ... }
```

**형태 2** (role 래핑):
```json
{
  "role": "reader",
  "value": { "type": "text", "id": "abc123", "content": [...], ... }
}
```

`unwrapBlockValue()`는 두 형태를 투명하게 처리합니다.

### 예제

```ts
import { unwrapBlockValue } from "@noxion/notion-renderer";
import type { Block } from "notion-types";

const rawRecord = recordMap.block["abc123"];
const block = unwrapBlockValue<Block>(rawRecord);
// block은 래퍼 형태에 관계없이 실제 Block 객체
```

---

## `getBlockTitle()`

Notion 블록의 `properties.title` 리치 텍스트 배열에서 일반 텍스트 제목을 추출합니다.

### 시그니처

```ts
function getBlockTitle(block: Block): string
```

### 반환값

`string` — 모든 제목 세그먼트의 연결된 일반 텍스트, 또는 블록에 제목 속성이 없으면 `"Untitled"`.

### 예제

```ts
import { getBlockTitle } from "@noxion/notion-renderer";

// properties.title = [["Hello, "], ["world", [["b"]]]] 인 블록
getBlockTitle(block);
// → "Hello, world"
```

### 참고

- 모든 서식을 제거 — 일반 텍스트만 반환
- `properties.title`이 없는 블록에 대해 `"Untitled"` 반환
- `PageBlock`, `AliasBlock`, `TableOfContentsBlock`이 링크 레이블용 페이지/블록 제목을 가져올 때 내부적으로 사용

---

## `cs()`

최소한의 조건부 클래스명 유틸리티 — 의존성 없이 [`clsx`](https://github.com/lukeed/clsx)와 유사합니다.

### 시그니처

```ts
function cs(...classes: Array<string | undefined | false | null>): string
```

### 반환값

모든 참(truthy) 클래스 값을 공백으로 구분한 문자열.

### 예제

```ts
import { cs } from "@noxion/notion-renderer";

cs("noxion-image", true && "noxion-image--full-width", false && "noxion-image--dark")
// → "noxion-image noxion-image--full-width"

cs("base", undefined, null, "", "extra")
// → "base extra"

cs("a", condition ? "b" : undefined, "c")
// → "a c"  (condition이 false일 때)
// → "a b c" (condition이 true일 때)
```

### 커스텀 블록에서 사용법

```tsx
import { cs } from "@noxion/notion-renderer";

function MyBlock({ block, active }: { block: Block; active: boolean }) {
  return (
    <div className={cs(
      "my-block",
      active && "my-block--active",
      block.type === "text" && "my-block--text",
    )}>
      ...
    </div>
  );
}
```
`string` — `"toggle-content-{blockId}"` 형식으로 포맷팅된 문자열입니다.
```ts
function getToggleContentId(blockId: string): string
```

### 반환값
,
```ts
import { getToggleContentId } from "@noxion/notion-renderer";
```

### 시그니처
,
토글 콘텐츠에 대한 고유 ID를 생성합니다. `aria-controls`와 `id` 속성에 사용됩니다.

### 임포트
,
```tsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => handleKeyboardActivation(e, () => setIsOpen(!isOpen))}
>
  Toggle
</div>
```

---

## `getToggleContentId()` {#gettogglecontentid}
,
```ts
function handleKeyboardActivation(
  event: React.KeyboardEvent,
  callback: () => void
): void
```

Space 키를 누를 때의 스크롤이나 Enter 키를 누를 때의 폼 제출과 같은 기본 동작을 방지한 후 콜백을 호출합니다.

### 사용법
,
```ts
import { handleKeyboardActivation } from "@noxion/notion-renderer";
```

### 시그니처
,
대화형 요소에 대한 키보드 활성화를 처리합니다. Enter 또는 Space 키를 눌렀을 때 콜백을 호출합니다.

### 임포트
,
`aria-label` 속성에 사용할 설명 문자열:

| 블록 타입 | 레이블 형식 |
|-----------|--------------|
| `toggle` | `"Toggle: {title}"` |
| `callout` | `"Callout: {title}"` |
| `to_do` | `"To-do: {title}"` |
| `code` | `"Code block in {language}"` |
| `table` | `"Data table"` |
| `image` | `"Image"` |
| `quote` | `"Quote: {title}"` |
| `header` | `"Heading: {title}"` |
| `sub_header` | `"Subheading: {title}"` |
| `sub_sub_header` | `"Sub-subheading: {title}"` |
| (기본값) | `"{title}"` 또는 `"{blockType}"` |

---

## `handleKeyboardActivation()` {#handlekeyboardactivation}
,
```ts
function getAriaLabel(block: Block): string
```

### 반환값
,
```ts
import { getAriaLabel } from "@noxion/notion-renderer";
```

### 시그니처
,
### 임포트
,
```ts
generateHeadingId("Hello World");           // → "hello-world"
generateHeadingId("C++ Guide");             // → "c-guide"
generateHeadingId("한국어 제목");              // → "한국어-제목"

const ids = new Set(["hello-world"]);
generateHeadingId("Hello World", ids);      // → "hello-world-1"
```

---

## `getAriaLabel()` {#getarialabel}

Notion 블록의 타입과 내용에 기반하여 접근성 레이블을 생성합니다.
,
1. 소문자로 변환합니다.
2. 공백을 하이픈으로 바꿉니다.
3. 특수 문자를 제거합니다 (영문자, 숫자, 한국어 문자, 하이픈은 유지).
4. 연속된 하이픈을 하나로 합칩니다.
5. `existingIds`에 이미 해당 슬러그가 있다면 `-1`, `-2` 등을 붙입니다.

### 예제
,
`string` — URL-safe한 제목 ID입니다.

### 규칙
,
| 매개변수 | 타입 | 설명 |
|-----------|------|-------------|
| `text` | `string` | 변환할 제목 텍스트 |
| `existingIds` | `Set<string>` | 중복을 피하기 위해 이미 사용 중인 ID 집합 (선택 사항) |

### 반환값
,
```ts
function generateHeadingId(text: string, existingIds?: Set<string>): string
```

### 매개변수
,
```ts
import { generateHeadingId } from "@noxion/notion-renderer";
```

### 시그니처
,
```tsx
import { createLazyBlock } from "@noxion/notion-renderer";

// 기본 내보내기 (Default export)
const LazyMermaidBlock = createLazyBlock(() => import("./mermaid-renderer"));

// 명명된 내보내기 (Named export)
const LazyChartBlock = createLazyBlock(
  () => import("./chart-block"),
  "ChartBlock"
);

// 커스텀 폴백
const LazyCustomBlock = createLazyBlock(
  () => import("./custom-block"),
  undefined,
  { fallback: <div>Loading diagram...</div> }
);
```

이 컴포넌트는 클라이언트 컴포넌트(`"use client"`)입니다. 클라이언트 사이드 렌더링이 필요한 `React.lazy`와 `Suspense`를 사용합니다.

---

## `generateHeadingId()` {#generateheadingid}

제목 텍스트로부터 안정적이고 URL-safe한 ID를 생성합니다. 한국어 문자와 자동 중복 제거를 지원합니다.

### 임포트
,
1. 임포트 함수로 `React.lazy()`를 호출합니다.
2. `<LoadingPlaceholder />` 폴백이 있는 `Suspense` 경계로 감쌉니다.
3. 임포트 실패를 포착하는 `LazyBlockErrorBoundary`로 감쌉니다.
4. 임포트가 실패하면 크래시 대신 에러 폴백을 표시합니다.

### 사용법
,
`ComponentType<P>` — Suspense와 에러 경계로 감싸진 지연 로딩 모듈을 렌더링하는 컴포넌트입니다.

### 동작 방식
,
| 매개변수 | 타입 | 설명 |
|-----------|------|-------------|
| `importFn` | `() => Promise<module>` | 동적 임포트 함수 (예: `() => import("./my-renderer")`) |
| `exportName` | `string` | `default` 대신 사용할 선택적 명명된 내보내기(named export) 이름 |
| `options.fallback` | `ReactNode` | 커스텀 로딩 폴백 (기본값: `<LoadingPlaceholder />`) |

### 반환값
,
```ts
function createLazyBlock<P extends NotionBlockProps = NotionBlockProps>(
  importFn: () => Promise<{ default?: ComponentType<P>; [key: string]: any }>,
  exportName?: string,
  options?: { fallback?: ReactNode }
): ComponentType<P>
```

### 매개변수
,
### 임포트

```tsx
import { createLazyBlock } from "@noxion/notion-renderer";
```

### 시그니처
,
---

## `createLazyBlock()` {#createlazyblock}

동적 임포트된 블록 컴포넌트를 `React.lazy()`, `Suspense` 경계, 그리고 에러 경계로 감쌉니다. Mermaid나 차트 렌더러와 같이 무거운 블록 컴포넌트를 지연 로딩(lazy-load)하는 표준 방법입니다.
,
