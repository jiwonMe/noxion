import { defineConfig, createRSSPlugin } from "@noxion/core";

const config = defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  rootNotionSpaceId: process.env.NOTION_SPACE_ID,
  name: process.env.SITE_NAME ?? "{{SITE_NAME}}",
  domain: process.env.SITE_DOMAIN ?? "{{DOMAIN}}",
  author: process.env.SITE_AUTHOR ?? "{{AUTHOR}}",
  description: process.env.SITE_DESCRIPTION ?? "{{SITE_DESCRIPTION}}",
  language: "en",
  defaultTheme: "system",
  revalidate: 3600,
  revalidateSecret: process.env.REVALIDATE_SECRET,
  plugins: [
    createRSSPlugin({
      feedPath: "/feed.xml",
      limit: 20,
    }),
  ],
});

export default config;
