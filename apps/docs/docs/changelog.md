---
sidebar_position: 999
title: Changelog
description: Version history and release notes for Noxion.
---

# Changelog

All notable changes to the Noxion project are documented here.

---

## v0.4.0

**Released: 2026-02-27**

Major enhancement to `@noxion/notion-renderer`: a render-time plugin system with 5 built-in plugins, collection view renderer, lazy loading, error boundaries, heading anchors, block actions, and comprehensive accessibility improvements.

### New: Render-time plugin system

- **`RendererPlugin` interface** — hook into the rendering lifecycle with `blockOverride`, `transformBlock`, `transformText`, `onBlockRender`, and `onBlockRendered` hooks
- **`RendererPluginFactory<T>`** — type-safe factory pattern for configurable plugins
- **`PluginPriority`** — control plugin execution order (FIRST=0, NORMAL=50, LAST=100)
- **Error isolation** — each plugin hook is wrapped in try/catch; a broken plugin logs a warning but never crashes the page
- **Backward compatible** — the existing `blockOverrides` API continues to work; plugins layer on top

### New: 5 built-in renderer plugins

- **`createMermaidPlugin()`** — renders Mermaid diagrams from code blocks with `language: "mermaid"`. Dynamically imports `mermaid` at runtime via `useEffect`. Requires `mermaid` as optional peer dependency.
- **`createChartPlugin()`** — renders Chart.js charts from code blocks with `language: "chart"` (JSON config body). Dynamically imports `chart.js` at runtime. Requires `chart.js` as optional peer dependency.
- **`createCalloutTransformPlugin()`** — transforms callout blocks into interactive accordions or tab groups based on emoji icon (📋/▶️ → accordion, 🗂️ → tabs). Fully keyboard accessible.
- **`createEmbedEnhancedPlugin()`** — detects embed providers (YouTube, CodePen, Figma, StackBlitz, CodeSandbox) and renders provider-specific enhanced embeds.
- **`createTextTransformPlugin()`** — transforms `[[wikilinks]]` into page links and `#hashtags` into styled spans or links. Supports custom URL mappers.

### New: Collection view renderer

- **`CollectionViewBlock`** — interactive table view for Notion databases, replacing the old placeholder
- **Sorting** — click column headers to sort ascending/descending
- **Filtering** — filter rows by column values
- **Lazy loaded** — the interactive component loads on demand via `createLazyBlock`
- Table view only (Phase 1); other views are not yet supported

### New: Infrastructure components

- **`BlockErrorBoundary`** — React Error Boundary for per-block error isolation with customizable fallback UI
- **`HeadingAnchor`** — clickable `#` anchor next to headings; copies heading link to clipboard on click
- **`BlockActions`** — copy/share action buttons for blocks, enabled via `showBlockActions` prop
- **`LoadingPlaceholder`** — default loading state for lazy-loaded block components
- **`createLazyBlock()`** — wraps `React.lazy()` with Suspense boundary + error boundary for block components

### New: Accessibility

- **`getAriaLabel()`** — generates descriptive `aria-label` strings for all block types
- **`handleKeyboardActivation()`** — Enter/Space keyboard handler for interactive elements
- **`getToggleContentId()`** — generates `aria-controls` compatible IDs for toggle blocks
- **ToggleBlock** — now uses `"use client"`, `useState`, dynamic `aria-expanded`, keyboard handler
- **ToDoBlock** — added keyboard activation handler
- **CodeBlock** — `aria-label` on `<code>` element, `role="code"`
- **HeadingBlock** — auto-generated, deduplicated heading IDs via `generateHeadingId()`

### New: Performance

- **`useMemo` for Shiki output** in `CodeBlock` — prevents re-highlighting on re-renders
- **Lazy loading** via `createLazyBlock()` for Mermaid, Chart, and Collection View components
- **Dynamic imports** — `mermaid` and `chart.js` are imported at runtime, not bundled

### New: CSS

- Complete CSS for all new components: `.noxion-accordion`, `.noxion-tab-group`, `.noxion-mermaid`, `.noxion-chart`, `.noxion-error-boundary`, `.noxion-error-fallback`, `.noxion-loading-placeholder`, `.noxion-heading-anchor`, `.noxion-block-actions`, `.noxion-collection-view`

### New: Renderer props

- **`plugins`** — `RendererPlugin[]` array for registering renderer plugins
- **`showBlockActions`** — `boolean | ((blockType: string) => boolean)` to enable block action buttons

### Improved

- **255 tests** passing in `@noxion/notion-renderer` (up from 94 in v0.1.0)
- All new components follow `"use client"` boundary rules — interactive wrappers are client components, block components remain server-renderable
- `mermaid` and `chart.js` declared as optional `peerDependencies` in `package.json`

---

## v0.3.0

**Released: 2026-02-25**

Major architecture simplification: the legacy token-based theme system (`extendTheme`, `NoxionThemePackage`) has been completely removed in favor of the contract-based theme system (`defineThemeContract`, `NoxionThemeContract`).

### Breaking: Legacy theme system removed

