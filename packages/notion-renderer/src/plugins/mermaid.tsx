import type { RendererPlugin, RendererPluginFactory } from "../plugin/types";
import { createLazyBlock } from "../utils/lazy-block";

export interface MermaidPluginOptions {
  theme?: "default" | "dark" | "forest";
  containerClass?: string;
}

export const createMermaidPlugin: RendererPluginFactory<MermaidPluginOptions> =
  (options = {}) => {
    const LazyMermaidRenderer = createLazyBlock(() => import("./mermaid-renderer"));

    const plugin: RendererPlugin = {
      name: "mermaid",
      blockOverride: ({ block }) => {
        const language = (
          block.properties as { language?: string[][] } | undefined
        )?.language?.[0]?.[0];
        if (block.type === "code" && language === "mermaid") {
          return {
            component: LazyMermaidRenderer,
            props: {
              theme: options.theme ?? "default",
              containerClass: options.containerClass,
            },
          };
        }
        return null;
      },
    };
    return plugin;
  };
