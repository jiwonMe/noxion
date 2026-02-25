---
sidebar_position: 10
title: Creating a Custom Theme
description: Build and publish a custom Noxion theme with direct component imports and Tailwind CSS.
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
│   ├── index.ts            # Re-exports components, layouts, and templates
│   ├── components/         # React components (Header, Footer, PostCard, etc.)
│   ├── layouts/            # Layout components (BaseLayout, BlogLayout)
│   └── templates/          # Page templates (HomePage, PostPage, etc.)
├── styles/
│   ├── tailwind.css        # Tailwind CSS entry with theme variables
│   └── theme.css           # Additional CSS variable overrides
├── package.json
└── tsconfig.json
```

---

## Step 2: Configure Tailwind CSS

Your theme's `styles/tailwind.css` is the Tailwind entry point. It must include:

```css
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@source "../src/**/*.{ts,tsx}";

:root {
  --color-primary: #8b5cf6;
  --color-primary-foreground: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #171717;
  --color-muted: #f5f5f5;
  --color-muted-foreground: #737373;
  --color-border: #e5e5e5;
  --color-card: #ffffff;
  --color-card-foreground: #171717;

  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --width-content: 1080px;
  --radius-default: 0.5rem;
}

[data-theme="dark"] {
  --color-background: #0f0f23;
  --color-foreground: #ededed;
  --color-card: #1e1e3f;
  --color-border: #2a2a2a;
  --color-muted: #1a1a1a;
}
```

Key points:

- **`@custom-variant dark`** — maps `dark:` Tailwind utilities to `[data-theme="dark"]`, so they respond to the theme toggle instead of the OS media query.
- **`@source`** — tells Tailwind to scan your theme's source files for class names.
- **CSS variables** — define your theme's design tokens for both light and dark modes.

### Package exports

Configure `package.json` to export the Tailwind entry:

```json
{
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
    "./styles": "./styles/theme.css",
    "./styles/tailwind": "./styles/tailwind.css"
  },
  "sideEffects": ["styles/**/*.css"]
}
```

---

## Step 3: Create components

Theme components are standard React components that use Tailwind utility classes. Import prop types from `@noxion/renderer`:

```tsx
// src/components/Header.tsx
import type { HeaderProps } from "@noxion/renderer";

export function Header({ siteName, navigation }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {siteName}
        </a>
        <nav className="flex items-center gap-6">
          {navigation?.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-gray-700 dark:text-gray-300">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

### Required exports

Your theme must export these components, layouts, and templates:

| Category | Required Exports |
|----------|-----------------|
| **Components** | `Header`, `Footer`, `PostCard`, `FeaturedPostCard`, `PostList`, `HeroSection`, `TOC`, `Search`, `TagFilter`, `ThemeToggle`, `EmptyState`, `NotionPage`, `DocsSidebar`, `DocsBreadcrumb`, `PortfolioProjectCard`, `PortfolioFilter` |
| **Layouts** | `BaseLayout`, `BlogLayout`, `DocsLayout` |
| **Templates** | `HomePage`, `PostPage`, `ArchivePage`, `TagPage`, `DocsPage` |

All prop types are exported from `@noxion/renderer`.

---

## Step 4: Build on the default theme

You don't have to build every component from scratch. Import and re-export components from `@noxion/theme-default`, then override only the ones you want to customize:

```ts
// src/components/index.ts

// Re-use most components from the default theme
export { Footer, TOC, Search, TagFilter, ThemeToggle, EmptyState,
  NotionPage, DocsSidebar, DocsBreadcrumb, PortfolioProjectCard,
  PortfolioFilter } from "@noxion/theme-default";

// Create your own custom components for the ones you want to change
export { Header } from "./Header";
export { PostCard } from "./PostCard";
// ...
```

---

## Step 5: Export everything

Your theme's entry point (`src/index.ts`) re-exports all components:

```ts
// src/index.ts
export * from "./components";
export * from "./layouts";
export * from "./templates";
```

---

## Step 6: Publish

```bash
npm publish
```

Users install and use your theme:

```bash
bun add noxion-theme-midnight
```

```tsx
// app/layout.tsx
import "noxion-theme-midnight/styles/tailwind";

// app/site-layout.tsx
import { BlogLayout, Header, Footer } from "noxion-theme-midnight";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogLayout
      slots={{
        header: () => <Header siteName="My Blog" />,
        footer: () => <Footer siteName="My Blog" />,
      }}
    >
      {children}
    </BlogLayout>
  );
}
```

---

## Theme metadata

Themes can include metadata for discovery and display:

```ts
interface NoxionThemeMetadata {
  description?: string;
  author?: string;
  version?: string;
  preview?: string;
}
```
