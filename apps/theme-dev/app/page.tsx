"use client";

import { useState, useMemo } from "react";
import {
  NoxionThemeProvider,
  Header,
  Footer,
  BlogLayout,
  DocsLayout,
  BaseLayout,
  validateTheme,
  formatValidationResult,
} from "@noxion/renderer";
import type { NoxionThemePackage, ValidationResult } from "@noxion/renderer";
import { themeRegistry } from "@/lib/themes";
import { mockPosts, mockProjects, mockNavigation, mockSidebarItems } from "@/lib/mock-data";
import { HomePage, ArchivePage, TagPage, PortfolioGrid } from "@noxion/renderer";
import { DocsSidebar } from "@noxion/renderer";

type PageView = "home" | "archive" | "tag" | "portfolio" | "docs-sidebar";
type ColorMode = "light" | "dark";
type DevPanel = "none" | "validator" | "tokens";

const PAGE_VIEWS: { id: PageView; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "archive", label: "Archive" },
  { id: "tag", label: "Tag" },
  { id: "portfolio", label: "Portfolio" },
  { id: "docs-sidebar", label: "Docs Sidebar" },
];

export default function ThemeDevPage() {
  const [themeId, setThemeId] = useState("default");
  const [pageView, setPageView] = useState<PageView>("home");
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const [devPanel, setDevPanel] = useState<DevPanel>("none");

  const currentTheme = themeRegistry.find((t) => t.id === themeId) ?? themeRegistry[0];
  const pkg = currentTheme.pkg;

  const validation = useMemo(() => validateTheme(pkg), [pkg]);

  return (
    <>
      <Toolbar
        themeId={themeId}
        onThemeChange={setThemeId}
        colorMode={colorMode}
        onColorModeToggle={() => setColorMode((m) => (m === "light" ? "dark" : "light"))}
        validation={validation}
        devPanel={devPanel}
        onDevPanelToggle={(panel) => setDevPanel((p) => (p === panel ? "none" : panel))}
      />

      <PageTabs pageView={pageView} onPageViewChange={setPageView} />

      {devPanel === "validator" && <ValidatorPanel validation={validation} />}
      {devPanel === "tokens" && <TokenPanel pkg={pkg} />}

      <div className="dev-preview" data-theme={colorMode}>
        <ThemePreview pkg={pkg} pageView={pageView} colorMode={colorMode} />
      </div>
    </>
  );
}

