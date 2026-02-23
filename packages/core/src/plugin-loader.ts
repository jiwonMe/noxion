import type {
  NoxionPlugin,
  PluginFactory,
  PluginConfigEntry,
} from "./plugin";

export function definePlugin<Options = unknown, Content = unknown>(
  factory: PluginFactory<Options, Content>
): PluginFactory<Options, Content> {
  return factory;
}

function isPluginFactory(entry: unknown): entry is PluginFactory {
  return typeof entry === "function";
}

function isPluginInstance(entry: unknown): entry is NoxionPlugin {
  return typeof entry === "object" && entry !== null && "name" in entry;
}

export function loadPlugins(entries: PluginConfigEntry[]): NoxionPlugin[] {
  const plugins: NoxionPlugin[] = [];
  const seenNames = new Set<string>();

  for (const entry of entries) {
    if (entry === false) continue;

    let plugin: NoxionPlugin;

    if (Array.isArray(entry)) {
      const [moduleOrFactory, options] = entry;
      if (isPluginFactory(moduleOrFactory)) {
        plugin = moduleOrFactory(options);
      } else if (isPluginInstance(moduleOrFactory)) {
        plugin = moduleOrFactory;
      } else {
        continue;
      }
    } else if (isPluginFactory(entry)) {
      plugin = entry({});
    } else if (isPluginInstance(entry)) {
      plugin = entry;
    } else {
      continue;
    }

    if (seenNames.has(plugin.name)) {
      console.warn(`[noxion] Duplicate plugin name: "${plugin.name}"`);
    }
    seenNames.add(plugin.name);

    validatePluginConfig(plugin, entry);

    plugins.push(plugin);
  }

  return plugins;
}

function validatePluginConfig(plugin: NoxionPlugin, entry: PluginConfigEntry): void {
  if (!plugin.configSchema) return;

  const options = Array.isArray(entry) ? entry[1] : undefined;

  try {
    const result = plugin.configSchema.validate(options);
    if (!result.valid) {
      const errors = result.errors?.join(", ") ?? "unknown validation error";
      console.warn(`[noxion] Plugin "${plugin.name}" config validation failed: ${errors}`);
    }
  } catch (err) {
    console.warn(
      `[noxion] Plugin "${plugin.name}" configSchema.validate threw:`,
      err instanceof Error ? err.message : err
    );
  }
}
