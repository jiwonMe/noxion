---
title: Block Components
description: "@noxion/notion-renderer individual block components — one component per Notion block type"
---

# Block Components

```ts
import {
  TextBlock,
  HeadingBlock,
  CodeBlock,
  ImageBlock,
  // ... all named exports
} from "@noxion/notion-renderer";
```

Every Notion block type is a standalone React component. They are all Client Components (`"use client"`) and consume the renderer context via `useNotionRenderer()`.

---

## `NotionBlock` and `NotionBlockList`

These are the internal dispatch components — you rarely need them directly, but they're useful for building custom block wrappers.

### `NotionBlock`

```ts
import { NotionBlock } from "@noxion/notion-renderer";
```

Resolves a block by ID from the `recordMap`, selects the appropriate component (built-in or override), and renders it with its children.

```ts
interface NotionBlockRendererProps {
  blockId: string;  // The Notion block ID
  level: number;    // Nesting depth (0 = root)
}
```

**Selection priority:**
1. `components.blockOverrides[blockType]` (custom override)
2. Built-in component for `blockType`
3. `null` (in production) or a dev warning `<div>` (in development)

### `NotionBlockList`

Renders an ordered list of blocks by ID:

```tsx
import { NotionBlockList } from "@noxion/notion-renderer";

<NotionBlockList blockIds={["id1", "id2", "id3"]} level={0} />
```

---

## `NotionBlockProps`

All block components receive these props:

```ts
interface NotionBlockProps {
  block: Block;        // The full Notion block object from notion-types
  blockId: string;     // The block's ID string
  level: number;       // Nesting depth (0 = root page)
  children?: ReactNode; // Pre-rendered child blocks
}
```

---

## Block reference

### `TextBlock`

**Notion type**: `text`

Renders a paragraph. Supports full rich-text decorations (bold, italic, code, links, colors, inline equations, mentions).

```html
<p class="noxion-text">{rich text content}</p>
```

Empty text blocks render as `<p class="noxion-text noxion-text--empty">&nbsp;</p>` to preserve Notion spacing.

---

### `HeadingBlock`

**Notion types**: `header` (H1), `sub_header` (H2), `sub_sub_header` (H3)

Renders a heading. The level is determined by the block type, not the `level` prop.

```html
<h1 class="noxion-heading noxion-heading--1">{text}</h1>
<h2 class="noxion-heading noxion-heading--2">{text}</h2>
<h3 class="noxion-heading noxion-heading--3">{text}</h3>
```

---

### `BulletedListBlock`

**Notion type**: `bulleted_list`

Renders a bulleted list item. Consecutive bulleted list items are wrapped in a shared `<ul>` by the CSS (using adjacent sibling selectors).

```html
<li class="noxion-bulleted-list">{text}</li>
```

---

### `NumberedListBlock`

**Notion type**: `numbered_list`

Same as `BulletedListBlock` but renders `<li>` with an `<ol>` wrapper via CSS.

```html
<li class="noxion-numbered-list">{text}</li>
```

---

### `ToDoBlock`

**Notion type**: `to_do`

Renders a checkbox item. The checkbox is `disabled` (read-only) and reflects the Notion checked state.

```html
<div class="noxion-to-do [noxion-to-do--checked]">
  <input type="checkbox" disabled [checked] />
  <span class="noxion-to-do__label">{text}</span>
</div>
```

---

### `QuoteBlock`

**Notion type**: `quote`

Renders a block quote with a left border.

```html
<blockquote class="noxion-quote">{text}</blockquote>
```

---

### `CalloutBlock`

**Notion type**: `callout`

Renders a callout box with an emoji or custom icon from `block.format.page_icon`.

```html
<div class="noxion-callout">
  <div class="noxion-callout__icon">{emoji}</div>
  <div class="noxion-callout__content">{text}</div>
</div>
```

---

### `DividerBlock`

**Notion type**: `divider`, also used for `breadcrumb`

```html
<hr class="noxion-divider" />
```

---

### `ToggleBlock`

**Notion type**: `toggle`

Renders a collapsible `<details>/<summary>` block.

```html
<details class="noxion-toggle">
  <summary class="noxion-toggle__summary">{summary text}</summary>
  <div class="noxion-toggle__content">{children}</div>
</details>
```

---

### `PageBlock`

**Notion type**: `page`

Renders a link to a Notion sub-page. The URL is generated via `mapPageUrl(blockId)`.

```html
<div class="noxion-page">
  <a href="{url}" class="noxion-page__link">
    <span class="noxion-page__icon">{icon}</span>
    <span class="noxion-page__title">{title}</span>
  </a>
</div>
```

---

### `EquationBlock`

**Notion type**: `equation`

Renders a block-level KaTeX math expression server-side via `katex.renderToString()`. Requires `@noxion/notion-renderer/katex-css` to be imported.

```html
<div class="noxion-equation noxion-equation--block">
  <!-- KaTeX HTML output -->
</div>
```

On render error, falls back to `<code class="noxion-equation-error">{raw expression}</code>`.

---

### `CodeBlock`

