---
title: Plugin System
description: "@noxion/core plugin API"
---

# Plugin System

## `definePlugin()`

```ts
import { definePlugin } from "@noxion/core";

const myPlugin = definePlugin({
  name: "my-plugin",
  async onPostFetch(posts) { return posts; },
});
```

### Hooks

| Hook | Signature | Description |
|------|-----------|-------------|
| `onPostFetch` | `(posts: BlogPost[]) => BlogPost[] \| Promise<BlogPost[]>` | Transform posts after fetching |
| `onHeadTags` | `(post: BlogPost) => HeadTag[] \| Promise<HeadTag[]>` | Inject `<head>` tags per post |
| `onBeforeRender` | `(data: NoxionPageData) => void \| Promise<void>` | Called before page render |
| `onAfterRender` | `(data: NoxionPageData) => void \| Promise<void>` | Called after page render |

## Built-in plugin factories

### `createAnalyticsPlugin()`

```ts
createAnalyticsPlugin({
  provider: "google" | "plausible" | "umami" | "custom",
  trackingId: string,
  customScript?: string,  // for "custom" provider
})
```

### `createRSSPlugin()`

```ts
createRSSPlugin({
  feedPath: string,  // e.g. "/feed.xml"
  limit?: number,    // default: 20
})
```

### `createCommentsPlugin()`

```ts
createCommentsPlugin({
  provider: "giscus" | "utterances" | "disqus",
  config: GiscusConfig | UtterancesConfig | DisqusConfig,
})
```
