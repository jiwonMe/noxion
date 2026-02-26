"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Block } from "notion-types";
import type { NotionRendererContextValue, NotionComponents, MapPageUrlFn, MapImageUrlFn } from "./types";
import type { BlockOverrideResult, RendererPlugin } from "./plugin/types";
import { resolveBlockRenderer } from "./plugin/executor";

const defaultMapPageUrl: MapPageUrlFn = (pageId) => `/${pageId}`;
const defaultMapImageUrl: MapImageUrlFn = (url) => url;
const defaultComponents: NotionComponents = {};

const NotionRendererContext = createContext<NotionRendererContextValue>({
  recordMap: { block: {}, collection: {}, collection_view: {}, collection_query: {}, notion_user: {}, signed_urls: {} },
  plugins: [],
  mapPageUrl: defaultMapPageUrl,
  mapImageUrl: defaultMapImageUrl,
  components: defaultComponents,
  fullPage: true,
  darkMode: false,
  previewImages: false,
  headingIds: new Set<string>(),
});

export interface NotionRendererProviderProps {
  value: NotionRendererContextValue;
  children: ReactNode;
}

export function NotionRendererProvider({ value, children }: NotionRendererProviderProps) {
  return (
    <NotionRendererContext.Provider value={value}>
      {children}
    </NotionRendererContext.Provider>
  );
}

export function useNotionRenderer(): NotionRendererContextValue {
  return useContext(NotionRendererContext);
}

export function useNotionBlock(blockId: string): Block | undefined {
  const { recordMap } = useNotionRenderer();
  const blockValue = recordMap.block[blockId];
  if (!blockValue) return undefined;

  const val = blockValue.value;
  if (val && typeof val === "object" && "role" in val && "value" in val) {
    return (val as { role: string; value: Block }).value;
  }
  return val as Block;
}

export function useResolvedBlockRenderer(block: Block, blockId: string): BlockOverrideResult | null {
  const plugins = useRendererPlugins();
  return resolveBlockRenderer(block, blockId, plugins);
}

export function useRendererPlugins(): RendererPlugin[] {
  const { plugins } = useNotionRenderer();
  return plugins ?? [];
}

export { defaultMapPageUrl, defaultMapImageUrl, defaultComponents };
