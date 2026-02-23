import { describe, it, expect, beforeEach } from "bun:test";
import {
  createMockBlogPages,
  createTestPlugin,
  resetMockCounter,
} from "@noxion/plugin-utils";
import { createPlugin } from "../index";

describe("noxion-plugin-{{PLUGIN_NAME}}", () => {
  beforeEach(() => {
    resetMockCounter();
  });

  it("has the correct name", () => {
    const plugin = createPlugin({});
    expect(plugin.name).toBe("noxion-plugin-{{PLUGIN_NAME}}");
  });

  it("passes posts through when enabled", () => {
    const plugin = createPlugin({ enabled: true });
    const posts = createMockBlogPages(3);
    const result = plugin.transformPosts!({ posts });
    expect(result).toHaveLength(3);
  });

  it("passes posts through when disabled", () => {
    const plugin = createPlugin({ enabled: false });
    const posts = createMockBlogPages(3);
    const result = plugin.transformPosts!({ posts });
    expect(result).toHaveLength(3);
  });

  it("works as a test plugin", () => {
    const plugin = createTestPlugin({
      name: "noxion-plugin-{{PLUGIN_NAME}}",
    });
    expect(plugin.name).toBe("noxion-plugin-{{PLUGIN_NAME}}");
  });
});
