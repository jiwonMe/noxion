"use client";

import { useState, useEffect } from "react";
import {
  NoxionThemeProvider,
  NoxionLogo,
} from "@noxion/renderer";
import type { NoxionThemeContract } from "@noxion/renderer";
import {
  BlogLayout,
  DocsLayout,
  Header,
  Footer,
  DocsSidebar,
} from "@noxion/theme-default";
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

  const themeEntry = themeRegistry.find((t) => t.id === state.themeId) ?? themeRegistry[0]!;
  const contract = themeEntry.contract;

  const SiteHeader = () => (
    <Header siteName="Noxion" logo={<NoxionLogo />} navigation={mockNavigation} />
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
    <NoxionThemeProvider themeContract={contract}>
      <Layout slots={slots}>
        <PageContent
          pageView={state.pageView}
          notionPageId={state.notionPageId ?? ""}
          notionRecordMap={notionRecordMap}
          onNotionLoad={setNotionRecordMap}
          contract={contract}
        />
      </Layout>
    </NoxionThemeProvider>
  );
}

function PageContent({
  pageView,
  notionPageId,
  notionRecordMap,
  onNotionLoad,
  contract,
}: {
  pageView: PageView;
  notionPageId: string;
  notionRecordMap: ExtendedRecordMap | null;
  onNotionLoad: (recordMap: ExtendedRecordMap | null) => void;
  contract: NoxionThemeContract;
}) {
  const { home: HomePageTemplate, archive: ArchivePageTemplate, tag: TagPageTemplate } = contract.templates;
  const PortfolioGridTemplate = contract.templates.portfolioGrid;

  switch (pageView) {
    case "home":
      return <HomePageTemplate data={{ posts: mockPosts, recentCount: 3 }} />;
    case "archive":
      return ArchivePageTemplate
        ? <ArchivePageTemplate data={{ posts: mockPosts, title: "Archive" }} />
        : <HomePageTemplate data={{ posts: mockPosts }} />;
    case "tag":
      return TagPageTemplate
        ? <TagPageTemplate data={{ posts: mockPosts.slice(0, 3), tag: "React" }} />
        : <HomePageTemplate data={{ posts: mockPosts.slice(0, 3) }} />;
    case "portfolio":
      return PortfolioGridTemplate
        ? <PortfolioGridTemplate data={{ projects: mockProjects }} />
        : <HomePageTemplate data={{ posts: mockPosts }} />;
    case "docs-sidebar":
      return <DocsContent />;
    case "notion":
      return (
        <NotionContentView
          notionPageId={notionPageId}
          recordMap={notionRecordMap}
          onLoad={onNotionLoad}
          contract={contract}
        />
      );
  }
}

function NotionContentView({
  notionPageId,
  recordMap,
  onLoad,
  contract,
}: {
  notionPageId: string;
  recordMap: ExtendedRecordMap | null;
  onLoad: (recordMap: ExtendedRecordMap | null) => void;
  contract: NoxionThemeContract;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedRef = { current: "" };

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
        <div className="dev-notion-empty">Loading Notion page…</div>
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
    const PostPageTemplate = contract.templates.post;
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
        Noxion uses a contract-based theme system where each theme is an independent package
        that implements the <code>NoxionThemeContract</code> interface — owning all its UI
        components, layouts, and templates.
      </p>

      <h2>Theme Contract</h2>
      <p>
        A theme contract defines every component, layout, and template the theme provides.
        Use <code>defineThemeContract()</code> to create a validated contract:
      </p>
      <pre><code>{`import { defineThemeContract } from "@noxion/renderer";

export const myThemeContract = defineThemeContract({
  name: "my-theme",
  components: { Header, Footer, PostCard, ... },
  layouts: { base: BaseLayout, blog: BlogLayout },
  templates: { home: HomePage, post: PostPage },
  supports: ["blog"],
});`}</code></pre>

      <h2>Using a Theme</h2>
      <p>
        Pass the contract to <code>NoxionThemeProvider</code> and import the theme&apos;s
        CSS for design tokens:
      </p>
      <pre><code>{`import { NoxionThemeProvider } from "@noxion/renderer";
import { defaultThemeContract } from "@noxion/theme-default";
import "@noxion/theme-default/styles/tailwind";

<NoxionThemeProvider themeContract={defaultThemeContract}>
  {children}
</NoxionThemeProvider>`}</code></pre>
    </article>
  );
}
