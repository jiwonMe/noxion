---
title: Inline Components
description: "@noxion/notion-renderer Text and InlineEquation — rich-text and math rendering"
---

# Inline Components

```ts
import { Text, InlineEquation } from "@noxion/notion-renderer";
```

These components handle rendering at the **inline** level — within a paragraph, heading, or any block that contains rich text.

---

## `<Text />` {#text}

The rich-text renderer. Converts a Notion `Decoration[]` array into a React element tree, applying all inline formatting, links, mentions, and inline equations.

### Import

```tsx
import { Text } from "@noxion/notion-renderer";
import type { TextProps } from "@noxion/notion-renderer";
```

### Props

```ts
interface TextProps {
  value?: Decoration[];
}
```

`Decoration` is re-exported from `notion-types`:

```ts
type Decoration = [string, DecorationItem[]?];
// e.g.
// ["Hello, ", [["b"], ["i"]]]  → <strong><em>Hello, </em></strong>
// ["world"]                     → "world"
```

### Supported decorations

| Decoration code | Renders |
|----------------|---------|
| `"b"` | `<strong>` |
| `"i"` | `<em>` |
| `"s"` | `<s>` (strikethrough) |
| `"c"` | `<code class="noxion-inline-code">` |
| `"_"` | `<span class="noxion-inline-underscore">` |
| `"h"` | `<span class="noxion-color--{color}">` |
| `"a"` | `<a class="noxion-link" href="{url}">` (uses `components.Link` if set) |
| `"e"` | `<InlineEquation expression="{latex}">` |
| `"p"` | Page mention → `<a>` linking to mapped page URL |
| `"‣"` | User mention → `<span class="noxion-user-mention">` |
| `"d"` | Date → formatted string via `formatNotionDate()` |
| `"u"` | User mention → display name |
| `"lm"` | Link mention → `<a class="noxion-link noxion-link-mention">` |

Decorations can be **stacked** — a single text segment can be bold + italic + colored simultaneously.

### Usage in custom blocks

When building a custom block override, use `<Text>` to render any rich-text `Decoration[]`:

```tsx
import type { NotionBlockProps } from "@noxion/notion-renderer";
import { Text } from "@noxion/notion-renderer";
import type { Decoration } from "notion-types";

export function MyCustomBlock({ block }: NotionBlockProps) {
  const properties = block.properties as { title?: Decoration[] } | undefined;

  return (
    <div className="my-block">
      <Text value={properties?.title} />
    </div>
  );
}
```

### Color classes

When a text segment has a color decoration (`"h"`), `<Text>` emits a `<span class="noxion-color--{color}">`. The following color names map to Notion's color system:

| Class | Color |
|-------|-------|
| `noxion-color--gray` | Gray text |
| `noxion-color--brown` | Brown text |
| `noxion-color--orange` | Orange text |
| `noxion-color--yellow` | Yellow text |
| `noxion-color--teal` | Teal / green text |
| `noxion-color--blue` | Blue text |
| `noxion-color--purple` | Purple text |
| `noxion-color--pink` | Pink text |
| `noxion-color--red` | Red text |
| `noxion-color--gray_background` | Gray background |
| `noxion-color--brown_background` | Brown background |
| `noxion-color--orange_background` | Orange background |
| `noxion-color--yellow_background` | Yellow background |
| `noxion-color--teal_background` | Teal background |
| `noxion-color--blue_background` | Blue background |
| `noxion-color--purple_background` | Purple background |
| `noxion-color--pink_background` | Pink background |
| `noxion-color--red_background` | Red background |

These are defined in `@noxion/notion-renderer/styles`.

---

## `<InlineEquation />` {#inlineequation}

Renders a KaTeX inline math expression server-side via `katex.renderToString()`.

### Import

```tsx
import { InlineEquation } from "@noxion/notion-renderer";
```

### Props

```ts
interface InlineEquationProps {
  expression: string; // LaTeX expression string
}
```

### Behavior

- Renders with `displayMode: false` (inline mode)
- `throwOnError: false` — invalid LaTeX does not throw; falls back to `<code class="noxion-equation-error">{expression}</code>`
- Requires `@noxion/notion-renderer/katex-css` to be imported for proper display

### Usage

```tsx
import { InlineEquation } from "@noxion/notion-renderer";

// Inline: E = mc^2
<InlineEquation expression="E = mc^2" />

// Output:
// <span class="noxion-equation noxion-equation--inline">
//   <!-- KaTeX HTML -->
// </span>
```

### Importing KaTeX styles

```css
/* In your global CSS file */
@import '@noxion/notion-renderer/katex-css';
```

Or in your root layout:

```tsx
// app/layout.tsx
import "@noxion/notion-renderer/katex-css";
```

:::note
`<Text />` automatically renders inline equations using `<InlineEquation />` when it encounters an `"e"` decoration. You only need to use `<InlineEquation />` directly in custom components that render LaTeX without going through `<Text />`.
:::
