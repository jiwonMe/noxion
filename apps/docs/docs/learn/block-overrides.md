---
sidebar_position: 10
title: Customizing Block Rendering
description: Override how Notion blocks are rendered using block overrides and custom components.
---

Noxion includes a flexible system for customizing how Notion content is rendered. You can replace default components for images and links, or completely override the rendering logic for specific Notion block types like callouts, code blocks, or images.

---

## The `components` Prop

The `NotionRenderer` component accepts a `components` prop to inject custom React components into the rendering tree.

```tsx
import { NotionRenderer } from '@noxion/notion-renderer';
import { MyImage } from './components/MyImage';
import { MyLink } from './components/MyLink';

export function MyPage({ recordMap }) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      components={{
        Image: MyImage,
        Link: MyLink,
        PageLink: MyLink, // Used for internal Notion page links
      }}
    />
  );
}
```

### Common Component Overrides

| Component | Description | Props |
| :--- | :--- | :--- |
| `Image` | Replaces all images in the document. | `src`, `alt`, `width`, `height`, `className` |
| `Link` | Replaces external URLs in rich text. | `href`, `className`, `children` |
| `PageLink` | Replaces internal Notion page links. | `href`, `className`, `children` |
| `nextImage` | Specifically for Next.js `next/image` integration. | `Record<string, unknown>` |

---

## Overriding Specific Blocks

The `blockOverrides` property within the `components` prop targets specific Notion block types. This changes the UI of a specific block without affecting others.

### Example: Custom Callout
This example replaces the default Notion callout with a custom styled component.

```tsx
import { NotionRenderer, NotionBlockProps } from '@noxion/notion-renderer';

const CustomCallout = ({ block, children }: NotionBlockProps) => {
  const icon = block.format?.page_icon;
  
  return (
    <div className="custom-callout">
      <span className="callout-icon">{icon}</span>
      <div className="callout-content">{children}</div>
    </div>
  );
};

export function MyPage({ recordMap }) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      components={{
        blockOverrides: {
          callout: CustomCallout,
        },
      }}
    />
  );
}
```

### The `NotionBlockProps` Interface
Every custom block component receives these props:

| Prop | Type | Description |
| :--- | :--- | :--- |
| `block` | `Block` | The raw Notion block data. |
| `blockId` | `string` | The UUID of the block. |
| `level` | `number` | The nesting depth of the block. |
| `children` | `ReactNode` | The rendered children of the block. |

---

## URL Mapping

Customize page and image URL resolution using `mapPageUrl` and `mapImageUrl`.

### Mapping Page URLs
By default, internal links use the Notion page ID. You can map these to custom paths.

```tsx
<NotionRenderer
  recordMap={recordMap}
  mapPageUrl={(pageId) => `/blog/${pageId}`}
/>
```

### Mapping Image URLs
Useful for proxying images or adding transformation parameters (e.g., for Cloudinary or Imgix).

```tsx
<NotionRenderer
  recordMap={recordMap}
  mapImageUrl={(url, block) => {
    if (url.startsWith('https://s3.us-west-2.amazonaws.com')) {
      return `https://my-proxy.com/image?url=${encodeURIComponent(url)}`;
    }
    return url;
  }}
/>
```

---

## Block Actions

The `showBlockActions` prop (v0.4+) enables interactive buttons on blocks, such as "Copy Code" or "Share Link".

```tsx
<NotionRenderer
  recordMap={recordMap}
  showBlockActions={true} // Enable for all supported blocks
/>

// Or selectively enable per block type
<NotionRenderer
  recordMap={recordMap}
  showBlockActions={(blockType) => blockType === 'code'}
/>
```

---

## Combining Overrides and Plugins

Block overrides and [Renderer Plugins](./renderer-plugins) work together to provide a layered customization system.

1. **Plugins** run first. If a plugin's `blockOverride` hook returns a component, it takes precedence.
2. **`blockOverrides`** prop is checked next if no plugin intercepted the block.
3. **Default Renderers** are used as a final fallback.

Use `blockOverrides` for simple UI replacements and **Renderer Plugins** when you need to transform data or apply logic across multiple block types.

---

## Real-World Examples

### Code Block with Copy Button
Build a fully custom code block experience if the default `showBlockActions` is insufficient:

```tsx
const CustomCode = ({ block }: NotionBlockProps) => {
  const content = block.properties?.title?.[0]?.[0] || '';
  
  return (
    <div className="code-container">
      <pre><code>{content}</code></pre>
      <button onClick={() => navigator.clipboard.writeText(content)}>
        Copy
      </button>
    </div>
  );
};
```

### Image with Lightbox
Wrap the default image rendering with a lightbox component.

```tsx
const LightboxImage = (props: any) => {
  return (
    <div className="lightbox-wrapper">
      <img {...props} onClick={() => openLightbox(props.src)} />
    </div>
  );
};

// Register in components.Image
```

See [NotionRenderer API Reference](../reference/notion-renderer/renderer-api) for the full list of available props and types.
