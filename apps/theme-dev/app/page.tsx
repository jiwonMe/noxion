"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  validateTheme,
  useThemePreference,
} from "@noxion/renderer";
import type { NoxionThemePackage, NoxionThemeTokens, ValidationResult, ValidationIssue } from "@noxion/renderer";
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
  const [notionPageId, setNotionPageId] = useState("");
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
        pageView={pageView}
        notionPageId={notionPageId}
        onNotionPageIdChange={setNotionPageId}
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
            <PreviewFrame themeId={themeId} pageView={pageView} isDark={isDark} notionPageId={notionPageId} />
          </div>
        ) : (
          <div className="dev-compare" style={{ "--compare-viewport-width": VIEWPORT_WIDTHS[viewport] } as React.CSSProperties}>
            <div className="dev-compare__pane">
              <div className="dev-compare__label">{currentTheme.label}</div>
              <div className="dev-preview-frame">
                <PreviewFrame themeId={themeId} pageView={pageView} isDark={isDark} notionPageId={notionPageId} />
              </div>
            </div>
            <div className="dev-compare__divider" />
            <div className="dev-compare__pane">
              <div className="dev-compare__label">{compareTheme.label}</div>
              <div className="dev-preview-frame">
                <PreviewFrame themeId={compareThemeId} pageView={pageView} isDark={isDark} notionPageId={notionPageId} />
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
  pageView,
  notionPageId,
  onNotionPageIdChange,
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
  pageView: PageView;
  notionPageId: string;
  onNotionPageIdChange: (id: string) => void;
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

      {pageView === "notion" && (
        <>
          <div className="dev-toolbar__divider" />
          <NotionPageIdInput value={notionPageId} onSubmit={onNotionPageIdChange} />
        </>
      )}

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

function NotionPageIdInput({ value, onSubmit }: { value: string; onSubmit: (id: string) => void }) {
  const [input, setInput] = useState(value);

  useEffect(() => { setInput(value); }, [value]);

  const submit = useCallback(() => {
    const trimmed = input.trim();
    if (trimmed) onSubmit(trimmed);
  }, [input, onSubmit]);

  return (
    <div className="dev-toolbar__group dev-toolbar__notion-input">
      <span className="dev-toolbar__label">Page ID</span>
      <input
        className="dev-toolbar__input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        placeholder="Paste Notion page ID or URL"
        spellCheck={false}
        autoComplete="off"
      />
      <button
        className="dev-toolbar__btn dev-toolbar__btn--wide"
        onClick={submit}
        disabled={!input.trim()}
        title="Fetch Notion page"
      >
        Fetch
      </button>
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

function PreviewFrame({
  themeId,
  pageView,
  isDark,
  notionPageId,
}: {
  themeId: string;
  pageView: PageView;
  isDark: boolean;
  notionPageId: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const stateRef = useRef({ themeId, pageView, isDark, notionPageId });
  stateRef.current = { themeId, pageView, isDark, notionPageId };

  const sendState = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({
      type: "noxion-preview-state",
      ...stateRef.current,
    }, "*");
  }, []);

  useEffect(() => {
    if (readyRef.current) sendState();
  }, [themeId, pageView, isDark, notionPageId, sendState]);

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
