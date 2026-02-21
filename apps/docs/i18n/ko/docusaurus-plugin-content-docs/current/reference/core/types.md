---
title: 타입
description: "@noxion/core TypeScript 타입"
---

# 타입

## `BlogPost`

```ts
interface BlogPost {
  id: string;              // Notion 페이지 ID (UUID)
  title: string;
  slug: string;            // URL 슬러그
  date: string;            // ISO 날짜 문자열
  tags: string[];
  category?: string;
  coverImage?: string;     // notion.so/image/... 프록시 URL
  description?: string;
  author?: string;
  published: boolean;
  lastEditedTime: string;  // ISO datetime 문자열
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

`notion-types`에서 재익스포트됩니다. 블록, 컬렉션, signed URL을 포함한 전체 Notion 페이지 데이터를 담습니다.

```ts
import type { ExtendedRecordMap } from "@noxion/core";
```
