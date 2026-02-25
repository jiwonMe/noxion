---
sidebar_position: 1
title: Introduction
description: What is Noxion and why does it exist?
---

# Introduction

**Noxion** is an open-source, self-hosted **website builder** that uses **Notion as its CMS**. Point it at one or more Notion databases and get a fully-rendered, SEO-optimized website — blogs, documentation sites, portfolios, or any combination — no vendor lock-in, no recurring fees, and complete ownership of your infrastructure.

Think [super.so](https://super.so) or [oopy.io](https://oopy.io) — but free, open source, and entirely yours.

---

## Why Noxion?

Most developers want to write in Notion's comfortable editor, but publish to a fast, SEO-optimized site they actually control. The usual alternatives all have significant trade-offs:

| Option | Problem |
|--------|---------|
| Notion's built-in sharing | Slow (server-side rendered, no CDN), no custom domain, near-zero SEO |
| super.so / oopy.io | $16–$32/month, closed-source, complete vendor lock-in |
| Export → static site | Manual, time-consuming, no live sync after export |
| Official Notion API | Presigned S3 image URLs expire every ~1 hour |

Noxion solves every one of these. The key architectural decisions:

### Unofficial Notion API

Noxion uses the **unofficial Notion API** — the same JSON endpoints that power Notion's own web app. This gives significantly richer data access compared to the [official public API](https://developers.notion.com/), including full block tree data with inline styles, collection views, nested page structures, and more.

The trade-off is that this API is undocumented and could change without notice. In practice, the broader ecosystem (`notion-client`, `notion-types`, etc.) has been stable for years as Notion relies on it for their own app.

### ISR (Incremental Static Regeneration)

Posts are statically generated at build time and automatically re-generated in the background using [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration). By default, content refreshes every hour (`revalidate: 3600`). For instant updates, the [on-demand revalidation API](./configuration#on-demand-revalidation) lets you trigger a refresh the moment you publish in Notion.

### Non-expiring image URLs

Notion's official API returns presigned S3 URLs that expire in ~1 hour — unusable for a static site. Noxion routes all images through `notion.so/image/`, a stable proxy that does **not** expire. These URLs are then further optimized by Next.js Image into AVIF/WebP on-the-fly.

---

## What Noxion gives you

| Feature | Details |
|---------|---------|
| **Zero-friction setup** | `bun create noxion` scaffolds a complete Next.js 16 App Router site in under a minute — choose blog, docs, portfolio, or full multi-type |
| **Multiple page types** | Blog posts, documentation pages, portfolio projects — each with its own Notion database, URL structure, and templates |
| **Write in Notion** | Use Notion's full editor — pages appear on your site within an hour, or instantly with on-demand revalidation |
| **Full SEO stack** | Open Graph, Twitter Cards, JSON-LD (BlogPosting, TechArticle, CreativeWork, BreadcrumbList, WebSite + SearchAction), RSS 2.0, XML sitemap, robots.txt — all generated automatically |
| **Image optimization** | AVIF/WebP auto-conversion via `next/image`, with stable non-expiring proxy URLs. Optional build-time download for full offline independence |
| **Plugin system** | Analytics, RSS, comments, reading time — plus a plugin SDK (`@noxion/plugin-utils`) for building your own |
| **Theme system** | Contract-based theming via `defineThemeContract()` with CSS variable customization. Light/dark/system modes out of the box |
| **Syntax highlighting** | VS Code-quality code blocks via [Shiki](https://shiki.style) with dual-theme support — no client-side JS |
| **Math equations** | KaTeX SSR — equations rendered server-side, zero client-side math runtime |
| **Deploy anywhere** | Vercel (one-click), Docker, static export |

---

## Page types

Noxion supports three built-in page types, each with its own Notion database schema, URL routing, templates, and SEO metadata:

| Type | Use case | URL pattern | JSON-LD |
|------|----------|-------------|---------|
| **Blog** | Articles, posts | `/blog/[slug]` or `/[slug]` | `BlogPosting` |
| **Docs** | Documentation, guides | `/docs/[slug]` | `TechArticle` |
| **Portfolio** | Projects, case studies | `/portfolio/[slug]` | `CreativeWork` |

Each page type maps to a separate Notion database. You configure them via `collections` in `noxion.config.ts`:

```ts
export default defineConfig({
  name: "My Site",
  domain: "mysite.com",
  author: "Jane Doe",
  description: "My personal website",
  collections: [
    { databaseId: process.env.BLOG_NOTION_ID!, pageType: "blog" },
    { databaseId: process.env.DOCS_NOTION_ID!, pageType: "docs", pathPrefix: "docs" },
    { databaseId: process.env.PORTFOLIO_NOTION_ID!, pageType: "portfolio", pathPrefix: "portfolio" },
  ],
});
```

Plugins can register additional custom page types via the `registerPageTypes` hook.

---

## Architecture

Noxion is a **monorepo of composable npm packages**:

```
noxion/
├── packages/
│   ├── @noxion/core              — data fetching, config, plugin system, types
│   ├── @noxion/notion-renderer   — Notion block renderer (KaTeX SSR, Shiki syntax highlighting)
│   ├── @noxion/renderer          — React components, templates, theme system
│   ├── @noxion/adapter-nextjs    — SEO utilities (Metadata, JSON-LD, sitemap, routing)
│   ├── @noxion/plugin-utils      — Plugin SDK (mock data, test helpers, manifest validation)
│   └── create-noxion             — CLI scaffolding tool
└── apps/
    ├── docs/                     — This documentation site (Docusaurus)
    └── web/                      — Demo/reference Next.js site
```

### Data flow

```
Notion databases (Blog, Docs, Portfolio)
    │
    ▼
@noxion/core (fetchCollection / fetchAllCollections)
    │  ├─ Calls unofficial Notion API (notion-client)
    │  ├─ Schema mapper → per-page-type property extraction
    │  ├─ Returns typed NoxionPage[] (BlogPage, DocsPage, PortfolioPage)
    │  ├─ Parses frontmatter from first code block
    │  └─ Applies plugins (transformPosts, registerPageTypes hooks)
    │
    ▼
Next.js App Router (ISR, revalidate: 3600)
    │
    ├─ @noxion/adapter-nextjs → generateMetadata(), JSON-LD, sitemap, routing
    ├─ @noxion/notion-renderer → Block rendering (30+ types), KaTeX SSR, Shiki
    └─ @noxion/renderer → Templates, components, ThemeProvider
```

### The `create-noxion` CLI

Running `bun create noxion my-site` generates a Next.js 16 App Router project. Choose a template:

| Template | Description |
|----------|-------------|
| `blog` (default) | Single blog with post list and detail pages |
| `docs` | Documentation site with sidebar navigation |
| `portfolio` | Portfolio with project grid and detail pages |
| `full` | All three page types combined |

You can also scaffold plugin and theme starter projects:

```bash
bun create noxion my-plugin --plugin
bun create noxion my-theme --theme
```

**You own the generated app** — the Noxion packages are just npm dependencies. You can customize every file, override components, or eject entirely if needed.

---

## Key concepts

### `NoxionConfig`

The central configuration object defined in `noxion.config.ts`. Every package reads from this single source of truth. Supports both single-database mode (`rootNotionPageId`) and multi-database mode (`collections`). See [Configuration](./configuration) for all options.

### `NoxionPage`

The normalized page data type output by the fetcher. A discriminated union based on `pageType`:

- `BlogPage` — blog posts with `date`, `tags`, `category`, `author`
- `DocsPage` — docs pages with `section`, `order`, `version`
- `PortfolioPage` — portfolio projects with `technologies`, `projectUrl`, `year`, `featured`

All page types share common fields: `id`, `title`, `slug`, `description`, `coverImage`, `published`, `lastEditedTime`, `frontmatter`, and a `metadata` record for type-specific data.

`BlogPost` is kept as a type alias for `BlogPage` for backward compatibility. See [Types reference](../reference/core/types).

### Frontmatter

Noxion reads a special **code block** at the top of any Notion page and treats its contents as per-post metadata overrides. This lets you set custom slugs, SEO titles, and descriptions without leaving Notion. See [Notion Setup → Frontmatter](./notion-setup#frontmatter-overrides).

### Plugins

Plugins extend Noxion at well-defined lifecycle hooks: `transformPosts`, `registerPageTypes`, `extendSlots`, `configSchema`, and more. Built-in plugins cover analytics, RSS, and comments. Use `@noxion/plugin-utils` for testing and development. See [Plugins](./plugins/overview).

### Themes

Themes are contract-based packages defined via `defineThemeContract()` that bundle components, layouts, and templates. The default theme supports blog and docs page types. Community themes can declare which page types they support. See [Themes](./themes).

---

## Comparison with alternatives

| | Noxion | super.so | Docusaurus | Hugo |
|---|---|---|---|---|
| CMS | Notion | Notion | Markdown files | Markdown files |
| Price | Free | $16–32/mo | Free | Free |
| Self-hosted | ✅ | ❌ | ✅ | ✅ |
| Open source | ✅ | ❌ | ✅ | ✅ |
| Multiple page types | ✅ | ❌ | ❌ | ✅ |
| SEO (JSON-LD, OG) | ✅ | Limited | Limited | Limited |
| ISR / live sync | ✅ | ✅ | ❌ | ❌ |
| Custom domain | ✅ | ✅ | ✅ | ✅ |
| Plugin ecosystem | ✅ | ❌ | ✅ | ✅ |

---

## Next steps

- [Quick Start](./quick-start) — scaffold your site in 5 minutes
- [Notion Setup](./notion-setup) — configure your Notion databases
- [Configuration](./configuration) — full `noxion.config.ts` reference
- [Building a Docs Site](./building-docs) — set up a documentation site
- [Building a Portfolio](./building-portfolio) — set up a portfolio
- [SEO](./seo) — understand what Noxion generates automatically
