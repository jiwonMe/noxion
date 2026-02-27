---
sidebar_position: 9
title: 포트폴리오 사이트 구축하기
description: Notion을 기반으로 프로젝트 카드, 필터링, 상세 페이지가 포함된 포트폴리오 사이트를 설정합니다.
---

# 포트폴리오 사이트 구축하기

이 가이드는 Noxion을 사용하여 포트폴리오 사이트를 만드는 과정을 안내합니다. 여러분의 포트폴리오는 기술 필터링 기능이 있는 프로젝트 그리드, 주요 프로젝트 강조 표시, 그리고 개별 프로젝트 상세 페이지를 갖추게 됩니다.

---

## Step 1: 프로젝트 스캐폴딩

```bash
bun create noxion my-portfolio --template portfolio
```

---

## Step 2: Notion 데이터베이스 설정

다음 속성들을 포함하는 Notion 데이터베이스를 생성합니다:

| 속성 | 유형 | 설명 |
|----------|------|-------------|
| Title | Title | 프로젝트 이름 (필수) |
| Public | Checkbox | 게시하려면 체크 (필수) |
| Technologies | Multi-select | 기술 스택 태그 (예: "React", "TypeScript") |
| Project URL | URL or Text | 라이브 프로젝트 링크 |
| Year | Text | 프로젝트가 구축된 연도 |
| Featured | Checkbox | 이 프로젝트를 주요 프로젝트로 강조 표시 |
| Slug | Text | 사용자 정의 URL 슬러그 |
| Description | Text | 프로젝트 설명 |

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

## Step 3: 설정

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

## Step 4: 작동 방식

### 프로젝트 그리드

홈페이지는 `PortfolioGrid` 템플릿을 사용하여 프로젝트 카드 그리드를 렌더링합니다. 각 카드에는 프로젝트 제목, 설명, 기술, 연도가 표시됩니다.

### 필터링

`PortfolioFilter` 컴포넌트는 프로젝트에서 모든 고유 기술 태그를 추출하여 필터 버튼을 렌더링합니다. 기술을 클릭하면 일치하는 프로젝트만 표시되도록 그리드가 필터링됩니다.

### 주요 프로젝트

`Featured` 체크박스가 체크된 프로젝트는 템플릿에 따라 그리드 상단에 나타나거나 별도의 주요 섹션에 표시됩니다.

### URL 구조

```
https://portfolio.example.com/portfolio/noxion
https://portfolio.example.com/portfolio/cli-tool
```

### SEO

포트폴리오 페이지는 프로젝트 및 창작물에 적합한 schema.org 유형인 `CreativeWork` JSON-LD를 생성합니다.

---

## Step 5: 블로그 + 포트폴리오 전체 사이트

포트폴리오에 블로그를 결합하려면 다음과 같이 설정합니다:

```ts
collections: [
  { databaseId: process.env.NOTION_PAGE_ID!, pageType: "blog" },
  { databaseId: process.env.PORTFOLIO_NOTION_ID!, pageType: "portfolio", pathPrefix: "portfolio" },
],
```

---

## 필터링 상세 안내

Noxion의 필터링 시스템은 자동으로 작동하며 유지 관리가 필요 없도록 설계되었습니다.

### PortfolioFilter 작동 방식

`PortfolioFilter` 컴포넌트는 UI를 생성하기 위해 다단계 프로세스를 수행합니다:
1. **추출**: 모든 공개 프로젝트의 `Technologies` 속성을 스캔합니다.
2. **중복 제거**: 발견된 모든 태그의 고유 집합을 만듭니다.
3. **정렬**: 태그를 알파벳순 또는 사용 빈도순으로 정렬합니다.
4. **렌더링**: 대화형 버튼 목록을 생성합니다.

### 사용자 정의 필터 로직 만들기

기술 이외의 다른 항목(예: "Industry" 또는 "Project Type")으로 필터링하려면 설정에서 `schema`를 업데이트할 수 있습니다:

