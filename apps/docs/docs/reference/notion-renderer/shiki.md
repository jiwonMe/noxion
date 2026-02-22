---
title: Shiki Integration
description: "@noxion/notion-renderer Shiki syntax highlighting — createShikiHighlighter and normalizeLanguage"
---

# Shiki Integration

```ts
import { createShikiHighlighter, normalizeLanguage } from "@noxion/notion-renderer";
```

`@noxion/notion-renderer` integrates [Shiki](https://shiki.style) for VS Code-quality syntax highlighting with dual-theme support (light + dark) via CSS custom properties.

---

## `createShikiHighlighter()`

Creates a `HighlightCodeFn` backed by Shiki. Call this once, then pass the result to `<NotionRenderer highlightCode={...} />`.

### Signature

```ts
async function createShikiHighlighter(options?: {
  theme?: string;      // Light theme name (Shiki theme ID)
  darkTheme?: string;  // Dark theme name (Shiki theme ID)
  langs?: string[];    // Language IDs to preload
}): Promise<HighlightCodeFn>
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | `string` | `"github-light"` | Shiki light theme ID |
| `darkTheme` | `string` | `"github-dark"` | Shiki dark theme ID |
| `langs` | `string[]` | 38 common languages | Language IDs to preload |

### Returns

`Promise<HighlightCodeFn>` — a synchronous function `(code: string, language: string) => string` that returns an HTML string with Shiki highlighting applied.

### Default languages

The following 38 languages are preloaded by default:

```
bash, c, cpp, csharp, css, dart, diff, docker, go, graphql, html,
java, javascript, json, jsx, kotlin, latex, lua, makefile, markdown,
objective-c, perl, php, python, r, ruby, rust, sass, scala, scss,
shellscript, sql, swift, toml, tsx, typescript, xml, yaml
```

Languages not in the preloaded set fall back to plain text rendering (no error thrown).

### Dual-theme output

Shiki outputs HTML with both light and dark color values using CSS custom properties:

```html
<span style="color: #24292e; --shiki-dark: #e1e4e8">...</span>
```

The `@noxion/notion-renderer/styles` CSS applies these automatically:

```css
.noxion-renderer--dark [data-shiki] span {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}
```

This means a single Shiki render pass produces correct output for both themes — no re-highlighting on theme switch.

### Example: basic usage

```tsx
"use client";
import { useEffect, useState } from "react";
import {
  NotionRenderer,
  createShikiHighlighter,
} from "@noxion/notion-renderer";
import type { HighlightCodeFn, ExtendedRecordMap } from "@noxion/notion-renderer";

// Module-level promise — Shiki loads once per app lifetime
const shikiPromise = createShikiHighlighter();

export function PostBody({
  recordMap,
  pageId,
}: {
  recordMap: ExtendedRecordMap;
  pageId: string;
}) {
  const [highlightCode, setHighlightCode] = useState<HighlightCodeFn | undefined>();

  useEffect(() => {
    shikiPromise.then(setHighlightCode);
  }, []);

  return (
    <NotionRenderer
      recordMap={recordMap}
      rootPageId={pageId}
      highlightCode={highlightCode}
    />
  );
}
```

### Example: custom theme

```ts
const highlighter = await createShikiHighlighter({
  theme: "catppuccin-latte",
  darkTheme: "catppuccin-mocha",
});
```

Any [Shiki bundled theme](https://shiki.style/themes) works. Theme IDs are kebab-case strings.

### Example: additional languages

```ts
const highlighter = await createShikiHighlighter({
  langs: [
    // Default languages
    "typescript", "javascript", "python", "go", "rust",
    // Additional
    "haskell", "elixir", "zig", "nix",
  ],
});
```

### Fallback behavior

When `highlightCode` is not provided to `<NotionRenderer />`, `CodeBlock` renders plain `<pre><code>` with a language class — no error, just no highlighting.

When Shiki is provided but the language is not in the preloaded set, the code also renders as plain text (Shiki checks `loadedLangs` before attempting to highlight).

---

## `normalizeLanguage()`

Convert a Notion language name to the corresponding Shiki language ID.

### Signature

```ts
function normalizeLanguage(notionLanguage: string): string
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `notionLanguage` | `string` | The language string from Notion (case-insensitive) |

### Returns

`string` — the Shiki language ID, or the original string (lowercased) if no mapping exists.

### Mapping table

Notion stores code block languages as display names. The function maps these to Shiki's language IDs:

| Notion name | Shiki ID |
|-------------|----------|
| `"JavaScript"` | `"javascript"` |
| `"TypeScript"` | `"typescript"` |
| `"Python"` | `"python"` |
| `"C++"` | `"cpp"` |
| `"C#"` | `"csharp"` |
| `"F#"` | `"fsharp"` |
| `"Shell"` | `"shellscript"` |
| `"Plain Text"` | `"text"` |
| `"Flow"` | `"javascript"` |
| `"LiveScript"` | `"javascript"` |
| `"Reason"` | `"javascript"` |
| `"Markup"` | `"html"` |
| `"Protobuf"` | `"proto"` |
| `"Java/C/C++/C#"` | `"java"` |
| `"VB.NET"` | `"vb"` |
| `"Visual Basic"` | `"vb"` |
| `"WebAssembly"` | `"wasm"` |
| (all others) | Direct lowercase passthrough |

### Example

```ts
normalizeLanguage("TypeScript"); // → "typescript"
normalizeLanguage("C++");        // → "cpp"
normalizeLanguage("Plain Text"); // → "text"
normalizeLanguage("Shell");      // → "shellscript"
normalizeLanguage("python");     // → "python" (already lowercase)
normalizeLanguage("custom-lang"); // → "custom-lang" (no mapping, passthrough)
```

### Usage

`normalizeLanguage()` is called automatically inside `CodeBlock`. Use it directly only if you're building a custom code block component.

---

## `HighlightCodeFn` type

```ts
type HighlightCodeFn = (code: string, language: string) => string;
```

The function takes the raw code string and the Notion language name, and returns an HTML string. The language is passed as the **Notion display name** (e.g. `"TypeScript"`) — the function is responsible for normalization.

`createShikiHighlighter()` returns a function that:
1. Calls `normalizeLanguage(language)` internally
2. Checks if the language is loaded
3. Returns Shiki HTML if loaded, or `escapeHtml(code)` as a fallback

You can provide your own `HighlightCodeFn` to use any highlighter:

```ts
// Example: using highlight.js instead of Shiki
import hljs from "highlight.js";
import { normalizeLanguage } from "@noxion/notion-renderer";

const customHighlighter: HighlightCodeFn = (code, language) => {
  const lang = normalizeLanguage(language);
  try {
    return hljs.highlight(code, { language: lang }).value;
  } catch {
    return code;
  }
};

<NotionRenderer
  recordMap={recordMap}
  highlightCode={customHighlighter}
/>
```
