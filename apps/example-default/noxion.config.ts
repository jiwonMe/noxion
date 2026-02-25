import { defineConfig } from "@noxion/core";

const config = defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  rootNotionSpaceId: process.env.NOTION_SPACE_ID,

  name: process.env.SITE_NAME ?? "Noxion Default Theme Example",
  domain: process.env.SITE_DOMAIN ?? "localhost:3100",
  author: process.env.SITE_AUTHOR ?? "Noxion",
  description:
    process.env.SITE_DESCRIPTION ??
    "A minimal example blog using @noxion/theme-default.",
  language: "en",

  defaultTheme: "system",
  revalidate: 3600,
  revalidateSecret: process.env.REVALIDATE_SECRET,
});

export default config;
