---
sidebar_position: 6
title: SEO
description: What Noxion generates automatically for search engine optimization.
---

# SEO

Noxion generates a comprehensive set of SEO signals automatically from your Notion data. This page documents exactly what gets generated on each page type, and why each signal matters.

---

## Overview

| Signal | Homepage | Post pages | Tag pages |
|--------|----------|------------|-----------|
| `<title>` | ✅ | ✅ | ✅ |
| `<meta description>` | ✅ | ✅ | ✅ |
| Open Graph tags | ✅ | ✅ | ✅ |
| Twitter Card | ✅ | ✅ | ✅ |
| Canonical URL | ✅ | ✅ | ✅ |
| JSON-LD structured data | ✅ WebSite + CollectionPage | ✅ BlogPosting + BreadcrumbList | — |
| Sitemap inclusion | ✅ priority 1.0 | ✅ priority 0.8 | ✅ priority 0.5 |
| RSS feed | ✅ discovery link | — | — |

---

## Homepage

### `<title>` and `<meta description>`

```html
<title>My Blog</title>
<meta name="description" content="A blog about web development..." />
```

The homepage title is just the site name (no template suffix). The description comes from `config.description`.

### Open Graph

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="My Blog" />
<meta property="og:description" content="A blog about web development..." />
<meta property="og:url" content="https://myblog.com/" />
<meta property="og:locale" content="en_US" />
<meta property="og:site_name" content="My Blog" />
```

[Open Graph Protocol](https://ogp.me/) tags control how your page appears when shared on Facebook, LinkedIn, Slack, Discord, and other platforms that support OG.

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="My Blog" />
<meta name="twitter:description" content="A blog about web development..." />
```

[Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) control how links appear when shared on Twitter/X.

### JSON-LD: WebSite with SearchAction

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

The `SearchAction` enables [Google Sitelinks Search Box](https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox) — when your site appears in Google search results, users may see a search box directly in the result that searches your site.

### JSON-LD: CollectionPage with ItemList

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
        "url": "https://myblog.com/my-first-post",
        "name": "My First Post"
      }
      // ... up to 30 posts
    ]
  }
}
```

This helps search engines understand that your homepage is a list of articles, improving indexing of individual posts.

---

## Post pages

### `<title>` template

```html
<title>Getting Started with Bun | My Blog</title>
```

The template `{post.title} | {config.name}` is set via `generateNoxionListMetadata()`:

```ts
title: {
  default: config.name,
  template: `%s | ${config.name}`,
}
```

The `%s` is replaced with the post title by Next.js's [Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

### `<meta description>`

```html
<meta name="description" content="Learn how to get started with Bun, the fast JavaScript runtime..." />
```

Sourced from the Notion `Description` property (or frontmatter `description` override). Automatically truncated at 160 characters — [Google typically displays 155–160 characters](https://moz.com/learn/seo/meta-description) in search results.

### Open Graph article tags

```html
<meta property="og:type" content="article" />
<meta property="og:title" content="Getting Started with Bun" />
<meta property="og:description" content="Learn how to..." />
<meta property="og:url" content="https://myblog.com/getting-started-with-bun" />
<meta property="og:image" content="https://www.notion.so/image/..." />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Getting Started with Bun" />
<meta property="article:published_time" content="2025-02-01T00:00:00.000Z" />
<meta property="article:modified_time" content="2025-02-10T12:34:56.789Z" />
<meta property="article:author" content="Jane Doe" />
<meta property="article:section" content="Tools" />
<meta property="article:tag" content="bun" />
<meta property="article:tag" content="tooling" />
```

The `article:*` namespace is defined in the [Open Graph protocol for articles](https://ogp.me/#type_article). These tags help platforms like Facebook and LinkedIn render rich article previews.

### Canonical URL

```html
<link rel="canonical" href="https://myblog.com/getting-started-with-bun" />
```

The [canonical URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) tells search engines which URL is the "official" version of the page, preventing duplicate content penalties if your content is accessible at multiple URLs (e.g., with/without trailing slash, via www subdomain, etc.).

### JSON-LD: BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Getting Started with Bun",
  "description": "Learn how to get started with Bun...",
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
  "keywords": "bun, tooling",
  "articleSection": "Tools",
  "inLanguage": "en",
  "isAccessibleForFree": true,
  "url": "https://myblog.com/getting-started-with-bun",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://myblog.com/getting-started-with-bun"
  }
}
```

