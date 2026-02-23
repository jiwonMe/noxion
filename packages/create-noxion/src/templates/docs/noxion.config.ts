import { defineConfig } from "@noxion/core";

const config = defineConfig({
  name: process.env.SITE_NAME ?? "{{SITE_NAME}}",
  domain: process.env.SITE_DOMAIN ?? "{{DOMAIN}}",
  author: process.env.SITE_AUTHOR ?? "{{AUTHOR}}",
  description: process.env.SITE_DESCRIPTION ?? "{{SITE_DESCRIPTION}}",
  language: "en",
  defaultTheme: "system",
  defaultPageType: "docs",
  revalidate: 3600,
  revalidateSecret: process.env.REVALIDATE_SECRET,
  collections: [
    {
      name: "docs",
      databaseId: process.env.NOTION_PAGE_ID!,
      pageType: "docs",
      pathPrefix: "/docs",
    },
  ],
});

export default config;
