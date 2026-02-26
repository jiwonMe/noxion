---
sidebar_position: 9
title: Building a Portfolio
description: Set up a portfolio site with project cards, filtering, and detail pages — all powered by Notion.
---

# Building a Portfolio

This guide walks you through creating a portfolio site with Noxion. Your portfolio will have a project grid with technology filtering, featured project highlighting, and individual project detail pages.

---

## Step 1: Scaffold the project

```bash
bun create noxion my-portfolio --template portfolio
```

---

## Step 2: Set up the Notion database

Create a Notion database with these properties:

| Property | Type | Description |
|----------|------|-------------|
| Title | Title | Project name (required) |
| Public | Checkbox | Check to publish (required) |
| Technologies | Multi-select | Tech stack tags (e.g. "React", "TypeScript") |
| Project URL | URL or Text | Link to the live project |
| Year | Text | Year the project was built |
| Featured | Checkbox | Feature this project prominently |
| Slug | Text | Custom URL slug |
| Description | Text | Project description |

### Example database

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Title            │ Public │ Technologies       │ Year │ Featured │ URL   │
├──────────────────────────────────────────────────────────────────────────┤
│ Noxion           │ ✓      │ TypeScript, React   │ 2026 │ ✓        │ ...   │
│ CLI Tool         │ ✓      │ Rust, CLI           │ 2025 │          │       │
│ Design System    │ ✓      │ React, Storybook    │ 2024 │ ✓        │ ...   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Step 3: Configuration

```ts
import { defineConfig } from "@noxion/core";

export default defineConfig({
  name: "My Portfolio",
  domain: "portfolio.example.com",
  author: "Your Name",
  description: "Projects and work by Your Name",
  collections: [
    {
      name: "Projects",
      databaseId: process.env.NOTION_PAGE_ID!,
      pageType: "portfolio",
      pathPrefix: "portfolio",
    },
  ],
});
```

---

## Step 4: How it works

### Project grid

The homepage renders a grid of project cards using the `PortfolioGrid` template. Each card shows the project title, description, technologies, and year.

### Filtering

The `PortfolioFilter` component extracts all unique technology tags from your projects and renders filter buttons. Clicking a technology filters the grid to show only matching projects.

### Featured projects

Projects with the `Featured` checkbox checked appear at the top of the grid or in a separate featured section, depending on your template.

### URL structure

```
https://portfolio.example.com/portfolio/noxion
https://portfolio.example.com/portfolio/cli-tool
```

### SEO

Portfolio pages generate `CreativeWork` JSON-LD, which is the appropriate schema.org type for projects and creative works.

---

## Step 5: Full site with blog + portfolio

To combine a blog with your portfolio:

```ts
collections: [
  { databaseId: process.env.NOTION_PAGE_ID!, pageType: "blog" },
  { databaseId: process.env.PORTFOLIO_NOTION_ID!, pageType: "portfolio", pathPrefix: "portfolio" },
],
```

---

## Filtering in Detail

The filtering system in Noxion is designed to be automatic and zero-maintenance.

### How PortfolioFilter Works

The `PortfolioFilter` component performs a multi-step process to generate the UI:
1. **Extraction**: It scans the `Technologies` property of all public projects.
2. **Deduplication**: It creates a unique set of all tags found.
3. **Sorting**: Tags are sorted alphabetically or by frequency of use.
4. **Rendering**: It generates a list of interactive buttons.

### Creating Custom Filter Logic

If you want to filter by something other than technologies (e.g., "Industry" or "Project Type"), you can update the `schema` in your config:

```ts
collections: [
  {
    name: "Projects",
    databaseId: process.env.PORTFOLIO_NOTION_ID!,
    pageType: "portfolio",
    schema: {
      tags: "Industry", // Use "Industry" property for filtering instead of "Technologies"
    },
  },
],
```

### Combining Filters

Noxion supports multi-dimensional filtering. You can allow users to filter by both Technology and Year simultaneously.

| Filter Type | Implementation |
|-------------|----------------|
| Technology | Multi-select property |
| Year | Select or Text property |
| Status | Select (e.g., "Completed", "In Progress") |

### URL-based Filtering

Filters are synchronized with the URL query parameters. This allows users to share a link to a specific filtered view of your portfolio.

Example: `portfolio.example.com/?tech=React&year=2025`

---

## Featured Projects

Highlighting your best work is essential for a professional portfolio.

### The Featured Checkbox

When the `Featured` property is checked in Notion, Noxion treats that project with higher priority.

### Customizing Featured Project Display

You can choose how featured projects are presented in your `themeConfig`:

