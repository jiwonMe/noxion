import type { NoxionPage, NoxionConfig } from "@noxion/core";

export interface NoxionRouteConfig {
  pageType: string;
  pathPrefix: string;
  paramName: string;
}

const DEFAULT_ROUTE_CONFIGS: Record<string, NoxionRouteConfig> = {
  blog: { pageType: "blog", pathPrefix: "", paramName: "slug" },
  docs: { pageType: "docs", pathPrefix: "/docs", paramName: "slug" },
  portfolio: { pageType: "portfolio", pathPrefix: "/projects", paramName: "slug" },
};

export function generateNoxionRoutes(
  config: NoxionConfig
): NoxionRouteConfig[] {
  const collections = config.collections;

  if (!collections || collections.length === 0) {
    return [DEFAULT_ROUTE_CONFIGS.blog];
  }

  return collections.map((col) => {
    const defaultRoute = DEFAULT_ROUTE_CONFIGS[col.pageType];
    return {
      pageType: col.pageType,
      pathPrefix: col.pathPrefix ?? defaultRoute?.pathPrefix ?? `/${col.pageType}`,
      paramName: "slug",
    };
  });
}

export function resolvePageType(
  path: string,
  routes: NoxionRouteConfig[]
): NoxionRouteConfig | undefined {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  const sorted = [...routes].sort(
    (a, b) => b.pathPrefix.length - a.pathPrefix.length
  );

  for (const route of sorted) {
    if (route.pathPrefix === "") {
      continue;
    }
    if (normalized.startsWith(route.pathPrefix + "/") || normalized === route.pathPrefix) {
      return route;
    }
  }

  const defaultRoute = routes.find((r) => r.pathPrefix === "");
  return defaultRoute;
}

export function buildPageUrl(
  page: NoxionPage,
  routes: NoxionRouteConfig[]
): string {
  const route = routes.find((r) => r.pageType === page.pageType);
  if (!route) {
    return `/${page.slug}`;
  }
  if (route.pathPrefix === "") {
    return `/${page.slug}`;
  }
  return `${route.pathPrefix}/${page.slug}`;
}

export function generateStaticParamsForRoute(
  pages: NoxionPage[],
  route: NoxionRouteConfig
): { slug: string }[] {
  return pages
    .filter((p) => p.pageType === route.pageType)
    .map((p) => ({ slug: p.slug }));
}