[BlogPosting](https://schema.org/BlogPosting) structured data enables [Google Rich Results](https://developers.google.com/search/docs/appearance/rich-results/rich-results-overview) for articles, potentially showing your post with enhanced display in search results (author, date, image).

### JSON-LD: BreadcrumbList

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
      "name": "Tools",
      "item": "https://myblog.com/tag/tools"
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

[BreadcrumbList](https://schema.org/BreadcrumbList) structured data enables breadcrumb display in Google search results (Home > Tools > Getting Started with Bun appears below the URL in the result).

---

## Sitemap

`/sitemap.xml` is generated using Next.js's [MetadataRoute.Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) API:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://myblog.com/</loc>
    <lastmod>2025-02-21</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://myblog.com/getting-started-with-bun</loc>
    <lastmod>2025-02-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://myblog.com/tag/bun</loc>
    <lastmod>2025-02-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <!-- ... -->
</urlset>
```

The `lastmod` date for posts uses `post.lastEditedTime` (the Notion last-edited timestamp). This tells search engines when content was actually updated, helping crawlers prioritize fresh content.

---

## RSS feed

`/feed.xml` (enabled by the RSS plugin) is an [RSS 2.0](https://www.rssboard.org/rss-specification) feed:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>My Blog</title>
    <link>https://myblog.com/</link>
    <description>A blog about web development...</description>
    <language>en</language>
    <atom:link href="https://myblog.com/feed.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>Getting Started with Bun</title>
      <link>https://myblog.com/getting-started-with-bun</link>
      <guid>https://myblog.com/getting-started-with-bun</guid>
      <pubDate>Sat, 01 Feb 2025 00:00:00 GMT</pubDate>
      <description>Learn how to get started with Bun...</description>
      <dc:creator>Jane Doe</dc:creator>
      <category>bun</category>
      <category>tooling</category>
    </item>
  </channel>
</rss>
```

The feed is announced in `<head>` for automatic discovery by RSS readers:

```html
<link rel="alternate" type="application/rss+xml" title="My Blog" href="/feed.xml" />
```

See [Plugins → RSS](./plugins/rss) for configuration options.

---

## robots.txt

`/robots.txt` is generated by `generateNoxionRobots()`:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://myblog.com/sitemap.xml
Host: https://myblog.com
```

- `Disallow: /api/` — prevents crawlers from hitting API routes (revalidation endpoint, etc.)
- `Disallow: /_next/` — prevents crawlers from indexing Next.js internal routes
- `Sitemap:` — advertises the sitemap URL to all crawlers

---

## Verifying SEO signals

### Google Rich Results Test

Use [Google's Rich Results Test](https://search.google.com/test/rich-results) to verify your JSON-LD structured data is valid.

### Open Graph debugger

Use [Facebook's Sharing Debugger](https://developers.facebook.com/tools/debug/) or [OpenGraph.xyz](https://www.opengraph.xyz/) to preview how your pages appear when shared.

### Lighthouse

Run [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) (built into Chrome DevTools) to audit SEO, performance, and accessibility. A well-configured Noxion blog typically scores 95–100 on SEO.

### Google Search Console

After deploying, add your site to [Google Search Console](https://search.google.com/search-console) and submit your sitemap URL. This accelerates indexing and lets you monitor search performance.

---

## On-demand revalidation

When you publish or update a post in Notion, trigger an immediate cache refresh so the new content is indexed quickly:

```bash
# Revalidate a specific post
curl -X POST "https://myblog.com/api/revalidate?secret=YOUR_SECRET&path=/post-slug"

# Revalidate the homepage (updates the post list)
curl -X POST "https://myblog.com/api/revalidate?secret=YOUR_SECRET&path=/"
```

After revalidation, Google's crawler can discover the updated content on its next crawl. For faster indexing of new posts, use the [Google Search Console URL Inspection tool](https://support.google.com/webmasters/answer/9012289) to request indexing manually.
