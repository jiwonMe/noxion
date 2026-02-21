---
sidebar_position: 3
title: Notion Setup
description: Configure your Notion database for Noxion.
---

# Notion Setup

## Create the database

In Notion, create a new **full-page database** (not inline). Add these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Title | Title | ✅ | Post title |
| Public | Checkbox | ✅ | Check to publish the post |
| Published | Date | — | Publication date shown on the post |
| Tags | Multi-select | — | Post tags for filtering |
| Category | Select | — | Post category |
| Slug | Text | — | Custom URL slug (e.g. `my-post`) |
| Description | Text | — | Meta description for SEO |
| Author | Text | — | Author name (overrides site-level author) |

:::tip Flexible schema
Noxion matches property names **case-insensitively**. `public` and `Public` both work. Extra properties are ignored.
:::

## Get the page ID

From the database page URL:

```
https://notion.so/your-workspace/My-Database-abc123def456...
                                                ^^^^^^^^^^^^^^^^
                                                This is your page ID
```

Or from the Share menu → Copy link. The 32-character hex string at the end is the ID.

## Private pages (optional)

For private Notion pages, create an integration token:

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **New integration** → give it a name
3. Copy the **Internal Integration Token**
4. In your database, click **...** → **Add connections** → select your integration

Then add to `.env`:

```bash
NOTION_TOKEN=secret_xxx...
```

## Frontmatter overrides

Add a **code block** as the first block of any page to override metadata per-post:

```
cleanUrl: /my-custom-slug
title: Custom SEO Title | Site Name
description: Custom meta description for search engines
floatFirstTOC: right
```

Supported keys:

| Key | Effect |
|-----|--------|
| `cleanUrl` | Override the URL slug |
| `title` | Override the `<title>` tag |
| `description` | Override the meta description |
| `date` | Override the publication date |
| `category` | Override the category |
| `tags` | Override tags (comma-separated) |
| `coverImage` | Override the cover image URL |

Unknown keys are preserved in `post.frontmatter` for custom use.

:::note Comments in frontmatter
Lines starting with `#` are treated as comments and ignored:

```
cleanUrl: /my-post
# title: Draft title (commented out)
description: My description
```
:::
