"use client";

import { useCallback } from "react";
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
  className,
}: NotionPageProps) {
  const theme = useNoxionTheme();
  const overrides = useNoxionComponents();

  const resolvedDarkMode = darkMode ?? theme.name === "dark";

  const signedUrls = (recordMap as unknown as Record<string, unknown>).signed_urls as Record<string, string> | undefined;

  const imageUrlMapper = useCallback(
    (url: string | undefined, block: { id?: string }) => {
      if (signedUrls && block?.id && signedUrls[block.id]) {
        return signedUrls[block.id];
      }
      return url ?? "";
    },
    [signedUrls]
  );

  const notionComponents: Record<string, unknown> = {};
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
        mapImageUrl={imageUrlMapper}
        components={notionComponents}
      />
    </div>
  );
}
