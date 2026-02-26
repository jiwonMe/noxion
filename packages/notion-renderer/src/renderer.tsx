"use client";

import type { NotionRendererProps, NotionRendererContextValue, FloatTOCPosition } from "./types";
import type { Block, ExtendedRecordMap } from "notion-types";
import { getTextContent } from "notion-utils";
import { NotionRendererProvider } from "./context";
import { NotionBlock } from "./block";
import { unwrapBlockValue, cs } from "./utils";

interface FrontmatterResult {
  hiddenBlockIds: Set<string>;
  floatTOC?: FloatTOCPosition;
}

function parseFrontmatterFromBlock(
  recordMap: ExtendedRecordMap,
  rootBlock: Block
): FrontmatterResult | undefined {
  const childIds = (rootBlock as { content?: string[] }).content;
  if (!childIds?.length) return undefined;

  const firstChildId = childIds[0];
  const firstChild = unwrapBlockValue<Block>(recordMap.block[firstChildId]);
  if (!firstChild || firstChild.type !== "code") return undefined;

  const props = firstChild.properties as Record<string, unknown[][]> | undefined;
  if (!props?.title) return undefined;

  const codeText = getTextContent(props.title as never);
  if (!codeText.trim()) return undefined;

  const lines = codeText.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
  if (lines.length === 0) return undefined;

  const kvPattern = lines.every((line) => line.includes(":"));
  if (!kvPattern) return undefined;

  const hidden = new Set([firstChildId]);

  const kvMap: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key) kvMap[key] = value;
  }

  let floatTOC: FloatTOCPosition | undefined;
  if (kvMap.floatFirstTOC === "right") {
    floatTOC = "right";
    const tocBlockId = findFirstBlockOfType(recordMap, childIds, "table_of_contents");
    if (tocBlockId) hidden.add(tocBlockId);
  }

  return { hiddenBlockIds: hidden, floatTOC };
}

function findFirstBlockOfType(
  recordMap: ExtendedRecordMap,
  childIds: string[],
  type: string
): string | undefined {
  for (const id of childIds) {
    const block = unwrapBlockValue<Block>(recordMap.block[id]);
    if (block?.type === type) return id;
  }
  return undefined;
}

const defaultMapPageUrl = (pageId: string) => `/${pageId}`;
const defaultMapImageUrl = (url: string) => url;

export function NotionRenderer({
  recordMap,
  plugins = [],
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
  showBlockActions,
}: NotionRendererProps) {

  const blockIds = Object.keys(recordMap.block);
  const headingIds = new Set<string>();

  const resolvedRootId = rootPageId ?? blockIds[0];

  if (!resolvedRootId) return null;

  const rootBlock = unwrapBlockValue<Block>(recordMap.block[resolvedRootId]);
  if (!rootBlock) return null;

  const frontmatterResult = parseFrontmatterFromBlock(recordMap, rootBlock);

  const contextValue: NotionRendererContextValue = {
    recordMap,
    plugins,
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
    hiddenBlockIds: frontmatterResult?.hiddenBlockIds,
    floatTOC: frontmatterResult?.floatTOC,
    headingIds,
    showBlockActions,
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
