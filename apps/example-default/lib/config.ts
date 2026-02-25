import { loadConfig } from "@noxion/core";
import type { NoxionConfig } from "@noxion/core";
import noxionConfigInput from "../noxion.config";

function createConfig(): NoxionConfig {
  try {
    return loadConfig(noxionConfigInput);
  } catch {
    return {
      rootNotionPageId: noxionConfigInput.rootNotionPageId ?? "",
      name: noxionConfigInput.name ?? "Noxion Default Theme Example",
      domain: noxionConfigInput.domain ?? "localhost:3100",
      author: noxionConfigInput.author ?? "Noxion",
      description:
        noxionConfigInput.description ?? "A blog powered by Noxion",
      language: noxionConfigInput.language ?? "en",
      defaultTheme: noxionConfigInput.defaultTheme ?? "system",
      defaultPageType: noxionConfigInput.defaultPageType ?? "blog",
      revalidate: noxionConfigInput.revalidate ?? 3600,
      plugins: noxionConfigInput.plugins,
    };
  }
}

export const siteConfig = createConfig();
