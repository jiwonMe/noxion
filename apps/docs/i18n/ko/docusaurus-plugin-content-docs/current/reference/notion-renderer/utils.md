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
