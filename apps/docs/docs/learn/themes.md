---
sidebar_position: 7
title: Themes
description: Customize the look and feel of your Noxion site with Tailwind CSS, CSS variables, and dark mode.
---

# Themes

Noxion uses a **direct import** theme system. Each theme is an npm package that exports React components, layouts, and templates. You import what you need and compose your app directly — no providers, no contracts, no runtime indirection.

Visual customization is done through **Tailwind CSS utility classes** and **CSS custom properties (CSS variables)**.

---

## Built-in themes

Noxion ships with **2 official themes**, each published as an independent npm package:

| Theme | Package | Style |
|-------|---------|-------|
| **Default** | `@noxion/theme-default` | Clean, modern layout with system fonts, rounded cards, and a sticky header. The base theme for most sites. |
| **Beacon** | `@noxion/theme-beacon` | Content-first reading experience — extra-wide content area (1320px), static header, large typography. |

### Using a theme

Install the theme package and import the components you need:

```bash
bun add @noxion/theme-default
```

```tsx
// app/layout.tsx
import "@noxion/theme-default/styles/tailwind";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
```

```tsx
// app/site-layout.tsx
"use client";
import { BlogLayout, Header, Footer } from "@noxion/theme-default";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogLayout
      slots={{
        header: () => <Header siteName="My Blog" navigation={[{ label: "Home", href: "/" }]} />,
        footer: () => <Footer siteName="My Blog" author="Author" />,
      }}
    >
      {children}
    </BlogLayout>
  );
}
```

To switch themes, swap the imports:

```tsx
import { BlogLayout, Header, Footer } from "@noxion/theme-beacon";
```

### Theme exports

Each theme package exports:

| Category | Exports |
|----------|---------|
| **Components** | `Header`, `Footer`, `PostCard`, `FeaturedPostCard`, `PostList`, `HeroSection`, `TOC`, `Search`, `TagFilter`, `ThemeToggle`, `EmptyState`, `NotionPage`, `DocsSidebar`, `DocsBreadcrumb`, `PortfolioProjectCard`, `PortfolioFilter` |
| **Layouts** | `BaseLayout`, `BlogLayout`, `DocsLayout` |
| **Templates** | `HomePage`, `PostPage`, `ArchivePage`, `TagPage`, `DocsPage`, `PortfolioGrid`, `PortfolioProject` |
| **Styles** | `@noxion/theme-default/styles/tailwind` (Tailwind CSS entry), `@noxion/theme-default/styles` (CSS variables only) |

---

## Tailwind CSS setup

Noxion themes use **Tailwind CSS v4** with PostCSS. Each theme's `styles/tailwind.css` contains:

1. `@import "tailwindcss"` — loads the Tailwind base
2. `@custom-variant dark` — maps `dark:` utilities to `[data-theme="dark"]` instead of `@media (prefers-color-scheme: dark)`
3. `@source` — tells Tailwind which files to scan for class names
4. CSS variables for `:root` and `[data-theme="dark"]`

### Required PostCSS config

Your app needs a `postcss.config.mjs`:

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### Scanning app-level classes

If your app uses Tailwind classes (not just the theme), add `@source` in your `globals.css` to include your own files and workspace packages:

```css
/* app/globals.css */
@source "../../../packages/*/src/**/*.{ts,tsx}";
```

This ensures Tailwind generates utility classes for all components across the monorepo.

---

## Color modes

Three color modes are supported:

| Mode | Behavior |
|------|----------|
| `"light"` | Always light theme, ignores OS preference |
| `"dark"` | Always dark theme, ignores OS preference |
| `"system"` | Follows the user's OS dark/light mode setting |

Set the default in `noxion.config.ts`:

```ts
export default defineConfig({
  defaultTheme: "system",   // recommended
  // ...
});
```

The user's explicit choice (if they click the theme toggle) is persisted in `localStorage` and takes priority over `defaultTheme`.

### How dark mode works

Noxion uses `data-theme="dark"` on `<html>` to activate dark mode. The Tailwind `dark:` variant is mapped to this attribute via `@custom-variant`:

