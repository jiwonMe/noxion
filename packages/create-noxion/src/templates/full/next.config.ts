import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@noxion/core",
    "@noxion/renderer",
    "@noxion/adapter-nextjs",
    "@noxion/notion-renderer",
    "notion-client",
    "notion-types",
    "notion-utils",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "notion.so" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
    ],
  },
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
