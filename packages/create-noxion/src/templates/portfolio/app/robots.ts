import type { MetadataRoute } from "next";
import { generateNoxionRobots } from "@noxion/adapter-nextjs";
import { siteConfig } from "../lib/config";

export default function robots(): MetadataRoute.Robots {
  return generateNoxionRobots(siteConfig);
}
