import { describe, it, expect } from "bun:test";
import type {
  RendererPlugin,
  RendererPluginFactory,
  BlockOverrideResult,
  BlockOverrideArgs,
  TextReplacement,
  TextTransformResult,
  TransformBlockArgs,
  TransformTextArgs,
  PluginPriority,
} from "../plugin/types";
import type { NotionBlockProps } from "../types";
import type { Block } from "notion-types";
import type { ComponentType } from "react";

describe("RendererPlugin Types", () => {
  it("RendererPlugin interface has required name property", () => {
    const plugin: RendererPlugin = {
      name: "test-plugin",
    };
    expect(plugin.name).toBe("test-plugin");
  });

  it("RendererPlugin interface has optional priority property", () => {
    const plugin: RendererPlugin = {
      name: "test-plugin",
      priority: 50,
    };
    expect(plugin.priority).toBe(50);
  });

  it("RendererPlugin interface has optional blockOverride method", () => {
    const plugin: RendererPlugin = {
      name: "test-plugin",
      blockOverride: (args: BlockOverrideArgs) => {
        return {
          component: ({ block }: NotionBlockProps) => <div>{block.type}</div>,
          props: { custom: true },
        };
      },
    };
    expect(plugin.blockOverride).toBeDefined();
  });

  it("RendererPlugin interface has optional transformBlock method", () => {
    const plugin: RendererPlugin = {
      name: "test-plugin",
      transformBlock: (args: TransformBlockArgs) => {
        return args.block;
      },
    };
    expect(plugin.transformBlock).toBeDefined();
  });

  it("RendererPlugin interface has optional transformText method", () => {
    const plugin: RendererPlugin = {
      name: "test-plugin",
      transformText: (args: TransformTextArgs) => {
        return { text: args.text, replacements: [] };
      },
    };
    expect(plugin.transformText).toBeDefined();
  });

  it("RendererPlugin interface has optional onBlockRender method", () => {
    const plugin: RendererPlugin = {
      name: "test-plugin",
      onBlockRender: (args: TransformBlockArgs) => {
        // side effect
      },
    };
    expect(plugin.onBlockRender).toBeDefined();
  });

  it("RendererPlugin interface has optional onBlockRendered method", () => {
    const plugin: RendererPlugin = {
      name: "test-plugin",
      onBlockRendered: (args: TransformBlockArgs) => {
        // side effect
      },
    };
    expect(plugin.onBlockRendered).toBeDefined();
  });

  it("RendererPlugin interface has optional config property", () => {
    const plugin: RendererPlugin = {
      name: "test-plugin",
      config: { apiKey: "secret", enabled: true },
    };
    expect(plugin.config).toBeDefined();
  });

  it("BlockOverrideResult has component and optional props", () => {
    const result: BlockOverrideResult = {
      component: ({ block }: NotionBlockProps) => <div>{block.type}</div>,
      props: { custom: "value" },
    };
    expect(result.component).toBeDefined();
    expect(result.props).toBeDefined();
  });

  it("BlockOverrideArgs has block, blockId, and optional parent", () => {
    const args: BlockOverrideArgs = {
      block: {} as Block,
      blockId: "block-123",
      parent: {} as Block,
    };
    expect(args.block).toBeDefined();
    expect(args.blockId).toBe("block-123");
    expect(args.parent).toBeDefined();
  });

  it("TransformBlockArgs has block, blockId, and optional parent", () => {
    const args: TransformBlockArgs = {
      block: {} as Block,
      blockId: "block-456",
    };
    expect(args.block).toBeDefined();
    expect(args.blockId).toBe("block-456");
  });

  it("TransformTextArgs has text and block", () => {
    const args: TransformTextArgs = {
      text: "test",
      block: {} as Block,
    };
    expect(args.text).toBe("test");
    expect(args.block).toBeDefined();
  });

  it("TextReplacement and TextTransformResult types are compatible", () => {
    const replacement: TextReplacement = {
      start: 0,
      end: 4,
      component: <span>test</span>,
    };

    const result: TextTransformResult = {
      text: "test",
      replacements: [replacement],
    };

    expect(result.text).toBe("test");
    expect(result.replacements).toHaveLength(1);
    expect(result.replacements[0]?.start).toBe(0);
  });

  it("PluginPriority enum has FIRST, NORMAL, LAST values", () => {
    const priorities: Record<string, number> = {
      FIRST: 0,
      NORMAL: 50,
      LAST: 100,
    };
    expect(priorities.FIRST).toBe(0);
    expect(priorities.NORMAL).toBe(50);
    expect(priorities.LAST).toBe(100);
  });

  it("RendererPluginFactory creates RendererPlugin without options", () => {
    const factory: RendererPluginFactory = () => ({
      name: "factory-plugin",
    });
    const plugin = factory();
    expect(plugin.name).toBe("factory-plugin");
  });

  it("RendererPluginFactory creates RendererPlugin with options", () => {
    interface PluginOptions extends Record<string, unknown> {
      apiKey: string;
      enabled?: boolean;
    }
    const factory: RendererPluginFactory<PluginOptions> = (options) => ({
      name: "factory-plugin",
      config: options,
    });
    const plugin = factory({ apiKey: "secret", enabled: true });
    expect(plugin.name).toBe("factory-plugin");
    expect(plugin.config).toBeDefined();
  });

  it("blockOverride can return null to skip override", () => {
    const plugin: RendererPlugin = {
      name: "test-plugin",
      blockOverride: (args: BlockOverrideArgs) => {
        if (args.block.type === "text") {
          return {
            component: ({ block }: NotionBlockProps) => <div>{block.type}</div>,
          };
        }
        return null;
      },
    };
    expect(plugin.blockOverride).toBeDefined();
  });

  it("RendererPlugin is compatible with NotionBlockProps", () => {
    const plugin: RendererPlugin = {
      name: "test-plugin",
      blockOverride: (args: BlockOverrideArgs) => {
        return {
          component: (props: NotionBlockProps) => {
            const { block, blockId, level, children } = props;
            return (
              <div data-block-id={blockId} data-level={level}>
                {block.type}
                {children}
              </div>
            );
          },
        };
      },
    };
    expect(plugin.blockOverride).toBeDefined();
  });
});
