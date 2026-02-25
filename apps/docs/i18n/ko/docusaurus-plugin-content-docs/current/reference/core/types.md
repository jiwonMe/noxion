---
title: 타입
description: "@noxion/core TypeScript 타입 정의"
---

# 타입

`@noxion/core`에서 내보내는 모든 타입:

```ts
import type {
  NoxionPage,
  BlogPage,
  DocsPage,
  PortfolioPage,
  BlogPost,        // BlogPage의 하위 호환 별칭
  NoxionCollection,
  NoxionConfig,
  NoxionConfigInput,
  ThemeMode,
  NoxionLayout,
  NoxionPlugin,
  PluginFactory,
  PluginConfig,
  PageTypeDefinition,
  SchemaConventions,
  HeadTag,
  SitemapEntry,
  NoxionPageData,
  ExtendedRecordMap,
} from "@noxion/core";
```

---

## `NoxionPage`

모든 페이지 타입의 기본 타입. `pageType` 기반의 구별된 유니온(discriminated union).

```ts
interface NoxionPage {
  id: string;
  title: string;
  slug: string;
  pageType: string;
  coverImage?: string;
  description?: string;
  published: boolean;
  lastEditedTime: string;
  frontmatter?: Record<string, string>;
  metadata: Record<string, unknown>;
  parent?: string;
  children?: string[];
  order?: number;
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | Notion 페이지 ID (하이픈 없는 UUID) |
| `title` | `string` | Notion Title 속성에서 가져온 페이지 제목 |
| `slug` | `string` | URL 슬러그 (예: `"my-first-post"`) |
| `pageType` | `string` | 구별자: `"blog"`, `"docs"`, `"portfolio"`, 또는 커스텀 |
| `coverImage` | `string?` | 커버 이미지 URL (notion.so/image/... 프록시 URL) |
| `description` | `string?` | SEO 메타 태그용 페이지 설명 |
| `published` | `boolean` | 페이지가 게시되었는지 (Public 체크박스) |
| `lastEditedTime` | `string` | 마지막 수정의 ISO datetime |
| `frontmatter` | `Record<string, string>?` | 첫 번째 코드 블록에서 추출한 프론트매터 키-값 쌍 |
| `metadata` | `Record<string, unknown>` | 타입별 메타데이터 (date, tags, section 등) |

---

## `BlogPage`

날짜, 태그, 카테고리, 작성자 메타데이터가 있는 블로그 포스트.

```ts
interface BlogPage extends NoxionPage {
  pageType: "blog";
  metadata: {
    date: string;
    tags: string[];
    category?: string;
    author?: string;
  };
}
```

메타데이터 접근:

```ts
const page: BlogPage = /* ... */;
page.metadata.date;     // "2025-02-01"
page.metadata.tags;     // ["react", "typescript"]
page.metadata.category; // "Web Dev"
page.metadata.author;   // "Jane Doe"
```

---

## `DocsPage`

섹션, 순서, 버전 메타데이터가 있는 문서 페이지.

```ts
interface DocsPage extends NoxionPage {
  pageType: "docs";
  metadata: {
    section?: string;
    version?: string;
    editUrl?: string;
  };
}
```

메타데이터 접근:

```ts
const page: DocsPage = /* ... */;
page.metadata.section;  // "Getting Started"
page.metadata.version;  // "latest"
page.metadata.editUrl;  // "https://github.com/..."
```

---

## `PortfolioPage`

기술, URL, 연도, 주요 프로젝트 플래그가 있는 포트폴리오 프로젝트.

```ts
interface PortfolioPage extends NoxionPage {
  pageType: "portfolio";
  metadata: {
    technologies?: string[];
    projectUrl?: string;
    year?: string;
    featured?: boolean;
  };
}
```

메타데이터 접근:

```ts
const page: PortfolioPage = /* ... */;
page.metadata.technologies; // ["React", "TypeScript"]
page.metadata.projectUrl;   // "https://example.com"
page.metadata.year;         // "2025"
page.metadata.featured;     // true
```

---

## `BlogPost`

`BlogPage`의 하위 호환 별칭. 한 버전 주기 동안 유지됩니다.

```ts
type BlogPost = BlogPage;
```

:::caution 마이그레이션
v0.1에서 업그레이드하는 경우 `post.date`를 `post.metadata.date`로, `post.tags`를 `post.metadata.tags`로 변경하세요. 자세한 내용은 [마이그레이션 가이드](../../learn/migration-v02)를 참조하세요.
:::

---

## `NoxionCollection`

컬렉션은 Notion 데이터베이스를 페이지 타입에 매핑합니다.

```ts
interface NoxionCollection {
  name?: string;
  databaseId: string;
  pageType: string;
  pathPrefix?: string;
  schema?: Record<string, string>;
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `name` | `string` | — | 표시 이름 |
| `databaseId` | `string` | ✅ | Notion 데이터베이스 페이지 ID |
| `pageType` | `string` | ✅ | 페이지 타입 식별자 |
| `pathPrefix` | `string` | — | URL 접두사 (예: `"docs"` → `/docs/[slug]`) |
| `schema` | `Record<string, string>` | — | 수동 속성 이름 매핑 오버라이드 |

---

## `PageTypeDefinition`

`registerPageTypes` 플러그인 훅을 통해 등록되는 커스텀 페이지 타입 정의.

```ts
interface PageTypeDefinition {
  name: string;
  schemaConventions?: SchemaConventions;
  defaultTemplate?: string;
  defaultLayout?: string;
  routes?: (page: NoxionPage) => string;
  sortBy?: { field: string; order: "asc" | "desc" };
  sitemapConfig?: { priority: number; changefreq: "daily" | "weekly" | "monthly" };
  structuredDataType?: string;
  metadataConfig?: { openGraphType: "article" | "website" };
}
```

---

## `SchemaConventions`

페이지 타입의 메타데이터 필드 이름을 기본 Notion 속성 이름에 매핑합니다.

```ts
interface SchemaConventions {
  [fieldName: string]: {
    names: string[];
    type?: string;
  };
}
```

내장 규칙:

| 페이지 타입 | 필드 → Notion 속성 |
|-----------|-------------------|
| Blog | `date` → `"Published"`, `tags` → `"Tags"`, `category` → `"Category"`, `author` → `"Author"` |
| Docs | `section` → `"Section"`, `order` → `"Order"`, `version` → `"Version"` |
| Portfolio | `technologies` → `"Technologies"`, `projectUrl` → `"Project URL"`, `year` → `"Year"`, `featured` → `"Featured"` |

---

## `NoxionConfig`

완전히 해석된 설정 객체. 모든 선택 필드에 기본값이 적용됩니다.

```ts
interface NoxionConfig {
  rootNotionPageId?: string;
  rootNotionSpaceId?: string;
  name: string;
  domain: string;
  author: string;
  description: string;
  language: string;
  defaultTheme: ThemeMode;
  defaultPageType: string;
  revalidate: number;
  revalidateSecret?: string;
  plugins?: PluginConfig[];
  collections?: NoxionCollection[];
  theme?: NoxionThemeConfig;
  layout?: NoxionLayout;
  components?: ComponentOverrides;
}
```

---

## `NoxionConfigInput`

`defineConfig()`가 받는 입력 타입. 모든 선택 필드를 생략할 수 있습니다.

```ts
interface NoxionConfigInput {
  rootNotionPageId?: string;
  rootNotionSpaceId?: string;
  name: string;
  domain: string;
  author: string;
  description: string;
  language?: string;
  defaultTheme?: ThemeMode;
  defaultPageType?: string;
  revalidate?: number;
  revalidateSecret?: string;
  plugins?: PluginConfig[];
  collections?: NoxionCollection[];
  theme?: NoxionThemeConfig;
  layout?: NoxionLayout;
  components?: ComponentOverrides;
}
```

---

## `ThemeMode`

```ts
type ThemeMode = "system" | "light" | "dark";
```

---

## `NoxionLayout`

```ts
type NoxionLayout = "single-column" | "sidebar-left" | "sidebar-right";
```

---

## `NoxionPageData`

`NoxionPage`와 `ExtendedRecordMap`을 렌더링을 위해 결합합니다.

```ts
interface NoxionPageData {
  recordMap: ExtendedRecordMap;
  post: NoxionPage;
}
```

---

## `PluginFactory`

설정 옵션을 받는 플러그인 팩토리 함수 타입.

```ts
type PluginFactory<Options = unknown, Content = unknown> = (
  options: Options
) => NoxionPlugin<Content>;
```

---

## `ExtendedRecordMap`

[`notion-types`](https://www.npmjs.com/package/notion-types)에서 재익스포트됩니다. 전체 Notion 페이지 데이터를 포함합니다. `<NotionPage recordMap={...} />`에 직접 전달됩니다.

```ts
import type { ExtendedRecordMap } from "@noxion/core";
```

---

## `PluginConfig`

```ts
type PluginConfig =
  | PluginModule
  | [PluginModule, unknown]
  | false;
```

여기서 `PluginModule = NoxionPlugin | PluginFactory` 입니다.

`false` 변형은 조건부로 플러그인을 비활성화할 수 있게 합니다:

```ts
plugins: [
  createRSSPlugin({ feedPath: "/feed.xml" }),
  process.env.NODE_ENV === "production" && createAnalyticsPlugin({ ... }),
].filter(Boolean),
```

---

## 타입 가드

```ts
import { isBlogPage, isDocsPage, isPortfolioPage } from "@noxion/core";

const page: NoxionPage = /* ... */;

if (isBlogPage(page)) {
  page.metadata.date;  // TypeScript가 BlogPage임을 알고 있음
}

if (isDocsPage(page)) {
  page.metadata.section;  // TypeScript가 DocsPage임을 알고 있음
}

if (isPortfolioPage(page)) {
  page.metadata.technologies;  // TypeScript가 PortfolioPage임을 알고 있음
}
```
