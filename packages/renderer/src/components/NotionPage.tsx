"use client";

import { useState, useEffect } from "react";
import { NotionRenderer, createShikiHighlighter } from "@noxion/notion-renderer";
import type { ExtendedRecordMap } from "notion-types";
import type { HighlightCodeFn } from "@noxion/notion-renderer";
import { defaultMapImageUrl } from "notion-utils";

const highlighterPromise = createShikiHighlighter({
  theme: "github-light",
  darkTheme: "github-dark",
});

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

  const [highlightCode, setHighlightCode] = useState<HighlightCodeFn | undefined>();

  useEffect(() => {
    highlighterPromise.then((fn) => setHighlightCode(() => fn));
  }, []);

  return (
    <div className={className}>
      <NotionRenderer
        recordMap={recordMap}
        rootPageId={rootPageId}
        fullPage={fullPage}
        darkMode={resolvedDarkMode}
        previewImages={previewImages}
        highlightCode={highlightCode}
        mapPageUrl={(pageId: string) => `${pageUrlPrefix}${pageId}`}
        mapImageUrl={(url, block) => defaultMapImageUrl(url, block) ?? url}
      />
    </div>
  );
}