```ts
themeConfig: {
  portfolio: {
    featuredDisplay: "hero", // Options: "hero", "pinned", "separate"
  },
},
```

- **hero**: The most recent featured project gets a full-width hero section.
- **pinned**: Featured projects stay at the top of the grid regardless of date.
- **separate**: A dedicated "Featured Work" section appears above the main grid.

### Separate Featured Section vs. Pinned

| Approach | Best For |
|----------|----------|
| Pinned | Small portfolios where you want to control the exact order. |
| Separate | Large portfolios where you want to distinguish "Case Studies" from "Experiments". |

---

## Custom Project Layouts

Every project is unique, and your portfolio should reflect that.

### Grid vs List View

While the default is a responsive grid, you can switch to a list view for a more editorial feel.

```tsx
<PortfolioGrid layout="list" />
```

### Card Customization

You can control exactly what data appears on your project cards via the `cardFields` config:

```ts
themeConfig: {
  portfolio: {
    cardFields: ["title", "description", "technologies", "year"],
  },
},
```

### Detail Page Customization

The project detail page renders the full content of your Notion page. You can use all of Notion's layout features, including:
- **Columns**: For side-by-side text and images.
- **Callouts**: For highlighting key takeaways or project stats.
- **Galleries**: For showing multiple screenshots.

### Embedding Live Demos

Use the Notion `/embed` block to include live demos, Figma prototypes, or YouTube videos directly in your project page. Noxion will render these as responsive iframes.

---

## Portfolio-specific SEO

Noxion ensures your work is discoverable and looks great when shared.

### CreativeWork JSON-LD Schema

Unlike blog posts, projects are marked up as `CreativeWork`. This schema includes specific fields for:
- `keywords`: Automatically populated from your `Technologies` tags.
- `dateCreated`: Mapped from the `Year` property.
- `url`: The link to the live project.

### Keywords from Technologies

Each tag in your `Technologies` multi-select is added to the page's `<meta name="keywords">` tag and the JSON-LD `keywords` array. This helps search engines understand the technical context of your work.

### Project Images in OG Tags

Noxion uses the Notion page cover as the `og:image`. If no cover is set, it falls back to the first image found in the page content.

| Image Source | Priority |
|--------------|----------|
| Page Cover | 1 (Highest) |
| First Image Block | 2 |
| Site Default OG | 3 (Lowest) |

---

## Combining with Blog

Many developers want a site that showcases both their projects and their thoughts.

### Full Site Setup

A typical "Developer Home" configuration looks like this:

```ts
export default defineConfig({
  name: "Jane Doe",
  collections: [
    { 
      name: "Blog", 
      databaseId: process.env.BLOG_ID!, 
      pageType: "blog", 
      pathPrefix: "blog" 
    },
    { 
      name: "Portfolio", 
      databaseId: process.env.PORTFOLIO_ID!, 
      pageType: "portfolio", 
      pathPrefix: "projects" 
    },
  ],
});
```

### Shared Navigation

Noxion automatically generates a navigation menu that includes all your collections. You can customize the order in `themeConfig.nav`.

### Cross-linking

You can link from a blog post to a portfolio project using standard Notion links. Noxion will resolve these to the correct `/projects/my-cool-app` URL at build time.

---

## Real-world Examples

### Complete Portfolio Database

| Title | Public | Technologies | Year | Featured | Slug |
|-------|--------|--------------|------|----------|------|
| Noxion | ✓ | TypeScript, Next.js | 2026 | ✓ | noxion |
| AI Chatbot | ✓ | Python, OpenAI | 2025 | ✓ | ai-chat |
| Weather App | ✓ | React, API | 2024 | | weather |
| Task Manager | ✓ | Vue, Firebase | 2024 | | tasks |
| Portfolio v1 | ✓ | HTML, CSS | 2023 | | v1 |
| E-commerce | ✓ | Shopify, Liquid | 2025 | ✓ | shop |
| Crypto Dashboard | ✓ | Svelte, Web3 | 2024 | | crypto |
| Mobile Game | ✓ | Unity, C# | 2023 | | game |

### Multi-type Site Configuration

For a site with a blog, portfolio, and documentation:

```ts
collections: [
  { 
    name: "Writing", 
    databaseId: "...", 
    pageType: "blog", 
    pathPrefix: "blog" 
  },
  { 
    name: "Work", 
    databaseId: "...", 
    pageType: "portfolio", 
    pathPrefix: "work" 
  },
  { 
    name: "Docs", 
    databaseId: "...", 
    pageType: "docs", 
    pathPrefix: "docs" 
  },
],
```

This setup provides a comprehensive personal or company website powered entirely by Notion.