```ts
collections: [
  {
    name: "Projects",
    databaseId: process.env.PORTFOLIO_NOTION_ID!,
    pageType: "portfolio",
    schema: {
      tags: "Industry", // "Technologies" 대신 "Industry" 속성을 필터링에 사용합니다
    },
  },
],
```

### 필터 결합하기

Noxion은 다차원 필터링을 지원합니다. 사용자가 기술과 연도를 동시에 필터링하도록 허용할 수 있습니다.

| 필터 유형 | 구현 방식 |
|-------------|----------------|
| Technology | Multi-select 속성 |
| Year | Select 또는 Text 속성 |
| Status | Select (예: "Completed", "In Progress") |

### URL 기반 필터링

필터는 URL 쿼리 매개변수와 동기화됩니다. 이를 통해 사용자는 포트폴리오의 특정 필터링된 보기에 대한 링크를 공유할 수 있습니다.

예시: `portfolio.example.com/?tech=React&year=2025`

---

## 주요 프로젝트

최고의 결과물을 강조하는 것은 전문적인 포트폴리오에 필수적입니다.

### Featured 체크박스

Notion에서 `Featured` 속성이 체크되면, Noxion은 해당 프로젝트를 더 높은 우선순위로 처리합니다.

### 주요 프로젝트 표시 사용자 정의

`themeConfig`에서 주요 프로젝트가 표시되는 방식을 선택할 수 있습니다:

```ts
themeConfig: {
  portfolio: {
    featuredDisplay: "hero", // 옵션: "hero", "pinned", "separate"
  },
},
```

- **hero**: 가장 최근의 주요 프로젝트가 전체 너비의 히어로 섹션으로 표시됩니다.
- **pinned**: 주요 프로젝트가 날짜에 관계없이 그리드 상단에 고정됩니다.
- **separate**: 메인 그리드 위에 전용 "Featured Work" 섹션이 나타납니다.

### 별도 주요 섹션 vs 고정 방식

| 접근 방식 | 적합한 경우 |
|----------|----------|
| Pinned | 정확한 순서를 제어하고 싶은 소규모 포트폴리오 |
| Separate | "Case Studies"와 "Experiments"를 구분하고 싶은 대규모 포트폴리오 |

---

## 사용자 정의 프로젝트 레이아웃

모든 프로젝트는 고유하며, 포트폴리오는 이를 반영해야 합니다.

### 그리드 vs 리스트 보기

기본값은 반응형 그리드이지만, 더 편집적인 느낌을 주기 위해 리스트 보기로 전환할 수 있습니다.

```tsx
<PortfolioGrid layout="list" />
```

### 카드 사용자 정의

`cardFields` 설정을 통해 프로젝트 카드에 표시될 데이터를 정확하게 제어할 수 있습니다:

```ts
themeConfig: {
  portfolio: {
    cardFields: ["title", "description", "technologies", "year"],
  },
},
```

### 상세 페이지 사용자 정의

프로젝트 상세 페이지는 Notion 페이지의 전체 콘텐츠를 렌더링합니다. 다음을 포함한 Notion의 모든 레이아웃 기능을 사용할 수 있습니다:
- **열(Columns)**: 텍스트와 이미지를 나란히 배치할 때 사용합니다.
- **콜아웃(Callouts)**: 주요 시사점이나 프로젝트 통계를 강조할 때 사용합니다.
- **갤러리(Galleries)**: 여러 스크린샷을 보여줄 때 사용합니다.

### 라이브 데모 임베드하기

Notion의 `/embed` 블록을 사용하여 라이브 데모, Figma 프로토타입 또는 YouTube 비디오를 프로젝트 페이지에 직접 포함하십시오. Noxion은 이를 반응형 iframe으로 렌더링합니다.

---

## 포트폴리오 전용 SEO

Noxion은 여러분의 작업물이 잘 검색되고 공유될 때 멋지게 보이도록 보장합니다.

### CreativeWork JSON-LD 스키마

