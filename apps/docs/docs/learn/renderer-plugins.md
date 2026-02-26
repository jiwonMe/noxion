---
sidebar_position: 11
title: Renderer Plugins
description: Customize and extend Notion block rendering with the render-time plugin system.
---

Renderer plugins allow you to intercept and modify the Notion rendering process at runtime. While core plugins transform data during the fetch phase, renderer plugins operate directly within the React rendering lifecycle, enabling dynamic transformations of blocks, text, and components.

---

## Core vs. Renderer Plugins

Noxion uses two distinct plugin systems:

| Feature | Core Plugins (@noxion/core) | Renderer Plugins (@noxion/notion-renderer) |
| :--- | :--- | :--- |
| **Phase** | Fetch/Build time | Render time (React) |
| **Target** | Page metadata, RSS, Analytics | Blocks, Rich text, Components |
| **Environment** | Node.js / Edge | Browser / Client Components |
| **Use Case** | Adding reading time, generating sitemaps | Rendering Mermaid diagrams, wikilinks |

---

## Using Built-in Plugins

Noxion includes several built-in plugins for common tasks. These are distributed as factory functions that you can pass to the `plugins` prop of `NotionRenderer`.

### Mermaid Diagrams
Renders code blocks with the `mermaid` language as interactive diagrams.

```tsx
import { NotionRenderer, createMermaidPlugin } from '@noxion/notion-renderer';

const plugins = [
  createMermaidPlugin({
    theme: 'default',
    darkTheme: 'dark'
  })
];

export function MyPage({ recordMap }) {
  return <NotionRenderer recordMap={recordMap} plugins={plugins} />;
}
```

### Enhanced Embeds
Automatically transforms standard Notion embeds (like YouTube or Twitter) into optimized, responsive components.

```tsx
import { createEmbedEnhancedPlugin } from '@noxion/notion-renderer';

const plugins = [
  createEmbedEnhancedPlugin({
    twitter: { theme: 'dark' },
    youtube: { cookie: false }
  })
];
```

### Text Transformations
Enables features like wikilinks (`[[Page Name]]`) or custom text replacements across all blocks.

```tsx
import { createTextTransformPlugin } from '@noxion/notion-renderer';

const plugins = [
  createTextTransformPlugin({
    enableWikilinks: true,
    mapWikilink: (slug) => `/docs/${slug}`
  })
];
```

---

## Creating a Custom Plugin

A renderer plugin is an object implementing the `RendererPlugin` interface.

### Step 1: Define the Plugin
This example creates a plugin that transforms specific callout blocks into "Alert" components if they use a specific icon.

```tsx
import { RendererPlugin, PluginPriority } from '@noxion/notion-renderer';
import { Alert } from './components/Alert';

export const alertPlugin: RendererPlugin = {
  name: 'alert-transform',
  priority: PluginPriority.NORMAL,

  blockOverride: ({ block }) => {
    const icon = block.format?.page_icon;
    
    if (block.type === 'callout' && icon === 'warning') {
      return {
        component: Alert,
        props: { type: 'error' }
      };
    }
    
    return null;
  }
};
```

### Step 2: Register the Plugin
Pass your custom plugin to the `NotionRenderer`.

```tsx
<NotionRenderer recordMap={recordMap} plugins={[alertPlugin]} />
```

---

## Plugin Hooks

The system includes five hooks to tap into different stages of rendering.

| Hook | Description |
| :--- | :--- |
| `blockOverride` | Intercepts a block and returns a custom React component. |
| `transformBlock` | Modifies the raw block data before it reaches any renderer. |
| `transformText` | Scans and replaces raw text strings with React components. |
| `onBlockRender` | Executes a side effect just before a block starts rendering. |
| `onBlockRendered` | Executes a side effect after a block has finished rendering. |

:::note
If multiple plugins provide a `blockOverride`, the first one to return a non-null result (based on priority) will be used.
:::

---

## Execution Priority

The `priority` field determines the order in which plugins run. Lower numbers execute first.

```ts
export enum PluginPriority {
  FIRST = 0,
  NORMAL = 50,
  LAST = 100
}
```

Use `PluginPriority.FIRST` for plugins that must modify data before others (like data sanitization) and `PluginPriority.LAST` for logging or analytics.

---

## Error Isolation

Renderer plugins are resilient. Each hook execution is wrapped in a `try/catch` block.

1. If a plugin throws an error, the renderer catches it.
2. A warning is logged to the console with the plugin name.
3. The renderer continues to the next plugin or falls back to default rendering.

This ensures that a single buggy plugin cannot crash your entire documentation site.

---

## Real-World Use Cases

### Custom Code Block Rendering
You can use `blockOverride` to replace the default code block with a custom component that includes a "Copy" button or line highlighting.

```tsx
const codeHighlightPlugin: RendererPlugin = {
  name: 'code-highlight',
  blockOverride: ({ block }) => {
    if (block.type === 'code') {
      return { component: MyCustomCodeBlock };
    }
    return null;
  }
};
```

### Wikilink Resolution
Use `transformText` to turn `[[Reference]]` syntax into internal links.

```tsx
const wikilinkPlugin: RendererPlugin = {
  name: 'wikilinks',
  transformText: ({ text }) => {
    const match = text.match(/\[\[(.*?)\]\]/);
    if (match) {
      return {
        text,
        replacements: [{
          start: match.index!,
          end: match.index! + match[0].length,
          component: <a href={`/p/${match[1]}`}>{match[1]}</a>
        }]
      };
    }
    return { text, replacements: [] };
  }
};
```

See [Plugin System API](../reference/notion-renderer/plugins) for complete type definitions and advanced configuration options.
