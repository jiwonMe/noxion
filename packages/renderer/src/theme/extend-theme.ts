import type {
  NoxionThemePackage,
  NoxionThemeTokens,
  NoxionTheme,
  NoxionThemeColors,
  NoxionThemeFonts,
  NoxionThemeSpacing,
  NoxionThemeShadows,
  NoxionThemeTransitions,
  NoxionThemeBreakpoints,
  ComponentOverrides,
  NoxionTemplateMap,
  NoxionLayoutProps,
} from "./types";
import type { ComponentType } from "react";

type DeepPartialTokens = {
  name?: string;
  colors?: Partial<NoxionThemeColors>;
  fonts?: Partial<NoxionThemeFonts>;
  spacing?: Partial<NoxionThemeSpacing>;
  borderRadius?: string;
  shadows?: Partial<NoxionThemeShadows>;
  transitions?: Partial<NoxionThemeTransitions>;
  breakpoints?: Partial<NoxionThemeBreakpoints>;
  dark?: Partial<Omit<NoxionTheme, "name" | "dark">> & {
    colors?: Partial<NoxionThemeColors>;
  };
};

function mergeColors(
  parent: NoxionThemeColors,
  child: Partial<NoxionThemeColors> | undefined
): NoxionThemeColors {
  if (!child) return parent;
  const result: Record<string, string> = { ...parent };
  for (const [key, value] of Object.entries(child)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as NoxionThemeColors;
}

function deepMergeTokens(
  parent: NoxionThemeTokens,
  child: DeepPartialTokens
): NoxionThemeTokens {
  const merged: NoxionThemeTokens = {
    ...parent,
    name: child.name ?? parent.name,
    colors: mergeColors(parent.colors, child.colors),
  };

  if (child.fonts || parent.fonts) {
    merged.fonts = { ...parent.fonts, ...child.fonts };
  }
  if (child.spacing || parent.spacing) {
    merged.spacing = { ...parent.spacing, ...child.spacing } as NoxionThemeTokens["spacing"];
  }
  if (child.borderRadius !== undefined) {
    merged.borderRadius = child.borderRadius;
  }
  if (child.shadows || parent.shadows) {
    merged.shadows = { ...parent.shadows, ...child.shadows };
  }
  if (child.transitions || parent.transitions) {
    merged.transitions = { ...parent.transitions, ...child.transitions };
  }
  if (child.breakpoints || parent.breakpoints) {
    merged.breakpoints = { ...parent.breakpoints, ...child.breakpoints };
  }

  if (child.dark || parent.dark) {
    const parentDark = (parent.dark ?? {}) as Partial<NoxionTheme>;
    const childDark = child.dark ?? {};
    const darkResult: Partial<Omit<NoxionTheme, "name" | "dark">> = {
      ...parentDark,
      ...childDark,
    };
    if (parentDark.colors || childDark.colors) {
      darkResult.colors = mergeColors(
        parentDark.colors ?? parent.colors,
        childDark.colors
      );
    }
    if (parentDark.fonts || childDark.fonts) {
      darkResult.fonts = { ...parentDark.fonts, ...childDark.fonts };
    }
    merged.dark = darkResult;
  }

  return merged;
}

function mergeComponents(
  parent: Partial<ComponentOverrides>,
  child: Partial<ComponentOverrides>
): Partial<ComponentOverrides> {
  const merged: Partial<ComponentOverrides> = { ...parent };

  for (const key of Object.keys(child) as (keyof ComponentOverrides)[]) {
    if (key === "NotionBlock") {
      merged.NotionBlock = {
        ...parent.NotionBlock,
        ...child.NotionBlock,
      };
    } else {
      (merged as Record<string, unknown>)[key] = child[key];
    }
  }

  return merged;
}

function mergeLayouts(
  parent: Record<string, ComponentType<NoxionLayoutProps>>,
  child: Record<string, ComponentType<NoxionLayoutProps>>
): Record<string, ComponentType<NoxionLayoutProps>> {
  return { ...parent, ...child };
}

function mergeTemplates(
  parent: Partial<NoxionTemplateMap>,
  child: Partial<NoxionTemplateMap>
): Partial<NoxionTemplateMap> {
  return { ...parent, ...child };
}

function mergeSupports(
  parent: string[] | undefined,
  child: string[] | undefined
): string[] | undefined {
  if (!parent && !child) return undefined;
  const set = new Set([...(parent ?? []), ...(child ?? [])]);
  return [...set];
}

export interface ExtendThemeOverrides {
  name?: string;
  tokens?: DeepPartialTokens;
  layouts?: Record<string, ComponentType<NoxionLayoutProps>>;
  templates?: Partial<NoxionTemplateMap>;
  components?: Partial<ComponentOverrides>;
  stylesheet?: string;
  supports?: string[];
}

export function extendTheme(
  parent: NoxionThemePackage,
  overrides: ExtendThemeOverrides
): NoxionThemePackage {
  return {
    name: overrides.name ?? parent.name,
    tokens: overrides.tokens
      ? deepMergeTokens(parent.tokens, overrides.tokens)
      : parent.tokens,
    layouts: overrides.layouts
      ? mergeLayouts(parent.layouts, overrides.layouts)
      : parent.layouts,
    templates: overrides.templates
      ? mergeTemplates(parent.templates, overrides.templates)
      : parent.templates,
    components: overrides.components
      ? mergeComponents(parent.components, overrides.components)
      : parent.components,
    stylesheet: overrides.stylesheet ?? parent.stylesheet,
    supports: mergeSupports(parent.supports, overrides.supports),
    metadata: overrides.name
      ? { ...parent.metadata }
      : parent.metadata,
  };
}
