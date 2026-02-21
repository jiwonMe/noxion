import type { ComponentType } from "react";

export interface NoxionThemeColors {
  primary: string;
  primaryForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  accent: string;
  accentForeground: string;
  card: string;
  cardForeground: string;
  [key: string]: string;
}

export interface NoxionThemeFonts {
  sans?: string;
  serif?: string;
  mono?: string;
  display?: string;
}

export interface NoxionThemeSpacing {
  content: string;
  sidebar: string;
}

export interface NoxionTheme {
  name: string;
  colors: NoxionThemeColors;
  fonts?: NoxionThemeFonts;
  spacing?: NoxionThemeSpacing;
  borderRadius?: string;
  dark?: Partial<Omit<NoxionTheme, "name" | "dark">>;
}

export interface HeaderProps {
  siteName: string;
  navigation?: { label: string; href: string }[];
}

export interface FooterProps {
  siteName: string;
  author?: string;
}

export interface PostCardProps {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  coverImage?: string;
  category?: string;
  description?: string;
  author?: string;
}

export interface PostListProps {
  posts: PostCardProps[];
}

export interface NotionPageProps {
  recordMap: unknown;
  rootPageId?: string;
}

export interface TOCProps {
  headings: { id: string; text: string; level: number }[];
}

export interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

export interface ComponentOverrides {
  Header?: ComponentType<HeaderProps>;
  Footer?: ComponentType<FooterProps>;
  PostCard?: ComponentType<PostCardProps>;
  PostList?: ComponentType<PostListProps>;
  NotionPage?: ComponentType<NotionPageProps>;
  TOC?: ComponentType<TOCProps>;
  Search?: ComponentType<SearchProps>;
  TagFilter?: ComponentType<TagFilterProps>;
  NotionBlock?: Record<string, ComponentType<unknown>>;
}

export type NoxionLayout = "single-column" | "sidebar-left" | "sidebar-right";
