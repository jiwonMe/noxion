---
title: Types
description: "@noxion/core TypeScript types"
---

# Types

## `BlogPost`

```ts
interface BlogPost {
  id: string;              // Notion page ID (UUID)
  title: string;
  slug: string;            // URL slug
  date: string;            // ISO date string
  tags: string[];
  category?: string;
  coverImage?: string;     // notion.so/image/... proxy URL
  description?: string;
  author?: string;
  published: boolean;
  lastEditedTime: string;  // ISO datetime string
  frontmatter?: Record<string, string>;
}
```

## `NoxionConfig`

```ts
interface NoxionConfig {
  rootNotionPageId: string;
  rootNotionSpaceId?: string;
  name: string;
  domain: string;
  author: string;
  description: string;
  language: string;
  defaultTheme: ThemeMode;
  revalidate: number;
  revalidateSecret?: string;
  plugins?: PluginConfig[];
}

type ThemeMode = "system" | "light" | "dark";
```

## `ExtendedRecordMap`

Re-exported from `notion-types`. Contains the full Notion page data including blocks, collections, and signed URLs.

```ts
import type { ExtendedRecordMap } from "@noxion/core";
```
