---
title: create-noxion
description: CLI scaffolding tool for creating a new Noxion blog project
---

# `create-noxion`

Scaffolds a new, fully-configured Noxion blog project. Generates a Next.js 16 App Router app with all Noxion packages wired together, including SEO utilities, ISR, image optimization, and optional plugins.

---

## Usage

### With Bun (recommended)

```bash
bun create noxion [project-name] [flags]
```

Bun's `create` command resolves the `create-noxion` npm package automatically, so no global installation is needed.

### With npm/npx

```bash
npx create-noxion [project-name] [flags]
```

### With pnpm

```bash
pnpm create noxion [project-name] [flags]
```

---

## Interactive mode

Running without flags launches the interactive setup wizard:

```bash
bun create noxion my-blog
```

```
✔ Project name: my-blog
✔ Notion database page ID: abc123def456...
✔ Site name: My Blog
✔ Site description: A blog about web development
✔ Author name: Jane Doe
✔ Production domain: myblog.com

✨ Creating Noxion blog in ./my-blog...
✔ Installed dependencies
✔ Created .env.example

  Next steps:
    cd my-blog
    cp .env.example .env
    bun run dev
```

### Prompt descriptions

| Prompt | Example | Required | Notes |
|--------|---------|----------|-------|
| Project name | `my-blog` | ✅ | Becomes the folder name. |
| Notion page ID | `abc123def456` | ✅ | 32-char hex ID from your Notion database URL. |
| Site name | `My Blog` | ✅ | Used in `<title>`, OG metadata, RSS. |
| Description | `A blog about...` | ✅ | Used in `<meta description>`. Keep under 160 chars. |
| Author | `Jane Doe` | ✅ | Default author for posts. |
| Domain | `myblog.com` | ✅ | Production domain, no protocol. Used for canonical URLs. |

---

## Non-interactive mode (CI/CD)

Use `--yes` with all flags to skip prompts:

```bash
bun create noxion my-blog \
  --yes \
  --notion-id=abc123def456 \
  --name="My Blog" \
  --description="A blog about web development" \
  --author="Jane Doe" \
  --domain=myblog.com
```

### Flags

| Flag | Type | Required | Description |
|------|------|----------|-------------|
| `--yes` | boolean | — | Skip all interactive prompts. Requires all other flags to be set. |
| `--notion-id=<id>` | string | ✅ (with `--yes`) | Notion database page ID |
| `--name=<name>` | string | ✅ (with `--yes`) | Site name |
| `--description=<desc>` | string | ✅ (with `--yes`) | Site description |
| `--author=<name>` | string | ✅ (with `--yes`) | Author name |
| `--domain=<domain>` | string | ✅ (with `--yes`) | Production domain (no protocol) |

---

## Generated project structure

```
my-blog/
│
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout: ThemeProvider, fonts, global metadata
│   ├── page.tsx                    # Homepage: PostList + JSON-LD WebSite/CollectionPage
│   ├── [slug]/
│   │   └── page.tsx                # Post detail: NotionPage + JSON-LD BlogPosting + ISR
│   ├── tag/
│   │   └── [tag]/
│   │       └── page.tsx            # Tag filter page: filtered PostList
│   ├── feed.xml/
│   │   └── route.ts                # RSS 2.0 feed (enabled by RSS plugin)
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts            # On-demand ISR revalidation endpoint
│   ├── sitemap.ts                  # XML sitemap generation
│   └── robots.ts                   # robots.txt generation
│
├── lib/
│   ├── config.ts                   # Loads noxion.config.ts with env var overrides
│   └── notion.ts                   # Notion client + getAllPosts() + getPostBySlug()
│
├── public/                         # Static assets
│   └── images/                     # (created by NOXION_DOWNLOAD_IMAGES=true)
│
├── noxion.config.ts                # Your site configuration
├── next.config.ts                  # Next.js config (image domains, standalone output)
├── tsconfig.json                   # TypeScript config
├── .env.example                    # Environment variable template
├── .gitignore                      # Pre-configured: .env, .next, node_modules
├── Dockerfile                      # Multi-stage production Docker build
├── docker-compose.yml              # Docker Compose config
└── package.json                    # Dependencies: @noxion/core, @noxion/renderer, @noxion/adapter-nextjs
```

### Key file explanations

**`app/layout.tsx`**

Sets up the root layout with:
- `<NoxionThemeProvider>` wrapping all content
- `<ThemeScript>` in `<head>` for FOUC prevention
- Site-level `Metadata` from `generateNoxionListMetadata()`
- Global CSS and font loading

**`app/page.tsx`**

Homepage component:
- Fetches all published posts with `getAllPosts()`
- Renders `<PostList posts={...} />`
- Injects `WebSite` and `CollectionPage` JSON-LD
- `export const revalidate = config.revalidate` for ISR

**`app/[slug]/page.tsx`**

Post detail component:
- `generateStaticParams()` pre-renders all posts at build time
- `generateMetadata()` generates per-post Open Graph / Twitter metadata
- Fetches post data and page blocks
- Renders `<NotionPage recordMap={...} />`
- Injects `BlogPosting` and `BreadcrumbList` JSON-LD

**`lib/notion.ts`**

```ts
import { cache } from "react";
import { createNotionClient, fetchBlogPosts, fetchPostBySlug, fetchPage } from "@noxion/core";
import { siteConfig } from "./config";

export const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN,
});

export const getAllPosts = cache(async () => {
  return fetchBlogPosts(notion, siteConfig.rootNotionPageId);
});

export const getPostBySlug = cache(async (slug: string) => {
  return fetchPostBySlug(notion, siteConfig.rootNotionPageId, slug);
});

export const getPageData = cache(async (pageId: string) => {
  return fetchPage(notion, pageId);
});
```

The [`cache()`](https://react.dev/reference/react/cache) wrapper deduplicates requests within a single render cycle — if multiple Server Components call `getAllPosts()` in the same render, only one Notion API call is made.

---

## After scaffolding

```bash
cd my-blog
cp .env.example .env
# Edit .env: add NOTION_PAGE_ID and any other variables

bun install   # Install dependencies (create-noxion may do this automatically)
bun run dev   # Start development server at http://localhost:3000
```

### Verify setup

1. Open http://localhost:3000 — your Notion posts should appear
2. Click a post — it should render the full Notion content
3. Check http://localhost:3000/feed.xml — the RSS feed (if RSS plugin is configured)
4. Check http://localhost:3000/sitemap.xml — the XML sitemap

If posts don't appear, see [Quick Start → Verify it's working](../../learn/quick-start#verify-its-working) for troubleshooting.
