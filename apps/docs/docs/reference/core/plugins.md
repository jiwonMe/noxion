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

import type { NoxionPlugin, PluginFactory, PluginConfig } from "@noxion/core";
```

---

## `definePlugin()`

Creates a type-safe `NoxionPlugin` object. Optional — you can pass a plain object matching the `NoxionPlugin` interface — but it provides TypeScript type inference for all hook parameters.

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
    return posts.filter(post => !post.metadata.tags?.includes("private"));
  },

  injectHead({ post, config }) {
    if (!post) return [];
    return [{
      tagName: "meta",
      attributes: { name: "author", content: post.metadata.author ?? config.author },
    }];
  },
});
```

---

## `NoxionPlugin` interface

```ts
interface NoxionPlugin<Content = unknown> {
  name: string;

  // Configuration validation
  configSchema?: {
    validate(opts: unknown): { valid: boolean; errors?: string[] };
  };

  // Data hooks
  loadContent?: () => Promise<Content> | Content;
  contentLoaded?: (args: { content: Content; actions: PluginActions }) => Promise<void> | void;
  allContentLoaded?: (args: { allContent: AllContent; actions: PluginActions }) => Promise<void> | void;

  // Build lifecycle
  onBuildStart?: (args: { config: NoxionConfig }) => Promise<void> | void;
  postBuild?: (args: { config: NoxionConfig; routes: RouteInfo[] }) => Promise<void> | void;

  // Content transformation
  transformContent?: (args: { recordMap: ExtendedRecordMap; post: NoxionPage }) => ExtendedRecordMap;
  transformPosts?: (args: { posts: BlogPost[] }) => BlogPost[];

  // SEO / metadata
  extendMetadata?: (args: { metadata: NoxionMetadata; post?: NoxionPage; config: NoxionConfig }) => NoxionMetadata;
  injectHead?: (args: { post?: NoxionPage; config: NoxionConfig }) => HeadTag[];
  extendSitemap?: (args: { entries: SitemapEntry[]; config: NoxionConfig }) => SitemapEntry[];

  // Routing
  extendRoutes?: (args: { routes: RouteInfo[]; config: NoxionConfig }) => RouteInfo[];

  // v0.2 hooks
  registerPageTypes?: (args: { registry: PageTypeRegistry }) => void;
  onRouteResolve?: (args: { page: NoxionPage; defaultUrl: string }) => string;
  extendSlots?: (slots: Record<string, string>) => Record<string, string>;
}
```

### Hooks reference

#### `transformPosts`

**Called**: After all posts are fetched from Notion, before ISR caching.

**Use for**: Filtering posts, computing derived fields (word count, reading time), sorting overrides.

```ts
transformPosts({ posts }) {
  return posts.map(post => ({
    ...post,
    frontmatter: {
      ...post.frontmatter,
      readingTime: estimateReadingTime(post),
    },
  }));
}
```

#### `registerPageTypes`

**Called**: During plugin initialization.

**Use for**: Registering custom page types beyond the built-in blog, docs, and portfolio.

```ts
registerPageTypes({ registry }) {
  registry.register({
    name: "recipe",
    label: "Recipe",
    defaultTemplate: "recipe/page",
    schemaConventions: {
      ingredients: "Ingredients",
      prepTime: "Prep Time",
    },
  });
}
```

#### `onRouteResolve`

**Called**: When generating a URL for a page.

**Use for**: Customizing URL patterns per page type.

```ts
onRouteResolve({ page, defaultUrl }) {
  if (page.pageType === "recipe") {
    return `/recipes/${page.slug}`;
  }
  return defaultUrl;
}
```

#### `extendSlots`

**Called**: When rendering page templates.

**Use for**: Injecting content into named template slots.

```ts
extendSlots(slots) {
  return {
    ...slots,
    readingTimeDisplay: "📖 {{readingTime}}",
  };
}
```

#### `configSchema`

**Checked**: During `loadPlugins()` when validating plugin options.

```ts
configSchema: {
  validate(opts: unknown) {
    const errors: string[] = [];
    if (typeof opts !== "object" || opts === null) {
      return { valid: false, errors: ["Options must be an object"] };
    }
    return { valid: errors.length === 0, errors };
  },
},
```

#### `transformContent`

**Called**: Before a page's `recordMap` is passed to `<NotionPage>`.

#### `injectHead`

**Called**: When generating `<head>` tags for a page. `post` is `undefined` on the homepage and tag pages.

#### `extendMetadata`

**Called**: When generating Next.js `Metadata` for a page.

#### `extendSitemap`

**Called**: When generating sitemap entries.

---

## `PluginFactory` type

```ts
type PluginFactory<T = unknown> = (options?: T) => NoxionPlugin;
```

Recommended pattern for configurable plugins:

```ts
export const createMyPlugin: PluginFactory<MyOptions> = (options = {}) => {
  return {
    name: "my-plugin",
    configSchema: { validate(opts) { /* ... */ } },
    transformPosts({ posts }) { /* ... */ },
  };
};
```

---

## `HeadTag` type

```ts
interface HeadTag {
  tagName: string;
  attributes?: Record<string, string>;
  innerHTML?: string;
}
```

---

## `SitemapEntry` type

```ts
interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}
```

---

## Built-in plugin factories

### `createAnalyticsPlugin()`

```ts
createAnalyticsPlugin({
  provider: "google" | "plausible" | "umami" | "custom",
  trackingId: string,
  customScript?: string,
})
```

See [Analytics Plugin](../../learn/plugins/analytics).

### `createRSSPlugin()`

```ts
createRSSPlugin({
  feedPath?: string,   // default: "/feed.xml"
  limit?: number,      // default: 20
})
```

See [RSS Plugin](../../learn/plugins/rss).

### `createCommentsPlugin()`

```ts
createCommentsPlugin({
  provider: "giscus" | "utterances" | "disqus",
  config: { /* provider-specific options */ },
})
```

See [Comments Plugin](../../learn/plugins/comments).
