"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  NoxionThemeProvider,
  Header,
  Footer,
  BlogLayout,
  DocsLayout,
  validateTheme,
  DocsSidebar,
  HomePage,
  ArchivePage,
  TagPage,
  PortfolioGrid,
  NotionPage,
  useThemePreference,
} from "@noxion/renderer";
import type { NoxionThemePackage, NoxionThemeTokens, ValidationResult, ValidationIssue } from "@noxion/renderer";
import type { ExtendedRecordMap } from "notion-types";
import {
  Sun,
  Moon,
  Monitor,
  Tablet,
  Smartphone,
  Columns2,
  Braces,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Check,
} from "lucide-react";
import { themeRegistry, type ThemeEntry } from "@/lib/themes";
import { mockPosts, mockProjects, mockNavigation, mockSidebarItems } from "@/lib/mock-data";

type PageView = "home" | "archive" | "tag" | "portfolio" | "docs-sidebar" | "notion";
type DevPanel = "none" | "validator" | "tokens";
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
  const [compareThemeId, setCompareThemeId] = useState("ink");
  const [pageView, setPageView] = useState<PageView>("home");
  const [devPanel, setDevPanel] = useState<DevPanel>("none");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [notionRecordMap, setNotionRecordMap] = useState<ExtendedRecordMap | null>(null);

  const { resolved: resolvedMode, setPreference: setThemePreference } = useThemePreference();
  const isDark = resolvedMode === "dark";

  const currentTheme = themeRegistry.find((t) => t.id === themeId) ?? themeRegistry[0];
  const compareTheme = themeRegistry.find((t) => t.id === compareThemeId) ?? themeRegistry[1];
  const pkg = currentTheme.pkg;

  const validation = useMemo(() => validateTheme(pkg), [pkg]);
  const compareValidation = useMemo(
    () => (viewMode === "compare" ? validateTheme(compareTheme.pkg) : null),
    [viewMode, compareTheme.pkg]
  );

  const toggleColorMode = useCallback(() => {
    setThemePreference(resolvedMode === "light" ? "dark" : "light");
  }, [resolvedMode, setThemePreference]);

  const togglePanel = useCallback(
    (panel: DevPanel) => setDevPanel((p) => (p === panel ? "none" : panel)),
    []
  );

  const toggleViewMode = useCallback(() => {
    setViewMode((m) => (m === "single" ? "compare" : "single"));
  }, []);

  return (
    <div className="dev-shell">
      <Toolbar
        themeId={themeId}
        onThemeChange={setThemeId}
        compareThemeId={compareThemeId}
        onCompareThemeChange={setCompareThemeId}
        colorMode={resolvedMode}
        onColorModeToggle={toggleColorMode}
        validation={validation}
        devPanel={devPanel}
        onDevPanelToggle={togglePanel}
        viewport={viewport}
        onViewportChange={setViewport}
        viewMode={viewMode}
        onViewModeToggle={toggleViewMode}
      />

      <PageTabs pageView={pageView} onPageViewChange={setPageView} />

      {devPanel === "validator" && (
        <ValidatorPanel validation={validation} compareValidation={compareValidation} />
      )}
      {devPanel === "tokens" && (
        <TokenPanel
          pkg={pkg}
          comparePkg={viewMode === "compare" ? compareTheme.pkg : null}
        />
      )}

      <div className="dev-preview-area">
        {viewMode === "single" ? (
          <div className="dev-preview-frame" style={{ maxWidth: VIEWPORT_WIDTHS[viewport] }}>
            <ThemePreview pkg={pkg} pageView={pageView} isDark={isDark} notionRecordMap={notionRecordMap} onNotionLoad={setNotionRecordMap} />
          </div>
        ) : (
          <div className="dev-compare">
            <div className="dev-compare__pane">
              <div className="dev-compare__label">{currentTheme.label}</div>
              <div className="dev-preview-frame" style={{ maxWidth: VIEWPORT_WIDTHS[viewport] }}>
                <ThemePreview pkg={pkg} pageView={pageView} isDark={isDark} notionRecordMap={notionRecordMap} onNotionLoad={setNotionRecordMap} />
              </div>
            </div>
            <div className="dev-compare__divider" />
            <div className="dev-compare__pane">
              <div className="dev-compare__label">{compareTheme.label}</div>
              <div className="dev-preview-frame" style={{ maxWidth: VIEWPORT_WIDTHS[viewport] }}>
                <ThemePreview pkg={compareTheme.pkg} pageView={pageView} isDark={isDark} notionRecordMap={notionRecordMap} onNotionLoad={setNotionRecordMap} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Toolbar({
  themeId,
  onThemeChange,
  compareThemeId,
  onCompareThemeChange,
  colorMode,
  onColorModeToggle,
  validation,
  devPanel,
  onDevPanelToggle,
  viewport,
  onViewportChange,
  viewMode,
  onViewModeToggle,
}: {
  themeId: string;
  onThemeChange: (id: string) => void;
  compareThemeId: string;
  onCompareThemeChange: (id: string) => void;
  colorMode: "light" | "dark";
  onColorModeToggle: () => void;
  validation: ValidationResult;
  devPanel: DevPanel;
  onDevPanelToggle: (panel: DevPanel) => void;
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  viewMode: ViewMode;
  onViewModeToggle: () => void;
}) {
  const errorCount = validation.issues.filter((i) => i.severity === "error").length;
  const warnCount = validation.issues.filter((i) => i.severity === "warning").length;

  return (
    <div className="dev-toolbar">
      <span className="dev-toolbar__brand">noxion theme-dev</span>
      <div className="dev-toolbar__divider" />

      <div className="dev-toolbar__group">
        <span className="dev-toolbar__label">Theme</span>
        <select
          className="dev-toolbar__select"
          value={themeId}
          onChange={(e) => onThemeChange(e.target.value)}
        >
          {themeRegistry.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>

        {viewMode === "compare" && (
          <>
            <span className="dev-toolbar__vs">vs</span>
            <select
              className="dev-toolbar__select"
              value={compareThemeId}
              onChange={(e) => onCompareThemeChange(e.target.value)}
            >
              {themeRegistry.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="dev-toolbar__divider" />

      <div className="dev-toolbar__group">
        <button
          className={`dev-toolbar__btn ${colorMode === "dark" ? "dev-toolbar__btn--active" : ""}`}
          onClick={onColorModeToggle}
          title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
        >
          {colorMode === "light" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      <div className="dev-toolbar__group dev-toolbar__viewports">
        {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
          <button
            key={v}
            className={`dev-toolbar__btn dev-toolbar__btn--viewport ${viewport === v ? "dev-toolbar__btn--active" : ""}`}
            onClick={() => onViewportChange(v)}
            title={`${v} (${VIEWPORT_WIDTHS[v]})`}
          >
            {v === "desktop" ? <Monitor size={14} /> : v === "tablet" ? <Tablet size={14} /> : <Smartphone size={14} />}
          </button>
        ))}
      </div>

      <div className="dev-toolbar__divider" />

      <button
        className={`dev-toolbar__btn dev-toolbar__btn--wide ${viewMode === "compare" ? "dev-toolbar__btn--active" : ""}`}
        onClick={onViewModeToggle}
        title="Compare two themes side-by-side"
      >
        <Columns2 size={14} />
      </button>

      <div className="dev-toolbar__right">
        <button
          className={`dev-toolbar__btn ${devPanel === "tokens" ? "dev-toolbar__btn--active" : ""}`}
          onClick={() => onDevPanelToggle("tokens")}
          title="Token inspector"
        >
          <Braces size={14} />
        </button>

        <button
          className={`dev-toolbar__btn ${devPanel === "validator" ? "dev-toolbar__btn--active" : ""}`}
          onClick={() => onDevPanelToggle("validator")}
          title="Validator"
        >
          <Check size={14} />
        </button>

        {errorCount > 0 ? (
          <span className="dev-toolbar__badge dev-toolbar__badge--invalid">
            {errorCount} error{errorCount > 1 ? "s" : ""}
          </span>
        ) : warnCount > 0 ? (
          <span className="dev-toolbar__badge dev-toolbar__badge--warnings">
            {warnCount} warn{warnCount > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="dev-toolbar__badge dev-toolbar__badge--valid">valid</span>
        )}
      </div>
    </div>
  );
}

function PageTabs({
  pageView,
  onPageViewChange,
}: {
  pageView: PageView;
  onPageViewChange: (view: PageView) => void;
}) {
  return (
    <div className="dev-tabs">
      {PAGE_VIEWS.map((v) => (
        <button
          key={v.id}
          className={`dev-tab ${pageView === v.id ? "dev-tab--active" : ""}`}
          onClick={() => onPageViewChange(v.id)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

function ValidatorPanel({
  validation,
  compareValidation,
}: {
  validation: ValidationResult;
  compareValidation: ValidationResult | null;
}) {
  return (
    <div className="dev-panel">
      <div className="dev-panel__header">Validation</div>
      <div className="dev-panel__body">
        <ValidationList validation={validation} />
        {compareValidation && (
          <>
            <div className="dev-panel__separator" />
            <ValidationList validation={compareValidation} />
          </>
        )}
      </div>
    </div>
  );
}

function ValidationList({ validation }: { validation: ValidationResult }) {
  if (validation.issues.length === 0) {
    return <div className="dev-panel__success"><CheckCircle size={12} /> No issues found.</div>;
  }

  return (
    <div className="dev-panel__issues">
      {validation.issues.map((issue: ValidationIssue, i: number) => (
        <div
          key={i}
          className={`dev-panel__issue dev-panel__issue--${issue.severity}`}
        >
          <span className="dev-panel__issue-icon">
            {issue.severity === "error" ? <XCircle size={12} /> : <AlertTriangle size={12} />}
          </span>
          <span className="dev-panel__issue-path">{issue.path}</span>
          <span className="dev-panel__issue-msg">{issue.message}</span>
        </div>
      ))}
    </div>
  );
}

function TokenPanel({
  pkg,
  comparePkg,
}: {
  pkg: NoxionThemePackage;
  comparePkg: NoxionThemePackage | null;
}) {
  return (
    <div className="dev-panel">
      <div className="dev-panel__header">
        Design Tokens
        {comparePkg && <span className="dev-panel__header-sub">— comparing</span>}
      </div>
      <div className={`dev-panel__body ${comparePkg ? "dev-panel__body--compare" : ""}`}>
        <TokenList pkg={pkg} />
        {comparePkg && (
          <>
            <div className="dev-panel__separator dev-panel__separator--vertical" />
            <TokenList pkg={comparePkg} />
          </>
        )}
      </div>
    </div>
  );
}

function TokenList({ pkg }: { pkg: NoxionThemePackage }) {
  const { colors, fonts, spacing, shadows, transitions } = pkg.tokens;

  return (
    <div className="dev-tokens">
      <div className="dev-tokens__theme-name">{pkg.name}</div>

      <TokenSection label="Colors">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="dev-token">
            <div className="dev-token__swatch" style={{ background: value }} />
            <span className="dev-token__key">{key}</span>
            <span className="dev-token__value">{value}</span>
          </div>
        ))}
      </TokenSection>

      {fonts && (
        <TokenSection label="Fonts">
          {Object.entries(fonts).map(([key, value]) =>
            value ? (
              <div key={key} className="dev-token">
                <span className="dev-token__key">{key}</span>
                <span className="dev-token__value dev-token__value--truncate">{value}</span>
              </div>
            ) : null
          )}
        </TokenSection>
      )}

      {spacing && (
        <TokenSection label="Spacing">
          {Object.entries(spacing).map(([key, value]) => (
            <div key={key} className="dev-token">
              <span className="dev-token__key">{key}</span>
              <span className="dev-token__value">{value}</span>
            </div>
          ))}
        </TokenSection>
      )}

      {shadows && (
        <TokenSection label="Shadows">
          {Object.entries(shadows).map(([key, value]) =>
            value ? (
              <div key={key} className="dev-token">
                <div
                  className="dev-token__shadow-preview"
                  style={{ boxShadow: value === "none" ? undefined : value }}
                />
                <span className="dev-token__key">{key}</span>
                <span className="dev-token__value dev-token__value--truncate">{value}</span>
              </div>
            ) : null
          )}
        </TokenSection>
      )}

      {transitions && (
        <TokenSection label="Transitions">
          {Object.entries(transitions).map(([key, value]) =>
            value ? (
              <div key={key} className="dev-token">
                <span className="dev-token__key">{key}</span>
                <span className="dev-token__value">{value}</span>
              </div>
            ) : null
          )}
        </TokenSection>
      )}

      {pkg.tokens.borderRadius !== undefined && (
        <TokenSection label="Border Radius">
          <div className="dev-token">
            <div
              className="dev-token__radius-preview"
              style={{ borderRadius: pkg.tokens.borderRadius }}
            />
            <span className="dev-token__key">borderRadius</span>
            <span className="dev-token__value">{pkg.tokens.borderRadius}</span>
          </div>
        </TokenSection>
      )}
    </div>
  );
}

function TokenSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="dev-tokens__section">
      <div className="dev-tokens__section-label">{label}</div>
      {children}
    </div>
  );
}

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

function ThemePreview({
  pkg,
  pageView,
  isDark,
  notionRecordMap,
  onNotionLoad,
}: {
  pkg: NoxionThemePackage;
  pageView: PageView;
  isDark: boolean;
  notionRecordMap: ExtendedRecordMap | null;
  onNotionLoad: (recordMap: ExtendedRecordMap | null) => void;
}) {
  const scopedVars = useMemo(() => tokensToStyleVars(pkg.tokens, isDark), [pkg.tokens, isDark]);

  const SiteHeader = () => (
    <Header siteName="Noxion Preview" navigation={mockNavigation} />
  );
  const SiteFooter = () => (
    <Footer siteName="Noxion Preview" author="Theme Author" />
  );

  const SidebarSlot = () => (
    <DocsSidebar items={mockSidebarItems} currentSlug="docs/theme-system" />
  );

  const isDocsView = pageView === "docs-sidebar";
  const Layout = isDocsView ? DocsLayout : BlogLayout;
  const slots = isDocsView
    ? { header: SiteHeader, footer: SiteFooter, sidebar: SidebarSlot }
    : { header: SiteHeader, footer: SiteFooter };

  return (
    <div style={scopedVars as React.CSSProperties}>
      <NoxionThemeProvider themePackage={pkg} slots={slots}>
        <Layout slots={slots}>
          <PageContent pageView={pageView} notionRecordMap={notionRecordMap} onNotionLoad={onNotionLoad} />
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
      return <HomePage data={{ posts: mockPosts }} />;
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
            {loading ? "Loading…" : "Fetch"}
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
