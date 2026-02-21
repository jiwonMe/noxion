---
sidebar_position: 4
title: Configuration
description: Full noxion.config.ts reference.
---

# Configuration

All site-level configuration lives in `noxion.config.ts` at the root of your project. This is the single source of truth that all Noxion packages read from.

---

## Full example

```ts
import {
  defineConfig,
  createRSSPlugin,
  createAnalyticsPlugin,
  createCommentsPlugin,
} from "@noxion/core";

export default defineConfig({
  // --- Required ---
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  name: "My Blog",
  domain: "myblog.com",
  author: "Jane Doe",
  description: "A blog about web development, tooling, and open source.",

  // --- Optional ---
  rootNotionSpaceId: process.env.NOTION_SPACE_ID, // workspace ID (rarely needed)
  language: "en",              // <html lang>, og:locale
  defaultTheme: "system",      // "light" | "dark" | "system"
  revalidate: 3600,            // ISR revalidation interval in seconds
  revalidateSecret: process.env.REVALIDATE_SECRET, // for on-demand revalidation

  // --- Plugins ---
  plugins: [
    createRSSPlugin({
      feedPath: "/feed.xml",
      limit: 20,
    }),
    createAnalyticsPlugin({
      provider: "google",
      trackingId: process.env.NEXT_PUBLIC_GA_ID,
    }),
    createCommentsPlugin({
      provider: "giscus",
      config: {
        repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
        repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
        category: "Announcements",
        categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      },
    }),
  ],
});
```

---

## Options

### Required

These five options are required. The build will fail without them.

#### `rootNotionPageId`

**Type:** `string`

The 32-character hex ID of your Notion database page. This is the starting point for all data fetching — Noxion calls this page, enumerates all views, and collects all child page blocks.

```ts
rootNotionPageId: process.env.NOTION_PAGE_ID!,
// e.g. "abc123def456789012345678901234"
```

