"use client";

import { NotionPage as RendererNotionPage } from "@noxion/renderer";
import type { NotionPageProps as RendererNotionPageProps } from "@noxion/renderer";

export interface CarbonNotionPageProps {
  recordMap: unknown;
  rootPageId?: string;
  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  pageUrlPrefix?: string;
  className?: string;
}

export function NotionPage(props: CarbonNotionPageProps) {
  const wrapperClassName = props.className
    ? `notion-page-wrapper ${props.className}`
    : "notion-page-wrapper";

  return (
    <div className={wrapperClassName}>
      <RendererNotionPage {...(props as RendererNotionPageProps)} />
    </div>
  );
}
