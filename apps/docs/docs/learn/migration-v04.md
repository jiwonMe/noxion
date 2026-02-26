---
sidebar_position: 14
title: Migrating to v0.4
description: Upgrade your Noxion site to v0.4 with the new render-time plugin system, accessibility, and performance features.
---

# Migrating to Noxion v0.4

## Overview

Noxion v0.4 introduces a powerful render-time plugin system for the `@noxion/notion-renderer` package. This release focuses on extensibility, accessibility, and performance. You can now hook into the rendering lifecycle to customize block rendering, transform text patterns, and override components without modifying the core renderer.
This release is fully backward compatible. Existing configurations will continue to work without modification.
---
## Render-Time Plugin System
The plugin system is the most significant addition in v0.4. It allows developers to inject logic at specific points during the rendering process. Plugins can modify block data before it reaches a component, provide custom components for specific block types, or transform text content globally.
### Comparison
In v0.3, you relied solely on the `components` prop for overrides. In v0.4, plugins provide a more modular way to share and reuse rendering logic.
```tsx
// Before (v0.3): only blockOverrides
import { NotionRenderer } from '@noxion/notion-renderer';

const MyCodeBlock = ({ block }) => {
  return <pre>{JSON.stringify(block)}</pre>;
};

export const MyPage = ({ recordMap }) => (
  <NotionRenderer
    recordMap={recordMap}
    components={{ 
      blockOverrides: { 
        code: MyCodeBlock 
      } 
    }}
  />
);

// After (v0.4): plugins system layered on top
import { 
  NotionRenderer, 
  createMermaidPlugin, 
  createChartPlugin 
} from '@noxion/notion-renderer';

export const MyPage = ({ recordMap }) => (
  <NotionRenderer
    recordMap={recordMap}
    plugins={[
      createMermaidPlugin(), 
      createChartPlugin()
    ]}
  />
);
```

:::tip
Plugins are executed in the order they are provided in the array. If multiple plugins target the same block type, the last one in the list takes precedence for component overrides.
:::

---

## Built-in Plugins

Noxion v0.4 ships with five built-in plugins that handle common use cases.

### 1. createMermaidPlugin
This plugin detects code blocks with the `mermaid` language and renders them as interactive diagrams using Mermaid.js. It uses dynamic imports to keep the initial bundle size small.

```tsx
import { createMermaidPlugin } from '@noxion/notion-renderer';

const plugins = [createMermaidPlugin({ theme: 'dark' })];
```

### 2. createChartPlugin
Similar to the Mermaid plugin, this detects code blocks containing JSON data for Chart.js and renders them as live charts.

```tsx
import { createChartPlugin } from '@noxion/notion-renderer';

const plugins = [createChartPlugin()];
```

### 3. createCalloutTransformPlugin
This plugin allows you to transform standard Notion callouts into more complex UI elements like accordions or tabs based on their icon or content patterns.

```tsx
import { createCalloutTransformPlugin } from '@noxion/notion-renderer';

const plugins = [
  createCalloutTransformPlugin({
    transformMap: {
      'info': 'accordion',
      'tools': 'tab'
    }
  })
];
```

### 4. createEmbedEnhancedPlugin
Enhances the default embed block with better handling for YouTube, Twitter, and Figma links. It adds loading states and responsive wrappers automatically.

### 5. createTextTransformPlugin
Allows for global text replacement patterns. This is useful for auto-linking mentions, adding custom formatting, or sanitizing content.

```tsx
import { createTextTransformPlugin } from '@noxion/notion-renderer';

const plugins = [
  createTextTransformPlugin({
    rules: [
      {
        pattern: /@(\w+)/g,
        replace: (match, username) => (
          <a href={`https://twitter.com/${username}`}>@{username}</a>
        )
      }
    ]
  })
];
```

---

## New Components

Several new components have been added to improve the reliability and user experience of the renderer.

### BlockErrorBoundary
This component wraps every block by default. If a specific block fails to render due to a data error or a custom component crash, it isolates the failure. The rest of the page remains functional.

### HeadingAnchor
Headings now support clickable anchor links. When a user hovers over a heading, an anchor icon appears, allowing them to copy a direct link to that section.

```tsx
// You can customize the anchor icon via the components prop
<NotionRenderer
  recordMap={recordMap}
  components={{
    HeadingAnchor: ({ id }) => <a href={`#${id}`}>#</a>
  }}
