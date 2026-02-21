---
title: defineConfig
description: "@noxion/core config API"
---

# `defineConfig()`

```ts
import { defineConfig } from "@noxion/core";
```

Creates a `NoxionConfig` object with defaults applied.

## Signature

```ts
function defineConfig(input: NoxionConfigInput): NoxionConfig
```

## Parameters

### `NoxionConfigInput`

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `rootNotionPageId` | `string` | ✅ | — | Root Notion database page ID |
| `name` | `string` | ✅ | — | Site name |
| `domain` | `string` | ✅ | — | Production domain (no protocol) |
| `author` | `string` | ✅ | — | Default author name |
| `description` | `string` | ✅ | — | Site description |
| `rootNotionSpaceId` | `string` | — | — | Notion workspace ID |
| `language` | `string` | — | `"en"` | Site language code |
| `defaultTheme` | `ThemeMode` | — | `"system"` | Default color scheme |
| `revalidate` | `number` | — | `3600` | ISR revalidation interval (seconds) |
| `revalidateSecret` | `string` | — | — | Secret for on-demand revalidation |
| `plugins` | `PluginConfig[]` | — | `[]` | Plugins to enable |

## Returns

`NoxionConfig` — normalized config with all defaults applied.

## Example

```ts
import { defineConfig } from "@noxion/core";

export default defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  name: "My Blog",
  domain: "myblog.com",
  author: "Your Name",
  description: "A blog about things",
  language: "ko",
  defaultTheme: "system",
  revalidate: 3600,
});
```

---

# `loadConfig()`

```ts
import { loadConfig } from "@noxion/core";
```

Loads config from `noxion.config.ts` at runtime. Used internally by the generated app.

## Signature

```ts
function loadConfig(): NoxionConfig
```
