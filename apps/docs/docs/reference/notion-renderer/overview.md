---
sidebar_position: 1
title: Overview
description: "@noxion/notion-renderer — custom Notion block renderer with 30+ block types, KaTeX SSR, and Shiki syntax highlighting"
---

# @noxion/notion-renderer

```bash
npm install @noxion/notion-renderer
# or
bun add @noxion/notion-renderer
```

A fully custom React renderer for Notion pages. It replaces `react-notion-x` as the rendering core for Noxion, giving complete control over markup, CSS, accessibility, and rendering behavior.

**Peer dependencies**: `react >= 18.0.0`, `notion-types >= 7.0.0`, `notion-utils >= 7.0.0`

---

## Why a custom renderer?

`react-notion-x` is a capable library but couples rendering and styling tightly — hard to override CSS, no server-side KaTeX, no built-in Shiki, no tree-shakeable block components. `@noxion/notion-renderer` was built to solve all of this:

| Feature | `react-notion-x` | `@noxion/notion-renderer` |
|---------|-----------------|--------------------------|
| Block coverage | ✅ | ✅ 30+ block types |
| KaTeX rendering | Client-side only | ✅ SSR via `katex.renderToString()` |
| Syntax highlighting | Prism (client) | ✅ Shiki (dual-theme CSS vars) |
| CSS override | Difficult | ✅ BEM + CSS custom properties |
| Tree shaking | ❌ | ✅ Each block is a named export |
| Custom block overrides | Limited | ✅ `components.blockOverrides` |
| Dark mode | Theme-based | ✅ CSS vars + `darkMode` prop |

---

## Installation & setup

### 1. Install

```bash
bun add @noxion/notion-renderer
# peer deps (usually already installed via @noxion/core)
bun add notion-types notion-utils react
```

### 2. Import styles

```css
/* app/globals.css or equivalent */
@import '@noxion/notion-renderer/styles';

/* Optional: KaTeX styles for math equations */
@import '@noxion/notion-renderer/katex-css';
```

### 3. Render a page

```tsx
"use client";
import { NotionRenderer } from "@noxion/notion-renderer";
import type { ExtendedRecordMap } from "notion-types";

interface Props {
  recordMap: ExtendedRecordMap;
  pageId: string;
}

export function MyNotionPage({ recordMap, pageId }: Props) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      rootPageId={pageId}
      fullPage={true}
      darkMode={false}
    />
  );
}
```

---

## Exports

### Main component

| Export | Description |
|--------|-------------|
| [`<NotionRenderer />`](./renderer-api) | Top-level renderer — wraps `NotionRendererProvider` + `NotionBlock` |

### Context & hooks

