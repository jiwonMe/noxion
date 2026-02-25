"use client";

import { useState, useEffect } from "react";
import { NoxionLogo } from "@noxion/renderer";
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
  fetchNonce?: number;
};

let lastNotionFetchNonce = 0;

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
          fetchNonce: e.data.fetchNonce ?? 0,
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
    document.documentElement.setAttribute("data-noxion-theme", state.themeId);
  }, [state?.isDark, state?.themeId]);

  if (!state) return null;

  const themeEntry = themeRegistry.find((t) => t.id === state.themeId) ?? themeRegistry[0]!;
  const { components, layouts, templates } = themeEntry;

  const SiteHeader = () => (
    <components.Header siteName="Noxion" navigation={mockNavigation} />
  );
  const SiteFooter = () => (
    <components.Footer siteName="Noxion Preview" author="Theme Author" />
  );
  const SidebarSlot = () => (
    <components.DocsSidebar items={mockSidebarItems} currentSlug="docs/theme-system" />
  );

  const isDocsView = state.pageView === "docs-sidebar";
  const Layout = isDocsView ? layouts.DocsLayout : layouts.BlogLayout;
  const slots = isDocsView
    ? { header: SiteHeader, footer: SiteFooter, sidebar: SidebarSlot }
    : { header: SiteHeader, footer: SiteFooter };

  return (
    <Layout slots={slots}>
      <PageContent
        pageView={state.pageView}
        notionPageId={state.notionPageId ?? ""}
        fetchNonce={state.fetchNonce ?? 0}
        notionRecordMap={notionRecordMap}
        onNotionLoad={setNotionRecordMap}
        templates={templates}
      />
    </Layout>
  );
}

function PageContent({
  pageView,
  notionPageId,
  fetchNonce,
  notionRecordMap,
  onNotionLoad,
  templates,
}: {
  pageView: PageView;
  notionPageId: string;
  fetchNonce: number;
  notionRecordMap: ExtendedRecordMap | null;
  onNotionLoad: (recordMap: ExtendedRecordMap | null) => void;
  templates: typeof themeRegistry[0]["templates"];
}) {
  switch (pageView) {
    case "home":
      return <templates.home data={{ posts: mockPosts, recentCount: 1 }} />;
    case "archive":
      return templates.archive
        ? <templates.archive data={{ posts: mockPosts, title: "Archive" }} />
        : <templates.home data={{ posts: mockPosts }} />;
    case "tag":
      return templates.tag
        ? <templates.tag data={{ posts: mockPosts.slice(0, 3), tag: "React" }} />
        : <templates.home data={{ posts: mockPosts.slice(0, 3) }} />;
    case "portfolio":
      return <templates.home data={{ posts: mockPosts }} />;
    case "docs-sidebar":
      return <DocsContent />;
    case "notion":
      return (
        <NotionContentView
          notionPageId={notionPageId}
          fetchNonce={fetchNonce}
          recordMap={notionRecordMap}
          onLoad={onNotionLoad}
          PostPageTemplate={templates.post}
        />
      );
  }
}

function NotionContentView({
  notionPageId,
  fetchNonce,
  recordMap,
  onLoad,
  PostPageTemplate,
}: {
  notionPageId: string;
  fetchNonce: number;
  recordMap: ExtendedRecordMap | null;
  onLoad: (recordMap: ExtendedRecordMap | null) => void;
  PostPageTemplate: typeof themeRegistry[0]["templates"]["post"];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchNonce === 0 || fetchNonce === lastNotionFetchNonce) return;
    const id = notionPageId.trim();
    if (!id) return;

    lastNotionFetchNonce = fetchNonce;
    let cancelled = false;
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
  }, [fetchNonce, notionPageId, onLoad]);

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
            prevPost: { title: "Previous Post Title", slug: "previous-post" },
            nextPost: { title: "Next Post Title", slug: "next-post" },
            siteName: "Noxion",
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
      <h1>Copy, Don&apos;t Import</h1>
      <p>
        Noxion uses a component ownership model where theme components are copied into your project.
        This means you own the source code and can customize it freely.
      </p>

      <h2>Adding Components</h2>
      <p>
        Use the <code>noxion add</code> command to copy components from a theme registry into your project:
      </p>
      <pre><code>{`bunx noxion add post-card
bunx noxion add post-list  # auto-includes post-card dependency
bunx noxion list           # see all available components`}</code></pre>

      <h2>Customizing</h2>
      <p>
        Once copied to <code>src/components/noxion/</code>, components are yours to modify.
        They use Tailwind utility classes and import types from <code>@noxion/renderer</code>.
      </p>
    </article>
  );
}
