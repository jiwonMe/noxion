import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "../renderer";
import { createMermaidPlugin } from "../plugins/mermaid";

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

function createCodeRecordMap(language: string): ExtendedRecordMap {
  const page = makePageBlock("page-1", ["code-1"]);
  const code = makeBlock("code-1", "code", {
    properties: {
      language: [[language]],
      title: [["graph TD; A-->B"]],
    },
  });
  return createMinimalRecordMap({
    "page-1": { value: page },
    "code-1": { value: code },
  });
}

describe("mermaid plugin", () => {
  it("createMermaidPlugin returns a RendererPlugin with name 'mermaid'", () => {
    const plugin = createMermaidPlugin();
    expect(plugin.name).toBe("mermaid");
    expect(typeof plugin.blockOverride).toBe("function");
  });

  it("renders lazy-loaded component for mermaid code blocks (SSR shows loading placeholder)", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCodeRecordMap("mermaid")}
        plugins={[createMermaidPlugin()]}
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
        plugins={[createMermaidPlugin()]}
      />
    );
    expect(html).toContain("noxion-code");
    expect(html).not.toContain("noxion-mermaid");
  });

  it("lazy-loaded mermaid block replaces code block (SSR fallback)", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCodeRecordMap("mermaid")}
        plugins={[createMermaidPlugin()]}
      />
    );
    // Lazy component shows loading placeholder during SSR, not code block
    expect(html).toContain("noxion-loading-placeholder");
    expect(html).not.toContain("noxion-code");
  });

  it("blockOverride returns lazy component with custom options", () => {
    const plugin = createMermaidPlugin({ containerClass: "my-mermaid", theme: "dark" });
    const block = makeBlock("b1", "code", {
      properties: { language: [["mermaid"]], title: [["graph TD; A-->B"]] },
    });
    const result = plugin.blockOverride!({ block, blockId: "b1" });
    expect(result).not.toBeNull();
    expect(result?.props?.containerClass).toBe("my-mermaid");
    expect(result?.props?.theme).toBe("dark");
  });

  it("blockOverride returns component with default theme", () => {
    const plugin = createMermaidPlugin();
    const block = makeBlock("b1", "code", {
      properties: { language: [["mermaid"]], title: [["graph TD; A-->B"]] },
    });
    const result = plugin.blockOverride!({ block, blockId: "b1" });
    expect(result).not.toBeNull();
    expect(result?.props?.theme).toBe("default");
  });

  it("blockOverride returns null for non-mermaid code blocks", () => {
    const plugin = createMermaidPlugin();
    const block = makeBlock("b1", "code", {
      properties: { language: [["javascript"]], title: [["console.log()"]] },
    });
    const result = plugin.blockOverride!({ block, blockId: "b1" });
    expect(result).toBeNull();
  });

  it("blockOverride returns component for mermaid code blocks", () => {
    const plugin = createMermaidPlugin();
    const block = makeBlock("b1", "code", {
      properties: { language: [["mermaid"]], title: [["graph TD; A-->B"]] },
    });
    const result = plugin.blockOverride!({ block, blockId: "b1" });
    expect(result).not.toBeNull();
    expect(typeof result?.component).toBe("function");
  });
});
