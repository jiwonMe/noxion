import { describe, it, expect } from "bun:test";
import { defineTheme, defaultTheme } from "../theme/define-theme";
import { resolveComponents } from "../theme/component-resolver";
import type {
  NoxionTheme,
  NoxionThemeColors,
  NoxionThemeFonts,
  NoxionThemeSpacing,
  ComponentOverrides,
  NoxionLayout,
  HeaderProps,
  FooterProps,
  PostCardProps,
  PostListProps,
  NotionPageProps,
  TOCProps,
  SearchProps,
  TagFilterProps,
  NoxionThemeTokens,
  NoxionThemeShadows,
  NoxionThemeTransitions,
  NoxionThemeBreakpoints,
  NoxionSlotMap,
  NoxionTemplateMap,
  NoxionThemePackage,
  NoxionLayoutProps,
  NoxionTemplateProps,
} from "../theme/types";
import type { ComponentType, ReactNode } from "react";

describe("backward compatibility", () => {
  it("existing NoxionTheme type still works with defineTheme", () => {
    const theme: NoxionTheme = {
      name: "compat",
      colors: {
        primary: "#000",
        primaryForeground: "#fff",
        background: "#fff",
        foreground: "#000",
        muted: "#f5f5f5",
        mutedForeground: "#737373",
        border: "#e5e5e5",
        accent: "#f5f5f5",
        accentForeground: "#171717",
        card: "#fff",
        cardForeground: "#000",
      },
    };
    const result = defineTheme(theme);
    expect(result).toEqual(theme);
  });

  it("defaultTheme is assignable to NoxionTheme", () => {
    const theme: NoxionTheme = defaultTheme;
    expect(theme.name).toBe("default");
  });

  it("existing ComponentOverrides type is still valid", () => {
    const overrides: ComponentOverrides = {
      Header: (() => null) as ComponentType<HeaderProps>,
    };
    expect(overrides.Header).toBeDefined();
  });

  it("existing NoxionLayout type is still valid", () => {
    const layout: NoxionLayout = "single-column";
    expect(layout).toBe("single-column");
    const layout2: NoxionLayout = "sidebar-left";
    expect(layout2).toBe("sidebar-left");
  });

  it("resolveComponents still works with ComponentOverrides", () => {
    const MockHeader = (() => null) as ComponentType<HeaderProps>;
    const defaults: ComponentOverrides = { Header: MockHeader };
    const resolved = resolveComponents(defaults, {});
    expect(resolved.Header).toBe(MockHeader);
  });
});

describe("NoxionThemeTokens", () => {
  it("extends NoxionTheme with new token categories", () => {
    const tokens: NoxionThemeTokens = {
      name: "test-tokens",
      colors: {
        primary: "#2563eb",
        primaryForeground: "#fff",
        background: "#fff",
        foreground: "#000",
        muted: "#f5f5f5",
        mutedForeground: "#737373",
        border: "#e5e5e5",
        accent: "#f5f5f5",
        accentForeground: "#171717",
        card: "#fff",
        cardForeground: "#000",
      },
      shadows: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.1)",
        lg: "0 10px 15px rgba(0,0,0,0.1)",
      },
      transitions: {
        fast: "150ms ease",
        normal: "200ms ease",
        slow: "300ms ease",
      },
      breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    };
    expect(tokens.name).toBe("test-tokens");
    expect(tokens.shadows?.sm).toBeDefined();
    expect(tokens.transitions?.normal).toBeDefined();
    expect(tokens.breakpoints?.lg).toBeDefined();
  });

  it("is assignable to NoxionTheme (superset)", () => {
    const tokens: NoxionThemeTokens = {
      name: "superset",
      colors: {
        primary: "#000",
        primaryForeground: "#fff",
        background: "#fff",
        foreground: "#000",
        muted: "#f5f5f5",
        mutedForeground: "#737373",
        border: "#e5e5e5",
        accent: "#f5f5f5",
        accentForeground: "#171717",
        card: "#fff",
        cardForeground: "#000",
      },
    };
    const theme: NoxionTheme = tokens;
    expect(theme.name).toBe("superset");
  });
});

describe("NoxionSlotMap", () => {
  it("defines slots for layout components", () => {
    const MockHeader = (() => null) as ComponentType<HeaderProps>;
    const MockFooter = (() => null) as ComponentType<FooterProps>;
    const slots: NoxionSlotMap = {
      header: MockHeader,
      footer: MockFooter,
    };
    expect(slots.header).toBe(MockHeader);
    expect(slots.footer).toBe(MockFooter);
  });

  it("allows null to disable a slot", () => {
    const slots: NoxionSlotMap = {
      header: null,
      sidebar: null,
    };
    expect(slots.header).toBeNull();
    expect(slots.sidebar).toBeNull();
  });

  it("supports all standard slot positions", () => {
    const slots: NoxionSlotMap = {
      header: null,
      footer: null,
      sidebar: null,
      hero: null,
      breadcrumb: null,
      toc: null,
    };
    expect(Object.keys(slots)).toHaveLength(6);
  });
});

