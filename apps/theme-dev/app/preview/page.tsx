"use client";

import { useState, useEffect, useRef } from "react";
import {
  NoxionThemeProvider,
  Header,
  Footer,
  NoxionLogo,
  BlogLayout,
  DocsLayout,
  DocsSidebar,
  HomePage as DefaultHomePage,
  ArchivePage as DefaultArchivePage,
  TagPage as DefaultTagPage,
  PortfolioGrid as DefaultPortfolioGrid,
  PostPage as DefaultPostPage,
  NotionPage,
} from "@noxion/renderer";
import type { NoxionThemePackage, NoxionThemeTokens } from "@noxion/renderer";
import type { ExtendedRecordMap } from "notion-types";
import { getPageTitle, defaultMapImageUrl } from "notion-utils";
import { themeRegistry } from "@/lib/themes";
import { mockPosts, mockProjects, mockNavigation, mockSidebarItems } from "@/lib/mock-data";

type PageView = "home" | "archive" | "tag" | "portfolio" | "docs-sidebar" | "notion";

type PreviewState = {
  themeId: string;
  pageView: PageView;
  isDark: boolean;
  notionPageId?: string;
};

function tokensToStyleVars(tokens: NoxionThemeTokens, isDark: boolean): Record<string, string> {
  const source = isDark && tokens.dark
    ? { ...tokens, ...tokens.dark } as NoxionThemeTokens
    : tokens;

  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(source.colors)) {
    vars[`--noxion-${key}`] = value;
  }

  if (source.fonts) {
    for (const [key, value] of Object.entries(source.fonts)) {
      if (value) vars[`--noxion-font-${key}`] = value;
    }
  }

  if (source.spacing) {
    for (const [key, value] of Object.entries(source.spacing)) {
      vars[`--noxion-spacing-${key}`] = value;
    }
  }

  if (source.borderRadius) {
    vars["--noxion-border-radius"] = source.borderRadius;
  }

  if (source.shadows) {
    for (const [key, value] of Object.entries(source.shadows)) {
      if (value) vars[`--noxion-shadow-${key}`] = value;
    }
  }

  if (source.transitions) {
    for (const [key, value] of Object.entries(source.transitions)) {
      if (value) vars[`--noxion-transition-${key}`] = value;
    }
  }

  if (source.breakpoints) {
    for (const [key, value] of Object.entries(source.breakpoints)) {
      if (value) vars[`--noxion-breakpoint-${key}`] = value;
    }
  }

  return vars;
}

export default function PreviewPage() {
  const [state, setState] = useState<PreviewState | null>(null);
  const [notionRecordMap, setNotionRecordMap] = useState<ExtendedRecordMap | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setState({
      themeId: params.get("theme") ?? "default",
      pageView: (params.get("page") ?? "home") as PageView,
      isDark: params.get("dark") === "true",
    });

    const handler = (e: MessageEvent) => {
      if (e.data?.type === "noxion-preview-state") {
        setState({
          themeId: e.data.themeId ?? "default",
          pageView: (e.data.pageView ?? "home") as PageView,
          isDark: e.data.isDark ?? false,
          notionPageId: e.data.notionPageId ?? "",
        });
      }
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "noxion-preview-ready" }, "*");

    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (!state) return;
    document.documentElement.setAttribute("data-theme", state.isDark ? "dark" : "light");
  }, [state?.isDark]);

  if (!state) return null;

  const themeEntry = themeRegistry.find((t) => t.id === state.themeId) ?? themeRegistry[0];
  const pkg = themeEntry.pkg;
  const scopedVars = tokensToStyleVars(pkg.tokens, state.isDark);

  const SiteHeader = () => (
    <Header siteName="Noxion" logo={<NoxionLogo />} navigation={mockNavigation} />
  );
  const SiteFooter = () => (
    <Footer siteName="Noxion Preview" author="Theme Author" />
  );
  const SidebarSlot = () => (
    <DocsSidebar items={mockSidebarItems} currentSlug="docs/theme-system" />
  );

  const notionPageId = state.notionPageId ?? "";

  const isDocsView = state.pageView === "docs-sidebar";
  const Layout = isDocsView ? DocsLayout : BlogLayout;
  const slots = isDocsView
    ? { header: SiteHeader, footer: SiteFooter, sidebar: SidebarSlot }
    : { header: SiteHeader, footer: SiteFooter };

  return (
    <div style={scopedVars as React.CSSProperties}>
      <NoxionThemeProvider themePackage={pkg} slots={slots}>
        <Layout slots={slots}>
          <PageContent
            pageView={state.pageView}
            notionPageId={notionPageId}
            notionRecordMap={notionRecordMap}
            onNotionLoad={setNotionRecordMap}
            pkg={pkg}
          />
        </Layout>
      </NoxionThemeProvider>
    </div>
  );
}

function PageContent({
  pageView,
  notionPageId,
  notionRecordMap,
  onNotionLoad,
  pkg,
}: {
  pageView: PageView;
  notionPageId: string;
  notionRecordMap: ExtendedRecordMap | null;
  onNotionLoad: (recordMap: ExtendedRecordMap | null) => void;
  pkg: NoxionThemePackage;
}) {
  const HomePage = pkg.templates.home ?? DefaultHomePage;
  const ArchivePage = pkg.templates.archive ?? DefaultArchivePage;
  const TagPage = pkg.templates.tag ?? DefaultTagPage;
  const PortfolioGridTemplate = pkg.templates["portfolio-grid"] ?? DefaultPortfolioGrid;

  switch (pageView) {
    case "home":
      return <HomePage data={{ posts: mockPosts, recentCount: 3 }} />;
    case "archive":
      return <ArchivePage data={{ posts: mockPosts, title: "Archive" }} />;
    case "tag":
      return <TagPage data={{ posts: mockPosts.slice(0, 3), tag: "React" }} />;
    case "portfolio":
      return <PortfolioGridTemplate data={{ projects: mockProjects }} />;
    case "docs-sidebar":
      return <DocsContent />;
    case "notion":
      return <NotionContentView notionPageId={notionPageId} recordMap={notionRecordMap} onLoad={onNotionLoad} pkg={pkg} />;
  }
}

