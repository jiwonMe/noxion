import { defineConfig, createRSSPlugin } from "@noxion/core";

const config = defineConfig({
  name: process.env.SITE_NAME ?? "{{SITE_NAME}}",
  domain: process.env.SITE_DOMAIN ?? "{{DOMAIN}}",
  author: process.env.SITE_AUTHOR ?? "{{AUTHOR}}",
  description: process.env.SITE_DESCRIPTION ?? "{{SITE_DESCRIPTION}}",
  language: "en",
  defaultTheme: "system",
  defaultPageType: "blog",
  revalidate: 3600,
  revalidateSecret: process.env.REVALIDATE_SECRET,
  collections: [
    {
      name: "blog",
      databaseId: process.env.NOTION_PAGE_ID!,
      pageType: "blog",
    },
    {
      name: "docs",
      databaseId: process.env.DOCS_NOTION_ID || process.env.NOTION_PAGE_ID!,
      pageType: "docs",
      pathPrefix: "/docs",
    },
    {
      name: "portfolio",
      databaseId: process.env.PORTFOLIO_NOTION_ID || process.env.NOTION_PAGE_ID!,
      pageType: "portfolio",
      pathPrefix: "/projects",
    },
  ],
  plugins: [
    createRSSPlugin({
      feedPath: "/feed.xml",
      limit: 20,
    }),
  ],
});

export default config;
