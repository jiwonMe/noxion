import type { ExtendedRecordMap } from "notion-types";
import type { PluginConfigEntry } from "./plugin";

export type { ExtendedRecordMap } from "notion-types";

export type ThemeMode = "system" | "light" | "dark";

export type NoxionLayout = "single-column" | "sidebar-left" | "sidebar-right";

export interface NoxionConfig {
  rootNotionPageId: string;
  rootNotionSpaceId?: string;
  name: string;
  domain: string;
  author: string;
  description: string;
  language: string;
  defaultTheme: ThemeMode;
  revalidate: number;
  revalidateSecret?: string;
  plugins?: PluginConfig[];
  theme?: NoxionThemeConfig;
  layout?: NoxionLayout;
  components?: ComponentOverrides;
}

export interface NoxionConfigInput {
  rootNotionPageId: string;
  rootNotionSpaceId?: string;
  name: string;
  domain: string;
  author: string;
  description: string;
  language?: string;
  defaultTheme?: ThemeMode;
  revalidate?: number;
  revalidateSecret?: string;
  plugins?: PluginConfig[];
  theme?: NoxionThemeConfig;
  layout?: NoxionLayout;
  components?: ComponentOverrides;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  category?: string;
  coverImage?: string;
  description?: string;
  author?: string;
  published: boolean;
  lastEditedTime: string;
  frontmatter?: Record<string, string>;
}

export interface NoxionPageData {
  recordMap: ExtendedRecordMap;
  post: BlogPost;
}

export type PluginConfig = PluginConfigEntry;

export interface NoxionThemeConfig {
  themePackage?: string;
  tokens?: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
    spacing?: Record<string, string>;
    shadows?: Record<string, string>;
    transitions?: Record<string, string>;
    breakpoints?: Record<string, string>;
    borderRadius?: string;
  };
  slots?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

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
