---
sidebar_position: 4
title: Configuration
description: Full noxion.config.ts reference.
---

# Configuration

All site-level configuration lives in `noxion.config.ts` at the root of your project. This is the single source of truth that all Noxion packages read from.

---

## Full example

### Single database (blog only)

```ts
import {
  defineConfig,
  createRSSPlugin,
  createAnalyticsPlugin,
  createCommentsPlugin,
} from "@noxion/core";

export default defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  name: "My Blog",
  domain: "myblog.com",
  author: "Jane Doe",
  description: "A blog about web development, tooling, and open source.",
  language: "en",
  defaultTheme: "system",
  revalidate: 3600,
  revalidateSecret: process.env.REVALIDATE_SECRET,
  plugins: [
    createRSSPlugin({ feedPath: "/feed.xml", limit: 20 }),
    createAnalyticsPlugin({ provider: "google", trackingId: process.env.NEXT_PUBLIC_GA_ID }),
  ],
});
```

### Multiple databases (multi-type site)

```ts
import { defineConfig, createRSSPlugin } from "@noxion/core";

export default defineConfig({
  name: "My Site",
  domain: "mysite.com",
  author: "Jane Doe",
  description: "Blog, docs, and portfolio — all powered by Notion.",
  defaultPageType: "blog",
  collections: [
    {
      name: "Blog",
      databaseId: process.env.NOTION_PAGE_ID!,
      pageType: "blog",
    },
    {
      name: "Documentation",
      databaseId: process.env.DOCS_NOTION_ID!,
      pageType: "docs",
      pathPrefix: "docs",
    },
    {
      name: "Portfolio",
      databaseId: process.env.PORTFOLIO_NOTION_ID!,
      pageType: "portfolio",
      pathPrefix: "portfolio",
    },
  ],
  plugins: [createRSSPlugin({ feedPath: "/feed.xml" })],
});
```

---

## Options

### Required

When using single-database mode, you need `rootNotionPageId` plus the site metadata fields. When using multi-database mode, you need `collections` instead.

#### `rootNotionPageId`

**Type:** `string`

The 32-character hex ID of your Notion database page. Used in single-database mode. If `collections` is provided, this is not required.

```ts
rootNotionPageId: process.env.NOTION_PAGE_ID!,
```

