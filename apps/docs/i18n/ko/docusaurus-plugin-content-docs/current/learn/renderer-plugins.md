---
sidebar_position: 11
title: 렌더러 플러그인
description: 렌더링 시점의 플러그인 시스템을 사용하여 노션 블록 렌더링을 커스텀하고 확장합니다.
---

렌더러 플러그인을 사용하면 런타임에 노션 렌더링 프로세스를 가로채고 수정할 수 있습니다. 코어 플러그인이 페치(fetch) 단계에서 데이터를 변환하는 반면, 렌더러 플러그인은 React 렌더링 생명주기 내에서 직접 작동하여 블록, 텍스트 및 컴포넌트의 동적인 변환을 가능하게 합니다.

---

## 코어 플러그인 vs 렌더러 플러그인

Noxion은 두 가지 별개의 플러그인 시스템을 사용합니다:

| 기능 | 코어 플러그인 (@noxion/core) | 렌더러 플러그인 (@noxion/notion-renderer) |
| :--- | :--- | :--- |
| **시점** | 페치/빌드 시점 | 렌더링 시점 (React) |
| **대상** | 페이지 메타데이터, RSS, 분석 | 블록, 리치 텍스트, 컴포넌트 |
| **환경** | Node.js / Edge | 브라우저 / 클라이언트 컴포넌트 |
| **활용 사례** | 읽기 시간 추가, 사이트맵 생성 | Mermaid 다이어그램 렌더링, 위키링크 |

---

## 내장 플러그인 사용하기

Noxion에는 일반적인 작업을 위한 여러 내장 플러그인이 포함되어 있습니다. 이들은 팩토리 함수 형태로 제공되며, `NotionRenderer`의 `plugins` prop에 전달하여 사용할 수 있습니다.

### Mermaid 다이어그램
`mermaid` 언어로 작성된 코드 블록을 대화형 다이어그램으로 렌더링합니다.

```tsx
import { NotionRenderer, createMermaidPlugin } from '@noxion/notion-renderer';

const plugins = [
  createMermaidPlugin({
    theme: 'default',
    darkTheme: 'dark'
  })
];

export function MyPage({ recordMap }) {
  return <NotionRenderer recordMap={recordMap} plugins={plugins} />;
}
```

### 강화된 임베드
표준 노션 임베드(YouTube 또는 Twitter 등)를 최적화된 반응형 컴포넌트로 자동 변환합니다.

```tsx
import { createEmbedEnhancedPlugin } from '@noxion/notion-renderer';

const plugins = [
  createEmbedEnhancedPlugin({
    twitter: { theme: 'dark' },
    youtube: { cookie: false }
  })
];
```

### 텍스트 변환
위키링크(`[[페이지 이름]]`)나 모든 블록에 걸친 커스텀 텍스트 교체와 같은 기능을 활성화합니다.

```tsx
import { createTextTransformPlugin } from '@noxion/notion-renderer';

const plugins = [
  createTextTransformPlugin({
    enableWikilinks: true,
    mapWikilink: (slug) => `/docs/${slug}`
  })
];
```

---

## 커스텀 플러그인 만들기

렌더러 플러그인은 `RendererPlugin` 인터페이스를 구현하는 객체입니다.

### 1단계: 플러그인 정의하기
이 예시는 특정 아이콘을 사용하는 특정 콜아웃 블록을 "Alert" 컴포넌트로 변환하는 플러그인을 생성합니다.

```tsx
import { RendererPlugin, PluginPriority } from '@noxion/notion-renderer';
import { Alert } from './components/Alert';

export const alertPlugin: RendererPlugin = {
  name: 'alert-transform',
  priority: PluginPriority.NORMAL,

  blockOverride: ({ block }) => {
    const icon = block.format?.page_icon;
    
    if (block.type === 'callout' && icon === 'warning') {
      return {
        component: Alert,
        props: { type: 'error' }
      };
    }
    
    return null;
  }
};
```

### 2단계: 플러그인 등록하기
커스텀 플러그인을 `NotionRenderer`에 전달하십시오.

```tsx
<NotionRenderer recordMap={recordMap} plugins={[alertPlugin]} />
```

---

## 플러그인 훅

이 시스템은 렌더링의 다양한 단계에 개입할 수 있는 5가지 훅을 포함하고 있습니다.

| 훅 | 설명 |
| :--- | :--- |
| `blockOverride` | 블록을 가로채서 커스텀 React 컴포넌트를 반환합니다. |
| `transformBlock` | 렌더러에 도달하기 전에 가공되지 않은 블록 데이터를 수정합니다. |
| `transformText` | 가공되지 않은 텍스트 문자열을 스캔하여 React 컴포넌트로 교체합니다. |
| `onBlockRender` | 블록 렌더링이 시작되기 직전에 사이드 이펙트를 실행합니다. |
| `onBlockRendered` | 블록 렌더링이 완료된 후에 사이드 이펙트를 실행합니다. |

:::note
여러 플러그인이 `blockOverride`를 제공하는 경우, (우선순위에 따라) null이 아닌 결과를 반환하는 첫 번째 플러그인이 사용됩니다.
:::

---

## 실행 우선순위

`priority` 필드는 플러그인이 실행되는 순서를 결정합니다. 숫자가 낮을수록 먼저 실행됩니다.

```ts
export enum PluginPriority {
  FIRST = 0,
  NORMAL = 50,
  LAST = 100
}
```

다른 플러그인보다 먼저 데이터를 수정해야 하는 플러그인(데이터 정리 등)에는 `PluginPriority.FIRST`를 사용하고, 로깅이나 분석용으로는 `PluginPriority.LAST`를 사용하십시오.

---

## 에러 격리

렌더러 플러그인은 회복 탄력성이 있습니다. 각 훅의 실행은 `try/catch` 블록으로 감싸져 있습니다.

1. 플러그인에서 에러가 발생하면 렌더러가 이를 포착합니다.
2. 플러그 이름과 함께 콘솔에 경고가 기록됩니다.
3. 렌더러는 다음 플러그인으로 넘어가거나 기본 렌더링으로 돌아갑니다.

이를 통해 버그가 있는 단일 플러그인이 전체 문서 사이트를 중단시키지 않도록 보장합니다.

---

## 실전 활용 사례

### 커스텀 코드 블록 렌더링
`blockOverride`를 사용하여 기본 코드 블록을 "복사" 버튼이나 라인 하이라이팅이 포함된 커스텀 컴포넌트로 교체할 수 있습니다.

```tsx
const codeHighlightPlugin: RendererPlugin = {
  name: 'code-highlight',
  blockOverride: ({ block }) => {
    if (block.type === 'code') {
      return { component: MyCustomCodeBlock };
    }
    return null;
  }
};
```

### 위키링크 해석
`transformText`를 사용하여 `[[참조]]` 구문을 내부 링크로 변환합니다.

```tsx
const wikilinkPlugin: RendererPlugin = {
  name: 'wikilinks',
  transformText: ({ text }) => {
    const match = text.match(/\[\[(.*?)\]\]/);
    if (match) {
      return {
        text,
        replacements: [{
          start: match.index!,
          end: match.index! + match[0].length,
          component: <a href={`/p/${match[1]}`}>{match[1]}</a>
        }]
      };
    }
    return { text, replacements: [] };
  }
};
```

전체 타입 정의 및 고급 설정 옵션은 [플러그인 시스템 API](../reference/notion-renderer/plugins)를 참조하십시오.
