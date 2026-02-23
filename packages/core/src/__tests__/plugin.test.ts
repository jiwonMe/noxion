import { describe, it, expect, mock } from "bun:test";
import { definePlugin, loadPlugins } from "../plugin-loader";
import { executeHook, executeTransformHook, executeRegisterPageTypes, executeRouteResolve, executeExtendSlots } from "../plugin-executor";
import type { NoxionPlugin, NoxionMetadata, RouteInfo, CLICommand } from "../plugin";
import type { NoxionConfig, BlogPost, PageTypeDefinition } from "../types";
import { PageTypeRegistry } from "../page-type-registry";

const stubConfig: NoxionConfig = {
  rootNotionPageId: "test-id",
  name: "Test",
  domain: "test.com",
  author: "Test",
  description: "Test site",
  language: "en",
  defaultTheme: "system",
  defaultPageType: "blog",
  revalidate: 3600,
};

function makeBlogPost(overrides: Partial<BlogPost> & { metadataOverrides?: Partial<BlogPost["metadata"]> } = {}): BlogPost {
  const { metadataOverrides, ...rest } = overrides;
  return {
    id: "1",
    title: "Test",
    slug: "test",
    pageType: "blog",
    published: true,
    lastEditedTime: "2024-01-01T00:00:00.000Z",
    metadata: {
      date: "2024-01-01",
      tags: [],
      ...metadataOverrides,
    },
    ...rest,
  };
}

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

  it("validates configSchema during loading and warns on invalid", () => {
    const warns: string[] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => warns.push(args.join(" "));

    const factory = definePlugin<{ apiKey: string }>((opts) => ({
      name: "validated",
      configSchema: {
        validate: (options: unknown) => {
          const o = options as { apiKey?: string } | undefined;
          if (!o?.apiKey) return { valid: false, errors: ["apiKey is required"] };
          return { valid: true };
        },
      },
    }));

    loadPlugins([[factory, {}]]);
    console.warn = originalWarn;

    expect(warns.some(w => w.includes("config validation failed"))).toBe(true);
  });

  it("does not warn for valid configSchema", () => {
    const warns: string[] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => warns.push(args.join(" "));

    const factory = definePlugin<{ apiKey: string }>((opts) => ({
      name: "valid-plugin",
      configSchema: {
        validate: () => ({ valid: true }),
      },
    }));

    loadPlugins([[factory, { apiKey: "abc" }]]);
    console.warn = originalWarn;

    expect(warns.some(w => w.includes("config validation failed"))).toBe(false);
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
          posts.map((p) => ({
            ...p,
            metadata: { ...p.metadata, tags: [...p.metadata.tags, "added-by-a"] },
          })),
      },
      {
        name: "add-another-tag",
        transformPosts: ({ posts }) =>
          posts.map((p) => ({
            ...p,
            metadata: { ...p.metadata, tags: [...p.metadata.tags, "added-by-b"] },
          })),
      },
    ];

    const initial: BlogPost[] = [
      makeBlogPost({ metadataOverrides: { tags: ["original"] } }),
    ];

    const result = executeTransformHook(plugins, "transformPosts", initial, {});
    expect(result[0].metadata.tags).toEqual(["original", "added-by-a", "added-by-b"]);
  });

  it("preserves previous value when a plugin throws", () => {
    const plugins: NoxionPlugin[] = [
      {
        name: "good",
        transformPosts: ({ posts }) =>
          posts.map((p) => ({
            ...p,
            metadata: { ...p.metadata, tags: [...p.metadata.tags, "good"] },
          })),
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
          posts.map((p) => ({
            ...p,
            metadata: { ...p.metadata, tags: [...p.metadata.tags, "also-good"] },
          })),
      },
    ];

    const initial: BlogPost[] = [makeBlogPost()];

    const result = executeTransformHook(plugins, "transformPosts", initial, {});
    expect(result[0].metadata.tags).toEqual(["good", "also-good"]);
  });

  it("skips plugins without the transform hook", () => {
    const plugins: NoxionPlugin[] = [
      { name: "no-hook" },
      {
        name: "has-hook",
        transformPosts: ({ posts }) =>
          posts.map((p) => ({
            ...p,
            metadata: { ...p.metadata, tags: ["transformed"] },
          })),
      },
    ];

    const initial: BlogPost[] = [makeBlogPost()];

    const result = executeTransformHook(plugins, "transformPosts", initial, {});
    expect(result[0].metadata.tags).toEqual(["transformed"]);
  });

  it("returns initial value when no plugins have the hook", () => {
    const plugins: NoxionPlugin[] = [{ name: "nothing" }];
    const initial: BlogPost[] = [
      makeBlogPost({ metadataOverrides: { tags: ["unchanged"] } }),
    ];

    const result = executeTransformHook(plugins, "transformPosts", initial, {});
    expect(result[0].metadata.tags).toEqual(["unchanged"]);
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

describe("New plugin hooks (v0.2)", () => {
  it("registerPageTypes hook returns PageTypeDefinition array", () => {
    const plugin: NoxionPlugin = {
      name: "gallery-plugin",
      registerPageTypes: () => [
        {
          name: "gallery",
          defaultTemplate: "gallery/grid",
          defaultLayout: "single-column",
        },
      ],
    };

    const pageTypes = plugin.registerPageTypes!();
    expect(pageTypes).toHaveLength(1);
    expect(pageTypes[0].name).toBe("gallery");
    expect(pageTypes[0].defaultTemplate).toBe("gallery/grid");
  });

  it("configSchema hook validates plugin options", () => {
    const plugin: NoxionPlugin = {
      name: "validated-plugin",
      configSchema: {
        validate: (options: unknown) => {
          const opts = options as { apiKey?: string };
          if (!opts.apiKey) {
            return { valid: false, errors: ["apiKey is required"] };
          }
          return { valid: true };
        },
      },
    };

    const validResult = plugin.configSchema!.validate({ apiKey: "abc123" });
    expect(validResult.valid).toBe(true);

    const invalidResult = plugin.configSchema!.validate({});
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.errors).toContain("apiKey is required");
  });

  it("onRouteResolve hook can modify or filter routes", () => {
    const plugin: NoxionPlugin = {
      name: "route-middleware",
      onRouteResolve: (route: RouteInfo) => {
        if (route.path.startsWith("/admin")) {
          return null;
        }
        return { ...route, metadata: { ...route.metadata, processed: true } };
      },
    };

    const publicRoute: RouteInfo = { path: "/blog/post" };
    const adminRoute: RouteInfo = { path: "/admin/dashboard" };

    const publicResult = plugin.onRouteResolve!(publicRoute);
    expect(publicResult).not.toBeNull();
    expect(publicResult!.metadata?.processed).toBe(true);

    const adminResult = plugin.onRouteResolve!(adminRoute);
    expect(adminResult).toBeNull();
  });

  it("extendSlots hook can add UI components to slots", () => {
    const plugin: NoxionPlugin = {
      name: "slot-extender",
      extendSlots: (slots: Record<string, unknown>) => ({
        ...slots,
        customSlot: { component: "CustomComponent" },
      }),
    };

    const initialSlots = { header: { component: "Header" } };
    const extended = plugin.extendSlots!(initialSlots);
    
    expect(extended.header).toEqual({ component: "Header" });
    expect(extended.customSlot).toEqual({ component: "CustomComponent" });
  });

  it("extendCLI hook returns CLI command definitions", () => {
    const plugin: NoxionPlugin = {
      name: "cli-plugin",
      extendCLI: () => [
        {
          name: "custom-command",
          description: "A custom CLI command",
          action: async () => {
            console.log("Command executed");
          },
        },
      ],
    };

    const commands = plugin.extendCLI!();
    expect(commands).toHaveLength(1);
    expect(commands[0].name).toBe("custom-command");
    expect(commands[0].description).toBe("A custom CLI command");
    expect(typeof commands[0].action).toBe("function");
  });

  it("all new hooks are optional (backward compatibility)", () => {
    const oldPlugin: NoxionPlugin = {
      name: "old-plugin",
      injectHead: () => [],
    };

    expect(oldPlugin.registerPageTypes).toBeUndefined();
    expect(oldPlugin.configSchema).toBeUndefined();
    expect(oldPlugin.onRouteResolve).toBeUndefined();
    expect(oldPlugin.extendSlots).toBeUndefined();
    expect(oldPlugin.extendCLI).toBeUndefined();
  });
});

describe("executeRegisterPageTypes", () => {
  it("collects page type definitions from plugins into registry", () => {
    const registry = new PageTypeRegistry();
    const plugins: NoxionPlugin[] = [
      {
        name: "gallery",
        registerPageTypes: () => [
          { name: "gallery", defaultTemplate: "gallery/grid" },
        ],
      },
      {
        name: "wiki",
        registerPageTypes: () => [
          { name: "wiki", defaultTemplate: "wiki/page" },
        ],
      },
    ];

    executeRegisterPageTypes(plugins, registry);

    expect(registry.has("gallery")).toBe(true);
    expect(registry.has("wiki")).toBe(true);
    expect(registry.getAll()).toHaveLength(2);
  });

  it("skips plugins without registerPageTypes hook", () => {
    const registry = new PageTypeRegistry();
    const plugins: NoxionPlugin[] = [
      { name: "no-hook" },
      { name: "has-hook", registerPageTypes: () => [{ name: "custom" }] },
    ];

    executeRegisterPageTypes(plugins, registry);

    expect(registry.getAll()).toHaveLength(1);
    expect(registry.has("custom")).toBe(true);
  });

  it("handles errors gracefully (warn, don't crash)", () => {
    const registry = new PageTypeRegistry();
    const plugins: NoxionPlugin[] = [
      {
        name: "crasher",
        registerPageTypes: () => { throw new Error("boom"); },
      },
      {
        name: "survivor",
        registerPageTypes: () => [{ name: "survived" }],
      },
    ];

    executeRegisterPageTypes(plugins, registry);

    expect(registry.has("survived")).toBe(true);
    expect(registry.getAll()).toHaveLength(1);
  });
});

describe("executeRouteResolve", () => {
  it("passes route through plugin middleware chain", () => {
    const plugins: NoxionPlugin[] = [
      {
        name: "add-meta",
        onRouteResolve: (route) => ({ ...route, metadata: { ...route.metadata, step1: true } }),
      },
      {
        name: "add-more-meta",
        onRouteResolve: (route) => ({ ...route, metadata: { ...route.metadata, step2: true } }),
      },
    ];

    const result = executeRouteResolve(plugins, { path: "/test" });

    expect(result).not.toBeNull();
    expect(result!.metadata?.step1).toBe(true);
    expect(result!.metadata?.step2).toBe(true);
  });

  it("stops chain when a plugin returns null", () => {
    const plugins: NoxionPlugin[] = [
      {
        name: "blocker",
        onRouteResolve: () => null,
      },
      {
        name: "never-reached",
        onRouteResolve: (route) => ({ ...route, metadata: { reached: true } }),
      },
    ];

    const result = executeRouteResolve(plugins, { path: "/blocked" });
    expect(result).toBeNull();
  });

  it("returns original route when no plugins have the hook", () => {
    const route: RouteInfo = { path: "/unchanged" };
    const result = executeRouteResolve([{ name: "no-hook" }], route);

    expect(result).toEqual(route);
  });

  it("handles plugin errors gracefully", () => {
    const plugins: NoxionPlugin[] = [
      {
        name: "crasher",
        onRouteResolve: () => { throw new Error("boom"); },
      },
      {
        name: "survivor",
        onRouteResolve: (route) => ({ ...route, metadata: { survived: true } }),
      },
    ];

    const result = executeRouteResolve(plugins, { path: "/test" });
    expect(result).not.toBeNull();
    expect(result!.metadata?.survived).toBe(true);
  });
});

describe("executeExtendSlots", () => {
  it("composes slots from multiple plugins", () => {
    const plugins: NoxionPlugin[] = [
      {
        name: "plugin-a",
        extendSlots: (slots) => ({ ...slots, slotA: "componentA" }),
      },
      {
        name: "plugin-b",
        extendSlots: (slots) => ({ ...slots, slotB: "componentB" }),
      },
    ];

    const result = executeExtendSlots(plugins, { existing: "header" });

    expect(result.existing).toBe("header");
    expect(result.slotA).toBe("componentA");
    expect(result.slotB).toBe("componentB");
  });

  it("later plugins can override earlier slots", () => {
    const plugins: NoxionPlugin[] = [
      {
        name: "original",
        extendSlots: (slots) => ({ ...slots, footer: "original-footer" }),
      },
      {
        name: "override",
        extendSlots: (slots) => ({ ...slots, footer: "custom-footer" }),
      },
    ];

    const result = executeExtendSlots(plugins, {});
    expect(result.footer).toBe("custom-footer");
  });

  it("handles plugin errors gracefully", () => {
    const plugins: NoxionPlugin[] = [
      {
        name: "crasher",
        extendSlots: () => { throw new Error("boom"); },
      },
      {
        name: "survivor",
        extendSlots: (slots) => ({ ...slots, survived: true }),
      },
    ];

    const result = executeExtendSlots(plugins, { initial: true });
    expect(result.initial).toBe(true);
    expect(result.survived).toBe(true);
  });
});
