---
sidebar_position: 8
title: Syntax Highlighting
description: VS Code-quality code block rendering with Shiki, dual themes, 38+ languages, zero client JS.
---

Noxion uses [Shiki](https://shiki.style/) to provide high-quality syntax highlighting for code blocks. Unlike Prism or Highlight.js, Shiki uses the same TextMate grammar engine as VS Code, ensuring that your code looks exactly as it does in your editor.

---

## How it Works

Noxion renders code blocks entirely on the server. The highlighting process happens during the build or request phase, which means the final HTML sent to the browser already contains the necessary styling. This approach eliminates the need for heavy client-side highlighting libraries and prevents layout shifts.

The core of this system is the `createShikiHighlighter` function. It initializes the Shiki engine and returns a `HighlightCodeFn` that the `NotionRenderer` uses to process code blocks.

```typescript
import { createShikiHighlighter } from '@noxion/notion-renderer';

// Initialize the highlighter
const highlightCode = await createShikiHighlighter({
  theme: 'github-light',
  darkTheme: 'github-dark',
});

// The resulting function matches this type:
// type HighlightCodeFn = (code: string, language: string) => string;
```

---

## Automatic Configuration

If you use the high-level `<NotionPage />` component from `@noxion/renderer`, syntax highlighting is configured automatically. It uses `github-light` and `github-dark` themes by default.

```tsx
import { NotionPage } from '@noxion/renderer';

export default function Page({ recordMap }) {
  return <NotionPage recordMap={recordMap} />;
}
```

For custom implementations using the low-level `NotionRenderer`, you must pass the highlighter function manually:

```tsx
import { NotionRenderer, createShikiHighlighter } from '@noxion/notion-renderer';

const highlightCode = await createShikiHighlighter();

<NotionRenderer recordMap={recordMap} highlightCode={highlightCode} />
```

---

## Dual-Theme Support

Noxion supports simultaneous light and dark theme rendering. When you provide both `theme` and `darkTheme` to the highlighter, Shiki generates HTML that contains tokens for both themes.

Visibility is controlled via CSS variables. The renderer applies specific classes to the generated code blocks, allowing your site's theme toggle to switch between them instantly without re-rendering.

:::tip
This dual-theme approach is particularly useful for static sites where you want to support dark mode without any "flash" of the wrong theme on initial load.
:::

---

## Supported Languages

Noxion includes 38 commonly used languages by default. This selection balances feature coverage with bundle size and performance.

| Language | Shiki ID | Language | Shiki ID |
| :--- | :--- | :--- | :--- |
| Bash | `bash` | C | `c` |
| C++ | `cpp` | C# | `csharp` |
| CSS | `css` | Dart | `dart` |
| Diff | `diff` | Docker | `docker` |
| Go | `go` | GraphQL | `graphql` |
| HTML | `html` | Java | `java` |
| JavaScript | `javascript` | JSON | `json` |
| JSX | `jsx` | Kotlin | `kotlin` |
| LaTeX | `latex` | Lua | `lua` |
| Makefile | `makefile` | Markdown | `markdown` |
| Objective-C | `objective-c` | Perl | `perl` |
| PHP | `php` | Python | `python` |
| R | `r` | Ruby | `ruby` |
| Rust | `rust` | Sass | `sass` |
| Scala | `scala` | SCSS | `scss` |
| Shell | `shellscript` | SQL | `sql` |
| Swift | `swift` | TOML | `toml` |
| TSX | `tsx` | TypeScript | `typescript` |
| XML | `xml` | YAML | `yaml` |

---

## Language Mapping

Notion often uses human-readable names or aliases for languages that don't match Shiki's internal IDs. Noxion automatically normalizes these names using the `normalizeLanguage` utility.

| Notion Name | Shiki ID |
| :--- | :--- |
| `c++` | `cpp` |
| `c#` | `csharp` |
| `flow` | `javascript` |
| `shell` | `shellscript` |
| `plain text` | `text` |
| `java/c/c++/c#` | `java` |
| `markup` | `html` |

See [Shiki Reference](../reference/notion-renderer/shiki) for the full language mapping table.

---

## Custom Configuration

You can customize the highlighter by passing options to `createShikiHighlighter`. This allows you to change themes or add support for additional languages not included in the default set.

```typescript
const highlightCode = await createShikiHighlighter({
  theme: 'nord',
  darkTheme: 'dracula',
  langs: ['python', 'rust', 'zig'], // Only load these specific languages
});
```

:::warning
Loading a large number of additional languages can increase your server-side execution time and memory usage. Stick to the languages you actually use in your Notion workspace.
:::

---

## Performance

Shiki runs entirely at build or render time. The output is pure HTML with inline styles or CSS variables.

- **Zero Client JS**: Users don't download any JavaScript for syntax highlighting.
- **No Layout Shift**: Since the highlighting is baked into the HTML, code blocks don't "pop in" after the page loads.
- **Fast Execution**: Noxion caches the highlighter instance to ensure subsequent renders are extremely fast.

For more technical details on the implementation, check the [Shiki Reference](../reference/notion-renderer/shiki).
