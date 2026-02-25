"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useThemePreference } from "@noxion/renderer";
import {
  Sun,
  Moon,
  Monitor,
  Tablet,
  Smartphone,
  Columns2,
  Clock,
  X,
} from "lucide-react";
import { themeRegistry, type ThemeEntry } from "@/lib/themes";

const STORAGE_KEY = "noxion-theme-dev-recent-pages";
const MAX_RECENT = 10;

interface RecentPage {
  id: string;
  usedAt: string;
}

function getRecentPages(): RecentPage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as RecentPage[];
  } catch {
    return [];
  }
}

function addRecentPage(pageId: string): RecentPage[] {
  const trimmed = pageId.trim();
  if (!trimmed) return getRecentPages();

  const existing = getRecentPages().filter((p) => p.id !== trimmed);
  const updated: RecentPage[] = [
    { id: trimmed, usedAt: new Date().toISOString() },
    ...existing,
  ].slice(0, MAX_RECENT);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch { /* quota exceeded */ }
  return updated;
}

function removeRecentPage(pageId: string): RecentPage[] {
  const updated = getRecentPages().filter((p) => p.id !== pageId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch { /* noop */ }
  return updated;
}

type PageView = "home" | "archive" | "tag" | "portfolio" | "docs-sidebar" | "notion";
type Viewport = "desktop" | "tablet" | "mobile";
type ViewMode = "single" | "compare";

const PAGE_VIEWS: { id: PageView; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "archive", label: "Archive" },
  { id: "tag", label: "Tag" },
  { id: "portfolio", label: "Portfolio" },
  { id: "docs-sidebar", label: "Docs" },
  { id: "notion", label: "Notion Page" },
];

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export default function ThemeDevPage() {
  const [themeId, setThemeId] = useState("default");
  const [compareThemeId, setCompareThemeId] = useState("beacon");
  const [pageView, setPageView] = useState<PageView>("home");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [notionPageId, setNotionPageId] = useState("");
  const [fetchNonce, setFetchNonce] = useState(0);
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const { resolved: resolvedMode, setPreference: setThemePreference } = useThemePreference();

  useEffect(() => {
    const pages = getRecentPages();
    setRecentPages(pages);
    if (pages.length > 0) {
      setNotionPageId(pages[0]!.id);
    }
  }, []);
  const isDark = resolvedMode === "dark";

  const currentTheme = themeRegistry.find((t) => t.id === themeId) ?? themeRegistry[0]!;
  const compareTheme = themeRegistry.find((t) => t.id === compareThemeId) ?? themeRegistry[1]!;

  const toggleColorMode = useCallback(() => {
    setThemePreference(resolvedMode === "light" ? "dark" : "light");
  }, [resolvedMode, setThemePreference]);

  const toggleViewMode = useCallback(() => {
    setViewMode((m) => (m === "single" ? "compare" : "single"));
  }, []);

  return (
    <div className="dev-shell">
      <header className="dev-header">
        <div className="dev-header__left">
          <span className="dev-header__brand">noxion</span>
          <div className="dev-header__sep" />
          <nav className="dev-header__nav">
            {PAGE_VIEWS.map((v) => (
              <button
                key={v.id}
                className={`dev-header__tab ${pageView === v.id ? "dev-header__tab--active" : ""}`}
                onClick={() => setPageView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="dev-header__right">
          {pageView === "notion" && (
            <>
              <NotionPageIdInput
                value={notionPageId}
                recentPages={recentPages}
                onSubmit={(id) => {
                  setNotionPageId(id);
                  setFetchNonce((n) => n + 1);
                  setRecentPages(addRecentPage(id));
                }}
                onRemoveRecent={(id) => {
                  setRecentPages(removeRecentPage(id));
                  if (notionPageId === id) setNotionPageId("");
                }}
              />
              <div className="dev-header__sep" />
            </>
          )}

          <div className="dev-header__group">
            <select
              className="dev-header__select"
              value={themeId}
              onChange={(e) => setThemeId(e.target.value)}
            >
              {themeRegistry.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            {viewMode === "compare" && (
              <>
                <span className="dev-header__vs">vs</span>
                <select
                  className="dev-header__select"
                  value={compareThemeId}
                  onChange={(e) => setCompareThemeId(e.target.value)}
                >
                  {themeRegistry.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="dev-header__sep" />

          <button
            className="dev-header__icon-btn"
            onClick={toggleColorMode}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          <div className="dev-header__group">
            {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
              <button
                key={v}
                className={`dev-header__icon-btn ${viewport === v ? "dev-header__icon-btn--active" : ""}`}
                onClick={() => setViewport(v)}
                title={`${v} (${VIEWPORT_WIDTHS[v]})`}
              >
                {v === "desktop" ? <Monitor size={14} /> : v === "tablet" ? <Tablet size={14} /> : <Smartphone size={14} />}
              </button>
            ))}
          </div>

          <div className="dev-header__sep" />

          <button
            className={`dev-header__icon-btn ${viewMode === "compare" ? "dev-header__icon-btn--active" : ""}`}
            onClick={toggleViewMode}
            title="Compare two themes"
          >
            <Columns2 size={14} />
          </button>
        </div>
      </header>

      <div className="dev-main">
        <div className="dev-preview-area">
          {viewMode === "single" ? (
            <div className="dev-preview-frame" style={{ maxWidth: VIEWPORT_WIDTHS[viewport] }}>
              <PreviewFrame themeId={themeId} pageView={pageView} isDark={isDark} notionPageId={notionPageId} fetchNonce={fetchNonce} />
            </div>
          ) : (
            <div className="dev-compare" style={{ "--compare-viewport-width": VIEWPORT_WIDTHS[viewport] } as React.CSSProperties}>
              <div className="dev-compare__pane">
                <div className="dev-compare__label">{currentTheme.label}</div>
                <div className="dev-preview-frame">
                  <PreviewFrame themeId={themeId} pageView={pageView} isDark={isDark} notionPageId={notionPageId} fetchNonce={fetchNonce} />
                </div>
              </div>
              <div className="dev-compare__divider" />
              <div className="dev-compare__pane">
                <div className="dev-compare__label">{compareTheme.label}</div>
                <div className="dev-preview-frame">
                  <PreviewFrame themeId={compareThemeId} pageView={pageView} isDark={isDark} notionPageId={notionPageId} fetchNonce={fetchNonce} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotionPageIdInput({
  value,
  recentPages,
  onSubmit,
  onRemoveRecent,
}: {
  value: string;
  recentPages: RecentPage[];
  onSubmit: (id: string) => void;
  onRemoveRecent: (id: string) => void;
}) {
  const [input, setInput] = useState(value);
  const [showRecent, setShowRecent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setInput(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowRecent(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = useCallback(() => {
    const trimmed = input.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setShowRecent(false);
    }
  }, [input, onSubmit]);

  const selectRecent = useCallback((id: string) => {
    setInput(id);
    onSubmit(id);
    setShowRecent(false);
  }, [onSubmit]);

  const formatId = (id: string) =>
    id.length > 28 ? `${id.slice(0, 12)}…${id.slice(-12)}` : id;

  return (
    <div className="dev-header__group dev-header__notion-input" ref={containerRef}>
      <input
        className="dev-header__input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        onFocus={() => { if (recentPages.length > 0) setShowRecent(true); }}
        placeholder="Notion page ID or URL"
        spellCheck={false}
        autoComplete="off"
      />
      <button
        className="dev-header__text-btn"
        onClick={submit}
        disabled={!input.trim()}
      >
        Fetch
      </button>

      {showRecent && recentPages.length > 0 && (
        <div className="dev-recent-dropdown">
          <div className="dev-recent-dropdown__header">
            <Clock size={11} />
            <span>Recent</span>
          </div>
          {recentPages.map((page) => (
            <div
              key={page.id}
              className={`dev-recent-dropdown__item ${page.id === value ? "dev-recent-dropdown__item--active" : ""}`}
            >
              <button
                className="dev-recent-dropdown__select"
                onClick={() => selectRecent(page.id)}
                title={page.id}
              >
                {formatId(page.id)}
              </button>
              <button
                className="dev-recent-dropdown__remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveRecent(page.id);
                }}
                title="Remove from recent"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PreviewFrame({
  themeId,
  pageView,
  isDark,
  notionPageId,
  fetchNonce,
}: {
  themeId: string;
  pageView: PageView;
  isDark: boolean;
  notionPageId: string;
  fetchNonce: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const stateRef = useRef({ themeId, pageView, isDark, notionPageId, fetchNonce });
  stateRef.current = { themeId, pageView, isDark, notionPageId, fetchNonce };

  const sendState = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({
      type: "noxion-preview-state",
      ...stateRef.current,
    }, "*");
  }, []);

  useEffect(() => {
    if (readyRef.current) sendState();
  }, [themeId, pageView, isDark, notionPageId, fetchNonce, sendState]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "noxion-preview-ready" && e.source === iframeRef.current?.contentWindow) {
        readyRef.current = true;
        sendState();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [sendState]);

  const [initialSrc] = useState(
    `/preview?theme=${themeId}&page=${pageView}&dark=${isDark}`
  );

  return (
    <iframe
      ref={iframeRef}
      src={initialSrc}
      className="dev-preview-iframe"
    />
  );
}
