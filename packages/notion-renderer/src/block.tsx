"use client";

import type { ComponentType } from "react";
import type { Block } from "notion-types";
import type { NotionBlockProps } from "./types";
import { useNotionRenderer, useNotionBlock } from "./context";
import { TextBlock } from "./blocks/text";
import { HeadingBlock } from "./blocks/heading";
import { BulletedListBlock } from "./blocks/bulleted-list";
import { NumberedListBlock } from "./blocks/numbered-list";
import { ToDoBlock } from "./blocks/to-do";
import { QuoteBlock } from "./blocks/quote";
import { CalloutBlock } from "./blocks/callout";
import { DividerBlock } from "./blocks/divider";
import { ToggleBlock } from "./blocks/toggle";
import { PageBlock } from "./blocks/page";
import { EquationBlock } from "./blocks/equation";
import { CodeBlock } from "./blocks/code";
import { ImageBlock } from "./blocks/image";
import { VideoBlock } from "./blocks/video";
import { AudioBlock } from "./blocks/audio";
import { EmbedBlock } from "./blocks/embed";
import { BookmarkBlock } from "./blocks/bookmark";
import { FileBlock } from "./blocks/file";
import { PdfBlock } from "./blocks/pdf";

const defaultBlockComponents: Record<string, ComponentType<NotionBlockProps>> = {
  text: TextBlock,
  header: HeadingBlock,
  sub_header: HeadingBlock,
  sub_sub_header: HeadingBlock,
  bulleted_list: BulletedListBlock,
  numbered_list: NumberedListBlock,
  to_do: ToDoBlock,
  quote: QuoteBlock,
  callout: CalloutBlock,
  divider: DividerBlock,
  toggle: ToggleBlock,
  page: PageBlock,
  equation: EquationBlock,
  code: CodeBlock,
  image: ImageBlock,
  video: VideoBlock,
  audio: AudioBlock,
  embed: EmbedBlock,
  gist: EmbedBlock,
  figma: EmbedBlock,
  typeform: EmbedBlock,
  replit: EmbedBlock,
  codepen: EmbedBlock,
  excalidraw: EmbedBlock,
  tweet: EmbedBlock,
  maps: EmbedBlock,
  miro: EmbedBlock,
  drive: EmbedBlock,
  bookmark: BookmarkBlock,
  file: FileBlock,
  pdf: PdfBlock,
};

export interface NotionBlockRendererProps {
  blockId: string;
  level: number;
}

export function NotionBlock({ blockId, level }: NotionBlockRendererProps) {
  const { components } = useNotionRenderer();
  const block = useNotionBlock(blockId);

  if (!block) return null;
  if (!block.alive) return null;

  const blockType = block.type;
  const BlockComponent =
    components.blockOverrides?.[blockType] ??
    defaultBlockComponents[blockType] ??
    null;

  if (!BlockComponent) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <div className="noxion-block--unknown" data-block-type={blockType}>
          Unsupported block type: {blockType}
        </div>
      );
    }
    return null;
  }

  const children = renderChildren(block, level);

  return (
    <BlockComponent
      block={block}
      blockId={blockId}
      level={level}
      children={children}
    />
  );
}

function renderChildren(block: Block, level: number) {
  if (!block.content?.length) return undefined;

  const children = block.content.map((childId) => (
    <NotionBlock key={childId} blockId={childId} level={level + 1} />
  ));

  return <>{children}</>;
}

export function NotionBlockList({ blockIds, level }: { blockIds: string[]; level: number }) {
  if (!blockIds.length) return null;

  return (
    <>
      {blockIds.map((blockId) => (
        <NotionBlock key={blockId} blockId={blockId} level={level} />
      ))}
    </>
  );
}
