import { describe, test, expect } from "bun:test";
import { parseKeyValuePairs, parseFrontmatter, applyFrontmatter } from "../frontmatter";
import type { BlogPost } from "../types";
import type { ExtendedRecordMap } from "notion-types";

const basePost: BlogPost = {
  id: "page-1",
  title: "Original Title",
  slug: "original-slug",
  date: "2025-01-01",
  tags: ["original"],
  category: "General",
  published: true,
  lastEditedTime: "2025-01-01T00:00:00.000Z",
};

describe("parseKeyValuePairs", () => {
  test("parses simple key: value pairs", () => {
    const text = 'title: "Hello World"\ndescription: "A test post"';
    const result = parseKeyValuePairs(text);
    expect(result.title).toBe("Hello World");
    expect(result.description).toBe("A test post");
  });

  test("handles unquoted values", () => {
    const text = "floatFirstTOC: right\ncleanUrl: /my-post";
    const result = parseKeyValuePairs(text);
    expect(result.floatFirstTOC).toBe("right");
    expect(result.cleanUrl).toBe("/my-post");
  });

  test("handles single-quoted values", () => {
    const text = "title: 'Hello World'";
    const result = parseKeyValuePairs(text);
    expect(result.title).toBe("Hello World");
  });

  test("skips empty lines", () => {
    const text = "title: Hello\n\ndescription: World";
    const result = parseKeyValuePairs(text);
    expect(result.title).toBe("Hello");
    expect(result.description).toBe("World");
  });

  test("handles values containing colons", () => {
    const text = 'cleanUrl: "https://example.com/path"';
    const result = parseKeyValuePairs(text);
    expect(result.cleanUrl).toBe("https://example.com/path");
  });

  test("handles Korean text in values", () => {
    const text = 'title: "에이전트 시대에 여전히 워크플로우가 중요한 이유 🔗"';
    const result = parseKeyValuePairs(text);
    expect(result.title).toBe("에이전트 시대에 여전히 워크플로우가 중요한 이유 🔗");
  });

  test("returns empty object for empty text", () => {
    expect(parseKeyValuePairs("")).toEqual({});
    expect(parseKeyValuePairs("  \n  ")).toEqual({});
  });

  test("parses the example from the user", () => {
    const text = `cleanUrl: "/why-you-still-need-workflow"
floatFirstTOC: right
title: "에이전트 시대에 여전히 워크플로우가 중요한 이유 🔗"
description: "사이오닉 스톰의 워크플로우 디자이너 에이전트는 자연어로 원하는 것을 설명하면 그에 맞는 워크플로우를 설계해주는 AI 에이전트입니다."`;
    const result = parseKeyValuePairs(text);
    expect(result.cleanUrl).toBe("/why-you-still-need-workflow");
    expect(result.floatFirstTOC).toBe("right");
    expect(result.title).toBe("에이전트 시대에 여전히 워크플로우가 중요한 이유 🔗");
    expect(result.description).toBe(
      "사이오닉 스톰의 워크플로우 디자이너 에이전트는 자연어로 원하는 것을 설명하면 그에 맞는 워크플로우를 설계해주는 AI 에이전트입니다."
    );
  });
});

function makeRecordMap(pageId: string, firstBlockType: string, codeText: string): ExtendedRecordMap {
  const childId = "child-block-1";
  return {
    block: {
      [pageId]: {
        role: "reader",
        value: {
          id: pageId,
          type: "page",
          content: [childId],
        },
      },
      [childId]: {
        role: "reader",
        value: {
          id: childId,
          type: firstBlockType,
          properties: {
            title: [[codeText]],
          },
        },
      },
    },
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
  } as unknown as ExtendedRecordMap;
}

