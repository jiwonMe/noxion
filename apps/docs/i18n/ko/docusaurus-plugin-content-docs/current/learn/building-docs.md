---
sidebar_position: 8
title: Docs 사이트 구축하기
description: 사이드바 내비게이션과 섹션 그룹화 기능이 포함된 Notion 기반 문서 사이트를 설정합니다.
---

# Docs 사이트 구축하기

이 가이드는 Noxion을 사용하여 문서 사이트를 만드는 과정을 안내합니다. 여러분의 문서는 사이드바 내비게이션, 섹션 그룹화, 자동 정렬 기능을 갖추게 되며, 이 모든 것은 Notion 데이터베이스에 의해 구동됩니다.

---

## Step 1: 프로젝트 스캐폴딩

```bash
bun create noxion my-docs --template docs
```

CLI에서 Docs Notion 데이터베이스 ID를 요청할 것입니다. 다음과 같이 직접 전달할 수도 있습니다:

```bash
bun create noxion my-docs --template docs --notion-id=abc123...
```

---

## Step 2: Notion 데이터베이스 설정

다음 속성들을 포함하는 Notion 데이터베이스를 생성합니다:

| 속성 | 유형 | 설명 |
|----------|------|-------------|
| Title | Title | 페이지 제목 (필수) |
| Public | Checkbox | 게시하려면 체크 (필수) |
| Section | Select | 사이드바에서 페이지를 그룹화합니다 (예: "Getting Started", "API Reference") |
| Order | Number | 섹션 내 정렬 순서 (1, 2, 3...) |
| Slug | Text | 사용자 정의 URL 슬러그 |
| Description | Text | 메타 설명 |
| Version | Text | 버전 태그 (선택 사항) |

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

## Step 3: 설정

생성된 `noxion.config.ts` 파일은 `collections` 설정을 사용합니다:

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

## Step 4: 작동 방식

### 사이드바 내비게이션

생성된 docs 템플릿은 `Section` 속성에 따라 페이지를 자동으로 그룹화합니다. 각 섹션 내에서 페이지는 `Order`에 따라 정렬됩니다. 사이드바 컴포넌트(`DocsSidebar`)는 이 계층 구조를 렌더링합니다:

```
Getting Started
  ├── Introduction        (order: 1)
  └── Installation        (order: 2)
API Reference
  ├── Configuration       (order: 1)
  └── Plugin API          (order: 2)
```

### URL 구조

Docs 페이지는 설정한 `pathPrefix` 하위 경로로 제공됩니다:

```
https://docs.example.com/docs/introduction
https://docs.example.com/docs/installation
https://docs.example.com/docs/configuration
```

### SEO

Docs 페이지는 기술 문서에 적합한 schema.org 유형인 `TechArticle` JSON-LD를 생성합니다 (`BlogPosting` 대신 사용됨).

---

## Step 5: 블로그와 결합하기

문서와 함께 블로그를 추가하려면 `full` 템플릿으로 전환하거나 블로그 컬렉션을 수동으로 추가합니다:

```ts
collections: [
  { databaseId: process.env.NOTION_PAGE_ID!, pageType: "blog" },
  { databaseId: process.env.DOCS_NOTION_ID!, pageType: "docs", pathPrefix: "docs" },
],
```

