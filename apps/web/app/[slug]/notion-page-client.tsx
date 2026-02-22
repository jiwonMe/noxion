"use client";

import { NotionPage } from "@noxion/renderer";
import type { ExtendedRecordMap } from "@noxion/core";

interface NotionPageClientProps {
  recordMap: ExtendedRecordMap;
  rootPageId: string;
  fullPage?: boolean;
  previewImages?: boolean;
}

export function NotionPageClient({
  recordMap,
  rootPageId,
  fullPage = true,
  previewImages = true,
}: NotionPageClientProps) {
  return (
    <NotionPage
      recordMap={recordMap}
      rootPageId={rootPageId}
      fullPage={fullPage}
      previewImages={previewImages}
    />
  );
}
