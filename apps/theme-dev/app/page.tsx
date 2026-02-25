"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  validateThemeContract,
  useThemePreference,
} from "@noxion/renderer";
import type { NoxionThemeContract, ValidationResult, ValidationIssue } from "@noxion/renderer";
import {
  Sun,
  Moon,
  Monitor,
  Tablet,
  Smartphone,
  Columns2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { themeRegistry, type ThemeEntry } from "@/lib/themes";

type PageView = "home" | "archive" | "tag" | "portfolio" | "docs-sidebar" | "notion";
type DevPanel = "none" | "validator";
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
  const [devPanel, setDevPanel] = useState<DevPanel>("none");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [notionPageId, setNotionPageId] = useState("");
  const { resolved: resolvedMode, setPreference: setThemePreference } = useThemePreference();
  const isDark = resolvedMode === "dark";

  const currentTheme = themeRegistry.find((t) => t.id === themeId) ?? themeRegistry[0]!;
  const compareTheme = themeRegistry.find((t) => t.id === compareThemeId) ?? themeRegistry[1]!;
  const contract = currentTheme.contract;

  const validation = useMemo(() => validateThemeContract(contract), [contract]);
  const compareValidation = useMemo(
    () => (viewMode === "compare" ? validateThemeContract(compareTheme.contract) : null),
    [viewMode, compareTheme.contract]
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

  const errorCount = validation.issues.filter((i) => i.severity === "error").length;
  const warnCount = validation.issues.filter((i) => i.severity === "warning").length;

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
              <NotionPageIdInput value={notionPageId} onSubmit={setNotionPageId} />
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

          <button
            className={`dev-header__icon-btn ${devPanel === "validator" ? "dev-header__icon-btn--active" : ""}`}
            onClick={() => togglePanel("validator")}
            title="Validation"
          >
            <Check size={14} />
          </button>

          {errorCount > 0 ? (
            <span className="dev-header__badge dev-header__badge--error">{errorCount}</span>
          ) : warnCount > 0 ? (
            <span className="dev-header__badge dev-header__badge--warn">{warnCount}</span>
          ) : (
            <span className="dev-header__badge dev-header__badge--valid">
              <CheckCircle size={10} />
            </span>
          )}
        </div>
      </header>

      <div className="dev-main">
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

        {devPanel !== "none" && (
          <aside className="dev-drawer">
            <div className="dev-drawer__header">
              <span className="dev-drawer__title">Validation</span>
              <button className="dev-drawer__close" onClick={() => setDevPanel("none")}>
                <X size={14} />
              </button>
            </div>
            <div className="dev-drawer__body">
              <ValidationContent validation={validation} compareValidation={compareValidation} />
            </div>
          </aside>
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
    <div className="dev-header__group dev-header__notion-input">
      <input
        className="dev-header__input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
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
    </div>
  );
}

function ValidationContent({
  validation,
  compareValidation,
}: {
  validation: ValidationResult;
  compareValidation: ValidationResult | null;
}) {
  return (
    <>
      <ValidationList validation={validation} />
      {compareValidation && (
        <>
          <div className="dev-drawer__divider" />
          <ValidationList validation={compareValidation} />
        </>
      )}
    </>
  );
}

function ValidationList({ validation }: { validation: ValidationResult }) {
  if (validation.issues.length === 0) {
    return (
      <div className="dev-validation__success">
        <CheckCircle size={12} /> No issues found.
      </div>
    );
  }

  return (
    <div className="dev-validation__issues">
      {validation.issues.map((issue: ValidationIssue, i: number) => (
        <div
          key={i}
          className={`dev-validation__issue dev-validation__issue--${issue.severity}`}
        >
          <span className="dev-validation__icon">
            {issue.severity === "error" ? <XCircle size={12} /> : <AlertTriangle size={12} />}
          </span>
          <span className="dev-validation__path">{issue.path}</span>
          <span className="dev-validation__msg">{issue.message}</span>
        </div>
      ))}
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
