---
sidebar_position: 5
title: Creating a Plugin
description: Build and publish your own Noxion plugin from scratch.
---

# Creating a Plugin

This guide walks you through building a Noxion plugin, testing it with `@noxion/plugin-utils`, and preparing it for publication.

---

## Naming convention

All community plugins should follow the naming pattern:

```
noxion-plugin-<name>
```

For scoped packages:

```
@your-scope/noxion-plugin-<name>
```

This convention makes plugins discoverable and identifiable in npm.

---

## Project structure

A Noxion plugin package looks like this:

```
noxion-plugin-example/
├── src/
│   ├── index.ts              # Plugin entry point
│   └── __tests__/
│       └── plugin.test.ts    # Tests using @noxion/plugin-utils
├── noxion-plugin.json        # Plugin manifest
├── package.json
└── tsconfig.json
```

---

## Step 1: Set up the package

Create your plugin directory and initialize it:

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

Key points:
- `@noxion/core` is a **peer dependency** — the host project provides it.
- `@noxion/plugin-utils` is a **dev dependency** — used only for testing.

---

## Step 2: Write the plugin

Use the factory pattern if your plugin needs configuration, or export a plain object if it doesn't.

### Factory pattern (recommended)

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

### Plain object (no config needed)

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

## Step 3: Add the plugin manifest

Create a `noxion-plugin.json` at the package root. This file declares your plugin's capabilities without requiring code execution.

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

### Manifest fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Plugin display name |
| `description` | Yes | Short description |
| `version` | Yes | Semver version string |
| `noxion` | Yes | Noxion core compatibility range (e.g. `>=0.2.0`) |
| `author` | No | Plugin author |
| `homepage` | No | Repository or docs URL |
| `license` | No | SPDX license identifier |
| `hooks` | No | Which lifecycle hooks the plugin uses |
| `pageTypes` | No | Which page types the plugin targets (empty = all) |
| `hasConfig` | No | Whether the plugin accepts options |
| `keywords` | No | Discoverability keywords |

You can validate your manifest programmatically:

```ts
import { validatePluginManifest } from "@noxion/plugin-utils";

const manifest = JSON.parse(fs.readFileSync("noxion-plugin.json", "utf-8"));
const result = validatePluginManifest(manifest);
if (!result.valid) {
  console.error("Invalid manifest:", result.errors);
}
```

---

## Step 4: Write tests

Use `@noxion/plugin-utils` for mock data and test config helpers:

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

### Available test helpers

| Helper | Description |
|--------|-------------|
| `createMockPage(overrides?)` | Generic `NoxionPage` with defaults |
| `createMockBlogPage(overrides?)` | `BlogPage` with date, tags metadata |
| `createMockDocsPage(overrides?)` | `DocsPage` with section, version metadata |
| `createMockPortfolioPage(overrides?)` | `PortfolioPage` with technologies, year metadata |
| `createMockPages(count, overrides?)` | Array of generic pages |
| `createMockBlogPages(count, overrides?)` | Array of blog pages |
| `createTestConfig(overrides?)` | Valid `NoxionConfig` with sensible defaults |
| `createTestPlugin(overrides?)` | Minimal `NoxionPlugin` stub |
| `resetMockCounter()` | Reset mock ID counter (call in `beforeEach`) |
| `validatePluginManifest(obj)` | Validate a manifest object |

---

## Step 5: Add config validation (optional)

If your plugin accepts options, add a `configSchema` so Noxion can validate the config at load time:

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

## Available hooks

| Hook | Signature | Use case |
|------|-----------|----------|
| `transformPosts` | `({ posts }) => posts` | Filter, sort, or augment page data |
| `transformContent` | `({ recordMap, post }) => recordMap` | Modify Notion block data before render |
| `injectHead` | `({ post?, config }) => HeadTag[]` | Add `<script>`, `<meta>`, `<link>` tags |
| `extendMetadata` | `({ metadata, post?, config }) => metadata` | Modify Open Graph / SEO metadata |
| `extendSitemap` | `({ entries, config }) => entries` | Add custom sitemap entries |
| `extendRoutes` | `({ routes, config }) => routes` | Add dynamic routes |
| `registerPageTypes` | `() => PageTypeDefinition[]` | Register custom page types |
| `onRouteResolve` | `(route) => route \| null` | Intercept or modify route resolution |
| `extendSlots` | `(slots) => slots` | Add or override theme slot content |
| `loadContent` | `() => content` | Load external data during build |
| `contentLoaded` | `({ content, actions }) => void` | Process loaded content, register routes |
| `onBuildStart` | `({ config }) => void` | Run setup tasks at build start |
| `postBuild` | `({ config, routes }) => void` | Run post-build tasks |
| `extendCLI` | `() => CLICommand[]` | Add custom CLI commands |

---

## Publishing

1. Build: `bun run build`
2. Test: `bun test`
3. Publish: `npm publish`

Make sure `noxion-plugin.json` is included in the `files` array of your `package.json`.

Users install and configure your plugin like any built-in:

```ts title="noxion.config.ts"
import { defineConfig } from "@noxion/core";
import { createReadingTimePlugin } from "noxion-plugin-reading-time";

export default defineConfig({
  plugins: [
    createReadingTimePlugin({ wordsPerMinute: 250 }),
  ],
});
```
