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
  mapPageUrl?: (pageId: string) => string;
  mapImageUrl?: (url: string | undefined, block: unknown) => string | undefined;
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
  mapPageUrl,
  mapImageUrl,
  className,
}: NotionPageProps) {
  const theme = useNoxionTheme();
  const overrides = useNoxionComponents();

  const resolvedDarkMode = darkMode ?? theme.name === "dark";

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
        mapPageUrl={mapPageUrl}
        mapImageUrl={mapImageUrl}
        components={notionComponents}
      />
    </div>
  );
}
