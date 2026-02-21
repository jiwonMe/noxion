---
sidebar_position: 4
title: Configuration
description: Full noxion.config.ts reference.
---

# Configuration

All configuration lives in `noxion.config.ts` at the root of your project.

## Full example

```ts
import {
  defineConfig,
  createRSSPlugin,
  createAnalyticsPlugin,
  createCommentsPlugin,
} from "@noxion/core";

export default defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  rootNotionSpaceId: process.env.NOTION_SPACE_ID,

  name: "My Blog",
  domain: "myblog.com",
  author: "Your Name",
  description: "A blog about things I find interesting",
  language: "ko",           // Used for <html lang> and og:locale
  defaultTheme: "system",   // "light" | "dark" | "system"
  revalidate: 3600,         // ISR revalidation interval in seconds
  revalidateSecret: process.env.REVALIDATE_SECRET,

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

## Options

### Required

| Option | Type | Description |
|--------|------|-------------|
| `rootNotionPageId` | `string` | Root Notion database page ID |
| `name` | `string` | Site name |
| `domain` | `string` | Production domain (no protocol) |
| `author` | `string` | Default author name |
| `description` | `string` | Site description |

### Optional

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rootNotionSpaceId` | `string` | — | Notion workspace ID |
| `language` | `string` | `"en"` | Site language code |
| `defaultTheme` | `ThemeMode` | `"system"` | Default color scheme |
| `revalidate` | `number` | `3600` | ISR interval in seconds |
| `revalidateSecret` | `string` | — | On-demand revalidation secret |
| `plugins` | `PluginConfig[]` | `[]` | Plugins to enable |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NOTION_PAGE_ID` | ✅ | Root Notion database page ID |
| `NOTION_TOKEN` | — | Integration token (private pages) |
| `SITE_NAME` | — | Overrides `name` in config |
| `SITE_DOMAIN` | — | Overrides `domain` in config |
| `SITE_AUTHOR` | — | Overrides `author` in config |
| `SITE_DESCRIPTION` | — | Overrides `description` in config |
| `REVALIDATE_SECRET` | — | Secret for on-demand revalidation |
| `NEXT_PUBLIC_GA_ID` | — | Google Analytics tracking ID |
| `NEXT_PUBLIC_GISCUS_REPO` | — | Giscus GitHub repo |
| `NOXION_DOWNLOAD_IMAGES` | — | `"true"` to download images at build time |
