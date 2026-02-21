---
title: 플러그인 시스템
description: "@noxion/core 플러그인 API"
---

# 플러그인 시스템

## `definePlugin()`

```ts
import { definePlugin } from "@noxion/core";

const myPlugin = definePlugin({
  name: "my-plugin",
  async onPostFetch(posts) { return posts; },
});
```

### 훅

| 훅 | 시그니처 | 설명 |
|----|---------|------|
| `onPostFetch` | `(posts: BlogPost[]) => BlogPost[] \| Promise<BlogPost[]>` | 페치 후 포스트 변환 |
| `onHeadTags` | `(post: BlogPost) => HeadTag[] \| Promise<HeadTag[]>` | 포스트별 `<head>` 태그 주입 |
| `onBeforeRender` | `(data: NoxionPageData) => void \| Promise<void>` | 페이지 렌더링 전 호출 |
| `onAfterRender` | `(data: NoxionPageData) => void \| Promise<void>` | 페이지 렌더링 후 호출 |

## 내장 플러그인 팩토리

### `createAnalyticsPlugin()`

```ts
createAnalyticsPlugin({
  provider: "google" | "plausible" | "umami" | "custom",
  trackingId: string,
  customScript?: string,  // "custom" 프로바이더용
})
```

### `createRSSPlugin()`

```ts
createRSSPlugin({
  feedPath: string,  // 예: "/feed.xml"
  limit?: number,    // 기본값: 20
})
```

### `createCommentsPlugin()`

```ts
createCommentsPlugin({
  provider: "giscus" | "utterances" | "disqus",
  config: GiscusConfig | UtterancesConfig | DisqusConfig,
})
```
