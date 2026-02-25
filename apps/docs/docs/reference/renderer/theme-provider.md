---
title: ThemeProvider
description: "@noxion/renderer ThemeProvider, theme contract hooks, and useThemePreference"
---

# `<NoxionThemeProvider />`

```tsx
import { NoxionThemeProvider } from "@noxion/renderer";
```

Provides the theme contract and color mode context to all Noxion components. Must wrap the entire app (or at minimum all components that use theme-aware features).

In the generated app, this is already set up in `app/providers.tsx`.

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `themeContract` | `NoxionThemeContract` | ✅ | — | The theme contract providing components, layouts, and templates. |
| `defaultMode` | `ThemeMode` | — | `"system"` | The initial color mode. Should match `config.defaultTheme`. |
| `children` | `ReactNode` | ✅ | — | Your app tree. |

---

## Setup

```tsx
// app/providers.tsx
import { NoxionThemeProvider } from "@noxion/renderer";
import { defaultThemeContract } from "@noxion/theme-default";
import { siteConfig } from "@/lib/config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NoxionThemeProvider
      themeContract={defaultThemeContract}
      defaultMode={siteConfig.defaultTheme}
    >
      {children}
    </NoxionThemeProvider>
  );
}
```

```tsx
// app/layout.tsx
import { ThemeScript } from "./theme-script";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Why `suppressHydrationWarning`?

The `<ThemeScript>` sets `data-theme="light"` or `data-theme="dark"` on `<html>` before React hydrates. This creates a mismatch between the server-rendered HTML (no `data-theme` attribute) and the client-side DOM (with `data-theme`). React would normally warn about this hydration mismatch, so `suppressHydrationWarning` silences it.

This is a well-known pattern for theme systems. See [React docs on suppressHydrationWarning](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors).

---

## `useThemeContract()`

Returns the active **theme contract** object.

### Signature

```ts
function useThemeContract(): NoxionThemeContract
```

### Returns

The full `NoxionThemeContract` including `name`, `metadata`, `components`, `layouts`, `templates`, and `supports`.

### Usage

```tsx
"use client";
import { useThemeContract } from "@noxion/renderer";

function ThemeInfo() {
  const contract = useThemeContract();
  return <p>Active theme: {contract.name}</p>;
}
```

---

## `useThemeComponent(name)`

Returns a specific component from the active theme contract.

### Signature

```ts
function useThemeComponent<K extends keyof NoxionThemeContractComponents>(
  name: K
): NoxionThemeContractComponents[K]
```

### Usage

```tsx
"use client";
import { useThemeComponent } from "@noxion/renderer";

function MyPage({ posts }) {
  const PostList = useThemeComponent("PostList");
  const Header = useThemeComponent("Header");

  return (
    <>
      <Header siteName="My Blog" />
      <PostList posts={posts} />
    </>
  );
}
```

Available component names: `Header`, `Footer`, `PostCard`, `FeaturedPostCard`, `PostList`, `HeroSection`, `TOC`, `Search`, `TagFilter`, `ThemeToggle`, `EmptyState`, `NotionPage`, `DocsSidebar`, `DocsBreadcrumb`, `PortfolioProjectCard`, `PortfolioFilter`.

---

## `useThemeLayout(name)`

Returns a layout component from the active theme contract.

### Signature

```ts
function useThemeLayout<K extends keyof NoxionThemeContractLayouts>(
  name: K
): NoxionThemeContractLayouts[K]
```

### Usage

```tsx
"use client";
import { useThemeLayout } from "@noxion/renderer";

function MyPage({ children }) {
  const BlogLayout = useThemeLayout("blog");
  return <BlogLayout slots={{}}>{children}</BlogLayout>;
}
```

Available layout names: `base`, `blog`, `docs` (optional), `magazine` (optional).

---

## `useThemeTemplate(name)`

Returns a template component from the active theme contract.

### Signature

```ts
function useThemeTemplate<K extends keyof NoxionThemeContractTemplates>(
  name: K
): NoxionThemeContractTemplates[K] | undefined
```

### Usage

```tsx
"use client";
import { useThemeTemplate } from "@noxion/renderer";

function RenderPage({ data }) {
  const HomePage = useThemeTemplate("home");
  if (!HomePage) return null;
  return <HomePage data={data} />;
}
```

Available template names: `home`, `post`, `archive` (optional), `tag` (optional), `docs` (optional), `portfolioGrid` (optional), `portfolioProject` (optional).

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
      {mode === "light" ? "sun" : mode === "dark" ? "moon" : "system"}
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
