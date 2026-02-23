import {
  defaultThemePackage,
  inkThemePackage,
  editorialThemePackage,
  folioThemePackage,
} from "@noxion/renderer";
import type { NoxionThemePackage } from "@noxion/renderer";

export interface ThemeEntry {
  id: string;
  label: string;
  pkg: NoxionThemePackage;
}

export const themeRegistry: ThemeEntry[] = [
  { id: "default", label: "Default", pkg: defaultThemePackage },
  { id: "ink", label: "Ink", pkg: inkThemePackage },
  { id: "editorial", label: "Editorial", pkg: editorialThemePackage },
  { id: "folio", label: "Folio", pkg: folioThemePackage },
];
