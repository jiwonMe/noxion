"use client";

import React, { createContext, useContext, useMemo } from "react";
import type {
  NoxionTheme,
  NoxionThemeTokens,
  NoxionThemePackage,
  ComponentOverrides,
  NoxionLayout,
  NoxionSlotMap,
  NoxionTemplateMap,
  NoxionTemplateProps,
} from "./types";
import { defaultTheme } from "./define-theme";
import { generateCSSVariables, generateThemeStylesheet } from "./css-generator";
import { resolveComponents } from "./component-resolver";
import { resolveSlots } from "./slot-resolver";
import { resolveTemplate } from "./template-resolver";
import type { ComponentType } from "react";

interface ThemeContextValue {
  theme: NoxionTheme;
  tokens: NoxionThemeTokens;
  components: ComponentOverrides;
  layout: NoxionLayout;
  slots: Partial<NoxionSlotMap>;
  templates: Partial<NoxionTemplateMap>;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  tokens: defaultTheme,
  components: {},
  layout: "single-column",
  slots: {},
  templates: {},
});

export interface NoxionThemeProviderProps {
  theme?: NoxionTheme;
  themePackage?: NoxionThemePackage;
  components?: ComponentOverrides;
  defaultComponents?: ComponentOverrides;
  layout?: NoxionLayout;
  slots?: Partial<NoxionSlotMap>;
  templates?: Partial<NoxionTemplateMap>;
  children: React.ReactNode;
}

export function NoxionThemeProvider({
  theme,
  themePackage,
  components: overrides = {},
  defaultComponents = {},
  layout = "single-column",
  slots: slotOverrides = {},
  templates: templateOverrides = {},
  children,
}: NoxionThemeProviderProps) {
  const resolvedTheme = theme ?? themePackage?.tokens ?? defaultTheme;

  const cssVariables = useMemo(() => {
    if (themePackage) {
      return generateThemeStylesheet(themePackage);
    }
    return generateCSSVariables(resolvedTheme);
  }, [themePackage, resolvedTheme]);

  const resolvedComponents = useMemo(() => {
    const pkgComponents = themePackage?.components ?? {};
    const merged = resolveComponents(
      resolveComponents(defaultComponents, pkgComponents),
      overrides
    );
    return merged;
  }, [defaultComponents, themePackage?.components, overrides]);

  const resolvedSlots = useMemo(() => {
    return resolveSlots({}, slotOverrides);
  }, [slotOverrides]);

  const resolvedTemplates = useMemo(() => {
    const pkgTemplates = themePackage?.templates ?? {};
    return { ...pkgTemplates, ...templateOverrides };
  }, [themePackage?.templates, templateOverrides]);

  const tokens: NoxionThemeTokens = useMemo(() => {
    if (themePackage) return themePackage.tokens;
    return resolvedTheme as NoxionThemeTokens;
  }, [themePackage, resolvedTheme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme: resolvedTheme,
      tokens,
      components: resolvedComponents,
      layout,
      slots: resolvedSlots,
      templates: resolvedTemplates,
    }),
    [resolvedTheme, tokens, resolvedComponents, layout, resolvedSlots, resolvedTemplates]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {themePackage?.stylesheet && (
        <style dangerouslySetInnerHTML={{ __html: themePackage.stylesheet }} />
      )}
      {children}
    </ThemeContext.Provider>
  );
}

export function useNoxionTheme(): NoxionTheme {
  return useContext(ThemeContext).theme;
}

export function useNoxionTokens(): NoxionThemeTokens {
  return useContext(ThemeContext).tokens;
}

export function useNoxionComponents(): ComponentOverrides {
  return useContext(ThemeContext).components;
}

export function useNoxionLayout(): NoxionLayout {
  return useContext(ThemeContext).layout;
}

export function useNoxionSlots(): Partial<NoxionSlotMap> {
  return useContext(ThemeContext).slots;
}

export function useNoxionTemplate(pageType: string): ComponentType<NoxionTemplateProps> | undefined {
  const { templates } = useContext(ThemeContext);
  return resolveTemplate(templates, pageType);
}
