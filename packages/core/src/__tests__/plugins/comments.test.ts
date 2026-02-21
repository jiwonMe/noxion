import { describe, it, expect } from "bun:test";
import { createCommentsPlugin } from "../../plugins/comments";
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

describe("createCommentsPlugin", () => {
  it("has correct plugin name", () => {
    const plugin = createCommentsPlugin({
      provider: "giscus",
      config: { repo: "user/repo", repoId: "R_1", category: "General", categoryId: "C_1" },
    });
    expect(plugin.name).toBe("noxion-plugin-comments");
  });

  it("generates Giscus script tag", () => {
    const plugin = createCommentsPlugin({
      provider: "giscus",
      config: { repo: "user/repo", repoId: "R_1", category: "General", categoryId: "C_1" },
    });
    const tags = plugin.injectHead!({ config: stubConfig });
    const script = tags.find((t) => t.attributes?.src?.includes("giscus"));
    expect(script).toBeDefined();
    expect(script!.attributes!["data-repo"]).toBe("user/repo");
  });

  it("generates Utterances script tag", () => {
    const plugin = createCommentsPlugin({
      provider: "utterances",
      config: { repo: "user/repo", issueTerm: "pathname" },
    });
    const tags = plugin.injectHead!({ config: stubConfig });
    const script = tags.find((t) => t.attributes?.src?.includes("utteranc.es"));
    expect(script).toBeDefined();
    expect(script!.attributes!.repo).toBe("user/repo");
  });

  it("generates Disqus script tag", () => {
    const plugin = createCommentsPlugin({
      provider: "disqus",
      config: { shortname: "mysite" },
    });
    const tags = plugin.injectHead!({ config: stubConfig });
    expect(tags.length).toBeGreaterThanOrEqual(1);
    const script = tags.find((t) => t.innerHTML?.includes("mysite"));
    expect(script).toBeDefined();
  });
});
