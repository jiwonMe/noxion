import type { MetadataRoute } from "next";
import type { NoxionConfig } from "@noxion/core";

export function generateNoxionRobots(config: NoxionConfig): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `https://${config.domain}/sitemap.xml`,
  };
}
