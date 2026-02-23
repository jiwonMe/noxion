import type { NoxionConfig, NoxionPlugin } from "@noxion/core";

export function createTestConfig(overrides: Partial<NoxionConfig> = {}): NoxionConfig {
  return {
    rootNotionPageId: "test-root-page-id",
    name: "Test Site",
    domain: "test.example.com",
    author: "Test Author",
    description: "A test site for plugin development",
    language: "en",
    defaultTheme: "system",
    defaultPageType: "blog",
    revalidate: 3600,
    ...overrides,
  };
}

export function createTestPlugin(overrides: Partial<NoxionPlugin> = {}): NoxionPlugin {
  return {
    name: overrides.name ?? "test-plugin",
    ...overrides,
  };
}
