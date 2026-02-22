---
sidebar_position: 1
title: API Overview
description: Noxion package API reference — all exports, types, and functions.
---

# API Reference

Noxion is distributed as three npm packages plus a CLI scaffolding tool. This section provides exhaustive documentation for every exported function, component, hook, and type.

---

## Packages

| Package | npm | Purpose |
|---------|-----|---------|
| [`@noxion/core`](./core/config) | [![npm](https://img.shields.io/npm/v/@noxion/core)](https://www.npmjs.com/package/@noxion/core) | Config, data fetching, plugin system, TypeScript types |
| `@noxion/notion-renderer` | — | Notion block renderer: 30+ block types, KaTeX SSR, Shiki syntax highlighting |
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
| [`fetchPostBySlug(client, pageId, slug)`](./core/fetcher#fetchpostbyslug) | Fetch a single post by slug |
| [`fetchPage(client, pageId)`](./core/fetcher#fetchpage) | Fetch a full Notion page's `ExtendedRecordMap` |
| [`fetchAllSlugs(client, pageId)`](./core/fetcher#fetchallslugs) | Fetch all published post slugs |

#### Frontmatter

| Export | Description |
|--------|-------------|
| [`parseFrontmatter(recordMap, pageId)`](./core/frontmatter#parsefrontmatter) | Extract frontmatter from the first code block |
| [`parseKeyValuePairs(text)`](./core/frontmatter#parsekeyvaluepairs) | Parse `key: value` pairs from a string |
| [`applyFrontmatter(post, frontmatter)`](./core/frontmatter#applyfrontmatter) | Apply frontmatter overrides to a `BlogPost` |

#### Plugin system

| Export | Description |
|--------|-------------|
| [`definePlugin(plugin)`](./core/plugins#defineplugin) | Create a type-safe plugin object |
| [`createAnalyticsPlugin(options)`](./core/plugins#createanalyticsplugin) | Built-in analytics plugin factory |
| [`createRSSPlugin(options)`](./core/plugins#createrssplugin) | Built-in RSS plugin factory |
| [`createCommentsPlugin(options)`](./core/plugins#createcommentsplugin) | Built-in comments plugin factory |

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
| [`<NotionPage />`](./renderer/notion-page) | Render a full Notion page via `@noxion/notion-renderer` |
| [`<PostList />`](./renderer/post-list) | Responsive grid of `<PostCard>` components |
| [`<PostCard />`](./renderer/post-card) | Single post card with cover, title, date, tags |
| [`<NoxionThemeProvider />`](./renderer/theme-provider) | Theme context provider (required wrapper) |

### Hooks

| Export | Description |
|--------|-------------|
| [`useNoxionTheme()`](./renderer/theme-provider#usenoxiontheme) | Returns the currently active theme (`"light" \| "dark"`) |
| [`useThemePreference()`](./renderer/theme-provider#usethemepreference) | Returns and controls the user's theme preference |

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
