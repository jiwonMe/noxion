"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { NoxionTheme, ComponentOverrides, NoxionLayout } from "./types";
import { defaultTheme } from "./define-theme";
import { generateCSSVariables } from "./css-generator";
import { resolveComponents } from "./component-resolver";

interface ThemeContextValue {
  theme: NoxionTheme;
  components: ComponentOverrides;
  layout: NoxionLayout;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  components: {},
  layout: "single-column",
});

export interface NoxionThemeProviderProps {
  theme?: NoxionTheme;
  components?: ComponentOverrides;
  defaultComponents?: ComponentOverrides;
  layout?: NoxionLayout;
  children: React.ReactNode;
}

export function NoxionThemeProvider({
  theme = defaultTheme,
  components: overrides = {},
  defaultComponents = {},
  layout = "single-column",
  children,
}: NoxionThemeProviderProps) {
  const cssVariables = useMemo(() => generateCSSVariables(theme), [theme]);
  const resolvedComponents = useMemo(
    () => resolveComponents(defaultComponents, overrides),
    [defaultComponents, overrides]
  );

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      components: resolvedComponents,
      layout,
    }),
    [theme, resolvedComponents, layout]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useNoxionTheme(): NoxionTheme {
  return useContext(ThemeContext).theme;
}

export function useNoxionComponents(): ComponentOverrides {
  return useContext(ThemeContext).components;
}

export function useNoxionLayout(): NoxionLayout {
  return useContext(ThemeContext).layout;
}