```css
/* In theme tailwind.css */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

This means all Tailwind `dark:` utilities (e.g. `dark:bg-gray-950`, `dark:text-gray-100`) respond to the `data-theme` attribute, not the OS media query directly.

---

## FOUC prevention

A common problem with JS-based theme systems is **Flash of Unstyled Content (FOUC)** — a brief flash of the wrong theme before React hydrates and applies the correct one.

Noxion prevents this by injecting a `<ThemeScript>` component into `<head>`. This script runs synchronously before paint, reads `localStorage` for any saved preference, and sets `data-theme="light"` or `data-theme="dark"` on `<html>` before any content is rendered:

```tsx
// app/layout.tsx (generated by create-noxion)
import { ThemeScript } from "./theme-script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

The `suppressHydrationWarning` on `<html>` is necessary because `data-theme` is set by the script before React hydrates.

---

## CSS variables

Each theme defines CSS custom properties on `:root` (light mode) and `[data-theme="dark"]`. These are set in the theme's `styles/tailwind.css`.

### Default theme tokens

```css
:root {
  --color-primary: #2563eb;
  --color-primary-foreground: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #171717;
  --color-muted: #f5f5f5;
  --color-muted-foreground: #737373;
  --color-border: #e5e5e5;
  --color-accent: #f5f5f5;
  --color-accent-foreground: #171717;
  --color-card: #ffffff;
  --color-card-foreground: #171717;

  --font-sans: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;

  --width-content: 1080px;
  --width-sidebar: 260px;
  --radius-default: 0.5rem;
}

[data-theme="dark"] {
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-background: #0a0a0a;
  --color-foreground: #ededed;
  --color-muted: #1a1a1a;
  --color-muted-foreground: #888888;
  --color-border: #1f1f1f;
  --color-accent: #1a1a1a;
  --color-accent-foreground: #ededed;
  --color-card: #111111;
  --color-card-foreground: #ededed;
}
```

---

## Customizing the theme

Override variables in your `globals.css`:

```css
/* app/globals.css */

:root {
  --color-primary: #7c3aed;       /* Violet instead of blue */
  --radius-default: 0.25rem;      /* More angular cards */
}

[data-theme="dark"] {
  --color-background: #0f0f23;
  --color-card: #16213e;
  --color-border: #1a1a2e;
}
```

### Using Google Fonts / next/font

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html style={{ "--font-sans": inter.style.fontFamily } as React.CSSProperties}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

## Theme toggle component

Each theme includes a `<ThemeToggle>` component that lets users switch between light, dark, and system modes. The toggle:

1. Reads the current preference via `useThemePreference()` from `@noxion/renderer`
2. Cycles through `system -> light -> dark` on click
3. Persists the choice to `localStorage`
4. Updates `data-theme` on `<html>` without a full page reload

### Hiding the toggle

If you want to remove the toggle (e.g., for a light-only site):

```ts
// noxion.config.ts
export default defineConfig({
  defaultTheme: "light",
  // ...
});
```

Then remove the `<ThemeToggle>` from your `<Header>` component.

---

## Hooks

For advanced customization, `@noxion/renderer` exports this React hook:

### `useThemePreference()`

Returns the user's **preference setting** (including `"system"`), the **resolved** value, and a setter:

```tsx
"use client";
import { useThemePreference } from "@noxion/renderer";
import type { ThemePreference } from "@noxion/renderer";

function ThemeSelector() {
  const { preference, resolved, setPreference } = useThemePreference();

  return (
    <select
      value={preference}
      onChange={(e) => setPreference(e.target.value as ThemePreference)}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

| Property | Type | Description |
|----------|------|-------------|
| `preference` | `ThemePreference` | The user's stored preference: `"light"`, `"dark"`, or `"system"`. |
| `resolved` | `"light" \| "dark"` | The actual applied mode after resolving `"system"` against the OS setting. |
| `setPreference` | `(pref: ThemePreference) => void` | Update the preference. Persisted to `localStorage` and immediately applied. |
