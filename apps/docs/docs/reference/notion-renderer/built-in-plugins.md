---
title: Built-in Plugins
description: Reference for the standard plugins included with @noxion/notion-renderer.
---

# Built-in Plugins

The `@noxion/notion-renderer` package includes several built-in plugins to handle specialized content types like diagrams, charts, and enhanced embeds.

---

## Mermaid Plugin {#mermaid}

Intercepts code blocks marked as Mermaid diagrams and renders them using the Mermaid.js library.

```ts
import { createMermaidPlugin } from '@noxion/notion-renderer';
```

### Options

```ts
export interface MermaidPluginOptions {
  theme?: "default" | "dark" | "forest";
  containerClass?: string;
}
```

### Usage

```tsx
const plugins = [
  createMermaidPlugin({ theme: 'dark' })
];
```

### Notion Setup
Create a **Code** block in Notion and set the language to `Mermaid`. The plugin will automatically intercept the block and render the diagram.

### Requirements
Requires `mermaid` as an optional peer dependency.
```bash
npm install mermaid
```

---

## Chart Plugin {#chart}

Renders interactive charts from JSON data within code blocks.

```ts
import { createChartPlugin } from '@noxion/notion-renderer';
```

### Options

```ts
export interface ChartPluginOptions {
  containerClass?: string;
}

export interface ChartConfig {
  type: "bar" | "line" | "pie";
  data: Record<string, unknown>;
  options?: Record<string, unknown>;
}
```

### Usage

```tsx
const plugins = [
  createChartPlugin({ containerClass: 'my-chart-container' })
];
```

### Notion Setup
Create a **Code** block in Notion and set the language to `chart`. The body of the code block must be a valid JSON object matching the `ChartConfig` interface.

### Requirements
Requires `chart.js` as an optional peer dependency.
```bash
npm install chart.js
```

---

## Callout Transform Plugin {#callout-transform}

Transforms standard Notion callout blocks into interactive components like accordions or tabs based on their icon.

```ts
import { createCalloutTransformPlugin } from '@noxion/notion-renderer';
```

### Options

```ts
export interface CalloutTransformOptions {
  iconMapping?: Record<string, "accordion" | "tab">;
  defaultOpen?: boolean;
}
```

### Usage

```tsx
const plugins = [
  createCalloutTransformPlugin({ defaultOpen: false })
];
```

### Notion Setup
The plugin triggers based on the emoji icon used in the Callout block:
- 📋 or ▶️: Renders as an **Accordion** (collapsible).
- 🗂️: Renders as a **Tab Group**.

### CSS Classes
- `.noxion-accordion`: Applied to accordion blocks.
- `.noxion-tabs`: Applied to tab group blocks.

---

## Embed Enhanced Plugin {#embed-enhanced}

Provides provider-specific enhancements for embedded content from popular platforms.

```ts
import { createEmbedEnhancedPlugin } from '@noxion/notion-renderer';
```

### Options

```ts
export interface EmbedEnhancedOptions {
  providers?: string[]; // Filter to specific providers; null = all
}
```

### Usage

```tsx
const plugins = [
  createEmbedEnhancedPlugin({ providers: ['youtube', 'figma'] })
];
```

### Supported Providers
- CodePen
- StackBlitz
- Figma
- YouTube
- CodeSandbox

### CSS Classes
Adds a provider-specific class: `noxion-embed--{provider}` (e.g., `noxion-embed--youtube`).

---

## Text Transform Plugin {#text-transform}

Transforms raw text content to support features like wikilinks and hashtags before decoration rendering.

```ts
import { createTextTransformPlugin } from '@noxion/notion-renderer';
```

### Options

```ts
export interface TextTransformOptions {
  enableWikilinks?: boolean; // default: true
  enableHashtags?: boolean; // default: true
  hashtagUrl?: (tag: string) => string;
  mapPageUrl?: (pageId: string) => string;
}
```

### Usage

```tsx
const plugins = [
  createTextTransformPlugin({
    mapPageUrl: (id) => `/docs/${id}`,
    hashtagUrl: (tag) => `/search?q=${tag}`
  })
];
```

### Notion Setup
- **Wikilinks**: Use the `[[Page Name]]` syntax in any text block.
- **Hashtags**: Use `#hashtag` syntax.

### CSS Classes
- `.noxion-color--blue`: Applied to hashtags if no `hashtagUrl` is provided.

---

## Using Multiple Plugins

You can combine multiple plugins to enable a wide range of features simultaneously.

```tsx
import { 
  NotionRenderer, 
  createMermaidPlugin, 
  createCalloutTransformPlugin,
  createTextTransformPlugin 
} from '@noxion/notion-renderer';

const plugins = [
  createMermaidPlugin(),
  createCalloutTransformPlugin(),
  createTextTransformPlugin({
    mapPageUrl: (id) => `/wiki/${id}`
  })
];

function MyRenderer({ recordMap }) {
  return (
    <NotionRenderer 
      recordMap={recordMap} 
      plugins={plugins} 
    />
  );
}
```
