import { loadConfig } from "@noxion/core";
import type { NoxionConfig } from "@noxion/core";
import noxionConfigInput from "../noxion.config";

function createConfig(): NoxionConfig {
  try {
    return loadConfig(noxionConfigInput);
  } catch {
    return {
      name: noxionConfigInput.name ?? "{{SITE_NAME}}",
      domain: noxionConfigInput.domain ?? "{{DOMAIN}}",
      author: noxionConfigInput.author ?? "{{AUTHOR}}",
      description: noxionConfigInput.description ?? "{{SITE_DESCRIPTION}}",
      language: noxionConfigInput.language ?? "en",
      defaultTheme: noxionConfigInput.defaultTheme ?? "system",
      defaultPageType: "docs",
      revalidate: noxionConfigInput.revalidate ?? 3600,
      plugins: noxionConfigInput.plugins,
      collections: noxionConfigInput.collections,
    };
  }
}

export const siteConfig = createConfig();
