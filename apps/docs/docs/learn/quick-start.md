---
sidebar_position: 2
title: Quick Start
description: Scaffold a Noxion blog in under 5 minutes.
---

# Quick Start

This guide takes you from zero to a running Noxion blog in under 5 minutes.

## Prerequisites

Before you begin, you'll need:

- **[Bun](https://bun.sh) 1.0+** — Noxion uses Bun for package management and the scaffolding CLI. Install it with:
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
  You can also use npm or pnpm if you prefer — replace `bun` with your package manager.

- **A [Notion](https://notion.so) account** — free tier is sufficient.

- **A Notion database** — see [Notion Setup](./notion-setup) if you haven't created one yet. At minimum you need a database with a `Title` (title property) and `Public` (checkbox) column.

---

## Step 1: Scaffold the project

Run the scaffolding CLI and follow the prompts:

```bash
bun create noxion my-blog
```

The CLI will ask for several pieces of information interactively:

| Prompt | Example | Notes |
|--------|---------|-------|
| Project name | `my-blog` | Becomes the folder name |
| Notion page ID | `abc123def456...` | 32-character hex string from your database URL |
| Site name | `My Blog` | Used in `<title>` tags and OG metadata |
| Site description | `A blog about...` | Used in `<meta description>` |
| Author | `Jane Doe` | Default author name for posts |
| Domain | `myblog.com` | Production domain — used for canonical URLs and OG |

### Finding your Notion page ID

Open your Notion database in a browser. The URL looks like:

```
https://notion.so/your-workspace/My-Database-abc123def456...
                                                ^^^^^^^^^^^^^^^^
```

The 32-character hex string at the end (with or without hyphens) is your **page ID**.

Alternatively: open the database, click **Share** → **Copy link**, and extract the ID from the URL.

### Non-interactive mode

If you want to skip the prompts (useful for CI/CD or automation):

```bash
bun create noxion my-blog \
  --yes \
  --notion-id=abc123def456 \
  --name="My Blog" \
  --description="A blog about things I find interesting" \
  --author="Your Name" \
  --domain=myblog.com
```

---

## Step 2: Configure environment variables

```bash
cd my-blog
cp .env.example .env
```

Open `.env` and fill in your values:

```bash
# Required
NOTION_PAGE_ID=abc123def456...   # Your Notion database page ID

# Site metadata (can also be set in noxion.config.ts)
SITE_DOMAIN=myblog.com
SITE_NAME=My Blog
SITE_AUTHOR=Your Name
SITE_DESCRIPTION=A blog about things I find interesting

# Optional: for private Notion pages
# NOTION_TOKEN=secret_xxx...

# Optional: for on-demand ISR revalidation
# REVALIDATE_SECRET=some-random-secret
```

:::info Public vs. private Notion pages
By default, Noxion accesses Notion pages **without authentication** (the same way Notion's share-to-web feature works). If your database is private, you'll need to create an integration token — see [Notion Setup → Private pages](./notion-setup#private-pages-optional).
:::

---

## Step 3: Start development

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Your Notion posts will appear automatically.

:::tip First load is slow
The first page load fetches data from Notion's API (typically 300–800ms). Subsequent loads use ISR cache and are near-instant. In production with Vercel's CDN, the cached page is served in under 50ms.
:::

---

## Step 4: Deploy

### Vercel (recommended for most users)

```bash
vercel
```

Vercel handles ISR, image optimization (via Vercel Image Optimization), and CDN automatically. Add the same environment variables in the Vercel dashboard under **Settings → Environment Variables**.

See [Deployment → Vercel](./deployment/vercel) for a full walkthrough including on-demand revalidation setup.

### Docker (for self-hosted or VPS)

```bash
docker compose up -d
```

See [Deployment → Docker](./deployment/docker) for details on the multi-stage Dockerfile, resource requirements, and reverse proxy setup with nginx.

---

## What was created

The CLI generates a complete Next.js 16 App Router project:

```
my-blog/
├── app/
│   ├── layout.tsx              # Root layout: ThemeProvider, fonts, SEO metadata
│   ├── page.tsx                # Homepage: PostList + JSON-LD WebSite/CollectionPage
│   ├── [slug]/
│   │   └── page.tsx            # Post detail: NotionPage + JSON-LD BlogPosting
│   ├── tag/
│   │   └── [tag]/
│   │       └── page.tsx        # Tag filter pages
│   ├── feed.xml/
│   │   └── route.ts            # RSS 2.0 feed
│   ├── sitemap.ts              # XML sitemap (Next.js MetadataRoute.Sitemap)
│   └── robots.ts               # robots.txt (Next.js MetadataRoute.Robots)
│
├── lib/
│   ├── config.ts               # Loads noxion.config.ts and applies env var overrides
│   └── notion.ts               # Notion client and data fetching helpers
│
├── noxion.config.ts            # Your site configuration (plugins, theme, etc.)
├── next.config.ts              # Next.js config (image domains, etc.)
├── .env.example                # Template for environment variables
└── package.json
```

### Key files explained

**`noxion.config.ts`** — the single source of truth for your site. All Noxion packages read from this config. This is where you add plugins, change the default theme, set your domain, etc.

**`lib/notion.ts`** — creates the Notion client and exports `getAllPosts()` and `getPostBySlug()` functions. If you need custom data fetching behavior, this is the file to edit.

**`app/[slug]/page.tsx`** — the post detail page. Uses `generateStaticParams()` to pre-render all published posts at build time. Uses `generateMetadata()` for per-post Open Graph / Twitter metadata.

**`app/sitemap.ts`** — returns a `MetadataRoute.Sitemap` array that Next.js uses to generate `/sitemap.xml` automatically.

---

## Verify it's working

After starting the dev server, check that:

1. **Posts load** — your Notion posts should appear on the homepage
2. **Navigation works** — clicking a post card should render the full post
3. **Tags work** — clicking a tag should filter to that tag's page at `/tag/[tag]`

If posts don't appear, the most common causes are:
- The `NOTION_PAGE_ID` is wrong (double-check the hex string)
- The `Public` checkbox is not checked on any posts
- The database has a different column name than `Public` (Noxion matches case-insensitively, but the column type must be `Checkbox`)

See [Notion Setup](./notion-setup) for the expected database schema.