describe("NoxionTemplateMap", () => {
  it("maps page types to template components", () => {
    const HomePage = (() => null) as ComponentType<NoxionTemplateProps>;
    const PostPage = (() => null) as ComponentType<NoxionTemplateProps>;

    const templates: NoxionTemplateMap = {
      home: HomePage,
      post: PostPage,
    };
    expect(templates.home).toBe(HomePage);
    expect(templates.post).toBe(PostPage);
  });

  it("supports all standard page types", () => {
    const MockTemplate = (() => null) as ComponentType<NoxionTemplateProps>;
    const templates: NoxionTemplateMap = {
      home: MockTemplate,
      post: MockTemplate,
      archive: MockTemplate,
      tag: MockTemplate,
    };
    expect(Object.keys(templates)).toHaveLength(4);
  });

  it("allows custom page types via index signature", () => {
    const MockTemplate = (() => null) as ComponentType<NoxionTemplateProps>;
    const templates: NoxionTemplateMap = {
      home: MockTemplate,
      portfolio: MockTemplate,
      about: MockTemplate,
    };
    expect(templates.portfolio).toBe(MockTemplate);
  });
});

describe("NoxionThemePackage", () => {
  it("defines a complete theme package", () => {
    const MockComponent = (() => null) as ComponentType<any>;
    const MockTemplate = (() => null) as ComponentType<NoxionTemplateProps>;

    const pkg: NoxionThemePackage = {
      name: "default",
      tokens: {
        name: "default",
        colors: {
          primary: "#2563eb",
          primaryForeground: "#fff",
          background: "#fff",
          foreground: "#000",
          muted: "#f5f5f5",
          mutedForeground: "#737373",
          border: "#e5e5e5",
          accent: "#f5f5f5",
          accentForeground: "#171717",
          card: "#fff",
          cardForeground: "#000",
        },
      },
      layouts: {
        blog: MockComponent,
      },
      templates: {
        home: MockTemplate,
        post: MockTemplate,
      },
      components: {
        Header: MockComponent,
      },
    };
    expect(pkg.name).toBe("default");
    expect(pkg.tokens.colors.primary).toBe("#2563eb");
    expect(pkg.layouts.blog).toBe(MockComponent);
    expect(pkg.templates.home).toBe(MockTemplate);
  });

  it("supports optional stylesheet path", () => {
    const pkg: NoxionThemePackage = {
      name: "with-styles",
      tokens: {
        name: "with-styles",
        colors: {
          primary: "#000",
          primaryForeground: "#fff",
          background: "#fff",
          foreground: "#000",
          muted: "#f5f5f5",
          mutedForeground: "#737373",
          border: "#e5e5e5",
          accent: "#f5f5f5",
          accentForeground: "#171717",
          card: "#fff",
          cardForeground: "#000",
        },
      },
      layouts: {},
      templates: {},
      components: {},
      stylesheet: "@noxion/theme-default/styles",
    };
    expect(pkg.stylesheet).toBe("@noxion/theme-default/styles");
  });

  it("requires name, tokens, layouts, templates, components", () => {
    const minimal: NoxionThemePackage = {
      name: "minimal",
      tokens: {
        name: "minimal",
        colors: {
          primary: "#000",
          primaryForeground: "#fff",
          background: "#fff",
          foreground: "#000",
          muted: "#f5f5f5",
          mutedForeground: "#737373",
          border: "#e5e5e5",
          accent: "#f5f5f5",
          accentForeground: "#171717",
          card: "#fff",
          cardForeground: "#000",
        },
      },
      layouts: {},
      templates: {},
      components: {},
    };
    expect(minimal.name).toBe("minimal");
  });
});

describe("NoxionLayoutProps", () => {
  it("defines layout component props", () => {
    const props: NoxionLayoutProps = {
      slots: {
        header: null,
      },
      children: null as unknown as ReactNode,
    };
    expect(props.slots).toBeDefined();
    expect(props.children).toBeDefined();
  });

  it("supports optional className", () => {
    const props: NoxionLayoutProps = {
      slots: {},
      children: null as unknown as ReactNode,
      className: "custom-layout",
    };
    expect(props.className).toBe("custom-layout");
  });
});

describe("NoxionTemplateProps", () => {
  it("defines template component props", () => {
    const props: NoxionTemplateProps = {
      data: { posts: [] },
    };
    expect(props.data).toBeDefined();
  });

  it("supports optional layout and slot overrides", () => {
    const MockLayout = (() => null) as ComponentType<NoxionLayoutProps>;
    const props: NoxionTemplateProps = {
      data: {},
      layout: MockLayout,
      slots: { header: null },
      className: "custom-template",
    };
    expect(props.layout).toBe(MockLayout);
    expect(props.slots?.header).toBeNull();
    expect(props.className).toBe("custom-template");
  });
});

describe("NoxionLayout extended", () => {
  it("still supports original values", () => {
    const layouts: NoxionLayout[] = ["single-column", "sidebar-left", "sidebar-right"];
    expect(layouts).toHaveLength(3);
  });
});
