import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@noxion/renderer",
    "@noxion/notion-renderer",
    "notion-client",
    "notion-types",
    "notion-utils",
  ],
};

export default nextConfig;
