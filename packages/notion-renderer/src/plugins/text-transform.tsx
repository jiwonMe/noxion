import type { RendererPlugin } from "../plugin/types";
import type { TextTransformResult } from "../plugin/types";

const TRANSFORM_TOKEN_REGEX = /(\[\[([^\]]+)\]\])|#([\w\u3131-\u318E\uAC00-\uD7A3]+)/g;

export interface TextTransformOptions {
  enableWikilinks?: boolean;
  enableHashtags?: boolean;
  hashtagUrl?: (tag: string) => string;
  /** URL mapper for wikilinks. Uses mapPageUrl from context if available. Defaults to `/${pageName}`. */
  mapPageUrl?: (pageId: string) => string;
}

export const createTextTransformPlugin = (options: TextTransformOptions = {}): RendererPlugin => {
    const {
      enableWikilinks = true,
      enableHashtags = true,
      hashtagUrl,
      mapPageUrl = (pageId: string) => `/${pageId}`,
    } = options;

    const plugin: RendererPlugin = {
      name: "text-transform",
      transformText: ({ text }): TextTransformResult => {
        if (!enableWikilinks && !enableHashtags) {
          return { text, replacements: [] };
        }

        const replacements: TextTransformResult["replacements"] = [];
        let output = "";
        let cursor = 0;
        TRANSFORM_TOKEN_REGEX.lastIndex = 0;

        let match: RegExpExecArray | null;
        while ((match = TRANSFORM_TOKEN_REGEX.exec(text)) !== null) {
          const token = match[0];
          const tokenStart = match.index;
          const tokenEnd = tokenStart + token.length;

          output += text.slice(cursor, tokenStart);

          const wikilinkTarget = match[2];
          const hashtagTarget = match[3];

          if (wikilinkTarget && enableWikilinks) {
            const start = output.length;
            output += wikilinkTarget;
            const end = output.length;
            replacements.push({
              start,
              end,
              component: (
                <a href={mapPageUrl(wikilinkTarget)} className="noxion-link">
                  {wikilinkTarget}
                </a>
              ),
            });
          } else if (hashtagTarget && enableHashtags) {
            const start = output.length;
            output += hashtagTarget;
            const end = output.length;

            if (hashtagUrl) {
              const href = hashtagUrl(hashtagTarget);
              replacements.push({
                start,
                end,
                component: (
                  <a href={href} className="noxion-link">
                    {hashtagTarget}
                  </a>
                ),
              });
            } else {
              replacements.push({
                start,
                end,
                component: <span className="noxion-color--blue">{hashtagTarget}</span>,
              });
            }
          } else {
            output += token;
          }

          cursor = tokenEnd;
        }

        if (cursor < text.length) {
          output += text.slice(cursor);
        }

        return {
          text: output,
          replacements,
        };
      },
    };
    return plugin;
};
