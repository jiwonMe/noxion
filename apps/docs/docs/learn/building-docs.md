---
sidebar_position: 8
title: Building a Docs Site
description: Set up a documentation site powered by Notion with sidebar navigation and section grouping.
---

# Building a Docs Site

This guide walks you through creating a documentation site with Noxion. Your docs will have sidebar navigation, section grouping, and automatic ordering — all driven by a Notion database.

---

## Step 1: Scaffold the project

```bash
bun create noxion my-docs --template docs
```

The CLI will ask for your Docs Notion database ID. You can also pass it directly:

```bash
bun create noxion my-docs --template docs --notion-id=abc123...
```

---

## Step 2: Set up the Notion database

Create a Notion database with these properties:

| Property | Type | Description |
|----------|------|-------------|
| Title | Title | Page title (required) |
| Public | Checkbox | Check to publish (required) |
| Section | Select | Groups pages in the sidebar (e.g. "Getting Started", "API Reference") |
| Order | Number | Sort order within a section (1, 2, 3...) |
| Slug | Text | Custom URL slug |
| Description | Text | Meta description |
| Version | Text | Version tag (optional) |

### Example database

```
┌─────────────────────────────────────────────────────────────────┐
│ Title           │ Public │ Section          │ Order │ Version   │
├─────────────────────────────────────────────────────────────────┤
│ Introduction    │ ✓      │ Getting Started  │ 1     │ latest    │
│ Installation    │ ✓      │ Getting Started  │ 2     │ latest    │
│ Configuration   │ ✓      │ API Reference    │ 1     │ latest    │
│ Plugin API      │ ✓      │ API Reference    │ 2     │ latest    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 3: Configuration

The generated `noxion.config.ts` uses the `collections` config:

```ts
import { defineConfig } from "@noxion/core";

export default defineConfig({
  name: "My Docs",
  domain: "docs.example.com",
  author: "Your Name",
  description: "Documentation for My Project",
  collections: [
    {
      name: "Documentation",
      databaseId: process.env.NOTION_PAGE_ID!,
      pageType: "docs",
      pathPrefix: "docs",
    },
  ],
});
```

---

## Step 4: How it works

### Sidebar navigation

The generated docs template automatically groups pages by their `Section` property. Within each section, pages are sorted by `Order`. The sidebar component (`DocsSidebar`) renders this hierarchy:

```
Getting Started
  ├── Introduction        (order: 1)
  └── Installation        (order: 2)
API Reference
  ├── Configuration       (order: 1)
  └── Plugin API          (order: 2)
```

### URL structure

Docs pages are served under the `pathPrefix` you configure:

```
https://docs.example.com/docs/introduction
https://docs.example.com/docs/installation
https://docs.example.com/docs/configuration
```

### SEO

Docs pages generate `TechArticle` JSON-LD (instead of `BlogPosting`), which is the appropriate schema.org type for technical documentation.

---

## Step 5: Combining with a blog

To add a blog alongside your docs, switch to the `full` template or add a blog collection manually:

```ts
collections: [
  { databaseId: process.env.NOTION_PAGE_ID!, pageType: "blog" },
  { databaseId: process.env.DOCS_NOTION_ID!, pageType: "docs", pathPrefix: "docs" },
],
```

See [Configuration → Collections](./configuration#collections) for details.
