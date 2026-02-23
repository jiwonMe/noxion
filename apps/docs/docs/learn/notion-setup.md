---
sidebar_position: 3
title: Notion Setup
description: Configure your Notion databases for Noxion.
---

# Notion Setup

Noxion reads your content from **Notion databases**. This page explains how to set up databases for each page type, what schema properties are supported, and how to get your page IDs.

---

## Create the database

In Notion, create a new **full-page database** (not an inline database). The difference matters: Noxion calls the root page to enumerate all pages, and inline databases aren't directly accessible via that page's block tree in the same way.

To create a full-page database:
1. Create a new page
2. Type `/database` and select **Table — Full page**

---

## Blog database schema

### Required properties

| Property name | Type | Required | Description |
|---------------|------|----------|-------------|
| `Title` | Title | ✅ | The post title. Every Notion database has this by default. |
| `Public` | Checkbox | ✅ | Only posts where this is **checked** are fetched and published. |

### Recommended properties

| Property name | Type | Description |
|---------------|------|-------------|
| `Published` | Date | Publication date. If absent, posts sort by last-edited time. |
| `Tags` | Multi-select | Post tags. Used for tag pages (`/tag/[tag]`) and `article:tag` OG metadata. |
| `Category` | Select | Post category. Used for breadcrumbs and `article:section` OG metadata. |
| `Slug` | Text (Rich text) | Custom URL slug, e.g. `my-first-post`. Falls back to the Notion page ID. |
| `Description` | Text (Rich text) | Meta description. Truncated at 160 characters. |
| `Author` | Text (Rich text) | Author name for this specific post. Overrides the site-level `author`. |

:::tip Case-insensitive matching
Noxion matches property names **case-insensitively**. `public`, `Public`, and `PUBLIC` all work. Extra, unknown properties are silently ignored.
:::

### Database example

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Title                    │ Public │ Published   │ Tags          │ Category │
├──────────────────────────────────────────────────────────────────────────┤
│ My First Blog Post       │ ✓      │ Jan 15 2025 │ react, next   │ Web Dev  │
│ Getting Started with Bun │ ✓      │ Feb 3 2025  │ bun, tooling  │ Tools    │
│ Draft: AI in 2025        │        │             │ ai            │          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Docs database schema

For documentation sites, use these properties:

| Property name | Type | Required | Description |
|---------------|------|----------|-------------|
| `Title` | Title | ✅ | The page title |
| `Public` | Checkbox | ✅ | Check to publish |
| `Section` | Select | Recommended | Groups docs in the sidebar (e.g. "Getting Started", "API") |
| `Order` | Number | Recommended | Sort order within a section (lower = first) |
| `Slug` | Text | Recommended | Custom URL slug |
| `Description` | Text | — | Meta description |
| `Version` | Text | — | Version tag (e.g. "v2", "latest") |

### Database example

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Title                 │ Public │ Section          │ Order │ Version       │
├───────────────────────────────────────────────────────────────────────────┤
│ Introduction          │ ✓      │ Getting Started  │ 1     │ latest        │
│ Installation          │ ✓      │ Getting Started  │ 2     │ latest        │
│ Configuration         │ ✓      │ API Reference    │ 1     │ latest        │
│ Plugin API            │ ✓      │ API Reference    │ 2     │ latest        │
└───────────────────────────────────────────────────────────────────────────┘
```

The `Section` property is used to group pages in the sidebar navigation. Pages within a section are sorted by `Order`.

---

## Portfolio database schema

For portfolio/project sites, use these properties:

| Property name | Type | Required | Description |
|---------------|------|----------|-------------|
| `Title` | Title | ✅ | Project name |
| `Public` | Checkbox | ✅ | Check to publish |
| `Technologies` | Multi-select | Recommended | Tech stack (e.g. "React", "TypeScript", "Node.js") |
| `Project URL` | URL or Text | — | Link to the live project |
| `Year` | Text | — | Year the project was built |
| `Featured` | Checkbox | — | Mark projects to feature prominently |
| `Slug` | Text | Recommended | Custom URL slug |
| `Description` | Text | — | Meta description |

### Database example

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ Title              │ Public │ Technologies         │ Year │ Featured │ URL     │
├────────────────────────────────────────────────────────────────────────────────┤
│ Noxion             │ ✓      │ TypeScript, React     │ 2026 │ ✓        │ nox.io  │
│ CLI Tool           │ ✓      │ Rust, CLI             │ 2025 │          │         │
│ Design System      │ ✓      │ React, Storybook      │ 2024 │ ✓        │ ds.io   │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Schema mapping

Noxion automatically maps Notion database properties to page fields using **conventions** per page type. You don't need to configure anything if you follow the property names above.

If your Notion database uses different property names, you can override the mapping in `noxion.config.ts`:

```ts
collections: [
  {
    databaseId: process.env.DOCS_NOTION_ID!,
    pageType: "docs",
    pathPrefix: "docs",
    schema: {
      section: "Department",    // Your Notion property name → Noxion field
      order: "Sort Order",
      version: "Release",
    },
  },
],
```

---

## Get the page ID

The **page ID** is a 32-character hexadecimal string that uniquely identifies your database page.

### From the browser URL

Open your Notion database. The URL looks like:

```
https://notion.so/yourworkspace/Blog-abc123def456789012345678901234
                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                      This is your page ID (32 chars)
