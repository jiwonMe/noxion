import { defaultThemePackage } from "@noxion/theme-default";
import { inkThemePackage } from "@noxion/theme-ink";
import { editorialThemePackage } from "@noxion/theme-editorial";
import { folioThemePackage } from "@noxion/theme-folio";
import { beaconThemePackage } from "@noxion/theme-beacon";
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
  { id: "beacon", label: "Beacon", pkg: beaconThemePackage },
];
