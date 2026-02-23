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
