export { defineTheme, defaultTheme } from "./theme/define-theme";
export { extendTheme } from "./theme/extend-theme";
export type { ExtendThemeOverrides } from "./theme/extend-theme";
export { generateCSSVariables, generateThemeStylesheet } from "./theme/css-generator";
export { resolveComponents } from "./theme/component-resolver";
export {
  NoxionThemeProvider,
  useNoxionTheme,
  useNoxionTokens,
  useNoxionComponents,
  useNoxionLayout,
  useNoxionSlots,
  useNoxionTemplate,
} from "./theme/ThemeProvider";
export type { NoxionThemeProviderProps } from "./theme/ThemeProvider";

export { resolveSlots } from "./theme/slot-resolver";
export { resolveTemplate } from "./theme/template-resolver";

export { BaseLayout, BlogLayout, DocsLayout, MagazineLayout } from "./layouts";
export { HomePage, PostPage, ArchivePage, TagPage, DocsPage, PortfolioGrid, PortfolioProject } from "./templates";
export type {
  NoxionTheme,
  NoxionThemeColors,
  NoxionThemeFonts,
  NoxionThemeSpacing,
  NoxionThemeShadows,
  NoxionThemeTransitions,
  NoxionThemeBreakpoints,
  NoxionThemeTokens,
  NoxionLayout,
  ComponentOverrides,
  NoxionSlotMap,
  NoxionTemplateMap,
  NoxionTemplateProps,
  NoxionLayoutProps,
  NoxionThemePackage,
  NoxionThemeMetadata,
  HeaderProps,
  FooterProps,
  PostCardProps,
  PostListProps,
  TOCProps,
  SearchProps,
  TagFilterProps,
  DocsSidebarItem,
  DocsSidebarProps,
  DocsBreadcrumbItem,
  DocsBreadcrumbProps,
  DocsNavigationLink,
  DocsPageProps,
  PortfolioCardProps,
  PortfolioFilterProps,
} from "./theme/types";

export { NotionPage } from "./components/NotionPage";
export type { NotionPageProps } from "./components/NotionPage";
export { PostCard } from "./components/PostCard";
export { FeaturedPostCard } from "./components/FeaturedPostCard";
export { PostList } from "./components/PostList";
export { HeroSection } from "./components/HeroSection";
export type { HeroSectionProps } from "./components/HeroSection";
export { Header } from "./components/Header";
export { NoxionLogo } from "./components/NoxionLogo";
export { Footer } from "./components/Footer";
export { TagFilter } from "./components/TagFilter";
export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";

export { ThemeToggle } from "./components/ThemeToggle";
export { TOC } from "./components/TOC";
export { Search } from "./components/Search";
export { DocsSidebar } from "./components/DocsSidebar";
export { DocsBreadcrumb } from "./components/DocsBreadcrumb";
export { PortfolioProjectCard } from "./components/PortfolioProjectCard";
export { PortfolioFilter } from "./components/PortfolioFilter";

export { useThemePreference } from "./hooks/useTheme";
export type { ThemePreference } from "./hooks/useTheme";
export { useSearch } from "./hooks/useSearch";

export { validateTheme, formatValidationResult } from "./theme/validate-theme";
export type { ValidationResult, ValidationIssue, ValidationSeverity } from "./theme/validate-theme";


