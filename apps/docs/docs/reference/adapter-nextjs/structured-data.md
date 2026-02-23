---
title: Structured Data (JSON-LD)
description: "@noxion/adapter-nextjs JSON-LD structured data generators for schema.org types"
---

# Structured Data (JSON-LD)

```ts
import {
  generateBlogPostingLD,
  generateTechArticleLD,
  generateCreativeWorkLD,
  generatePageLD,
  generateBreadcrumbLD,
  generateWebSiteLD,
  generateCollectionPageLD,
} from "@noxion/adapter-nextjs";
```

These functions generate [JSON-LD](https://json-ld.org/) structured data following [schema.org](https://schema.org/) vocabulary.

---

## `generatePageLD()`

Automatically selects the correct JSON-LD type based on `page.pageType`. This is the recommended function for most use cases.

### Signature

```ts
function generatePageLD(
  page: NoxionPage,
  config: NoxionConfig
): Record<string, unknown>
```

### Behavior

| `page.pageType` | Generated `@type` | Function used |
|------------------|--------------------|---------------|
| `"blog"` | `BlogPosting` | `generateBlogPostingLD()` |
| `"docs"` | `TechArticle` | `generateTechArticleLD()` |
| `"portfolio"` | `CreativeWork` | `generateCreativeWorkLD()` |
| Other | `Article` | Generic article schema |

### Usage

```tsx
import { generatePageLD, generateBreadcrumbLD } from "@noxion/adapter-nextjs";

export default async function PageDetail({ params }) {
  const page = await getPageBySlug((await params).slug);
  const pageLd = generatePageLD(page, siteConfig);
  const breadcrumbLd = generateBreadcrumbLD(page, siteConfig);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {/* page content */}
    </article>
  );
}
```

---

## `generateBlogPostingLD()`

Generates a [`BlogPosting`](https://schema.org/BlogPosting) schema for blog posts.

### Signature

```ts
function generateBlogPostingLD(
  page: NoxionPage,
  config: NoxionConfig
): Record<string, unknown>
```

### Generated schema

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "description": "Post description...",
  "datePublished": "2025-02-01",
  "dateModified": "2025-02-10T12:34:56.789Z",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "publisher": { "@type": "Organization", "name": "My Blog", "url": "https://myblog.com" },
  "image": { "@type": "ImageObject", "url": "...", "width": 1200, "height": 630 },
  "keywords": "react, typescript",
  "articleSection": "Web Dev",
  "inLanguage": "en",
  "url": "https://myblog.com/my-post"
}
```

---

## `generateTechArticleLD()`

Generates a [`TechArticle`](https://schema.org/TechArticle) schema for documentation pages. Includes `proficiencyLevel` and `dependencies` fields.

### Signature

```ts
function generateTechArticleLD(
  page: NoxionPage,
  config: NoxionConfig
): Record<string, unknown>
```

### Generated schema

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Configuration Guide",
  "description": "How to configure Noxion...",
  "dateModified": "2025-02-10T12:34:56.789Z",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "publisher": { "@type": "Organization", "name": "My Docs" },
  "inLanguage": "en",
  "url": "https://mysite.com/docs/configuration"
}
```

---

## `generateCreativeWorkLD()`

Generates a [`CreativeWork`](https://schema.org/CreativeWork) schema for portfolio projects. Includes `technology`, `url`, and `dateCreated` fields.

### Signature

```ts
function generateCreativeWorkLD(
  page: NoxionPage,
  config: NoxionConfig
): Record<string, unknown>
```

### Generated schema

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Noxion",
  "description": "A Notion-powered website builder",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "url": "https://nox.io",
  "dateCreated": "2026",
  "keywords": "TypeScript, React, Next.js"
}
```

---

## `generateBreadcrumbLD()`

Generates a [`BreadcrumbList`](https://schema.org/BreadcrumbList) schema. Adapts to page type — blog pages use category as middle crumb, docs pages use section, portfolio uses "Portfolio".

### Signature

```ts
function generateBreadcrumbLD(
  page: NoxionPage,
  config: NoxionConfig
): Record<string, unknown>
```

---

## `generateWebSiteLD()`

Generates a [`WebSite`](https://schema.org/WebSite) schema with [`SearchAction`](https://schema.org/SearchAction).

```ts
function generateWebSiteLD(config: NoxionConfig): Record<string, unknown>
```

---

## `generateCollectionPageLD()`

Generates a [`CollectionPage`](https://schema.org/CollectionPage) with an [`ItemList`](https://schema.org/ItemList) for homepage post listings.

```ts
function generateCollectionPageLD(
  pages: NoxionPage[],
  config: NoxionConfig
): Record<string, unknown>
```

---

## Validating structured data

Use [Google's Rich Results Test](https://search.google.com/test/rich-results) to validate your JSON-LD. Common requirements:
- `datePublished` must be in ISO 8601 format
- `headline` must be under 110 characters
- Images must be at least 696px wide for `summary_large_image` Twitter Cards
