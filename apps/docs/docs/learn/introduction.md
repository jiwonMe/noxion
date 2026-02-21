---
sidebar_position: 1
title: Introduction
description: What is Noxion and why does it exist?
---

# Introduction

**Noxion** is an open-source, self-hosted blog builder that uses **Notion as its CMS**. Point it at a Notion database and get a fully-rendered, SEO-optimized website — no vendor lock-in, no recurring fees, and complete ownership of your infrastructure.

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

The trade-off is that this API is undocumented and could change without notice. In practice, the broader ecosystem (react-notion-x, notion-py, etc.) has been stable for years as Notion relies on it for their own app.

### ISR (Incremental Static Regeneration)

Posts are statically generated at build time and automatically re-generated in the background using [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration). By default, content refreshes every hour (`revalidate: 3600`). For instant updates, the [on-demand revalidation API](./configuration#on-demand-revalidation) lets you trigger a refresh the moment you publish in Notion.

### Non-expiring image URLs

Notion's official API returns presigned S3 URLs that expire in ~1 hour — unusable for a static site. Noxion routes all images through `notion.so/image/`, a stable proxy that does **not** expire. These URLs are then further optimized by Next.js Image into AVIF/WebP on-the-fly.

---

## What Noxion gives you

| Feature | Details |
|---------|---------|
| **Zero-friction setup** | `bun create noxion` scaffolds a complete Next.js 16 App Router blog in under a minute |
| **Write in Notion** | Use Notion's full editor — posts appear on your site within an hour, or instantly with on-demand revalidation |
| **Full SEO stack** | Open Graph, Twitter Cards, JSON-LD (BlogPosting, BreadcrumbList, WebSite + SearchAction), RSS 2.0, XML sitemap, robots.txt — all generated automatically from your Notion data |
| **Image optimization** | AVIF/WebP auto-conversion via `next/image`, with stable non-expiring proxy URLs. Optional build-time download for full offline independence |
| **Plugin system** | Analytics (Google, Plausible, Umami), RSS, comments (Giscus, Utterances, Disqus) — each a one-liner in config |
| **CSS variable theming** | Light/dark/system modes out of the box. Fully customizable without a build step |
| **Deploy anywhere** | Vercel (one-click), Docker, static export |

---

## Architecture

Noxion is a **monorepo of composable npm packages**:

```
noxion/
├── packages/
│   ├── @noxion/core            — data fetching, config, plugin system, types
│   ├── @noxion/renderer        — React components (PostList, NotionPage, ThemeProvider)
│   ├── @noxion/adapter-nextjs  — SEO utilities (Metadata, JSON-LD, sitemap, robots)
│   └── create-noxion           — CLI scaffolding tool
└── apps/
    ├── docs/                   — This documentation site (Docusaurus)
    └── web/                    — Demo/reference Next.js blog
```

### Data flow

```
Notion database
    │
    ▼
@noxion/core (fetchBlogPosts)
    │  ├─ Calls unofficial Notion API (notion-client)
    │  ├─ Extracts schema properties (Title, Public, Tags, …)
    │  ├─ Parses frontmatter from first code block
    │  └─ Applies plugins (transformPosts hook)
    │
    ▼
Next.js App Router (ISR, revalidate: 3600)
    │
    ├─ @noxion/adapter-nextjs → generateMetadata(), JSON-LD, sitemap
    └─ @noxion/renderer → <NotionPage />, <PostList />, ThemeProvider
```

### The `create-noxion` CLI

Running `bun create noxion my-blog` generates a Next.js 16 App Router project that wires these packages together. **You own the generated app** — the Noxion packages are just npm dependencies. You can customize every file, override components, or eject entirely if needed.

---

## Key concepts

### `NoxionConfig`

The central configuration object defined in `noxion.config.ts`. Every package reads from this single source of truth. See [Configuration](./configuration) for all options.

### `BlogPost`

The normalized post data type output by `fetchBlogPosts()`. Contains `id`, `title`, `slug`, `date`, `tags`, `category`, `coverImage`, `description`, `author`, `published`, `lastEditedTime`, and `frontmatter`. See [Types reference](../reference/core/types).

### Frontmatter

Noxion reads a special **code block** at the top of any Notion page and treats its contents as per-post metadata overrides. This lets you set custom slugs, SEO titles, and descriptions without leaving Notion. See [Notion Setup → Frontmatter](./notion-setup#frontmatter-overrides).

### Plugins

Plugins extend Noxion at well-defined lifecycle hooks: `transformPosts`, `injectHead`, `extendMetadata`, `extendSitemap`, and more. Built-in plugins cover analytics, RSS, and comments. See [Plugins](./plugins/overview).

---

## Comparison with alternatives

| | Noxion | super.so | Docusaurus | Hugo |
|---|---|---|---|---|
| CMS | Notion | Notion | Markdown files | Markdown files |
| Price | Free | $16–32/mo | Free | Free |
| Self-hosted | ✅ | ❌ | ✅ | ✅ |
| Open source | ✅ | ❌ | ✅ | ✅ |
| SEO (JSON-LD, OG) | ✅ | Limited | Limited | Limited |
| ISR / live sync | ✅ | ✅ | ❌ | ❌ |
| Custom domain | ✅ | ✅ | ✅ | ✅ |

---

## Next steps

- [Quick Start](./quick-start) — scaffold your blog in 5 minutes
- [Notion Setup](./notion-setup) — configure your Notion database
- [Configuration](./configuration) — full `noxion.config.ts` reference
- [SEO](./seo) — understand what Noxion generates automatically
