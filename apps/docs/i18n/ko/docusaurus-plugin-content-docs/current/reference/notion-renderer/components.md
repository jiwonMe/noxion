---
title: 인라인 컴포넌트
description: "@noxion/notion-renderer Text와 InlineEquation — 리치 텍스트 및 수식 렌더링"
---

# 인라인 컴포넌트

```ts
import { Text, InlineEquation } from "@noxion/notion-renderer";
```

이 컴포넌트들은 단락, 제목, 또는 리치 텍스트를 포함하는 모든 블록 내의 **인라인** 레벨에서 렌더링을 처리합니다.

---

## `<Text />` {#text}

리치 텍스트 렌더러입니다. Notion의 `Decoration[]` 배열을 React 엘리먼트 트리로 변환하며, 모든 인라인 서식, 링크, 멘션, 인라인 수식을 처리합니다.

### 임포트

```tsx
import { Text } from "@noxion/notion-renderer";
import type { TextProps } from "@noxion/notion-renderer";
```

### Props

```ts
interface TextProps {
  value?: Decoration[];
}
```

`Decoration`은 `notion-types`에서 재익스포트됩니다:

```ts
type Decoration = [string, DecorationItem[]?];
// 예:
// ["Hello, ", [["b"], ["i"]]]  → <strong><em>Hello, </em></strong>
// ["world"]                     → "world"
```

### 지원하는 데코레이션

| 데코레이션 코드 | 렌더링 결과 |
|--------------|------------|
| `"b"` | `<strong>` |
| `"i"` | `<em>` |
| `"s"` | `<s>` (취소선) |
| `"c"` | `<code class="noxion-inline-code">` |
| `"_"` | `<span class="noxion-inline-underscore">` |
| `"h"` | `<span class="noxion-color--{color}">` |
| `"a"` | `<a class="noxion-link" href="{url}">` (`components.Link` 설정 시 해당 컴포넌트 사용) |
| `"e"` | `<InlineEquation expression="{latex}">` |
| `"p"` | 페이지 멘션 → 매핑된 페이지 URL로 연결되는 `<a>` |
| `"‣"` | 사용자 멘션 → `<span class="noxion-user-mention">` |
| `"d"` | 날짜 → `formatNotionDate()`를 통한 형식화된 문자열 |
| `"u"` | 사용자 멘션 → 표시 이름 |
| `"lm"` | 링크 멘션 → `<a class="noxion-link noxion-link-mention">` |

데코레이션은 **중첩** 가능합니다 — 단일 텍스트 세그먼트가 굵기 + 기울임 + 색상을 동시에 가질 수 있습니다.

### 커스텀 블록에서 사용법

커스텀 블록 오버라이드를 만들 때 `<Text>`를 사용하여 리치 텍스트 `Decoration[]`을 렌더링하세요:

```tsx
import type { NotionBlockProps } from "@noxion/notion-renderer";
import { Text } from "@noxion/notion-renderer";
import type { Decoration } from "notion-types";

export function MyCustomBlock({ block }: NotionBlockProps) {
  const properties = block.properties as { title?: Decoration[] } | undefined;

  return (
    <div className="my-block">
      <Text value={properties?.title} />
    </div>
  );
}
```

### 색상 클래스

텍스트 세그먼트에 색상 데코레이션(`"h"`)이 있으면 `<Text>`는 `<span class="noxion-color--{color}">`를 생성합니다. 다음 색상명이 Notion의 색상 시스템에 매핑됩니다:

| 클래스 | 색상 |
|-------|------|
| `noxion-color--gray` | 회색 텍스트 |
| `noxion-color--brown` | 갈색 텍스트 |
| `noxion-color--orange` | 주황색 텍스트 |
| `noxion-color--yellow` | 노란색 텍스트 |
| `noxion-color--teal` | 청록색 텍스트 |
| `noxion-color--blue` | 파란색 텍스트 |
| `noxion-color--purple` | 보라색 텍스트 |
| `noxion-color--pink` | 분홍색 텍스트 |
| `noxion-color--red` | 빨간색 텍스트 |
| `noxion-color--gray_background` | 회색 배경 |
| `noxion-color--brown_background` | 갈색 배경 |
| `noxion-color--orange_background` | 주황색 배경 |
| `noxion-color--yellow_background` | 노란색 배경 |
| `noxion-color--teal_background` | 청록색 배경 |
| `noxion-color--blue_background` | 파란색 배경 |
| `noxion-color--purple_background` | 보라색 배경 |
| `noxion-color--pink_background` | 분홍색 배경 |
| `noxion-color--red_background` | 빨간색 배경 |

이 클래스들은 `@noxion/notion-renderer/styles`에 정의되어 있습니다.

---

## `<InlineEquation />` {#inlineequation}

`katex.renderToString()`을 통해 서버 사이드에서 KaTeX 인라인 수식을 렌더링합니다.

### 임포트

```tsx
import { InlineEquation } from "@noxion/notion-renderer";
```

### Props

```ts
interface InlineEquationProps {
  expression: string; // LaTeX 수식 문자열
}
```

### 동작

- `displayMode: false`로 렌더링 (인라인 모드)
- `throwOnError: false` — 유효하지 않은 LaTeX도 에러를 발생시키지 않으며 `<code class="noxion-equation-error">{expression}</code>`으로 폴백
- 올바른 표시를 위해 `@noxion/notion-renderer/katex-css` 임포트 필요

### 사용법

```tsx
import { InlineEquation } from "@noxion/notion-renderer";

// 인라인: E = mc^2
<InlineEquation expression="E = mc^2" />

// 출력:
// <span class="noxion-equation noxion-equation--inline">
//   <!-- KaTeX HTML -->
// </span>
```

### KaTeX 스타일 임포트

```css
/* 전역 CSS 파일에서 */
@import '@noxion/notion-renderer/katex-css';
```

또는 루트 레이아웃에서:

```tsx
// app/layout.tsx
import "@noxion/notion-renderer/katex-css";
```

:::note
`<Text />`는 `"e"` 데코레이션을 만나면 자동으로 `<InlineEquation />`을 사용하여 인라인 수식을 렌더링합니다. `<Text />`를 거치지 않고 LaTeX를 렌더링하는 커스텀 컴포넌트에서만 `<InlineEquation />`을 직접 사용하세요.
:::
