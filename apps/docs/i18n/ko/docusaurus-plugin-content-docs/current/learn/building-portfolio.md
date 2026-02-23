---
sidebar_position: 9
title: 포트폴리오 만들기
description: Notion 기반의 프로젝트 카드, 필터링, 상세 페이지가 있는 포트폴리오 사이트를 설정하세요.
---

# 포트폴리오 만들기

이 가이드는 Noxion으로 포트폴리오 사이트를 만드는 과정을 안내합니다. 포트폴리오에는 기술 필터링이 가능한 프로젝트 그리드, 주요 프로젝트 강조 표시, 개별 프로젝트 상세 페이지가 포함됩니다.

---

## 1단계: 프로젝트 스캐폴딩

```bash
bun create noxion my-portfolio --template portfolio
```

---

## 2단계: Notion 데이터베이스 설정

다음 속성이 있는 Notion 데이터베이스를 만드세요:

| 속성 | 타입 | 설명 |
|------|------|------|
| Title | 제목 | 프로젝트 이름 (필수) |
| Public | 체크박스 | 체크하면 게시 (필수) |
| Technologies | 다중 선택 | 기술 스택 태그 (예: "React", "TypeScript") |
| Project URL | URL 또는 텍스트 | 라이브 프로젝트 링크 |
| Year | 텍스트 | 프로젝트 제작 연도 |
| Featured | 체크박스 | 이 프로젝트를 눈에 띄게 표시 |
| Slug | 텍스트 | 커스텀 URL 슬러그 |
| Description | 텍스트 | 프로젝트 설명 |

### 데이터베이스 예시

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Title            │ Public │ Technologies       │ Year │ Featured │ URL   │
├──────────────────────────────────────────────────────────────────────────┤
│ Noxion           │ ✓      │ TypeScript, React   │ 2026 │ ✓        │ ...   │
│ CLI Tool         │ ✓      │ Rust, CLI           │ 2025 │          │       │
│ Design System    │ ✓      │ React, Storybook    │ 2024 │ ✓        │ ...   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3단계: 설정

```ts
import { defineConfig } from "@noxion/core";

export default defineConfig({
  name: "My Portfolio",
  domain: "portfolio.example.com",
  author: "Your Name",
  description: "Projects and work by Your Name",
  collections: [
    {
      name: "Projects",
      databaseId: process.env.NOTION_PAGE_ID!,
      pageType: "portfolio",
      pathPrefix: "portfolio",
    },
  ],
});
```

---

## 4단계: 작동 방식

### 프로젝트 그리드

홈페이지는 `PortfolioGrid` 템플릿을 사용하여 프로젝트 카드 그리드를 렌더링합니다. 각 카드에는 프로젝트 제목, 설명, 기술, 연도가 표시됩니다.

### 필터링

`PortfolioFilter` 컴포넌트가 프로젝트에서 모든 고유 기술 태그를 추출하여 필터 버튼을 렌더링합니다. 기술을 클릭하면 일치하는 프로젝트만 표시되도록 그리드가 필터링됩니다.

### 주요 프로젝트

`Featured` 체크박스가 체크된 프로젝트는 그리드 상단에 나타나거나, 템플릿에 따라 별도의 주요 섹션에 표시됩니다.

### URL 구조

```
https://portfolio.example.com/portfolio/noxion
https://portfolio.example.com/portfolio/cli-tool
```

### SEO

포트폴리오 페이지는 `CreativeWork` JSON-LD를 생성합니다. 이는 프로젝트와 창작물에 적합한 schema.org 타입입니다.

---

## 5단계: 블로그 + 포트폴리오 통합 사이트

블로그와 포트폴리오를 결합하려면:

```ts
collections: [
  { databaseId: process.env.NOTION_PAGE_ID!, pageType: "blog" },
  { databaseId: process.env.PORTFOLIO_NOTION_ID!, pageType: "portfolio", pathPrefix: "portfolio" },
],
```
