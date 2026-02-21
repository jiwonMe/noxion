---
title: ThemeProvider
description: "@noxion/renderer ThemeProvider, useNoxionTheme, and useThemePreference"
---

# `<NoxionThemeProvider />`

```tsx
import { NoxionThemeProvider } from "@noxion/renderer";
```

Provides the theme context to all Noxion components. Must wrap the entire app (or at minimum all components that use theme-aware features).

In the generated app, this is already set up in `app/layout.tsx`.

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `defaultMode` | `ThemeMode` | — | `"system"` | The initial color mode. Should match `config.defaultTheme`. |
| `children` | `ReactNode` | ✅ | — | Your app tree. |

---

## Setup

```tsx
// app/layout.tsx
import { NoxionThemeProvider } from "@noxion/renderer";
import { ThemeScript } from "./theme-script";
import { siteConfig } from "@/lib/config";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <head>
        {/* Prevents FOUC — must be in <head> */}
        <ThemeScript />
      </head>
      <body>
        <NoxionThemeProvider defaultMode={siteConfig.defaultTheme}>
          {children}
        </NoxionThemeProvider>
      </body>
    </html>
  );
}
```

### Why `suppressHydrationWarning`?

The `<ThemeScript>` sets `data-theme="light"` or `data-theme="dark"` on `<html>` before React hydrates. This creates a mismatch between the server-rendered HTML (no `data-theme` attribute) and the client-side DOM (with `data-theme`). React would normally warn about this hydration mismatch, so `suppressHydrationWarning` silences it.

This is a well-known pattern for theme systems. See [React docs on suppressHydrationWarning](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors).

---

## `useNoxionTheme()`

Returns the **currently active theme** (resolved — `"system"` is never returned; it's always resolved to either `"light"` or `"dark"`).

### Signature

```ts
function useNoxionTheme(): { name: "light" | "dark" }
```

### Returns

An object with a `name` property: `"light"` or `"dark"`.

### Usage

```tsx
"use client";
import { useNoxionTheme } from "@noxion/renderer";

function ThemeAwareComponent() {
  const { name } = useNoxionTheme();

  return (
    <div className={name === "dark" ? "dark-variant" : "light-variant"}>
      Current theme: {name}
    </div>
  );
}
```

This hook is useful for programmatically applying theme-specific behavior — for example, setting a comment system's theme to match Noxion's active theme.

### Error behavior

Throws an error if called outside of `<NoxionThemeProvider>`:

```
Error: useNoxionTheme must be used within a NoxionThemeProvider
```

---

## `useThemePreference()`

Returns the user's **preference setting** (including `"system"`) and a function to change it.

### Signature

```ts
function useThemePreference(): {
  mode: ThemeMode;         // "light" | "dark" | "system"
  setMode: (mode: ThemeMode) => void;
}
```

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `mode` | `ThemeMode` | The user's current preference. `"system"` if following OS setting. |
| `setMode` | `(mode: ThemeMode) => void` | Update the preference. Persisted to `localStorage` and immediately applied. |

### Usage

```tsx
"use client";
import { useThemePreference } from "@noxion/renderer";
import type { ThemeMode } from "@noxion/core";

function ThemeToggle() {
  const { mode, setMode } = useThemePreference();

  const cycleTheme = () => {
    const order: ThemeMode[] = ["light", "dark", "system"];
    const currentIndex = order.indexOf(mode);
    setMode(order[(currentIndex + 1) % order.length]);
  };

  return (
    <button onClick={cycleTheme} aria-label={`Current theme: ${mode}`}>
      {mode === "light" ? "☀️" : mode === "dark" ? "🌙" : "💻"}
    </button>
  );
}
```

### Persistence

`setMode()` writes the preference to `localStorage` under the key `"noxion-theme"`. On subsequent page loads, `<ThemeScript>` reads this key and applies the preference before React hydrates.

---

## Theme resolution logic

The full theme resolution flow:

```
1. User visits page
2. <ThemeScript> runs synchronously in <head>:
   a. Checks localStorage["noxion-theme"]
   b. If set: use that value ("light" or "dark")
   c. If "system" or not set: check window.matchMedia("(prefers-color-scheme: dark)")
   d. Set <html data-theme="light|dark">
3. React hydrates — <NoxionThemeProvider> reads data-theme from <html>
4. User clicks toggle → setMode() updates localStorage AND data-theme
5. CSS responds to [data-theme="dark"] selector
```

This architecture ensures zero FOUC (Flash of Unstyled Content) regardless of the user's preference or network speed.

### Media query responsiveness

When `mode === "system"`, the theme responds to real-time OS preference changes:

```ts
// Inside NoxionThemeProvider
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", (e) => {
  if (mode === "system") {
    applyTheme(e.matches ? "dark" : "light");
  }
});
```

This means if the user switches their OS from light to dark mode while on your blog (with `mode === "system"`), the blog updates automatically without a page reload.
