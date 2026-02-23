import { describe, it, expect } from "bun:test";
import { generateNoxionRoutes, resolvePageType, buildPageUrl, generateStaticParamsForRoute } from "../routes";
import type { NoxionRouteConfig } from "../routes";
import type { NoxionConfig, NoxionPage } from "@noxion/core";

const baseConfig: NoxionConfig = {
  rootNotionPageId: "test-id",
  name: "Test Site",
  domain: "test.com",
  author: "Test",
  description: "Test site",
  language: "en",
  defaultTheme: "system",
  defaultPageType: "blog",
  revalidate: 3600,
};

const makePage = (overrides: Partial<NoxionPage>): NoxionPage => ({
  id: "p1",
  title: "Test",
  slug: "test-page",
  pageType: "blog",
  published: true,
  lastEditedTime: "2024-01-01T00:00:00.000Z",
  metadata: {},
  ...overrides,
});

describe("generateNoxionRoutes", () => {
  it("returns blog-only route when no collections", () => {
    const routes = generateNoxionRoutes(baseConfig);
    expect(routes).toHaveLength(1);
    expect(routes[0].pageType).toBe("blog");
    expect(routes[0].pathPrefix).toBe("");
  });

  it("generates routes from collections", () => {
    const config: NoxionConfig = {
      ...baseConfig,
      collections: [
        { databaseId: "db1", pageType: "blog" },
        { databaseId: "db2", pageType: "docs", pathPrefix: "/docs" },
        { databaseId: "db3", pageType: "portfolio", pathPrefix: "/projects" },
      ],
    };
    const routes = generateNoxionRoutes(config);
    expect(routes).toHaveLength(3);
    expect(routes[0].pathPrefix).toBe("");
    expect(routes[1].pathPrefix).toBe("/docs");
    expect(routes[2].pathPrefix).toBe("/projects");
  });

  it("uses default path prefix when collection has no pathPrefix", () => {
    const config: NoxionConfig = {
      ...baseConfig,
      collections: [
        { databaseId: "db1", pageType: "docs" },
      ],
    };
    const routes = generateNoxionRoutes(config);
    expect(routes[0].pathPrefix).toBe("/docs");
  });

  it("falls back to pageType-based prefix for unknown types", () => {
    const config: NoxionConfig = {
      ...baseConfig,
      collections: [
        { databaseId: "db1", pageType: "wiki" },
      ],
    };
    const routes = generateNoxionRoutes(config);
    expect(routes[0].pathPrefix).toBe("/wiki");
  });

  it("respects custom pathPrefix override", () => {
    const config: NoxionConfig = {
      ...baseConfig,
      collections: [
        { databaseId: "db1", pageType: "docs", pathPrefix: "/documentation" },
      ],
    };
    const routes = generateNoxionRoutes(config);
    expect(routes[0].pathPrefix).toBe("/documentation");
  });
});

describe("resolvePageType", () => {
  const routes: NoxionRouteConfig[] = [
    { pageType: "blog", pathPrefix: "", paramName: "slug" },
    { pageType: "docs", pathPrefix: "/docs", paramName: "slug" },
    { pageType: "portfolio", pathPrefix: "/projects", paramName: "slug" },
  ];

  it("resolves docs path", () => {
    const result = resolvePageType("/docs/getting-started", routes);
    expect(result?.pageType).toBe("docs");
  });

  it("resolves portfolio path", () => {
    const result = resolvePageType("/projects/my-app", routes);
    expect(result?.pageType).toBe("portfolio");
  });

  it("resolves blog path (default/empty prefix)", () => {
    const result = resolvePageType("/my-blog-post", routes);
    expect(result?.pageType).toBe("blog");
  });

  it("resolves exact prefix path", () => {
    const result = resolvePageType("/docs", routes);
    expect(result?.pageType).toBe("docs");
  });

  it("handles path without leading slash", () => {
    const result = resolvePageType("docs/something", routes);
    expect(result?.pageType).toBe("docs");
  });

  it("returns undefined when no routes match and no default", () => {
    const noDefault: NoxionRouteConfig[] = [
      { pageType: "docs", pathPrefix: "/docs", paramName: "slug" },
    ];
    const result = resolvePageType("/unknown", noDefault);
    expect(result).toBeUndefined();
  });

  it("prefers longer prefix match", () => {
    const nested: NoxionRouteConfig[] = [
      { pageType: "docs", pathPrefix: "/docs", paramName: "slug" },
      { pageType: "api-docs", pathPrefix: "/docs/api", paramName: "slug" },
    ];
    const result = resolvePageType("/docs/api/users", nested);
    expect(result?.pageType).toBe("api-docs");
  });
});

describe("buildPageUrl", () => {
  const routes: NoxionRouteConfig[] = [
    { pageType: "blog", pathPrefix: "", paramName: "slug" },
    { pageType: "docs", pathPrefix: "/docs", paramName: "slug" },
    { pageType: "portfolio", pathPrefix: "/projects", paramName: "slug" },
  ];

  it("builds blog URL without prefix", () => {
    const page = makePage({ slug: "hello-world", pageType: "blog" });
    expect(buildPageUrl(page, routes)).toBe("/hello-world");
  });

  it("builds docs URL with prefix", () => {
    const page = makePage({ slug: "getting-started", pageType: "docs" });
    expect(buildPageUrl(page, routes)).toBe("/docs/getting-started");
  });

  it("builds portfolio URL with prefix", () => {
    const page = makePage({ slug: "my-project", pageType: "portfolio" });
    expect(buildPageUrl(page, routes)).toBe("/projects/my-project");
  });

  it("falls back to /{slug} for unknown page type", () => {
    const page = makePage({ slug: "something", pageType: "custom" });
    expect(buildPageUrl(page, routes)).toBe("/something");
  });
});

describe("generateStaticParamsForRoute", () => {
  const pages: NoxionPage[] = [
    makePage({ id: "1", slug: "post-1", pageType: "blog" }),
    makePage({ id: "2", slug: "post-2", pageType: "blog" }),
    makePage({ id: "3", slug: "intro", pageType: "docs" }),
    makePage({ id: "4", slug: "my-app", pageType: "portfolio" }),
  ];

  it("returns params for matching page type only", () => {
    const route: NoxionRouteConfig = { pageType: "blog", pathPrefix: "", paramName: "slug" };
    const params = generateStaticParamsForRoute(pages, route);
    expect(params).toEqual([{ slug: "post-1" }, { slug: "post-2" }]);
  });

  it("returns docs params", () => {
    const route: NoxionRouteConfig = { pageType: "docs", pathPrefix: "/docs", paramName: "slug" };
    const params = generateStaticParamsForRoute(pages, route);
    expect(params).toEqual([{ slug: "intro" }]);
  });

  it("returns empty for no matching pages", () => {
    const route: NoxionRouteConfig = { pageType: "wiki", pathPrefix: "/wiki", paramName: "slug" };
    const params = generateStaticParamsForRoute(pages, route);
    expect(params).toEqual([]);
  });
});
