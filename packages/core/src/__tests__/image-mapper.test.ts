import { describe, it, expect } from "bun:test";
import type { ExtendedRecordMap, Block } from "notion-types";
import { mapImages } from "../image-mapper";

function makeBlock(
  id: string,
  type: string,
  overrides: Partial<Block> = {}
): Block {
  return {
    id,
    type,
    version: 1,
    created_time: 0,
    last_edited_time: 0,
    parent_id: "parent",
    parent_table: "block",
    alive: true,
    space_id: "space",
    ...overrides,
  } as Block;
}

function makeRecordMap(
  blocks: Record<string, Block>
): ExtendedRecordMap {
  const blockMap: Record<string, { role: string; value: Block }> = {};
  for (const [id, block] of Object.entries(blocks)) {
    blockMap[id] = { role: "editor", value: block };
  }

  return {
    block: blockMap,
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
  } as unknown as ExtendedRecordMap;
}

describe("mapImages", () => {
  it("replaces image block source URL", () => {
    const block = makeBlock("img1", "image", {
      properties: { source: [["https://example.com/photo.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ img1: block });
    const urlMap = {
      "https://example.com/photo.png": "/public/images/abc123.png",
    };

    const result = mapImages(recordMap, urlMap);
    const mapped = (result.block["img1"] as { role: string; value: Block }).value;
    expect((mapped.properties as Record<string, string[][]>).source[0][0]).toBe(
      "/public/images/abc123.png"
    );
  });

  it("replaces page_cover URL", () => {
    const block = makeBlock("page1", "page", {
      format: { page_cover: "https://example.com/cover.jpg" },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ page1: block });
    const urlMap = {
      "https://example.com/cover.jpg": "/public/images/def456.jpg",
    };

    const result = mapImages(recordMap, urlMap);
    const mapped = (result.block["page1"] as { role: string; value: Block }).value;
    expect((mapped.format as { page_cover: string }).page_cover).toBe(
      "/public/images/def456.jpg"
    );
  });

  it("replaces bookmark_cover URL", () => {
    const block = makeBlock("bm1", "bookmark", {
      format: { bookmark_cover: "https://example.com/og.png" },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ bm1: block });
    const urlMap = {
      "https://example.com/og.png": "/public/images/ghi789.png",
    };

    const result = mapImages(recordMap, urlMap);
    const mapped = (result.block["bm1"] as { role: string; value: Block }).value;
    expect((mapped.format as { bookmark_cover: string }).bookmark_cover).toBe(
      "/public/images/ghi789.png"
    );
  });

  it("leaves unmapped URLs unchanged", () => {
    const block = makeBlock("img1", "image", {
      properties: { source: [["https://example.com/not-mapped.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ img1: block });

    const result = mapImages(recordMap, {});
    const mapped = (result.block["img1"] as { role: string; value: Block }).value;
    expect((mapped.properties as Record<string, string[][]>).source[0][0]).toBe(
      "https://example.com/not-mapped.png"
    );
  });

  it("replaces signed_urls entries", () => {
    const block = makeBlock("img1", "image", {
      properties: { source: [["https://example.com/photo.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ img1: block });
    recordMap.signed_urls = {
      img1: "https://signed.amazonaws.com/photo.png?sig=abc",
    };
    const urlMap = {
      "https://signed.amazonaws.com/photo.png?sig=abc": "/public/images/local.png",
    };

    const result = mapImages(recordMap, urlMap);
    expect(result.signed_urls?.["img1"]).toBe("/public/images/local.png");
  });

  it("does not mutate the original recordMap", () => {
    const block = makeBlock("img1", "image", {
      properties: { source: [["https://example.com/photo.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ img1: block });
    const urlMap = {
      "https://example.com/photo.png": "/public/images/local.png",
    };

    mapImages(recordMap, urlMap);

    const original = (recordMap.block["img1"] as { role: string; value: Block }).value;
    expect((original.properties as Record<string, string[][]>).source[0][0]).toBe(
      "https://example.com/photo.png"
    );
  });
});
