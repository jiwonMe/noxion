---
sidebar_position: 1
title: API Overview
description: Noxion package API reference.
---

# API Reference

Noxion is distributed as three npm packages plus a CLI. This section covers every exported function, component, and type.

## Packages

| Package | Purpose |
|---------|---------|
| [`@noxion/core`](./core/config) | Config, data fetching, plugin system, types |
| [`@noxion/renderer`](./renderer/notion-page) | React components for rendering Notion content |
| [`@noxion/adapter-nextjs`](./adapter-nextjs/metadata) | Next.js SEO adapters (metadata, JSON-LD, sitemap) |
| [`create-noxion`](./cli/create-noxion) | CLI scaffolding tool |

## Quick navigation

### @noxion/core
- [`defineConfig()`](./core/config) — define your site config
- [`fetchBlogPosts()`](./core/fetcher) — fetch all published posts
- [`fetchPostBySlug()`](./core/fetcher) — fetch a single post by slug
- [`parseFrontmatter()`](./core/frontmatter) — parse frontmatter from a Notion page
- [`definePlugin()`](./core/plugins) — create a custom plugin

### @noxion/renderer
- [`<NotionPage />`](./renderer/notion-page) — render a Notion page
- [`<PostList />`](./renderer/post-list) — render a list of post cards
- [`<PostCard />`](./renderer/post-card) — render a single post card
- [`<NoxionThemeProvider />`](./renderer/theme-provider) — theme context provider

### @noxion/adapter-nextjs
- [`generateNoxionMetadata()`](./adapter-nextjs/metadata#generatenoxionmetadata) — post-level Next.js Metadata
- [`generateNoxionListMetadata()`](./adapter-nextjs/metadata#generatenoxionlistmetadata) — site-level Metadata
- [`generateBlogPostingLD()`](./adapter-nextjs/structured-data#generateblogpostingld) — BlogPosting JSON-LD
- [`generateBreadcrumbLD()`](./adapter-nextjs/structured-data#generatebreadcrumbld) — BreadcrumbList JSON-LD
- [`generateNoxionSitemap()`](./adapter-nextjs/sitemap#generatenoxionsitemap) — sitemap entries
