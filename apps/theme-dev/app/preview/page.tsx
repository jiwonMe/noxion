"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  NoxionThemeProvider,
  Header,
  Footer,
  BlogLayout,
  DocsLayout,
  DocsSidebar,
  HomePage,
  ArchivePage,
  TagPage,
  PortfolioGrid,
  NotionPage,
} from "@noxion/renderer";
import type { NoxionThemePackage, NoxionThemeTokens } from "@noxion/renderer";
import type { ExtendedRecordMap } from "notion-types";
import { themeRegistry } from "@/lib/themes";
import { mockPosts, mockProjects, mockNavigation, mockSidebarItems } from "@/lib/mock-data";

type PageView = "home" | "archive" | "tag" | "portfolio" | "docs-sidebar" | "notion";

type PreviewState = {
  themeId: string;
  pageView: PageView;
  isDark: boolean;
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
    <Header siteName="Noxion Preview" navigation={mockNavigation} />
  );
  const SiteFooter = () => (
    <Footer siteName="Noxion Preview" author="Theme Author" />
  );
  const SidebarSlot = () => (
    <DocsSidebar items={mockSidebarItems} currentSlug="docs/theme-system" />
  );

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
            notionRecordMap={notionRecordMap}
            onNotionLoad={setNotionRecordMap}
          />
        </Layout>
      </NoxionThemeProvider>
    </div>
  );
}

function PageContent({
  pageView,
  notionRecordMap,
  onNotionLoad,
}: {
  pageView: PageView;
  notionRecordMap: ExtendedRecordMap | null;
  onNotionLoad: (recordMap: ExtendedRecordMap | null) => void;
}) {
  switch (pageView) {
    case "home":
      return <HomePage data={{ posts: mockPosts, recentCount: 3 }} />;
    case "archive":
      return <ArchivePage data={{ posts: mockPosts, title: "Archive" }} />;
    case "tag":
      return <TagPage data={{ posts: mockPosts.slice(0, 3), tag: "React" }} />;
    case "portfolio":
      return <PortfolioGrid data={{ projects: mockProjects }} />;
    case "docs-sidebar":
      return <DocsContent />;
    case "notion":
      return <NotionContentView recordMap={notionRecordMap} onLoad={onNotionLoad} />;
  }
}

function NotionContentView({
  recordMap,
  onLoad,
}: {
  recordMap: ExtendedRecordMap | null;
  onLoad: (recordMap: ExtendedRecordMap | null) => void;
}) {
  const [pageId, setPageId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFetch = useCallback(async () => {
    const id = pageId.trim();
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notion?pageId=${encodeURIComponent(id)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data: ExtendedRecordMap = await res.json();
      onLoad(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      onLoad(null);
    } finally {
      setLoading(false);
    }
  }, [pageId, onLoad]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleFetch();
    },
    [handleFetch]
  );

  return (
    <div className="dev-notion-view">
      <div className="dev-notion-form">
        <label className="dev-notion-form__label" htmlFor="notion-page-id">
          Notion Page ID
        </label>
        <div className="dev-notion-form__row">
          <input
            ref={inputRef}
            id="notion-page-id"
            className="dev-notion-form__input"
            type="text"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 1a2b3c4d5e6f7890abcdef1234567890"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            className="dev-notion-form__btn"
            onClick={handleFetch}
            disabled={loading || !pageId.trim()}
          >
            {loading ? "Loading\u2026" : "Fetch"}
          </button>
        </div>
        <div className="dev-notion-form__hint">
          Paste any public Notion page ID or full URL. The page must be publicly shared.
        </div>
        {error && <div className="dev-notion-form__error">{error}</div>}
      </div>

      {recordMap && (
        <div className="dev-notion-content">
          <NotionPage recordMap={recordMap} fullPage={true} />
        </div>
      )}

      {!recordMap && !loading && !error && (
        <div className="dev-notion-empty">
          Enter a Notion page ID above to preview it with the current theme.
        </div>
      )}
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
