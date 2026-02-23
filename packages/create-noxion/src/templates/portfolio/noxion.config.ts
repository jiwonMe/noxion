import { defineConfig } from "@noxion/core";

const config = defineConfig({
  name: process.env.SITE_NAME ?? "{{SITE_NAME}}",
  domain: process.env.SITE_DOMAIN ?? "{{DOMAIN}}",
  author: process.env.SITE_AUTHOR ?? "{{AUTHOR}}",
  description: process.env.SITE_DESCRIPTION ?? "{{SITE_DESCRIPTION}}",
  language: "en",
  defaultTheme: "system",
  defaultPageType: "portfolio",
  revalidate: 3600,
  revalidateSecret: process.env.REVALIDATE_SECRET,
  collections: [
    {
      name: "portfolio",
      databaseId: process.env.NOTION_PAGE_ID!,
      pageType: "portfolio",
      pathPrefix: "/projects",
    },
  ],
});

export default config;
