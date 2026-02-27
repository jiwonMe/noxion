---
sidebar_position: 14
title: v0.4로 마이그레이션하기
description: "새로운 렌더 타임 플러그인 시스템, 접근성 및 성능 기능이 포함된 Noxion 사이트를 v0.4로 업그레이드하십시오."
---

# Noxion v0.4로 마이그레이션하기

## 개요

Noxion v0.4는 @noxion/notion-renderer 패키지를 위한 강력한 렌더 타임 플러그인 시스템을 도입했습니다. 이번 릴리스는 확장성, 접근성 및 성능에 중점을 두었습니다. 이제 코어 렌더러를 수정하지 않고도 렌더링 수명 주기에 연결하여 블록 렌더링을 사용자 정의하고, 텍스트 패턴을 변환하며, 컴포넌트를 오버라이드할 수 있습니다.

이번 릴리스는 이전 버전과 완전히 호환됩니다. 기존 설정은 수정 없이 그대로 작동합니다.

---

## 렌더 타임 플러그인 시스템

플러그인 시스템은 v0.4에서 가장 중요한 추가 사항입니다. 개발자는 이를 통해 렌더링 프로세스의 특정 지점에 로직을 주입할 수 있습니다. 플러그인은 블록 데이터가 컴포넌트에 도달하기 전에 수정하거나, 특정 블록 유형에 대한 사용자 정의 컴포넌트를 제공하거나, 텍스트 콘텐츠를 전역적으로 변환할 수 있습니다.

### 비교

v0.3에서는 오버라이드를 위해 오직 `components` 프롭에만 의존했습니다. v0.4에서 플러그인은 렌더링 로직을 공유하고 재사용할 수 있는 더 모듈화된 방식을 제공합니다.

```tsx
// 이전 (v0.3): blockOverrides만 사용
import { NotionRenderer } from '@noxion/notion-renderer';

const MyCodeBlock = ({ block }) => {
  return <pre>{JSON.stringify(block)}</pre>;
};

export const MyPage = ({ recordMap }) => (
  <NotionRenderer
    recordMap={recordMap}
    components={{ 
      blockOverrides: { 
        code: MyCodeBlock 
      } 
    }}
  />
);

// 이후 (v0.4): 플러그인 시스템이 그 위에 계층화됨
import { 
  NotionRenderer, 
  createMermaidPlugin, 
  createChartPlugin 
} from '@noxion/notion-renderer';

export const MyPage = ({ recordMap }) => (
  <NotionRenderer
    recordMap={recordMap}
    plugins={[
      createMermaidPlugin(), 
      createChartPlugin()
    ]}
  />
);
```

:::tip
플러그인은 배열에 제공된 순서대로 실행됩니다. 여러 플러그인이 동일한 블록 유형을 대상으로 하는 경우, 리스트의 마지막 플러그인이 컴포넌트 오버라이드에 대해 우선권을 갖습니다.
:::

---

## 내장 플러그인

Noxion v0.4는 일반적인 사용 사례를 처리하는 5개의 내장 플러그인과 함께 제공됩니다.

### 1. createMermaidPlugin
이 플러그인은 `mermaid` 언어를 사용하는 코드 블록을 감지하고 Mermaid.js를 사용하여 대화형 다이어그램으로 렌더링합니다. 초기 번들 크기를 작게 유지하기 위해 동적 임포트를 사용합니다.

```tsx
import { createMermaidPlugin } from '@noxion/notion-renderer';

const plugins = [createMermaidPlugin({ theme: 'dark' })];
```

### 2. createChartPlugin
Mermaid 플러그인과 유사하게, 이 플러그인은 Chart.js를 위한 JSON 데이터를 포함하는 코드 블록을 감지하고 라이브 차트로 렌더링합니다.

```tsx
import { createChartPlugin } from '@noxion/notion-renderer';

const plugins = [createChartPlugin()];
```

