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

import { BaseLayout, BlogLayout } from "./layouts";

import {
  HomePage,
  PostPage,
  ArchivePage,
  TagPage,
} from "./templates";

export const beaconThemeContract: NoxionThemeContract = defineThemeContract({
  name: "beacon",

  metadata: {
    description: "High-contrast editorial design with newspaper-grid hero and wide content layout.",
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
  },

  templates: {
    home: HomePage,
    post: PostPage,
    archive: ArchivePage,
    tag: TagPage,
  },

  supports: ["blog", "docs"],
});
