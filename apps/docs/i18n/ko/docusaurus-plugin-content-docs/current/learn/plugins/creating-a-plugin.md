---
sidebar_position: 5
title: 플러그인 만들기
description: Noxion 플러그인을 처음부터 만들고 배포하세요.
---

# 플러그인 만들기

이 가이드는 Noxion 플러그인을 만들고, `@noxion/plugin-utils`로 테스트하고, 배포를 준비하는 과정을 안내합니다.

---

## 네이밍 규칙

모든 커뮤니티 플러그인은 다음 네이밍 패턴을 따라야 합니다:

```
noxion-plugin-<name>
```

스코프 패키지의 경우:

```
@your-scope/noxion-plugin-<name>
```

이 규칙을 통해 플러그인을 npm에서 쉽게 찾고 식별할 수 있습니다.

---

## 프로젝트 구조

Noxion 플러그인 패키지는 다음과 같습니다:

```
noxion-plugin-example/
├── src/
│   ├── index.ts              # 플러그인 진입점
│   └── __tests__/
│       └── plugin.test.ts    # @noxion/plugin-utils를 사용한 테스트
├── noxion-plugin.json        # 플러그인 매니페스트
├── package.json
└── tsconfig.json
```

---

## 1단계: 패키지 설정

플러그인 디렉토리를 만들고 초기화합니다:

```json title="package.json"
{
  "name": "noxion-plugin-example",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist", "noxion-plugin.json"],
  "scripts": {
    "build": "tsc",
    "test": "bun test",
    "prepublishOnly": "bun run build"
  },
  "peerDependencies": {
    "@noxion/core": ">=0.2.0"
  },
  "devDependencies": {
    "@noxion/core": "^0.2.0",
    "@noxion/plugin-utils": "^0.1.0",
    "@types/bun": "^1.2.0",
    "typescript": "^5.7.0"
  }
}
```

주요 사항:
- `@noxion/core`는 **peer dependency** — 호스트 프로젝트가 제공합니다.
- `@noxion/plugin-utils`는 **dev dependency** — 테스트에만 사용됩니다.

---

## 2단계: 플러그인 작성

플러그인에 설정이 필요하면 팩토리 패턴을, 필요 없으면 일반 객체를 내보냅니다.

### 팩토리 패턴 (권장)

```ts title="src/index.ts"
import type { NoxionPlugin, PluginFactory } from "@noxion/core";

export interface ReadingTimeOptions {
  wordsPerMinute?: number;
}

export const createReadingTimePlugin: PluginFactory<ReadingTimeOptions> = (options = {}) => {
  const wpm = options.wordsPerMinute ?? 200;

  const plugin: NoxionPlugin = {
    name: "noxion-plugin-reading-time",

    transformPosts({ posts }) {
      return posts.map((post) => ({
        ...post,
        frontmatter: {
          ...post.frontmatter,
          readingTime: `${Math.ceil((post.description?.split(" ").length ?? 100) / wpm)} min`,
        },
      }));
    },
  };

  return plugin;
};

export default createReadingTimePlugin;
```

### 일반 객체 (설정 불필요)

```ts title="src/index.ts"
import { definePlugin } from "@noxion/core";

export const myPlugin = definePlugin({
  name: "noxion-plugin-example",

  transformPosts({ posts }) {
    return posts.filter((p) => p.published);
  },
});
```

---

## 3단계: 플러그인 매니페스트 추가

패키지 루트에 `noxion-plugin.json`을 만듭니다. 이 파일은 코드를 실행하지 않고도 플러그인의 기능을 선언합니다.

```json title="noxion-plugin.json"
{
  "name": "noxion-plugin-reading-time",
  "description": "Adds estimated reading time to blog posts",
  "version": "0.1.0",
  "noxion": ">=0.2.0",
  "hooks": ["transformPosts"],
  "pageTypes": ["blog"],
  "hasConfig": true,
  "keywords": ["reading-time", "blog"]
}
```

### 매니페스트 필드

| 필드 | 필수 | 설명 |
|------|------|------|
| `name` | 예 | 플러그인 표시 이름 |
| `description` | 예 | 짧은 설명 |
| `version` | 예 | Semver 버전 문자열 |
| `noxion` | 예 | Noxion core 호환 범위 (예: `>=0.2.0`) |
| `author` | 아니오 | 플러그인 작성자 |
| `homepage` | 아니오 | 레포지토리 또는 문서 URL |
| `license` | 아니오 | SPDX 라이선스 식별자 |
| `hooks` | 아니오 | 플러그인이 사용하는 라이프사이클 훅 |
| `pageTypes` | 아니오 | 플러그인이 대상으로 하는 페이지 타입 (비어있으면 전부) |
| `hasConfig` | 아니오 | 플러그인이 옵션을 받는지 여부 |
| `keywords` | 아니오 | 검색 키워드 |

매니페스트를 프로그래밍 방식으로 검증할 수 있습니다:

```ts
import { validatePluginManifest } from "@noxion/plugin-utils";

const manifest = JSON.parse(fs.readFileSync("noxion-plugin.json", "utf-8"));
const result = validatePluginManifest(manifest);
if (!result.valid) {
  console.error("Invalid manifest:", result.errors);
}
```

---

## 4단계: 테스트 작성

목 데이터와 테스트 config 헬퍼에 `@noxion/plugin-utils`를 사용하세요:

