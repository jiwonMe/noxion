import type { NoxionConfig, NoxionConfigInput } from "./types";

const DEFAULTS: Pick<NoxionConfig, "language" | "defaultTheme" | "revalidate"> =
  {
    language: "en",
    defaultTheme: "system",
    revalidate: 3600,
  };

export function defineConfig(config: NoxionConfigInput): NoxionConfigInput {
  return config;
}

export function loadConfig(input: NoxionConfigInput): NoxionConfig {
  if (!input.rootNotionPageId) {
    throw new Error("rootNotionPageId is required");
  }
  if (!input.name) {
    throw new Error("name is required");
  }
  if (!input.domain) {
    throw new Error("domain is required");
  }

  return {
    ...DEFAULTS,
    ...input,
    language: input.language ?? DEFAULTS.language,
    defaultTheme: input.defaultTheme ?? DEFAULTS.defaultTheme,
    revalidate: input.revalidate ?? DEFAULTS.revalidate,
  };
}
