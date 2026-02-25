import {
  Header as DefaultHeader,
  Footer as DefaultFooter,
  BlogLayout as DefaultBlogLayout,
  DocsLayout as DefaultDocsLayout,
  HomePage as DefaultHomePage,
  PostPage as DefaultPostPage,
  ArchivePage as DefaultArchivePage,
  TagPage as DefaultTagPage,
  DocsPage as DefaultDocsPage,
  DocsSidebar as DefaultDocsSidebar,
} from "@noxion/theme-default";
import {
  Header as BeaconHeader,
  Footer as BeaconFooter,
  BlogLayout as BeaconBlogLayout,
  HomePage as BeaconHomePage,
  PostPage as BeaconPostPage,
  ArchivePage as BeaconArchivePage,
  TagPage as BeaconTagPage,
  DocsSidebar as BeaconDocsSidebar,
} from "@noxion/theme-beacon";
import type { ComponentType } from "react";
import type { NoxionLayoutProps, NoxionTemplateProps } from "@noxion/renderer";

export interface ThemeEntry {
  id: string;
  label: string;
  components: {
    Header: ComponentType<{ siteName: string; navigation?: { label: string; href: string }[] }>;
    Footer: ComponentType<{ siteName: string; author?: string }>;
    DocsSidebar: ComponentType<{ items: unknown[]; currentSlug?: string }>;
  };
  layouts: {
    BlogLayout: ComponentType<NoxionLayoutProps>;
    DocsLayout: ComponentType<NoxionLayoutProps>;
  };
  templates: {
    home: ComponentType<NoxionTemplateProps>;
    post: ComponentType<NoxionTemplateProps>;
    archive: ComponentType<NoxionTemplateProps>;
    tag: ComponentType<NoxionTemplateProps>;
    docs?: ComponentType<NoxionTemplateProps>;
  };
}

export const themeRegistry: ThemeEntry[] = [
  {
    id: "default",
    label: "Default",
    components: {
      Header: DefaultHeader as ThemeEntry["components"]["Header"],
      Footer: DefaultFooter as ThemeEntry["components"]["Footer"],
      DocsSidebar: DefaultDocsSidebar as ThemeEntry["components"]["DocsSidebar"],
    },
    layouts: {
      BlogLayout: DefaultBlogLayout,
      DocsLayout: DefaultDocsLayout,
    },
    templates: {
      home: DefaultHomePage,
      post: DefaultPostPage,
      archive: DefaultArchivePage,
      tag: DefaultTagPage,
      docs: DefaultDocsPage,
    },
  },
  {
    id: "beacon",
    label: "Beacon",
    components: {
      Header: BeaconHeader as ThemeEntry["components"]["Header"],
      Footer: BeaconFooter as ThemeEntry["components"]["Footer"],
      DocsSidebar: BeaconDocsSidebar as ThemeEntry["components"]["DocsSidebar"],
    },
    layouts: {
      BlogLayout: BeaconBlogLayout,
      DocsLayout: BeaconBlogLayout,
    },
    templates: {
      home: BeaconHomePage,
      post: BeaconPostPage,
      archive: BeaconArchivePage,
      tag: BeaconTagPage,
    },
  },
];
