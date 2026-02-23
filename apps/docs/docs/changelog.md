---
sidebar_position: 999
title: Changelog
description: Version history and release notes for Noxion.
---

# Changelog

All notable changes to the Noxion project are documented here.

---

## v0.2.0

**Released: 2026-02-23**

Noxion evolves from a blog builder into a **full-featured website builder**. This release adds support for multiple page types (Blog, Docs, Portfolio), multi-database collections, an enhanced plugin ecosystem, and theme inheritance.

### New: Multiple page types

- **`NoxionPage`** — new generic page type replaces `BlogPost` as the core data model. `BlogPost` is kept as a type alias for backward compatibility.
- **`BlogPage`** — blog posts with `date`, `tags`, `category`, `author` metadata
- **`DocsPage`** — documentation pages with `section`, `order`, `version` metadata
- **`PortfolioPage`** — portfolio projects with `technologies`, `projectUrl`, `year`, `featured` metadata
- **Type guards**: `isBlogPage()`, `isDocsPage()`, `isPortfolioPage()`
- **`PageTypeRegistry`** — manages page type definitions. Plugins can register custom types via the `registerPageTypes` hook.

### New: Multi-database collections

- **`collections`** config option — map multiple Notion databases to different page types, each with its own URL prefix and schema mapping
- **`fetchCollection()`** — fetches pages from a single collection with page-type-aware schema mapping
- **`fetchAllCollections()`** — fetches all collections in parallel
- **Schema mapper** — convention-based Notion property mapping per page type, with manual override support
- **`defaultPageType`** config option — sets the default page type (defaults to `"blog"`)

### New: Enhanced plugin system

- **`registerPageTypes`** hook — register custom page types
- **`onRouteResolve`** hook — customize URL generation per page type
- **`extendSlots`** hook — inject content into named template slots
- **`configSchema`** — plugins can declare configuration schemas for validation
- **`PluginFactory<T>`** type — standardized factory function type for configurable plugins

### New: `@noxion/plugin-utils` package

- **Mock data generators**: `createMockPage`, `createMockBlogPage`, `createMockDocsPage`, `createMockPortfolioPage`, `createMockPages`
- **Test helpers**: `createTestConfig`, `createTestPlugin`
- **Manifest validation**: `NoxionPluginManifest`, `validatePluginManifest`

### New: `noxion-plugin-reading-time` example

- Community plugin example demonstrating `transformPosts`, `extendSlots`, and `configSchema`
- Full test suite using `@noxion/plugin-utils`

### New: Template system

- **Namespaced template resolution** — `docs/page`, `portfolio/grid`, etc.
- **Fallback chain**: exact match → legacy↔namespaced mapping → basename → fallback → home
- **Docs templates**: `DocsSidebar`, `DocsBreadcrumb`, `DocsPage` with sidebar navigation
- **Portfolio templates**: `PortfolioProjectCard`, `PortfolioFilter`, `PortfolioGrid`, `PortfolioProject`

### New: Theme inheritance

- **`extendTheme()`** — deep-merge theme overrides onto a base theme
- **`NoxionThemeMetadata`** — theme metadata (name, author, version, description, preview URL)
- **`supports` field** — themes declare which page types they support
- **`DeepPartialTokens`** type — allows partial color/font overrides

### New: Multi-page-type routing

- **`generateNoxionRoutes()`** — generate route configs from collections
- **`resolvePageType()`** — determine page type from URL path
- **`buildPageUrl()`** — build URL for a page using its collection's path prefix
- **`generateStaticParamsForRoute()`** — static params for a specific page type route

### New: Page-type-aware SEO

- **`generateTechArticleLD()`** — `TechArticle` JSON-LD for docs pages
- **`generateCreativeWorkLD()`** — `CreativeWork` JSON-LD for portfolio pages
- **`generatePageLD()`** — auto-selects JSON-LD type based on `pageType`
- Page-type-aware sitemap priorities (blog: 0.8, docs: 0.7, portfolio: 0.6)
- Metadata generation now works with all `NoxionPage` subtypes

### New: `create-noxion` templates

- **`--template` flag** — choose blog, docs, portfolio, or full (multi-type)
- **`--plugin` flag** — scaffold a plugin starter project
- **`--theme` flag** — scaffold a theme starter project
- Interactive prompts for template-specific database IDs

### Breaking changes

- **`BlogPost` fields moved to `metadata`** — `post.date` → `post.metadata.date`, `post.tags` → `post.metadata.tags`, `post.category` → `post.metadata.category`, `post.author` → `post.metadata.author`. The old `BlogPost` type is kept as an alias for `BlogPage` for one version cycle.
- **`loadConfig()` accepts new options** — `collections`, `defaultPageType` fields added
- **Metadata/SEO functions accept `NoxionPage`** — `generateNoxionMetadata()`, `generateBlogPostingLD()`, `generateNoxionSitemap()` now accept `NoxionPage` instead of `BlogPost`

