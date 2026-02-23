---
sidebar_position: 8
title: 문서 사이트 만들기
description: Notion 기반의 사이드바 내비게이션과 섹션 그룹이 있는 문서 사이트를 설정하세요.
---

# 문서 사이트 만들기

이 가이드는 Noxion으로 문서 사이트를 만드는 과정을 안내합니다. 문서에는 사이드바 내비게이션, 섹션 그룹, 자동 정렬 기능이 포함됩니다 — 모두 Notion 데이터베이스로 구동됩니다.

---

## 1단계: 프로젝트 스캐폴딩

```bash
bun create noxion my-docs --template docs
```

CLI가 Docs Notion 데이터베이스 ID를 물어봅니다. 직접 전달할 수도 있습니다:

```bash
bun create noxion my-docs --template docs --notion-id=abc123...
```

---

## 2단계: Notion 데이터베이스 설정

다음 속성이 있는 Notion 데이터베이스를 만드세요:

| 속성 | 타입 | 설명 |
|------|------|------|
| Title | 제목 | 페이지 제목 (필수) |
| Public | 체크박스 | 체크하면 게시 (필수) |
| Section | 선택 | 사이드바에서 페이지를 그룹화 (예: "시작하기", "API 레퍼런스") |
| Order | 숫자 | 섹션 내 정렬 순서 (1, 2, 3...) |
| Slug | 텍스트 | 커스텀 URL 슬러그 |
| Description | 텍스트 | 메타 설명 |
| Version | 텍스트 | 버전 태그 (선택사항) |

### 데이터베이스 예시

```
┌─────────────────────────────────────────────────────────────────┐
│ Title           │ Public │ Section          │ Order │ Version   │
├─────────────────────────────────────────────────────────────────┤
│ Introduction    │ ✓      │ Getting Started  │ 1     │ latest    │
│ Installation    │ ✓      │ Getting Started  │ 2     │ latest    │
│ Configuration   │ ✓      │ API Reference    │ 1     │ latest    │
│ Plugin API      │ ✓      │ API Reference    │ 2     │ latest    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3단계: 설정

생성된 `noxion.config.ts`는 `collections` 설정을 사용합니다:

```ts
import { defineConfig } from "@noxion/core";

export default defineConfig({
  name: "My Docs",
  domain: "docs.example.com",
  author: "Your Name",
  description: "Documentation for My Project",
  collections: [
    {
      name: "Documentation",
      databaseId: process.env.NOTION_PAGE_ID!,
      pageType: "docs",
      pathPrefix: "docs",
    },
  ],
});
```

---

## 4단계: 작동 방식

### 사이드바 내비게이션

생성된 문서 템플릿은 `Section` 속성으로 페이지를 자동 그룹화합니다. 각 섹션 내에서 페이지는 `Order`로 정렬됩니다. 사이드바 컴포넌트(`DocsSidebar`)가 이 계층 구조를 렌더링합니다:

```
Getting Started
  ├── Introduction        (order: 1)
  └── Installation        (order: 2)
API Reference
  ├── Configuration       (order: 1)
  └── Plugin API          (order: 2)
```

### URL 구조

문서 페이지는 설정한 `pathPrefix` 아래에서 제공됩니다:

```
https://docs.example.com/docs/introduction
https://docs.example.com/docs/installation
https://docs.example.com/docs/configuration
```

### SEO

문서 페이지는 `TechArticle` JSON-LD를 생성합니다 (`BlogPosting` 대신). 이는 기술 문서에 적합한 schema.org 타입입니다.

---

## 5단계: 블로그와 결합

문서에 블로그를 추가하려면 `full` 템플릿으로 전환하거나 블로그 컬렉션을 수동으로 추가하세요:

```ts
collections: [
  { databaseId: process.env.NOTION_PAGE_ID!, pageType: "blog" },
  { databaseId: process.env.DOCS_NOTION_ID!, pageType: "docs", pathPrefix: "docs" },
],
```

자세한 내용은 [설정 → 컬렉션](./configuration#collections)을 참조하세요.
