---
sidebar_position: 1
title: Plugins Overview
description: Extend Noxion with plugins.
---

# Plugins

Plugins extend Noxion with analytics, RSS feeds, comments, and custom functionality.

## Adding plugins

```ts
// noxion.config.ts
import { defineConfig, createRSSPlugin, createAnalyticsPlugin } from "@noxion/core";

export default defineConfig({
  plugins: [
    createRSSPlugin({ feedPath: "/feed.xml" }),
    createAnalyticsPlugin({ provider: "google", trackingId: "G-XXXXXXXXXX" }),
  ],
});
```

## Built-in plugins

| Plugin | Function |
|--------|----------|
| [Analytics](./analytics) | Page view tracking |
| [RSS](./rss) | RSS/Atom feed generation |
| [Comments](./comments) | Comment system integration |

## Plugin lifecycle

Plugins hook into Noxion's lifecycle via a Docusaurus-inspired API:

```ts
import { definePlugin } from "@noxion/core";

export const myPlugin = definePlugin({
  name: "my-plugin",
  async onPostFetch(posts) {
    // Transform posts after fetching
    return posts.map(post => ({ ...post, title: post.title.toUpperCase() }));
  },
  async onHeadTags(post) {
    // Inject custom <head> tags per post
    return [{ tagName: "meta", attributes: { name: "custom", content: "value" } }];
  },
});
```

Available hooks: `onPostFetch`, `onHeadTags`, `onBeforeRender`, `onAfterRender`.
