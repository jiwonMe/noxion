import type { NoxionPlugin, RouteInfo } from "./plugin";
import type { PageTypeDefinition } from "./types";
import type { PageTypeRegistry } from "./page-type-registry";

export async function executeHook(
  plugins: NoxionPlugin[],
  hookName: keyof NoxionPlugin,
  args: Record<string, unknown>
): Promise<void> {
  for (const plugin of plugins) {
    const hookFn = plugin[hookName];
    if (typeof hookFn !== "function") continue;

    try {
      await (hookFn as (args: Record<string, unknown>) => Promise<void> | void)(args);
    } catch (err) {
      console.warn(
        `[noxion] Plugin "${plugin.name}" threw in ${String(hookName)}:`,
        err instanceof Error ? err.message : err
      );
    }
  }
}

const TRANSFORM_INPUT_KEYS: Record<string, string> = {
  transformContent: "recordMap",
  transformPosts: "posts",
  extendMetadata: "metadata",
  extendSitemap: "entries",
  extendRoutes: "routes",
};

export function executeTransformHook<T>(
  plugins: NoxionPlugin[],
  hookName: keyof NoxionPlugin,
  initialValue: T,
  extraArgs: Record<string, unknown>
): T {
  let current = initialValue;
  const hookKey = TRANSFORM_INPUT_KEYS[hookName as string] ?? "value";

  for (const plugin of plugins) {
    const hookFn = plugin[hookName];
    if (typeof hookFn !== "function") continue;

    try {
      const result = (hookFn as (args: Record<string, unknown>) => unknown)({
        ...extraArgs,
        [hookKey]: current,
      });
      if (result !== undefined) {
        current = result as T;
      }
    } catch (err) {
      console.warn(
        `[noxion] Plugin "${plugin.name}" threw in ${String(hookName)}:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  return current;
}

export function executeRegisterPageTypes(
  plugins: NoxionPlugin[],
  registry: PageTypeRegistry,
): void {
  for (const plugin of plugins) {
    if (typeof plugin.registerPageTypes !== "function") continue;

    try {
      const definitions: PageTypeDefinition[] = plugin.registerPageTypes();
      for (const definition of definitions) {
        registry.register(definition);
      }
    } catch (err) {
      console.warn(
        `[noxion] Plugin "${plugin.name}" threw in registerPageTypes:`,
        err instanceof Error ? err.message : err
      );
    }
  }
}

export function executeRouteResolve(
  plugins: NoxionPlugin[],
  route: RouteInfo,
): RouteInfo | null {
  let current: RouteInfo | null = route;

  for (const plugin of plugins) {
    if (typeof plugin.onRouteResolve !== "function") continue;
    if (current === null) break;

    try {
      current = plugin.onRouteResolve(current);
    } catch (err) {
      console.warn(
        `[noxion] Plugin "${plugin.name}" threw in onRouteResolve:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  return current;
}

export function executeExtendSlots(
  plugins: NoxionPlugin[],
  initialSlots: Record<string, unknown>,
): Record<string, unknown> {
  let current = initialSlots;

  for (const plugin of plugins) {
    if (typeof plugin.extendSlots !== "function") continue;

    try {
      const result = plugin.extendSlots(current);
      if (result !== undefined) {
        current = result;
      }
    } catch (err) {
      console.warn(
        `[noxion] Plugin "${plugin.name}" threw in extendSlots:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  return current;
}
