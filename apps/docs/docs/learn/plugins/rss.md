---
sidebar_position: 3
title: RSS Plugin
description: Add an RSS 2.0 feed to your Noxion blog.
---

# RSS Plugin

The RSS plugin generates an [RSS 2.0](https://www.rssboard.org/rss-specification) feed for your blog, allowing readers to subscribe using feed readers like [Feedly](https://feedly.com), [Reeder](https://reederapp.com), or any RSS client.

---

## Configuration

```ts
import { createRSSPlugin } from "@noxion/core";

createRSSPlugin({
  feedPath: "/feed.xml",  // URL path where the feed is served
  limit: 20,              // Maximum number of posts in the feed
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `feedPath` | `string` | `"/feed.xml"` | URL path for the feed. Should end in `.xml` for compatibility with feed readers. |
| `limit` | `number` | `20` | Maximum number of posts to include. Posts are sorted by date descending (newest first). |

---

## Feed structure

The generated RSS 2.0 feed:

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
    <lastBuildDate>Fri, 21 Feb 2025 00:00:00 GMT</lastBuildDate>
    <atom:link href="https://myblog.com/feed.xml" rel="self" type="application/rss+xml"/>

    <item>
      <title>Getting Started with Bun</title>
      <link>https://myblog.com/getting-started-with-bun</link>
      <guid isPermaLink="true">https://myblog.com/getting-started-with-bun</guid>
      <pubDate>Sat, 01 Feb 2025 00:00:00 GMT</pubDate>
      <description>Learn how to get started with Bun, the fast JavaScript runtime...</description>
      <dc:creator>Jane Doe</dc:creator>
      <category>bun</category>
      <category>tooling</category>
    </item>

    <!-- ... more items ... -->
  </channel>
</rss>
```

### Feed metadata explained

| Element | Source | Notes |
|---------|--------|-------|
| `<title>` | `config.name` | Channel title |
| `<link>` | `config.domain` | Homepage URL |
| `<description>` | `config.description` | Channel description |
| `<language>` | `config.language` | BCP 47 language code |
| `<atom:link>` | `feedPath` | Self-referencing link — [RSS best practice](https://www.rssboard.org/rss-profile#namespace-elements-atom-link) |
| `<item><title>` | `post.title` | Post title |
| `<item><link>` | `post.slug` | Full post URL |
| `<item><guid>` | `post.slug` | Globally unique identifier — same as link |
| `<item><pubDate>` | `post.date` | Publication date in [RFC 822](https://www.rfc-editor.org/rfc/rfc822) format |
| `<item><description>` | `post.description` | Meta description (not full content) |
| `<dc:creator>` | `post.author \|\| config.author` | Author via [Dublin Core namespace](http://purl.org/dc/elements/1.1/) |
| `<category>` | `post.tags` | One `<category>` element per tag |

---

## Feed discovery

The RSS plugin automatically adds a `<link>` tag to your site's `<head>` so feed readers can discover the feed automatically (this is the [RSS autodiscovery](https://www.rssboard.org/rss-autodiscovery) standard):

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="My Blog"
  href="/feed.xml"
/>
```

Most feed readers (and browsers like Firefox) recognize this tag and display a subscribe button automatically.

---

## Multiple feeds

You can create multiple feeds (e.g., per-category or per-tag) by including multiple RSS plugin instances:

```ts
plugins: [
  createRSSPlugin({ feedPath: "/feed.xml", limit: 20 }),           // All posts
  createRSSPlugin({ feedPath: "/feed/web-dev.xml", limit: 20 }),   // Custom filtered feed
],
```

For category-filtered feeds, you'll need to customize the `lib/notion.ts` fetcher to filter posts by category before passing them to the RSS generator.

---

## Submitting to feed aggregators

Once your feed is live, consider submitting it to:

- [Feedly](https://feedly.com) — add via "Add Source" → paste your feed URL
- [Newsblur](https://newsblur.com)
- [Inoreader](https://www.inoreader.com)
- [Planet](https://www.planetplanet.org/) aggregators in your tech community

---

## Validating your feed

Use the [W3C Feed Validation Service](https://validator.w3.org/feed/) to validate your RSS feed:

```
https://validator.w3.org/feed/check.cgi?url=https%3A%2F%2Fmyblog.com%2Ffeed.xml
```

A valid feed should show no errors. Common issues:
- Missing `<guid>` elements (Noxion includes these by default)
- Invalid date format (Noxion uses RFC 822 format)
- Invalid XML characters in post content
