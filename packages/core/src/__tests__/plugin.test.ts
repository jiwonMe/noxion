import { describe, it, expect, mock } from "bun:test";
import { definePlugin, loadPlugins } from "../plugin-loader";
import { executeHook, executeTransformHook } from "../plugin-executor";
import type { NoxionPlugin, NoxionMetadata, RouteInfo } from "../plugin";
import type { NoxionConfig, BlogPost } from "../types";

const stubConfig: NoxionConfig = {
  rootNotionPageId: "test-id",
  name: "Test",
  domain: "test.com",
  author: "Test",
  description: "Test site",
  language: "en",
  defaultTheme: "system",
  revalidate: 3600,
};

describe("definePlugin", () => {
  it("creates plugin from factory with options", () => {
    const factory = definePlugin<{ trackingId: string }>((options) => ({
      name: "analytics",
      injectHead: () => [
        {
          tagName: "script",
          attributes: { src: `https://analytics.com/${options.trackingId}` },
        },
      ],
    }));

    const plugin = factory({ trackingId: "UA-123" });
    expect(plugin.name).toBe("analytics");
    const tags = plugin.injectHead!({ config: stubConfig });
    expect(tags[0].attributes!.src).toBe("https://analytics.com/UA-123");
  });

  it("creates plugin from factory without options", () => {
    const factory = definePlugin(() => ({
      name: "simple",
    }));

    const plugin = factory({});
    expect(plugin.name).toBe("simple");
  });
});

describe("loadPlugins", () => {
  it("loads plugin instance directly", () => {
    const plugin: NoxionPlugin = { name: "direct" };
    const loaded = loadPlugins([plugin]);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe("direct");
  });

  it("loads plugin factory with options tuple", () => {
    const factory = definePlugin<{ key: string }>((opts) => ({
      name: `plugin-${opts.key}`,
    }));

    const loaded = loadPlugins([[factory, { key: "abc" }]]);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe("plugin-abc");
  });

  it("loads plugin factory without options", () => {
    const factory = definePlugin(() => ({ name: "no-opts" }));
    const loaded = loadPlugins([factory]);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe("no-opts");
  });

  it("skips false entries (disabled plugins)", () => {
    const plugin: NoxionPlugin = { name: "active" };
    const loaded = loadPlugins([false, plugin, false]);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe("active");
  });

  it("preserves order from config array", () => {
    const a: NoxionPlugin = { name: "alpha" };
    const b: NoxionPlugin = { name: "beta" };
    const c: NoxionPlugin = { name: "gamma" };
    const loaded = loadPlugins([a, b, c]);
    expect(loaded.map((p) => p.name)).toEqual(["alpha", "beta", "gamma"]);
  });

  it("warns on duplicate plugin names but loads both", () => {
    const a: NoxionPlugin = { name: "dup" };
    const b: NoxionPlugin = { name: "dup" };
    const loaded = loadPlugins([a, b]);
    expect(loaded).toHaveLength(2);
  });
});

describe("executeHook", () => {
  it("calls hook on all plugins sequentially", async () => {
    const order: string[] = [];
    const plugins: NoxionPlugin[] = [
      {
        name: "first",
        onBuildStart: async () => {
          order.push("first");
        },
      },
      {
        name: "second",
        onBuildStart: async () => {
          order.push("second");
        },
      },
    ];

    await executeHook(plugins, "onBuildStart", { config: stubConfig });
    expect(order).toEqual(["first", "second"]);
  });

  it("skips plugins without the hook", async () => {
    const called = mock(() => {});
    const plugins: NoxionPlugin[] = [
      { name: "no-hook" },
      { name: "has-hook", onBuildStart: called },
    ];

    await executeHook(plugins, "onBuildStart", { config: stubConfig });
    expect(called).toHaveBeenCalledTimes(1);
  });

  it("isolates errors — one plugin failure does not stop others", async () => {
    const order: string[] = [];
    const plugins: NoxionPlugin[] = [
      {
        name: "crasher",
        onBuildStart: () => {
          throw new Error("boom");
        },
      },
      {
        name: "survivor",
        onBuildStart: () => {
          order.push("survivor");
        },
      },
    ];

    await executeHook(plugins, "onBuildStart", { config: stubConfig });
    expect(order).toEqual(["survivor"]);
  });

  it("handles empty plugin array", async () => {
    await executeHook([], "onBuildStart", { config: stubConfig });
  });
});

