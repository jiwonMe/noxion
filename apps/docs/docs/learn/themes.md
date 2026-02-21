---
sidebar_position: 7
title: Themes
description: Customize the look and feel of your Noxion blog.
---

# Themes

Noxion uses **CSS variables** for theming — no build step needed to change colors.

## Color modes

Three modes are supported: `"light"`, `"dark"`, `"system"` (follows OS preference).

```ts
// noxion.config.ts
export default defineConfig({
  defaultTheme: "system",
  // ...
});
```

The theme toggle component is included in the default layout.

## CSS variables

Override any variable in your global CSS to customize the look:

```css
/* globals.css */
:root {
  --noxion-primary: #2563eb;
  --noxion-background: #ffffff;
  --noxion-foreground: #0a0a0a;
  --noxion-muted: #f5f5f5;
  --noxion-mutedForeground: #737373;
  --noxion-card: #ffffff;
  --noxion-cardForeground: #0a0a0a;
  --noxion-border: #e5e5e5;
  --noxion-border-radius: 0.5rem;
  --noxion-font-sans: system-ui, -apple-system, sans-serif;
}

[data-theme="dark"] {
  --noxion-background: #0a0a0a;
  --noxion-foreground: #fafafa;
  --noxion-card: #1a1a1a;
  --noxion-border: #2a2a2a;
}
```

## FOUC prevention

The `ThemeScript` component injected into `<head>` reads `localStorage` before React hydrates, preventing flash of unstyled content:

```tsx
// layout.tsx
import { ThemeScript } from "./theme-script";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        {/* ... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```
