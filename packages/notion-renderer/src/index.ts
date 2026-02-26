export {
  NotionRendererProvider,
  useNotionRenderer,
  useNotionBlock,
  useRendererPlugins,
  useResolvedBlockRenderer,
} from "./context";

export type {
  NotionRendererProviderProps,
} from "./context";

export { Text } from "./components/text";
export type { TextProps } from "./components/text";

export { NotionRenderer } from "./renderer";

export { NotionBlock, NotionBlockList } from "./block";
export type { NotionBlockRendererProps } from "./block";

export {
  TextBlock,
  HeadingBlock,
  BulletedListBlock,
  NumberedListBlock,
  ToDoBlock,
  QuoteBlock,
  CalloutBlock,
  DividerBlock,
  ToggleBlock,
  PageBlock,
  EquationBlock,
  CodeBlock,
  ImageBlock,
  VideoBlock,
  AudioBlock,
  EmbedBlock,
  BookmarkBlock,
  FileBlock,
  PdfBlock,
  TableBlock,
  ColumnListBlock,
  ColumnBlock,
  SyncedContainerBlock,
  SyncedReferenceBlock,
  AliasBlock,
  TableOfContentsBlock,
  CollectionViewPlaceholder,
  CollectionViewBlock,
} from "./blocks";

export type { CollectionViewProps, CollectionViewExtensionPoint } from "./blocks";

export { InlineEquation } from "./components/inline-equation";

export { createShikiHighlighter, normalizeLanguage } from "./shiki";

export {
  formatNotionDate,
  unwrapBlockValue,
  getBlockTitle,
  cs,
} from "./utils";

export type {
  NotionRendererProps,
  NotionRendererContextValue,
  NotionBlockProps,
  NotionComponents,
  MapPageUrlFn,
  MapImageUrlFn,
  HighlightCodeFn,
  ExtendedRecordMap,
  Block,
  BlockType,
  Decoration,
} from "./types";

// Plugin system
export type {
  RendererPlugin,
  RendererPluginFactory,
  BlockOverrideArgs,
  BlockOverrideResult,
  TextReplacement,
  TextTransformResult,
  TransformBlockArgs,
  TransformTextArgs,
  PluginPriority,
} from "./plugin/types";

export {
  resolveBlockRenderer,
  executeBlockTransforms,
  executeTextTransforms,
  applyTextTransforms,
} from "./plugin/executor";

// Built-in plugins
export {
  createMermaidPlugin,
  createChartPlugin,
  createCalloutTransformPlugin,
  AccordionBlock,
  TabGroupBlock,
  createEmbedEnhancedPlugin,
  detectEmbedProvider,
  createTextTransformPlugin,
} from "./plugins";

export type {
  MermaidPluginOptions,
  ChartPluginOptions,
  ChartConfig,
  CalloutTransformOptions,
  EmbedEnhancedOptions,
  TextTransformOptions,
} from "./plugins";

// Components
export { BlockErrorBoundary } from "./components/error-boundary";
export { HeadingAnchor } from "./components/heading-anchor";
export { BlockActions } from "./components/block-actions";
export { LoadingPlaceholder } from "./components/loading-placeholder";

// Utilities
export { createLazyBlock } from "./utils/lazy-block";
export { generateHeadingId } from "./utils/heading-id";
export { getAriaLabel, handleKeyboardActivation, getToggleContentId } from "./utils/a11y";
