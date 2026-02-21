import type { ExtendedRecordMap } from "notion-types";
import type { BlogPost, NoxionConfig } from "./types";

export interface HeadTag {
  tagName: string;
  attributes?: Record<string, string>;
  innerHTML?: string;
}

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export interface RouteInfo {
  path: string;
  component?: string;
  exact?: boolean;
  metadata?: Record<string, unknown>;
}

export interface NoxionMetadata {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: Record<string, string>;
  twitter?: Record<string, string>;
  [key: string]: unknown;
}

export interface PluginActions {
  addRoute: (route: RouteInfo) => void;
  setGlobalData: (key: string, data: unknown) => void;
  getGlobalData: (pluginName: string, key: string) => unknown;
}

export type AllContent = Record<string, unknown>;

export interface NoxionPlugin<Content = unknown> {
  name: string;

  loadContent?: () => Promise<Content> | Content;
  contentLoaded?: (args: { content: Content; actions: PluginActions }) => Promise<void> | void;
  allContentLoaded?: (args: { allContent: AllContent; actions: PluginActions }) => Promise<void> | void;

  onBuildStart?: (args: { config: NoxionConfig }) => Promise<void> | void;
  postBuild?: (args: { config: NoxionConfig; routes: RouteInfo[] }) => Promise<void> | void;

  transformContent?: (args: { recordMap: ExtendedRecordMap; post: BlogPost }) => ExtendedRecordMap;
  transformPosts?: (args: { posts: BlogPost[] }) => BlogPost[];

  extendMetadata?: (args: { metadata: NoxionMetadata; post?: BlogPost; config: NoxionConfig }) => NoxionMetadata;
  injectHead?: (args: { post?: BlogPost; config: NoxionConfig }) => HeadTag[];
  extendSitemap?: (args: { entries: SitemapEntry[]; config: NoxionConfig }) => SitemapEntry[];

  extendRoutes?: (args: { routes: RouteInfo[]; config: NoxionConfig }) => RouteInfo[];
}

export type PluginFactory<Options = unknown, Content = unknown> = (
  options: Options
) => NoxionPlugin<Content>;

export type PluginModule<Options = unknown, Content = unknown> =
  | NoxionPlugin<Content>
  | PluginFactory<Options, Content>;

export type PluginConfigEntry =
  | PluginModule
  | [PluginModule, unknown]
  | false;
