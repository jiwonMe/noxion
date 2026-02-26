---
title: NotionRenderer
description: "The top-level @noxion/notion-renderer component — renders a full Notion page from an ExtendedRecordMap"
---

# `<NotionRenderer />`

```tsx
import { NotionRenderer } from "@noxion/notion-renderer";
```

The top-level renderer component. Wraps [`NotionRendererProvider`](./hooks#notionrendererprovider) with the full renderer context, then renders the root block via [`NotionBlock`](./blocks#notionblock).

This is a **Client Component** (`"use client"`).

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `recordMap` | `ExtendedRecordMap` | ✅ | — | Full page data from `fetchPage()`. Contains all blocks, images, collection data, and user info. |
| `rootPageId` | `string` | — | first key in `recordMap.block` | ID of the root page block to start rendering from. Pass `post.id` for single-post pages. |
| `fullPage` | `boolean` | — | `true` | When `true`, renders the full page including the page title header block. When `false`, renders only child blocks (body). |
| `darkMode` | `boolean` | — | `false` | Force dark mode rendering. When `true`, adds `noxion-renderer--dark` CSS class and passes `darkMode: true` to all block components. |
| `previewImages` | `boolean` | — | `false` | Enable blur-up image preview (requires preview image data in `recordMap`). |
| `mapPageUrl` | `MapPageUrlFn` | — | `(id) => '/${id}'` | Map a Notion page ID to a URL path. Used for internal page links in rich text. |
| `mapImageUrl` | `MapImageUrlFn` | — | `(url) => url` | Map an image URL (e.g. convert S3 URLs to proxy URLs). |
| `highlightCode` | `HighlightCodeFn` | — | `undefined` | Syntax highlight function. Call `createShikiHighlighter()` to get one. |
| `components` | `Partial<NotionComponents>` | — | `{}` | Override specific block renderers, link/image components. |
| `className` | `string` | — | `undefined` | Extra CSS class on the outer `<div.noxion-renderer>`. |
| `header` | `ReactNode` | — | `undefined` | Rendered above the page content (outside the page title). |
| `footer` | `ReactNode` | — | `undefined` | Rendered below the page content. |
| `pageHeader` | `ReactNode` | — | `undefined` | Rendered between `header` and the root block. |
| `pageFooter` | `ReactNode` | — | `undefined` | Rendered between the root block and `footer`. |
| `defaultPageIcon` | `string \| null` | — | `undefined` | Fallback emoji or image URL for pages without an icon. |
| `defaultPageCover` | `string \| null` | — | `undefined` | Fallback cover image URL for pages without a cover. |
| `defaultPageCoverPosition` | `number` | — | `undefined` | Fallback cover vertical position (0–1). |
| `plugins` | `RendererPlugin[]` | — | `[]` | Array of renderer plugins. Plugins can override block rendering, transform content, and perform side effects. See [Plugin System](./plugins). |
| `showBlockActions` | `boolean | ((blockType: string) => boolean)` | — | `undefined` | Show copy/share action buttons on blocks. Pass `true` for all blocks, or a function to selectively enable per block type. |

---

## Rendered HTML structure

```html
<div class="noxion-renderer [noxion-renderer--dark] [className]">
  <!-- header slot -->
  <!-- pageHeader slot -->
  <!-- root NotionBlock (page/blocks) -->
  <!-- pageFooter slot -->
  <!-- footer slot -->
</div>
```

---

## Basic usage

```tsx
"use client";
import { NotionRenderer } from "@noxion/notion-renderer";
import type { ExtendedRecordMap } from "notion-types";

export function PostBody({
  recordMap,
  pageId,
}: {
  recordMap: ExtendedRecordMap;
  pageId: string;
}) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      rootPageId={pageId}
      fullPage={true}
    />
  );
}
```

---

## With Shiki syntax highlighting

```tsx
"use client";
import { useEffect, useState } from "react";
import { NotionRenderer, createShikiHighlighter } from "@noxion/notion-renderer";
import type { HighlightCodeFn, ExtendedRecordMap } from "@noxion/notion-renderer";

export function PostBody({ recordMap, pageId }: { recordMap: ExtendedRecordMap; pageId: string }) {
  const [highlightCode, setHighlightCode] = useState<HighlightCodeFn | undefined>();

  useEffect(() => {
    createShikiHighlighter().then(setHighlightCode);
  }, []);

  return (
    <NotionRenderer
      recordMap={recordMap}
      rootPageId={pageId}
      highlightCode={highlightCode}
    />
  );
}
```

:::tip
`@noxion/renderer`'s `<NotionPage />` already sets up Shiki automatically. Use `NotionRenderer` directly when you need manual control.
:::

---

## With custom image component

Use `components.Image` to plug in `next/image` or any other optimized image component:

```tsx
import NextImage from "next/image";
import { NotionRenderer } from "@noxion/notion-renderer";

<NotionRenderer
  recordMap={recordMap}
  components={{
    Image: ({ src, alt, width, height, className }) => (
      <NextImage
        src={src}
        alt={alt}
        width={width ?? 1200}
        height={height ?? 630}
        className={className}
      />
    ),
  }}
/>
```

---

## With custom link component

```tsx
import Link from "next/link";
import { NotionRenderer } from "@noxion/notion-renderer";

<NotionRenderer
  recordMap={recordMap}
  components={{
    Link: ({ href, children, className }) => (
      <Link href={href} className={className}>
        {children}
      </Link>
    ),
    PageLink: ({ href, children, className }) => (
      <Link href={href} className={className}>
        {children}
      </Link>
    ),
  }}
/>
```

---

## Overriding block renderers

Pass custom components via `components.blockOverrides` to replace specific block types:

```tsx
import { NotionRenderer } from "@noxion/notion-renderer";
import type { NotionBlockProps } from "@noxion/notion-renderer";

function MyCallout({ block, children }: NotionBlockProps) {
  const icon = (block.format as { page_icon?: string } | undefined)?.page_icon;
  return (
    <div className="my-callout" data-icon={icon}>
      {children}
    </div>
  );
}

<NotionRenderer
  recordMap={recordMap}
  components={{
    blockOverrides: {
      callout: MyCallout,
    },
  }}
/>
```

The override key is the Notion block `type` string (e.g. `"callout"`, `"code"`, `"image"`). See [Block Components](./blocks) for all type strings.

---

## `NotionComponents` type

```ts
interface NotionComponents {
  // Custom image renderer (plug in next/image, etc.)
  Image?: ComponentType<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
  }>;

  // Custom link renderer for external URLs in rich text
  Link?: ComponentType<{
    href: string;
    className?: string;
    children?: ReactNode;
  }>;

  // Custom link renderer for internal Notion page links
  PageLink?: ComponentType<{
    href: string;
    className?: string;
    children?: ReactNode;
  }>;

  // Override specific block types by Notion type string
  blockOverrides?: Partial<Record<BlockType | string, ComponentType<NotionBlockProps>>>;
}
```

---

## With plugins

```tsx
import {
  NotionRenderer,
  createMermaidPlugin,
  createCalloutTransformPlugin,
  createTextTransformPlugin,
} from "@noxion/notion-renderer";

const plugins = [
  createMermaidPlugin({ theme: "default" }),
  createCalloutTransformPlugin(),
  createTextTransformPlugin({ enableWikilinks: true }),
];

<NotionRenderer
  recordMap={recordMap}
  rootPageId={pageId}
  plugins={plugins}
/>
```

Plugins are executed in priority order (lower priority values first). See [Plugin System](./plugins) for the full API.

---

## With block actions

```tsx
<NotionRenderer
  recordMap={recordMap}
  rootPageId={pageId}
  showBlockActions={true}
/>

// Or selectively:
<NotionRenderer
  recordMap={recordMap}
  rootPageId={pageId}
  showBlockActions={(blockType) => blockType === "code"}
/>
```

---

## Context & internals

`NotionRenderer` creates a [`NotionRendererContextValue`](./hooks#context-value) and wraps all children with `NotionRendererProvider`. Every block component (and your custom overrides) can access this context via [`useNotionRenderer()`](./hooks#usenotionrenderer).

The render tree is:

```
<NotionRenderer>
  <NotionRendererProvider value={contextValue}>
    <div.noxion-renderer>
      {header}
      {pageHeader}
      <NotionBlock blockId={rootPageId} level={0} />
      {pageFooter}
      {footer}
    </div>
  </NotionRendererProvider>
```

Each `NotionBlock` recursively renders its children via `block.content` IDs.
