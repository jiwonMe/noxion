import type { ExtendedRecordMap } from "notion-types";
import type { PluginConfigEntry } from "./plugin";

export type { ExtendedRecordMap } from "notion-types";

export type ThemeMode = "system" | "light" | "dark";

export type NoxionLayout = "single-column" | "sidebar-left" | "sidebar-right";

export interface NoxionConfig {
  rootNotionPageId?: string;
  rootNotionSpaceId?: string;
  name: string;
  domain: string;
  author: string;
  description: string;
  language: string;
  defaultTheme: ThemeMode;
  defaultPageType: string;
  revalidate: number;
  revalidateSecret?: string;
  plugins?: PluginConfig[];
  theme?: NoxionThemeConfig;
  layout?: NoxionLayout;
  components?: ComponentOverrides;
  collections?: NoxionCollection[];
}

export interface NoxionConfigInput {
  rootNotionPageId?: string;
  rootNotionSpaceId?: string;
  name: string;
  domain: string;
  author: string;
  description: string;
  language?: string;
  defaultTheme?: ThemeMode;
  defaultPageType?: string;
  revalidate?: number;
  revalidateSecret?: string;
  plugins?: PluginConfig[];
  theme?: NoxionThemeConfig;
  layout?: NoxionLayout;
  components?: ComponentOverrides;
  collections?: NoxionCollection[];
}

/**
 * Generic page interface that supports multiple content types (blog, docs, portfolio, etc.)
 * Replaces the blog-specific BlogPost interface with a more flexible structure.
 */
export interface NoxionPage {
  /** Unique identifier from Notion */
  id: string;
  /** Page title */
  title: string;
  /** URL slug */
  slug: string;
  /** Page type discriminator (blog, docs, portfolio, or custom) */
  pageType: string;
  /** Publication status */
  published: boolean;
  /** Last edited timestamp (ISO 8601) */
  lastEditedTime: string;
  /** Cover image URL */
  coverImage?: string;
  /** Page description/excerpt */
  description?: string;
  
  /** Type-specific metadata (e.g., blog: {date, tags, category}, docs: {section, order}) */
  metadata: Record<string, unknown>;
  /** Frontmatter overrides from Notion code blocks */
  frontmatter?: Record<string, string>;
  
  /** Parent page ID (for hierarchical structures like docs) */
  parent?: string;
  /** Child page IDs (for hierarchical structures) */
  children?: string[];
  /** Sort order within parent (for docs navigation) */
  order?: number;
}

/**
 * Blog page type with blog-specific metadata
 */
export interface BlogPage extends NoxionPage {
  pageType: 'blog';
  metadata: {
    /** Publication date */
    date: string;
    /** Post tags */
    tags: string[];
    /** Post category */
    category?: string;
    /** Post author */
    author?: string;
  };
}

/**
 * Documentation page type with docs-specific metadata
 */
export interface DocsPage extends NoxionPage {
  pageType: 'docs';
  metadata: {
    /** Documentation section/group */
    section?: string;
    /** Documentation version */
    version?: string;
    /** Edit URL for "Edit this page" links */
    editUrl?: string;
  };
}

/**
 * Portfolio project page type with portfolio-specific metadata
 */
export interface PortfolioPage extends NoxionPage {
  pageType: 'portfolio';
  metadata: {
    /** Project URL/demo link */
    projectUrl?: string;
    /** Technologies/stack used */
    technologies?: string[];
    /** Project year */
    year?: string;
    /** Featured project flag */
    featured?: boolean;
  };
}

/**
 * @deprecated Use BlogPage instead. BlogPost is kept for backward compatibility.
 * Will be removed in v0.3.0.
 */
export type BlogPost = BlogPage;

/**
 * Type guard to check if a page is a blog page
 */
export function isBlogPage(page: NoxionPage): page is BlogPage {
  return page.pageType === 'blog';
}

/**
 * Type guard to check if a page is a docs page
 */
export function isDocsPage(page: NoxionPage): page is DocsPage {
  return page.pageType === 'docs';
}

/**
 * Type guard to check if a page is a portfolio page
 */
export function isPortfolioPage(page: NoxionPage): page is PortfolioPage {
  return page.pageType === 'portfolio';
}

/**
 * Schema conventions for automatic Notion property mapping
 */
export interface SchemaConventions {
  /** Property names that map to this field (e.g., ['date', 'published'] for date field) */
  [fieldName: string]: {
    names: string[];
    type?: string;
  };
}

/**
 * Page type definition for plugin-registered custom page types
 */
export interface PageTypeDefinition {
  /** Page type identifier (e.g., 'gallery', 'wiki') */
  name: string;
  /** Schema conventions for automatic property mapping */
  schemaConventions?: SchemaConventions;
  /** Default template name for this page type */
  defaultTemplate?: string;
  /** Default layout name for this page type */
  defaultLayout?: string;
  /** URL pattern generator function */
  routes?: (page: NoxionPage) => string;
  /** Sort configuration for collection pages */
  sortBy?: { field: string; order: 'asc' | 'desc' };
  /** Sitemap configuration */
  sitemapConfig?: { priority: number; changefreq: 'daily' | 'weekly' | 'monthly' };
  /** Structured data type for JSON-LD (e.g., 'BlogPosting', 'TechArticle', 'CreativeWork') */
  structuredDataType?: string;
  /** Metadata configuration */
  metadataConfig?: { openGraphType: 'article' | 'website' };
}

/**
 * Collection configuration for multi-database support
 */
export interface NoxionCollection {
  /** Human-readable name for this collection */
  name?: string;
  /** Notion database ID */
  databaseId: string;
  /** Page type for all pages in this collection */
  pageType: string;
  /** URL path prefix (e.g., '/docs', '/projects') */
  pathPrefix?: string;
  /** Optional schema overrides (field name → Notion property name) */
  schema?: Record<string, string>;
}

export interface NoxionPageData {
  recordMap: ExtendedRecordMap;
  post: NoxionPage;
}

export type PluginConfig = PluginConfigEntry;

export interface NoxionThemeConfig {
  /**
   * Name of the theme package to use (e.g. "@noxion/theme-default").
   * Used with the new NoxionThemeContract API.
   */
  themeContract?: string;
  /** @deprecated Use `themeContract` with a NoxionThemeContract-based theme instead. */
  themePackage?: string;
  /**
   * @deprecated CSS token overrides. Use vanilla-extract + Tailwind CSS variables in
   * your theme's `.css.ts` files instead.
   */
  tokens?: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
    spacing?: Record<string, string>;
    shadows?: Record<string, string>;
    transitions?: Record<string, string>;
    breakpoints?: Record<string, string>;
    borderRadius?: string;
  };
  /**
   * @deprecated Use the theme's layout `slots` prop or NoxionThemeContract instead.
   */
  slots?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/**
 * @deprecated Use NoxionThemeContract (from @noxion/renderer) to provide components
 * through a typed theme contract instead of loose overrides.
 */
export interface ComponentOverrides {
  Header?: unknown;
  Footer?: unknown;
  PostCard?: unknown;
  PostList?: unknown;
  NotionPage?: unknown;
  TOC?: unknown;
  Search?: unknown;
  TagFilter?: unknown;
  NotionBlock?: Record<string, unknown>;
  [key: string]: unknown;
}
