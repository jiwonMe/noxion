import type { NoxionThemePackage } from "@noxion/renderer";
import { defaultTokens } from "./tokens";
import { BlogLayout, DocsLayout, MagazineLayout } from "./layouts";
import { HomePage, PostPage, ArchivePage, TagPage, DocsPage, PortfolioGrid, PortfolioProject } from "./templates";
import {
  Header,
  Footer,
  PostCard,
  PostList,
  TOC,
  Search,
  TagFilter,
} from "./components";

export const themeDefault: NoxionThemePackage = {
  name: "default",
  tokens: defaultTokens,
  layouts: {
    blog: BlogLayout,
    docs: DocsLayout,
    magazine: MagazineLayout,
  },
  templates: {
    home: HomePage,
    post: PostPage,
    archive: ArchivePage,
    tag: TagPage,
    "docs/page": DocsPage,
    "portfolio/grid": PortfolioGrid,
    "portfolio/project": PortfolioProject,
  },
  components: {
    Header,
    Footer,
    PostCard,
    PostList,
    TOC,
    Search,
    TagFilter,
  },
  stylesheet: "@noxion/theme-default/styles",
  supports: ["blog", "docs", "portfolio"],
};

export { defaultTokens } from "./tokens";
export { BlogLayout, DocsLayout, MagazineLayout } from "./layouts";
export { HomePage, PostPage, ArchivePage, TagPage, DocsPage, PortfolioGrid, PortfolioProject } from "./templates";
export {
  Header,
  Footer,
  PostCard,
  PostList,
  TOC,
  Search,
  TagFilter,
  DocsSidebar,
  DocsBreadcrumb,
  PortfolioProjectCard,
  PortfolioFilter,
} from "./components";
