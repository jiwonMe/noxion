import { describe, it, expect, mock, beforeEach } from "bun:test";
import { createNotionClient, fetchBlogPosts, fetchPage, fetchAllSlugs, fetchPostBySlug } from "../fetcher";
import type { ExtendedRecordMap } from "notion-types";

function createMockRecordMap(overrides: Partial<ExtendedRecordMap> = {}): ExtendedRecordMap {
  return {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
    ...overrides,
  } as ExtendedRecordMap;
}

function createMockCollectionRecordMap(posts: Array<{
  id: string;
  properties: Record<string, unknown>;
}>): ExtendedRecordMap {
  const blockEntries: Record<string, unknown> = {};
  const pageId = "database-page-id";

  blockEntries[pageId] = {
    value: {
      id: pageId,
      type: "collection_view_page",
      collection_id: "collection-1",
      view_ids: ["view-1"],
    },
  };

  for (const post of posts) {
    blockEntries[post.id] = {
      value: {
        id: post.id,
        type: "page",
        parent_id: "collection-1",
        parent_table: "collection",
        properties: post.properties,
        last_edited_time: 1700000000000,
      },
    };
  }

  return {
    block: blockEntries,
    collection: {
      "collection-1": {
        value: {
          id: "collection-1",
          schema: {
            title: { name: "title", type: "title" },
            "prop-slug": { name: "slug", type: "text" },
            "prop-date": { name: "date", type: "date" },
            "prop-tags": { name: "tags", type: "multi_select" },
            "prop-category": { name: "category", type: "select" },
            "prop-published": { name: "published", type: "checkbox" },
          },
        },
      },
    },
    collection_view: {
      "view-1": {
        value: { id: "view-1", type: "table" },
      },
    },
    collection_query: {
      "collection-1": {
        "view-1": {
          blockIds: posts.map((p) => p.id),
        },
      },
    },
    notion_user: {},
    signed_urls: {},
  } as unknown as ExtendedRecordMap;
}

describe("createNotionClient", () => {
  it("creates a client without auth token", () => {
    const client = createNotionClient();
    expect(client).toBeDefined();
    expect(typeof client.getPage).toBe("function");
  });

  it("creates a client with auth token", () => {
    const client = createNotionClient({ authToken: "test-token" });
    expect(client).toBeDefined();
  });
});

describe("fetchPage", () => {
  it("returns an ExtendedRecordMap for a valid page ID", async () => {
    const mockRecordMap = createMockRecordMap({
      block: {
        "page-1": { value: { id: "page-1", type: "page" } },
      } as never,
    });
    const mockClient = { getPage: mock(() => Promise.resolve(mockRecordMap)) };

    const result = await fetchPage(mockClient as never, "page-1");
    expect(result).toEqual(mockRecordMap);
    expect(mockClient.getPage).toHaveBeenCalledWith("page-1");
  });

  it("throws on network error", async () => {
    const mockClient = { getPage: mock(() => Promise.reject(new Error("Network error"))) };

    expect(fetchPage(mockClient as never, "bad-id")).rejects.toThrow("Network error");
  });
});

