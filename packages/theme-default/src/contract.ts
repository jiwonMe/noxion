import { defineThemeContract } from "@noxion/renderer";
import type { NoxionThemeContract } from "@noxion/renderer";

import {
  Header,
  Footer,
  PostCard,
  FeaturedPostCard,
  PostList,
  HeroSection,
  TOC,
  Search,
  TagFilter,
  ThemeToggle,
  EmptyState,
  NotionPage,
  DocsSidebar,
  DocsBreadcrumb,
  PortfolioProjectCard,
  PortfolioFilter,
} from "./components";

import { BaseLayout, BlogLayout, DocsLayout } from "./layouts";

import {
  HomePage,
  PostPage,
  ArchivePage,
  TagPage,
  DocsPage,
  PortfolioGrid,
  PortfolioProject,
} from "./templates";

export const defaultThemeContract: NoxionThemeContract = defineThemeContract({
  name: "default",

  metadata: {
    description: "Clean typography, comfortable spacing, and sensible defaults for blogs and docs.",
    author: "Noxion",
    version: "0.2.0",
  },

  components: {
    Header,
    Footer,
    PostCard,
    FeaturedPostCard,
    PostList,
    HeroSection,
    TOC,
    Search,
    TagFilter,
    ThemeToggle,
    EmptyState,
    NotionPage: NotionPage as NoxionThemeContract["components"]["NotionPage"],
    DocsSidebar,
    DocsBreadcrumb,
    PortfolioProjectCard,
    PortfolioFilter,
  },

  layouts: {
    base: BaseLayout,
    blog: BlogLayout,
    docs: DocsLayout,
  },

  templates: {
    home: HomePage,
    post: PostPage,
    archive: ArchivePage,
    tag: TagPage,
    docs: DocsPage,
    portfolioGrid: PortfolioGrid,
    portfolioProject: PortfolioProject,
  },

  supports: ["blog", "docs", "portfolio"],
});
