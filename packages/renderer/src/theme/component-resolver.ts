import type { ComponentOverrides } from "./types";

export function resolveComponents(
  defaults: ComponentOverrides,
  overrides: ComponentOverrides
): ComponentOverrides {
  const resolved: ComponentOverrides = { ...defaults };

  for (const key of Object.keys(overrides) as (keyof ComponentOverrides)[]) {
    if (key === "NotionBlock") {
      resolved.NotionBlock = {
        ...defaults.NotionBlock,
        ...overrides.NotionBlock,
      };
    } else {
      (resolved as Record<string, unknown>)[key] = overrides[key];
    }
  }

  return resolved;
}
