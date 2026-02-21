import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import type { ExtendedRecordMap, Block } from "notion-types";
import {
  extractImageUrls,
  generateImageFilename,
  downloadImages,
  type DownloadImagesOptions,
} from "../image-downloader";

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
  blocks: Record<string, Block>,
  signedUrls?: Record<string, string>
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
    signed_urls: signedUrls ?? {},
  } as unknown as ExtendedRecordMap;
}

describe("extractImageUrls", () => {
  it("extracts image URL from image block properties.source", () => {
    const block = makeBlock("img1", "image", {
      properties: { source: [["https://s3.amazonaws.com/notion/image1.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ img1: block });

    const urls = extractImageUrls(recordMap);
    expect(urls).toContain("https://s3.amazonaws.com/notion/image1.png");
  });

  it("prefers signed_urls over properties.source for image blocks", () => {
    const block = makeBlock("img1", "image", {
      properties: { source: [["https://original.com/image.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap(
      { img1: block },
      { img1: "https://signed.amazonaws.com/image.png?X-Amz-Signature=abc" }
    );

    const urls = extractImageUrls(recordMap);
    expect(urls).toContain(
      "https://signed.amazonaws.com/image.png?X-Amz-Signature=abc"
    );
    expect(urls).not.toContain("https://original.com/image.png");
  });

  it("extracts page_cover from block format", () => {
    const block = makeBlock("page1", "page", {
      format: { page_cover: "https://images.unsplash.com/photo-123" },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ page1: block });

    const urls = extractImageUrls(recordMap);
    expect(urls).toContain("https://images.unsplash.com/photo-123");
  });

  it("extracts bookmark_cover from block format", () => {
    const block = makeBlock("bm1", "bookmark", {
      format: { bookmark_cover: "https://example.com/og-image.jpg" },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ bm1: block });

    const urls = extractImageUrls(recordMap);
    expect(urls).toContain("https://example.com/og-image.jpg");
  });

  it("deduplicates URLs", () => {
    const block1 = makeBlock("img1", "image", {
      properties: { source: [["https://example.com/same.png"]] },
    } as Partial<Block>);
    const block2 = makeBlock("img2", "image", {
      properties: { source: [["https://example.com/same.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ img1: block1, img2: block2 });

    const urls = extractImageUrls(recordMap);
    const count = urls.filter((u) => u === "https://example.com/same.png").length;
    expect(count).toBe(1);
  });

  it("skips non-URL values", () => {
    const block = makeBlock("page1", "page", {
      format: { page_cover: "/images/default-cover.png" },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ page1: block });

    const urls = extractImageUrls(recordMap);
    expect(urls).toHaveLength(0);
  });

  it("returns empty array when no images present", () => {
    const block = makeBlock("text1", "text");
    const recordMap = makeRecordMap({ text1: block });

    const urls = extractImageUrls(recordMap);
    expect(urls).toEqual([]);
  });
});

describe("generateImageFilename", () => {
  it("generates consistent filename for same URL", () => {
    const a = generateImageFilename("https://example.com/image.png");
    const b = generateImageFilename("https://example.com/image.png");
    expect(a).toBe(b);
  });

  it("generates different filenames for different URLs", () => {
    const a = generateImageFilename("https://example.com/image1.png");
    const b = generateImageFilename("https://example.com/image2.png");
    expect(a).not.toBe(b);
  });

  it("preserves file extension from URL", () => {
    const name = generateImageFilename("https://example.com/photo.jpg");
    expect(name).toMatch(/\.jpg$/);
  });

  it("preserves extension from URL with query params", () => {
    const name = generateImageFilename(
      "https://example.com/photo.webp?X-Amz-Signature=abc"
    );
    expect(name).toMatch(/\.webp$/);
  });

  it("defaults to .png when no extension detectable", () => {
    const name = generateImageFilename("https://example.com/image");
    expect(name).toMatch(/\.png$/);
  });
});

describe("downloadImages", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns URL mapping for successful downloads", async () => {
    const pngBytes = new Uint8Array([137, 80, 78, 71]);

    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(pngBytes, {
          status: 200,
          headers: { "content-type": "image/png" },
        })
      )
    ) as typeof fetch;

    const block = makeBlock("img1", "image", {
      properties: { source: [["https://example.com/photo.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ img1: block });

    const result = await downloadImages(recordMap, "/tmp/test-images");
    expect(Object.keys(result)).toHaveLength(1);
    expect(result["https://example.com/photo.png"]).toMatch(
      /^\/tmp\/test-images\/images\/.+\.png$/
    );
  });

  it("skips failed downloads and excludes from mapping", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(null, { status: 404 }))
    ) as typeof fetch;

    const block = makeBlock("img1", "image", {
      properties: { source: [["https://example.com/missing.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ img1: block });

    const result = await downloadImages(recordMap, "/tmp/test-images");
    expect(Object.keys(result)).toHaveLength(0);
  });

  it("calls onProgress callback", async () => {
    const pngBytes = new Uint8Array([137, 80, 78, 71]);

    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(pngBytes, {
          status: 200,
          headers: { "content-type": "image/png" },
        })
      )
    ) as typeof fetch;

    const block = makeBlock("img1", "image", {
      properties: { source: [["https://example.com/photo.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ img1: block });

    const progress: { done: number; total: number }[] = [];
    await downloadImages(recordMap, "/tmp/test-images", {
      onProgress: (done, total) => progress.push({ done, total }),
    });

    expect(progress.length).toBeGreaterThanOrEqual(1);
    expect(progress[progress.length - 1]).toEqual({ done: 1, total: 1 });
  });

  it("handles fetch exceptions gracefully", async () => {
    globalThis.fetch = mock(() =>
      Promise.reject(new Error("Network error"))
    ) as typeof fetch;

    const block = makeBlock("img1", "image", {
      properties: { source: [["https://example.com/photo.png"]] },
    } as Partial<Block>);
    const recordMap = makeRecordMap({ img1: block });

    const result = await downloadImages(recordMap, "/tmp/test-images");
    expect(Object.keys(result)).toHaveLength(0);
  });
});
