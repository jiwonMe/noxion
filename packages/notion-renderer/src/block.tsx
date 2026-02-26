"use client";

import type { ComponentType } from "react";
import type { Block } from "notion-types";
import type { NotionBlockProps } from "./types";
import { useNotionRenderer, useNotionBlock, useRendererPlugins } from "./context";
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
import { BlockActions } from "./components/block-actions";
import { ImageBlock } from "./blocks/image";
import { VideoBlock } from "./blocks/video";
import { AudioBlock } from "./blocks/audio";
import { EmbedBlock } from "./blocks/embed";
import { BookmarkBlock } from "./blocks/bookmark";
import { FileBlock } from "./blocks/file";
import { PdfBlock } from "./blocks/pdf";
import { TableBlock } from "./blocks/table";
import { ColumnListBlock } from "./blocks/column-list";
import { ColumnBlock } from "./blocks/column";
import { SyncedContainerBlock, SyncedReferenceBlock } from "./blocks/synced-block";
import { AliasBlock } from "./blocks/alias";
import { TableOfContentsBlock } from "./blocks/table-of-contents";
import { CollectionViewBlock } from "./blocks/collection-view";
import { BlockErrorBoundary } from "./components/error-boundary";
import { executeBlockTransforms, resolveBlockRenderer } from "./plugin/executor";

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
  table: TableBlock,
  table_row: TextBlock,
  column_list: ColumnListBlock,
  column: ColumnBlock,
  transclusion_container: SyncedContainerBlock,
  transclusion_reference: SyncedReferenceBlock,
  alias: AliasBlock,
  table_of_contents: TableOfContentsBlock,
  collection_view: CollectionViewBlock,
  collection_view_page: CollectionViewBlock,
  breadcrumb: DividerBlock,
  external_object_instance: EmbedBlock,
};

export interface NotionBlockRendererProps {
  blockId: string;
  level: number;
}

export function NotionBlock({ blockId, level }: NotionBlockRendererProps) {
  const { components, hiddenBlockIds, showBlockActions: showBlockActionsProp } = useNotionRenderer();

  const block = useNotionBlock(blockId);
  const plugins = useRendererPlugins();

  if (!block) return null;
  if (!block.alive) return null;
  if (hiddenBlockIds?.has(blockId)) return null;

  const transformedBlock = executeBlockTransforms(block, blockId, plugins);
  const blockType = transformedBlock.type;

  const lifecycleArgs = { block: transformedBlock, blockId };
  for (const plugin of plugins) {
    if (!plugin.onBlockRender) continue;
    try {
      plugin.onBlockRender(lifecycleArgs);
    } catch (error) {
      console.warn("[noxion] Plugin onBlockRender error:", plugin.name, error);
    }
  }

  let pluginOverrideProps: Record<string, unknown> | undefined;
  let BlockComponent = components.blockOverrides?.[blockType];

  if (!BlockComponent) {
    const pluginOverride = resolveBlockRenderer(transformedBlock, blockId, plugins);
    if (pluginOverride) {
      BlockComponent = pluginOverride.component;
      pluginOverrideProps = pluginOverride.props;
    }
  }

  BlockComponent ??= defaultBlockComponents[blockType] ?? null;

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

  const children = renderChildren(transformedBlock, level);

  const shouldShowActions =
    typeof showBlockActionsProp === "function"
      ? showBlockActionsProp(blockType)
      : showBlockActionsProp ?? blockType === "code";


  const blockElement = (
    <BlockComponent
      block={transformedBlock}
      blockId={blockId}
      level={level}
      children={children}
      {...pluginOverrideProps}
    />
  );

  const wrappedElement = shouldShowActions ? (
    <div className="noxion-block-with-actions">
      {blockElement}
      <BlockActions
        blockId={blockId}
        blockType={blockType}
        content={(block.properties as { title?: Array<[string]> })?.title
          ?.map((segment) => segment[0])
          .join("") ?? ""}
      />
    </div>
  ) : (
    blockElement
  );

  for (const plugin of plugins) {
    if (!plugin.onBlockRendered) continue;
    try {
      plugin.onBlockRendered(lifecycleArgs);
    } catch (error) {
      console.warn("[noxion] Plugin onBlockRendered error:", plugin.name, error);
    }
  }

  return (
    <BlockErrorBoundary blockId={blockId} blockType={blockType}>
      {wrappedElement}
    </BlockErrorBoundary>
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