See the [Migration Guide](./learn/migration-v02) for step-by-step upgrade instructions.

### Improved

- **392 tests** passing across all packages (core: 168, renderer: 83, adapter-nextjs: 51, plugin-utils: 36, create-noxion: 29, plugin-reading-time: 25)
- **Comprehensive documentation** updated for all v0.2 features

---

## v0.1.1

**Released: 2026-02-22**

Patch release focused on `@noxion/notion-renderer` rendering quality and a new sticky TOC feature.

### Fixed

- **3+ column layout overflow** — added `min-width: 0` and `overflow: hidden` to `.noxion-column`, preventing flex items from exceeding container width when using 3 or more columns.
- **Image sizing in columns** — changed inline `width` to `maxWidth` on image figures so they shrink to fit narrow column containers while respecting the original Notion-specified width as a cap.
- **Caption word-break** — replaced `word-break: break-word` with `overflow-wrap: break-word` on image captions for proper word-boundary line wrapping.
- **Frontmatter code block visible** — the first code block used for frontmatter key:value pairs is now automatically hidden from rendered output.

### New

- **Sticky TOC sidebar** (`floatFirstTOC: right`) — when this frontmatter property is set, the inline `table_of_contents` block is hidden and replaced with a sticky sidebar TOC positioned to the right of the content area. Features active heading tracking on scroll with a 40% viewport threshold. Automatically hidden below 1280px screen width.

### Improved

- **Base typography** — default `line-height` changed from 1.5 to 1.6, added `letter-spacing: -0.01em` for tighter body text.

---

## v0.1.0

**Released: 2026-02-22**

The first milestone release. Noxion now ships its own Notion block renderer (`@noxion/notion-renderer`), replacing the third-party `react-notion-x` dependency entirely. This gives full control over rendering, styling, and performance.

### New: `@noxion/notion-renderer`

A from-scratch Notion block renderer built specifically for Noxion.

- **30+ block types** — paragraph, headings (H1–H3), bulleted/numbered/to-do lists, quote, callout, divider, toggle, equation, code, image, video, audio, embed, bookmark, file, PDF, table, column layout, synced block, alias, table of contents, and collection view placeholder
- **Full rich text rendering** — bold, italic, strikethrough, underline, code, color, links, inline equations, inline mentions (user, page, date, database), and nested decorations
- **KaTeX math (SSR)** — equations rendered server-side via `katex.renderToString()`. Zero client-side math JS.
- **Shiki syntax highlighting** — VS Code-quality code blocks with dual-theme support (light + dark). 38 common languages preloaded. Runs asynchronously via `createShikiHighlighter()` factory — no Prism.js, no client-side highlighting.
- **Pure CSS with BEM** — ~1,250 lines of self-authored CSS using `noxion-{block}__{element}--{modifier}` naming. Themed via `--noxion-*` CSS custom properties. No Tailwind, no CSS-in-JS.
- **Dark mode** — dual selector support: `.noxion-renderer--dark` class and `[data-theme="dark"]` attribute. Works with the existing theme system out of the box.
- **94 unit tests** passing (`bun test`)

### Breaking changes

- **`react-notion-x` removed** — the `@noxion/renderer` package no longer depends on `react-notion-x`, `prismjs`, or client-side `katex`. If you imported anything from `react-notion-x` directly, migrate to `@noxion/notion-renderer` exports.
- **CSS imports changed** — `globals.css` in the web app now imports `@noxion/notion-renderer` styles instead of `react-notion-x` styles. If you have a custom app, update your CSS imports:
  ```css
  @import '@noxion/notion-renderer/styles';
  ```
- **`next.config.ts` update** — `transpilePackages` now includes `@noxion/notion-renderer` instead of `react-notion-x`.

### Improved

- **Theme system** — CSS variable-based theming now covers all Notion block types. Variables like `--noxion-foreground`, `--noxion-muted`, `--noxion-border`, `--noxion-font-mono` are used consistently throughout.
- **Callout layout** — fixed overflow bug where long content inside callouts could break the layout (flex overflow fix).
- **Image URL handling** — `mapImageUrl` properly routes Notion attachment URLs through the `notion.so/image/` proxy for stable, non-expiring URLs.
- **Code blocks** — Shiki dual-theme output uses inline `style` with `--shiki-dark` CSS variables, enabling seamless light/dark transitions without re-highlighting.

### Internal

- **Monorepo structure** — new `packages/notion-renderer/` package with clean exports: `NotionRenderer`, `NotionRendererProvider`, `useNotionRenderer`, `useNotionBlock`, `Text`, `createShikiHighlighter`, all block components, and full TypeScript types.
- **`create-noxion` template** updated to use `@noxion/notion-renderer`.
- **All packages** bumped to `0.1.0`.
- **252 total tests** passing across the monorepo (94 notion-renderer + 58 renderer + 116 core).