describe("fetchBlogPosts", () => {
  it("extracts blog posts from collection recordMap", async () => {
    const recordMap = createMockCollectionRecordMap([
      {
        id: "post-1",
        properties: {
          title: [["My First Post"]],
          "prop-slug": [["my-first-post"]],
          "prop-date": [["2024-01-15"]],
          "prop-tags": [["tech"]],
          "prop-published": [["Yes"]],
        },
      },
      {
        id: "post-2",
        properties: {
          title: [["My Second Post"]],
          "prop-slug": [["my-second-post"]],
          "prop-date": [["2024-01-20"]],
          "prop-tags": [["design"]],
          "prop-published": [["Yes"]],
        },
      },
    ]);
    const mockClient = { getPage: mock(() => Promise.resolve(recordMap)) };

    const posts = await fetchBlogPosts(mockClient as never, "database-page-id");
    expect(posts.length).toBe(2);
    expect(posts[0].title).toBe("My Second Post");
    expect(posts[1].title).toBe("My First Post");
    expect(posts[0].published).toBe(true);
  });

  it("filters out unpublished posts", async () => {
    const recordMap = createMockCollectionRecordMap([
      {
        id: "post-1",
        properties: {
          title: [["Published Post"]],
          "prop-slug": [["published"]],
          "prop-date": [["2024-01-15"]],
          "prop-published": [["Yes"]],
        },
      },
      {
        id: "post-2",
        properties: {
          title: [["Draft Post"]],
          "prop-slug": [["draft"]],
          "prop-date": [["2024-01-20"]],
          "prop-published": [["No"]],
        },
      },
    ]);
    const mockClient = { getPage: mock(() => Promise.resolve(recordMap)) };

    const posts = await fetchBlogPosts(mockClient as never, "database-page-id");
    expect(posts.length).toBe(1);
    expect(posts[0].title).toBe("Published Post");
  });

  it("sorts posts by date descending", async () => {
    const recordMap = createMockCollectionRecordMap([
      {
        id: "post-old",
        properties: {
          title: [["Older Post"]],
          "prop-slug": [["older"]],
          "prop-date": [["2024-01-01"]],
          "prop-published": [["Yes"]],
        },
      },
      {
        id: "post-new",
        properties: {
          title: [["Newer Post"]],
          "prop-slug": [["newer"]],
          "prop-date": [["2024-06-15"]],
          "prop-published": [["Yes"]],
        },
      },
    ]);
    const mockClient = { getPage: mock(() => Promise.resolve(recordMap)) };

    const posts = await fetchBlogPosts(mockClient as never, "database-page-id");
    expect(posts[0].title).toBe("Newer Post");
    expect(posts[1].title).toBe("Older Post");
  });

  it("returns empty array for empty database", async () => {
    const recordMap = createMockCollectionRecordMap([]);
    const mockClient = { getPage: mock(() => Promise.resolve(recordMap)) };

    const posts = await fetchBlogPosts(mockClient as never, "database-page-id");
    expect(posts).toEqual([]);
  });
});

describe("fetchAllSlugs", () => {
  it("returns array of slugs from published posts", async () => {
    const recordMap = createMockCollectionRecordMap([
      {
        id: "post-1",
        properties: {
          title: [["Post 1"]],
          "prop-slug": [["slug-one"]],
          "prop-date": [["2024-01-15"]],
          "prop-published": [["Yes"]],
        },
      },
      {
        id: "post-2",
        properties: {
          title: [["Post 2"]],
          "prop-slug": [["slug-two"]],
          "prop-date": [["2024-01-20"]],
          "prop-published": [["Yes"]],
        },
      },
    ]);
    const mockClient = { getPage: mock(() => Promise.resolve(recordMap)) };

    const slugs = await fetchAllSlugs(mockClient as never, "database-page-id");
    expect(slugs).toContain("slug-one");
    expect(slugs).toContain("slug-two");
    expect(slugs.length).toBe(2);
  });
});

describe("fetchPostBySlug", () => {
  it("returns the post matching the slug", async () => {
    const recordMap = createMockCollectionRecordMap([
      {
        id: "post-1",
        properties: {
          title: [["Target Post"]],
          "prop-slug": [["target"]],
          "prop-date": [["2024-01-15"]],
          "prop-published": [["Yes"]],
        },
      },
      {
        id: "post-2",
        properties: {
          title: [["Other Post"]],
          "prop-slug": [["other"]],
          "prop-date": [["2024-01-20"]],
          "prop-published": [["Yes"]],
        },
      },
    ]);
    const mockClient = { getPage: mock(() => Promise.resolve(recordMap)) };

    const post = await fetchPostBySlug(mockClient as never, "database-page-id", "target");
    expect(post).toBeDefined();
    expect(post!.title).toBe("Target Post");
    expect(post!.slug).toBe("target");
  });

  it("returns undefined for non-existent slug", async () => {
    const recordMap = createMockCollectionRecordMap([
      {
        id: "post-1",
        properties: {
          title: [["Some Post"]],
          "prop-slug": [["some-post"]],
          "prop-date": [["2024-01-15"]],
          "prop-published": [["Yes"]],
        },
      },
    ]);
    const mockClient = { getPage: mock(() => Promise.resolve(recordMap)) };

    const post = await fetchPostBySlug(mockClient as never, "database-page-id", "nonexistent");
    expect(post).toBeUndefined();
  });
});
