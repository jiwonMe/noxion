import type { CollectionPropertySchemaMap } from "notion-types";
import type { PageTypeRegistry } from "./page-type-registry";

export interface PropertyMapping {
  titleKey: string | null;
  slugKey: string | null;
  publishedKey: string | null;
  descriptionKey: string | null;
  coverKey: string | null;
  authorKey: string | null;
  dateKey: string | null;
  typeKey: string | null;
  metadataKeys: Record<string, string>;
}

interface FieldConvention {
  names: string[];
  notionType?: string;
  dateTypes?: boolean;
}

type BaseKey = "titleKey" | "slugKey" | "publishedKey" | "descriptionKey" | "coverKey" | "authorKey" | "dateKey" | "typeKey";

const BASE_CONVENTIONS: Record<string, FieldConvention> = {
  slug: { names: ["slug"] },
  published: { names: ["public", "published"], notionType: "checkbox" },
  description: { names: ["description"] },
  cover: { names: ["cover"] },
  author: { names: ["author"] },
};

const DATE_CONVENTION: FieldConvention = {
  names: ["date", "published"],
  dateTypes: true,
};

const METADATA_CONVENTIONS: Record<string, Record<string, FieldConvention>> = {
  blog: {
    tags: { names: ["tags"] },
    category: { names: ["category"] },
  },
  docs: {
    section: { names: ["section", "group"] },
    order: { names: ["order", "sort", "position"] },
    version: { names: ["version"] },
  },
  portfolio: {
    technologies: { names: ["technologies", "tech", "stack"] },
    projectUrl: { names: ["url", "project url", "demo", "link", "projecturl"] },
    year: { names: ["year"] },
    featured: { names: ["featured"], notionType: "checkbox" },
  },
};

export function getMetadataConventions(
  pageType: string,
  registry?: PageTypeRegistry
): Record<string, FieldConvention> {
  if (registry) {
    const definition = registry.get(pageType);
    if (definition?.schemaConventions) {
      const conventions: Record<string, FieldConvention> = {};
      for (const [field, config] of Object.entries(definition.schemaConventions)) {
        conventions[field] = {
          names: config.names,
          notionType: config.type,
        };
      }
      return conventions;
    }
  }
  
  return METADATA_CONVENTIONS[pageType] ?? {};
}

function matchBaseField(
  mapping: PropertyMapping,
  field: BaseKey,
  convention: FieldConvention,
  schemaKey: string,
  propertyName: string,
  propertyType: string,
): void {
  if (mapping[field] !== null) return;
  if (convention.notionType && propertyType !== convention.notionType) return;
  if (convention.names.includes(propertyName)) {
    mapping[field] = schemaKey;
  }
}

function applyOverrides(mapping: PropertyMapping, overrides: Record<string, string>): void {
  for (const [field, notionKey] of Object.entries(overrides)) {
    switch (`${field}Key`) {
      case "titleKey": mapping.titleKey = notionKey; break;
      case "slugKey": mapping.slugKey = notionKey; break;
      case "publishedKey": mapping.publishedKey = notionKey; break;
      case "descriptionKey": mapping.descriptionKey = notionKey; break;
      case "coverKey": mapping.coverKey = notionKey; break;
      case "authorKey": mapping.authorKey = notionKey; break;
      case "dateKey": mapping.dateKey = notionKey; break;
      case "typeKey": mapping.typeKey = notionKey; break;
      default: mapping.metadataKeys[field] = notionKey;
    }
  }
}

export function buildPropertyMapping(
  schema: CollectionPropertySchemaMap,
  pageType: string,
  overrides?: Record<string, string>,
  registry?: PageTypeRegistry,
): PropertyMapping {
  const mapping: PropertyMapping = {
    titleKey: null,
    slugKey: null,
    publishedKey: null,
    descriptionKey: null,
    coverKey: null,
    authorKey: null,
    dateKey: null,
    typeKey: null,
    metadataKeys: {},
  };

  const metadataConventions = getMetadataConventions(pageType, registry);

  for (const [key, value] of Object.entries(schema)) {
    const name = value.name?.toLowerCase();

    if (value.type === "title") {
      mapping.titleKey = key;
      continue;
    }

    if (name === "type" && value.type === "select") {
      mapping.typeKey = key;
    }

    if (
      !mapping.dateKey &&
      DATE_CONVENTION.names.includes(name) &&
      (value.type === "date" || value.type === "last_edited_time")
    ) {
      mapping.dateKey = key;
    }

    matchBaseField(mapping, "slugKey", BASE_CONVENTIONS.slug, key, name, value.type);
    matchBaseField(mapping, "publishedKey", BASE_CONVENTIONS.published, key, name, value.type);
    matchBaseField(mapping, "descriptionKey", BASE_CONVENTIONS.description, key, name, value.type);
    matchBaseField(mapping, "coverKey", BASE_CONVENTIONS.cover, key, name, value.type);
    matchBaseField(mapping, "authorKey", BASE_CONVENTIONS.author, key, name, value.type);

    for (const [field, convention] of Object.entries(metadataConventions)) {
      if (mapping.metadataKeys[field]) continue;
      if (convention.notionType && value.type !== convention.notionType) continue;
      if (convention.dateTypes && value.type !== "date" && value.type !== "last_edited_time") continue;
      if (convention.names.includes(name)) {
        mapping.metadataKeys[field] = key;
      }
    }
  }

  if (overrides) {
    applyOverrides(mapping, overrides);
  }

  return mapping;
}
