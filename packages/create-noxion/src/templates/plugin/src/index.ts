import type { NoxionPlugin, PluginFactory } from "@noxion/core";

export interface PluginOptions {
  enabled?: boolean;
}

export const createPlugin: PluginFactory<PluginOptions> = (options = {}) => {
  const plugin: NoxionPlugin = {
    name: "noxion-plugin-{{PLUGIN_NAME}}",

    transformPosts({ posts }) {
      if (options.enabled === false) return posts;
      return posts;
    },
  };

  return plugin;
};

export default createPlugin;