function Toolbar({
  themeId,
  onThemeChange,
  colorMode,
  onColorModeToggle,
  validation,
  devPanel,
  onDevPanelToggle,
}: {
  themeId: string;
  onThemeChange: (id: string) => void;
  colorMode: ColorMode;
  onColorModeToggle: () => void;
  validation: ValidationResult;
  devPanel: DevPanel;
  onDevPanelToggle: (panel: DevPanel) => void;
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
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="dev-toolbar__group">
        <span className="dev-toolbar__label">Mode</span>
        <button className="dev-toolbar__btn" onClick={onColorModeToggle} title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}>
          {colorMode === "light" ? "☀" : "☾"}
        </button>
      </div>

      <div className="dev-toolbar__group">
        <button
          className={`dev-toolbar__btn ${devPanel === "tokens" ? "dev-toolbar__btn--active" : ""}`}
          onClick={() => onDevPanelToggle("tokens")}
          title="Token inspector"
        >
          T
        </button>
      </div>

      <div className="dev-toolbar__validator">
        <button
          className={`dev-toolbar__btn ${devPanel === "validator" ? "dev-toolbar__btn--active" : ""}`}
          onClick={() => onDevPanelToggle("validator")}
          title="Validator"
        >
          V
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

function ValidatorPanel({ validation }: { validation: ValidationResult }) {
  if (validation.issues.length === 0) {
    return (
      <div className="dev-validator-panel">
        <div className="dev-validator-panel__success">✓ Theme is valid. No issues found.</div>
      </div>
    );
  }

  return (
    <div className="dev-validator-panel">
      <div className="dev-validator-panel__title">Validation Results</div>
      {validation.issues.map((issue, i) => (
        <div
          key={i}
          className={`dev-validator-panel__issue dev-validator-panel__issue--${issue.severity}`}
        >
          {issue.severity === "error" ? "✗" : "⚠"} [{issue.path}] {issue.message}
        </div>
      ))}
    </div>
  );
}

function TokenPanel({ pkg }: { pkg: NoxionThemePackage }) {
  const { colors, fonts, spacing } = pkg.tokens;

  return (
    <div className="dev-token-panel">
      <div className="dev-token-panel__title">Design Tokens — {pkg.name}</div>

      <div className="dev-token-panel__section">
        <div className="dev-token-panel__section-label">Colors</div>
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="dev-token-row">
            <div className="dev-token-row__swatch" style={{ background: value }} />
            <span className="dev-token-row__key">--noxion-{key}</span>
            <span className="dev-token-row__value">{value}</span>
          </div>
        ))}
      </div>

      {fonts && (
        <div className="dev-token-panel__section">
          <div className="dev-token-panel__section-label">Fonts</div>
          {Object.entries(fonts).map(([key, value]) =>
            value ? (
              <div key={key} className="dev-token-row">
                <span className="dev-token-row__key">--noxion-font-{key}</span>
                <span className="dev-token-row__value">{value}</span>
              </div>
            ) : null
          )}
        </div>
      )}

      {spacing && (
        <div className="dev-token-panel__section">
          <div className="dev-token-panel__section-label">Spacing</div>
          {Object.entries(spacing).map(([key, value]) => (
            <div key={key} className="dev-token-row">
              <span className="dev-token-row__key">--noxion-spacing-{key}</span>
              <span className="dev-token-row__value">{value}</span>
            </div>
          ))}
        </div>
      )}

      {pkg.tokens.shadows && (
        <div className="dev-token-panel__section">
          <div className="dev-token-panel__section-label">Shadows</div>
          {Object.entries(pkg.tokens.shadows).map(([key, value]) =>
            value ? (
              <div key={key} className="dev-token-row">
                <span className="dev-token-row__key">--noxion-shadow-{key}</span>
                <span className="dev-token-row__value">{value}</span>
              </div>
            ) : null
          )}
        </div>
      )}

      {pkg.tokens.transitions && (
        <div className="dev-token-panel__section">
          <div className="dev-token-panel__section-label">Transitions</div>
          {Object.entries(pkg.tokens.transitions).map(([key, value]) =>
            value ? (
              <div key={key} className="dev-token-row">
                <span className="dev-token-row__key">--noxion-transition-{key}</span>
                <span className="dev-token-row__value">{value}</span>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

function ThemePreview({
  pkg,
  pageView,
  colorMode,
}: {
  pkg: NoxionThemePackage;
  pageView: PageView;
  colorMode: ColorMode;
}) {
  const SiteHeader = () => (
    <Header siteName="Noxion Preview" navigation={mockNavigation} />
  );
  const SiteFooter = () => (
    <Footer siteName="Noxion Preview" author="Theme Author" />
  );

  const slots = { header: SiteHeader, footer: SiteFooter };
  const Layout = pageView === "docs-sidebar" ? DocsLayout : BlogLayout;

  return (
    <NoxionThemeProvider themePackage={pkg} slots={slots}>
      <Layout slots={slots}>
        <PageContent pageView={pageView} />
      </Layout>
    </NoxionThemeProvider>
  );
}

function PageContent({ pageView }: { pageView: PageView }) {
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
      return (
        <div style={{ display: "flex", gap: "2rem" }}>
          <DocsSidebar items={mockSidebarItems} currentSlug="docs/theme-system" />
          <div style={{ flex: 1 }}>
            <h1>Theme System</h1>
            <p>
              Noxion uses a CSS variable-based theme system with full dark mode support.
              Themes are defined as <code>NoxionThemePackage</code> objects containing
              design tokens, layouts, templates, and component overrides.
            </p>
            <h2>Design Tokens</h2>
            <p>
              Tokens define colors, fonts, spacing, shadows, transitions, and breakpoints.
              They are converted to CSS custom properties at runtime with the
              <code>--noxion-</code> prefix.
            </p>
            <h2>Extending Themes</h2>
            <p>
              Use <code>extendTheme()</code> to create a new theme based on an existing one.
              Only specify the tokens and components you want to override — everything else
              is inherited from the parent theme.
            </p>
          </div>
        </div>
      );
  }
}
