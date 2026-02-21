import type { NoxionPlugin } from "./plugin";

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