- **`extendTheme()`** — removed. Use `defineThemeContract()` instead.
- **`NoxionThemePackage`** — removed. Use `NoxionThemeContract` instead.
- **`ComponentOverrides`** — removed. Components are now part of theme contracts.
- **`useNoxionTheme()`** — removed. Use `useThemeContract()` instead.
- **`NoxionThemeProvider` props changed** — `theme`, `themePackage`, `slots`, `templates` props removed. Use `themeContract` prop instead.

### Breaking: Theme packages removed

The following theme packages have been deleted:
- `@noxion/theme-ink`
- `@noxion/theme-editorial`
- `@noxion/theme-folio`
- `@noxion/theme-carbon`

Only `@noxion/theme-default` and `@noxion/theme-beacon` remain.

### Breaking: Component exports removed from renderer

Components like `PostList`, `PostCard`, `Header`, `Footer`, `TOC`, `Search`, `TagFilter`, `HeroSection`, `FeaturedPostCard`, `EmptyState`, `ThemeToggle` are no longer exported from `@noxion/renderer`. They are now bundled inside theme contracts.

- **Type exports preserved** — all prop interfaces (`PostCardProps`, `PostListProps`, `HeaderProps`, etc.) are still exported from `@noxion/renderer`
- **To access components** — use `useThemeComponent("PostList")` or access them from the contract object directly

### New: Theme contract hooks

- **`useThemeContract()`** — returns the current theme contract
- **`useThemeComponent(name)`** — returns a specific component from the active theme
- **`useThemeLayout(name)`** — returns a layout component
- **`useThemeTemplate(name)`** — returns a template component

### Removed: Internal modules

- `packages/renderer/src/layouts/` — removed
- `packages/renderer/src/templates/` — removed
- `packages/renderer/src/theme/define-theme.ts` — removed
- `packages/renderer/src/theme/extend-theme.ts` — removed
- `packages/renderer/src/theme/css-generator.ts` — removed
- `packages/renderer/src/theme/component-resolver.ts` — removed
- `packages/renderer/src/theme/validate-theme.ts` — removed (types moved to contract.ts)
- `packages/renderer/src/styles/noxion.css` — removed

### Migration

**Before (v0.2):**
```tsx
import { NoxionThemeProvider } from "@noxion/renderer";
import { inkThemePackage } from "@noxion/theme-ink";

<NoxionThemeProvider theme={inkThemePackage}>
```

**After (v0.3):**
```tsx
import { NoxionThemeProvider } from "@noxion/renderer";
import { defaultThemeContract } from "@noxion/theme-default";

<NoxionThemeProvider themeContract={defaultThemeContract}>
```

### Improved

- **473 tests** passing across all packages
- Cleaner, smaller `@noxion/renderer` API surface
- Theme contracts provide full type safety for all theme components

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

### New: Independent theme packages

Themes are now published as standalone npm packages, each extending `@noxion/theme-default`:

| Package | Style | Description |
|---------|-------|-------------|
| `@noxion/theme-default` | Clean & modern | Balanced layout with system fonts, rounded cards, and a sticky header. The base theme all others extend. |
| `@noxion/theme-beacon` | Content-first | Wide content area (1320px), static header, and large typography for long-form reading. Custom home and post page components. |

> **Note:** `@noxion/theme-ink`, `@noxion/theme-editorial`, and `@noxion/theme-folio` were removed in v0.3.0 as part of the theme contract migration.

Install and apply any theme:

```bash
bun add @noxion/theme-default
```

```ts
import { defaultThemeContract } from "@noxion/theme-default";
// use with NoxionThemeProvider
```

### New: Hero section & homepage redesign

- **`HeroSection`** — full-width hero with featured post spotlight, per-theme styling
- **`FeaturedPostCard`** — overlay card design with gradient background and responsive breakpoints
- **Hero+Feed layout** — homepage now shows a hero section above the post feed
- **Per-theme component overrides** — themes can inject custom CSS and override page components (e.g., `HomePage`, `PostPage`)
- **Content container widened** from 720px to 1080px for modern wide-screen layouts

### New: Theme development app (`apps/theme-dev`)

- **Live preview** — iframe-based preview with desktop/tablet/mobile viewport toggle
- **Theme switcher** — switch between all installed themes in real-time
- **Compare mode** — side-by-side theme comparison
- **Validator panel** — runs theme validation checks with pass/fail reporting
- **Token inspector** — browse and search all CSS variable tokens
- **Notion page fetch** — load real Notion content for testing
- **Dark mode** — full dark mode support with toggle

### New: Notion webhook auto-publish

- **`/api/notion-webhook`** route in `@noxion/adapter-nextjs` — receives Notion webhook events and triggers on-demand revalidation for instant publishing

### Improved

- **Per-theme header styling** — each theme applies distinctive header CSS (height, borders, logo style, nav layout)
- **Responsive breakpoints** — hero section and featured cards adapt to mobile/tablet/desktop
- **Card layout consistency** — unified card layout between image and no-image states
- **Portfolio card covers** — always render cover container for consistent grid alignment
- **Article page layout** — improved typography and spacing for article content
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
