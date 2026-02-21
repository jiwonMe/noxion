import { describe, it, expect } from "bun:test";
import { createAnalyticsPlugin } from "../../plugins/analytics";
import type { NoxionConfig } from "../../types";

const stubConfig: NoxionConfig = {
  rootNotionPageId: "test",
  name: "Test",
  domain: "test.com",
  author: "Test",
  description: "Test",
  language: "en",
  defaultTheme: "system",
  revalidate: 3600,
};

describe("createAnalyticsPlugin", () => {
  it("has correct plugin name", () => {
    const plugin = createAnalyticsPlugin({ provider: "google", trackingId: "G-TEST" });
    expect(plugin.name).toBe("noxion-plugin-analytics");
  });

  it("generates Google Analytics script tags", () => {
    const plugin = createAnalyticsPlugin({ provider: "google", trackingId: "G-12345" });
    const tags = plugin.injectHead!({ config: stubConfig });
    expect(tags.length).toBeGreaterThanOrEqual(1);
    const scriptTag = tags.find((t) => t.attributes?.src?.includes("googletagmanager"));
    expect(scriptTag).toBeDefined();
    expect(scriptTag!.attributes!.src).toContain("G-12345");
  });

  it("generates Plausible script tag", () => {
    const plugin = createAnalyticsPlugin({ provider: "plausible", trackingId: "test.com" });
    const tags = plugin.injectHead!({ config: stubConfig });
    expect(tags.length).toBeGreaterThanOrEqual(1);
    const scriptTag = tags.find((t) => t.attributes?.src?.includes("plausible"));
    expect(scriptTag).toBeDefined();
    expect(scriptTag!.attributes!["data-domain"]).toBe("test.com");
  });

  it("generates Umami script tag", () => {
    const plugin = createAnalyticsPlugin({ provider: "umami", trackingId: "abc-123" });
    const tags = plugin.injectHead!({ config: stubConfig });
    expect(tags.length).toBeGreaterThanOrEqual(1);
    const scriptTag = tags.find((t) => t.attributes?.src?.includes("umami"));
    expect(scriptTag).toBeDefined();
    expect(scriptTag!.attributes!["data-website-id"]).toBe("abc-123");
  });

  it("generates custom script tag", () => {
    const plugin = createAnalyticsPlugin({
      provider: "custom",
      trackingId: "",
      customScript: "https://my-analytics.com/script.js",
    });
    const tags = plugin.injectHead!({ config: stubConfig });
    expect(tags.length).toBe(1);
    expect(tags[0].attributes!.src).toBe("https://my-analytics.com/script.js");
  });
});