```ts title="src/__tests__/plugin.test.ts"
import { describe, it, expect, beforeEach } from "bun:test";
import {
  createMockBlogPages,
  createTestConfig,
  resetMockCounter,
} from "@noxion/plugin-utils";
import { createReadingTimePlugin } from "../index";

describe("noxion-plugin-reading-time", () => {
  beforeEach(() => {
    resetMockCounter();
  });

  it("adds reading time to posts", () => {
    const plugin = createReadingTimePlugin({ wordsPerMinute: 200 });
    const posts = createMockBlogPages(3);

    const result = plugin.transformPosts!({ posts });

    for (const post of result) {
      expect(post.frontmatter?.readingTime).toBeDefined();
    }
  });

  it("respects custom words-per-minute", () => {
    const fast = createReadingTimePlugin({ wordsPerMinute: 500 });
    const slow = createReadingTimePlugin({ wordsPerMinute: 100 });
    const posts = createMockBlogPages(1);

    const fastResult = fast.transformPosts!({ posts });
    const slowResult = slow.transformPosts!({ posts });

    expect(fastResult[0].frontmatter?.readingTime).toBeDefined();
    expect(slowResult[0].frontmatter?.readingTime).toBeDefined();
  });
});
```

### 사용 가능한 테스트 헬퍼

| 헬퍼 | 설명 |
|------|------|
| `createMockPage(overrides?)` | 기본값이 있는 제네릭 `NoxionPage` |
| `createMockBlogPage(overrides?)` | date, tags 메타데이터가 있는 `BlogPage` |
| `createMockDocsPage(overrides?)` | section, version 메타데이터가 있는 `DocsPage` |
| `createMockPortfolioPage(overrides?)` | technologies, year 메타데이터가 있는 `PortfolioPage` |
| `createMockPages(count, overrides?)` | 제네릭 페이지 배열 |
| `createMockBlogPages(count, overrides?)` | 블로그 페이지 배열 |
| `createTestConfig(overrides?)` | 합리적인 기본값이 있는 유효한 `NoxionConfig` |
| `createTestPlugin(overrides?)` | 최소 `NoxionPlugin` 스텁 |
| `resetMockCounter()` | 목 ID 카운터 초기화 (`beforeEach`에서 호출) |
| `validatePluginManifest(obj)` | 매니페스트 객체 검증 |

---

## 5단계: 설정 검증 추가 (선택사항)

플러그인이 옵션을 받는 경우 `configSchema`를 추가하여 Noxion이 로드 시 설정을 검증할 수 있게 하세요:

```ts
const plugin: NoxionPlugin = {
  name: "noxion-plugin-reading-time",

  configSchema: {
    validate(options: unknown) {
      const errors: string[] = [];
      if (typeof options !== "object" || options === null) {
        return { valid: false, errors: ["Options must be an object"] };
      }
      const opts = options as Record<string, unknown>;
      if ("wordsPerMinute" in opts && typeof opts.wordsPerMinute !== "number") {
        errors.push("wordsPerMinute must be a number");
      }
      return { valid: errors.length === 0, errors };
    },
  },

  transformPosts({ posts }) {
    // ...
    return posts;
  },
};
```

---

## 사용 가능한 훅

| 훅 | 시그니처 | 사용 용도 |
|----|---------|----------|
| `transformPosts` | `({ posts }) => posts` | 페이지 데이터 필터, 정렬 또는 보강 |
| `transformContent` | `({ recordMap, post }) => recordMap` | 렌더링 전 Notion 블록 데이터 수정 |
| `injectHead` | `({ post?, config }) => HeadTag[]` | `<script>`, `<meta>`, `<link>` 태그 추가 |
| `extendMetadata` | `({ metadata, post?, config }) => metadata` | Open Graph / SEO 메타데이터 수정 |
| `extendSitemap` | `({ entries, config }) => entries` | 커스텀 사이트맵 엔트리 추가 |
| `extendRoutes` | `({ routes, config }) => routes` | 동적 라우트 추가 |
| `registerPageTypes` | `() => PageTypeDefinition[]` | 커스텀 페이지 타입 등록 |
| `onRouteResolve` | `(route) => route \| null` | 라우트 해석 가로채기 또는 수정 |
| `extendSlots` | `(slots) => slots` | 테마 슬롯 콘텐츠 추가 또는 오버라이드 |
| `loadContent` | `() => content` | 빌드 중 외부 데이터 로드 |
| `contentLoaded` | `({ content, actions }) => void` | 로드된 콘텐츠 처리, 라우트 등록 |
| `onBuildStart` | `({ config }) => void` | 빌드 시작 시 설정 작업 실행 |
| `postBuild` | `({ config, routes }) => void` | 빌드 후 작업 실행 |
| `extendCLI` | `() => CLICommand[]` | 커스텀 CLI 명령 추가 |

---

## 배포

1. 빌드: `bun run build`
2. 테스트: `bun test`
3. 배포: `npm publish`

`package.json`의 `files` 배열에 `noxion-plugin.json`이 포함되어 있는지 확인하세요.

사용자는 내장 플러그인처럼 설치하고 설정합니다:

```ts title="noxion.config.ts"
import { defineConfig } from "@noxion/core";
import { createReadingTimePlugin } from "noxion-plugin-reading-time";

export default defineConfig({
  plugins: [
    createReadingTimePlugin({ wordsPerMinute: 250 }),
  ],
});
```
