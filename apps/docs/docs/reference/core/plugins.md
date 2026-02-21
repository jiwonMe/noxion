---
title: Plugin System
description: "@noxion/core plugin API — lifecycle hooks, built-in factories, and custom plugins"
---

# Plugin System API

```ts
import {
  definePlugin,
  createAnalyticsPlugin,
  createRSSPlugin,
  createCommentsPlugin,
} from "@noxion/core";
```

---

## `definePlugin()`

Creates a type-safe `NoxionPlugin` object. The `definePlugin()` wrapper is optional — you can pass a plain object matching the `NoxionPlugin` interface — but it provides TypeScript type inference for all hook parameters.

### Signature

```ts
function definePlugin<Content = unknown>(
  plugin: NoxionPlugin<Content>
): NoxionPlugin<Content>
```

### Example

```ts
import { definePlugin } from "@noxion/core";

const myPlugin = definePlugin({
  name: "my-plugin",

  transformPosts({ posts }) {
    // Filter out posts with a specific tag
    return posts.filter(post => !post.tags.includes("private"));
  },

  injectHead({ post, config }) {
    if (!post) return [];
    return [{
      tagName: "meta",
      attributes: { name: "author", content: post.author ?? config.author },
    }];
  },
});
```

---

## `NoxionPlugin` interface

```ts
interface NoxionPlugin<Content = unknown> {
  name: string;

  // Data hooks
  loadContent?: () => Promise<Content> | Content;
  contentLoaded?: (args: { content: Content; actions: PluginActions }) => Promise<void> | void;
  allContentLoaded?: (args: { allContent: AllContent; actions: PluginActions }) => Promise<void> | void;

  // Build lifecycle
  onBuildStart?: (args: { config: NoxionConfig }) => Promise<void> | void;
  postBuild?: (args: { config: NoxionConfig; routes: RouteInfo[] }) => Promise<void> | void;

  // Content transformation
  transformContent?: (args: { recordMap: ExtendedRecordMap; post: BlogPost }) => ExtendedRecordMap;
  transformPosts?: (args: { posts: BlogPost[] }) => BlogPost[];

  // SEO / metadata
  extendMetadata?: (args: { metadata: NoxionMetadata; post?: BlogPost; config: NoxionConfig }) => NoxionMetadata;
  injectHead?: (args: { post?: BlogPost; config: NoxionConfig }) => HeadTag[];
  extendSitemap?: (args: { entries: SitemapEntry[]; config: NoxionConfig }) => SitemapEntry[];

  // Routing
  extendRoutes?: (args: { routes: RouteInfo[]; config: NoxionConfig }) => RouteInfo[];
}
```

### Hooks reference

#### `transformPosts`

**Called**: After all posts are fetched from Notion, before ISR caching.

**Use for**: Filtering posts, computing derived fields (word count, reading time), sorting overrides.

```ts
transformPosts({ posts }) {
  return posts
    .filter(post => post.tags.length > 0)  // Only posts with tags
    .map(post => ({
      ...post,
      frontmatter: {
        ...post.frontmatter,
        readingTime: estimateReadingTime(post),
      },
    }));
}
```

#### `transformContent`

**Called**: Before a post page's `recordMap` is passed to `<NotionPage>`.

**Use for**: Modifying block content, injecting custom blocks, removing blocks.

```ts
transformContent({ recordMap, post }) {
  // Example: redact blocks marked as private
  // (Note: this is a simplified example — real block manipulation is more involved)
  return recordMap;
}
```

#### `injectHead`

**Called**: When generating `<head>` tags for a page.

**Use for**: Injecting analytics scripts, custom meta tags, link preloads, font preconnects.

**`post`** is `undefined` on the homepage and tag pages, defined on post pages.

```ts
injectHead({ post, config }) {
  const tags: HeadTag[] = [
    // Always inject
    {
      tagName: "meta",
      attributes: { name: "generator", content: "Noxion" },
    },
  ];

  // Inject only on post pages
  if (post) {
    tags.push({
      tagName: "meta",
      attributes: { property: "article:author", content: post.author ?? config.author },
    });
  }

  return tags;
}
```

#### `extendMetadata`

**Called**: When generating Next.js `Metadata` for a page.

**Use for**: Adding custom OG tags, overriding metadata, adding `<link>` alternates.

```ts
extendMetadata({ metadata, post, config }) {
  return {
    ...metadata,
    other: {
      ...metadata.other,
      "custom-tag": "custom-value",
    },
  };
}
```

#### `extendSitemap`

**Called**: When generating sitemap entries.

**Use for**: Adding custom pages (e.g., `/about`, `/contact`) to the sitemap.

```ts
extendSitemap({ entries, config }) {
  return [
    ...entries,
    {
      url: `https://${config.domain}/about`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.7,
    },
  ];
}
```

#### `loadContent` / `contentLoaded`

For plugins that need to load external data at build time:

```ts
definePlugin({
  name: "github-stats",

  async loadContent() {
    const res = await fetch("https://api.github.com/repos/owner/repo");
    return res.json() as Promise<{ stargazers_count: number }>;
  },

  contentLoaded({ content, actions }) {
    actions.setGlobalData("github-stars", content.stargazers_count);
  },
});
```

---

## `HeadTag` type

```ts
interface HeadTag {
  tagName: string;              // e.g. "meta", "link", "script"
  attributes?: Record<string, string>;  // HTML attributes
  innerHTML?: string;           // For <script> with inline content
}
```

### Examples

```ts
// <meta name="robots" content="noindex">
{ tagName: "meta", attributes: { name: "robots", content: "noindex" } }

// <link rel="preconnect" href="https://fonts.googleapis.com">
{ tagName: "link", attributes: { rel: "preconnect", href: "https://fonts.googleapis.com" } }

// <script>window.myVar = true;</script>
{ tagName: "script", innerHTML: "window.myVar = true;" }

// <script src="..." defer>
{ tagName: "script", attributes: { src: "https://example.com/script.js", defer: "true" } }
```

---

## `SitemapEntry` type

```ts
interface SitemapEntry {
  url: string;
  lastmod?: string;       // ISO 8601 date string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;      // 0.0 to 1.0
}
```

---

## Built-in plugin factories

### `createAnalyticsPlugin()`

```ts
createAnalyticsPlugin({
  provider: "google" | "plausible" | "umami" | "custom",
  trackingId: string,         // Measurement ID, domain, or website ID
  customScript?: string,      // HTML string for "custom" provider
})
```

See [Analytics Plugin](../../learn/plugins/analytics) for full documentation.

### `createRSSPlugin()`

```ts
createRSSPlugin({
  feedPath?: string,   // default: "/feed.xml"
  limit?: number,      // default: 20
})
```

See [RSS Plugin](../../learn/plugins/rss) for full documentation.

### `createCommentsPlugin()`

```ts
// Giscus
createCommentsPlugin({
  provider: "giscus",
  config: {
    repo: string,          // "owner/repo"
    repoId: string,        // "R_xxx"
    category: string,      // Discussion category name
    categoryId: string,    // "DIC_xxx"
    mapping?: string,      // default: "pathname"
    reactionsEnabled?: boolean,  // default: true
    theme?: string,        // default: "preferred_color_scheme"
  },
})

// Utterances
createCommentsPlugin({
  provider: "utterances",
  config: {
    repo: string,
    issueTerm?: string,   // default: "pathname"
    theme?: string,       // default: "github-light"
    label?: string,
  },
})

// Disqus
createCommentsPlugin({
  provider: "disqus",
  config: {
    shortname: string,
  },
})
```

See [Comments Plugin](../../learn/plugins/comments) for full documentation.