블로그 포스트와 달리 프로젝트는 `CreativeWork`로 마크업됩니다. 이 스키마에는 다음을 위한 특정 필드가 포함됩니다:
- `keywords`: `Technologies` 태그에서 자동으로 채워집니다.
- `dateCreated`: `Year` 속성에서 매핑됩니다.
- `url`: 라이브 프로젝트로 연결되는 링크입니다.

### 기술 태그를 통한 키워드 생성

`Technologies` 다중 선택 속성의 각 태그는 페이지의 `<meta name="keywords">` 태그와 JSON-LD `keywords` 배열에 추가됩니다. 이는 검색 엔진이 작업물의 기술적 맥락을 이해하는 데 도움이 됩니다.

### OG 태그의 프로젝트 이미지

Noxion은 Notion 페이지 커버를 `og:image`로 사용합니다. 커버가 설정되어 있지 않으면 페이지 콘텐츠에서 발견된 첫 번째 이미지로 대체됩니다.

| 이미지 소스 | 우선순위 |
|--------------|----------|
| 페이지 커버 | 1 (가장 높음) |
| 첫 번째 이미지 블록 | 2 |
| 사이트 기본 OG | 3 (가장 낮음) |

---

## 블로그와 결합하기

많은 개발자들이 자신의 프로젝트와 생각을 모두 보여줄 수 있는 사이트를 원합니다.

### 전체 사이트 설정

전형적인 "개발자 홈" 설정은 다음과 같습니다:

```ts
export default defineConfig({
  name: "Jane Doe",
  collections: [
    { 
      name: "Blog", 
      databaseId: process.env.BLOG_ID!, 
      pageType: "blog", 
      pathPrefix: "blog" 
    },
    { 
      name: "Portfolio", 
      databaseId: process.env.PORTFOLIO_ID!, 
      pageType: "portfolio", 
      pathPrefix: "projects" 
    },
  ],
});
```

### 공유 내비게이션

Noxion은 모든 컬렉션을 포함하는 내비게이션 메뉴를 자동으로 생성합니다. `themeConfig.nav`에서 순서를 사용자 정의할 수 있습니다.

### 상호 링크

표준 Notion 링크를 사용하여 블로그 포스트에서 포트폴리오 프로젝트로 링크할 수 있습니다. Noxion은 빌드 시점에 이를 올바른 `/projects/my-cool-app` URL로 변환합니다.

---

## 실제 사례

### 전체 포트폴리오 데이터베이스

| Title | Public | Technologies | Year | Featured | Slug |
|-------|--------|--------------|------|----------|------|
| Noxion | ✓ | TypeScript, Next.js | 2026 | ✓ | noxion |
| AI Chatbot | ✓ | Python, OpenAI | 2025 | ✓ | ai-chat |
| Weather App | ✓ | React, API | 2024 | | weather |
| Task Manager | ✓ | Vue, Firebase | 2024 | | tasks |
| Portfolio v1 | ✓ | HTML, CSS | 2023 | | v1 |
| E-commerce | ✓ | Shopify, Liquid | 2025 | ✓ | shop |
| Crypto Dashboard | ✓ | Svelte, Web3 | 2024 | | crypto |
| Mobile Game | ✓ | Unity, C# | 2023 | | game |

### 다중 유형 사이트 설정

블로그, 포트폴리오, 문서가 포함된 사이트의 경우:

```ts
collections: [
  { 
    name: "Writing", 
    databaseId: "...", 
    pageType: "blog", 
    pathPrefix: "blog" 
  },
  { 
    name: "Work", 
    databaseId: "...", 
    pageType: "portfolio", 
    pathPrefix: "work" 
  },
  { 
    name: "Docs", 
    databaseId: "...", 
    pageType: "docs", 
    pathPrefix: "docs" 
  },
],
```

이 설정은 전적으로 Notion에 의해 구동되는 포괄적인 개인 또는 회사 웹사이트를 제공합니다.
