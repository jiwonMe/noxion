---
sidebar_position: 10
title: 블록 렌더링 커스텀하기
description: 블록 오버라이드와 커스텀 컴포넌트를 사용하여 노션 블록이 렌더링되는 방식을 변경합니다.
---

Noxion은 노션 콘텐츠가 렌더링되는 방식을 커스텀할 수 있는 유연한 시스템을 제공합니다. 이미지나 링크의 기본 컴포넌트를 교체하거나, 콜아웃, 코드 블록, 이미지와 같은 특정 노션 블록 유형의 렌더링 로직을 완전히 오버라이드할 수 있습니다.

---

## `components` Prop

`NotionRenderer` 컴포넌트는 렌더링 트리에 커스텀 React 컴포넌트를 주입하기 위한 `components` prop을 받습니다.

```tsx
import { NotionRenderer } from '@noxion/notion-renderer';
import { MyImage } from './components/MyImage';
import { MyLink } from './components/MyLink';

export function MyPage({ recordMap }) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      components={{
        Image: MyImage,
        Link: MyLink,
        PageLink: MyLink, // Used for internal Notion page links
      }}
    />
  );
}
```

### 일반적인 컴포넌트 오버라이드

| 컴포넌트 | 설명 | Props |
| :--- | :--- | :--- |
| `Image` | 문서 내의 모든 이미지를 교체합니다. | `src`, `alt`, `width`, `height`, `className` |
| `Link` | 리치 텍스트의 외부 URL을 교체합니다. | `href`, `className`, `children` |
| `PageLink` | 노션 내부 페이지 링크를 교체합니다. | `href`, `className`, `children` |
| `nextImage` | Next.js의 `next/image` 통합을 위해 특별히 사용됩니다. | `Record<string, unknown>` |

---

## 특정 블록 오버라이드하기

`components` prop 내의 `blockOverrides` 속성은 특정 노션 블록 유형을 대상으로 합니다. 이를 통해 다른 블록에 영향을 주지 않고 특정 블록의 UI를 변경할 수 있습니다.

### 예시: 커스텀 콜아웃
이 예시는 기본 노션 콜아웃을 커스텀 스타일이 적용된 컴포넌트로 교체합니다.

```tsx
import { NotionRenderer, NotionBlockProps } from '@noxion/notion-renderer';

const CustomCallout = ({ block, children }: NotionBlockProps) => {
  const icon = block.format?.page_icon;
  
  return (
    <div className="custom-callout">
      <span className="callout-icon">{icon}</span>
      <div className="callout-content">{children}</div>
    </div>
  );
};

export function MyPage({ recordMap }) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      components={{
        blockOverrides: {
          callout: CustomCallout,
        },
      }}
    />
  );
}
```

### `NotionBlockProps` 인터페이스
모든 커스텀 블록 컴포넌트는 다음 props를 전달받습니다:

| Prop | 타입 | 설명 |
| :--- | :--- | :--- |
| `block` | `Block` | 가공되지 않은 노션 블록 데이터입니다. |
| `blockId` | `string` | 블록의 UUID입니다. |
| `level` | `number` | 블록의 중첩 깊이입니다. |
| `children` | `ReactNode` | 렌더링된 블록의 자식 요소들입니다. |

---

## URL 매핑

`mapPageUrl`과 `mapImageUrl`을 사용하여 페이지 및 이미지 URL 해석 방식을 커스텀합니다.

### 페이지 URL 매핑하기
기본적으로 내부 링크는 노션 페이지 ID를 사용합니다. 이를 커스텀 경로로 매핑할 수 있습니다.

```tsx
<NotionRenderer
  recordMap={recordMap}
  mapPageUrl={(pageId) => `/blog/${pageId}`}
/>
```

### 이미지 URL 매핑하기
이미지를 프록시하거나 Cloudinary 또는 Imgix와 같은 변환 파라미터를 추가할 때 유용합니다.

```tsx
<NotionRenderer
  recordMap={recordMap}
  mapImageUrl={(url, block) => {
    if (url.startsWith('https://s3.us-west-2.amazonaws.com')) {
      return `https://my-proxy.com/image?url=${encodeURIComponent(url)}`;
    }
    return url;
  }}
/>
```

---

## 블록 액션

`showBlockActions` prop(v0.4+)은 블록에 "코드 복사" 또는 "링크 공유"와 같은 대화형 버튼을 활성화합니다.

```tsx
<NotionRenderer
  recordMap={recordMap}
  showBlockActions={true} // 지원되는 모든 블록에 대해 활성화
/>

// 또는 블록 유형별로 선택적으로 활성화
<NotionRenderer
  recordMap={recordMap}
  showBlockActions={(blockType) => blockType === 'code'}
/>
```

---

## 오버라이드와 플러그인 결합하기

블록 오버라이드와 [렌더러 플러그인](./renderer-plugins)은 함께 작동하여 계층화된 커스텀 시스템을 제공합니다.

1. **플러그인**이 먼저 실행됩니다. 플러그인의 `blockOverride` 훅이 컴포넌트를 반환하면 해당 컴포넌트가 우선순위를 갖습니다.
2. 플러그인이 블록을 가로채지 않은 경우, 다음으로 **`blockOverrides`** prop을 확인합니다.
3. 마지막 수단으로 **기본 렌더러**가 사용됩니다.

단순한 UI 교체에는 `blockOverrides`를 사용하고, 데이터를 변환하거나 여러 블록 유형에 걸쳐 로직을 적용해야 할 때는 **렌더러 플러그인**을 사용하십시오.

---

## 실전 예시

### 복사 버튼이 있는 코드 블록
기본 `showBlockActions` 기능이 충분하지 않은 경우, 완전히 커스텀된 코드 블록 경험을 구축할 수 있습니다.

```tsx
const CustomCode = ({ block }: NotionBlockProps) => {
  const content = block.properties?.title?.[0]?.[0] || '';
  
  return (
    <div className="code-container">
      <pre><code>{content}</code></pre>
      <button onClick={() => navigator.clipboard.writeText(content)}>
        Copy
      </button>
    </div>
  );
};
```

### 라이트박스가 있는 이미지
기본 이미지 렌더링을 라이트박스 컴포넌트로 감쌉니다.

```tsx
const LightboxImage = (props: any) => {
  return (
    <div className="lightbox-wrapper">
      <img {...props} onClick={() => openLightbox(props.src)} />
    </div>
  );
};

// components.Image에 등록
```

사용 가능한 모든 props와 타입 목록은 [NotionRenderer API 레퍼런스](../reference/notion-renderer/renderer-api)를 참조하십시오.
