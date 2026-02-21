import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import { NotionRenderer } from "../renderer";
import type { NotionBlockProps } from "../types";
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

function makePageBlock(id: string, childIds: string[] = [], overrides: Record<string, unknown> = {}): Block {
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
    ...overrides,
  } as unknown as Block;
}

function renderWithRecordMap(blocks: Record<string, { value: Block }>, props: Record<string, unknown> = {}) {
  const recordMap = createMinimalRecordMap(blocks);
  return renderToString(
    <NotionRenderer recordMap={recordMap} {...props} />
  );
}

describe("Block Router", () => {
  it("renders a text block as a paragraph", () => {
    const page = makePageBlock("page-1", ["text-1"]);
    const text = makeBlock("text-1", "text", {
      properties: { title: [["Hello paragraph"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "text-1": { value: text },
    });

    expect(html).toContain("Hello paragraph");
    expect(html).toContain("noxion-text");
  });

  it("routes header to HeadingBlock with h1", () => {
    const page = makePageBlock("page-1", ["h-1"]);
    const heading = makeBlock("h-1", "header", {
      properties: { title: [["Big Heading"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "h-1": { value: heading },
    });

    expect(html).toContain("Big Heading");
    expect(html).toContain("noxion-heading--h1");
    expect(html).toContain("<h1");
  });

  it("routes sub_header to HeadingBlock with h2", () => {
    const page = makePageBlock("page-1", ["h-2"]);
    const heading = makeBlock("h-2", "sub_header", {
      properties: { title: [["Sub Heading"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "h-2": { value: heading },
    });

    expect(html).toContain("Sub Heading");
    expect(html).toContain("noxion-heading--h2");
    expect(html).toContain("<h2");
  });

  it("routes sub_sub_header to HeadingBlock with h3", () => {
    const page = makePageBlock("page-1", ["h-3"]);
    const heading = makeBlock("h-3", "sub_sub_header", {
      properties: { title: [["Small Heading"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "h-3": { value: heading },
    });

    expect(html).toContain("Small Heading");
    expect(html).toContain("noxion-heading--h3");
    expect(html).toContain("<h3");
  });

  it("renders bulleted_list as li element", () => {
    const page = makePageBlock("page-1", ["li-1"]);
    const item = makeBlock("li-1", "bulleted_list", {
      properties: { title: [["Bullet item"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "li-1": { value: item },
    });

    expect(html).toContain("Bullet item");
    expect(html).toContain("noxion-list-item--bulleted");
    expect(html).toContain("<li");
  });

  it("renders numbered_list as li element", () => {
    const page = makePageBlock("page-1", ["li-1"]);
    const item = makeBlock("li-1", "numbered_list", {
      properties: { title: [["Numbered item"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "li-1": { value: item },
    });

    expect(html).toContain("Numbered item");
    expect(html).toContain("noxion-list-item--numbered");
    expect(html).toContain("<li");
  });

  it("renders to_do with checkbox", () => {
    const page = makePageBlock("page-1", ["todo-1"]);
    const todo = makeBlock("todo-1", "to_do", {
      properties: { title: [["Buy milk"]], checked: [["Yes"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "todo-1": { value: todo },
    });

    expect(html).toContain("Buy milk");
    expect(html).toContain("noxion-to-do");
    expect(html).toContain("noxion-to-do--checked");
    expect(html).toContain('type="checkbox"');
  });

  it("renders unchecked to_do without --checked modifier", () => {
    const page = makePageBlock("page-1", ["todo-1"]);
    const todo = makeBlock("todo-1", "to_do", {
      properties: { title: [["Unchecked task"]], checked: [["No"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "todo-1": { value: todo },
    });

    expect(html).toContain("Unchecked task");
    expect(html).toContain("noxion-to-do");
    expect(html).not.toContain("noxion-to-do--checked");
  });

  it("renders quote block as blockquote", () => {
    const page = makePageBlock("page-1", ["q-1"]);
    const quote = makeBlock("q-1", "quote", {
      properties: { title: [["Wise words"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "q-1": { value: quote },
    });

    expect(html).toContain("Wise words");
    expect(html).toContain("noxion-quote");
    expect(html).toContain("<blockquote");
  });

  it("renders callout with icon", () => {
    const page = makePageBlock("page-1", ["co-1"]);
    const callout = makeBlock("co-1", "callout", {
      properties: { title: [["Important note"]] },
      format: { page_icon: "💡", block_color: "yellow_background" },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "co-1": { value: callout },
    });

    expect(html).toContain("Important note");
    expect(html).toContain("noxion-callout");
    expect(html).toContain("💡");
  });

  it("renders divider as hr", () => {
    const page = makePageBlock("page-1", ["div-1"]);
    const divider = makeBlock("div-1", "divider", { properties: undefined });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "div-1": { value: divider },
    });

    expect(html).toContain("<hr");
    expect(html).toContain("noxion-divider");
  });

  it("renders toggle as details/summary", () => {
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

    expect(html).toContain("Click to expand");
    expect(html).toContain("Hidden content");
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
    expect(html).toContain("noxion-toggle");
  });
});

describe("Component Overrides", () => {
  it("uses custom component for text block when provided via blockOverrides", () => {
    const page = makePageBlock("page-1", ["text-1"]);
    const text = makeBlock("text-1", "text", {
      properties: { title: [["Original"]] },
    });

    function CustomText({ block }: NotionBlockProps) {
      return <div className="custom-text">Custom: {(block.properties as { title: string[][] })?.title?.[0]?.[0]}</div>;
    }

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "text-1": { value: text },
    });

    const html = renderToString(
      <NotionRenderer
        recordMap={recordMap}
        components={{ blockOverrides: { text: CustomText } }}
      />
    );

    expect(html).toContain("custom-text");
    expect(html).toContain("Custom:");
    expect(html).toContain("Original");
    expect(html).not.toContain("noxion-text");
  });
});

describe("Unknown Block Types", () => {
  it("renders debug placeholder for unknown block types in development", () => {
    const page = makePageBlock("page-1", ["unk-1"]);
    const unknown = makeBlock("unk-1", "some_future_block_type", {
      properties: { title: [["Future content"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "unk-1": { value: unknown },
    });

    expect(html).toContain("noxion-block--unknown");
    expect(html).toContain("some_future_block_type");
  });

  it("skips dead blocks (alive = false)", () => {
    const page = makePageBlock("page-1", ["dead-1"]);
    const dead = makeBlock("dead-1", "text", {
      properties: { title: [["Ghost"]] },
      alive: false,
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "dead-1": { value: dead },
    });

    expect(html).not.toContain("Ghost");
  });
});

describe("Nested Blocks", () => {
  it("renders nested children recursively", () => {
    const page = makePageBlock("page-1", ["parent"]);
    const parent = makeBlock("parent", "text", {
      properties: { title: [["Parent"]] },
      content: ["child"],
    });
    const child = makeBlock("child", "text", {
      properties: { title: [["Child"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "parent": { value: parent },
      "child": { value: child },
    });

    expect(html).toContain("Parent");
    expect(html).toContain("Child");
  });

  it("renders deeply nested blocks (3 levels)", () => {
    const page = makePageBlock("page-1", ["l1"]);
    const l1 = makeBlock("l1", "toggle", {
      properties: { title: [["Level 1"]] },
      content: ["l2"],
    });
    const l2 = makeBlock("l2", "toggle", {
      properties: { title: [["Level 2"]] },
      content: ["l3"],
    });
    const l3 = makeBlock("l3", "text", {
      properties: { title: [["Level 3"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "l1": { value: l1 },
      "l2": { value: l2 },
      "l3": { value: l3 },
    });

    expect(html).toContain("Level 1");
    expect(html).toContain("Level 2");
    expect(html).toContain("Level 3");
  });
});

describe("NotionRenderer", () => {
  it("renders with full page mode (cover, icon, title)", () => {
    const page = makePageBlock("page-1", ["text-1"], {
      properties: { title: [["My Page Title"]] },
      format: {
        page_full_width: false,
        page_small_text: false,
        page_cover: "https://example.com/cover.jpg",
        page_cover_position: 0.5,
        page_icon: "📝",
      },
    });
    const text = makeBlock("text-1", "text", {
      properties: { title: [["Body text"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "text-1": { value: text },
    });

    expect(html).toContain("My Page Title");
    expect(html).toContain("noxion-page");
    expect(html).toContain("noxion-page__cover");
    expect(html).toContain("📝");
    expect(html).toContain("Body text");
  });

  it("renders inline mode without page chrome", () => {
    const page = makePageBlock("page-1", ["text-1"]);
    const text = makeBlock("text-1", "text", {
      properties: { title: [["Inline body"]] },
    });

    const html = renderWithRecordMap(
      {
        "page-1": { value: page },
        "text-1": { value: text },
      },
      { fullPage: false }
    );

    expect(html).toContain("Inline body");
    expect(html).toContain("noxion-page--inline");
    expect(html).not.toContain("noxion-page__cover");
    expect(html).not.toContain("noxion-page__title");
  });

  it("adds dark mode class when darkMode is true", () => {
    const page = makePageBlock("page-1", []);

    const html = renderWithRecordMap(
      { "page-1": { value: page } },
      { darkMode: true }
    );

    expect(html).toContain("noxion-renderer--dark");
  });

  it("returns null for empty recordMap", () => {
    const html = renderWithRecordMap({});
    expect(html).toBe("");
  });

  it("uses mapPageUrl for nested page links", () => {
    const page = makePageBlock("page-1", ["sub-page"]);
    const subPage = makeBlock("sub-page", "page", {
      properties: { title: [["Sub Page"]] },
      format: {
        page_full_width: false,
        page_small_text: false,
        page_cover_position: 0.5,
        page_icon: "📄",
      },
    });

    const html = renderWithRecordMap(
      {
        "page-1": { value: page },
        "sub-page": { value: subPage },
      },
      { mapPageUrl: (id: string) => `/blog/${id}` }
    );

    expect(html).toContain("/blog/sub-page");
    expect(html).toContain("Sub Page");
    expect(html).toContain("noxion-page-link");
  });

  it("applies block color to text blocks", () => {
    const page = makePageBlock("page-1", ["colored"]);
    const colored = makeBlock("colored", "text", {
      properties: { title: [["Colored text"]] },
      format: { block_color: "blue" },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "colored": { value: colored },
    });

    expect(html).toContain("noxion-color--blue");
  });

  it("renders header and footer slots", () => {
    const page = makePageBlock("page-1", []);

    const recordMap = createMinimalRecordMap({ "page-1": { value: page } });
    const html = renderToString(
      <NotionRenderer
        recordMap={recordMap}
        header={<div className="test-header">Header</div>}
        footer={<div className="test-footer">Footer</div>}
      />
    );

    expect(html).toContain("test-header");
    expect(html).toContain("Header");
    expect(html).toContain("test-footer");
    expect(html).toContain("Footer");
  });

  it("renders toggleable heading with details/summary", () => {
    const page = makePageBlock("page-1", ["th-1"]);
    const heading = makeBlock("th-1", "header", {
      properties: { title: [["Toggleable Heading"]] },
      format: { block_color: "default", toggleable: true },
      content: ["child-1"],
    });
    const child = makeBlock("child-1", "text", {
      properties: { title: [["Hidden under heading"]] },
    });

    const html = renderWithRecordMap({
      "page-1": { value: page },
      "th-1": { value: heading },
      "child-1": { value: child },
    });

    expect(html).toContain("Toggleable Heading");
    expect(html).toContain("Hidden under heading");
    expect(html).toContain("<details");
    expect(html).toContain("noxion-toggle--heading");
  });
});
