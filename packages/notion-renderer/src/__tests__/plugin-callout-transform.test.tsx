import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "../renderer";
import {
  createCalloutTransformPlugin,
  AccordionBlock,
  TabGroupBlock,
} from "../plugins/callout-transform";

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

function createCalloutRecordMap(icon: string): ExtendedRecordMap {
  const page = makePageBlock("page-1", ["callout-1"]);
  const callout = makeBlock("callout-1", "callout", {
    properties: { title: [["Callout text"]] },
    format: { page_icon: icon },
  });
  return createMinimalRecordMap({
    "page-1": { value: page },
    "callout-1": { value: callout },
  });
}

describe("callout transform plugin", () => {
  it("createCalloutTransformPlugin returns a RendererPlugin with name 'callout-transform'", () => {
    const plugin = createCalloutTransformPlugin();
    expect(plugin.name).toBe("callout-transform");
    expect(typeof plugin.blockOverride).toBe("function");
  });

  it("renders .noxion-accordion for callout with 📋 icon", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCalloutRecordMap("📋")}
        plugins={[createCalloutTransformPlugin()]}
      />
    );
    expect(html).toContain("noxion-accordion");
    expect(html).not.toContain("noxion-callout");
  });

  it("renders .noxion-tab-group for callout with 🗂️ icon", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCalloutRecordMap("🗂️")}
        plugins={[createCalloutTransformPlugin()]}
      />
    );
    expect(html).toContain("noxion-tab-group");
    expect(html).not.toContain("noxion-callout");
  });

  it("renders .noxion-accordion for callout with ▶️ icon", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCalloutRecordMap("▶️")}
        plugins={[createCalloutTransformPlugin()]}
      />
    );
    expect(html).toContain("noxion-accordion");
  });

  it("renders normal callout for 💡 icon (unaffected)", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCalloutRecordMap("💡")}
        plugins={[createCalloutTransformPlugin()]}
      />
    );
    expect(html).toContain("noxion-callout");
    expect(html).not.toContain("noxion-accordion");
    expect(html).not.toContain("noxion-tab-group");
  });

  it("accordion has aria-expanded attribute", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCalloutRecordMap("📋")}
        plugins={[createCalloutTransformPlugin()]}
      />
    );
    expect(html).toContain("aria-expanded");
  });

  it("supports custom iconMapping option", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createCalloutRecordMap("🔥")}
        plugins={[
          createCalloutTransformPlugin({ iconMapping: { "🔥": "accordion" } }),
        ]}
      />
    );
    expect(html).toContain("noxion-accordion");
  });

  it("blockOverride returns null for non-callout blocks", () => {
    const plugin = createCalloutTransformPlugin();
    const block = makeBlock("b1", "text");
    const result = plugin.blockOverride!({ block, blockId: "b1" });
    expect(result).toBeNull();
  });

  it("AccordionBlock and TabGroupBlock are exported", () => {
    expect(typeof AccordionBlock).toBe("function");
    expect(typeof TabGroupBlock).toBe("function");
  });
});