describe("executeTransformHook", () => {
  it("chains transformations — output of A becomes input of B", () => {
    const plugins: NoxionPlugin[] = [
      {
        name: "add-tag",
        transformPosts: ({ posts }) =>
          posts.map((p) => ({ ...p, tags: [...p.tags, "added-by-a"] })),
      },
      {
        name: "add-another-tag",
        transformPosts: ({ posts }) =>
          posts.map((p) => ({ ...p, tags: [...p.tags, "added-by-b"] })),
      },
    ];

    const initial: BlogPost[] = [
      {
        id: "1",
        title: "Test",
        slug: "test",
        date: "2024-01-01",
        tags: ["original"],
        published: true,
        lastEditedTime: "2024-01-01T00:00:00.000Z",
      },
    ];

    const result = executeTransformHook(plugins, "transformPosts", initial, {});
    expect(result[0].tags).toEqual(["original", "added-by-a", "added-by-b"]);
  });

  it("preserves previous value when a plugin throws", () => {
    const plugins: NoxionPlugin[] = [
      {
        name: "good",
        transformPosts: ({ posts }) =>
          posts.map((p) => ({ ...p, tags: [...p.tags, "good"] })),
      },
      {
        name: "bad",
        transformPosts: () => {
          throw new Error("crash");
        },
      },
      {
        name: "also-good",
        transformPosts: ({ posts }) =>
          posts.map((p) => ({ ...p, tags: [...p.tags, "also-good"] })),
      },
    ];

    const initial: BlogPost[] = [
      {
        id: "1",
        title: "Test",
        slug: "test",
        date: "2024-01-01",
        tags: [],
        published: true,
        lastEditedTime: "2024-01-01T00:00:00.000Z",
      },
    ];

    const result = executeTransformHook(plugins, "transformPosts", initial, {});
    expect(result[0].tags).toEqual(["good", "also-good"]);
  });

  it("skips plugins without the transform hook", () => {
    const plugins: NoxionPlugin[] = [
      { name: "no-hook" },
      {
        name: "has-hook",
        transformPosts: ({ posts }) =>
          posts.map((p) => ({ ...p, tags: ["transformed"] })),
      },
    ];

    const initial: BlogPost[] = [
      {
        id: "1",
        title: "Test",
        slug: "test",
        date: "2024-01-01",
        tags: [],
        published: true,
        lastEditedTime: "2024-01-01T00:00:00.000Z",
      },
    ];

    const result = executeTransformHook(plugins, "transformPosts", initial, {});
    expect(result[0].tags).toEqual(["transformed"]);
  });

  it("returns initial value when no plugins have the hook", () => {
    const plugins: NoxionPlugin[] = [{ name: "nothing" }];
    const initial: BlogPost[] = [
      {
        id: "1",
        title: "Test",
        slug: "test",
        date: "2024-01-01",
        tags: ["unchanged"],
        published: true,
        lastEditedTime: "2024-01-01T00:00:00.000Z",
      },
    ];

    const result = executeTransformHook(plugins, "transformPosts", initial, {});
    expect(result[0].tags).toEqual(["unchanged"]);
  });

  it("chains extendMetadata correctly", () => {
    const plugins: NoxionPlugin[] = [
      {
        name: "og-plugin",
        extendMetadata: ({ metadata }) => ({
          ...metadata,
          openGraph: { type: "article" },
        }),
      },
      {
        name: "twitter-plugin",
        extendMetadata: ({ metadata }) => ({
          ...metadata,
          twitter: { card: "summary_large_image" },
        }),
      },
    ];

    const initial: NoxionMetadata = {
      title: "Test",
      description: "Test desc",
    };

    const result = executeTransformHook(plugins, "extendMetadata", initial, {
      config: stubConfig,
    });
    expect(result.openGraph).toEqual({ type: "article" });
    expect(result.twitter).toEqual({ card: "summary_large_image" });
  });
});
