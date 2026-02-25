---
title: create-noxion
description: CLI scaffolding tool for creating Noxion projects (blog/docs/portfolio/full)
---

# `create-noxion`

Scaffolds a new Noxion project. Supports site templates (`blog`, `docs`, `portfolio`, `full`) plus plugin/theme starter scaffolds.

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
✔ Project template: Blog
✔ Notion database page ID: abc123def456...
✔ Site name: My Blog
✔ Site description: A blog about web development
✔ Author: Jane Doe
✔ Production domain: myblog.com

✔ Created 20+ files

  Next steps:
    cd my-blog
    bun install
    bun run dev
```

### Prompt descriptions

| Prompt | Example | Required | Notes |
|--------|---------|----------|-------|
| Project name | `my-blog` | ✅ | Becomes the folder name. |
| Project template | `blog` | ✅ | One of `blog`, `docs`, `portfolio`, `full`. |
| Notion page ID | `abc123def456` | ✅ | 32-char hex ID from your Notion database URL. |
| Site name | `My Blog` | ✅ | Used in `<title>`, OG metadata, RSS. |
| Description | `A blog about...` | ✅ | Used in `<meta description>`. Keep under 160 chars. |
| Author | `Jane Doe` | ✅ | Default author for posts. |
| Domain | `myblog.com` | ✅ | Production domain, no protocol. Used for canonical URLs. |

---

## Non-interactive mode (CI/CD)

Use `--yes` to skip prompts:

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
| `--yes` | boolean | — | Skip interactive prompts and use defaults for omitted values. |
| `--template=<type>` | string | — | `blog`, `docs`, `portfolio`, or `full` |
| `--notion-id=<id>` | string | Recommended | Primary Notion database page ID |
| `--docs-notion-id=<id>` | string | — | Docs database ID (used by `full` template) |
| `--portfolio-notion-id=<id>` | string | — | Portfolio database ID (used by `full` template) |
| `--name=<name>` | string | — | Site name |
| `--description=<desc>` | string | — | Site description |
| `--author=<name>` | string | — | Author name |
| `--domain=<domain>` | string | — | Production domain (no protocol) |

---

## Generated project structure

```
my-blog/
│
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout: ThemeScript, SiteLayout, global metadata
│   ├── page.tsx                    # Homepage data fetch + post list composition
│   ├── [slug]/
│   │   └── page.tsx                # Post detail: NotionPage + BlogPosting JSON-LD + ISR
│   ├── tag/
│   │   └── [tag]/
│   │       └── page.tsx            # Tag filter page: filtered PostList
│   ├── api/
│   │   ├── revalidate/
│   │       └── route.ts            # On-demand ISR revalidation endpoint
│   │   └── notion-webhook/
│   │       └── route.ts            # Notion integration webhook endpoint
│   ├── sitemap.ts                  # XML sitemap generation
│   └── robots.ts                   # robots.txt generation
│
├── lib/
│   ├── config.ts                   # Loads and validates noxion.config.ts
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
- `<ThemeScript>` in `<head>` for FOUC prevention
- Direct theme component imports (no provider needed)
- Site-level `Metadata` from `generateNoxionListMetadata()`
- Global CSS and font loading

**`app/page.tsx`**

Homepage component:
- Fetches all published posts with `getAllPosts()`
- Renders `<PostList posts={...} />`
- `export const revalidate = config.revalidate` for ISR

**`app/[slug]/page.tsx`**

Post detail component:
- `generateStaticParams()` pre-renders all posts at build time
- `generateMetadata()` generates per-post Open Graph / Twitter metadata
- Fetches post data and page blocks
- Renders `<NotionPage recordMap={...} />`
- Injects `BlogPosting` JSON-LD

**`lib/notion.ts`**

`lib/notion.ts` exports async helpers (`getAllPosts`, `getPostBySlug`, `getPageRecordMap`, `getAllTags`) built on top of `createNotionClient`, `fetchBlogPosts`, `fetchPostBySlug`, and `fetchPage`.

---

## After scaffolding

```bash
cd my-blog
# Edit .env: verify NOTION_PAGE_ID and other variables

bun install
bun run dev   # Start development server at http://localhost:3000
```

### Verify setup

1. Open http://localhost:3000 — your Notion posts should appear
2. Click a post — it should render the full Notion content
3. (Optional) If you enabled RSS, check http://localhost:3000/feed.xml
4. Check http://localhost:3000/sitemap.xml — the XML sitemap

If posts don't appear, see [Quick Start → Verify it's working](../../learn/quick-start#verify-its-working) for troubleshooting.
