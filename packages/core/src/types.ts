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

export type NoxionThemeConfig = unknown;

export type ComponentOverrides = unknown;
