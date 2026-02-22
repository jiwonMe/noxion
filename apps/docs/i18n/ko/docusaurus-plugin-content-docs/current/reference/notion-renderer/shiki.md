---
title: Shiki 통합
description: "@noxion/notion-renderer Shiki 구문 강조 — createShikiHighlighter와 normalizeLanguage"
---

# Shiki 통합

```ts
import { createShikiHighlighter, normalizeLanguage } from "@noxion/notion-renderer";
```

`@noxion/notion-renderer`는 CSS 커스텀 속성을 통한 듀얼 테마(라이트 + 다크)를 지원하는 VS Code 수준의 구문 강조를 위해 [Shiki](https://shiki.style)를 통합합니다.

---

## `createShikiHighlighter()`

Shiki 기반의 `HighlightCodeFn`을 생성합니다. 한 번 호출한 후 결과를 `<NotionRenderer highlightCode={...} />`에 전달하세요.

### 시그니처

```ts
async function createShikiHighlighter(options?: {
  theme?: string;      // 라이트 테마명 (Shiki 테마 ID)
  darkTheme?: string;  // 다크 테마명 (Shiki 테마 ID)
  langs?: string[];    // 사전 로드할 언어 ID 목록
}): Promise<HighlightCodeFn>
```

### 매개변수

| 매개변수 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `theme` | `string` | `"github-light"` | Shiki 라이트 테마 ID |
| `darkTheme` | `string` | `"github-dark"` | Shiki 다크 테마 ID |
| `langs` | `string[]` | 38개 주요 언어 | 사전 로드할 언어 ID 목록 |

### 반환값

`Promise<HighlightCodeFn>` — `(code: string, language: string) => string`의 동기 함수로, Shiki 구문 강조가 적용된 HTML 문자열을 반환합니다.

### 기본 언어

기본적으로 다음 38개 언어가 사전 로드됩니다:

```
bash, c, cpp, csharp, css, dart, diff, docker, go, graphql, html,
java, javascript, json, jsx, kotlin, latex, lua, makefile, markdown,
objective-c, perl, php, python, r, ruby, rust, sass, scala, scss,
shellscript, sql, swift, toml, tsx, typescript, xml, yaml
```

사전 로드 목록에 없는 언어는 에러 없이 일반 텍스트로 렌더링됩니다.

### 듀얼 테마 출력

Shiki는 CSS 커스텀 속성을 사용하여 라이트와 다크 색상 값이 모두 포함된 HTML을 출력합니다:

```html
<span style="color: #24292e; --shiki-dark: #e1e4e8">...</span>
```

`@noxion/notion-renderer/styles` CSS가 이를 자동으로 적용합니다:

```css
.noxion-renderer--dark [data-shiki] span {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}
```

따라서 단일 Shiki 렌더링으로 두 테마 모두에 올바른 출력을 생성합니다 — 테마 전환 시 재강조가 필요 없습니다.

### 예제: 기본 사용법

```tsx
"use client";
import { useEffect, useState } from "react";
import {
  NotionRenderer,
  createShikiHighlighter,
} from "@noxion/notion-renderer";
import type { HighlightCodeFn, ExtendedRecordMap } from "@noxion/notion-renderer";

// 모듈 레벨 Promise — 앱 생명주기 동안 Shiki는 한 번만 로드됨
const shikiPromise = createShikiHighlighter();

export function PostBody({
  recordMap,
  pageId,
}: {
  recordMap: ExtendedRecordMap;
  pageId: string;
}) {
  const [highlightCode, setHighlightCode] = useState<HighlightCodeFn | undefined>();

  useEffect(() => {
    shikiPromise.then(setHighlightCode);
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

### 예제: 커스텀 테마

```ts
const highlighter = await createShikiHighlighter({
  theme: "catppuccin-latte",
  darkTheme: "catppuccin-mocha",
});
```

모든 [Shiki 번들 테마](https://shiki.style/themes)가 지원됩니다. 테마 ID는 kebab-case 문자열입니다.

### 예제: 추가 언어

```ts
const highlighter = await createShikiHighlighter({
  langs: [
    // 기본 언어
    "typescript", "javascript", "python", "go", "rust",
    // 추가 언어
    "haskell", "elixir", "zig", "nix",
  ],
});
```

### 폴백 동작

`<NotionRenderer />`에 `highlightCode`가 제공되지 않으면 `CodeBlock`은 언어 클래스가 있는 일반 `<pre><code>`로 렌더링합니다 — 에러 없이 구문 강조만 없음.

Shiki가 제공되었지만 언어가 사전 로드 목록에 없는 경우에도 코드는 일반 텍스트로 렌더링됩니다 (Shiki가 강조 전에 `loadedLangs`를 확인함).

---

## `normalizeLanguage()`

Notion 언어명을 해당 Shiki 언어 ID로 변환합니다.

### 시그니처

```ts
function normalizeLanguage(notionLanguage: string): string
```

### 매개변수

| 매개변수 | 타입 | 설명 |
|---------|------|------|
| `notionLanguage` | `string` | Notion의 언어 문자열 (대소문자 무시) |

### 반환값

`string` — Shiki 언어 ID, 또는 매핑이 없으면 원본 문자열(소문자).

### 매핑 표

Notion은 코드 블록 언어를 표시명으로 저장합니다. 이 함수는 이를 Shiki의 언어 ID로 매핑합니다:

| Notion 표시명 | Shiki ID |
|-------------|---------|
| `"JavaScript"` | `"javascript"` |
| `"TypeScript"` | `"typescript"` |
| `"Python"` | `"python"` |
| `"C++"` | `"cpp"` |
| `"C#"` | `"csharp"` |
| `"F#"` | `"fsharp"` |
| `"Shell"` | `"shellscript"` |
| `"Plain Text"` | `"text"` |
| `"Flow"` | `"javascript"` |
| `"Protobuf"` | `"proto"` |
| `"VB.NET"` | `"vb"` |
| `"WebAssembly"` | `"wasm"` |
| (기타 모두) | 직접 소문자 변환 |

### 예제

```ts
normalizeLanguage("TypeScript"); // → "typescript"
normalizeLanguage("C++");        // → "cpp"
normalizeLanguage("Plain Text"); // → "text"
normalizeLanguage("Shell");      // → "shellscript"
normalizeLanguage("python");     // → "python" (이미 소문자)
normalizeLanguage("custom-lang"); // → "custom-lang" (매핑 없음, 직접 반환)
```

### 사용법

`normalizeLanguage()`는 `CodeBlock` 내부에서 자동으로 호출됩니다. 커스텀 코드 블록 컴포넌트를 만드는 경우에만 직접 사용하세요.

---

## `HighlightCodeFn` 타입

```ts
type HighlightCodeFn = (code: string, language: string) => string;
```

원본 코드 문자열과 Notion 언어명을 받아 HTML 문자열을 반환하는 함수입니다. 언어는 **Notion 표시명**(예: `"TypeScript"`)으로 전달됩니다 — 함수가 정규화를 담당합니다.

`createShikiHighlighter()`는 다음을 수행하는 함수를 반환합니다:
1. 내부적으로 `normalizeLanguage(language)` 호출
2. 언어가 로드되어 있는지 확인
3. 로드된 경우 Shiki HTML 반환, 그렇지 않으면 `escapeHtml(code)` 폴백

자체 `HighlightCodeFn`을 제공하여 다른 하이라이터를 사용할 수 있습니다:

```ts
// 예: Shiki 대신 highlight.js 사용
import hljs from "highlight.js";
import { normalizeLanguage } from "@noxion/notion-renderer";

const customHighlighter: HighlightCodeFn = (code, language) => {
  const lang = normalizeLanguage(language);
  try {
    return hljs.highlight(code, { language: lang }).value;
  } catch {
    return code;
  }
};

<NotionRenderer
  recordMap={recordMap}
  highlightCode={customHighlighter}
/>
```
