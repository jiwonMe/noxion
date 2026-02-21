import { defineConfig, createAnalyticsPlugin, createRSSPlugin, createCommentsPlugin } from "@noxion/core";

const config = defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  rootNotionSpaceId: process.env.NOTION_SPACE_ID,
  name: process.env.SITE_NAME ?? "Noxion Blog",
  domain: process.env.SITE_DOMAIN ?? "localhost:3000",
  author: process.env.SITE_AUTHOR ?? "Noxion",
  description: process.env.SITE_DESCRIPTION ?? "A blog powered by Notion and Noxion",
  language: "en",
  defaultTheme: "system",
  revalidate: 3600,
  revalidateSecret: process.env.REVALIDATE_SECRET,
  plugins: [
    createRSSPlugin({
      feedPath: "/feed.xml",
      limit: 20,
    }),
    ...(process.env.NEXT_PUBLIC_GA_ID
      ? [
          createAnalyticsPlugin({
            provider: "google",
            trackingId: process.env.NEXT_PUBLIC_GA_ID,
          }),
        ]
      : []),
    ...(process.env.NEXT_PUBLIC_GISCUS_REPO
      ? [
          createCommentsPlugin({
            provider: "giscus",
            config: {
              repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
              repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "",
              category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "Announcements",
              categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
            },
          }),
        ]
      : []),
  ],
});

export default config;
