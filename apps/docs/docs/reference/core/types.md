---
title: Types
description: "@noxion/core TypeScript type definitions"
---

# Types

All types exported from `@noxion/core`:

```ts
import type {
  BlogPost,
  NoxionConfig,
  NoxionConfigInput,
  ThemeMode,
  NoxionLayout,
  NoxionPlugin,
  PluginConfig,
  HeadTag,
  SitemapEntry,
  NoxionPageData,
  ExtendedRecordMap,
} from "@noxion/core";
```

---

## `BlogPost`

The normalized representation of a single blog post, produced by `fetchBlogPosts()` and `fetchPostBySlug()`.

```ts
interface BlogPost {
  /** Notion page ID (UUID without hyphens) */
  id: string;

  /** Post title, from the Notion Title property */
  title: string;

  /** URL slug used in the browser path (e.g. "my-first-post") */
  slug: string;

  /**
   * Publication date as an ISO date string (e.g. "2025-02-01").
   * Sourced from the Notion "Published" date property.
   * Empty string if no date is set.
   */
  date: string;

  /** Array of tag strings from the Notion Tags multi-select property */
  tags: string[];

  /** Category from the Notion Category select property, or undefined */
  category?: string;

  /**
   * Cover image URL (notion.so/image/... proxy URL), or undefined.
   * This is the Notion page cover (banner image), not an inline image.
   */
  coverImage?: string;

  /**
   * Post description for SEO meta tags.
   * From the Notion Description text property, or frontmatter override.
   * Truncated at 160 characters by the metadata generator.
   */
  description?: string;

  /** Author name. From Notion Author property or frontmatter. */
  author?: string;

  /**
   * Whether the post is published.
   * True when the Notion "Public" checkbox is checked.
   * fetchBlogPosts() filters out unpublished posts, so this is
   * always true in returned arrays. Included for completeness.
   */
  published: boolean;

  /**
   * ISO datetime string of the last edit time, from Notion's
   * last_edited_time block property.
   * Used for og:article:modified_time and sitemap lastmod.
   */
  lastEditedTime: string;

  /**
   * Raw frontmatter key-value pairs from the first code block.
   * Includes ALL keys, including unknown/custom ones.
   * Known keys are also applied to their respective fields above.
   */
  frontmatter?: Record<string, string>;
}
```

### Accessing custom frontmatter fields

```ts
const post = await getPostBySlug("my-post");

// Custom frontmatter key
const layout = post.frontmatter?.layout;         // e.g. "wide"
const showComments = post.frontmatter?.comments !== "false";
const readingTime = post.frontmatter?.readingTime; // set by a plugin
```

---

## `NoxionConfig`

The fully-resolved configuration object. All optional fields have defaults applied. Read by all Noxion packages.

```ts
interface NoxionConfig {
  /** Root Notion database page ID */
  rootNotionPageId: string;

  /** Notion workspace ID (rarely needed) */
  rootNotionSpaceId?: string;

  /** Site name — used in title, OG, RSS */
  name: string;

  /** Production domain without protocol (e.g. "myblog.com") */
  domain: string;

  /** Default author name */
  author: string;

  /** Site description */
  description: string;

  /** BCP 47 language tag (e.g. "en", "ko", "ja") */
  language: string;

  /** Initial color mode */
  defaultTheme: ThemeMode;

  /** ISR revalidation interval in seconds */
  revalidate: number;

  /** Secret for on-demand revalidation endpoint */
  revalidateSecret?: string;

  /** Enabled plugins */
  plugins?: PluginConfig[];

  /** Advanced theme configuration (reserved) */
  theme?: NoxionThemeConfig;

  /** Layout variant (reserved) */
  layout?: NoxionLayout;

  /** Component overrides (reserved) */
  components?: ComponentOverrides;
}
```

---

## `NoxionConfigInput`

The input type accepted by `defineConfig()`. All optional fields can be omitted.

```ts
interface NoxionConfigInput {
  rootNotionPageId: string;
  rootNotionSpaceId?: string;
  name: string;
  domain: string;
  author: string;
  description: string;
  language?: string;          // default: "en"
  defaultTheme?: ThemeMode;   // default: "system"
  revalidate?: number;        // default: 3600
  revalidateSecret?: string;
  plugins?: PluginConfig[];   // default: []
  theme?: NoxionThemeConfig;
  layout?: NoxionLayout;
  components?: ComponentOverrides;
}
```

---

## `ThemeMode`

```ts
type ThemeMode = "system" | "light" | "dark";
```

| Value | Description |
|-------|-------------|
| `"system"` | Follows OS `prefers-color-scheme` |
| `"light"` | Always light |
| `"dark"` | Always dark |

---

## `NoxionLayout`

```ts
type NoxionLayout = "single-column" | "sidebar-left" | "sidebar-right";
```

Layout variant for the generated app. Currently reserved for future use.

---

## `NoxionPageData`

Combines a `BlogPost` with its `ExtendedRecordMap` for rendering.

```ts
interface NoxionPageData {
  /** Full Notion block data for rendering with @noxion/notion-renderer */
  recordMap: ExtendedRecordMap;

  /** Normalized post metadata */
  post: BlogPost;
}
```

Passed to `onBeforeRender` and `onAfterRender` plugin hooks.

---

## `ExtendedRecordMap`

Re-exported from [`notion-types`](https://www.npmjs.com/package/notion-types). Contains the complete Notion page data:

```ts
import type { ExtendedRecordMap } from "@noxion/core";
// equivalent to:
import type { ExtendedRecordMap } from "notion-types";
```

The type includes:
- `block` — map of block ID → block data
- `collection` — map of collection ID → collection data
- `collection_query` — view query results with block IDs
- `collection_view` — map of view ID → view data
- `notion_user` — user data
- `signed_urls` — Notion image proxy URLs

This type is opaque for most use cases — you pass it directly to `<NotionPage recordMap={...} />` and let `@noxion/notion-renderer` handle rendering.

---

## `PluginConfig`

```ts
type PluginConfig =
  | NoxionPlugin          // Plugin object directly
  | [NoxionPlugin, unknown]  // [plugin, options] tuple
  | false;                // Conditional disable: myPlugin && false
```

The `false` variant allows conditionally disabling plugins:

```ts
plugins: [
  createRSSPlugin({ feedPath: "/feed.xml" }),
  process.env.NODE_ENV === "production" && createAnalyticsPlugin({ ... }),
].filter(Boolean),
```
