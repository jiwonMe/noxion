import type { NextConfig } from "next";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const withVanillaExtract = createVanillaExtractPlugin();

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

export default withVanillaExtract(nextConfig);