See [Notion Setup → Get the page ID](./notion-setup#get-the-page-id) for how to find this value.

#### `name`

**Type:** `string`

Your site's name. Used in:
- `<title>` template: `Page Title | name`
- Open Graph `og:site_name`
- JSON-LD `WebSite.name`
- RSS feed `<title>`

```ts
name: "My Blog",
```

#### `domain`

**Type:** `string`

Your production domain **without protocol**. Used to build absolute URLs for canonical tags, Open Graph, sitemap, RSS, and JSON-LD.

```ts
domain: "myblog.com",
```

#### `author`

**Type:** `string`

The default author name. Used when a page doesn't have its own `Author` property set.

```ts
author: "Jane Doe",
```

#### `description`

**Type:** `string`

The site-level meta description. Keep it under 160 characters for best SEO results.

```ts
description: "A blog about web development, tooling, and open source.",
```

---

### Multi-database options

#### `collections`

**Type:** `NoxionCollection[]`  
**Default:** `undefined`

An array of Notion database configurations. Each collection maps a Notion database to a page type with optional URL prefix and schema overrides.

```ts
interface NoxionCollection {
  name?: string;
  databaseId: string;
  pageType: string;
  pathPrefix?: string;
  schema?: Record<string, string>;
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | — | Display name for the collection |
| `databaseId` | `string` | ✅ | Notion database page ID |
| `pageType` | `string` | ✅ | Page type: `"blog"`, `"docs"`, `"portfolio"`, or a custom type |
| `pathPrefix` | `string` | — | URL prefix (e.g. `"docs"` → `/docs/[slug]`) |
| `schema` | `Record<string, string>` | — | Manual property name mapping overrides |

When `collections` is provided, `rootNotionPageId` is not required. If both are set, `rootNotionPageId` is used to create a default blog collection.

```ts
collections: [
  { databaseId: "abc123...", pageType: "blog" },
  { databaseId: "def456...", pageType: "docs", pathPrefix: "docs" },
],
```

#### `defaultPageType`

**Type:** `string`  
**Default:** `"blog"`

The default page type used when a collection doesn't specify one, or when using single-database mode.

```ts
defaultPageType: "blog",
```

---

### Optional

#### `rootNotionSpaceId`

**Type:** `string | undefined`  
**Default:** `undefined`

The Notion workspace (space) ID. You generally don't need this — it's only required for certain private workspace configurations. If you're having trouble accessing private pages, try setting this alongside `NOTION_TOKEN`.

#### `language`

**Type:** `string`  
**Default:** `"en"`

The [BCP 47 language tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) for your site. Used in `<html lang>`, `og:locale`, and JSON-LD `inLanguage`.

Supported locale mappings: `en` → `en_US`, `ko` → `ko_KR`, `ja` → `ja_JP`, `zh` → `zh_CN`, `de` → `de_DE`, `fr` → `fr_FR`, `es` → `es_ES`.

#### `defaultTheme`

**Type:** `"light" | "dark" | "system"`  
**Default:** `"system"`

The initial color mode for your site.

- `"light"` — always light, ignores OS preference
- `"dark"` — always dark, ignores OS preference  
- `"system"` — follows the user's OS dark/light mode setting

See [Themes](./themes) for customizing colors and the theme toggle.

#### `revalidate`

**Type:** `number`  
**Default:** `3600`

The [ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) revalidation interval in **seconds**.

```ts
revalidate: 3600,    // 1 hour (default)
revalidate: 600,     // 10 minutes — if you publish frequently
revalidate: 86400,   // 24 hours — if you publish rarely
```

For instant updates without waiting for the interval, use [on-demand revalidation](#on-demand-revalidation).

#### `revalidateSecret`

**Type:** `string | undefined`  
**Default:** `undefined`

A secret token required to authenticate on-demand revalidation requests. If not set, the `/api/revalidate` endpoint is disabled.

```ts
revalidateSecret: process.env.REVALIDATE_SECRET,
```

#### `plugins`

**Type:** `PluginConfig[]`  
**Default:** `[]`

An array of plugins to enable. See [Plugins](./plugins/overview) for all available plugins and how to write custom ones.

---

## Environment variables

Environment variables are loaded at build time and override corresponding config values. This is the recommended way to handle secrets (API keys, tokens) that shouldn't be committed to git.

| Variable | Required | Config equivalent | Description |
|----------|----------|-------------------|-------------|
| `NOTION_PAGE_ID` | ✅ | `rootNotionPageId` | Root Notion database page ID |
| `NOTION_TOKEN` | — | *(no config equivalent)* | Integration token for private pages |
| `DOCS_NOTION_ID` | — | `collections[].databaseId` | Docs database page ID (multi-type sites) |
| `PORTFOLIO_NOTION_ID` | — | `collections[].databaseId` | Portfolio database page ID (multi-type sites) |
| `SITE_NAME` | — | `name` | Overrides the `name` config option |
| `SITE_DOMAIN` | — | `domain` | Overrides the `domain` config option |
| `SITE_AUTHOR` | — | `author` | Overrides the `author` config option |
| `SITE_DESCRIPTION` | — | `description` | Overrides the `description` config option |
| `REVALIDATE_SECRET` | — | `revalidateSecret` | Secret for on-demand ISR revalidation |
| `NOTION_WEBHOOK_SECRET` | — | *(no config equivalent)* | Notion webhook verification token for auto-publish ([setup guide](./auto-publish)) |
| `NEXT_PUBLIC_GA_ID` | — | *(plugin option)* | Google Analytics tracking ID |
| `NOXION_DOWNLOAD_IMAGES` | — | *(no config equivalent)* | Set `"true"` to download images at build time |

:::note NEXT_PUBLIC_ prefix
Variables prefixed with `NEXT_PUBLIC_` are embedded into the **client-side bundle** at build time and are visible to the browser. Use this prefix only for non-secret values like analytics IDs.
:::

---

## On-demand revalidation

By default, Noxion re-fetches content from Notion every `revalidate` seconds. On-demand revalidation lets you trigger an immediate cache refresh — useful when you publish or update a page and want it to appear instantly.

### Setup

1. Set `REVALIDATE_SECRET` in your environment variables
2. The generated app already includes the `/api/revalidate` route handler

### Usage

```bash
# Revalidate a specific page
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/my-post-slug"

# Revalidate the homepage
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/"

# Revalidate a docs page
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/docs/getting-started"
```

### Automating with Notion

You can trigger revalidation from a Notion automation or webhook. Alternatively, use a simple cron job (e.g., GitHub Actions scheduled workflow) to ping the revalidation endpoint every 5 minutes:

```yaml
# .github/workflows/revalidate.yml
name: Revalidate Noxion Cache
on:
  schedule:
    - cron: '*/5 * * * *'
jobs:
  revalidate:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger revalidation
        run: |
          curl -X POST "${{ secrets.SITE_URL }}/api/revalidate?secret=${{ secrets.REVALIDATE_SECRET }}&path=/"
```

---

## Config loading order

When your app starts, configuration is loaded in the following priority order (higher priority wins):

1. **Environment variables** — `SITE_NAME`, `SITE_DOMAIN`, etc.
2. **`noxion.config.ts`** — your explicit config
3. **Built-in defaults** — `language: "en"`, `revalidate: 3600`, `defaultTheme: "system"`, `defaultPageType: "blog"`, `plugins: []`

This means you can deploy the same codebase to multiple environments (staging, production) by setting different environment variables without changing `noxion.config.ts`.
