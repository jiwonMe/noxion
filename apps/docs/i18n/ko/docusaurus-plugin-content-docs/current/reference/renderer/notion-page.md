---
title: NotionPage
description: "@noxion/renderer NotionPage 컴포넌트"
---

# `<NotionPage />`

```tsx
import { NotionPage } from "@noxion/renderer";
```

`react-notion-x`를 사용해 Notion 페이지를 렌더링합니다. 클라이언트 컴포넌트(`"use client"`).

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `recordMap` | `ExtendedRecordMap` | 필수 | `fetchPage()`로 가져온 페이지 데이터 |
| `rootPageId` | `string` | — | 링크 해석용 루트 페이지 ID |
| `fullPage` | `boolean` | `true` | 헤더 포함 전체 페이지 렌더링 |
| `darkMode` | `boolean` | — | 다크모드 강제 (테마에서 자동 감지) |
| `previewImages` | `boolean` | `false` | 이미지 미리보기 활성화 |
| `showTableOfContents` | `boolean` | `false` | TOC 사이드바 표시 |
| `minTableOfContentsItems` | `number` | `3` | TOC 렌더링 최소 항목 수 |
| `pageUrlPrefix` | `string` | `"/"` | 내부 페이지 링크 접두사 |
| `nextImage` | `unknown` | — | 최적화를 위해 `next/image` 전달 |
| `className` | `string` | — | 래퍼 div CSS 클래스 |

## 이미지 최적화

`next/image`를 전달해 자동 AVIF/WebP 변환 활성화:

```tsx
import Image from "next/image";
import { NotionPage } from "@noxion/renderer";

<NotionPage
  recordMap={recordMap}
  rootPageId={post.id}
  nextImage={Image}
/>
```

## Signed URLs

컴포넌트는 `recordMap.signed_urls`를 자동으로 읽습니다. 현재는 `notion-utils`의 `defaultMapImageUrl`을 기반으로 만료되지 않는 `notion.so/image/` 프록시 URL을 사용합니다.
