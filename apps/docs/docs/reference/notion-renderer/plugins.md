---
title: Plugin System
description: Extend and customize the Notion rendering process with a flexible plugin architecture.
---

# Plugin System

The `@noxion/notion-renderer` includes a render-time plugin system that layers on top of the standard block overrides API. It allows for deep customization of block data, text content, and rendering logic without modifying the core renderer.

---

## Installation

Plugins are passed to the `NotionRenderer` component via the `plugins` prop.

```tsx
import { NotionRenderer, createMermaidPlugin } from '@noxion/notion-renderer';

const plugins = [
  createMermaidPlugin({ theme: 'dark' })
];

function MyPage({ recordMap }) {
  return (
    <NotionRenderer 
      recordMap={recordMap} 
      plugins={plugins} 
    />
  );
}
```

---

## RendererPlugin Interface {#rendererplugin}

The `RendererPlugin` interface defines the hooks available for customizing the rendering lifecycle.

```ts
export interface RendererPlugin {
  /** Unique name for the plugin */
  name: string;
  /** Execution priority. Lower numbers run first. */
  priority?: PluginPriority | number;
  /** Intercept block rendering and return a custom component */
  blockOverride?(args: BlockOverrideArgs): BlockOverrideResult | null;
  /** Modify block data before it reaches the renderer */
  transformBlock?(args: TransformBlockArgs): Block;
  /** Transform raw text before decorations are applied */
  transformText?(args: TransformTextArgs): TextTransformResult;
  /** Called when a block starts rendering */
  onBlockRender?(args: TransformBlockArgs): void;
  /** Called after a block has finished rendering */
  onBlockRendered?(args: TransformBlockArgs): void;
  /** Optional plugin-specific configuration */
  config?: Record<string, unknown>;
}
```

---

## Plugin Hooks

| Hook | When Called | Return Type | Use Case |
| :--- | :--- | :--- | :--- |
| `blockOverride` | Before rendering a block | `BlockOverrideResult \| null` | Intercept specific block types to render custom React components. |
| `transformBlock` | Before `blockOverride` | `Block` | Modify block properties or content before they are processed. |
| `transformText` | Before decoration rendering | `TextTransformResult` | Inject custom components or modify text (e.g., wikilinks, hashtags). |
| `onBlockRender` | Start of block render | `void` | Analytics, logging, or side effects before rendering. |
| `onBlockRendered` | End of block render | `void` | Post-render side effects or cleanup. |

---

## RendererPluginFactory {#rendererplugin-factory}

Most plugins are distributed as factories to allow for configuration.

```ts
export type RendererPluginFactory<Options = void> = Options extends void
  ? () => RendererPlugin
  : (options: Options) => RendererPlugin;
```

---

## Plugin Priority

The execution order is determined by the `priority` property. Plugins with lower priority values execute first.

```ts
export enum PluginPriority {
  FIRST = 0,
  NORMAL = 50,
  LAST = 100,
}
```

:::note
If multiple plugins provide a `blockOverride`, the first one to return a non-null result wins.
:::

---

## Error Isolation

The renderer wraps plugin calls in `try/catch` blocks. If a plugin fails, it will log a warning to the console but will not crash the entire rendering process. The renderer will simply proceed to the next plugin or the default rendering logic.

---

## Writing a Custom Plugin

Custom plugins can combine multiple hooks to create complex behaviors.

```tsx
import { RendererPlugin, PluginPriority } from '@noxion/notion-renderer';

const myCustomPlugin: RendererPlugin = {
  name: 'custom-mention',
  priority: PluginPriority.NORMAL,
  
  blockOverride: ({ block }) => {
    if (block.type === 'callout' && block.format?.page_icon === '💡') {
      return {
        component: MyCustomCallout,
        props: { theme: 'highlight' }
      };
    }
    return null;
  },

  transformText: ({ text }) => {
    if (text.includes('@admin')) {
      return {
        text,
        replacements: [{
          start: text.indexOf('@admin'),
          end: text.indexOf('@admin') + 6,
          component: <Badge color="red">Admin</Badge>
        }]
      };
    }
    return { text, replacements: [] };
  }
};
```

---

## Combining with blockOverrides

The `plugins` system works alongside the legacy `blockOverrides` prop. The execution order is:
1. `plugins.transformBlock`
2. `plugins.blockOverride` (if any returns a component, it is used)
3. `blockOverrides` prop (if no plugin intercepted the block)
4. Default renderer components

---

## Executor Functions {#executor-functions}

These functions are used internally by the renderer but are exported for advanced use cases.

| Function | Description |
| :--- | :--- |
| `resolveBlockRenderer` | Iterates through plugins to find a `blockOverride`. |
| `executeBlockTransforms` | Runs all `transformBlock` hooks sequentially. |
| `executeTextTransforms` | Runs all `transformText` hooks and collects replacements. |
| `applyTextTransforms` | Applies collected text replacements to a string, returning a `ReactNode[]`. |

---

## Type Exports

| Type | Description |
| :--- | :--- |
| `BlockOverrideArgs` | Arguments passed to `blockOverride`. |
| `BlockOverrideResult` | Expected return type for `blockOverride`. |
| `TransformBlockArgs` | Arguments passed to `transformBlock`. |
| `TransformTextArgs` | Arguments passed to `transformText`. |
| `TextReplacement` | Defines a component insertion point in text. |
| `TextTransformResult` | Result of a text transformation. |
