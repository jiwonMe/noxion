"use client";

import { NotionPage as RendererNotionPage } from "@noxion/renderer";
import type { NotionPageProps as RendererNotionPageProps } from "@noxion/renderer";

export interface BeaconNotionPageProps {
  recordMap: unknown;
  rootPageId?: string;
  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  pageUrlPrefix?: string;
}

export function NotionPage(props: BeaconNotionPageProps) {
  return (
    <div className="">
      <RendererNotionPage {...(props as RendererNotionPageProps)} />
    </div>
  );
}
