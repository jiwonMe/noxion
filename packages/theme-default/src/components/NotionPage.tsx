"use client";

import { NotionPage as RendererNotionPage } from "@noxion/renderer";
import type { NotionPageProps as RendererNotionPageProps } from "@noxion/renderer";

export interface DefaultNotionPageProps {
  recordMap: unknown;
  rootPageId?: string;
  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  pageUrlPrefix?: string;
}

export function NotionPage(props: DefaultNotionPageProps) {
  return (
    <div className="notion-page-wrapper">
      <RendererNotionPage {...(props as RendererNotionPageProps)} />
    </div>
  );
}
