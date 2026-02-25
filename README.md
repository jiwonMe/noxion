# Noxion

**Notion-powered website builder.** Point it at a Notion database and get a fully-rendered, SEO-optimized website — self-hosted and open source. Supports blog, docs, and portfolio page types.

Think [super.so](https://super.so) or [oopy.io](https://oopy.io), but free and yours to own.

---

## Features

- **Zero-friction setup** — `bun create noxion` scaffolds a complete Next.js blog in seconds
- **Notion as CMS** — write and publish posts directly from Notion; your database schema becomes your blog
- **Extreme SEO** — Open Graph, Twitter Cards, JSON-LD (BlogPosting, BreadcrumbList, WebSite SearchAction), RSS feed, sitemap with tag pages, robots.txt — all generated automatically
- **Image optimization** — Next.js Image with AVIF/WebP, or opt-in build-time download for full URL independence
- **Multiple page types** — Blog, Docs, and Portfolio with multi-database collections
- **Plugin system** — analytics (Google, Plausible, Umami), RSS, comments (Giscus, Utterances, Disqus), reading time
- **2 built-in themes** — Default and Beacon — contract-based theme system, fully customizable via CSS variables
- **ISR** — posts update automatically every hour; on-demand revalidation API included
- **Deploy anywhere** — Vercel (one click), Docker, or static export

## Quick Start

```bash
bun create noxion my-blog
cd my-blog
# Edit .env with your Notion page ID
bun run dev
```

That's it. Open `http://localhost:3000`.

## Notion Setup

1. Create a Notion database with these properties:

   | Property | Type | Description |
   |----------|------|-------------|
   | Title | Title | Post title |
   | Public | Checkbox | Check to publish |
   | Published | Date | Publication date |
   | Tags | Multi-select | Post tags |
   | Category | Select | Post category |
   | Slug | Text | URL slug (optional) |
   | Description | Text | Meta description (optional) |
   | Author | Text | Author name (optional) |

2. Copy the page ID from the URL: `notion.so/your-workspace/**abc123...**`

3. Add it to `.env`:
   ```
   NOTION_PAGE_ID=abc123...
   ```

> **Tip:** Add a code block at the top of any page with YAML-like key:value pairs for per-post overrides:
>
> ```
> cleanUrl: /my-custom-slug
> title: Custom SEO Title
> description: Custom meta description
> floatFirstTOC: right
> ```

## Configuration

```ts
// noxion.config.ts
import { defineConfig, createRSSPlugin, createAnalyticsPlugin } from "@noxion/core";

export default defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  name: "My Blog",
  domain: "myblog.com",
  author: "Your Name",
  description: "A blog about things I find interesting",
  language: "en",
  defaultTheme: "system",
  plugins: [
    createRSSPlugin({ feedPath: "/feed.xml", limit: 20 }),
    createAnalyticsPlugin({ provider: "google", trackingId: process.env.GA_ID }),
  ],
});
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NOTION_PAGE_ID` | ✅ | Root Notion database page ID |
| `NOTION_TOKEN` | — | Integration token (private pages only) |
| `SITE_NAME` | — | Site name (default: `Noxion Blog`) |
| `SITE_DOMAIN` | — | Production domain (default: `localhost:3000`) |
| `SITE_AUTHOR` | — | Author name |
| `SITE_DESCRIPTION` | — | Site description |
| `REVALIDATE_SECRET` | — | Secret for on-demand ISR revalidation |
| `NEXT_PUBLIC_GA_ID` | — | Google Analytics tracking ID |
| `NEXT_PUBLIC_GISCUS_REPO` | — | Giscus repo (enables comments) |
| `NOXION_DOWNLOAD_IMAGES` | — | Set `true` to download images at build time |

## Image Strategy

By default, images are served through Notion's image proxy (`notion.so/image/`) and optimized on-the-fly by Next.js to AVIF/WebP. These proxy URLs do not expire.

For maximum independence from Notion's infrastructure, set `NOXION_DOWNLOAD_IMAGES=true` — images will be downloaded to `public/` at build time and served as static assets. Only runs in production builds; development always uses the proxy.

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jiwonme/noxion)

Add your environment variables in the Vercel dashboard and deploy.

### Docker

```bash
# Build
docker build -t noxion ./apps/web

# Run
docker run -p 3000:3000 \
  -e NOTION_PAGE_ID=abc123 \
  -e SITE_DOMAIN=myblog.com \
  noxion
```

Or with Docker Compose:

```bash
cd apps/web
cp .env.example .env  # fill in your values
docker compose up
```

## On-Demand Revalidation

Trigger a cache refresh without waiting for the hourly ISR:

```bash
curl -X POST "https://myblog.com/api/revalidate?secret=YOUR_SECRET&path=/my-post-slug"
```

## Monorepo Structure

```
noxion/
├── packages/
│   ├── core/               # @noxion/core — config, fetcher, plugins, frontmatter
│   ├── renderer/           # @noxion/renderer — React components, themes, templates
│   ├── notion-renderer/    # @noxion/notion-renderer — Notion block renderer
│   ├── adapter-nextjs/     # @noxion/adapter-nextjs — metadata, sitemap, JSON-LD, webhook
│   ├── create-noxion/      # CLI scaffolding tool
│   ├── plugin-utils/       # @noxion/plugin-utils — mock data, test helpers
│   ├── plugin-reading-time/# noxion-plugin-reading-time — example community plugin
│   ├── theme-default/      # @noxion/theme-default — base theme (defaultThemeContract)
│   └── theme-beacon/       # @noxion/theme-beacon — content-first wide theme (beaconThemeContract)
└── apps/
    ├── web/                # Demo blog (Next.js 16 App Router)
    ├── docs/               # Documentation site (Docusaurus)
    └── theme-dev/          # Theme development & preview app
```

## Local Development

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Run tests
bun run test

# Start demo app
cd apps/web && bun run dev
```

## What Noxion Generates Automatically

| SEO Signal | Details |
|---|---|
| `<title>` | `Post Title \| Site Name` via template |
| `<meta description>` | From Notion `Description` field or post title, 160-char limit |
| Open Graph | `og:title`, `og:description`, `og:image` (1200×630), `og:locale`, `article:*` tags |
| Twitter Card | `summary_large_image` with image |
| Canonical URL | Per-post canonical `<link>` |
| JSON-LD | BlogPosting + BreadcrumbList on posts; CollectionPage + WebSite SearchAction on homepage |
| Sitemap | All posts + tag pages with `lastmod` |
| RSS | `/feed.xml` with full post metadata |
| robots.txt | Crawl rules with sitemap reference |
| `<link rel="alternate">` | RSS discovery in `<head>` |

## License

MIT
