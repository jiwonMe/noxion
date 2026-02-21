---
title: Structured Data (JSON-LD)
description: "@noxion/adapter-nextjs JSON-LD structured data generators for schema.org types"
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

These functions generate [JSON-LD](https://json-ld.org/) structured data objects following [schema.org](https://schema.org/) vocabulary. JSON-LD is the [recommended format](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) for structured data by Google and other search engines.

Structured data enables [Google Rich Results](https://developers.google.com/search/docs/appearance/rich-results/rich-results-overview) — enhanced search result displays with author, date, images, and breadcrumbs.

---

## `generateBlogPostingLD()`

Generates a [`BlogPosting`](https://schema.org/BlogPosting) schema for a single post page.

### Signature

```ts
function generateBlogPostingLD(
  post: BlogPost,
  config: NoxionConfig
): Record<string, unknown>
```

### Returns

A `BlogPosting` JSON-LD object.

### Generated schema

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "description": "Post description text...",
  "datePublished": "2025-02-01",
  "dateModified": "2025-02-10T12:34:56.789Z",
  "author": {
    "@type": "Person",
    "name": "Jane Doe"
  },
  "publisher": {
    "@type": "Organization",
    "name": "My Blog",
    "url": "https://myblog.com"
  },
  "image": {
    "@type": "ImageObject",
    "url": "https://www.notion.so/image/...",
    "width": 1200,
    "height": 630
  },
  "keywords": "react, typescript, tutorial",
  "articleSection": "Web Dev",
  "inLanguage": "en",
  "isAccessibleForFree": true,
  "url": "https://myblog.com/my-post",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://myblog.com/my-post"
  }
}
```

### Fields explained

| Field | Source | Notes |
|-------|--------|-------|
| `headline` | `post.title` | Max 110 chars per Google's guidelines |
| `description` | `post.description` | |
| `datePublished` | `post.date` | ISO 8601 date |
| `dateModified` | `post.lastEditedTime` | ISO 8601 datetime |
| `author.name` | `post.author ?? config.author` | |
| `publisher.name` | `config.name` | |
| `image.url` | `post.coverImage` | Omitted if no cover image |
| `keywords` | `post.tags.join(", ")` | |
| `articleSection` | `post.category` | Omitted if no category |
| `inLanguage` | `config.language` | |
| `url` | `https://${config.domain}/${post.slug}` | |

### Usage

```tsx
// app/[slug]/page.tsx
import { generateBlogPostingLD } from "@noxion/adapter-nextjs";
import { siteConfig } from "@/lib/config";

export default async function PostPage({ params }) {
  const post = await getPostBySlug((await params).slug);
  const blogPostingLd = generateBlogPostingLD(post, siteConfig);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      {/* ... page content */}
    </article>
  );
}
```

---

## `generateBreadcrumbLD()`

Generates a [`BreadcrumbList`](https://schema.org/BreadcrumbList) schema for a post page.

### Signature

```ts
function generateBreadcrumbLD(
  post: BlogPost,
  config: NoxionConfig
): Record<string, unknown>
```

### Generated schema

With category (3 levels):

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://myblog.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Web Dev",
      "item": "https://myblog.com/tag/web-dev"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Getting Started with Bun",
      "item": "https://myblog.com/getting-started-with-bun"
    }
  ]
}
```

Without category (2 levels):

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myblog.com/" },
    { "@type": "ListItem", "position": 2, "name": "Getting Started with Bun", "item": "https://myblog.com/..." }
  ]
}
```

### Usage

Typically used alongside `generateBlogPostingLD()`:

```tsx
const breadcrumbLd = generateBreadcrumbLD(post, siteConfig);

return (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    <NotionPage recordMap={recordMap} rootPageId={post.id} />
  </>
);
```

---

## `generateWebSiteLD()`

Generates a [`WebSite`](https://schema.org/WebSite) schema for the homepage, including a [`SearchAction`](https://schema.org/SearchAction) for [Google Sitelinks Search Box](https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox).

### Signature

```ts
function generateWebSiteLD(config: NoxionConfig): Record<string, unknown>
```

### Generated schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://myblog.com/#website",
  "name": "My Blog",
  "url": "https://myblog.com/",
  "description": "A blog about web development...",
  "inLanguage": "en",
  "author": {
    "@type": "Person",
    "name": "Jane Doe"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://myblog.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

The `SearchAction` tells Google that `/search?q=` is a search endpoint for your site. If Google recognizes this, your site may show a search box directly in Google search results (Sitelinks Search Box feature).

### Usage

```tsx
// app/page.tsx
const webSiteLd = generateWebSiteLD(siteConfig);

return (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }} />
    {/* ... */}
  </>
);
```

---

## `generateCollectionPageLD()`

Generates a [`CollectionPage`](https://schema.org/CollectionPage) schema with an [`ItemList`](https://schema.org/ItemList) of posts for the homepage.

### Signature

```ts
function generateCollectionPageLD(
  posts: BlogPost[],
  config: NoxionConfig
): Record<string, unknown>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `posts` | `BlogPost[]` | Array of posts to list (up to 30 items) |
| `config` | `NoxionConfig` | Your site configuration |

### Generated schema

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://myblog.com/#collection",
  "name": "My Blog",
  "url": "https://myblog.com/",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://myblog.com/post-1",
        "name": "Post 1 Title"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "url": "https://myblog.com/post-2",
        "name": "Post 2 Title"
      }
      // ... up to 30 items
    ]
  }
}
```

The `ItemList` helps search engines discover and understand the relationship between your homepage and individual posts.

### Usage

```tsx
// app/page.tsx
const posts = await getAllPosts();
const collectionLd = generateCollectionPageLD(posts.slice(0, 30), siteConfig);

return (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
    <PostList posts={posts} />
  </>
);
```

---

## Validating structured data

Use [Google's Rich Results Test](https://search.google.com/test/rich-results) to validate your JSON-LD. You can also use the [schema.org validator](https://validator.schema.org/) for more detailed validation.

Common issues:
- `datePublished` must be in ISO 8601 format
- `headline` must be under 110 characters (Google's guideline for rich results)
- Images must be at least 696px wide for `summary_large_image` Twitter Cards