See [Notion Setup → Get the page ID](./notion-setup#get-the-page-id) for how to find this value.

#### `name`

**Type:** `string`

Your blog's name. Used in:
- `<title>` template: `Post Title | name`
- Open Graph `og:site_name`
- JSON-LD `WebSite.name`
- RSS feed `<title>`

```ts
name: "My Blog",
```

#### `domain`

**Type:** `string`

Your production domain **without protocol**. Used to build absolute URLs for:
- Canonical `<link>` tags
- Open Graph `og:url`
- Sitemap `<loc>` entries
- RSS feed `<link>`
- JSON-LD `@id` fields

```ts
domain: "myblog.com",
// NOT "https://myblog.com" — no protocol
```

#### `author`

**Type:** `string`

The default author name. Used when a post doesn't have its own `Author` property set.

```ts
author: "Jane Doe",
```

#### `description`

**Type:** `string`

The site-level meta description. Used in:
- Homepage `<meta name="description">`
- RSS feed `<description>`
- JSON-LD `WebSite.description`

Keep it under 160 characters for best SEO results.

```ts
description: "A blog about web development, tooling, and open source.",
```

---

### Optional

#### `rootNotionSpaceId`

**Type:** `string | undefined`  
**Default:** `undefined`

The Notion workspace (space) ID. You generally don't need this — it's only required for certain private workspace configurations. If you're having trouble accessing private pages, try setting this alongside `NOTION_TOKEN`.

```ts
rootNotionSpaceId: process.env.NOTION_SPACE_ID,
```

#### `language`

**Type:** `string`  
**Default:** `"en"`

The [BCP 47 language tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) for your site. Used in:
- `<html lang="...">` attribute
- `og:locale` (converted to locale format, e.g. `"en"` → `"en_US"`, `"ko"` → `"ko_KR"`)
- JSON-LD `inLanguage`

```ts
language: "ko",  // Korean
language: "ja",  // Japanese
language: "en",  // English (default)
```

Supported locale mappings: `en` → `en_US`, `ko` → `ko_KR`, `ja` → `ja_JP`, `zh` → `zh_CN`, `de` → `de_DE`, `fr` → `fr_FR`, `es` → `es_ES`.

#### `defaultTheme`

**Type:** `"light" | "dark" | "system"`  
**Default:** `"system"`

The initial color mode for your blog.

- `"light"` — always light, ignores OS preference
- `"dark"` — always dark, ignores OS preference  
- `"system"` — follows the user's OS dark/light mode setting via [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

```ts
defaultTheme: "system",
```

See [Themes](./themes) for customizing colors and the theme toggle.

#### `revalidate`

**Type:** `number`  
**Default:** `3600`

The [ISR (Incremental Static Regeneration)](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) revalidation interval in **seconds**. After this interval, the next request triggers a background re-fetch from Notion, and subsequent requests get the updated content.

```ts
revalidate: 3600,    // 1 hour (default) — good for most blogs
revalidate: 600,     // 10 minutes — if you publish frequently
revalidate: 86400,   // 24 hours — if you publish rarely
revalidate: false,   // Never revalidate (static-only, requires manual redeploy)
```

For instant updates without waiting for the interval, use [on-demand revalidation](#on-demand-revalidation).

#### `revalidateSecret`

**Type:** `string | undefined`  
**Default:** `undefined`

A secret token required to authenticate [on-demand revalidation](#on-demand-revalidation) requests. If not set, the `/api/revalidate` endpoint is disabled.

```ts
revalidateSecret: process.env.REVALIDATE_SECRET,
```

Generate a strong random secret:
```bash
openssl rand -hex 32
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
| `SITE_NAME` | — | `name` | Overrides the `name` config option |
| `SITE_DOMAIN` | — | `domain` | Overrides the `domain` config option |
| `SITE_AUTHOR` | — | `author` | Overrides the `author` config option |
| `SITE_DESCRIPTION` | — | `description` | Overrides the `description` config option |
| `REVALIDATE_SECRET` | — | `revalidateSecret` | Secret for on-demand ISR revalidation |
| `NEXT_PUBLIC_GA_ID` | — | *(plugin option)* | Google Analytics tracking ID (e.g. `G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_GISCUS_REPO` | — | *(plugin option)* | Giscus GitHub repo (e.g. `owner/repo`) |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | — | *(plugin option)* | Giscus repo ID (`R_xxx`) |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | — | *(plugin option)* | Giscus category ID (`DIC_xxx`) |
| `NOXION_DOWNLOAD_IMAGES` | — | *(no config equivalent)* | Set `"true"` to download images at build time |

:::note NEXT_PUBLIC_ prefix
Variables prefixed with `NEXT_PUBLIC_` are embedded into the **client-side bundle** at build time and are visible to the browser. Use this prefix only for non-secret values like analytics IDs. See [Next.js environment variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables) for details.
:::

---

## On-demand revalidation

By default, Noxion re-fetches content from Notion every `revalidate` seconds. On-demand revalidation lets you trigger an immediate cache refresh — useful when you publish or update a post and want it to appear instantly.

### Setup

1. Set `REVALIDATE_SECRET` in your environment variables
2. The generated app already includes the `/api/revalidate` route handler

### Usage

```bash
# Revalidate a specific post
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/my-post-slug"

# Revalidate the homepage
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/"

# Revalidate all tag pages
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/tag/react"
```

### Automating with Notion

You can trigger revalidation from a Notion automation or webhook. For example, create a Notion automation that calls your revalidation endpoint when a post's `Public` checkbox is checked.

Alternatively, use a simple cron job (e.g., GitHub Actions scheduled workflow) to ping the revalidation endpoint every 5 minutes if you want near-realtime updates without lowering `revalidate`.

```yaml
# .github/workflows/revalidate.yml
name: Revalidate Noxion Cache
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
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
3. **Built-in defaults** — `language: "en"`, `revalidate: 3600`, `defaultTheme: "system"`, `plugins: []`

This means you can deploy the same codebase to multiple environments (staging, production) by setting different environment variables without changing `noxion.config.ts`.
