import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@noxion/renderer",
    "@noxion/notion-renderer",
    "@noxion/theme-default",
    "@noxion/theme-beacon",
    "@carbon/react",
    "@carbon/styles",
    "notion-client",
    "notion-types",
    "notion-utils",
  ],
};

export default nextConfig;
