---
title: NotionPage
description: "@noxion/renderer NotionPage component — renders a full Notion page"
---

# `<NotionPage />`

```tsx
import { NotionPage } from "@noxion/renderer";
```

Renders a complete Notion page using [`@noxion/notion-renderer`](https://github.com/jiwonme/noxion/tree/main/packages/notion-renderer). This is a **Client Component** (`"use client"`), meaning it runs in the browser. The data fetching (`fetchPage()`) should happen in a Server Component; the rendering happens client-side.

The component automatically handles:
- **Dark mode detection** — observes `data-theme` on `<html>` via MutationObserver
- **Shiki syntax highlighting** — initializes asynchronously with dual-theme support (light + dark)
- **Image URL mapping** — converts Notion image URLs to stable `notion.so/image/` proxy URLs
- **KaTeX equations** — rendered server-side via `katex.renderToString()` (zero client-side math JS)

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `recordMap` | `ExtendedRecordMap` | ✅ | — | Full page data from `fetchPage()`. Contains all blocks, images, and metadata. |
| `rootPageId` | `string` | — | `undefined` | The root page ID. Used to resolve internal links to other Notion pages. Should be `post.id`. |
| `fullPage` | `boolean` | — | `true` | When `true`, renders the full page with the page title header. When `false`, renders only the page body blocks. |
| `darkMode` | `boolean` | — | auto | Force dark mode rendering. If not provided, auto-detects from `document.documentElement.dataset.theme`. |
| `previewImages` | `boolean` | — | `false` | Enable blur-up image preview. |
| `pageUrlPrefix` | `string` | — | `"/"` | URL prefix for internal Notion page links. Set to `"/"` to route sub-pages to your app. |
| `className` | `string` | — | `undefined` | CSS class applied to the outer wrapper `<div>`. |

---

## Basic usage

```tsx
// app/[slug]/page.tsx (Server Component)
import { fetchPage } from "@noxion/core";
import { NotionPage } from "@noxion/renderer";
import { notion } from "@/lib/notion";

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const recordMap = await fetchPage(notion, post.id);

  return (
    <article>
      <NotionPage
        recordMap={recordMap}
        rootPageId={post.id}
      />
    </article>
  );
}
```

---

## Syntax highlighting (Shiki)

The component automatically initializes [Shiki](https://shiki.style) for VS Code-quality syntax highlighting with dual-theme support. No configuration is needed.

**How it works internally:**

1. A module-level promise calls `createShikiHighlighter()` once on import
2. Shiki loads asynchronously with `github-light` and `github-dark` themes
3. 38 common languages are preloaded (Python, TypeScript, JavaScript, Go, Rust, etc.)
4. Languages not preloaded fall back to plain text (no error)
5. Code blocks render as plain text initially, then re-render with syntax highlighting once Shiki is ready

The dual-theme output uses CSS variables (`--shiki-dark`) for instant light/dark transitions without re-highlighting.

---

## Math equations (KaTeX)

Block equations (`equation` blocks) and inline equations (within rich text) are rendered via `katex.renderToString()` on the server side. No client-side KaTeX JavaScript is needed — only the KaTeX CSS is loaded.

---

## Dark mode

The component auto-detects the current theme by observing the `data-theme` attribute on `<html>`. This is set by `<ThemeScript>` before React hydrates, so the correct theme is applied immediately.

You only need to set `darkMode` manually if you're using `<NotionPage>` outside of the standard theme system:

```tsx
<NotionPage
  recordMap={recordMap}
  darkMode={true}
/>
```

---

## Image URL handling

The component automatically applies `defaultMapImageUrl()` from `notion-utils` to all image references, converting them to stable `notion.so/image/` proxy URLs. This means:

1. S3 presigned URLs (which expire in ~1 hour) are **never** used in the rendered output
2. All image URLs are stable proxy URLs that don't expire
3. `next/image` can safely cache and optimize these URLs

See [Image Optimization](../../learn/image-optimization) for the full explanation.

---

## Supported Notion block types

`@noxion/notion-renderer` renders 30+ Notion block types. See [Notion Setup → Supported block types](../../learn/notion-setup#supported-notion-block-types) for the complete list.

---

## Custom block renderers

`@noxion/notion-renderer` supports component overrides via the `components` prop on `NotionRenderer`. You can extend `<NotionPage>` in your own wrapper to customize specific block types:

```tsx
// components/CustomNotionPage.tsx
"use client";
import { NotionRenderer } from "@noxion/notion-renderer";
import type { ExtendedRecordMap } from "@noxion/core";

interface Props {
  recordMap: ExtendedRecordMap;
  pageId: string;
}

export function CustomNotionPage({ recordMap, pageId }: Props) {
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

The `NotionRenderer` accepts a `components` object where you can override individual block renderers. See the [`@noxion/notion-renderer` source](https://github.com/jiwonme/noxion/tree/main/packages/notion-renderer) for the full list of overridable components.

---

## CSS styling

All Notion blocks are styled with pure CSS using BEM naming convention (`noxion-{block}__{element}--{modifier}`). Styles are themed via `--noxion-*` CSS custom properties.

Import the styles in your global CSS:

```css
@import '@noxion/notion-renderer/styles';
```

See [Themes](../../learn/themes) for customizing colors, fonts, and spacing.
