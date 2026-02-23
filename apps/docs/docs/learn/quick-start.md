---
sidebar_position: 2
title: Quick Start
description: Scaffold a Noxion site in under 5 minutes.
---

# Quick Start

This guide takes you from zero to a running Noxion site in under 5 minutes.

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

Run the scaffolding CLI:

```bash
bun create noxion my-site
```

### Choose a template

The CLI prompts you to select a template:

| Template | What you get |
|----------|-------------|
| **Blog** (default) | Single blog with post list and detail pages |
| **Docs** | Documentation site with sidebar navigation and section grouping |
| **Portfolio** | Portfolio with project grid, filtering, and detail pages |
| **Full** | All three page types in one site (blog + docs + portfolio) |

You can also pass `--template` to skip the prompt:

```bash
bun create noxion my-blog --template blog
bun create noxion my-docs --template docs
bun create noxion my-site --template full
```

### Scaffold a plugin or theme

To create a starter plugin or theme project:

```bash
bun create noxion my-plugin --plugin
bun create noxion my-theme --theme
```

### Interactive prompts

The CLI will ask for several pieces of information:

| Prompt | Example | Notes |
|--------|---------|-------|
| Project name | `my-site` | Becomes the folder name |
| Template | `blog` | Blog, Docs, Portfolio, or Full |
| Notion page ID | `abc123def456...` | 32-character hex string from your database URL |
| Site name | `My Site` | Used in `<title>` tags and OG metadata |
| Site description | `A site about...` | Used in `<meta description>` |
| Author | `Jane Doe` | Default author name |
| Domain | `mysite.com` | Production domain — used for canonical URLs and OG |

For **docs** and **full** templates, you'll also be asked for the Docs Notion database ID. For **portfolio** and **full** templates, you'll be asked for the Portfolio Notion database ID.

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
  --template blog \
  --notion-id=abc123def456 \
  --name="My Blog" \
  --description="A blog about things I find interesting" \
  --author="Your Name" \
  --domain=myblog.com
```

---

## Step 2: Configure environment variables

```bash
cd my-site
cp .env.example .env
```

Open `.env` and fill in your values:

```bash
# Required
NOTION_PAGE_ID=abc123def456...   # Your Notion database page ID

# Site metadata (can also be set in noxion.config.ts)
SITE_DOMAIN=mysite.com
SITE_NAME=My Site
SITE_AUTHOR=Your Name
SITE_DESCRIPTION=A site about things I find interesting

# Optional: for private Notion pages
# NOTION_TOKEN=secret_xxx...

# Optional: for on-demand ISR revalidation
# REVALIDATE_SECRET=some-random-secret

# For docs/portfolio/full templates:
# DOCS_NOTION_ID=def456...
# PORTFOLIO_NOTION_ID=ghi789...
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

Open [http://localhost:3000](http://localhost:3000). Your Notion pages will appear automatically.

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

### Blog template

```
my-blog/
├── app/
│   ├── layout.tsx              # Root layout: ThemeProvider, fonts, SEO metadata
│   ├── page.tsx                # Homepage: PostList + JSON-LD
│   ├── [slug]/
│   │   └── page.tsx            # Post detail: NotionPage + JSON-LD BlogPosting
│   ├── tag/[tag]/page.tsx      # Tag filter pages
│   ├── feed.xml/route.ts       # RSS 2.0 feed
│   ├── sitemap.ts              # XML sitemap
│   └── robots.ts               # robots.txt
├── lib/
│   ├── config.ts               # Loads noxion.config.ts
│   └── notion.ts               # Notion client and data fetching
├── noxion.config.ts            # Site configuration
└── package.json
```

### Full template (multi-type)

```
my-site/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # Homepage with all collections
│   ├── [slug]/page.tsx         # Blog post pages
│   ├── docs/[slug]/page.tsx    # Documentation pages
│   ├── portfolio/[slug]/page.tsx  # Portfolio project pages
│   ├── tag/[tag]/page.tsx
│   ├── feed.xml/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── lib/
│   ├── config.ts
│   └── notion.ts               # fetchCollection per page type
├── noxion.config.ts            # Collections config
└── package.json
```

### Key files explained

**`noxion.config.ts`** — the single source of truth for your site. All Noxion packages read from this config. This is where you add plugins, configure collections, set your domain, etc.

**`lib/notion.ts`** — creates the Notion client and exports data fetching functions. For single-database mode: `getAllPosts()` and `getPostBySlug()`. For multi-database mode: `fetchCollection()` per page type.

**`app/[slug]/page.tsx`** — the post/page detail page. Uses `generateStaticParams()` to pre-render all published pages at build time. Uses `generateMetadata()` for per-page Open Graph / Twitter metadata.

**`app/sitemap.ts`** — returns a `MetadataRoute.Sitemap` array that Next.js uses to generate `/sitemap.xml` automatically.

---

## Verify it's working

After starting the dev server, check that:

1. **Pages load** — your Notion pages should appear on the homepage
2. **Navigation works** — clicking a card should render the full page
3. **Tags work** — clicking a tag should filter to that tag's page at `/tag/[tag]`

If pages don't appear, the most common causes are:
- The `NOTION_PAGE_ID` is wrong (double-check the hex string)
- The `Public` checkbox is not checked on any pages
- The database has a different column name than `Public` (Noxion matches case-insensitively, but the column type must be `Checkbox`)

See [Notion Setup](./notion-setup) for the expected database schema.
