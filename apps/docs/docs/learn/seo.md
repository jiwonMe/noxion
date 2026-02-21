---
sidebar_position: 6
title: SEO
description: What Noxion generates automatically for SEO.
---

# SEO

Noxion generates all SEO signals automatically. Here's exactly what each page gets.

## Homepage

| Signal | Value |
|--------|-------|
| `<title>` | `Site Name` |
| `<meta description>` | Site description (160 chars max) |
| `og:type` | `website` |
| `og:locale` | `ko_KR` / `en_US` / `ja_JP` (from `language` config) |
| JSON-LD | `WebSite` with `SearchAction` (Sitelinks Search Box) |
| JSON-LD | `CollectionPage` with `ItemList` of posts |
| `<link rel="alternate">` | RSS feed discovery |

## Post pages

| Signal | Value |
|--------|-------|
| `<title>` | `Post Title \| Site Name` |
| `<meta description>` | From Notion `Description` field (160 chars max) |
| `og:type` | `article` |
| `article:published_time` | From `Published` date |
| `article:modified_time` | From Notion `last_edited_time` |
| `article:author` | From `Author` field or site author |
| `article:section` | From `Category` field |
| `article:tag` | All post tags |
| `og:image` | Cover image, 1200×630, with alt text |
| Canonical URL | `https://domain.com/post-slug` |
| JSON-LD | `BlogPosting` with full metadata |
| JSON-LD | `BreadcrumbList` (Home → Category → Post) |

## Sitemap

`/sitemap.xml` includes:

- Homepage (priority 1.0, daily)
- All published posts (priority 0.8, weekly)
- All tag pages (priority 0.5, weekly)

## RSS feed

`/feed.xml` includes up to 50 posts with:
- Full `dc:creator`, `category` tags
- `atom:link` self-reference for feed readers

## robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://yourdomain.com/sitemap.xml
Host: https://yourdomain.com
```

## On-demand revalidation

When you publish or update a Notion post, trigger an immediate refresh:

```bash
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/post-slug"
```
