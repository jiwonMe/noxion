import { describe, it, expect, mock } from "bun:test";
import type { Block, Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import {
  executeBlockTransforms,
  executeTextTransforms,
  resolveBlockRenderer,
} from "../plugin/executor";
import { PluginPriority, type RendererPlugin } from "../plugin/types";

function makeBlock(id: string, type: string, overrides: Partial<Block> = {}): Block {
  return {
    id,
    type,
    properties: { title: [["Test content"]] },
    parent_id: "root",
    parent_table: "block",
    version: 1,
    created_time: Date.now(),
    last_edited_time: Date.now(),
    alive: true,
    created_by_table: "notion_user",
    created_by_id: "user1",
    last_edited_by_table: "notion_user",
    last_edited_by_id: "user1",
    ...overrides,
  } as unknown as Block;
}

function MockCodeRenderer(_props: NotionBlockProps) {
  return null;
}

describe("plugin executor", () => {
  it("applies conditional block override only for mermaid code blocks", () => {
    const mermaid = makeBlock("code-1", "code", {
      properties: { language: [["mermaid"]], title: [["graph TD;"]] },
    });
    const javascript = makeBlock("code-2", "code", {
      properties: { language: [["javascript"]], title: [["console.log('x')"]] },
    });

    const mermaidPlugin: RendererPlugin = {
      name: "mermaid-only",
      blockOverride: ({ block }) => {
        const language = (block.properties as { language?: string[][] })?.language?.[0]?.[0];
        if (block.type === "code" && language === "mermaid") {
          return { component: MockCodeRenderer, props: { mode: "diagram" } };
        }
        return null;
      },
    };

    const mermaidResult = resolveBlockRenderer(mermaid, mermaid.id, [mermaidPlugin]);
    const javascriptResult = resolveBlockRenderer(javascript, javascript.id, [mermaidPlugin]);

    expect(mermaidResult?.component).toBe(MockCodeRenderer);
    expect(mermaidResult?.props).toEqual({ mode: "diagram" });
    expect(javascriptResult).toBeNull();
  });

  it("chains block transforms in plugin order", () => {
    const block = makeBlock("text-1", "text", {
      properties: { title: [["start"]] },
    });

    const firstTransform: RendererPlugin = {
      name: "first-transform",
      transformBlock: ({ block: current }) => ({
        ...current,
        properties: {
          ...current.properties,
          title: [["start -> first"]],
        },
      }),
    };

    const secondTransform: RendererPlugin = {
      name: "second-transform",
      transformBlock: ({ block: current }) => ({
        ...current,
        properties: {
          ...current.properties,
          title: [[`${(current.properties as { title: string[][] }).title[0][0]} -> second`]],
        },
      }),
    };

    const result = executeBlockTransforms(block, block.id, [firstTransform, secondTransform]);

    expect((result.properties as { title: string[][] }).title[0][0]).toBe("start -> first -> second");
    expect((block.properties as { title: string[][] }).title[0][0]).toBe("start");
  });

  it("isolates transform errors and continues with later plugins", () => {
    const block = makeBlock("text-2", "text", {
      properties: { title: [["safe"]] },
    });
    const warn = mock(() => {});
    const originalWarn = console.warn;
    console.warn = warn;

    const brokenPlugin: RendererPlugin = {
      name: "broken-transform",
      transformBlock: () => {
        throw new Error("boom");
      },
    };
    const succeedingPlugin: RendererPlugin = {
      name: "succeeding-transform",
      transformBlock: ({ block: current }) => ({
        ...current,
        properties: {
          ...current.properties,
          title: [["safe -> recovered"]],
        },
      }),
    };

    const result = executeBlockTransforms(block, block.id, [brokenPlugin, succeedingPlugin]);

    expect((result.properties as { title: string[][] }).title[0][0]).toBe("safe -> recovered");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      "[noxion] Plugin block transform error:",
      "broken-transform",
      expect.any(Error)
    );

    console.warn = originalWarn;
  });

  it("runs FIRST priority plugins before NORMAL for overrides and transforms", () => {
    const block = makeBlock("code-3", "code", {
      properties: { language: [["mermaid"]], title: [["initial"]] },
    });
    const executionOrder: string[] = [];

    const normalPlugin: RendererPlugin = {
      name: "normal",
      priority: PluginPriority.NORMAL,
      blockOverride: () => {
        executionOrder.push("normal-override");
        return null;
      },
      transformBlock: ({ block: current }) => {
        executionOrder.push("normal-transform");
        return {
          ...current,
          properties: {
            ...current.properties,
            title: [[`${(current.properties as { title: string[][] }).title[0][0]} + normal`]],
          },
        };
      },
    };

    const firstPlugin: RendererPlugin = {
      name: "first",
      priority: PluginPriority.FIRST,
      blockOverride: () => {
        executionOrder.push("first-override");
        return null;
      },
      transformBlock: ({ block: current }) => {
        executionOrder.push("first-transform");
        return {
          ...current,
          properties: {
            ...current.properties,
            title: [[`${(current.properties as { title: string[][] }).title[0][0]} + first`]],
          },
        };
      },
    };

    resolveBlockRenderer(block, block.id, [normalPlugin, firstPlugin]);
    const transformed = executeBlockTransforms(block, block.id, [normalPlugin, firstPlugin]);

    expect(executionOrder).toEqual([
      "first-override",
      "normal-override",
      "first-transform",
      "normal-transform",
    ]);
    expect((transformed.properties as { title: string[][] }).title[0][0]).toBe("initial + first + normal");
  });

  it("chains text transforms and isolates plugin errors", () => {
    const block = makeBlock("text-3", "text");
    const initialDecorations: Decoration[] = [["Hello"]];
    const warn = mock(() => {});
    const originalWarn = console.warn;
    console.warn = warn;

    const firstPlugin: RendererPlugin = {
      name: "first-text",
      transformText: ({ text }) => ({ text: `${text} from-first`, replacements: [] }),
    };
    const brokenPlugin: RendererPlugin = {
      name: "broken-text",
      transformText: () => {
        throw new Error("text boom");
      },
    };
    const secondPlugin: RendererPlugin = {
      name: "second-text",
      transformText: ({ text }) => ({ text: `${text} from-second`, replacements: [] }),
    };

    const result = executeTextTransforms(initialDecorations, block, [
      firstPlugin,
      brokenPlugin,
      secondPlugin,
    ]);

    expect(result).toEqual([["Hello from-first from-second"]]);
    expect(initialDecorations).toEqual([["Hello"]]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      "[noxion] Plugin text transform error:",
      "broken-text",
      expect.any(Error)
    );

    console.warn = originalWarn;
  });
});
