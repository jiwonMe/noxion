---
sidebar_position: 3
title: Notion Setup
description: Configure your Notion database for Noxion.
---

# Notion Setup

Noxion reads your blog posts from a **Notion database**. This page explains exactly how to set it up, what schema properties are supported, and how to get your page ID.

---

## Create the database

In Notion, create a new **full-page database** (not an inline database). The difference matters: Noxion calls the root page to enumerate all posts, and inline databases aren't directly accessible via that page's block tree in the same way.

To create a full-page database:
1. Create a new page
2. Type `/database` and select **Table — Full page**

### Required properties

Add these properties to your database:

| Property name | Type | Required | Description |
|---------------|------|----------|-------------|
| `Title` | Title | ✅ | The post title. Every Notion database has this by default. |
| `Public` | Checkbox | ✅ | Only posts where this is **checked** are fetched and published. Unchecked = draft. |

### Recommended properties

| Property name | Type | Description |
|---------------|------|-------------|
| `Published` | Date | Publication date shown on the post and used for sorting. If absent, posts sort by last-edited time. |
| `Tags` | Multi-select | Post tags. Used for tag filter pages (`/tag/[tag]`) and `article:tag` OG metadata. |
| `Category` | Select | Post category. Used for the breadcrumb (Home → Category → Post) and `article:section` OG metadata. |
| `Slug` | Text (Rich text) | Custom URL slug, e.g. `my-first-post`. If absent, Noxion falls back to the Notion page ID. |
| `Description` | Text (Rich text) | Meta description for search engines. If absent, Noxion uses the post title. Truncated at 160 characters. |
| `Author` | Text (Rich text) | Author name for this specific post. Overrides the site-level `author` in `noxion.config.ts`. |

:::tip Case-insensitive matching
Noxion matches property names **case-insensitively**. `public`, `Public`, and `PUBLIC` all work. Extra, unknown properties are silently ignored. This means you can add as many custom properties to your database as you like — they won't break anything.
:::

:::caution Property types matter
The `Public` / checkbox property **must** be of type `Checkbox`. Similarly, `Published` must be of type `Date` or `Last edited time`. If the type is wrong, the property will be ignored.
:::

---

## Database schema example

Here's what a typical Noxion database looks like in Notion:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Title                    │ Public │ Published   │ Tags          │ Category  │
├─────────────────────────────────────────────────────────────────────────────┤
│ My First Blog Post       │ ✓      │ Jan 15 2025 │ react, next   │ Web Dev   │
│ Getting Started with Bun │ ✓      │ Feb 3 2025  │ bun, tooling  │ Tools     │
│ Draft: AI in 2025        │        │             │ ai            │           │
└─────────────────────────────────────────────────────────────────────────────┘
```

- "My First Blog Post" and "Getting Started with Bun" are published (Public is checked)
- "Draft: AI in 2025" is a draft (Public is unchecked) — it will not appear on the site

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

The ID may also appear with hyphens (UUID format): `abc123de-f456-7890-1234-567890123456`. Both formats are equivalent — you can use either.

### From the Share menu

1. Open your database
2. Click **Share** in the top right
3. Click **Copy link**
4. The link is `https://notion.so/...?v=xxx&p=PAGE_ID` — extract the 32-char hex string

### Setting the ID

Add it to your `.env`:

```bash
NOTION_PAGE_ID=abc123def456789012345678901234
```

Or set it in `noxion.config.ts`:

```ts
export default defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  // ...
});
```

---

## Private pages (optional)

By default, Noxion accesses Notion pages **anonymously** — the same way Notion's "Share to web" feature works. This requires your database page to be **shared to web** (public).

For private pages (not shared to web), you need to create a Notion integration:

### Step 1: Create an integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **New integration**
3. Give it a name (e.g., "Noxion Blog")
4. Set **Associated workspace** to your workspace
5. Under **Capabilities**, enable:
   - ✅ Read content
   - ❌ Insert content (not needed)
   - ❌ Update content (not needed)
