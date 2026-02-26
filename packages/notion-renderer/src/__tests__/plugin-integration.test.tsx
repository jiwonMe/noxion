import { describe, it, expect, mock } from "bun:test";
import { renderToString } from "react-dom/server";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "../renderer";
import type { NotionBlockProps } from "../types";
import { PluginPriority, type RendererPlugin } from "../plugin/types";

function createMinimalRecordMap(blocks: Record<string, { value: Block }>): ExtendedRecordMap {
  return {
    block: blocks as ExtendedRecordMap["block"],
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
  };
}

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

function makePageBlock(id: string, childIds: string[] = []): Block {
  return {
    id,
    type: "page",
    content: childIds,
    properties: { title: [["Test Page"]] },
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
  } as unknown as Block;
}

function createCodeRecordMap(language: string): ExtendedRecordMap {
  const page = makePageBlock("page-1", ["code-1"]);
  const code = makeBlock("code-1", "code", {
    properties: { language: [[language]], title: [["graph TD; A-->B"]] },
  });

  return createMinimalRecordMap({
    "page-1": { value: page },
    "code-1": { value: code },
  });
}

function MermaidPluginBlock(props: NotionBlockProps) {
  return <div className="plugin-mermaid-block">Plugin Mermaid: {props.blockId}</div>;
}

function PropOverrideCodeBlock({ block }: NotionBlockProps) {
  const content = (block.properties as { title?: string[][] })?.title?.[0]?.[0] ?? "";
  return <div className="prop-override-code">Prop Override: {content}</div>;
}

describe("plugin integration with block router", () => {
  it("uses plugin blockOverride for mermaid code blocks", () => {
    const plugin: RendererPlugin = {
      name: "mermaid-override",
      blockOverride: ({ block }) => {
        const language = (block.properties as { language?: string[][] })?.language?.[0]?.[0];
        if (block.type === "code" && language === "mermaid") {
          return { component: MermaidPluginBlock };
        }
        return null;
      },
    };

    const html = renderToString(
      <NotionRenderer
        recordMap={createCodeRecordMap("mermaid")}
        plugins={[plugin]}
      />
    );

    expect(html).toContain("plugin-mermaid-block");
    expect(html).toContain("Plugin Mermaid:");
    expect(html).toContain("code-1");
    expect(html).not.toContain("noxion-code");
  });

  it("keeps blockOverrides precedence over plugin override", () => {
    const plugin: RendererPlugin = {
      name: "mermaid-override",
      blockOverride: ({ block }) => {
        const language = (block.properties as { language?: string[][] })?.language?.[0]?.[0];
        if (block.type === "code" && language === "mermaid") {
          return { component: MermaidPluginBlock };
        }
        return null;
      },
    };

    const html = renderToString(
      <NotionRenderer
        recordMap={createCodeRecordMap("mermaid")}
        plugins={[plugin]}
        components={{ blockOverrides: { code: PropOverrideCodeBlock } }}
      />
    );

    expect(html).toContain("prop-override-code");
    expect(html).toContain("Prop Override:");
    expect(html).toContain("graph TD; A--&gt;B");
    expect(html).not.toContain("plugin-mermaid-block");
  });

  it("falls back to default routing when plugins are not provided", () => {
    const html = renderToString(<NotionRenderer recordMap={createCodeRecordMap("javascript")} />);

    expect(html).toContain("noxion-code");
    expect(html).toContain("noxion-code__language");
    expect(html).toContain("javascript");
  });

  it("applies transformBlock before rendering and lifecycle hooks execute", () => {
    const onBlockRender = mock(() => {});
    const onBlockRendered = mock(() => {});

    const plugin: RendererPlugin = {
      name: "transform-and-lifecycle",
      transformBlock: ({ block }) => ({
        ...block,
        properties: {
          ...block.properties,
          title: [["transformed graph"]],
        },
      }),
      onBlockRender,
      onBlockRendered,
    };

    const html = renderToString(
      <NotionRenderer
        recordMap={createCodeRecordMap("javascript")}
        plugins={[plugin]}
        components={{ blockOverrides: { code: PropOverrideCodeBlock } }}
      />
    );

    expect(html).toContain("Prop Override:");
    expect(html).toContain("transformed graph");
    expect(onBlockRender).toHaveBeenCalledTimes(2);
    expect(onBlockRendered).toHaveBeenCalledTimes(2);
    expect(onBlockRender).toHaveBeenCalledWith(expect.objectContaining({ blockId: "code-1" }));
    expect(onBlockRendered).toHaveBeenCalledWith(expect.objectContaining({ blockId: "code-1" }));
  });

  it("uses first matching override by plugin priority", () => {
    function FirstPluginCodeBlock() {
      return <div className="first-plugin-code">First plugin override</div>;
    }

    function SecondPluginCodeBlock() {
      return <div className="second-plugin-code">Second plugin override</div>;
    }

    const secondPlugin: RendererPlugin = {
      name: "second",
      priority: PluginPriority.NORMAL,
      blockOverride: ({ block }) => {
        if (block.type === "code") return { component: SecondPluginCodeBlock };
        return null;
      },
    };

    const firstPlugin: RendererPlugin = {
      name: "first",
      priority: PluginPriority.FIRST,
      blockOverride: ({ block }) => {
        if (block.type === "code") return { component: FirstPluginCodeBlock };
        return null;
      },
    };

    const html = renderToString(
      <NotionRenderer
        recordMap={createCodeRecordMap("javascript")}
        plugins={[secondPlugin, firstPlugin]}
      />
    );

    expect(html).toContain("first-plugin-code");
    expect(html).toContain("First plugin override");
    expect(html).not.toContain("second-plugin-code");
  });
});
