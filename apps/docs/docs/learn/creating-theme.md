---
sidebar_position: 10
title: Creating a Custom Theme
description: Build and publish a custom Noxion theme with the contract-based theme system.
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
│   ├── index.ts            # Theme contract export
│   ├── components/         # React components (Header, Footer, PostCard, etc.)
│   ├── layouts/            # Layout components (BaseLayout, BlogLayout)
│   └── templates/          # Page templates (HomePage, PostPage, etc.)
├── styles/
│   └── theme.css           # CSS variable overrides
├── package.json
└── tsconfig.json
```

---

## Step 2: Define your theme contract

Edit `src/index.ts` to define your theme contract. A theme contract bundles React components, layouts, and templates:

```ts
import { defineThemeContract } from "@noxion/renderer";
import type { NoxionThemeContract } from "@noxion/renderer";

import {
  Header, Footer, PostCard, FeaturedPostCard, PostList,
  HeroSection, TOC, Search, TagFilter, ThemeToggle,
  EmptyState, NotionPage, DocsSidebar, DocsBreadcrumb,
  PortfolioProjectCard, PortfolioFilter,
} from "./components";

import { BaseLayout, BlogLayout } from "./layouts";
import { HomePage, PostPage, ArchivePage, TagPage } from "./templates";

export const myThemeContract: NoxionThemeContract = defineThemeContract({
  name: "my-theme",

  metadata: {
    description: "A custom dark theme for Noxion",
    author: "Your Name",
    version: "1.0.0",
  },

  components: {
    Header, Footer, PostCard, FeaturedPostCard, PostList,
    HeroSection, TOC, Search, TagFilter, ThemeToggle,
    EmptyState, NotionPage, DocsSidebar, DocsBreadcrumb,
    PortfolioProjectCard, PortfolioFilter,
  },

  layouts: {
    base: BaseLayout,
    blog: BlogLayout,
  },

  templates: {
    home: HomePage,
    post: PostPage,
    archive: ArchivePage,
    tag: TagPage,
  },

  supports: ["blog", "docs"],
});
```

### Required components

Your contract must provide all components listed in `NoxionThemeContractComponents`:

| Component | Props Type | Purpose |
|-----------|-----------|---------|
| `Header` | `HeaderProps` | Site header with navigation |
| `Footer` | `FooterProps` | Site footer |
| `PostCard` | `PostCardProps` | Blog post card in lists |
| `FeaturedPostCard` | `PostCardProps` | Featured/hero post card |
| `PostList` | `PostListProps` | Grid of post cards |
| `HeroSection` | `HeroSectionProps` | Hero section with featured posts |
| `TOC` | `TOCProps` | Table of contents sidebar |
| `Search` | `SearchProps` | Search input component |
| `TagFilter` | `TagFilterProps` | Tag filter bar |
| `ThemeToggle` | `ThemeToggleProps` | Light/dark/system mode toggle |
| `EmptyState` | `EmptyStateProps` | Empty state placeholder |
| `NotionPage` | `NotionPageProps` | Notion page renderer |
| `DocsSidebar` | `DocsSidebarProps` | Documentation sidebar |
| `DocsBreadcrumb` | `DocsBreadcrumbProps` | Breadcrumb navigation |
| `PortfolioProjectCard` | `PortfolioCardProps` | Portfolio project card |
| `PortfolioFilter` | `PortfolioFilterProps` | Portfolio filter bar |

All prop types are exported from `@noxion/renderer`.

---

## Step 3: Add CSS overrides (optional)

For visual customization, edit `styles/theme.css`:

```css
:root {
  --noxion-primary: #8b5cf6;
  --noxion-primary-hover: #7c3aed;
  --noxion-border-radius: 0.75rem;
  --noxion-line-height-base: 1.8;
}

[data-theme="dark"] {
  --noxion-background: #0f0f23;
  --noxion-card: #1e1e3f;
}
```

CSS variables control colors, fonts, spacing, and other visual properties. Your React components should use these variables for consistent theming.

---

## Step 4: Build on the default theme

You don't have to build every component from scratch. Import and re-export components from `@noxion/theme-default`, then override only the ones you want to customize:

```ts
// Re-use most components from the default theme
export { Footer, TOC, Search, TagFilter, ThemeToggle, EmptyState,
  NotionPage, DocsSidebar, DocsBreadcrumb, PortfolioProjectCard,
  PortfolioFilter } from "@noxion/theme-default";

// Create your own custom components for the ones you want to change
export { Header } from "./Header";       // Custom header
export { PostCard } from "./PostCard";   // Custom post card
// ...
```

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

```tsx
// app/providers.tsx
import { NoxionThemeProvider } from "@noxion/renderer";
import { myThemeContract } from "noxion-theme-midnight";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NoxionThemeProvider themeContract={myThemeContract} defaultMode="system">
      {children}
    </NoxionThemeProvider>
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