자세한 내용은 [설정 → 컬렉션](./configuration#collections)을 참조하십시오.

---

## 고급 사이드바 사용자 정의

사이드바는 문서의 주요 내비게이션 도구입니다. Noxion은 Notion에서 직접 구조와 모양을 사용자 정의할 수 있는 여러 가지 방법을 제공합니다.

### 중첩 섹션

`Section` 속성에서 구분 기호를 사용하여 중첩된 섹션을 만들 수 있습니다. 기본적으로 Noxion은 `/` 문자를 기준으로 섹션을 계층 구조로 나눕니다.

| Notion Section 값 | 사이드바 결과 |
|----------------------|----------------|
| `API` | 최상위 API 섹션 |
| `API / Auth` | API 내부의 Auth 하위 섹션 |
| `API / Auth / OAuth` | Auth 내부의 OAuth 하위 섹션 |

:::tip
사용 편의성을 위해 3단계 이상의 깊은 중첩은 권장하지 않습니다. 가능한 한 2단계 이내로 유지하십시오.
:::

### 섹션 순서 사용자 정의

섹션은 기본적으로 알파벳순으로 정렬됩니다. 특정 순서를 강제하려면 Notion에서 섹션 이름 앞에 숫자를 붙일 수 있으며, Noxion은 렌더링 시 이를 제거합니다:

1. `01. Getting Started`
2. `02. Core Concepts`
3. `03. Advanced Usage`

### 아이콘 및 배지

섹션 이름에 이모지나 특정 아이콘 키를 포함하여 섹션에 아이콘을 추가할 수 있습니다. 배지("New" 또는 "Beta" 등)의 경우 `Title` 속성에서 다음 구문을 사용합니다:

- `Title`: `Authentication [New]`
- `Title`: `Legacy API [Deprecated]`

`DocsSidebar` 컴포넌트는 이 대괄호를 파싱하여 스타일이 적용된 배지로 렌더링합니다.

### 페이지 숨기기

직접 링크를 통해 접근은 가능하게 유지하면서 사이드바에서 페이지를 숨기려면 다음을 수행합니다:

1. `Public`을 체크된 상태로 유지합니다.
2. `Hide from Sidebar`라는 이름의 속성(Checkbox)을 추가하고 체크합니다.
3. 또는 `Order`를 `-1`로 설정합니다.

---

## 버전 관리

Noxion은 멀티 버전 문서를 기본적으로 지원합니다. 이는 이전 릴리스의 문서를 유지해야 하는 프로젝트에 필수적입니다.

### Version 속성

Notion 데이터베이스에 `Version` 속성(Select 또는 Text)을 추가합니다. 이를 통해 페이지에 특정 릴리스 버전(예: `v1.0`, `v2.0`, `latest`)을 태그할 수 있습니다.

### 버전에 따른 필터링

`noxion.config.ts`에서 어떤 버전을 기본값으로 처리할지 정의할 수 있습니다:

```ts
collections: [
  {
    name: "Documentation",
    databaseId: process.env.DOCS_NOTION_ID!,
    pageType: "docs",
    pathPrefix: "docs",
    schema: {
      version: "Release", // Notion 속성 "Release"에 매핑됨
    },
  },
],
```

### 버전 드롭다운 컴포넌트

`VersionDropdown` 컴포넌트는 `Version` 속성의 모든 고유 값을 자동으로 감지하여 문서 헤더에 선택기를 렌더링합니다.

:::note
사용자가 버전을 선택하면 Noxion은 해당 버전에 일치하는 페이지만 표시하도록 사이드바와 검색 결과를 필터링합니다.
:::

---

## 검색

검색은 대규모 문서 사이트에서 매우 중요합니다. Noxion은 Notion 콘텐츠를 인덱싱하는 내장 검색 구현을 포함하고 있습니다.

### 검색 작동 방식

1. **인덱싱**: 빌드 프로세스 동안 Noxion은 모든 공개 페이지를 가져와 로컬 검색 인덱스를 생성합니다.
2. **클라이언트 측 검색**: `DocsSearch` 컴포넌트는 이 인덱스를 사용하여 외부 API 호출 없이 즉각적인 결과를 제공합니다.
3. **콘텐츠 가중치**: 제목과 헤더는 본문 텍스트보다 더 높은 가중치가 부여됩니다.

### 검색 동작 사용자 정의

Notion에 `No Index` 체크박스 속성을 추가하여 검색에서 특정 페이지를 제외할 수 있습니다. 체크된 경우 해당 페이지는 검색 인덱스에서 누락됩니다.

### 사이드바에 검색 추가하기

사이드바 상단에 검색 바를 포함하려면 테마 설정에서 이를 활성화합니다:

```ts
themeConfig: {
  docs: {
    sidebar: {
      search: true,
      placeholder: "Search docs...",
    },
  },
},
```

---

## 상호 참조

페이지 간의 안정적인 링크는 응집력 있는 문서 경험을 위해 필수적입니다.

### Notion에서 링크하기

Notion 내에서 다른 페이지로 링크하면, Noxion은 대상 페이지의 `Slug` 또는 `Title`을 기반으로 해당 내부 Notion 링크를 상대 URL로 자동 변환합니다.

### 안정성을 위해 슬러그 사용하기

항상 페이지에 `Slug` 속성을 정의하십시오. Notion에서 페이지 제목을 변경하더라도 슬러그가 변경되지 않는 한 URL은 안정적으로 유지됩니다.

| Title | Slug | 결과 URL |
|-------|------|---------------|
| `Getting Started` | `intro` | `/docs/intro` |
| `Advanced Config` | `config-advanced` | `/docs/config-advanced` |

### 브레드크럼 내비게이션

`DocsBreadcrumb` 컴포넌트는 모든 페이지 상단에서 자동 경로 내비게이션을 제공합니다. 이는 `Section` 계층 구조를 사용하여 경로를 구축합니다.

```tsx
import { DocsBreadcrumb } from "@noxion/renderer";

// 사용자 정의 템플릿에서의 사용
<DocsBreadcrumb />
```

---

## 고급 설정

복잡한 문서 요구 사항의 경우 `noxion.config.ts`에서 스키마 매핑을 사용자 정의할 수 있습니다. 이를 통해 기존 워크플로우와 일치하는 사용자 정의 Notion 속성 이름을 사용할 수 있습니다.

```ts
collections: [
  {
    name: "Documentation",
    databaseId: process.env.DOCS_NOTION_ID!,
    pageType: "docs",
    pathPrefix: "docs",
    schema: {
      section: "Department",    // 그룹화를 위한 사용자 정의 Notion 속성 이름
      order: "Sort Order",      // 정렬을 위한 사용자 정의 속성
      version: "Release",       // 버전 관리를 위한 사용자 정의 속성
      lastUpdated: "Updated",   // 페이지에 "마지막 업데이트" 날짜 표시
    },
  },
],
```

:::warning
설정의 속성 이름이 Notion 데이터베이스의 속성 이름과 정확히 일치하는지 확인하십시오 (대소문자 구분).
:::

---

## Docs 전용 SEO

Noxion은 표준 메타 태그를 넘어 문서가 검색 엔진에서 잘 노출되고 올바르게 표시되도록 보장합니다.

### TechArticle JSON-LD

블로그는 `BlogPosting`을 사용하는 반면, 문서 페이지는 `TechArticle` 스키마를 사용합니다. 이는 검색 엔진에 콘텐츠가 기술적인 성격임을 알려주며, 개발자 중심의 쿼리에 대한 가시성을 향상시킬 수 있습니다.

포함된 주요 필드:
- `dependencies`: "Dependencies" 속성이 있는 경우 추출됩니다.
- `proficiencyLevel`: "Difficulty" 속성을 통해 설정됩니다.
- `articleSection`: `Section` 속성에서 매핑됩니다.

### 자동 브레드크럼 생성

Noxion은 모든 페이지에 대해 `BreadcrumbList` JSON-LD를 생성하며, 검색 엔진은 이를 사용하여 검색 결과에 리치 스니펫을 표시합니다. 이는 검색 결과에서 직접 계층 구조(예: `Docs > API > Authentication`)를 보여줍니다.

---

## 실제 사례

전형적인 전체 문서 데이터베이스는 다음과 같습니다:

| Title | Public | Section | Order | Version | Slug |
|-------|--------|---------|-------|---------|------|
| Welcome | ✓ | Introduction | 1 | v1.0 | welcome |
| Quick Start | ✓ | Introduction | 2 | v1.0 | quick-start |
| Architecture | ✓ | Core Concepts | 1 | v1.0 | architecture |
| State Management | ✓ | Core Concepts | 2 | v1.0 | state |
| CLI Reference | ✓ | API | 1 | v1.0 | cli |
| Node.js SDK | ✓ | API | 2 | v1.0 | sdk-node |
| Python SDK | ✓ | API | 3 | v1.0 | sdk-python |
| Deployment | ✓ | Operations | 1 | v1.0 | deploy |
| Monitoring | ✓ | Operations | 2 | v1.0 | monitor |
| Migration Guide | ✓ | Resources | 1 | v1.0 | migrate |

이 구조는 5개의 뚜렷한 섹션과 논리적인 페이지 흐름을 가진 깔끔하고 정리된 사이드바를 생성합니다.
