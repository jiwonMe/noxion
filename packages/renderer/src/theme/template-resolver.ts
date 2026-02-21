import type { ComponentType } from "react";
import type { NoxionTemplateMap, NoxionTemplateProps } from "./types";

export function resolveTemplate(
  templateMap: Partial<NoxionTemplateMap>,
  pageType: string,
  fallback?: ComponentType<NoxionTemplateProps>
): ComponentType<NoxionTemplateProps> | undefined {
  return templateMap[pageType] ?? fallback ?? templateMap.home;
}
