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

export interface NoxionThemeShadows {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  [key: string]: string | undefined;
}

export interface NoxionThemeTransitions {
  fast?: string;
  normal?: string;
  slow?: string;
  [key: string]: string | undefined;
}

export interface NoxionThemeBreakpoints {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  [key: string]: string | undefined;
}

export interface NoxionTheme {
  name: string;
  colors: NoxionThemeColors;
  fonts?: NoxionThemeFonts;
  spacing?: NoxionThemeSpacing;
  borderRadius?: string;
  dark?: Partial<Omit<NoxionTheme, "name" | "dark">>;
}

export interface NoxionThemeTokens extends NoxionTheme {
  shadows?: NoxionThemeShadows;
  transitions?: NoxionThemeTransitions;
  breakpoints?: NoxionThemeBreakpoints;
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
  maxVisible?: number;
}

export interface DocsSidebarItem {
  id: string;
  title: string;
  slug: string;
  level: number;
  children?: DocsSidebarItem[];
}

export interface DocsSidebarProps {
  items: DocsSidebarItem[];
  currentSlug?: string;
}

export interface DocsBreadcrumbItem {
  label: string;
  href?: string;
}

export interface DocsBreadcrumbProps {
  items: DocsBreadcrumbItem[];
}

export interface DocsNavigationLink {
  title: string;
  slug: string;
}

export interface DocsPageProps {
  data: Record<string, unknown>;
  prev?: DocsNavigationLink;
  next?: DocsNavigationLink;
  className?: string;
}

export interface PortfolioCardProps {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  technologies?: string[];
  projectUrl?: string;
  year?: number;
  featured?: boolean;
}

export interface PortfolioFilterProps {
  technologies: string[];
  selectedTechnologies: string[];
  onToggle: (tech: string) => void;
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

export interface NoxionSlotMap {
  header?: ComponentType<any> | null;
  footer?: ComponentType<any> | null;
  sidebar?: ComponentType<any> | null;
  hero?: ComponentType<any> | null;
  breadcrumb?: ComponentType<any> | null;
  toc?: ComponentType<any> | null;
  [key: string]: ComponentType<any> | null | undefined;
}

export interface NoxionTemplateProps {
  data: Record<string, unknown>;
  layout?: ComponentType<NoxionLayoutProps>;
  slots?: Partial<NoxionSlotMap>;
  className?: string;
}

export interface NoxionTemplateMap {
  home?: ComponentType<NoxionTemplateProps>;
  post?: ComponentType<NoxionTemplateProps>;
  archive?: ComponentType<NoxionTemplateProps>;
  tag?: ComponentType<NoxionTemplateProps>;
  [key: string]: ComponentType<NoxionTemplateProps> | undefined;
}

export interface NoxionLayoutProps {
  slots: Partial<NoxionSlotMap>;
  children: React.ReactNode;
  className?: string;
}

export interface NoxionThemeMetadata {
  description?: string;
  author?: string;
  version?: string;
  preview?: string;
}

export interface NoxionThemePackage {
  name: string;
  tokens: NoxionThemeTokens;
  layouts: Record<string, ComponentType<NoxionLayoutProps>>;
  templates: Partial<NoxionTemplateMap>;
  components: Partial<ComponentOverrides>;
  stylesheet?: string;
  /** Page types this theme supports (e.g. ['blog', 'docs', 'portfolio']) */
  supports?: string[];
  metadata?: NoxionThemeMetadata;
}
