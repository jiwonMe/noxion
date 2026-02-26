import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "../renderer";
import { createChartPlugin } from "../plugins/chart";

function createMinimalRecordMap(
  blocks: Record<string, { value: Block }>
): ExtendedRecordMap {
  return {
    block: blocks as ExtendedRecordMap["block"],
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
  };
}

function makeBlock(
  id: string,
  type: string,
  overrides: Partial<Block> = {}
): Block {
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

function createCodeRecordMap(
  language: string,
  content = '{"type":"bar","data":{}}'
): ExtendedRecordMap {
  // Use a text block as first child to prevent frontmatter parsing of the code block
  const page = makePageBlock("page-1", ["text-0", "code-1"]);
  const textBlock = makeBlock("text-0", "text", {
    properties: { title: [["intro"]] },
  });
  const code = makeBlock("code-1", "code", {
    properties: {
      language: [[language]],
      title: [[content]],
    },
  });
  return createMinimalRecordMap({
    "page-1": { value: page },
    "text-0": { value: textBlock },
    "code-1": { value: code },
  });
}

describe("chart plugin", () => {
  it("createChartPlugin returns a RendererPlugin with name 'chart'", () => {
    const plugin = createChartPlugin();
    expect(plugin.name).toBe("chart");
    expect(typeof plugin.blockOverride).toBe("function");
  });

  it("renders lazy-loaded component for chart code blocks (SSR shows loading placeholder)", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCodeRecordMap("chart")}
        plugins={[createChartPlugin()]}
      />
    );
    // During SSR with renderToString, lazy components show loading placeholder
    expect(html).toContain("noxion-loading-placeholder");
    expect(html).not.toContain("noxion-code");
  });

  it("does not affect javascript code blocks", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCodeRecordMap("javascript")}
        plugins={[createChartPlugin()]}
      />
    );
    expect(html).toContain("noxion-code");
    expect(html).not.toContain("noxion-chart");
  });

  it("blockOverride returns component with props for valid chart config", () => {
    const plugin = createChartPlugin();
    const block = makeBlock("b1", "code", {
      properties: { language: [["chart"]], title: [['{ "type": "bar", "data": {} }']] },
    });
    const result = plugin.blockOverride!({ block, blockId: "b1" });
    expect(result).not.toBeNull();
    expect(typeof result?.component).toBe("function");
  });

  it("lazy chart component handles SSR (shows loading placeholder)", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCodeRecordMap("chart", "not valid json!!!")}
        plugins={[createChartPlugin()]}
      />
    );
    // Lazy component shows loading placeholder during SSR
    expect(html).toContain("noxion-loading-placeholder");
  });

  it("blockOverride returns component with custom containerClass", () => {
    const plugin = createChartPlugin({ containerClass: "my-chart" });
    const block = makeBlock("b1", "code", {
      properties: { language: [["chart"]], title: [['{ "type": "bar", "data": {} }']] },
    });
    const result = plugin.blockOverride!({ block, blockId: "b1" });
    expect(result).not.toBeNull();
    expect(result?.props?.containerClass).toBe("my-chart");
  });

  it("blockOverride returns null for non-chart code blocks", () => {
    const plugin = createChartPlugin();
    const block = makeBlock("b1", "code", {
      properties: { language: [["javascript"]], title: [["code"]] },
    });
    const result = plugin.blockOverride!({ block, blockId: "b1" });
    expect(result).toBeNull();
  });

  it("blockOverride returns component for chart code blocks", () => {
    const plugin = createChartPlugin();
    const block = makeBlock("b1", "code", {
      properties: { language: [["chart"]], title: [['{"type":"bar","data":{}}']] },
    });
    const result = plugin.blockOverride!({ block, blockId: "b1" });
    expect(result).not.toBeNull();
    expect(typeof result?.component).toBe("function");
  });
});