| Export | Description |
|--------|-------------|
| [`NotionRendererProvider`](./hooks#notionrendererprovider) | React context provider for renderer state |
| [`useNotionRenderer()`](./hooks#usenotionrenderer) | Access the full renderer context |
| [`useNotionBlock(blockId)`](./hooks#usenotionblock) | Resolve a block by ID from the record map |

### Block components

All 30+ block components are named exports. Use them directly or override them via `components.blockOverrides`. See [Block Components](./blocks) for the full list.

| Export | Renders |
|--------|---------|
| `TextBlock` | Paragraph / plain text |
| `HeadingBlock` | H1, H2, H3 (Notion: `header`, `sub_header`, `sub_sub_header`) |
| `BulletedListBlock` | Bulleted list item |
| `NumberedListBlock` | Numbered list item |
| `ToDoBlock` | Checkbox / to-do item |
| `QuoteBlock` | Block quote |
| `CalloutBlock` | Callout with emoji icon |
| `DividerBlock` | Horizontal rule |
| `ToggleBlock` | Collapsible toggle |
| `PageBlock` | Sub-page link |
| `EquationBlock` | Block math equation (KaTeX SSR) |
| `CodeBlock` | Code block with Shiki highlighting |
| `ImageBlock` | Image with caption and `mapImageUrl` |
| `VideoBlock` | Video embed |
| `AudioBlock` | Audio embed |
| `EmbedBlock` | Generic iframe embed |
| `BookmarkBlock` | Rich link preview |
| `FileBlock` | File attachment |
| `PdfBlock` | PDF embed |
| `TableBlock` | Table |
| `ColumnListBlock` | Column layout container |
| `ColumnBlock` | Individual column |
| `SyncedContainerBlock` | Synced block (original) |
| `SyncedReferenceBlock` | Synced block (reference) |
| `AliasBlock` | Block alias |
| `TableOfContentsBlock` | Auto table of contents |
| `CollectionViewPlaceholder` | Database / collection view (placeholder) |

### Inline components

| Export | Description |
|--------|-------------|
| [`<Text />`](./components#text) | Rich-text renderer — handles all Notion inline decorations |
| [`<InlineEquation />`](./components#inlineequation) | Inline KaTeX math expression |

### Utilities

| Export | Description |
|--------|-------------|
| [`formatNotionDate(dateValue)`](./utils#formatnotiondate) | Format a Notion date value to a human-readable string |
| [`unwrapBlockValue(record)`](./utils#unwrapblockvalue) | Unwrap `{ role, value }` wrapper from a Notion record |
| [`getBlockTitle(block)`](./utils#getblocktitle) | Extract plain text title from a block's properties |
| [`cs(...classes)`](./utils#cs) | Conditional className utility (like `clsx`) |

### Shiki

| Export | Description |
|--------|-------------|
| [`createShikiHighlighter(options)`](./shiki#createshikihighlighter) | Create a `HighlightCodeFn` backed by Shiki |
| [`normalizeLanguage(language)`](./shiki#normalizelanguage) | Convert Notion language names to Shiki language IDs |

### Types

| Export | Description |
|--------|-------------|
| `NotionRendererProps` | Props for `<NotionRenderer />` |
| `NotionRendererContextValue` | Shape of the renderer context |
| `NotionBlockProps` | Props passed to every block component |
| `NotionComponents` | Component override map |
| `MapPageUrlFn` | `(pageId: string) => string` |
| `MapImageUrlFn` | `(url: string, block: Block) => string` |
| `HighlightCodeFn` | `(code: string, language: string) => string` |
| `ExtendedRecordMap` | Re-export from `notion-types` |
| `Block` | Re-export from `notion-types` |
| `BlockType` | Re-export from `notion-types` |
| `Decoration` | Re-export from `notion-types` |

---

## CSS exports

| Import path | Contents |
|-------------|----------|
| `@noxion/notion-renderer/styles` | All block styles (BEM, CSS custom properties) |
| `@noxion/notion-renderer/katex-css` | KaTeX math stylesheet |

---

## Supported Notion block types

| Notion block type | Component | Notes |
|-------------------|-----------|-------|
| `text` | `TextBlock` | Plain paragraph |
| `header` | `HeadingBlock` | `<h1>` |
| `sub_header` | `HeadingBlock` | `<h2>` |
| `sub_sub_header` | `HeadingBlock` | `<h3>` |
| `bulleted_list` | `BulletedListBlock` | `<li>` in `<ul>` |
| `numbered_list` | `NumberedListBlock` | `<li>` in `<ol>` |
| `to_do` | `ToDoBlock` | Checkbox |
| `quote` | `QuoteBlock` | `<blockquote>` |
| `callout` | `CalloutBlock` | Callout with icon |
| `divider` | `DividerBlock` | `<hr>` |
| `toggle` | `ToggleBlock` | `<details><summary>` |
| `page` | `PageBlock` | Sub-page link |
| `equation` | `EquationBlock` | Block KaTeX |
| `code` | `CodeBlock` | Shiki-highlighted code |
| `image` | `ImageBlock` | `<figure><img>` |
| `video` | `VideoBlock` | Video embed |
| `audio` | `AudioBlock` | Audio embed |
| `embed` | `EmbedBlock` | Generic iframe |
| `gist` | `EmbedBlock` | GitHub Gist |
| `figma` | `EmbedBlock` | Figma embed |
| `tweet` | `EmbedBlock` | Twitter/X embed |
| `maps` | `EmbedBlock` | Google Maps |
| `miro` | `EmbedBlock` | Miro board |
| `codepen` | `EmbedBlock` | CodePen |
| `excalidraw` | `EmbedBlock` | Excalidraw |
| `bookmark` | `BookmarkBlock` | Rich link preview |
| `file` | `FileBlock` | File attachment |
| `pdf` | `PdfBlock` | PDF viewer |
| `table` | `TableBlock` | Notion table |
| `table_row` | `TextBlock` | Table row |
| `column_list` | `ColumnListBlock` | Column layout |
| `column` | `ColumnBlock` | Column |
| `transclusion_container` | `SyncedContainerBlock` | Synced block (original) |
| `transclusion_reference` | `SyncedReferenceBlock` | Synced block (reference) |
| `alias` | `AliasBlock` | Block alias |
| `table_of_contents` | `TableOfContentsBlock` | TOC |
| `collection_view` | `CollectionViewPlaceholder` | Database view |
| `collection_view_page` | `CollectionViewPlaceholder` | Full-page database |
| `breadcrumb` | `DividerBlock` | Breadcrumb (renders as divider) |
| `external_object_instance` | `EmbedBlock` | External object |
