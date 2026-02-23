import type { NoxionConfig, NoxionConfigInput, NoxionCollection } from "./types";

const DEFAULTS: Pick<NoxionConfig, "language" | "defaultTheme" | "defaultPageType" | "revalidate"> =
  {
    language: "en",
    defaultTheme: "system",
    defaultPageType: "blog",
    revalidate: 3600,
  };

export function defineConfig(config: NoxionConfigInput): NoxionConfigInput {
  return config;
}

export function loadConfig(input: NoxionConfigInput): NoxionConfig {
  const hasRootPage = !!input.rootNotionPageId;
  const hasCollections = !!input.collections && input.collections.length > 0;

  if (!hasRootPage && !hasCollections) {
    throw new Error("Config must have either rootNotionPageId or collections");
  }

  if (!input.name) {
    throw new Error("name is required");
  }
  if (!input.domain) {
    throw new Error("domain is required");
  }

  if (hasCollections) {
    validateCollections(input.collections!);
  }

  const defaultPageType = input.defaultPageType ?? DEFAULTS.defaultPageType;

  let collections = input.collections;
  if (hasRootPage && !hasCollections) {
    collections = [
      {
        name: "default",
        databaseId: input.rootNotionPageId!,
        pageType: defaultPageType,
      },
    ];
  }

  return {
    ...DEFAULTS,
    ...input,
    language: input.language ?? DEFAULTS.language,
    defaultTheme: input.defaultTheme ?? DEFAULTS.defaultTheme,
    defaultPageType,
    revalidate: input.revalidate ?? DEFAULTS.revalidate,
    collections,
  };
}

function validateCollections(collections: NoxionCollection[]): void {
  for (let i = 0; i < collections.length; i++) {
    const col = collections[i];
    const label = col.name ?? `collections[${i}]`;

    if (!col.databaseId) {
      throw new Error(`Collection "${label}" is missing databaseId`);
    }
    if (!col.pageType) {
      throw new Error(`Collection "${label}" is missing pageType`);
    }
  }
}
