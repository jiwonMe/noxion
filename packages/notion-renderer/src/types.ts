import type { ExtendedRecordMap, Block, BlockType, Decoration } from "notion-types";
import type { ComponentType, ReactNode } from "react";

export type MapPageUrlFn = (pageId: string) => string;
export type MapImageUrlFn = (url: string, block: Block) => string;
export type HighlightCodeFn = (code: string, language: string) => string;

export interface NotionBlockProps {
  block: Block;
  blockId: string;
  level: number;
  children?: ReactNode;
}

export interface NotionComponents {
  Image?: ComponentType<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
  }>;
  Link?: ComponentType<{
    href: string;
    className?: string;
    children?: ReactNode;
  }>;
  PageLink?: ComponentType<{
    href: string;
    className?: string;
    children?: ReactNode;
  }>;
  nextImage?: ComponentType<Record<string, unknown>>;
  blockOverrides?: Partial<Record<BlockType | string, ComponentType<NotionBlockProps>>>;
}

export type FloatTOCPosition = "right";

export interface NotionRendererProps {
  recordMap: ExtendedRecordMap;
  rootPageId?: string;
  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  mapPageUrl?: MapPageUrlFn;
  mapImageUrl?: MapImageUrlFn;
  highlightCode?: HighlightCodeFn;
  components?: Partial<NotionComponents>;
  className?: string;
  bodyClassName?: string;
  header?: ReactNode;
  footer?: ReactNode;
  pageHeader?: ReactNode;
  pageFooter?: ReactNode;
  pageCover?: ReactNode;
  pageTitle?: ReactNode;
  blockId?: string;
  defaultPageIcon?: string | null;
  defaultPageCover?: string | null;
  defaultPageCoverPosition?: number;
  floatTOC?: FloatTOCPosition;
}

export interface NotionRendererContextValue {
  recordMap: ExtendedRecordMap;
  mapPageUrl: MapPageUrlFn;
  mapImageUrl: MapImageUrlFn;
  components: NotionComponents;
  fullPage: boolean;
  darkMode: boolean;
  previewImages: boolean;
  highlightCode?: HighlightCodeFn;
  rootPageId?: string;
  defaultPageIcon?: string | null;
  defaultPageCover?: string | null;
  defaultPageCoverPosition?: number;
  hiddenBlockIds?: Set<string>;
  floatTOC?: FloatTOCPosition;
}

export type { ExtendedRecordMap, Block, BlockType, Decoration };
