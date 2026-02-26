import type { RendererPlugin, RendererPluginFactory } from "../plugin/types";
import { createLazyBlock } from "../utils/lazy-block";

export interface ChartConfig {
  type: "bar" | "line" | "pie";
  data: Record<string, unknown>;
  options?: Record<string, unknown>;
}

export interface ChartPluginOptions {
  containerClass?: string;
}

export const createChartPlugin: RendererPluginFactory<ChartPluginOptions> = (
  options = {}
) => {
  const LazyChartRenderer = createLazyBlock(() => import("./chart-renderer"));

  const plugin: RendererPlugin = {
    name: "chart",
    blockOverride: ({ block }) => {
      const language = (
        block.properties as { language?: string[][] } | undefined
      )?.language?.[0]?.[0];
      if (block.type === "code" && language === "chart") {
        return {
          component: LazyChartRenderer,
          props: { containerClass: options.containerClass },
        };
      }
      return null;
    },
  };
  return plugin;
};
