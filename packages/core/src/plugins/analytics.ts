import type { NoxionPlugin, HeadTag } from "../plugin";

export interface AnalyticsPluginOptions {
  provider: "google" | "plausible" | "umami" | "custom";
  trackingId: string;
  customScript?: string;
}

export function createAnalyticsPlugin(options: AnalyticsPluginOptions): NoxionPlugin {
  return {
    name: "noxion-plugin-analytics",
    injectHead: () => generateAnalyticsTags(options),
  };
}

function generateAnalyticsTags(options: AnalyticsPluginOptions): HeadTag[] {
  switch (options.provider) {
    case "google":
      return [
        {
          tagName: "script",
          attributes: {
            async: "true",
            src: `https://www.googletagmanager.com/gtag/js?id=${options.trackingId}`,
          },
        },
        {
          tagName: "script",
          innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${options.trackingId}');`,
        },
      ];

    case "plausible":
      return [
        {
          tagName: "script",
          attributes: {
            defer: "true",
            "data-domain": options.trackingId,
            src: "https://plausible.io/js/plausible.js",
          },
        },
      ];

    case "umami":
      return [
        {
          tagName: "script",
          attributes: {
            async: "true",
            "data-website-id": options.trackingId,
            src: "https://analytics.umami.is/script.js",
          },
        },
      ];

    case "custom":
      return [
        {
          tagName: "script",
          attributes: {
            async: "true",
            src: options.customScript ?? "",
          },
        },
      ];
  }
}