/>
```

### BlockActions
This component provides block-level actions such as "Copy Link" or "Copy Code". It is particularly useful for code blocks and callouts.

### LoadingPlaceholder
A skeleton loading component used by lazy-loaded blocks (like Mermaid or Charts) to prevent layout shift while the heavy dependencies are being fetched.

---

## New Hooks

Two new hooks provide deeper access to the renderer state.

### useRendererPlugins()
Returns the list of active plugins and their resolved configurations. Use this if you are building custom components that need to interact with plugin logic.

### useResolvedBlockRenderer()
A low-level hook that determines which component will be used to render a given block. It accounts for core components, block overrides, and plugin overrides.

```tsx
const { Component, props } = useResolvedBlockRenderer(block);
```

---

## Accessibility Improvements

Accessibility is a core focus of v0.4. The following changes have been implemented:

1. **Interactive Elements**: All buttons and links generated by the renderer now include appropriate `aria-label` attributes.
2. **Keyboard Navigation**: Interactive blocks now support standard keyboard activation patterns. The `handleKeyboardActivation` utility ensures that "Enter" and "Space" keys trigger actions correctly.
3. **Heading IDs**: All headings now receive deterministic IDs generated via `generateHeadingId()`. This improves deep linking and screen reader navigation.
4. **Toggle Blocks**: Toggle blocks now use `aria-expanded` to communicate their state to assistive technologies.

---

## New Utilities

New utility functions are available for developers building custom extensions.

- **createLazyBlock()**: A wrapper that uses `IntersectionObserver` to delay the rendering of a block until it enters the viewport.
- **generateHeadingId()**: Creates a URL-friendly ID from a heading's text content.
- **getAriaLabel()**: A helper to generate consistent labels for blocks.
- **handleKeyboardActivation()**: A utility to simplify adding keyboard support to custom interactive components.

---

## Collection View (Table)

v0.4 introduces the first phase of database rendering. The `CollectionViewBlock` can now render Notion database views as HTML tables.

:::note
Phase 1 only supports the Table view. Board, Gallery, and Calendar views are planned for future releases.
:::

---

## showBlockActions Prop

You can now enable block-level actions globally or conditionally using the `showBlockActions` prop on the `NotionRenderer`.

```tsx
// Enable for all supported blocks
<NotionRenderer
  recordMap={recordMap}
  showBlockActions={true}
/>

// Enable only for code blocks
<NotionRenderer
  recordMap={recordMap}
  showBlockActions={(blockType) => blockType === 'code'}
/>
```

---

## Upgrading

To upgrade, update all Noxion dependencies to version 0.4.0.

```bash
bun add @noxion/notion-renderer@0.4.0 @noxion/renderer@0.4.0 @noxion/core@0.4.0
```

If you use npm or yarn:

```bash
npm install @noxion/notion-renderer@0.4.0 @noxion/renderer@0.4.0 @noxion/core@0.4.0
```

---

## No Breaking Changes

Noxion v0.4 is a drop-in replacement for v0.3. The `blockOverrides` API remains fully supported, and the new plugin system is additive. All existing props are preserved. If you do not use new features, your application will function without changes.
---

## Migration Checklist

Follow these steps to ensure a smooth transition to v0.4.
- [ ] Update all `@noxion` packages to version 0.4.0.
- [ ] Verify that existing `blockOverrides` still render correctly.
- [ ] Add the `createMermaidPlugin` if you need diagram support.
- [ ] Add the `createChartPlugin` if you need chart support.
- [ ] Enable `showBlockActions` if you want to provide copy buttons for code blocks.
- [ ] Check your CSS to ensure that `HeadingAnchor` elements are styled appropriately for your theme.
- [ ] Test keyboard navigation on toggle blocks and callouts.
