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
    format: {
      page_full_width: false,
      page_small_text: false,
      page_cover_position: 0.5,
    },
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

function renderWithRecordMap(blocks: Record<string, { value: Block }>) {
  const recordMap = createMinimalRecordMap(blocks);
  return renderToString(<NotionRenderer recordMap={recordMap} />);
}

describe("Accessibility (a11y) - Toggle Block", () => {
  it("renders toggle with role=button", () => {
    const page = makePageBlock("page-1", ["tog-1"]);
    const toggle = makeBlock("tog-1", "toggle", {
      properties: { title: [["Click to expand"]] },
      content: ["child-1"],
    });
    const child = makeBlock("child-1", "text", {
      properties: { title: [["Hidden content"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "tog-1": { value: toggle },
      "child-1": { value: child },
    });

    expect(html).toContain('role="button"');
  });

  it("renders toggle with aria-expanded attribute", () => {
    const page = makePageBlock("page-1", ["tog-1"]);
    const toggle = makeBlock("tog-1", "toggle", {
      properties: { title: [["Click to expand"]] },
      content: ["child-1"],
    });
    const child = makeBlock("child-1", "text", {
      properties: { title: [["Hidden content"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "tog-1": { value: toggle },
      "child-1": { value: child },
    });

    expect(html).toContain('aria-expanded=');
  });

  it("renders toggle with aria-controls attribute", () => {
    const page = makePageBlock("page-1", ["tog-1"]);
    const toggle = makeBlock("tog-1", "toggle", {
      properties: { title: [["Click to expand"]] },
      content: ["child-1"],
    });
    const child = makeBlock("child-1", "text", {
      properties: { title: [["Hidden content"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "tog-1": { value: toggle },
      "child-1": { value: child },
    });

    expect(html).toContain('aria-controls=');
  });

  it("renders toggle with native keyboard access via summary element", () => {
    const page = makePageBlock("page-1", ["tog-1"]);
    const toggle = makeBlock("tog-1", "toggle", {
      properties: { title: [["Click to expand"]] },
      content: ["child-1"],
    });
    const child = makeBlock("child-1", "text", {
      properties: { title: [["Hidden content"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "tog-1": { value: toggle },
      "child-1": { value: child },
    });

    expect(html).toContain("<summary");
    expect(html).toContain("role=\"button\"");
  });
});

describe("Accessibility (a11y) - Callout Block", () => {
  it("renders callout with role=note", () => {
    const page = makePageBlock("page-1", ["co-1"]);
    const callout = makeBlock("co-1", "callout", {
      properties: { title: [["Important note"]] },
      format: { page_icon: "💡", block_color: "yellow_background" },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "co-1": { value: callout },
    });

    expect(html).toContain('role="note"');
  });

  it("renders callout with aria-label", () => {
    const page = makePageBlock("page-1", ["co-1"]);
    const callout = makeBlock("co-1", "callout", {
      properties: { title: [["Important note"]] },
      format: { page_icon: "💡", block_color: "yellow_background" },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "co-1": { value: callout },
    });

    expect(html).toContain('aria-label=');
  });
});

describe("Accessibility (a11y) - To-Do Block", () => {
  it("renders to-do with role=checkbox", () => {
    const page = makePageBlock("page-1", ["todo-1"]);
    const todo = makeBlock("todo-1", "to_do", {
      properties: { title: [["Buy milk"]], checked: [["Yes"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "todo-1": { value: todo },
    });

    expect(html).toContain('role="checkbox"');
  });

  it("renders to-do with aria-checked attribute", () => {
    const page = makePageBlock("page-1", ["todo-1"]);
    const todo = makeBlock("todo-1", "to_do", {
      properties: { title: [["Buy milk"]], checked: [["Yes"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "todo-1": { value: todo },
    });

    expect(html).toContain('aria-checked=');
  });

  it("renders to-do with tabIndex=0 for keyboard access", () => {
    const page = makePageBlock("page-1", ["todo-1"]);
    const todo = makeBlock("todo-1", "to_do", {
      properties: { title: [["Buy milk"]], checked: [["Yes"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "todo-1": { value: todo },
    });

    expect(html).toContain('tabindex="0"');
  });
});

describe("Accessibility (a11y) - Code Block", () => {
  it("renders code block with aria-label containing language", () => {
    const page = makePageBlock("page-1", ["code-1"]);
    const code = makeBlock("code-1", "code", {
      properties: {
        title: [["const x = 1;"]],
        language: [["javascript"]],
      },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "code-1": { value: code },
    });

    expect(html).toContain('aria-label=');
    expect(html).toContain("javascript");
  });
});

describe("Accessibility (a11y) - Table Block", () => {
  it("renders table with caption element", () => {
    const page = makePageBlock("page-1", ["table-1"]);
    const table = makeBlock("table-1", "table", {
      content: ["row-1"],
      format: {
        table_block_column_order: ["col-1", "col-2"],
        table_block_column_header: true,
        table_block_row_header: false,
      },
    });
    const row = makeBlock("row-1", "table_row", {
      properties: {
        "col-1": [["Header 1"]],
        "col-2": [["Header 2"]],
      },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "table-1": { value: table },
      "row-1": { value: row },
    });

    expect(html).toContain("<caption");
  });

  it("renders table header cells with scope=col", () => {
    const page = makePageBlock("page-1", ["table-1"]);
    const table = makeBlock("table-1", "table", {
      content: ["row-1"],
      format: {
        table_block_column_order: ["col-1", "col-2"],
        table_block_column_header: true,
        table_block_row_header: false,
      },
    });
    const row = makeBlock("row-1", "table_row", {
      properties: {
        "col-1": [["Header 1"]],
        "col-2": [["Header 2"]],
      },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "table-1": { value: table },
      "row-1": { value: row },
    });

    expect(html).toContain('scope="col"');
  });

  it("renders table row header cells with scope=row", () => {
    const page = makePageBlock("page-1", ["table-1"]);
    const table = makeBlock("table-1", "table", {
      content: ["row-1", "row-2"],
      format: {
        table_block_column_order: ["col-1", "col-2"],
        table_block_column_header: true,
        table_block_row_header: true,
      },
    });
    const row1 = makeBlock("row-1", "table_row", {
      properties: {
        "col-1": [["Header 1"]],
        "col-2": [["Header 2"]],
      },
    });
    const row2 = makeBlock("row-2", "table_row", {
      properties: {
        "col-1": [["Row Header"]],
        "col-2": [["Data"]],
      },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "table-1": { value: table },
      "row-1": { value: row1 },
      "row-2": { value: row2 },
    });

    expect(html).toContain('scope="row"');
  });
});

describe("Accessibility (a11y) - Image Block", () => {
  it("renders image with alt text from caption", () => {
    const page = makePageBlock("page-1", ["img-1"]);
    const image = makeBlock("img-1", "image", {
      properties: {
        source: [["https://example.com/image.jpg"]],
        caption: [["A beautiful sunset"]],
      },
      format: {
        display_source: "https://example.com/image.jpg",
      },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "img-1": { value: image },
    });

    expect(html).toContain('alt="A beautiful sunset"');
  });

  it("renders image with fallback alt text when no caption", () => {
    const page = makePageBlock("page-1", ["img-1"]);
    const image = makeBlock("img-1", "image", {
      properties: {
        source: [["https://example.com/image.jpg"]],
      },
      format: {
        display_source: "https://example.com/image.jpg",
      },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "img-1": { value: image },
    });

    expect(html).toContain('alt="Image"');
  });
});
