export interface NoxionPluginManifest {
  /** Plugin display name (human-readable) */
  name: string;
  /** Short description of what the plugin does */
  description: string;
  /** Plugin version (semver) */
  version: string;
  /** Noxion core version compatibility range (e.g. ">=0.2.0") */
  noxion: string;
  /** Plugin author */
  author?: string;
  /** Plugin homepage or repository URL */
  homepage?: string;
  /** License identifier (SPDX) */
  license?: string;

  /** Which hooks this plugin implements */
  hooks?: string[];
  /** Page types this plugin is designed for (empty = all) */
  pageTypes?: string[];
  /** Whether the plugin accepts configuration options */
  hasConfig?: boolean;

  /** Keywords for discoverability */
  keywords?: string[];
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const pluginManifestSchema = {
  type: "object" as const,
  required: ["name", "description", "version", "noxion"],
  properties: {
    name: { type: "string", description: "Plugin display name" },
    description: { type: "string", description: "Short plugin description" },
    version: { type: "string", description: "Plugin version (semver)" },
    noxion: { type: "string", description: "Noxion core compatibility range" },
    author: { type: "string", description: "Plugin author" },
    homepage: { type: "string", description: "Homepage or repository URL" },
    license: { type: "string", description: "SPDX license identifier" },
    hooks: {
      type: "array",
      items: { type: "string" },
      description: "Hooks this plugin implements",
    },
    pageTypes: {
      type: "array",
      items: { type: "string" },
      description: "Page types this plugin targets",
    },
    hasConfig: { type: "boolean", description: "Whether the plugin accepts config options" },
    keywords: {
      type: "array",
      items: { type: "string" },
      description: "Discoverability keywords",
    },
  },
} as const;

export function validatePluginManifest(manifest: unknown): ValidationResult {
  const errors: string[] = [];

  if (manifest === null || typeof manifest !== "object") {
    return { valid: false, errors: ["Manifest must be a non-null object"] };
  }

  const obj = manifest as Record<string, unknown>;

  for (const field of pluginManifestSchema.required) {
    if (!(field in obj) || typeof obj[field] !== "string" || (obj[field] as string).trim() === "") {
      errors.push(`Missing or empty required field: "${field}"`);
    }
  }

  if ("author" in obj && obj.author !== undefined && typeof obj.author !== "string") {
    errors.push(`"author" must be a string`);
  }
  if ("homepage" in obj && obj.homepage !== undefined && typeof obj.homepage !== "string") {
    errors.push(`"homepage" must be a string`);
  }
  if ("license" in obj && obj.license !== undefined && typeof obj.license !== "string") {
    errors.push(`"license" must be a string`);
  }
  if ("hasConfig" in obj && obj.hasConfig !== undefined && typeof obj.hasConfig !== "boolean") {
    errors.push(`"hasConfig" must be a boolean`);
  }

  if ("hooks" in obj && obj.hooks !== undefined) {
    if (!Array.isArray(obj.hooks)) {
      errors.push(`"hooks" must be an array of strings`);
    } else if (!obj.hooks.every((h: unknown) => typeof h === "string")) {
      errors.push(`"hooks" must contain only strings`);
    }
  }
  if ("pageTypes" in obj && obj.pageTypes !== undefined) {
    if (!Array.isArray(obj.pageTypes)) {
      errors.push(`"pageTypes" must be an array of strings`);
    } else if (!obj.pageTypes.every((p: unknown) => typeof p === "string")) {
      errors.push(`"pageTypes" must contain only strings`);
    }
  }
  if ("keywords" in obj && obj.keywords !== undefined) {
    if (!Array.isArray(obj.keywords)) {
      errors.push(`"keywords" must be an array of strings`);
    } else if (!obj.keywords.every((k: unknown) => typeof k === "string")) {
      errors.push(`"keywords" must contain only strings`);
    }
  }

  return { valid: errors.length === 0, errors };
}
