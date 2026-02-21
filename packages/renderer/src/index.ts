export { defineTheme, defaultTheme } from "./theme/define-theme";
export { generateCSSVariables } from "./theme/css-generator";
export { resolveComponents } from "./theme/component-resolver";
export {
  NoxionThemeProvider,
  useNoxionTheme,
  useNoxionComponents,
  useNoxionLayout,
} from "./theme/ThemeProvider";
export type { NoxionThemeProviderProps } from "./theme/ThemeProvider";
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
  HeaderProps,
  FooterProps,
  PostCardProps,
  PostListProps,
  TOCProps,
  SearchProps,
  TagFilterProps,
} from "./theme/types";

export { NotionPage } from "./components/NotionPage";
export type { NotionPageProps } from "./components/NotionPage";
export { PostCard } from "./components/PostCard";
export { PostList } from "./components/PostList";
export { Header } from "./components/Header";
export { Footer } from "./components/Footer";
export { TagFilter } from "./components/TagFilter";
export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";

export { ThemeToggle } from "./components/ThemeToggle";
export { TOC } from "./components/TOC";
export { Search } from "./components/Search";

export { useThemePreference } from "./hooks/useTheme";
export type { ThemePreference } from "./hooks/useTheme";
export { useSearch } from "./hooks/useSearch";
