---
title: Types
description: "@noxion/core TypeScript type definitions"
---

# Types

All types exported from `@noxion/core`:

```ts
import type {
  NoxionPage,
  BlogPage,
  DocsPage,
  PortfolioPage,
  BlogPost,        // backward-compat alias for BlogPage
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

The base type for all page types. A discriminated union based on `pageType`.

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

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Notion page ID (UUID without hyphens) |
| `title` | `string` | Page title from the Notion Title property |
| `slug` | `string` | URL slug (e.g. `"my-first-post"`) |
| `pageType` | `string` | Discriminant: `"blog"`, `"docs"`, `"portfolio"`, or custom |
| `coverImage` | `string?` | Cover image URL (notion.so/image/... proxy URL) |
| `description` | `string?` | Page description for SEO meta tags |
| `published` | `boolean` | Whether the page is published (Public checkbox) |
| `lastEditedTime` | `string` | ISO datetime of last edit |
| `frontmatter` | `Record<string, string>?` | Raw frontmatter key-value pairs from the first code block |
| `metadata` | `Record<string, unknown>` | Type-specific metadata (date, tags, section, etc.) |

---

## `BlogPage`

Blog post with date, tags, category, and author metadata.

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

Access metadata:

```ts
const page: BlogPage = /* ... */;
page.metadata.date;     // "2025-02-01"
page.metadata.tags;     // ["react", "typescript"]
page.metadata.category; // "Web Dev"
page.metadata.author;   // "Jane Doe"
```

---

## `DocsPage`

Documentation page with section, order, and version metadata.

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

Access metadata:

```ts
const page: DocsPage = /* ... */;
page.metadata.section;  // "Getting Started"
page.metadata.version;  // "latest"
page.metadata.editUrl;  // "https://github.com/..."
```

---

## `PortfolioPage`

Portfolio project with technologies, URL, year, and featured flag.

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

Access metadata:

```ts
const page: PortfolioPage = /* ... */;
page.metadata.technologies; // ["React", "TypeScript"]
page.metadata.projectUrl;   // "https://example.com"
page.metadata.year;         // "2025"
page.metadata.featured;     // true
```

---

## `BlogPost`

Backward-compatible alias for `BlogPage`. Kept for one version cycle.

```ts
type BlogPost = BlogPage;
```

:::caution Migration
If you're upgrading from v0.1, replace `post.date` with `post.metadata.date`, `post.tags` with `post.metadata.tags`, etc. See the [Migration Guide](../../learn/migration-v02) for details.
:::

---

## `NoxionCollection`

A collection maps a Notion database to a page type.

```ts
interface NoxionCollection {
  name?: string;
  databaseId: string;
  pageType: string;
  pathPrefix?: string;
  schema?: Record<string, string>;
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | — | Display name |
| `databaseId` | `string` | ✅ | Notion database page ID |
| `pageType` | `string` | ✅ | Page type identifier |
| `pathPrefix` | `string` | — | URL prefix (e.g. `"docs"` → `/docs/[slug]`) |
| `schema` | `Record<string, string>` | — | Manual property name mapping overrides |

---

## `PageTypeDefinition`

Defines a custom page type, registered via the `registerPageTypes` plugin hook.

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

Maps metadata field names to their default Notion property names for a page type.

```ts
interface SchemaConventions {
  [fieldName: string]: {
    names: string[];
    type?: string;
  };
}
```

Built-in conventions:

| Page Type | Field → Notion Property |
|-----------|------------------------|
| Blog | `date` → `"Published"`, `tags` → `"Tags"`, `category` → `"Category"`, `author` → `"Author"` |
| Docs | `section` → `"Section"`, `order` → `"Order"`, `version` → `"Version"` |
| Portfolio | `technologies` → `"Technologies"`, `projectUrl` → `"Project URL"`, `year` → `"Year"`, `featured` → `"Featured"` |

---

## `NoxionConfig`

The fully-resolved configuration object. All optional fields have defaults applied.

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

The input type accepted by `defineConfig()`. All optional fields can be omitted.

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

Combines a `NoxionPage` with its `ExtendedRecordMap` for rendering.

```ts
interface NoxionPageData {
  recordMap: ExtendedRecordMap;
  post: NoxionPage;
}
```

---

## `PluginFactory`

Type for plugin factory functions that accept configuration options.

```ts
type PluginFactory<Options = unknown, Content = unknown> = (
  options: Options
) => NoxionPlugin<Content>;
```

---

## `ExtendedRecordMap`

Re-exported from [`notion-types`](https://www.npmjs.com/package/notion-types). Contains the complete Notion page data. Passed directly to `<NotionPage recordMap={...} />`.

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

Where `PluginModule = NoxionPlugin | PluginFactory`.

The `false` variant allows conditionally disabling plugins:

```ts
plugins: [
  createRSSPlugin({ feedPath: "/feed.xml" }),
  process.env.NODE_ENV === "production" && createAnalyticsPlugin({ ... }),
].filter(Boolean),
```

---

## Type guards

```ts
import { isBlogPage, isDocsPage, isPortfolioPage } from "@noxion/core";

const page: NoxionPage = /* ... */;

if (isBlogPage(page)) {
  page.metadata.date;  // TypeScript knows this is BlogPage
}

if (isDocsPage(page)) {
  page.metadata.section;  // TypeScript knows this is DocsPage
}

if (isPortfolioPage(page)) {
  page.metadata.technologies;  // TypeScript knows this is PortfolioPage
}
```