function NotionContentView({
  notionPageId,
  recordMap,
  onLoad,
  pkg,
}: {
  notionPageId: string;
  recordMap: ExtendedRecordMap | null;
  onLoad: (recordMap: ExtendedRecordMap | null) => void;
  pkg: NoxionThemePackage;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedRef = useRef("");

  useEffect(() => {
    const id = notionPageId.trim();
    if (!id || id === lastFetchedRef.current) return;

    let cancelled = false;
    lastFetchedRef.current = id;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/notion?pageId=${encodeURIComponent(id)}`);
        if (cancelled) return;
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Request failed" }));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const data: ExtendedRecordMap = await res.json();
        if (!cancelled) onLoad(data);
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error");
          onLoad(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [notionPageId, onLoad]);

  if (loading) {
    return (
      <div className="dev-notion-view">
        <div className="dev-notion-empty">Loading Notion page\u2026</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dev-notion-view">
        <div className="dev-notion-form__error">{error}</div>
      </div>
    );
  }

  if (recordMap) {
    const PostPageTemplate = pkg.templates.post ?? DefaultPostPage;

    const title = getPageTitle(recordMap) || undefined;
    const blockIds = Object.keys(recordMap.block);
    const rootEntry = blockIds.length > 0 ? recordMap.block[blockIds[0]] : undefined;
    const rootBlock = rootEntry && "value" in rootEntry ? rootEntry.value : rootEntry;
    const fmt = (rootBlock as Record<string, unknown>)?.format as Record<string, unknown> | undefined;

    const rawCover = fmt?.page_cover as string | undefined;
    const cover = rawCover
      ? (defaultMapImageUrl(rawCover, rootBlock as Parameters<typeof defaultMapImageUrl>[1]) ?? rawCover)
      : undefined;

    const createdTime = (rootBlock as Record<string, unknown>)?.created_time as number | undefined;
    const date = createdTime ? new Date(createdTime).toISOString().slice(0, 10) : undefined;

    let author: string | undefined;
    if (recordMap.notion_user) {
      const createdById = (rootBlock as Record<string, unknown>)?.created_by_id as string | undefined;
      const lastEditedById = (rootBlock as Record<string, unknown>)?.last_edited_by_id as string | undefined;
      const userId = createdById || lastEditedById;
      if (userId) {
        const userEntry = recordMap.notion_user[userId];
        const user = userEntry && "value" in userEntry ? userEntry.value : userEntry;
        const name = (user as Record<string, unknown>)?.name as string | undefined;
        if (name) author = name;
      }
      if (!author) {
        const firstUserEntry = Object.values(recordMap.notion_user)[0];
        const firstUser = firstUserEntry && "value" in firstUserEntry ? firstUserEntry.value : firstUserEntry;
        const firstName = (firstUser as Record<string, unknown>)?.name as string | undefined;
        if (firstName) author = firstName;
      }
    }

    return (
      <div className="dev-notion-view">
        <div className="dev-notion-content">
          <PostPageTemplate data={{
            recordMap,
            ...(title ? { title } : {}),
            ...(author ? { author } : {}),
            ...(date ? { date } : {}),
            ...(cover ? { coverImage: cover } : {}),
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="dev-notion-view">
      <div className="dev-notion-empty">
        Enter a Notion page ID in the toolbar to preview it with the current theme.
      </div>
    </div>
  );
}

function DocsContent() {
  return (
    <article className="dev-docs-content">
      <h1>Theme System</h1>
      <p>
        Noxion uses a CSS variable-based theme system with full dark mode support.
        Themes are defined as <code>NoxionThemePackage</code> objects containing
        design tokens, layouts, templates, and component overrides.
      </p>

      <h2>Design Tokens</h2>
      <p>
        Tokens define the visual language of your theme: colors, fonts, spacing,
        shadows, transitions, and breakpoints. At runtime, tokens are injected as
        CSS custom properties with the <code>--noxion-</code> prefix.
      </p>
      <pre><code>{`const myTheme = defineTheme({
  name: "my-theme",
  colors: {
    primary: "#2563eb",
    background: "#ffffff",
    foreground: "#171717",
    // ...
  },
  fonts: {
    sans: '"Inter", system-ui, sans-serif',
  },
});`}</code></pre>

      <h2>Extending Themes</h2>
      <p>
        Use <code>extendTheme()</code> to create a new theme based on an existing
        one. Only specify the tokens and components you want to override —
        everything else is inherited from the parent.
      </p>
      <pre><code>{`const customTheme = extendTheme(defaultThemePackage, {
  name: "custom",
  tokens: {
    colors: { primary: "#e11d48" },
  },
});`}</code></pre>

      <h2>Dark Mode</h2>
      <p>
        Each theme can include a <code>dark</code> property with overridden tokens.
        The <code>NoxionThemeProvider</code> automatically generates CSS variables
        scoped to <code>[data-theme=&quot;dark&quot;]</code>.
      </p>
    </article>
  );
}
