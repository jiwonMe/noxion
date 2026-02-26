import type { Block, Decoration } from "notion-types";
import type { ComponentType, ReactNode } from "react";
import type { NotionBlockProps } from "../types";

/**
 * Plugin priority levels for renderer plugins.
 * Lower values execute first.
 */
export enum PluginPriority {
  FIRST = 0,
  NORMAL = 50,
  LAST = 100,
}

/**
 * Arguments passed to blockOverride hook.
 */
export interface BlockOverrideArgs {
  block: Block;
  blockId: string;
  parent?: Block;
}

/**
 * Result returned from blockOverride hook.
 * Provides a custom component and optional props to override default rendering.
 */
export interface BlockOverrideResult {
  component: ComponentType<NotionBlockProps>;
  props?: Record<string, unknown>;
}

/**
 * Arguments passed to transformBlock and lifecycle hooks.
 */
export interface TransformBlockArgs {
  block: Block;
  blockId: string;
  parent?: Block;
}

/**
 * Arguments passed to transformText hook.
 */
export interface TransformTextArgs {
  text: string;
  decorations?: Decoration[];
  block: Block;
}

export interface TextReplacement {
  start: number;
  end: number;
  component: ReactNode;
}

export interface TextTransformResult {
  text: string;
  replacements: TextReplacement[];
}

/**
 * Renderer plugin interface.
 * Plugins can hook into the rendering lifecycle to customize block rendering,
 * transform content, and perform side effects.
 */
export interface RendererPlugin {
  /**
   * Unique name for this plugin.
   */
  name: string;

  /**
   * Priority for plugin execution order.
   * Lower values execute first. Defaults to NORMAL (50).
   */
  priority?: PluginPriority | number;

  /**
   * Override the component used to render a specific block type.
   * Return null to skip override and use default rendering.
   */
  blockOverride?(args: BlockOverrideArgs): BlockOverrideResult | null;

  /**
   * Transform a block before rendering.
   * Return the modified block or the original block.
   */
  transformBlock?(args: TransformBlockArgs): Block;

  /**
   * Transform raw text segments before decoration rendering.
   * Return transformed text with component replacements.
   */
  transformText?(args: TransformTextArgs): TextTransformResult;

  /**
   * Lifecycle hook called before a block is rendered.
   */
  onBlockRender?(args: TransformBlockArgs): void;

  /**
   * Lifecycle hook called after a block has been rendered.
   */
  onBlockRendered?(args: TransformBlockArgs): void;

  /**
   * Plugin configuration object.
   * Can be used to store plugin-specific settings.
   */
  config?: Record<string, unknown>;
}

/**
 * Factory function type for creating renderer plugins.
 * Supports both parameterless factories and factories with options.
 *
 * @example
 * // Without options
 * const factory: RendererPluginFactory = () => ({
 *   name: "my-plugin",
 * });
 *
 * @example
 * // With options
 * interface MyPluginOptions {
 *   apiKey: string;
 * }
 * const factory: RendererPluginFactory<MyPluginOptions> = (options) => ({
 *   name: "my-plugin",
 *   config: options,
 * });
 */
export type RendererPluginFactory<Options = void> = Options extends void
  ? () => RendererPlugin
  : (options: Options) => RendererPlugin;