### 3. createCalloutTransformPlugin
이 플러그인을 사용하면 아이콘이나 콘텐츠 패턴을 기반으로 표준 Notion 콜아웃을 아코디언이나 탭과 같은 더 복잡한 UI 요소로 변환할 수 있습니다.

```tsx
import { createCalloutTransformPlugin } from '@noxion/notion-renderer';

const plugins = [
  createCalloutTransformPlugin({
    transformMap: {
      'info': 'accordion',
      'tools': 'tab'
    }
  })
];
```

### 4. createEmbedEnhancedPlugin
YouTube, Twitter 및 Figma 링크에 대한 더 나은 처리를 통해 기본 임베드 블록을 향상시킵니다. 로딩 상태와 반응형 래퍼를 자동으로 추가합니다.

### 5. createTextTransformPlugin
전역 텍스트 교체 패턴을 허용합니다. 이는 멘션 자동 링크, 사용자 정의 서식 추가 또는 콘텐츠 정제에 유용합니다.

```tsx
import { createTextTransformPlugin } from '@noxion/notion-renderer';

const plugins = [
  createTextTransformPlugin({
    rules: [
      {
        pattern: /@(\w+)/g,
        replace: (match, username) => (
          <a href={`https://twitter.com/${username}`}>@{username}</a>
        )
      }
    ]
  })
];
```

---

## 새로운 컴포넌트

렌더러의 신뢰성과 사용자 경험을 개선하기 위해 몇 가지 새로운 컴포넌트가 추가되었습니다.

### BlockErrorBoundary
이 컴포넌트는 기본적으로 모든 블록을 래핑합니다. 데이터 오류나 사용자 정의 컴포넌트 충돌로 인해 특정 블록의 렌더링이 실패하는 경우, 해당 실패를 격리합니다. 페이지의 나머지 부분은 계속 작동합니다.

### HeadingAnchor
이제 헤딩은 클릭 가능한 앵커 링크를 지원합니다. 사용자가 헤딩 위에 마우스를 올리면 앵커 아이콘이 나타나며, 해당 섹션으로의 직접 링크를 복사할 수 있습니다.

```tsx
// components 프롭을 통해 앵커 아이콘을 사용자 정의할 수 있습니다.
<NotionRenderer
  recordMap={recordMap}
  components={{
    HeadingAnchor: ({ id }) => <a href={`#${id}`}>#</a>
  }}
