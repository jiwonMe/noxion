---
title: Context & Hooks
description: "@noxion/notion-renderer React context, provider, and hooks"
---

# Context & Hooks

```ts
import {
  NotionRendererProvider,
  useNotionRenderer,
  useNotionBlock,
} from "@noxion/notion-renderer";
```

The renderer uses a React context to pass configuration (record map, URL mappers, component overrides, theme settings) to all descendant block components. You can access this context in your own custom block overrides.

---

## `NotionRendererProvider`

The context provider. Used internally by `<NotionRenderer />` — you don't need to use this directly unless you're building a custom renderer from scratch.

### Props

```ts
interface NotionRendererProviderProps {
  value: NotionRendererContextValue;
  children: ReactNode;
}
```

### Usage

```tsx
import { NotionRendererProvider } from "@noxion/notion-renderer";

<NotionRendererProvider value={contextValue}>
  {children}
</NotionRendererProvider>
```

---

## `useNotionRenderer()`

Access the full renderer context from within any block component or custom override.

### Signature

```ts
function useNotionRenderer(): NotionRendererContextValue
```

### Returns

The full `NotionRendererContextValue` object. See [Context value](#context-value) for the shape.

### Usage

```tsx
import { useNotionRenderer } from "@noxion/notion-renderer";

function MyCustomBlock({ block }: NotionBlockProps) {
  const { recordMap, darkMode, mapImageUrl, components } = useNotionRenderer();

  return (
    <div className={darkMode ? "dark" : "light"}>
      {/* custom rendering */}
    </div>
  );
}
```

:::note
Must be called inside a component rendered within `<NotionRendererProvider>`. Since `<NotionRenderer />` wraps everything in the provider, any block component (including `blockOverrides`) can safely call this hook.
:::

---

## `useNotionBlock(blockId)` {#usenotionblock}

Resolve a Notion block by ID from the `recordMap`. Handles the nested `{ role, value }` wrapper that the unofficial Notion API sometimes returns.

### Signature

```ts
function useNotionBlock(blockId: string): Block | undefined
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `blockId` | `string` | The Notion block ID to resolve |

### Returns

`Block | undefined` — the resolved `Block` object from `notion-types`, or `undefined` if not found in the record map.

### Internal behavior

The unofficial Notion API sometimes wraps block values as:

```json
{
  "role": "reader",
  "value": { ...actual block data... }
}
```

`useNotionBlock()` unwraps this automatically, returning the inner `Block` regardless of the wrapper format.

### Usage

```tsx
import { useNotionBlock } from "@noxion/notion-renderer";

function MyCustomBlock({ blockId }: { blockId: string }) {
  const block = useNotionBlock(blockId);

  if (!block) return null;
  if (!block.alive) return null;

  return <div>{block.type}</div>;
}
```

---

## `useRendererPlugins()`

Access the array of renderer plugins from the context.

### Signature

```ts
function useRendererPlugins(): RendererPlugin[]
```

### Returns

`RendererPlugin[]` — the plugins array from the renderer context, or an empty array if no plugins are configured.

### Usage

```tsx
import { useRendererPlugins } from "@noxion/notion-renderer";

function MyCustomBlock({ block, blockId }: NotionBlockProps) {
  const plugins = useRendererPlugins();
  // Use plugins for custom block resolution logic
}
```

---

## `useResolvedBlockRenderer()`

Resolve the component that should render a specific block, considering plugin overrides.

### Signature

```ts
function useResolvedBlockRenderer(): (
  block: Block,
  blockId: string,
  parent?: Block
) => BlockOverrideResult | null
```

### Returns

A function that takes a block and returns the override result (component + props) if a plugin provides one, or `null` for default rendering.

### Usage

```tsx
import { useResolvedBlockRenderer } from "@noxion/notion-renderer";

function CustomBlockDispatch({ block, blockId }: { block: Block; blockId: string }) {
  const resolveRenderer = useResolvedBlockRenderer();
  const override = resolveRenderer(block, blockId);
  
  if (override) {
    const { component: Component, props } = override;
    return <Component block={block} blockId={blockId} level={0} {...props} />;
  }
  
  return <DefaultBlock block={block} />;
}
```

---

## Context value

### `NotionRendererContextValue`

```ts
interface NotionRendererContextValue {
  // The full Notion page data
  recordMap: ExtendedRecordMap;

  // Maps a Notion page ID to a URL path
  // Default: (id) => `/${id}`
  mapPageUrl: MapPageUrlFn;

  // Maps an image URL (e.g. S3 → stable proxy)
  // Default: (url) => url
  mapImageUrl: MapImageUrlFn;

  // Component overrides (Image, Link, PageLink, blockOverrides)
  components: NotionComponents;

  // Whether to render the full page with title header
  fullPage: boolean;

  // Current dark mode state
  darkMode: boolean;

  // Whether blur-up image previews are enabled
  previewImages: boolean;

  // Optional Shiki-backed code highlighter
  highlightCode?: HighlightCodeFn;

  // The resolved root page ID
  rootPageId?: string;

  // Fallback page icon (emoji or image URL)
  defaultPageIcon?: string | null;

  // Fallback cover image URL
  defaultPageCover?: string | null;

  // Fallback cover vertical position (0–1)
  defaultPageCoverPosition?: number;
  // Array of renderer plugins
  plugins?: RendererPlugin[];

  // Whether to show block action buttons
  showBlockActions?: boolean | ((blockType: string) => boolean);

  // Set of heading IDs already used (for duplicate dedup)
  headingIds?: Set<string>;
}
```

### Default context values

When accessed outside a provider, `useNotionRenderer()` returns a safe default:

```ts
{
  recordMap: { block: {}, collection: {}, collection_view: {}, collection_query: {}, notion_user: {}, signed_urls: {} },
  mapPageUrl: (id) => `/${id}`,
  mapImageUrl: (url) => url,
  components: {},
  fullPage: true,
  darkMode: false,
  previewImages: false,
  plugins: [],
  headingIds: new Set(),
}
```

---

## Type function signatures

```ts
// Maps a Notion page ID to a URL
type MapPageUrlFn = (pageId: string) => string;

// Maps an image source URL (transforms S3/Notion URLs to stable proxies)
type MapImageUrlFn = (url: string, block: Block) => string;

// Accepts raw code and a language identifier; returns HTML string
type HighlightCodeFn = (code: string, language: string) => string;
```

---

## Building a custom renderer

You can compose `NotionRendererProvider`, `NotionBlock`, and `NotionBlockList` to build your own renderer:

```tsx
"use client";
import {
  NotionRendererProvider,
  NotionBlock,
  useNotionRenderer,
} from "@noxion/notion-renderer";
import type { NotionRendererContextValue, ExtendedRecordMap } from "@noxion/notion-renderer";

function MyCustomHeader() {
  const { rootPageId, recordMap } = useNotionRenderer();
  // read page title from recordMap...
  return <h1 className="my-title">...</h1>;
}

export function MyRenderer({
  recordMap,
  rootPageId,
}: {
  recordMap: ExtendedRecordMap;
  rootPageId: string;
}) {
  const contextValue: NotionRendererContextValue = {
    recordMap,
    mapPageUrl: (id) => `/posts/${id}`,
    mapImageUrl: (url) => url,
    components: {},
    fullPage: false,
    darkMode: false,
    previewImages: false,
    rootPageId,
  };

  return (
    <NotionRendererProvider value={contextValue}>
      <article>
        <MyCustomHeader />
        <NotionBlock blockId={rootPageId} level={0} />
      </article>
    </NotionRendererProvider>
  );
}
```
