"use client";

import type { NotionRendererProps, NotionRendererContextValue } from "./types";
import { NotionRendererProvider } from "./context";
import { NotionBlock } from "./block";
import { unwrapBlockValue } from "./utils";
import type { Block } from "notion-types";
import { cs } from "./utils";

const defaultMapPageUrl = (pageId: string) => `/${pageId}`;
const defaultMapImageUrl = (url: string) => url;

export function NotionRenderer({
  recordMap,
  rootPageId,
  fullPage = true,
  darkMode = false,
  previewImages = false,
  mapPageUrl = defaultMapPageUrl,
  mapImageUrl = defaultMapImageUrl,
  components = {},
  className,
  header,
  footer,
  pageHeader,
  pageFooter,
  defaultPageIcon,
  defaultPageCover,
  defaultPageCoverPosition,
  highlightCode,
}: NotionRendererProps) {
  const blockIds = Object.keys(recordMap.block);
  const resolvedRootId = rootPageId ?? blockIds[0];

  if (!resolvedRootId) return null;

  const rootBlock = unwrapBlockValue<Block>(recordMap.block[resolvedRootId]);
  if (!rootBlock) return null;

  const contextValue: NotionRendererContextValue = {
    recordMap,
    mapPageUrl,
    mapImageUrl,
    components,
    fullPage,
    darkMode,
    previewImages,
    highlightCode,
    rootPageId: resolvedRootId,
    defaultPageIcon,
    defaultPageCover,
    defaultPageCoverPosition,
  };

  return (
    <NotionRendererProvider value={contextValue}>
      <div className={cs("noxion-renderer", darkMode && "noxion-renderer--dark", className)}>
        {header}
        {pageHeader}
        <NotionBlock blockId={resolvedRootId} level={0} />
        {pageFooter}
        {footer}
      </div>
    </NotionRendererProvider>
  );
}
