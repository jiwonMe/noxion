# Migrating to Noxion v0.2

## Overview

Noxion v0.2 transforms the library from a Notion blog builder into a full Notion Website Builder supporting Blog, Docs, and Portfolio page types.

## Breaking Changes

### 1. `BlogPost` → `NoxionPage` / `BlogPage`

The `BlogPost` interface has been replaced with a generic `NoxionPage` interface. Blog-specific fields have moved into a `metadata` object.

**Before (v0.1):**

```ts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  category?: string;
  author?: string;
  // ...
}

const post: BlogPost = await fetchPostBySlug(notion, dbId, "my-post");
console.log(post.date);
console.log(post.tags);
console.log(post.category);
```

**After (v0.2):**

```ts
interface BlogPage extends NoxionPage {
  pageType: 'blog';
  metadata: {
    date: string;
    tags: string[];
    category?: string;
    author?: string;
  };
}

const post: BlogPage = await fetchPostBySlug(notion, dbId, "my-post");
console.log(post.metadata.date);
console.log(post.metadata.tags);
console.log(post.metadata.category);
```

> **Compat note:** `BlogPost` is kept as a type alias for `BlogPage` and will be removed in v0.3.

### 2. Adapter functions accept `NoxionPage`

All `@noxion/adapter-nextjs` functions now accept `NoxionPage` instead of `BlogPost`:

```ts
// Before
generateNoxionMetadata(blogPost, config);
generateBlogPostingLD(blogPost, config);
generateNoxionSitemap(blogPosts, config);

// After — same call signature, but pass NoxionPage
generateNoxionMetadata(page, config);
generateBlogPostingLD(page, config);
generateNoxionSitemap(pages, config);
```

### 3. Config: `defaultPageType` field added

`NoxionConfig` now includes `defaultPageType` (defaults to `"blog"`). If you construct config manually (not via `loadConfig`), add this field:

```ts
const config: NoxionConfig = {
  // ...existing fields
  defaultPageType: "blog",
};
```

### 4. Config: `collections` for multi-database support

You can now configure multiple Notion databases with different page types:

```ts
defineConfig({
  name: "My Site",
  domain: "mysite.com",
  collections: [
    { databaseId: "abc123", pageType: "blog" },
    { databaseId: "def456", pageType: "docs", pathPrefix: "/docs" },
    { databaseId: "ghi789", pageType: "portfolio", pathPrefix: "/projects" },
  ],
  // ...
});
```

Single-database mode with `rootNotionPageId` still works unchanged.

## New Features

### Page Types

- **Blog** — Same as before, with metadata structure
- **Docs** — Documentation pages with section, version, sidebar navigation
- **Portfolio** — Project showcases with technologies, project URL, year

### New Adapter Exports

```ts
// Routing
import { generateNoxionRoutes, resolvePageType, buildPageUrl } from "@noxion/adapter-nextjs";

// JSON-LD
import { generateTechArticleLD, generateCreativeWorkLD, generatePageLD } from "@noxion/adapter-nextjs";
```

### Theme System

- `defineThemeContract()` for creating theme contracts that bundle components, layouts, and templates
- Namespaced templates: `docs/page`, `portfolio/grid`, `portfolio/project`
- `NoxionThemeContract.supports` declares which page types a theme supports

### New Components

Available via theme contracts (`NoxionThemeContractComponents`):
- `DocsSidebar`, `DocsBreadcrumb`
- `PortfolioProjectCard`, `PortfolioFilter`

## Migration Checklist

- [ ] Replace `post.date` → `post.metadata.date`
- [ ] Replace `post.tags` → `post.metadata.tags`
- [ ] Replace `post.category` → `post.metadata.category`
- [ ] Replace `post.author` → `post.metadata.author`
- [ ] Add `defaultPageType: "blog"` to any manually constructed `NoxionConfig`
- [ ] Update `BlogPost` imports to `BlogPage` (optional, alias still works)
- [ ] Test that SEO output is identical for existing blog pages
