import { defaultThemeContract } from "@noxion/theme-default";
import { beaconThemeContract } from "@noxion/theme-beacon";
import type { NoxionThemeContract } from "@noxion/renderer";

export interface ThemeEntry {
  id: string;
  label: string;
  contract: NoxionThemeContract;
}

export const themeRegistry: ThemeEntry[] = [
  { id: "default", label: "Default", contract: defaultThemeContract },
  { id: "beacon", label: "Beacon", contract: beaconThemeContract },
];
