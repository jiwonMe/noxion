import type { ComponentType } from "react";
import type { NoxionTemplateMap, NoxionTemplateProps } from "./types";

const LEGACY_TO_NAMESPACED: Record<string, string> = {
  home: "blog/home",
  post: "blog/post",
  archive: "blog/archive",
  tag: "blog/tag",
};

const NAMESPACED_TO_LEGACY: Record<string, string> = {
  "blog/home": "home",
  "blog/post": "post",
  "blog/archive": "archive",
  "blog/tag": "tag",
};

function lookupTemplate(
  templateMap: Partial<NoxionTemplateMap>,
  key: string
): ComponentType<NoxionTemplateProps> | undefined {
  return templateMap[key];
}

export function resolveTemplate(
  templateMap: Partial<NoxionTemplateMap>,
  pageType: string,
  fallback?: ComponentType<NoxionTemplateProps>
): ComponentType<NoxionTemplateProps> | undefined {
  const direct = lookupTemplate(templateMap, pageType);
  if (direct) return direct;

  if (pageType in LEGACY_TO_NAMESPACED) {
    const namespaced = lookupTemplate(templateMap, LEGACY_TO_NAMESPACED[pageType]);
    if (namespaced) return namespaced;
  }

  if (pageType in NAMESPACED_TO_LEGACY) {
    const legacy = lookupTemplate(templateMap, NAMESPACED_TO_LEGACY[pageType]);
    if (legacy) return legacy;
  }

  if (pageType.includes("/")) {
    const basename = pageType.split("/").pop()!;
    const generic = lookupTemplate(templateMap, basename);
    if (generic) return generic;
  }

  return fallback ?? templateMap.home;
}
