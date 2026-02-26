import type { RendererPlugin, RendererPluginFactory } from "../plugin/types";
import type { NotionBlockProps } from "../types";

export function detectEmbedProvider(url: string): string | null {
  if (url.includes("codepen.io")) return "codepen";
  if (url.includes("stackblitz.com")) return "stackblitz";
  if (url.includes("figma.com")) return "figma";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("codesandbox.io")) return "codesandbox";
  return null;
}

function createProviderBlock(provider: string) {
  const EnhancedEmbedBlock = ({ block }: NotionBlockProps) => {
    const format = block.format as { display_source?: string } | undefined;
    const properties = block.properties as
      | { source?: string[][] }
      | undefined;
    const src =
      format?.display_source ?? properties?.source?.[0]?.[0] ?? "";

    return (
      <figure className={`noxion-embed noxion-embed--${provider}`}>
        <div className="noxion-embed__wrapper">
          <iframe
            src={src}
            title={`${provider} embed`}
            loading="lazy"
            className="noxion-embed__iframe"
            allowFullScreen
          />
        </div>
      </figure>
    );
  };
  EnhancedEmbedBlock.displayName = `EnhancedEmbedBlock(${provider})`;
  return EnhancedEmbedBlock;
}

export interface EmbedEnhancedOptions {
  providers?: string[];
}

const EMBED_BLOCK_TYPES = new Set([
  "embed",
  "figma",
  "codepen",
  "gist",
  "typeform",
  "replit",
  "excalidraw",
  "tweet",
  "maps",
  "miro",
  "drive",
]);

export const createEmbedEnhancedPlugin: RendererPluginFactory<EmbedEnhancedOptions> =
  (options = {}) => {
    const enabledProviders = options.providers ?? null; // null = all enabled

    const plugin: RendererPlugin = {
      name: "embed-enhanced",
      blockOverride: ({ block }) => {
        if (!EMBED_BLOCK_TYPES.has(block.type)) return null;

        const format = block.format as
          | { display_source?: string }
          | undefined;
        const properties = block.properties as
          | { source?: string[][] }
          | undefined;
        const src =
          format?.display_source ?? properties?.source?.[0]?.[0] ?? "";
        if (!src) return null;

        const provider = detectEmbedProvider(src);
        if (!provider) return null;

        if (enabledProviders && !enabledProviders.includes(provider))
          return null;

        return { component: createProviderBlock(provider) };
      },
    };
    return plugin;
  };
