import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import React from "react";
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

function makePageBlock(id: string, childIds: string[]): Block {
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

/**
 * Creates a recordMap with N text blocks as children of a page block.
 */
function createRecordMapWithNBlocks(n: number): ExtendedRecordMap {
  const childIds: string[] = [];
  const blocks: Record<string, { value: Block }> = {};

  // Page block must be first key so NotionRenderer resolves it as root
  blocks["page-root"] = { value: makePageBlock("page-root", []) };

  for (let i = 0; i < n; i++) {
    const blockId = `block-${i}`;
    childIds.push(blockId);
    blocks[blockId] = {
      value: makeBlock(blockId, "text", {
        properties: { title: [[`Paragraph ${i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`]] },
      }),
    };
  }

  // Update page block with child IDs
  blocks["page-root"] = { value: makePageBlock("page-root", childIds) };
  return createMinimalRecordMap(blocks);
}

/**
 * Creates a recordMap with mixed block types (text, headings, quotes, callouts, dividers, lists).
 */
function createMixedBlockRecordMap(n: number): ExtendedRecordMap {
  const blockTypes = ["text", "header", "sub_header", "quote", "callout", "divider", "bulleted_list", "numbered_list"];
  const childIds: string[] = [];
  const blocks: Record<string, { value: Block }> = {};

  // Page block must be first key so NotionRenderer resolves it as root
  blocks["page-root"] = { value: makePageBlock("page-root", []) };
  for (let i = 0; i < n; i++) {
    const blockId = `block-${i}`;
    const blockType = blockTypes[i % blockTypes.length];
    childIds.push(blockId);

    const overrides: Partial<Block> = {
      properties: { title: [[`Content for block ${i}`]] },
    };

    if (blockType === "callout") {
      overrides.format = { page_icon: "💡", block_color: "yellow_background" } as Block["format"];
    }

    blocks[blockId] = { value: makeBlock(blockId, blockType, overrides) };
  }

  // Update page block with child IDs
  blocks["page-root"] = { value: makePageBlock("page-root", childIds) };
  return createMinimalRecordMap(blocks);
}

describe("Performance Benchmarks", () => {
  it("renders 100 text blocks in < 50ms (SSR)", () => {
    const recordMap = createRecordMapWithNBlocks(100);

    // Warm-up render (JIT compilation, module loading)
    renderToString(<NotionRenderer recordMap={recordMap} />);

    // Benchmark render
    const start = performance.now();
    const html = renderToString(<NotionRenderer recordMap={recordMap} />);
    const duration = performance.now() - start;

    // Verify output correctness
    expect(html).toContain("Paragraph 0:");
    expect(html).toContain("Paragraph 99:");
    expect(html).toContain("noxion-text");

    // Performance assertion
    expect(duration).toBeLessThan(50);
  });

  it("renders 100 mixed block types in < 50ms (SSR)", () => {
    const recordMap = createMixedBlockRecordMap(100);

    // Warm-up render
    renderToString(<NotionRenderer recordMap={recordMap} />);

    // Benchmark render
    const start = performance.now();
    const html = renderToString(<NotionRenderer recordMap={recordMap} />);
    const duration = performance.now() - start;

    // Verify output contains different block types
    expect(html).toContain("noxion-text");
    expect(html).toContain("noxion-heading");
    expect(html).toContain("noxion-quote");
    expect(html).toContain("noxion-callout");
    expect(html).toContain("noxion-divider");
    expect(html).toContain("noxion-list-item--bulleted");
    expect(html).toContain("noxion-list-item--numbered");

    // Performance assertion
    expect(duration).toBeLessThan(50);
  });

  it("renders 200 blocks in < 100ms (SSR, stress test)", () => {
    const recordMap = createRecordMapWithNBlocks(200);

    // Warm-up render
    renderToString(<NotionRenderer recordMap={recordMap} />);

    // Benchmark render
    const start = performance.now();
    const html = renderToString(<NotionRenderer recordMap={recordMap} />);
    const duration = performance.now() - start;

    expect(html).toContain("Paragraph 199:");
    expect(duration).toBeLessThan(100);
  });

  it("memoized components are exported with React.memo wrapper", () => {
    // Verify key block components are wrapped with React.memo
    // React.memo wraps components and sets $$typeof to Symbol.for('react.memo')
    const { TextBlock } = require("../blocks/text");
    const { HeadingBlock } = require("../blocks/heading");
    const { DividerBlock } = require("../blocks/divider");
    const { QuoteBlock } = require("../blocks/quote");
    const { CalloutBlock } = require("../blocks/callout");
    const { BookmarkBlock } = require("../blocks/bookmark");
    const { BulletedListBlock } = require("../blocks/bulleted-list");
    const { NumberedListBlock } = require("../blocks/numbered-list");
    const { ColumnBlock } = require("../blocks/column");
    const { ColumnListBlock } = require("../blocks/column-list");

    const memoSymbol = Symbol.for("react.memo");

    expect(TextBlock.$$typeof).toBe(memoSymbol);
    expect(HeadingBlock.$$typeof).toBe(memoSymbol);
    expect(DividerBlock.$$typeof).toBe(memoSymbol);
    expect(QuoteBlock.$$typeof).toBe(memoSymbol);
    expect(CalloutBlock.$$typeof).toBe(memoSymbol);
    expect(BookmarkBlock.$$typeof).toBe(memoSymbol);
    expect(BulletedListBlock.$$typeof).toBe(memoSymbol);
    expect(NumberedListBlock.$$typeof).toBe(memoSymbol);
    expect(ColumnBlock.$$typeof).toBe(memoSymbol);
    expect(ColumnListBlock.$$typeof).toBe(memoSymbol);
  });

  it("non-memoized components remain unwrapped", () => {
    // ToggleBlock has internal state (details/summary) - should NOT be memoized
    const { ToggleBlock } = require("../blocks/toggle");
    const memoSymbol = Symbol.for("react.memo");

    expect(ToggleBlock.$$typeof).not.toBe(memoSymbol);
  });
});
