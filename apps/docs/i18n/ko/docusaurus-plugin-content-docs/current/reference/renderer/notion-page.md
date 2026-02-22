---
title: NotionPage
description: "@noxion/renderer NotionPage 컴포넌트"
---

# `<NotionPage />`

```tsx
import { NotionPage } from "@noxion/renderer";
```

[`@noxion/notion-renderer`](https://github.com/jiwonme/noxion/tree/main/packages/notion-renderer)를 사용해 Notion 페이지를 렌더링합니다. 클라이언트 컴포넌트(`"use client"`).

컴포넌트가 자동으로 처리하는 기능:
- **다크 모드 감지** — `<html>`의 `data-theme` 속성을 MutationObserver로 관찰
- **Shiki 구문 강조** — 듀얼 테마(라이트 + 다크) 비동기 초기화
- **이미지 URL 매핑** — Notion 이미지 URL을 안정적인 `notion.so/image/` 프록시 URL로 변환
- **KaTeX 수식** — `katex.renderToString()`을 통한 서버 사이드 렌더링 (클라이언트 수학 JS 불필요)

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `recordMap` | `ExtendedRecordMap` | 필수 | `fetchPage()`로 가져온 페이지 데이터 |
| `rootPageId` | `string` | — | 링크 해석용 루트 페이지 ID |
| `fullPage` | `boolean` | `true` | 헤더 포함 전체 페이지 렌더링 |
| `darkMode` | `boolean` | — | 다크모드 강제 (테마에서 자동 감지) |
| `previewImages` | `boolean` | `false` | 이미지 미리보기 활성화 |
| `pageUrlPrefix` | `string` | `"/"` | 내부 페이지 링크 접두사 |
| `className` | `string` | — | 래퍼 div CSS 클래스 |

## 기본 사용법

```tsx
import { fetchPage } from "@noxion/core";
import { NotionPage } from "@noxion/renderer";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const recordMap = await fetchPage(notion, post.id);

  return (
    <article>
      <NotionPage
        recordMap={recordMap}
        rootPageId={post.id}
      />
    </article>
  );
}
```

## 구문 강조 (Shiki)

컴포넌트는 [Shiki](https://shiki.style)를 자동으로 초기화합니다. `github-light`와 `github-dark` 테마로 듀얼 테마를 지원하며, 38개 주요 언어가 사전 로드됩니다. 사전 로드되지 않은 언어는 에러 없이 일반 텍스트로 표시됩니다.

## 수식 (KaTeX)

블록 수식과 인라인 수식은 `katex.renderToString()`을 통해 서버 사이드에서 렌더링됩니다. 클라이언트 사이드 KaTeX JavaScript가 필요하지 않습니다.

## 이미지 URL 처리

`notion-utils`의 `defaultMapImageUrl()`을 자동으로 적용하여 모든 이미지 참조를 안정적인 `notion.so/image/` 프록시 URL로 변환합니다. S3 presigned URL(~1시간 후 만료)은 렌더링된 출력에 **절대** 사용되지 않습니다.

[이미지 최적화](../../learn/image-optimization) 참조.

## CSS 스타일링

모든 Notion 블록은 BEM 네이밍 규칙(`noxion-{block}__{element}--{modifier}`)을 사용한 순수 CSS로 스타일링됩니다. `--noxion-*` CSS 커스텀 속성으로 테마가 적용됩니다.

```css
@import '@noxion/notion-renderer/styles';
```

[테마](../../learn/themes)에서 색상, 폰트, 간격 커스터마이징 방법을 참조하세요.
