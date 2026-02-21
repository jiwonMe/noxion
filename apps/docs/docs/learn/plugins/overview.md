---
sidebar_position: 1
title: Plugins Overview
description: Extend Noxion with analytics, RSS, comments, and custom functionality.
---

# Plugins

Noxion's plugin system lets you extend the blog with additional functionality — analytics tracking, RSS feeds, comment systems, and anything else you can imagine.

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
| `loadContent()` | During build | Load external data (e.g., GitHub stars, reading time) |
| `contentLoaded(args)` | After `loadContent()` | Process loaded content and register routes |
| `onBuildStart(args)` | At the start of a build | Run setup tasks |
| `postBuild(args)` | After the build completes | Run post-build tasks (notifications, etc.) |
| `extendRoutes(args)` | When routes are calculated | Add dynamic routes |

---

## Writing a custom plugin

Use `definePlugin()` from `@noxion/core` to create a type-safe plugin:

```ts
import { definePlugin } from "@noxion/core";

export const readingTimePlugin = definePlugin({
  name: "reading-time",

  // Hook: transform posts to add reading time
  transformPosts({ posts }) {
    return posts.map((post) => ({
      ...post,
      frontmatter: {
        ...post.frontmatter,
        // Reading time: ~200 words per minute
        readingTime: `${Math.ceil((post.description?.split(" ").length ?? 100) / 200)} min read`,
      },
    }));
  },

  // Hook: inject a custom meta tag into <head>
  injectHead({ post }) {
    if (!post) return [];
    return [
      {
        tagName: "meta",
        attributes: {
          name: "reading-time",
          content: post.frontmatter?.readingTime ?? "",
        },
      },
    ];
  },
});
```

Register it in your config:

```ts
import { readingTimePlugin } from "./plugins/reading-time";

export default defineConfig({
  plugins: [readingTimePlugin],
});
```

### Plugin factory pattern

If your plugin needs configuration options, use the factory pattern:

```ts
import { definePlugin, NoxionPlugin } from "@noxion/core";

interface CustomAnalyticsOptions {
  apiKey: string;
  endpoint: string;
}

export function createCustomAnalyticsPlugin(
  options: CustomAnalyticsOptions
): NoxionPlugin {
  return definePlugin({
    name: "custom-analytics",

    injectHead() {
      return [
        {
          tagName: "script",
          innerHTML: `
            window.customAnalytics = { apiKey: "${options.apiKey}" };
          `,
        },
        {
          tagName: "script",
          attributes: {
            src: options.endpoint,
            defer: "true",
          },
        },
      ];
    },
  });
}
```

Usage:
```ts
plugins: [
  createCustomAnalyticsPlugin({
    apiKey: process.env.ANALYTICS_KEY!,
    endpoint: "https://analytics.example.com/track.js",
  }),
],
```

---

## Plugin execution model

Plugins are executed by `@noxion/core`'s plugin executor. The execution model:

1. **`transformPosts`** — runs sequentially in plugin order; each plugin receives the output of the previous one
2. **`injectHead`** — runs for every page; results are merged into a flat array of tags
3. **`extendMetadata`** — runs in order; each plugin can modify the metadata object
4. **`extendSitemap`** — runs in order; each plugin appends entries to the sitemap array

### Error handling

If a plugin throws an error:
- The error is logged with the plugin name for easier debugging
- Noxion falls back to the pre-plugin state for that hook
- Other plugins continue to run

This means a broken plugin won't crash your entire build — it just won't have its effect applied.

---

## Plugin types reference

See the [Plugin System API reference](../../reference/core/plugins) for the complete TypeScript type definitions.
