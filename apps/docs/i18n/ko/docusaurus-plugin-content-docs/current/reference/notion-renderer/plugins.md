---
title: 플러그인 시스템
description: 유연한 플러그인 아키텍처를 통해 Notion 렌더링 프로세스를 확장하고 커스텀하세요.
---

# 플러그인 시스템

`@noxion/notion-renderer`는 표준 블록 오버라이드 API 위에 계층화된 렌더 타임 플러그인 시스템을 포함합니다. 이를 통해 코어 렌더러를 수정하지 않고도 블록 데이터, 텍스트 콘텐츠, 렌더링 로직을 깊이 있게 커스텀할 수 있습니다.

---

## 설치

플러그인은 `plugins` prop을 통해 `NotionRenderer` 컴포넌트에 전달됩니다.

```tsx
import { NotionRenderer, createMermaidPlugin } from '@noxion/notion-renderer';

const plugins = [
  createMermaidPlugin({ theme: 'dark' })
];

function MyPage({ recordMap }) {
  return (
    <NotionRenderer 
      recordMap={recordMap} 
      plugins={plugins} 
    />
  );
}
```

---

## RendererPlugin 인터페이스 {#rendererplugin}

`RendererPlugin` 인터페이스는 렌더링 수명 주기를 커스텀하는 데 사용할 수 있는 훅을 정의합니다.

```ts
export interface RendererPlugin {
  /** Unique name for the plugin */
  name: string;
  /** Execution priority. Lower numbers run first. */
  priority?: PluginPriority | number;
  /** Intercept block rendering and return a custom component */
  blockOverride?(args: BlockOverrideArgs): BlockOverrideResult | null;
  /** Modify block data before it reaches the renderer */
  transformBlock?(args: TransformBlockArgs): Block;
  /** Transform raw text before decorations are applied */
  transformText?(args: TransformTextArgs): TextTransformResult;
  /** Called when a block starts rendering */
  onBlockRender?(args: TransformBlockArgs): void;
  /** Called after a block has finished rendering */
  onBlockRendered?(args: TransformBlockArgs): void;
  /** Optional plugin-specific configuration */
  config?: Record<string, unknown>;
}
```

---

## 플러그인 훅

| 훅 | 호출 시점 | 반환 타입 | 사용 사례 |
| :--- | :--- | :--- | :--- |
| `blockOverride` | 블록 렌더링 전 | `BlockOverrideResult \| null` | 특정 블록 타입을 가로채서 커스텀 React 컴포넌트를 렌더링합니다. |
| `transformBlock` | `blockOverride` 전 | `Block` | 블록이 처리되기 전에 속성이나 콘텐츠를 수정합니다. |
| `transformText` | 데코레이션 렌더링 전 | `TextTransformResult` | 커스텀 컴포넌트를 주입하거나 텍스트를 수정합니다 (예: 위키링크, 해시태그). |
| `onBlockRender` | 블록 렌더링 시작 시 | `void` | 렌더링 전 분석, 로깅 또는 사이드 이펙트를 처리합니다. |
| `onBlockRendered` | 블록 렌더링 종료 시 | `void` | 렌더링 후 사이드 이펙트나 정리를 처리합니다. |

---

## RendererPluginFactory {#rendererplugin-factory}

대부분의 플러그인은 설정을 허용하기 위해 팩토리 형태로 배포됩니다.

```ts
export type RendererPluginFactory<Options = void> = Options extends void
  ? () => RendererPlugin
  : (options: Options) => RendererPlugin;
```

---

## 플러그인 우선순위

실행 순서는 `priority` 속성에 의해 결정됩니다. 우선순위 값이 낮은 플러그인이 먼저 실행됩니다.

```ts
export enum PluginPriority {
  FIRST = 0,
  NORMAL = 50,
  LAST = 100,
}
```

:::note
여러 플러그인이 `blockOverride`를 제공하는 경우, null이 아닌 결과를 먼저 반환하는 플러그인이 우선권을 가집니다.
:::

---

## 에러 격리

렌더러는 플러그인 호출을 `try/catch` 블록으로 감쌉니다. 플러그인 실행이 실패하면 콘솔에 경고를 기록하지만 전체 렌더링 프로세스를 중단시키지는 않습니다. 렌더러는 단순히 다음 플러그인이나 기본 렌더링 로직으로 진행합니다.

---

## 커스텀 플러그인 작성하기

커스텀 플러그인은 여러 훅을 결합하여 복잡한 동작을 구현할 수 있습니다.

```tsx
import { RendererPlugin, PluginPriority } from '@noxion/notion-renderer';

const myCustomPlugin: RendererPlugin = {
  name: 'custom-mention',
  priority: PluginPriority.NORMAL,
  
  blockOverride: ({ block }) => {
    if (block.type === 'callout' && block.format?.page_icon === '💡') {
      return {
        component: MyCustomCallout,
        props: { theme: 'highlight' }
      };
    }
    return null;
  },

  transformText: ({ text }) => {
    if (text.includes('@admin')) {
      return {
        text,
        replacements: [{
          start: text.indexOf('@admin'),
          end: text.indexOf('@admin') + 6,
          component: <Badge color="red">Admin</Badge>
        }]
      };
    }
    return { text, replacements: [] };
  }
};
```

---

## blockOverrides와 함께 사용하기

`plugins` 시스템은 기존의 `blockOverrides` prop과 함께 작동합니다. 실행 순서는 다음과 같습니다:

1. `plugins.transformBlock`
2. `plugins.blockOverride` (컴포넌트를 반환하는 경우 해당 컴포넌트 사용)
3. `blockOverrides` prop (플러그인이 블록을 가로채지 않은 경우)
4. 기본 렌더러 컴포넌트

---

## 실행 함수 {#executor-functions}

이 함수들은 렌더러 내부에서 사용되지만 고급 사용 사례를 위해 익스포트됩니다.

| 함수 | 설명 |
| :--- | :--- |
| `resolveBlockRenderer` | 플러그인을 순회하며 `blockOverride`를 찾습니다. |
| `executeBlockTransforms` | 모든 `transformBlock` 훅을 순차적으로 실행합니다. |
| `executeTextTransforms` | 모든 `transformText` 훅을 실행하고 교체 대상을 수집합니다. |
| `applyTextTransforms` | 수집된 텍스트 교체 대상을 문자열에 적용하여 `ReactNode[]`를 반환합니다. |

---

## 타입 익스포트

| 타입 | 설명 |
| :--- | :--- |
| `BlockOverrideArgs` | `blockOverride`에 전달되는 인자입니다. |
| `BlockOverrideResult` | `blockOverride`의 예상 반환 타입입니다. |
| `TransformBlockArgs` | `transformBlock`에 전달되는 인자입니다. |
| `TransformTextArgs` | `transformText`에 전달되는 인자입니다. |
| `TextReplacement` | 텍스트 내 컴포넌트 삽입 지점을 정의합니다. |
| `TextTransformResult` | 텍스트 변환 결과입니다. |
