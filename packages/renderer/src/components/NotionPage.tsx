"use client";

import { useState, useEffect } from "react";
import { NotionRenderer } from "@noxion/notion-renderer";
import type { ExtendedRecordMap } from "notion-types";
import { defaultMapImageUrl } from "notion-utils";

export interface NotionPageProps {
  recordMap: ExtendedRecordMap;
  rootPageId?: string;
  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  pageUrlPrefix?: string;
  className?: string;
}

function useDetectDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsDark(document.documentElement.dataset.theme === "dark");
    };
    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export function NotionPage({
  recordMap,
  rootPageId,
  fullPage = true,
  darkMode,
  previewImages = false,
  pageUrlPrefix = "/",
  className,
}: NotionPageProps) {
  const detectedDark = useDetectDarkMode();
  const resolvedDarkMode = darkMode ?? detectedDark;

  return (
    <div className={className}>
      <NotionRenderer
        recordMap={recordMap}
        rootPageId={rootPageId}
        fullPage={fullPage}
        darkMode={resolvedDarkMode}
        previewImages={previewImages}
        mapPageUrl={(pageId: string) => `${pageUrlPrefix}${pageId}`}
        mapImageUrl={(url, block) => defaultMapImageUrl(url, block) ?? url}
      />
    </div>
  );
}
