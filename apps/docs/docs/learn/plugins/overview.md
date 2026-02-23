---
sidebar_position: 1
title: Plugins Overview
description: Extend Noxion with analytics, RSS, comments, custom page types, and more.
---

# Plugins

Noxion's plugin system lets you extend your site with additional functionality — analytics tracking, RSS feeds, comment systems, custom page types, and anything else you can imagine.

---

## Adding plugins

Plugins are configured in `noxion.config.ts`:

```ts
import {
  defineConfig,
  createRSSPlugin,
  createAnalyticsPlugin,
  createCommentsPlugin,
} from "@noxion/core";

export default defineConfig({
  // ...
  plugins: [
    createRSSPlugin({ feedPath: "/feed.xml", limit: 20 }),
    createAnalyticsPlugin({ provider: "google", trackingId: "G-XXXXXXXXXX" }),
    createCommentsPlugin({
      provider: "giscus",
      config: { repo: "owner/repo", repoId: "R_xxx", category: "General", categoryId: "DIC_xxx" },
    }),
  ],
});
```

Plugins are executed in order. You can include multiple plugins of the same type (e.g., multiple analytics providers).

---

## Built-in plugins

| Plugin | Import | Purpose |
|--------|--------|---------|
| [Analytics](./analytics) | `createAnalyticsPlugin` | Google Analytics, Plausible, Umami page view tracking |
| [RSS](./rss) | `createRSSPlugin` | RSS 2.0 feed at `/feed.xml` |
| [Comments](./comments) | `createCommentsPlugin` | Giscus, Utterances, or Disqus comment system |

---

## Plugin lifecycle hooks

Plugins are objects that implement one or more **lifecycle hooks**. Each hook is called at a specific point in Noxion's rendering pipeline.

### Available hooks

| Hook | When called | Use case |
|------|-------------|----------|
| `transformPosts(args)` | After all posts are fetched | Filter, sort, or augment post data |
| `transformContent(args)` | Before a post is rendered | Modify the Notion block data |
| `injectHead(args)` | When generating `<head>` tags | Add analytics scripts, fonts, custom meta tags |
| `extendMetadata(args)` | When generating Next.js Metadata | Add or override OG/Twitter metadata |
| `extendSitemap(args)` | When generating sitemap entries | Add custom pages to the sitemap |
| `extendRoutes(args)` | When routes are calculated | Add dynamic routes |
| `registerPageTypes(args)` | During initialization | Register custom page types with the PageTypeRegistry |
| `onRouteResolve(args)` | When resolving a page URL | Customize URL generation per page type |
| `extendSlots(args)` | When rendering page templates | Inject content into named template slots |
| `loadContent()` | During build | Load external data |
| `contentLoaded(args)` | After `loadContent()` | Process loaded content |
| `onBuildStart(args)` | At the start of a build | Run setup tasks |
| `postBuild(args)` | After the build completes | Run post-build tasks |

### New in v0.2

The following hooks were added in v0.2:

**`registerPageTypes`** — Register custom page types beyond the built-in blog, docs, and portfolio:

```ts
registerPageTypes({ registry }) {
  registry.register({
    name: "recipe",
    label: "Recipe",
    defaultTemplate: "recipe/page",
    schemaConventions: {
      ingredients: "Ingredients",
      prepTime: "Prep Time",
      cookTime: "Cook Time",
    },
  });
}
```

**`onRouteResolve`** — Customize URL generation for specific page types:

```ts
onRouteResolve({ page, defaultUrl }) {
  if (page.pageType === "recipe") {
    return `/recipes/${page.slug}`;
  }
  return defaultUrl;
}
```

**`extendSlots`** — Inject content into named template slots:

```ts
extendSlots(slots) {
  return {
    ...slots,
    readingTimeDisplay: "📖 {{readingTime}}",
    authorBio: "<p>Custom author bio content</p>",
  };
}
```

### `configSchema`

Plugins can declare a configuration schema for validation. The plugin loader validates user-provided options against this schema during `loadPlugins()`:

```ts
const plugin: NoxionPlugin = {
  name: "my-plugin",
  configSchema: {
    validate(opts: unknown) {
      const errors: string[] = [];
      if (typeof opts !== "object" || opts === null) {
        return { valid: false, errors: ["Options must be an object"] };
      }
      const o = opts as Record<string, unknown>;
      if ("apiKey" in o && typeof o.apiKey !== "string") {
        errors.push("apiKey must be a string");
      }
      return { valid: errors.length === 0, errors };
    },
  },
  // ...hooks
};
```

---

## Writing a custom plugin

Use `definePlugin()` from `@noxion/core` for type-safe plugin creation:

```ts
import { definePlugin } from "@noxion/core";

export const readingTimePlugin = definePlugin({
  name: "reading-time",

  transformPosts({ posts }) {
    return posts.map((post) => ({
      ...post,
      frontmatter: {
        ...post.frontmatter,
        readingTime: `${Math.ceil((post.description?.split(" ").length ?? 100) / 200)} min read`,
      },
    }));
  },
});
```

### Plugin factory pattern (recommended)

If your plugin needs configuration options, use the factory pattern with `PluginFactory`:

```ts
import type { NoxionPlugin, PluginFactory } from "@noxion/core";

interface MyPluginOptions {
  apiKey: string;
  enabled?: boolean;
}

export const createMyPlugin: PluginFactory<MyPluginOptions> = (options = {}) => {
  const plugin: NoxionPlugin = {
    name: "my-plugin",
    configSchema: {
      validate(opts: unknown) { /* ... */ },
    },
    transformPosts({ posts }) {
      if (!options.enabled) return posts;
      // transform posts...
      return posts;
    },
  };
  return plugin;
};
```

Usage:

```ts
plugins: [
  createMyPlugin({ apiKey: "xxx", enabled: true }),
],
```

### Plugin development tools

Use `@noxion/plugin-utils` for testing and development:

```ts
import {
  createMockBlogPage,
  createMockDocsPage,
  createMockPortfolioPage,
  createMockPages,
  createTestConfig,
  createTestPlugin,
  validatePluginManifest,
} from "@noxion/plugin-utils";

// Create mock data for testing
const pages = createMockPages(10);
const blogPage = createMockBlogPage({ title: "Test Post", description: "Test" });

// Validate plugin manifest
const result = validatePluginManifest(manifest);
```

See [Creating a Plugin](./creating-a-plugin) for a full guide.

---

## Plugin execution model

1. **`transformPosts`** — runs sequentially in plugin order; each plugin receives the output of the previous one
2. **`registerPageTypes`** — runs sequentially; each plugin can register types in the shared registry
3. **`extendSlots`** — runs in order; each plugin can add or override slot content
4. **`injectHead`** — runs for every page; results are merged into a flat array of tags
5. **`extendMetadata`** — runs in order; each plugin can modify the metadata object
6. **`extendSitemap`** — runs in order; each plugin appends entries to the sitemap array

### Error handling

If a plugin throws an error:
- The error is logged with the plugin name for easier debugging
- Noxion falls back to the pre-plugin state for that hook
- Other plugins continue to run

This means a broken plugin won't crash your entire build.

---

## Plugin types reference

See the [Plugin System API reference](../../reference/core/plugins) for the complete TypeScript type definitions.
