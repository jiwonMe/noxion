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
  },
  {
    name: "docs",
    defaultTemplate: "docs/page",
    defaultLayout: "sidebar-left",
  },
  {
    name: "portfolio",
    defaultTemplate: "portfolio/project",
    defaultLayout: "single-column",
  },
];

export function createPageTypeRegistry(): PageTypeRegistry {
  const registry = new PageTypeRegistry();
  for (const definition of BUILTIN_PAGE_TYPES) {
    registry.register(definition);
  }
  return registry;
}