describe("parseFrontmatter", () => {
  test("extracts frontmatter from first code block", () => {
    const recordMap = makeRecordMap("page-1", "code", 'title: "Hello"\nslug: my-post');
    const result = parseFrontmatter(recordMap, "page-1");
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Hello");
    expect(result!.slug).toBe("my-post");
  });

  test("returns null when first block is not a code block", () => {
    const recordMap = makeRecordMap("page-1", "text", "title: Hello");
    const result = parseFrontmatter(recordMap, "page-1");
    expect(result).toBeNull();
  });

  test("returns null when page has no children", () => {
    const recordMap = {
      block: {
        "page-1": {
          role: "reader",
          value: { id: "page-1", type: "page", content: [] },
        },
      },
      collection: {},
      collection_view: {},
      collection_query: {},
      notion_user: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap;
    const result = parseFrontmatter(recordMap, "page-1");
    expect(result).toBeNull();
  });

  test("returns null when page id does not exist", () => {
    const recordMap = {
      block: {},
      collection: {},
      collection_view: {},
      collection_query: {},
      notion_user: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap;
    const result = parseFrontmatter(recordMap, "nonexistent");
    expect(result).toBeNull();
  });

  test("returns null when code block is empty", () => {
    const recordMap = makeRecordMap("page-1", "code", "");
    const result = parseFrontmatter(recordMap, "page-1");
    expect(result).toBeNull();
  });
});

describe("applyFrontmatter", () => {
  test("overrides title from frontmatter", () => {
    const result = applyFrontmatter(basePost, { title: "New Title" });
    expect(result.title).toBe("New Title");
    expect(result.frontmatter).toEqual({ title: "New Title" });
  });

  test("overrides slug from cleanUrl (strips leading slash)", () => {
    const result = applyFrontmatter(basePost, { cleanUrl: "/new-slug" });
    expect(result.slug).toBe("new-slug");
  });

  test("overrides slug from slug field", () => {
    const result = applyFrontmatter(basePost, { slug: "direct-slug" });
    expect(result.slug).toBe("direct-slug");
  });

  test("sets description", () => {
    const result = applyFrontmatter(basePost, { description: "A description" });
    expect(result.description).toBe("A description");
  });

  test("overrides date", () => {
    const result = applyFrontmatter(basePost, { date: "2026-01-01" });
    expect(result.date).toBe("2026-01-01");
  });

  test("overrides category", () => {
    const result = applyFrontmatter(basePost, { category: "Tech" });
    expect(result.category).toBe("Tech");
  });

  test("overrides tags from comma-separated string", () => {
    const result = applyFrontmatter(basePost, { tags: "ai, workflow, agent" });
    expect(result.tags).toEqual(["ai", "workflow", "agent"]);
  });

  test("overrides coverImage", () => {
    const result = applyFrontmatter(basePost, { coverImage: "/img/cover.png" });
    expect(result.coverImage).toBe("/img/cover.png");
  });

  test("overrides coverImage from cover alias", () => {
    const result = applyFrontmatter(basePost, { cover: "/img/cover.png" });
    expect(result.coverImage).toBe("/img/cover.png");
  });

  test("preserves unknown frontmatter keys in frontmatter field", () => {
    const result = applyFrontmatter(basePost, { floatFirstTOC: "right", custom: "value" });
    expect(result.frontmatter!.floatFirstTOC).toBe("right");
    expect(result.frontmatter!.custom).toBe("value");
  });

  test("does not mutate original post", () => {
    const result = applyFrontmatter(basePost, { title: "Changed" });
    expect(basePost.title).toBe("Original Title");
    expect(result.title).toBe("Changed");
  });

  test("full example: user's frontmatter overrides", () => {
    const fm = {
      cleanUrl: "/why-you-still-need-workflow",
      floatFirstTOC: "right",
      title: "에이전트 시대에 여전히 워크플로우가 중요한 이유 🔗",
      description: "사이오닉 스톰의 워크플로우 디자이너 에이전트입니다.",
    };
    const result = applyFrontmatter(basePost, fm);
    expect(result.slug).toBe("why-you-still-need-workflow");
    expect(result.title).toBe("에이전트 시대에 여전히 워크플로우가 중요한 이유 🔗");
    expect(result.description).toBe("사이오닉 스톰의 워크플로우 디자이너 에이전트입니다.");
    expect(result.frontmatter!.floatFirstTOC).toBe("right");
  });
});
