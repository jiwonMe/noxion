import type { NoxionSlotMap } from "./types";

export function resolveSlots(
  defaults: Partial<NoxionSlotMap>,
  overrides: Partial<NoxionSlotMap>
): Partial<NoxionSlotMap> {
  const resolved: Partial<NoxionSlotMap> = { ...defaults };

  for (const [key, value] of Object.entries(overrides)) {
    if (value === null) {
      resolved[key] = null;
    } else if (value !== undefined) {
      resolved[key] = value;
    }
  }

  return resolved;
}
