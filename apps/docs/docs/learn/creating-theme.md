---
sidebar_position: 10
title: Creating a Custom Theme
description: Build and publish a custom Noxion theme package with CSS variables and theme inheritance.
---

# Creating a Custom Theme

This guide walks you through creating a reusable Noxion theme that can be shared as an npm package.

---

## Step 1: Scaffold the theme

```bash
bun create noxion my-theme --theme
```

This generates:

```
my-theme/
├── src/
│   └── index.ts            # Theme package export
├── styles/
│   └── theme.css           # CSS variable overrides
├── package.json
└── tsconfig.json
```

---

## Step 2: Define your theme

Edit `src/index.ts` to configure your theme tokens:

```ts
import type { NoxionThemePackage } from "@noxion/renderer";

const myTheme: NoxionThemePackage = {
  name: "noxion-theme-midnight",
  tokens: {
    colors: {
      primary: "#8b5cf6",
      primaryHover: "#7c3aed",
      background: "#0f0f23",
      foreground: "#e2e8f0",
      card: "#1e1e3f",
      cardForeground: "#e2e8f0",
      muted: "#2a2a5e",
      mutedForeground: "#94a3b8",
      border: "#334155",
    },
    fonts: {
      sans: '"Inter", system-ui, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
  },
  metadata: {
    name: "Midnight",
    author: "Your Name",
    version: "1.0.0",
    description: "A dark purple theme for Noxion",
  },
  supports: ["blog", "docs", "portfolio"],
};

export default myTheme;
```

### Token reference

| Token group | Available tokens |
|-------------|-----------------|
| `colors.primary` | Primary accent color (links, buttons) |
| `colors.primaryHover` | Hover state for primary |
| `colors.background` | Page background |
| `colors.foreground` | Main text color |
| `colors.card` | Card/widget background |
| `colors.cardForeground` | Text on cards |
| `colors.muted` | Subtle background (code blocks, etc.) |
| `colors.mutedForeground` | Secondary/disabled text |
| `colors.border` | Default border color |
| `fonts.sans` | Sans-serif font stack |
| `fonts.mono` | Monospace font stack |

---

## Step 3: Add CSS overrides (optional)

For more granular control, edit `styles/theme.css`:

```css
:root {
  --noxion-border-radius: 0.75rem;
  --noxion-line-height-base: 1.8;
}

[data-theme="dark"] {
  --noxion-background: #0f0f23;
  --noxion-card: #1e1e3f;
}
```

---

## Step 4: Use `extendTheme()` for inheritance

Instead of building from scratch, extend the default theme:

```ts
import { extendTheme, themeDefault } from "@noxion/renderer";

const myTheme = extendTheme(themeDefault, {
  tokens: {
    colors: {
      primary: "#8b5cf6",
      primaryHover: "#7c3aed",
    },
  },
  metadata: {
    name: "Midnight",
    author: "Your Name",
    version: "1.0.0",
  },
});

export default myTheme;
```

`extendTheme()` performs a deep merge — you only need to specify the tokens you want to change.

---

## Step 5: Declare supported page types

The `supports` field tells Noxion which page types your theme has templates for:

```ts
supports: ["blog", "docs", "portfolio"]
```

If your theme only supports blog pages:

```ts
supports: ["blog"]
```

Noxion will fall back to the default theme's templates for unsupported page types.

---

## Step 6: Publish

```bash
npm publish
```

Users install and use your theme:

```bash
bun add noxion-theme-midnight
```

```ts
// noxion.config.ts
import { defineConfig } from "@noxion/core";
import midnightTheme from "noxion-theme-midnight";

export default defineConfig({
  theme: midnightTheme,
  // ...
});
```

---

## Theme metadata

Themes can include metadata for discovery and display:

```ts
interface NoxionThemeMetadata {
  name: string;
  author?: string;
  version?: string;
  description?: string;
  previewUrl?: string;
  repository?: string;
}
```
