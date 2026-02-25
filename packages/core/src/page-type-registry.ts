import type { PageTypeDefinition } from "./types";

export class PageTypeRegistry {
  private definitions = new Map<string, PageTypeDefinition>();

  register(definition: PageTypeDefinition): void {
    if (this.definitions.has(definition.name)) {
      console.warn(`[noxion] Page type "${definition.name}" is already registered, overwriting.`);
    }
    this.definitions.set(definition.name, definition);
  }

  get(name: string): PageTypeDefinition | undefined {
    return this.definitions.get(name);
  }

  has(name: string): boolean {
    return this.definitions.has(name);
  }

  getAll(): PageTypeDefinition[] {
    return [...this.definitions.values()];
  }

  names(): string[] {
    return [...this.definitions.keys()];
  }
}

const BUILTIN_PAGE_TYPES: PageTypeDefinition[] = [
  {
    name: "blog",
    defaultTemplate: "blog/post",
    defaultLayout: "single-column",
    sortBy: { field: "date", order: "desc" },
    sitemapConfig: { priority: 0.8, changefreq: "weekly" },
    structuredDataType: "BlogPosting",
    metadataConfig: { openGraphType: "article" },
    schemaConventions: {
      tags: { names: ["tags"] },
      category: { names: ["category"] },
    },
  },
  {
    name: "docs",
    defaultTemplate: "docs/page",
    defaultLayout: "sidebar-left",
    sitemapConfig: { priority: 0.7, changefreq: "weekly" },
    structuredDataType: "TechArticle",
    metadataConfig: { openGraphType: "website" },
    schemaConventions: {
      section: { names: ["section", "group"] },
      order: { names: ["order", "sort", "position"] },
      version: { names: ["version"] },
    },
  },
  {
    name: "portfolio",
    defaultTemplate: "portfolio/project",
    defaultLayout: "single-column",
    sitemapConfig: { priority: 0.6, changefreq: "monthly" },
    structuredDataType: "CreativeWork",
    metadataConfig: { openGraphType: "website" },
    schemaConventions: {
      technologies: { names: ["technologies", "tech", "stack"] },
      projectUrl: { names: ["url", "project url", "demo", "link", "projecturl"] },
      year: { names: ["year"] },
      featured: { names: ["featured"], type: "checkbox" },
    },
  },
];

export function createPageTypeRegistry(): PageTypeRegistry {
  const registry = new PageTypeRegistry();
  for (const definition of BUILTIN_PAGE_TYPES) {
    registry.register(definition);
  }
  return registry;
}