**Notion type**: `code`

Renders a code block with optional Shiki syntax highlighting. If `highlightCode` is not provided in the renderer context, falls back to plain `<pre><code>` with a language class.

```html
<div class="noxion-code">
  <div class="noxion-code__header">
    <span class="noxion-code__language">{language}</span>
  </div>
  <!-- with Shiki: -->
  <div class="noxion-code__body">{shiki HTML}</div>
  <!-- without Shiki: -->
  <pre class="noxion-code__body">
    <code class="noxion-code__content language-{lang}">{code}</code>
  </pre>
  <!-- optional caption: -->
  <figcaption class="noxion-code__caption">{caption}</figcaption>
</div>
```

See [Shiki](./shiki) for configuring syntax highlighting.

---

### `ImageBlock`

**Notion type**: `image`

Renders an image. Uses `mapImageUrl()` from context to transform the URL. Supports `components.Image` override for `next/image` integration.

```html
<figure class="noxion-image [noxion-image--full-width] [noxion-image--page-width]">
  <img
    src="{mapped url}"
    alt="{alt}"
    width="{width}"
    height="{height}"
    loading="lazy"
    decoding="async"
    class="noxion-image__img"
  />
  <figcaption class="noxion-image__caption">{caption}</figcaption>
</figure>
```

When `components.Image` is set, it renders that component instead of `<img>`.

---

### `VideoBlock`

**Notion type**: `video`

Renders a video via `<iframe>` (for YouTube, Vimeo, etc.) or `<video>` for direct file URLs.

```html
<div class="noxion-video">
  <iframe src="{url}" ... />
  <!-- or -->
  <video src="{url}" controls />
</div>
```

---

### `AudioBlock`

**Notion type**: `audio`

```html
<div class="noxion-audio">
  <audio src="{url}" controls class="noxion-audio__player" />
</div>
```

---

### `EmbedBlock`

**Notion types**: `embed`, `gist`, `figma`, `typeform`, `replit`, `codepen`, `excalidraw`, `tweet`, `maps`, `miro`, `drive`, `external_object_instance`

Renders all embed types as `<iframe>`.

```html
<div class="noxion-embed">
  <iframe
    src="{url}"
    class="noxion-embed__iframe"
    frameborder="0"
    allowfullscreen
  />
</div>
```

---

### `BookmarkBlock`

**Notion type**: `bookmark`

Renders a rich link preview with title, description, and URL from `block.properties`.

```html
<a href="{url}" class="noxion-bookmark" target="_blank" rel="noopener noreferrer">
  <div class="noxion-bookmark__content">
    <div class="noxion-bookmark__title">{title}</div>
    <div class="noxion-bookmark__description">{description}</div>
    <div class="noxion-bookmark__url">{url}</div>
  </div>
</a>
```

---

### `FileBlock`

**Notion type**: `file`

```html
<div class="noxion-file">
  <a href="{url}" class="noxion-file__link" download>
    <span class="noxion-file__icon">📎</span>
    <span class="noxion-file__name">{filename}</span>
  </a>
</div>
```

---

### `PdfBlock`

**Notion type**: `pdf`

```html
<div class="noxion-pdf">
  <iframe src="{url}" class="noxion-pdf__viewer" />
</div>
```

---

### `TableBlock`

**Notion type**: `table`

Renders a Notion table. Uses `block.content` to find `table_row` children.

```html
<table class="noxion-table">
  <tbody>
    <tr class="noxion-table__row">
      <td class="noxion-table__cell">{cell content}</td>
      ...
    </tr>
  </tbody>
</table>
```

---

### `ColumnListBlock` / `ColumnBlock`

**Notion types**: `column_list`, `column`

`ColumnListBlock` renders a CSS Grid container. `ColumnBlock` renders individual columns.

```html
<div class="noxion-column-list">
  <div class="noxion-column">{column content}</div>
  <div class="noxion-column">{column content}</div>
</div>
```

---

### `SyncedContainerBlock` / `SyncedReferenceBlock`

**Notion types**: `transclusion_container`, `transclusion_reference`

`SyncedContainerBlock` renders the original synced block content. `SyncedReferenceBlock` resolves the reference ID and renders it.

---

### `AliasBlock`

**Notion type**: `alias`

Resolves the alias target ID from `block.format.alias_pointer` and renders it using `NotionBlock`.

---

### `TableOfContentsBlock`

**Notion type**: `table_of_contents`

Collects all heading blocks from the page and renders a navigable list.

```html
<nav class="noxion-toc">
  <ul class="noxion-toc__list">
    <li class="noxion-toc__item noxion-toc__item--1">
      <a href="#heading-id">{heading text}</a>
    </li>
    ...
  </ul>
</nav>
```

---

### `CollectionViewPlaceholder`

**Notion types**: `collection_view`, `collection_view_page`

Renders a placeholder for Notion database views. Full database rendering is not supported; this component renders a notice with a link to the Notion page.

```html
<div class="noxion-collection-view-placeholder">
  <p>Database view — <a href="{notion url}" target="_blank">view in Notion</a></p>
</div>
```
