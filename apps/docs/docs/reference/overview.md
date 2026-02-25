---
sidebar_position: 1
title: API Overview
description: Noxion package API reference — all exports, types, and functions.
---

# API Reference

Noxion is distributed as five npm packages plus a CLI scaffolding tool. This section covers the public API surface and links to detailed package references.

---

## Packages

| Package | npm | Purpose |
|---------|-----|---------|
| [`@noxion/core`](./core/config) | [![npm](https://img.shields.io/npm/v/@noxion/core)](https://www.npmjs.com/package/@noxion/core) | Config, data fetching, plugin system, TypeScript types |
| [`@noxion/notion-renderer`](./notion-renderer/overview) | [![npm](https://img.shields.io/npm/v/@noxion/notion-renderer)](https://www.npmjs.com/package/@noxion/notion-renderer) | Notion block renderer: 30+ block types, KaTeX SSR, Shiki syntax highlighting |
| [`@noxion/renderer`](./renderer/notion-page) | [![npm](https://img.shields.io/npm/v/@noxion/renderer)](https://www.npmjs.com/package/@noxion/renderer) | React components for rendering Notion content and blog UI |
| [`@noxion/adapter-nextjs`](./adapter-nextjs/metadata) | [![npm](https://img.shields.io/npm/v/@noxion/adapter-nextjs)](https://www.npmjs.com/package/@noxion/adapter-nextjs) | Next.js App Router integration: metadata, JSON-LD, sitemap, robots |
| [`create-noxion`](./cli/create-noxion) | [![npm](https://img.shields.io/npm/v/create-noxion)](https://www.npmjs.com/package/create-noxion) | CLI scaffolding tool (`bun create noxion`) |

---

## @noxion/core

The foundation package. Everything else depends on it.

### Installation

```bash
npm install @noxion/core
# or
bun add @noxion/core
```

### Exports

#### Config

| Export | Description |
|--------|-------------|
| [`defineConfig(input)`](./core/config#defineconfig) | Create a validated `NoxionConfig` with defaults applied |
| [`loadConfig()`](./core/config#loadconfig) | Load config from `noxion.config.ts` at runtime |

#### Data fetching

| Export | Description |
|--------|-------------|
| [`createNotionClient(options)`](./core/fetcher#createnotionclient) | Create an authenticated Notion API client |
| [`fetchBlogPosts(client, pageId)`](./core/fetcher#fetchblogposts) | Fetch all published posts from a database |
| [`fetchCollection(client, collection)`](./core/fetcher#fetchcollection) | Fetch published pages for a configured collection |
| [`fetchAllCollections(client, config)`](./core/fetcher#fetchallcollections) | Fetch and flatten pages across all configured collections |
| [`fetchPostBySlug(client, pageId, slug)`](./core/fetcher#fetchpostbyslug) | Fetch a single post by slug |
| [`fetchPage(client, pageId)`](./core/fetcher#fetchpage) | Fetch a full Notion page's `ExtendedRecordMap` |
| [`fetchAllSlugs(client, pageId)`](./core/fetcher#fetchallslugs) | Fetch all published post slugs |

#### Slug utilities

| Export | Description |
|--------|-------------|
| [`generateSlug(title)`](./core/slug#generateslug) | Generate a URL-safe slug from a title |
| [`parseNotionPageId(input)`](./core/slug#parsenotionpageid) | Normalize a Notion page ID into UUID format |
| [`buildPageUrl(slug)`](./core/slug#buildpageurl) | Ensure a leading `/` for a page URL |
| [`resolveSlug(post)`](./core/slug#resolveslug) | Resolve a post slug with title fallback |

#### Frontmatter

| Export | Description |
|--------|-------------|
| [`parseFrontmatter(recordMap, pageId)`](./core/frontmatter#parsefrontmatter) | Extract frontmatter from the first code block |
| [`parseKeyValuePairs(text)`](./core/frontmatter#parsekeyvaluepairs) | Parse `key: value` pairs from a string |
| [`applyFrontmatter(post, frontmatter)`](./core/frontmatter#applyfrontmatter) | Apply frontmatter overrides to a `BlogPost` |

#### Plugin system

| Export | Description |
|--------|-------------|
| [`definePlugin(factory)`](./core/plugins#defineplugin) | Create a type-safe plugin factory |
| [`createAnalyticsPlugin(options)`](./core/plugins#createanalyticsplugin) | Built-in analytics plugin factory |
| [`createRSSPlugin(options)`](./core/plugins#createrssplugin) | Built-in RSS plugin factory |
| `generateRSSXml(posts, config, options?)` | Generate RSS 2.0 XML from blog pages |
| [`createCommentsPlugin(options)`](./core/plugins#createcommentsplugin) | Built-in comments plugin factory |

#### Advanced plugin runtime

| Export | Description |
|--------|-------------|
| `loadPlugins(entries)` | Instantiate and validate plugin entries |
| `executeHook(plugins, hookName, args)` | Execute async plugin lifecycle hooks |
| `executeTransformHook(plugins, hookName, initialValue, extraArgs)` | Execute transform hooks with chaining |
| `executeRegisterPageTypes(plugins, registry)` | Register custom page types from plugins |
| `executeRouteResolve(plugins, route)` | Resolve route through plugin pipeline |
| `executeExtendSlots(plugins, initialSlots)` | Legacy slot extension pipeline |

#### Types (re-exports)

| Export | Description |
|--------|-------------|
| [`BlogPost`](./core/types#blogpost) | Normalized post data type |
| [`NoxionConfig`](./core/types#noxionconfig) | Full config type |
| [`NoxionConfigInput`](./core/types#noxionconfiginput) | Input type for `defineConfig()` |
| [`ThemeMode`](./core/types#thememode) | `"system" \| "light" \| "dark"` |
| [`NoxionPlugin`](./core/plugins#noxionplugin-interface) | Plugin interface |
| [`ExtendedRecordMap`](./core/types#extendedrecordmap) | Re-export from `notion-types` |

---

## @noxion/notion-renderer

The low-level Notion block renderer. Powers `@noxion/renderer`'s `<NotionPage />`. Use this directly when you need full control over rendering, custom block overrides, or want to embed Notion content outside the standard blog layout.

### Installation

```bash
npm install @noxion/notion-renderer
# peer deps
npm install react notion-types notion-utils
# or
bun add @noxion/notion-renderer react notion-types notion-utils
```

**Peer dependencies**: `react >= 18.0.0`, `notion-types >= 7.0.0`, `notion-utils >= 7.0.0`

### Setup

```css
/* Import styles in your global CSS */
@import '@noxion/notion-renderer/styles';
@import '@noxion/notion-renderer/katex-css'; /* for math equations */
```

### Main component

| Export | Description |
|--------|-------------|
| [`<NotionRenderer />`](./notion-renderer/renderer-api) | Top-level renderer — renders a full Notion page from an `ExtendedRecordMap` |

### Context & hooks

| Export | Description |
|--------|-------------|
| [`NotionRendererProvider`](./notion-renderer/hooks#notionrendererprovider) | React context provider for renderer state |
| [`useNotionRenderer()`](./notion-renderer/hooks#usenotionrenderer) | Access the renderer context (record map, URL mappers, theme, components) |
| [`useNotionBlock(blockId)`](./notion-renderer/hooks#usenotionblock) | Resolve and unwrap a block by ID from the record map |

### Block components

30+ individually exported block components. See [Block Components](./notion-renderer/blocks) for the full reference.

| Export | Notion block type |
|--------|-------------------|
| `TextBlock` | `text` |
| `HeadingBlock` | `header`, `sub_header`, `sub_sub_header` |
| `BulletedListBlock` | `bulleted_list` |
| `NumberedListBlock` | `numbered_list` |
| `ToDoBlock` | `to_do` |
| `QuoteBlock` | `quote` |
| `CalloutBlock` | `callout` |
| `DividerBlock` | `divider` |
| `ToggleBlock` | `toggle` |
| `PageBlock` | `page` |
| `EquationBlock` | `equation` |
| `CodeBlock` | `code` |
| `ImageBlock` | `image` |
| `VideoBlock` | `video` |
| `AudioBlock` | `audio` |
| `EmbedBlock` | `embed`, `gist`, `figma`, `tweet`, `maps`, and more |
| `BookmarkBlock` | `bookmark` |
| `FileBlock` | `file` |
| `PdfBlock` | `pdf` |
| `TableBlock` | `table` |
| `ColumnListBlock` | `column_list` |
| `ColumnBlock` | `column` |
| `TableOfContentsBlock` | `table_of_contents` |

### Inline components

| Export | Description |
|--------|-------------|
| [`<Text />`](./notion-renderer/components#text) | Rich-text renderer — all inline decorations (bold, italic, links, colors, inline equations) |
| [`<InlineEquation />`](./notion-renderer/components#inlineequation) | Inline KaTeX math expression |

### Shiki

| Export | Description |
|--------|-------------|
| [`createShikiHighlighter(options?)`](./notion-renderer/shiki#createshikihighlighter) | Create a `HighlightCodeFn` with dual-theme Shiki |
| [`normalizeLanguage(lang)`](./notion-renderer/shiki#normalizelanguage) | Map Notion language names to Shiki language IDs |

### Utilities

| Export | Description |
|--------|-------------|
| [`formatNotionDate(dateValue)`](./notion-renderer/utils#formatnotiondate) | Format a Notion date object to a readable string |
| [`unwrapBlockValue(record)`](./notion-renderer/utils#unwrapblockvalue) | Unwrap `{ role, value }` record map wrapper |
| [`getBlockTitle(block)`](./notion-renderer/utils#getblocktitle) | Extract plain-text title from a block |
| [`cs(...classes)`](./notion-renderer/utils#cs) | Conditional className joiner |

---

## @noxion/renderer

React UI components and theme system for rendering Notion content and blog UI.

### Installation

```bash
npm install @noxion/renderer react react-dom
# or
bun add @noxion/renderer react react-dom
```

**Peer dependencies**: `react >= 18.0.0`, `react-dom >= 18.0.0`

### Components

| Export | Description |
|--------|-------------|
| [`<NotionPage />`](./renderer/notion-page) | Render a full Notion page — wraps `<NotionRenderer />` with Shiki, dark mode, image URL mapping |
| `<NoxionLogo />` | Noxion logo component |
### Hooks

| Export | Description |
|--------|-------------|
| [`useThemePreference()`](./renderer/theme-provider#usethemepreference) | Returns and controls the user's theme preference (light/dark/system) |
| `useSearch()` | Search hook |

### Types

| Export | Description |
|--------|-------------|
| `NoxionTheme`, `NoxionThemeTokens` | Theme token/type definitions |
| `NoxionSlotMap`, `NoxionTemplateMap`, `NoxionTemplateProps`, `NoxionLayoutProps` | Layout/template composition types |
| `NoxionThemeMetadata` | Theme package metadata shape |
| `PostCardProps`, `PostListProps`, `HeaderProps`, `FooterProps`, etc. | Component prop types (still exported for theme authors) |

---

## @noxion/adapter-nextjs

Next.js App Router integration utilities for SEO, metadata, structured data, and static generation.

### Installation

```bash
npm install @noxion/adapter-nextjs @noxion/core
# or
bun add @noxion/adapter-nextjs @noxion/core
```

**Peer dependencies**: `next >= 15.0.0`

### Metadata

| Export | Description |
|--------|-------------|
| [`generateNoxionMetadata(post, config)`](./adapter-nextjs/metadata#generatenoxionmetadata) | Generate Next.js `Metadata` for a post page |
| [`generateNoxionListMetadata(config)`](./adapter-nextjs/metadata#generatenoxionlistmetadata) | Generate Next.js `Metadata` for the homepage |

### Structured Data (JSON-LD)

| Export | Description |
|--------|-------------|
| [`generateBlogPostingLD(post, config)`](./adapter-nextjs/structured-data#generateblogpostingld) | `BlogPosting` JSON-LD schema |
| [`generateBreadcrumbLD(post, config)`](./adapter-nextjs/structured-data#generatebreadcrumbld) | `BreadcrumbList` JSON-LD schema |
| [`generateWebSiteLD(config)`](./adapter-nextjs/structured-data#generatewebsiteld) | `WebSite` + `SearchAction` JSON-LD schema |
| [`generateCollectionPageLD(posts, config)`](./adapter-nextjs/structured-data#generatecollectionpageld) | `CollectionPage` + `ItemList` JSON-LD schema |

### Sitemap & Robots

| Export | Description |
|--------|-------------|
| [`generateNoxionSitemap(posts, config)`](./adapter-nextjs/sitemap#generatenoxionsitemap) | Generate `MetadataRoute.Sitemap` entries |
| [`generateNoxionRobots(config)`](./adapter-nextjs/sitemap#generatenoxionrobots) | Generate `MetadataRoute.Robots` |
| [`generateNoxionStaticParams(client, pageId)`](./adapter-nextjs/sitemap#generatenoxionstaticparams) | Generate `{ slug: string }[]` for `generateStaticParams()` |

### Routing

| Export | Description |
|--------|-------------|
| [`generateNoxionRoutes(config)`](./adapter-nextjs/sitemap#generatenoxionroutes) | Generate route configs from collections |
| [`resolvePageType(path, routes)`](./adapter-nextjs/sitemap#resolvepagetype) | Resolve route config from URL path |
| [`buildPageUrl(page, routes)`](./adapter-nextjs/sitemap#buildpageurl) | Build URL path using route prefix |
| [`generateStaticParamsForRoute(pages, route)`](./adapter-nextjs/sitemap#generatestaticparamsforroute) | Generate params for one route type |

### Revalidation & Webhooks

| Export | Description |
|--------|-------------|
| [`createRevalidateHandler(options)`](./adapter-nextjs/revalidation#createrevalidatehandler) | On-demand ISR revalidation route handler |
| [`createNotionWebhookHandler(options)`](./adapter-nextjs/revalidation#createnotionwebhookhandler) | Notion webhook route handler with signature verification |

---

## Dependency graph

```
@noxion/adapter-nextjs
    └── @noxion/core
            └── notion-client (unofficial Notion API)
            └── notion-utils  (utilities)
            └── notion-types  (TypeScript types)

@noxion/renderer
    └── @noxion/notion-renderer (Notion block rendering)
            └── katex     (equation SSR)
            └── shiki     (syntax highlighting)
    └── notion-types
    └── notion-utils
```

These are the only significant runtime dependencies. Noxion intentionally keeps the dependency tree small. The `@noxion/notion-renderer` package replaced the previous `react-notion-x` dependency, giving full control over rendering and styling.

---

## Versioning

All Noxion packages follow [Semantic Versioning](https://semver.org/). They are versioned together (same major/minor version across all packages) to ensure compatibility. When upgrading, update all `@noxion/*` packages to the same version simultaneously.
