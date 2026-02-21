---
sidebar_position: 1
title: 플러그인 개요
description: 플러그인으로 Noxion을 확장하세요.
---

# 플러그인

플러그인은 애널리틱스, RSS 피드, 댓글, 커스텀 기능으로 Noxion을 확장합니다.

## 플러그인 추가

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

## 내장 플러그인

| 플러그인 | 기능 |
|---------|------|
| [애널리틱스](./analytics) | 페이지뷰 추적 |
| [RSS](./rss) | RSS/Atom 피드 생성 |
| [댓글](./comments) | 댓글 시스템 연동 |

## 플러그인 라이프사이클

플러그인은 Docusaurus 스타일의 API를 통해 Noxion 라이프사이클에 연결됩니다:

```ts
import { definePlugin } from "@noxion/core";

export const myPlugin = definePlugin({
  name: "my-plugin",
  async onPostFetch(posts) {
    // 페치 후 포스트 변환
    return posts.map(post => ({ ...post, title: post.title.toUpperCase() }));
  },
  async onHeadTags(post) {
    // 포스트별 커스텀 <head> 태그 주입
    return [{ tagName: "meta", attributes: { name: "custom", content: "value" } }];
  },
});
```

사용 가능한 훅: `onPostFetch`, `onHeadTags`, `onBeforeRender`, `onAfterRender`.
