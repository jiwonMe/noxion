import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import { NotionRenderer } from "../renderer";
import type { ExtendedRecordMap, Block } from "notion-types";

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

function makeBlock(id: string, type: string, overrides: Record<string, unknown> = {}): Block {
  return {
    id,
    type,
    properties: {},
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

function makePageBlock(id: string, childIds: string[]): Block {
  return makeBlock(id, "page", {
    content: childIds,
    properties: { title: [["Test Page"]] },
    format: { page_full_width: false, page_small_text: false, page_cover_position: 0.5 },
  });
}

function renderBlock(blockId: string, block: Block, extraBlocks: Record<string, { value: Block }> = {}) {
  const page = makePageBlock("page-1", [blockId]);
  const recordMap = createMinimalRecordMap({
    "page-1": { value: page },
    [blockId]: { value: block },
    ...extraBlocks,
  });
  return renderToString(<NotionRenderer recordMap={recordMap} />);
}

describe("TableBlock", () => {
  it("renders table with rows and columns", () => {
    const table = makeBlock("tbl-1", "table", {
      content: ["row-1", "row-2"],
      format: {
        table_block_column_order: ["col-a", "col-b"],
        table_block_column_header: true,
        table_block_row_header: false,
      },
    });

    const row1 = makeBlock("row-1", "table_row", {
      properties: { "col-a": [["Name"]], "col-b": [["Age"]] },
    });

    const row2 = makeBlock("row-2", "table_row", {
      properties: { "col-a": [["Alice"]], "col-b": [["30"]] },
    });

    const html = renderBlock("tbl-1", table, {
      "row-1": { value: row1 },
      "row-2": { value: row2 },
    });

    expect(html).toContain("noxion-table");
    expect(html).toContain("<table");
    expect(html).toContain("<thead");
    expect(html).toContain("<th");
    expect(html).toContain("Name");
    expect(html).toContain("Age");
    expect(html).toContain("Alice");
    expect(html).toContain("30");
  });

  it("renders table without header row", () => {
    const table = makeBlock("tbl-2", "table", {
      content: ["row-1"],
      format: {
        table_block_column_order: ["col-a"],
        table_block_column_header: false,
        table_block_row_header: false,
      },
    });

    const row1 = makeBlock("row-1", "table_row", {
      properties: { "col-a": [["Data"]] },
    });

    const html = renderBlock("tbl-2", table, {
      "row-1": { value: row1 },
    });

    expect(html).toContain("noxion-table");
    expect(html).not.toContain("<thead");
    expect(html).toContain("Data");
  });
});

describe("ColumnListBlock + ColumnBlock", () => {
  it("renders columns side by side", () => {
    const colList = makeBlock("cl-1", "column_list", {
      content: ["col-1", "col-2"],
    });

    const col1 = makeBlock("col-1", "column", {
      format: { column_ratio: 0.5 },
      content: ["text-1"],
    });

    const col2 = makeBlock("col-2", "column", {
      format: { column_ratio: 0.5 },
      content: ["text-2"],
    });

    const text1 = makeBlock("text-1", "text", {
      properties: { title: [["Left column"]] },
    });

    const text2 = makeBlock("text-2", "text", {
      properties: { title: [["Right column"]] },
    });

    const html = renderBlock("cl-1", colList, {
      "col-1": { value: col1 },
      "col-2": { value: col2 },
      "text-1": { value: text1 },
      "text-2": { value: text2 },
    });

    expect(html).toContain("noxion-column-list");
    expect(html).toContain("noxion-column");
    expect(html).toContain("Left column");
    expect(html).toContain("Right column");
  });
});

describe("SyncedBlock", () => {
  it("renders transclusion_container with children", () => {
    const container = makeBlock("sync-1", "transclusion_container", {
      content: ["child-1"],
    });

    const child = makeBlock("child-1", "text", {
      properties: { title: [["Synced content"]] },
    });

    const html = renderBlock("sync-1", container, {
      "child-1": { value: child },
    });

    expect(html).toContain("noxion-synced-block");
    expect(html).toContain("Synced content");
  });

  it("renders transclusion_reference by looking up source block", () => {
    const ref = makeBlock("ref-1", "transclusion_reference", {
      format: {
        transclusion_reference_pointer: { id: "source-1", spaceId: "space-1" },
      },
    });

    const source = makeBlock("source-1", "transclusion_container", {
      content: ["source-child"],
    });

    const sourceChild = makeBlock("source-child", "text", {
      properties: { title: [["Source content"]] },
    });

    const html = renderBlock("ref-1", ref, {
      "source-1": { value: source },
      "source-child": { value: sourceChild },
    });

    expect(html).toContain("noxion-synced-block--reference");
    expect(html).toContain("Source content");
  });
});

describe("AliasBlock", () => {
  it("renders page link to target", () => {
    const alias = makeBlock("alias-1", "alias", {
      format: { alias_pointer: { id: "target-page" } },
    });

    const targetPage = makeBlock("target-page", "page", {
      properties: { title: [["Linked Page"]] },
      format: { page_icon: "📄", page_full_width: false, page_small_text: false, page_cover_position: 0.5 },
    });

    const html = renderBlock("alias-1", alias, {
      "target-page": { value: targetPage },
    });

    expect(html).toContain("noxion-page-link");
    expect(html).toContain("Linked Page");
    expect(html).toContain("📄");
  });
});

describe("TableOfContentsBlock", () => {
  it("renders TOC from page headings", () => {
    const page = makePageBlock("page-1", ["toc-1", "h1-1", "h2-1"]);

    const toc = makeBlock("toc-1", "table_of_contents", {});

    const h1 = makeBlock("h1-1", "header", {
      properties: { title: [["Introduction"]] },
    });

    const h2 = makeBlock("h2-1", "sub_header", {
      properties: { title: [["Details"]] },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "toc-1": { value: toc },
      "h1-1": { value: h1 },
      "h2-1": { value: h2 },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-table-of-contents");
    expect(html).toContain("Introduction");
    expect(html).toContain("Details");
    expect(html).toContain("#h1-1");
    expect(html).toContain("#h2-1");
  });
});

describe("CollectionViewPlaceholder", () => {
  it("renders placeholder for collection_view block", () => {
    const cv = makeBlock("cv-1", "collection_view", {});

    const html = renderBlock("cv-1", cv);

    expect(html).toContain("noxion-collection-view-placeholder");
    expect(html).toContain("Database view");
  });

  it("renders placeholder for collection_view_page block", () => {
    const cvp = makeBlock("cvp-1", "collection_view_page", {});

    const html = renderBlock("cvp-1", cvp);

    expect(html).toContain("noxion-collection-view-placeholder");
  });
});
