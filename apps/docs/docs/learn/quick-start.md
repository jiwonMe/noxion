---
sidebar_position: 2
title: Quick Start
description: Scaffold a Noxion blog in under 5 minutes.
---

# Quick Start

## Prerequisites

- [Bun](https://bun.sh) 1.0+
- A [Notion](https://notion.so) account
- A Notion database (see [Notion Setup](./notion-setup))

## 1. Scaffold

```bash
bun create noxion my-blog
```

The CLI will ask for:
- **Project name** — folder name for your blog
- **Notion page ID** — the root database page
- **Site name**, **description**, **author**, **domain**

Or non-interactively:

```bash
bun create noxion my-blog \
  --yes \
  --notion-id=abc123def456 \
  --name="My Blog" \
  --domain=myblog.com \
  --author="Your Name"
```

## 2. Configure environment

```bash
cd my-blog
cp .env.example .env
```

Edit `.env`:

```bash
NOTION_PAGE_ID=abc123def456...
SITE_DOMAIN=myblog.com
SITE_NAME=My Blog
SITE_AUTHOR=Your Name
SITE_DESCRIPTION=A blog about things I find interesting
```

## 3. Start development

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Your Notion posts appear automatically.

## 4. Deploy

### Vercel (recommended)

```bash
vercel
```

Add the same environment variables in the Vercel dashboard.

### Docker

```bash
docker compose up
```

See [Deployment → Vercel](./deployment/vercel) and [Deployment → Docker](./deployment/docker) for details.

## What was created

```
my-blog/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Homepage with post list
│   ├── [slug]/page.tsx     # Post detail pages
│   ├── tag/[tag]/page.tsx  # Tag filter pages
│   ├── feed.xml/route.ts   # RSS feed
│   ├── sitemap.ts
│   └── robots.ts
├── lib/
│   ├── config.ts           # Load noxion config
│   └── notion.ts           # Notion data fetching helpers
├── noxion.config.ts        # Your site configuration
└── .env.example
```
