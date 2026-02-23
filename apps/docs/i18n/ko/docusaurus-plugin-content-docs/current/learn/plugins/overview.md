---
sidebar_position: 1
title: 플러그인 개요
description: 애널리틱스, RSS, 댓글, 커스텀 페이지 타입 등으로 Noxion을 확장하세요.
---

# 플러그인

Noxion의 플러그인 시스템으로 사이트에 추가 기능을 확장할 수 있습니다 — 애널리틱스 추적, RSS 피드, 댓글 시스템, 커스텀 페이지 타입 등 상상할 수 있는 모든 것.

---

## 플러그인 추가

플러그인은 `noxion.config.ts`에서 설정합니다:

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

플러그인은 순서대로 실행됩니다. 같은 타입의 플러그인을 여러 개 포함할 수 있습니다 (예: 여러 애널리틱스 프로바이더).

---

## 내장 플러그인

| 플러그인 | 임포트 | 용도 |
|---------|--------|------|
| [애널리틱스](./analytics) | `createAnalyticsPlugin` | Google Analytics, Plausible, Umami 페이지뷰 추적 |
| [RSS](./rss) | `createRSSPlugin` | `/feed.xml`에 RSS 2.0 피드 생성 |
| [댓글](./comments) | `createCommentsPlugin` | Giscus, Utterances, 또는 Disqus 댓글 시스템 |

---

## 플러그인 라이프사이클 훅

플러그인은 하나 이상의 **라이프사이클 훅**을 구현하는 객체입니다. 각 훅은 Noxion의 렌더링 파이프라인의 특정 시점에 호출됩니다.

### 사용 가능한 훅

| 훅 | 호출 시점 | 사용 용도 |
|----|----------|----------|
| `transformPosts(args)` | 모든 포스트 페치 후 | 포스트 데이터 필터, 정렬 또는 보강 |
| `transformContent(args)` | 포스트 렌더링 전 | Notion 블록 데이터 수정 |
| `injectHead(args)` | `<head>` 태그 생성 시 | 애널리틱스 스크립트, 폰트, 커스텀 메타 태그 추가 |
| `extendMetadata(args)` | Next.js Metadata 생성 시 | OG/Twitter 메타데이터 추가 또는 오버라이드 |
| `extendSitemap(args)` | 사이트맵 엔트리 생성 시 | 커스텀 페이지를 사이트맵에 추가 |
| `extendRoutes(args)` | 라우트 계산 시 | 동적 라우트 추가 |
| `registerPageTypes(args)` | 초기화 시 | PageTypeRegistry에 커스텀 페이지 타입 등록 |
| `onRouteResolve(args)` | 페이지 URL 해석 시 | 페이지 타입별 URL 생성 커스터마이징 |
| `extendSlots(args)` | 페이지 템플릿 렌더링 시 | 이름이 지정된 템플릿 슬롯에 콘텐츠 주입 |
| `loadContent()` | 빌드 중 | 외부 데이터 로드 |
| `contentLoaded(args)` | `loadContent()` 후 | 로드된 콘텐츠 처리 |
| `onBuildStart(args)` | 빌드 시작 시 | 설정 작업 실행 |
| `postBuild(args)` | 빌드 완료 후 | 빌드 후 작업 실행 |

### v0.2의 새 기능

v0.2에서 다음 훅이 추가되었습니다:

**`registerPageTypes`** — 내장 blog, docs, portfolio 외의 커스텀 페이지 타입 등록:

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

**`onRouteResolve`** — 특정 페이지 타입의 URL 생성 커스터마이징:

```ts
onRouteResolve({ page, defaultUrl }) {
  if (page.pageType === "recipe") {
    return `/recipes/${page.slug}`;
  }
  return defaultUrl;
}
```

**`extendSlots`** — 이름이 지정된 템플릿 슬롯에 콘텐츠 주입:

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

플러그인은 검증을 위한 설정 스키마를 선언할 수 있습니다. 플러그인 로더는 `loadPlugins()` 중에 사용자가 제공한 옵션을 이 스키마에 대해 검증합니다:

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
  // ...훅
};
```

---

## 커스텀 플러그인 작성

타입 안전한 플러그인 생성을 위해 `@noxion/core`의 `definePlugin()`을 사용하세요:

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

### 플러그인 팩토리 패턴 (권장)

플러그인에 설정 옵션이 필요한 경우 `PluginFactory`를 사용한 팩토리 패턴을 사용하세요:

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
      // 포스트 변환...
      return posts;
    },
  };
  return plugin;
};
```

사용법:

```ts
plugins: [
  createMyPlugin({ apiKey: "xxx", enabled: true }),
],
```

### 플러그인 개발 도구

테스트와 개발에 `@noxion/plugin-utils`를 사용하세요:

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

// 테스트용 목 데이터 생성
const pages = createMockPages(10);
const blogPage = createMockBlogPage({ title: "Test Post", description: "Test" });

// 플러그인 매니페스트 검증
const result = validatePluginManifest(manifest);
```

전체 가이드는 [플러그인 만들기](./creating-a-plugin)를 참조하세요.

---

## 플러그인 실행 모델

1. **`transformPosts`** — 플러그인 순서대로 순차 실행; 각 플러그인은 이전 플러그인의 출력을 받음
2. **`registerPageTypes`** — 순차 실행; 각 플러그인이 공유 레지스트리에 타입을 등록
3. **`extendSlots`** — 순서대로 실행; 각 플러그인이 슬롯 콘텐츠를 추가하거나 오버라이드
4. **`injectHead`** — 모든 페이지에 대해 실행; 결과는 태그의 플랫 배열로 병합
5. **`extendMetadata`** — 순서대로 실행; 각 플러그인이 메타데이터 객체를 수정
6. **`extendSitemap`** — 순서대로 실행; 각 플러그인이 사이트맵 배열에 엔트리를 추가

### 오류 처리

플러그인에서 오류가 발생하면:
- 오류가 플러그인 이름과 함께 로그됨 (디버깅 용이)
- Noxion이 해당 훅에 대해 플러그인 적용 전 상태로 폴백
- 다른 플러그인은 계속 실행

이는 깨진 플러그인이 전체 빌드를 중단시키지 않음을 의미합니다.

---

## 플러그인 타입 레퍼런스

전체 TypeScript 타입 정의는 [플러그인 시스템 API 레퍼런스](../../reference/core/plugins)를 참조하세요.
