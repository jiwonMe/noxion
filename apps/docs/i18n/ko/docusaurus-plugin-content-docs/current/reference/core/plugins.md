---
title: 플러그인 시스템
description: "@noxion/core 플러그인 API — 라이프사이클 훅, 내장 팩토리, 커스텀 플러그인"
---

# 플러그인 시스템 API

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

타입 안전한 플러그인 **팩토리**를 생성합니다. TypeScript 타입 추론을 위한 identity 헬퍼입니다.

### 시그니처

```ts
function definePlugin<Options = unknown, Content = unknown>(
  factory: PluginFactory<Options, Content>
): PluginFactory<Options, Content>
```

### 예시

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

## `NoxionPlugin` 인터페이스

```ts
interface NoxionPlugin<Content = unknown> {
  name: string;

  // 설정 검증
  configSchema?: {
    validate(opts: unknown): { valid: boolean; errors?: string[] };
  };

  // 데이터 훅
  loadContent?: () => Promise<Content> | Content;
  contentLoaded?: (args: { content: Content; actions: PluginActions }) => Promise<void> | void;
  allContentLoaded?: (args: { allContent: AllContent; actions: PluginActions }) => Promise<void> | void;

  // 빌드 라이프사이클
  onBuildStart?: (args: { config: NoxionConfig }) => Promise<void> | void;
  postBuild?: (args: { config: NoxionConfig; routes: RouteInfo[] }) => Promise<void> | void;

  // 콘텐츠 변환
  transformContent?: (args: { recordMap: ExtendedRecordMap; post: BlogPost }) => ExtendedRecordMap;
  transformPosts?: (args: { posts: BlogPost[] }) => BlogPost[];

  // SEO / 메타데이터
  extendMetadata?: (args: { metadata: NoxionMetadata; post?: BlogPost; config: NoxionConfig }) => NoxionMetadata;
  injectHead?: (args: { post?: BlogPost; config: NoxionConfig }) => HeadTag[];
  extendSitemap?: (args: { entries: SitemapEntry[]; config: NoxionConfig }) => SitemapEntry[];

  // 라우팅
  extendRoutes?: (args: { routes: RouteInfo[]; config: NoxionConfig }) => RouteInfo[];

  // v0.2 훅
  registerPageTypes?: () => PageTypeDefinition[];
  onRouteResolve?: (route: RouteInfo) => RouteInfo | null;

  /** @deprecated */
  extendSlots?: (slots: Record<string, unknown>) => Record<string, unknown>;
}
```

### 훅 레퍼런스

#### `transformPosts`

**호출 시점**: 모든 포스트가 Notion에서 페치된 후, ISR 캐싱 전.

**용도**: 포스트 필터링, 파생 필드 계산 (단어 수, 읽기 시간), 정렬 오버라이드.

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

**호출 시점**: 플러그인 초기화 중.

**용도**: 내장 blog, docs, portfolio 외의 커스텀 페이지 타입 등록.

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

**호출 시점**: 페이지의 URL 생성 시.

**용도**: 페이지 타입별 URL 패턴 커스터마이징.

```ts
onRouteResolve(route) {
  if (route.path.startsWith("/recipe/")) {
    return { ...route, path: route.path.replace("/recipe/", "/recipes/") };
  }
  return route;
}
```

#### `extendSlots`

**호출 시점**: pre-v0.3 테마 슬롯 모델의 레거시 훅.

**용도**: 하위 호환성 전용. 신규 테마는 컴포넌트를 직접 노출하고 앱 코드에서 조합하는 방식을 권장합니다.

```ts
extendSlots(slots) {
  return {
    ...slots,
    readingTimeDisplay: "📖 {{readingTime}}",
  };
}
```

#### `configSchema`

**확인 시점**: `loadPlugins()`에서 플러그인 옵션 검증 시.

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

**호출 시점**: 페이지의 `recordMap`이 `<NotionPage>`에 전달되기 전.

#### `injectHead`

**호출 시점**: 페이지의 `<head>` 태그 생성 시. 홈페이지와 태그 페이지에서 `post`는 `undefined`.

#### `extendMetadata`

**호출 시점**: 페이지의 Next.js `Metadata` 생성 시.

#### `extendSitemap`

**호출 시점**: 사이트맵 엔트리 생성 시.

---

## `PluginFactory` 타입

```ts
type PluginFactory<Options = unknown, Content = unknown> = (
  options: Options
) => NoxionPlugin<Content>;
```

설정 가능한 플러그인에 권장되는 패턴:

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

## `HeadTag` 타입

```ts
interface HeadTag {
  tagName: string;
  attributes?: Record<string, string>;
  innerHTML?: string;
}
```

---

## `SitemapEntry` 타입

```ts
interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}
```

---

## 내장 플러그인 팩토리

### `createAnalyticsPlugin()`

```ts
createAnalyticsPlugin({
  provider: "google" | "plausible" | "umami" | "custom",
  trackingId: string,
  customScript?: string,
})
```

자세한 내용은 [애널리틱스 플러그인](../../learn/plugins/analytics)을 참조하세요.

### `createRSSPlugin()`

```ts
createRSSPlugin({
  feedPath?: string,   // 기본값: "/feed.xml"
  limit?: number,      // 기본값: 20
})
```

자세한 내용은 [RSS 플러그인](../../learn/plugins/rss)을 참조하세요.

### `createCommentsPlugin()`

```ts
createCommentsPlugin({
  provider: "giscus" | "utterances" | "disqus",
  config: { /* 프로바이더별 옵션 */ },
})
```

자세한 내용은 [댓글 플러그인](../../learn/plugins/comments)을 참조하세요.