6. Click **Submit**
7. Copy the **Internal Integration Token** (`secret_xxx...`)

### Step 2: Connect the integration to your database

1. Open your Notion database
2. Click the **`...`** menu (top right)
3. Click **Add connections**
4. Search for and select your integration

### Step 3: Add to environment variables

```bash
# .env
NOTION_TOKEN=secret_xxx...
```

:::warning Token security
Never commit your integration token to git. The `.gitignore` generated by `create-noxion` already excludes `.env`. For production, add the token as an environment variable in Vercel/Docker.
:::

---

## Writing posts

Once your database is set up, writing a new post is straightforward:

1. Open your database in Notion
2. Click **New** to create a new page
3. Write your content using Notion's editor — headings, code blocks, images, embeds, callouts, etc.
4. Fill in the database properties (Tags, Category, Description, etc.)
5. When ready to publish, **check the `Public` checkbox**

Your post will appear on your blog within:
- **~1 hour** (default ISR revalidation interval)
- **Instantly** if you trigger [on-demand revalidation](./configuration#on-demand-revalidation)

---

## Frontmatter overrides

Noxion reads a special **code block** at the very beginning of a Notion page (it must be the first content block) and treats its contents as per-post metadata overrides.

This lets you override SEO-critical fields without changing your database schema.

### How to add frontmatter

1. Open your post in Notion
2. Click at the very top of the page body (before any text)
3. Type `/code` and press Enter to insert a code block
4. Type your `key: value` pairs in the code block

Example:

```
cleanUrl: /my-custom-slug
title: A Better SEO Title | My Blog
description: A hand-written meta description optimized for click-through rates.
floatFirstTOC: right
```

The code block language doesn't matter — Noxion parses the content regardless.

### Supported keys

| Key | Type | Description |
|-----|------|-------------|
| `cleanUrl` | string | Override the URL slug. Example: `/my-post` → slug becomes `my-post` (leading `/` stripped) |
| `slug` | string | Alias for `cleanUrl` (without the leading slash) |
| `title` | string | Override the `<title>` tag (does NOT affect the Notion page title) |
| `description` | string | Override the `<meta description>` content |
| `date` | string | Override the publication date. Format: `YYYY-MM-DD` |
| `category` | string | Override the category |
| `tags` | string | Override tags (comma-separated: `react, typescript, web`) |
| `coverImage` / `cover` | string | Override the cover image URL |

Any other keys are preserved in `post.frontmatter` as a `Record<string, string>` for custom use in your app.

### Comments in frontmatter

Lines starting with `#` are treated as comments:

```
cleanUrl: /my-post
# title: Draft title (commented out)
description: Published description
```

### Visibility of the code block

The frontmatter code block is **visible** in your Notion page but hidden in the rendered blog output. Noxion's renderer automatically skips the first code block if it was consumed as frontmatter.

---

## Supported Notion block types

Noxion uses [`react-notion-x`](https://github.com/NotionX/react-notion-x) for rendering, which supports the full range of Notion block types:

| Block type | Rendered as |
|------------|-------------|
| Paragraph | `<p>` |
| Heading 1/2/3 | `<h1>` / `<h2>` / `<h3>` |
| Bulleted list | `<ul><li>` |
| Numbered list | `<ol><li>` |
| Toggle | `<details><summary>` |
| Quote | `<blockquote>` |
| Callout | Styled callout box with emoji |
| Code block | Syntax-highlighted code (with copy button) |
| Image | Optimized via `next/image` |
| Divider | `<hr>` |
| Table | HTML table |
| Embed | iFrame embed |
| Video | HTML5 `<video>` or YouTube embed |
| PDF | PDF embed |
| File | Download link |
| Equation (inline/block) | KaTeX |
| Mention | Linked page reference |
| Synced blocks | Rendered inline |

:::note Inline databases
Inline databases and linked database views inside a post are **not** rendered. Only the primary content blocks are supported.
:::
