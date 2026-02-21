---
sidebar_position: 3
title: RSS Plugin
---

# RSS Plugin

```ts
createRSSPlugin({
  feedPath: "/feed.xml",  // URL path for the feed
  limit: 20,              // Max posts in feed
})
```

The RSS feed at `/feed.xml` includes:
- Post title, link, description, publication date
- `dc:creator` (author)
- `category` tags for each post tag
- `atom:link` self-reference

A `<link rel="alternate" type="application/rss+xml">` is automatically added to `<head>` for feed discovery.
