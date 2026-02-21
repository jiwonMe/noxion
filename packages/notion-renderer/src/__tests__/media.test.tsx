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

function renderBlock(blockId: string, block: Block) {
  const page = makePageBlock("page-1", [blockId]);
  const recordMap = createMinimalRecordMap({
    "page-1": { value: page },
    [blockId]: { value: block },
  });
  return renderToString(<NotionRenderer recordMap={recordMap} />);
}

describe("ImageBlock", () => {
  it("renders image with source from format.display_source", () => {
    const block = makeBlock("img-1", "image", {
      properties: { source: [["https://example.com/photo.jpg"]], caption: [] },
      format: { display_source: "https://example.com/photo.jpg", block_width: 800 },
    });

    const html = renderBlock("img-1", block);

    expect(html).toContain("noxion-image");
    expect(html).toContain("https://example.com/photo.jpg");
    expect(html).toContain("<figure");
    expect(html).toContain("<img");
  });

  it("renders image with caption", () => {
    const block = makeBlock("img-2", "image", {
      properties: {
        source: [["https://example.com/photo.jpg"]],
        caption: [["A beautiful sunset"]],
      },
      format: { display_source: "https://example.com/photo.jpg" },
    });

    const html = renderBlock("img-2", block);

    expect(html).toContain("A beautiful sunset");
    expect(html).toContain("noxion-image__caption");
    expect(html).toContain("<figcaption");
  });

  it("uses mapImageUrl to transform image URLs", () => {
    const page = makePageBlock("page-1", ["img-3"]);
    const block = makeBlock("img-3", "image", {
      properties: { source: [["original.jpg"]], caption: [] },
      format: { display_source: "original.jpg" },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "img-3": { value: block },
    });

    const html = renderToString(
      <NotionRenderer
        recordMap={recordMap}
        mapImageUrl={(url) => `https://cdn.example.com/${url}`}
      />
    );

    expect(html).toContain("https://cdn.example.com/original.jpg");
  });

  it("returns null for image with no source", () => {
    const block = makeBlock("img-4", "image", {
      properties: { source: [], caption: [] },
      format: {},
    });

    const html = renderBlock("img-4", block);
    expect(html).not.toContain("noxion-image__img");
  });
});

describe("VideoBlock", () => {
  it("renders YouTube video as iframe embed", () => {
    const block = makeBlock("vid-1", "video", {
      properties: { source: [["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]], caption: [] },
      format: { display_source: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    });

    const html = renderBlock("vid-1", block);

    expect(html).toContain("noxion-video");
    expect(html).toContain("youtube.com/embed/dQw4w9WgXcQ");
    expect(html).toContain("<iframe");
  });

  it("renders youtu.be short links", () => {
    const block = makeBlock("vid-2", "video", {
      properties: { source: [["https://youtu.be/dQw4w9WgXcQ"]], caption: [] },
      format: { display_source: "https://youtu.be/dQw4w9WgXcQ" },
    });

    const html = renderBlock("vid-2", block);

    expect(html).toContain("youtube.com/embed/dQw4w9WgXcQ");
  });

  it("renders Vimeo video as iframe embed", () => {
    const block = makeBlock("vid-3", "video", {
      properties: { source: [["https://vimeo.com/123456789"]], caption: [] },
      format: { display_source: "https://vimeo.com/123456789" },
    });

    const html = renderBlock("vid-3", block);

    expect(html).toContain("player.vimeo.com/video/123456789");
  });

  it("renders direct video URL as HTML5 video", () => {
    const block = makeBlock("vid-4", "video", {
      properties: { source: [["https://example.com/video.mp4"]], caption: [] },
      format: { display_source: "https://example.com/video.mp4" },
    });

    const html = renderBlock("vid-4", block);

    expect(html).toContain("<video");
    expect(html).toContain("https://example.com/video.mp4");
    expect(html).toContain("controls");
  });
});

describe("AudioBlock", () => {
  it("renders audio element", () => {
    const block = makeBlock("aud-1", "audio", {
      properties: { source: [["https://example.com/track.mp3"]], caption: [] },
      format: { display_source: "https://example.com/track.mp3" },
    });

    const html = renderBlock("aud-1", block);

    expect(html).toContain("noxion-audio");
    expect(html).toContain("<audio");
    expect(html).toContain("https://example.com/track.mp3");
    expect(html).toContain("controls");
  });
});

describe("EmbedBlock", () => {
  it("renders generic embed as iframe", () => {
    const block = makeBlock("emb-1", "embed", {
      properties: { source: [["https://example.com/widget"]], caption: [] },
      format: { display_source: "https://example.com/widget", block_width: 600, block_height: 400 },
    });

    const html = renderBlock("emb-1", block);

    expect(html).toContain("noxion-embed");
    expect(html).toContain("<iframe");
    expect(html).toContain("https://example.com/widget");
  });

  it("renders figma embed", () => {
    const block = makeBlock("fig-1", "figma", {
      properties: { source: [["https://www.figma.com/file/abc123"]], caption: [] },
      format: { display_source: "https://www.figma.com/file/abc123" },
    });

    const html = renderBlock("fig-1", block);

    expect(html).toContain("noxion-embed");
    expect(html).toContain("figma.com");
  });
});

describe("BookmarkBlock", () => {
  it("renders bookmark as a card with title and description", () => {
    const block = makeBlock("bk-1", "bookmark", {
      properties: {
        link: [["https://example.com"]],
        title: [["Example Site"]],
        description: [["An example website"]],
        caption: [],
      },
      format: {
        bookmark_icon: "https://example.com/favicon.ico",
        bookmark_cover: "https://example.com/cover.jpg",
      },
    });

    const html = renderBlock("bk-1", block);

    expect(html).toContain("noxion-bookmark");
    expect(html).toContain("Example Site");
    expect(html).toContain("An example website");
    expect(html).toContain("https://example.com/favicon.ico");
    expect(html).toContain("https://example.com/cover.jpg");
    expect(html).toContain('target="_blank"');
  });

  it("returns null when no link is provided", () => {
    const block = makeBlock("bk-2", "bookmark", {
      properties: { link: [], title: [], description: [], caption: [] },
    });

    const html = renderBlock("bk-2", block);

    expect(html).not.toContain("noxion-bookmark__link");
  });
});

describe("FileBlock", () => {
  it("renders file as download link", () => {
    const block = makeBlock("file-1", "file", {
      properties: {
        title: [["document.pdf"]],
        source: [["https://example.com/document.pdf"]],
        size: [["2.4 MB"]],
      },
    });

    const html = renderBlock("file-1", block);

    expect(html).toContain("noxion-file");
    expect(html).toContain("document.pdf");
    expect(html).toContain("2.4 MB");
    expect(html).toContain("https://example.com/document.pdf");
  });
});

describe("PdfBlock", () => {
  it("renders PDF as iframe", () => {
    const block = makeBlock("pdf-1", "pdf", {
      properties: { source: [["https://example.com/document.pdf"]], caption: [] },
      format: { display_source: "https://example.com/document.pdf" },
    });

    const html = renderBlock("pdf-1", block);

    expect(html).toContain("noxion-pdf");
    expect(html).toContain("<iframe");
    expect(html).toContain("https://example.com/document.pdf");
  });
});
