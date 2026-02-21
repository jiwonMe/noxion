---
title: Structured Data
description: "@noxion/adapter-nextjs JSON-LD API"
---

# Structured Data (JSON-LD)

```ts
import {
  generateBlogPostingLD,
  generateBreadcrumbLD,
  generateWebSiteLD,
  generateCollectionPageLD,
} from "@noxion/adapter-nextjs";
```

## `generateBlogPostingLD()`

Generates a `BlogPosting` JSON-LD object for a post page.

```ts
function generateBlogPostingLD(post: BlogPost, config: NoxionConfig): JsonLd
```

Includes: `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`, `image` (as `ImageObject`), `keywords`, `articleSection`, `inLanguage`, `isAccessibleForFree`.

---

## `generateBreadcrumbLD()`

Generates a `BreadcrumbList` for a post page.

```ts
function generateBreadcrumbLD(post: BlogPost, config: NoxionConfig): JsonLd
```

Three levels: **Home → Category → Post** (two levels if no category).

---

## `generateWebSiteLD()`

Generates a `WebSite` JSON-LD for the homepage, including a `SearchAction` for Google Sitelinks Search Box.

```ts
function generateWebSiteLD(config: NoxionConfig): JsonLd
```

---

## `generateCollectionPageLD()`

Generates a `CollectionPage` with `ItemList` of posts for the homepage.

```ts
function generateCollectionPageLD(posts: BlogPost[], config: NoxionConfig): JsonLd
```

Includes up to 30 posts as `ListItem` entries.

---

## Usage

```tsx
// app/[slug]/page.tsx
const blogPostingLd = generateBlogPostingLD(post, siteConfig);
const breadcrumbLd = generateBreadcrumbLD(post, siteConfig);

return (
  <article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    <NotionPage recordMap={recordMap} rootPageId={post.id} />
  </article>
);
```
