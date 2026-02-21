"use client";

import { NotionRenderer } from "react-notion-x";
import type { ExtendedRecordMap } from "notion-types";
import { useNoxionComponents, useNoxionTheme } from "../theme/ThemeProvider";

export interface NotionPageProps {
  recordMap: ExtendedRecordMap;
  rootPageId?: string;
  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  showTableOfContents?: boolean;
  minTableOfContentsItems?: number;
  pageUrlPrefix?: string;
  nextImage?: unknown;
  className?: string;
}

export function NotionPage({
  recordMap,
  rootPageId,
  fullPage = true,
  darkMode,
  previewImages = false,
  showTableOfContents = false,
  minTableOfContentsItems = 3,
  pageUrlPrefix = "/",
  nextImage,
  className,
}: NotionPageProps) {
  const theme = useNoxionTheme();
  const overrides = useNoxionComponents();

  const resolvedDarkMode = darkMode ?? theme.name === "dark";

  const notionComponents: Record<string, unknown> = {};
  if (nextImage) {
    notionComponents.nextImage = nextImage;
  }
  if (overrides.NotionBlock) {
    for (const [blockType, component] of Object.entries(overrides.NotionBlock)) {
      notionComponents[blockType] = component;
    }
  }

  return (
    <div className={className}>
      <NotionRenderer
        recordMap={recordMap}
        rootPageId={rootPageId}
        fullPage={fullPage}
        darkMode={resolvedDarkMode}
        previewImages={previewImages}
        showTableOfContents={showTableOfContents}
        minTableOfContentsItems={minTableOfContentsItems}
        mapPageUrl={(pageId: string) => `${pageUrlPrefix}${pageId}`}
        
        components={notionComponents}
      />
    </div>
  );
}
