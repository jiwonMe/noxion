import type { NoxionThemePackage } from "../theme/types";
import { defaultTheme } from "../theme/define-theme";
import { BaseLayout } from "../layouts/BaseLayout";
import { BlogLayout } from "../layouts/BlogLayout";
import { DocsLayout } from "../layouts/DocsLayout";
import { HomePage } from "../templates/HomePage";
import { PostPage } from "../templates/PostPage";
import { ArchivePage } from "../templates/ArchivePage";
import { TagPage } from "../templates/TagPage";
import { DocsPage } from "../templates/DocsPage";
import { PortfolioGrid } from "../templates/PortfolioGrid";
import { PortfolioProject } from "../templates/PortfolioProject";

export const defaultThemePackage: NoxionThemePackage = {
  name: "default",
  tokens: {
    ...defaultTheme,
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.03)",
      md: "0 4px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
      lg: "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
    },
    transitions: {
      fast: "100ms cubic-bezier(0.4, 0, 0.2, 1)",
      normal: "180ms cubic-bezier(0.4, 0, 0.2, 1)",
      slow: "280ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
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
    "portfolio-grid": PortfolioGrid,
    "portfolio-project": PortfolioProject,
  },
  components: {},
  supports: ["blog", "docs", "portfolio"],
  metadata: {
    description: "Clean typography, comfortable spacing, and sensible defaults for blogs and docs.",
    author: "Noxion",
    version: "0.2.0",
  },
};
