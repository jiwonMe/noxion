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

---

## Advanced Sidebar Customization

The sidebar is the primary navigation tool for documentation. Noxion provides several ways to customize its structure and appearance directly from Notion.

### Nested Sections

You can create nested sections by using a delimiter in the `Section` property. By default, Noxion looks for the `/` character to split sections into a hierarchy.

| Notion Section Value | Sidebar Result |
|----------------------|----------------|
| `API` | Top-level API section |
| `API / Auth` | Auth subsection inside API |
| `API / Auth / OAuth` | OAuth subsection inside Auth |

:::tip
Deep nesting beyond three levels is generally discouraged for usability. Stick to two levels where possible.
:::

### Custom Section Ordering

Sections are ordered alphabetically by default. To enforce a specific order, you can prefix section names with numbers in Notion, which Noxion will strip during rendering:

1. `01. Getting Started`
2. `02. Core Concepts`
3. `03. Advanced Usage`

### Icons and Badges

You can add icons to sections by including an emoji or a specific icon key in the section name. For badges (like "New" or "Beta"), use the following syntax in the `Title` property:

- `Title`: `Authentication [New]`
- `Title`: `Legacy API [Deprecated]`

The `DocsSidebar` component parses these brackets and renders them as styled badges.

### Hiding Pages

To hide a page from the sidebar while keeping it accessible via direct link:
1. Keep `Public` checked.
2. Add a property named `Hide from Sidebar` (Checkbox) and check it.
3. Alternatively, set `Order` to `-1`.

---

## Versioning

Noxion supports multi-version documentation out of the box. This is essential for projects that need to maintain docs for older releases.

### The Version Property

Add a `Version` property (Select or Text) to your Notion database. This allows you to tag pages with specific release versions (e.g., `v1.0`, `v2.0`, `latest`).

### Filtering by Version

In your `noxion.config.ts`, you can define which version should be treated as the default:

```ts
collections: [
  {
    name: "Documentation",
    databaseId: process.env.DOCS_NOTION_ID!,
    pageType: "docs",
    pathPrefix: "docs",
    schema: {
      version: "Release", // Maps to Notion property "Release"
    },
  },
],
```

### Version Dropdown Component

The `VersionDropdown` component automatically detects all unique values in the `Version` property and renders a selector in the documentation header.

:::note
When a user selects a version, Noxion filters the sidebar and search results to only show pages matching that version.
:::

---

## Search

Search is critical for large documentation sites. Noxion includes a built-in search implementation that indexes your Notion content.

### How Search Works

1. **Indexing**: During the build process, Noxion fetches all public pages and creates a local search index.
2. **Client-side Search**: The `DocsSearch` component uses this index to provide instantaneous results without external API calls.
3. **Content Weighting**: Titles and headings are weighted more heavily than body text.

### Customizing Search Behavior

You can exclude specific pages from search by adding a `No Index` checkbox property in Notion. If checked, the page will be omitted from the search index.

### Adding Search to the Sidebar

To include a search bar at the top of the sidebar, enable it in your theme configuration:

```ts
themeConfig: {
  docs: {
    sidebar: {
      search: true,
      placeholder: "Search docs...",
    },
  },
},
```

---

## Cross-referencing

Stable links between pages are vital for a cohesive documentation experience.

### Linking in Notion

When you link to another page within Notion, Noxion automatically converts that internal Notion link into a relative URL based on the target page's `Slug` or `Title`.

### Using Slugs for Stability

Always define a `Slug` property for your pages. If you rename a page title in Notion, the URL will remain stable as long as the slug doesn't change.

| Title | Slug | Resulting URL |
|-------|------|---------------|
| `Getting Started` | `intro` | `/docs/intro` |
| `Advanced Config` | `config-advanced` | `/docs/config-advanced` |

### Breadcrumb Navigation

The `DocsBreadcrumb` component provides automatic path navigation at the top of every page. It uses the `Section` hierarchy to build the trail.

```tsx
import { DocsBreadcrumb } from "@noxion/renderer";

// Usage in a custom template
<DocsBreadcrumb />
```

---

## Advanced Configuration

For complex documentation needs, you can customize the schema mapping in `noxion.config.ts`. This allows you to use custom Notion property names that match your existing workflow.

```ts
collections: [
  {
    name: "Documentation",
    databaseId: process.env.DOCS_NOTION_ID!,
    pageType: "docs",
    pathPrefix: "docs",
    schema: {
      section: "Department",    // custom Notion property name for grouping
      order: "Sort Order",      // custom property for ordering
      version: "Release",       // custom property for versioning
      lastUpdated: "Updated",   // show "Last updated" date on pages
    },
  },
],
```

:::warning
Ensure that the property names in your config exactly match the property names in your Notion database (case-sensitive).
:::

---

## Docs-specific SEO

Noxion goes beyond standard meta tags to ensure your documentation ranks well and appears correctly in search engines.

### TechArticle JSON-LD

While blogs use `BlogPosting`, documentation pages use the `TechArticle` schema. This tells search engines that the content is technical in nature, which can improve visibility for developer-focused queries.

Key fields included:
- `dependencies`: Extracted from a "Dependencies" property if present.
- `proficiencyLevel`: Set via a "Difficulty" property.
- `articleSection`: Mapped from the `Section` property.

### Automatic Breadcrumb Generation

Noxion generates `BreadcrumbList` JSON-LD for every page, which search engines use to display rich snippets in search results. This shows the hierarchy (e.g., `Docs > API > Authentication`) directly in the search result.

---

## Real-world Example

A complete documentation database typically looks like this:

| Title | Public | Section | Order | Version | Slug |
|-------|--------|---------|-------|---------|------|
| Welcome | ✓ | Introduction | 1 | v1.0 | welcome |
| Quick Start | ✓ | Introduction | 2 | v1.0 | quick-start |
| Architecture | ✓ | Core Concepts | 1 | v1.0 | architecture |
| State Management | ✓ | Core Concepts | 2 | v1.0 | state |
| CLI Reference | ✓ | API | 1 | v1.0 | cli |
| Node.js SDK | ✓ | API | 2 | v1.0 | sdk-node |
| Python SDK | ✓ | API | 3 | v1.0 | sdk-python |
| Deployment | ✓ | Operations | 1 | v1.0 | deploy |
| Monitoring | ✓ | Operations | 2 | v1.0 | monitor |
| Migration Guide | ✓ | Resources | 1 | v1.0 | migrate |

This structure results in a clean, organized sidebar with five distinct sections and logical page flow.
