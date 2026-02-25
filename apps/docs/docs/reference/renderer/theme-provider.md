---
title: Theme Hooks
description: "@noxion/renderer theme hooks — useThemePreference for color mode management"
---

# Theme Hooks

```tsx
import { useThemePreference } from "@noxion/renderer";
```

`@noxion/renderer` provides the `useThemePreference()` hook for managing color mode (light/dark/system). Theme components, layouts, and templates are imported directly from theme packages — no provider required.

---

## Setup

```tsx
// app/layout.tsx
import "@noxion/theme-default/styles/tailwind";
import "./globals.css";

function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('noxion-theme');
        var theme = stored || 'system';
        if (theme === 'system') {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.dataset.theme = theme;
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

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

### Why `suppressHydrationWarning`?

The `<ThemeScript>` sets `data-theme="light"` or `data-theme="dark"` on `<html>` before React hydrates. This creates a mismatch between the server-rendered HTML (no `data-theme` attribute) and the client-side DOM (with `data-theme`). React would normally warn about this hydration mismatch, so `suppressHydrationWarning` silences it.

This is a well-known pattern for theme systems. See [React docs on suppressHydrationWarning](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors).

---

## `useThemePreference()`

Returns the user's **preference setting** (including `"system"`), the resolved mode, and a function to change it.

### Signature

```ts
function useThemePreference(): {
  preference: ThemePreference;   // "light" | "dark" | "system"
  resolved: "light" | "dark";   // actual applied mode
  setPreference: (pref: ThemePreference) => void;
}
```

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `preference` | `ThemePreference` | The user's stored preference. `"system"` if following OS setting. |
| `resolved` | `"light" \| "dark"` | The actual applied mode after resolving `"system"` against the OS preference. |
| `setPreference` | `(pref: ThemePreference) => void` | Update the preference. Persisted to `localStorage` and immediately applied. |

### Usage

```tsx
"use client";
import { useThemePreference } from "@noxion/renderer";
import type { ThemePreference } from "@noxion/renderer";

function ThemeToggle() {
  const { preference, setPreference } = useThemePreference();

  const cycleTheme = () => {
    const order: ThemePreference[] = ["system", "light", "dark"];
    const currentIndex = order.indexOf(preference);
    setPreference(order[(currentIndex + 1) % order.length]);
  };

  return (
    <button onClick={cycleTheme} aria-label={`Current theme: ${preference}`}>
      {preference === "light" ? "☀️" : preference === "dark" ? "🌙" : "💻"}
    </button>
  );
}
```

### Persistence

`setPreference()` writes the preference to `localStorage` under the key `"noxion-theme"`. On subsequent page loads, `<ThemeScript>` reads this key and applies the preference before React hydrates.

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
3. React hydrates — useThemePreference() reads data-theme from <html>
4. User clicks toggle → setPreference() updates localStorage AND data-theme
5. CSS responds to [data-theme="dark"] selector
6. Tailwind dark: utilities activate via @custom-variant
```

This architecture ensures zero FOUC (Flash of Unstyled Content) regardless of the user's preference or network speed.

### Media query responsiveness

When `preference === "system"`, the theme responds to real-time OS preference changes:

```ts
// Inside useThemePreference()
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", (e) => {
  if (preference === "system") {
    applyTheme(e.matches ? "dark" : "light");
  }
});
```

This means if the user switches their OS from light to dark mode while on your blog (with `preference === "system"`), the blog updates automatically without a page reload.
