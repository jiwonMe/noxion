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

Creates a type-safe plugin **factory**. It is an identity helper used for better TypeScript inference.

### Signature

```ts
function definePlugin<Options = unknown, Content = unknown>(
  factory: PluginFactory<Options, Content>
): PluginFactory<Options, Content>
```

### Example

```ts
import { definePlugin } from "@noxion/core";

const createMyPlugin = definePlugin<{ hideTag?: string }>((options) => {
  return {
    name: "my-plugin",

    transformPosts({ posts }) {
      const hideTag = options.hideTag ?? "private";
      return posts.filter((post) => !post.metadata.tags?.includes(hideTag));
    },
  };
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
  transformContent?: (args: { recordMap: ExtendedRecordMap; post: BlogPost }) => ExtendedRecordMap;
  transformPosts?: (args: { posts: BlogPost[] }) => BlogPost[];

  // SEO / metadata
  extendMetadata?: (args: { metadata: NoxionMetadata; post?: BlogPost; config: NoxionConfig }) => NoxionMetadata;
  injectHead?: (args: { post?: BlogPost; config: NoxionConfig }) => HeadTag[];
  extendSitemap?: (args: { entries: SitemapEntry[]; config: NoxionConfig }) => SitemapEntry[];

  // Routing
  extendRoutes?: (args: { routes: RouteInfo[]; config: NoxionConfig }) => RouteInfo[];

  // v0.2 hooks
  registerPageTypes?: () => PageTypeDefinition[];
  onRouteResolve?: (route: RouteInfo) => RouteInfo | null;

  /** @deprecated */
  extendSlots?: (slots: Record<string, unknown>) => Record<string, unknown>;
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
registerPageTypes() {
  return [{
    name: "recipe",
    defaultTemplate: "recipe/page",
    schemaConventions: {
      ingredients: { names: ["Ingredients"] },
      prepTime: { names: ["Prep Time"] },
    },
  }];
}
```

#### `onRouteResolve`

**Called**: When generating a URL for a page.

**Use for**: Customizing URL patterns per page type.

```ts
onRouteResolve(route) {
  if (route.path.startsWith("/recipe/")) {
    return { ...route, path: route.path.replace("/recipe/", "/recipes/") };
  }
  return route;
}
```

#### `extendSlots`

**Called**: Legacy hook from the pre-v0.3 theme-slot model.

**Use for**: Backward compatibility only. New themes should expose components directly and be composed in app code.

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
type PluginFactory<Options = unknown, Content = unknown> = (
  options: Options
) => NoxionPlugin<Content>;
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