```

The ID may also appear with hyphens (UUID format): `abc123de-f456-7890-1234-567890123456`. Both formats are equivalent.

### From the Share menu

1. Open your database
2. Click **Share** in the top right
3. Click **Copy link**
4. Extract the 32-char hex string from the URL

### Setting the ID

For a single blog:

```bash
# .env
NOTION_PAGE_ID=abc123def456789012345678901234
```

For multiple databases:

```bash
# .env
NOTION_PAGE_ID=abc123...           # Blog database
DOCS_NOTION_ID=def456...           # Docs database
PORTFOLIO_NOTION_ID=ghi789...      # Portfolio database
```

---

## Private pages (optional)

By default, Noxion accesses Notion pages **anonymously** — the same way Notion's "Share to web" feature works. This requires your database page to be **shared to web** (public).

For private pages (not shared to web), you need to create a Notion integration:

### Step 1: Create an integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **New integration**
3. Give it a name (e.g., "Noxion")
4. Set **Associated workspace** to your workspace
5. Under **Capabilities**, enable:
   - ✅ Read content
   - ❌ Insert content (not needed)
   - ❌ Update content (not needed)
6. Click **Submit**
7. Copy the **Internal Integration Token** (`secret_xxx...`)

### Step 2: Connect the integration to your database(s)

1. Open each Notion database you want Noxion to access
2. Click the **`...`** menu (top right)
3. Click **Add connections**
4. Search for and select your integration

### Step 3: Add to environment variables

```bash
# .env
NOTION_TOKEN=secret_xxx...
```

:::warning Token security
Never commit your integration token to git. The `.gitignore` generated by `create-noxion` already excludes `.env`.
:::

---

## Writing content

Once your database is set up, creating new content is straightforward:

1. Open your database in Notion
2. Click **New** to create a new page
3. Write your content using Notion's editor — headings, code blocks, images, embeds, callouts, etc.
4. Fill in the database properties (Tags, Category, Description, etc.)
5. When ready to publish, **check the `Public` checkbox**

Your content will appear on your site within:
- **~1 hour** (default ISR revalidation interval)
- **Instantly** if you trigger [on-demand revalidation](./configuration#on-demand-revalidation)

---

## Frontmatter overrides

Noxion reads a special **code block** at the very beginning of a Notion page (it must be the first content block) and treats its contents as per-page metadata overrides.

### How to add frontmatter

1. Open your page in Notion
2. Click at the very top of the page body (before any text)
3. Type `/code` and press Enter to insert a code block
4. Type your `key: value` pairs

Example:

```
cleanUrl: /my-custom-slug
title: A Better SEO Title | My Site
description: A hand-written meta description optimized for click-through rates.
```

### Supported keys

| Key | Type | Description |
|-----|------|-------------|
| `cleanUrl` | string | Override the URL slug. Example: `/my-post` → slug becomes `my-post` |
| `slug` | string | Alias for `cleanUrl` (without the leading slash) |
| `title` | string | Override the `<title>` tag |
| `description` | string | Override the `<meta description>` content |
| `date` | string | Override the publication date (`YYYY-MM-DD`) |
| `category` | string | Override the category |
| `tags` | string | Override tags (comma-separated: `react, typescript, web`) |
| `coverImage` / `cover` | string | Override the cover image URL |

Any other keys are preserved in `page.frontmatter` as a `Record<string, string>` for custom use in your app.

The frontmatter code block is **visible** in your Notion page but hidden in the rendered output.

---

## Supported Notion block types

Noxion uses its own block renderer ([`@noxion/notion-renderer`](https://github.com/jiwonme/noxion/tree/main/packages/notion-renderer)) which supports 30+ Notion block types:

| Block type | Rendered as |
|------------|-------------|
| Paragraph | `<p>` with full rich text (bold, italic, code, color, links, mentions) |
| Heading 1/2/3 | `<h1>` / `<h2>` / `<h3>` with anchor links |
| Bulleted list | `<ul><li>` with nested list support |
| Numbered list | `<ol><li>` with nested list support |
| To-do list | Checkbox list with checked/unchecked states |
| Toggle | `<details><summary>` with animated expand/collapse |
| Quote | `<blockquote>` |
| Callout | Styled callout box with emoji/icon |
| Code block | Syntax-highlighted via [Shiki](https://shiki.style) (38 languages, dual light/dark themes) |
| Image | Optimized via `notion.so/image/` proxy URLs |
| Divider | `<hr>` |
| Table | HTML `<table>` with header row support |
| Column layout | Multi-column flex layout |
| Embed | iFrame embed |
| Video | HTML5 `<video>` or YouTube/Vimeo embed |
| Audio | HTML5 `<audio>` player |
| PDF | Embedded PDF viewer |
| File | Download link with file metadata |
| Bookmark | Rich link card with title, description, and icon |
| Equation (block) | Server-side KaTeX rendering (zero client JS) |
| Equation (inline) | Inline KaTeX within rich text |
| Mention | Page, user, date, and database mentions |
| Synced blocks | Rendered inline with source content |
| Table of contents | Auto-generated from page headings |

:::note Inline databases
Inline databases (collection views) inside a page are rendered as a placeholder. Full collection view support is planned for a future release.
:::
