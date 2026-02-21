---
sidebar_position: 1
title: Introduction
description: What is Noxion and why does it exist?
---

# Introduction

**Noxion** is an open-source, self-hosted blog builder that uses Notion as its CMS. Point it at a Notion database and get a fully-rendered, SEO-optimized website.

Think [super.so](https://super.so) or [oopy.io](https://oopy.io) — but free, open, and yours to own.

## Why Noxion?

Most developers want to write in Notion but publish to a fast, SEO-optimized website they control. The alternatives fall short:

| Option | Problem |
|--------|---------|
| Notion's built-in sharing | Slow, no custom domain, weak SEO |
| super.so / oopy.io | Paid, closed-source, vendor lock-in |
| Export + static site | Manual work, no live sync |
| Official Notion API | Presigned URLs expire in 1 hour |

Noxion solves all of these. It uses the **unofficial Notion API** (same one powering Notion's own web app) for richer data access, and ISR (Incremental Static Regeneration) keeps content fresh automatically.

## What Noxion gives you

- **Zero-friction setup** — `bun create noxion` scaffolds a complete blog in under a minute
- **Write in Notion** — use Notion's editor, your posts appear on your site within an hour (or instantly with on-demand revalidation)
- **Extreme SEO** — Open Graph, Twitter Cards, JSON-LD schemas, RSS, sitemap, robots.txt — all automatic
- **Image optimization** — AVIF/WebP via Next.js Image, no URL expiration issues
- **Plugin system** — analytics, comments, RSS with a one-liner config
- **Deploy anywhere** — Vercel, Docker, static export

## Architecture

Noxion is a **monorepo of npm packages** you compose together:

```
@noxion/core           — data fetching, config, plugin system
@noxion/renderer       — React components (PostList, NotionPage, ThemeProvider)
@noxion/adapter-nextjs — SEO utilities (metadata, JSON-LD, sitemap)
create-noxion          — CLI scaffolding tool
```

The `create-noxion` CLI generates a Next.js 16 App Router project that wires these together. You own the app — Noxion packages are just dependencies.

## Next steps

- [Quick Start](./quick-start) — scaffold your blog in 5 minutes
- [Notion Setup](./notion-setup) — set up your Notion database correctly
- [Configuration](./configuration) — full `noxion.config.ts` reference