/>
```

### BlockActions
이 컴포넌트는 "링크 복사" 또는 "코드 복사"와 같은 블록 수준의 액션을 제공합니다. 특히 코드 블록과 콜아웃에 유용합니다.

### LoadingPlaceholder
무거운 종속성을 가져오는 동안 레이아웃 시프트를 방지하기 위해 지연 로드된 블록(예: Mermaid 또는 Charts)에서 사용하는 스켈레톤 로딩 컴포넌트입니다.

---

## 새로운 훅

두 개의 새로운 훅은 렌더러 상태에 대한 더 깊은 접근을 제공합니다.

### useRendererPlugins()
활성 플러그인 목록과 해결된 구성을 반환합니다. 플러그인 로직과 상호 작용해야 하는 사용자 정의 컴포넌트를 빌드하는 경우 이를 사용하십시오.

### useResolvedBlockRenderer()
주어진 블록을 렌더링하는 데 사용될 컴포넌트를 결정하는 로우 레벨 훅입니다. 코어 컴포넌트, 블록 오버라이드 및 플러그인 오버라이드를 고려합니다.

```tsx
const { Component, props } = useResolvedBlockRenderer(block);
```

---

## 접근성 개선 사항

접근성은 v0.4의 핵심 중점 사항입니다. 다음과 같은 변경 사항이 구현되었습니다.

1. **대화형 요소**: 렌더러에서 생성된 모든 버튼과 링크에는 이제 적절한 `aria-label` 속성이 포함됩니다.
2. **키보드 탐색**: 대화형 블록은 이제 표준 키보드 활성화 패턴을 지원합니다. `handleKeyboardActivation` 유틸리티는 "Enter" 및 "Space" 키가 액션을 올바르게 트리거하도록 보장합니다.
3. **헤딩 ID**: 모든 헤딩은 이제 `generateHeadingId()`를 통해 생성된 결정론적 ID를 받습니다. 이는 딥 링크 및 스크린 리더 탐색을 개선합니다.
4. **토글 블록**: 토글 블록은 이제 보조 기술에 상태를 전달하기 위해 `aria-expanded`를 사용합니다.

---

## 새로운 유틸리티

사용자 정의 확장을 빌드하는 개발자를 위해 새로운 유틸리티 함수를 사용할 수 있습니다.

- **createLazyBlock()**: 블록이 뷰포트에 들어올 때까지 렌더링을 지연시키기 위해 `IntersectionObserver`를 사용하는 래퍼입니다.
- **generateHeadingId()**: 헤딩의 텍스트 콘텐츠에서 URL 친화적인 ID를 생성합니다.
- **getAriaLabel()**: 블록에 대해 일관된 레이블을 생성하는 헬퍼입니다.
- **handleKeyboardActivation()**: 사용자 정의 대화형 컴포넌트에 키보드 지원을 추가하는 과정을 간소화하는 유틸리티입니다.

---

## 컬렉션 뷰 (테이블)

v0.4는 데이터베이스 렌더링의 첫 번째 단계를 도입했습니다. 이제 `CollectionViewBlock`은 Notion 데이터베이스 뷰를 HTML 테이블로 렌더링할 수 있습니다.

:::note
1단계는 테이블 뷰만 지원합니다. 보드, 갤러리 및 캘린더 뷰는 향후 릴리스에서 계획되어 있습니다.
:::

---

## showBlockActions 프롭

이제 `NotionRenderer`의 `showBlockActions` 프롭을 사용하여 전역적으로 또는 조건부로 블록 수준의 액션을 활성화할 수 있습니다.

```tsx
// 지원되는 모든 블록에 대해 활성화
<NotionRenderer
  recordMap={recordMap}
  showBlockActions={true}
/>

// 코드 블록에 대해서만 활성화
<NotionRenderer
  recordMap={recordMap}
  showBlockActions={(blockType) => blockType === 'code'}
/>
```

---

## 업그레이드하기

업그레이드하려면 모든 Noxion 종속성을 0.4.0 버전으로 업데이트하십시오.

```bash
bun add @noxion/notion-renderer@0.4.0 @noxion/renderer@0.4.0 @noxion/core@0.4.0
```

npm 또는 yarn을 사용하는 경우:

```bash
npm install @noxion/notion-renderer@0.4.0 @noxion/renderer@0.4.0 @noxion/core@0.4.0
```

---

## 하위 호환성 유지

Noxion v0.4는 v0.3을 그대로 대체할 수 있습니다. `blockOverrides` API는 계속해서 완전히 지원되며, 새로운 플러그인 시스템은 추가적인 기능입니다. 모든 기존 프롭은 유지됩니다. 새로운 기능을 사용하지 않는 경우, 애플리케이션은 변경 없이 작동합니다.

---

## 마이그레이션 체크리스트

v0.4로의 원활한 전환을 위해 다음 단계를 따르십시오.

- [ ] 모든 `@noxion` 패키지를 0.4.0 버전으로 업데이트하십시오.
- [ ] 기존 `blockOverrides`가 여전히 올바르게 렌더링되는지 확인하십시오.
- [ ] 다이어그램 지원이 필요한 경우 `createMermaidPlugin`을 추가하십시오.
- [ ] 차트 지원이 필요한 경우 `createChartPlugin`을 추가하십시오.
- [ ] 코드 블록에 복사 버튼을 제공하려면 `showBlockActions`를 활성화하십시오.
- [ ] `HeadingAnchor` 요소가 테마에 적절하게 스타일링되었는지 CSS를 확인하십시오.
- [ ] 토글 블록과 콜아웃에서 키보드 탐색을 테스트하십시오.
