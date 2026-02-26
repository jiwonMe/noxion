---
title: 내장 플러그인
description: "@noxion/notion-renderer에 포함된 표준 플러그인 레퍼런스입니다."
---

# 내장 플러그인

`@noxion/notion-renderer` 패키지는 다이어그램, 차트, 강화된 임베드와 같은 특수 콘텐츠 타입을 처리하기 위한 여러 내장 플러그인을 포함합니다.

---

## Mermaid 플러그인 {#mermaid}

Mermaid 다이어그램으로 표시된 코드 블록을 가로채서 Mermaid.js 라이브러리를 사용하여 렌더링합니다.

```ts
import { createMermaidPlugin } from '@noxion/notion-renderer';
```

### 옵션

```ts
export interface MermaidPluginOptions {
  theme?: "default" | "dark" | "forest";
  containerClass?: string;
}
```

### 사용법

```tsx
const plugins = [
  createMermaidPlugin({ theme: 'dark' })
];
```

### Notion 설정
Notion에서 **코드(Code)** 블록을 생성하고 언어를 `Mermaid`로 설정하세요. 플러그인이 자동으로 블록을 가로채서 다이어그램을 렌더링합니다.

### 요구 사항
선택적 피어 의존성으로 `mermaid`가 필요합니다.
```bash
npm install mermaid
```

---

## 차트 플러그인 {#chart}

코드 블록 내의 JSON 데이터로부터 인터랙티브 차트를 렌더링합니다.

```ts
import { createChartPlugin } from '@noxion/notion-renderer';
```

### 옵션

```ts
export interface ChartPluginOptions {
  containerClass?: string;
}

export interface ChartConfig {
  type: "bar" | "line" | "pie";
  data: Record<string, unknown>;
  options?: Record<string, unknown>;
}
```

### 사용법

```tsx
const plugins = [
  createChartPlugin({ containerClass: 'my-chart-container' })
];
```

### Notion 설정
Notion에서 **코드(Code)** 블록을 생성하고 언어를 `chart`로 설정하세요. 코드 블록의 본문은 `ChartConfig` 인터페이스와 일치하는 유효한 JSON 객체여야 합니다.

### 요구 사항
선택적 피어 의존성으로 `chart.js`가 필요합니다.
```bash
npm install chart.js
```

---

## 콜아웃 변환 플러그인 {#callout-transform}

표준 Notion 콜아웃 블록을 아이콘에 따라 아코디언이나 탭과 같은 인터랙티브 컴포넌트로 변환합니다.

```ts
import { createCalloutTransformPlugin } from '@noxion/notion-renderer';
```

### 옵션

```ts
export interface CalloutTransformOptions {
  iconMapping?: Record<string, "accordion" | "tab">;
  defaultOpen?: boolean;
}
```

### 사용법

```tsx
const plugins = [
  createCalloutTransformPlugin({ defaultOpen: false })
];
```

### Notion 설정
플러그인은 콜아웃 블록에 사용된 이모지 아이콘을 기반으로 작동합니다:
- 📋 또는 ▶️: **아코디언**(접이식)으로 렌더링됩니다.
- 🗂️: **탭 그룹**으로 렌더링됩니다.

### CSS 클래스
- `.noxion-accordion`: 아코디언 블록에 적용됩니다.
- `.noxion-tabs`: 탭 그룹 블록에 적용됩니다.

---

## 강화된 임베드 플러그인 {#embed-enhanced}

인기 있는 플랫폼의 임베드 콘텐츠에 대해 제공자별 최적화 기능을 제공합니다.

```ts
import { createEmbedEnhancedPlugin } from '@noxion/notion-renderer';
```

### 옵션

```ts
export interface EmbedEnhancedOptions {
  providers?: string[]; // 특정 제공자로 제한; null = 전체
}
```

### 사용법

```tsx
const plugins = [
  createEmbedEnhancedPlugin({ providers: ['youtube', 'figma'] })
];
```

### 지원하는 제공자
- CodePen
- StackBlitz
- Figma
- YouTube
- CodeSandbox

### CSS 클래스
제공자별 클래스를 추가합니다: `noxion-embed--{provider}` (예: `noxion-embed--youtube`).

---

## 텍스트 변환 플러그인 {#text-transform}

데코레이션 렌더링 전에 원본 텍스트 콘텐츠를 변환하여 위키링크나 해시태그와 같은 기능을 지원합니다.

```ts
import { createTextTransformPlugin } from '@noxion/notion-renderer';
```

### 옵션

```ts
export interface TextTransformOptions {
  enableWikilinks?: boolean; // 기본값: true
  enableHashtags?: boolean; // 기본값: true
  hashtagUrl?: (tag: string) => string;
  mapPageUrl?: (pageId: string) => string;
}
```

### 사용법

```tsx
const plugins = [
  createTextTransformPlugin({
    mapPageUrl: (id) => `/docs/${id}`,
    hashtagUrl: (tag) => `/search?q=${tag}`
  })
];
```

### Notion 설정
- **위키링크**: 텍스트 블록에서 `[[페이지 이름]]` 구문을 사용하세요.
- **해시태그**: `#해시태그` 구문을 사용하세요.

### CSS 클래스
- `.noxion-color--blue`: `hashtagUrl`이 제공되지 않은 경우 해시태그에 적용됩니다.

---

## 여러 플러그인 사용하기

여러 플러그인을 결합하여 다양한 기능을 동시에 활성화할 수 있습니다.

```tsx
import { 
  NotionRenderer, 
  createMermaidPlugin, 
  createCalloutTransformPlugin,
  createTextTransformPlugin 
} from '@noxion/notion-renderer';

const plugins = [
  createMermaidPlugin(),
  createCalloutTransformPlugin(),
  createTextTransformPlugin({
    mapPageUrl: (id) => `/wiki/${id}`
  })
];

function MyRenderer({ recordMap }) {
  return (
    <NotionRenderer 
      recordMap={recordMap} 
      plugins={plugins} 
    />
  );
}
```
