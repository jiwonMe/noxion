import type { NoxionPlugin, PluginFactory } from "@noxion/core";

export interface ReadingTimeOptions {
  wordsPerMinute?: number;
  showIcon?: boolean;
}

const DEFAULT_WPM = 200;

export function estimateReadingTime(text: string, wpm: number = DEFAULT_WPM): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wpm));
  return `${minutes} min read`;
}

export const createReadingTimePlugin: PluginFactory<ReadingTimeOptions> = (options = {}) => {
  const wpm = options.wordsPerMinute ?? DEFAULT_WPM;
  const showIcon = options.showIcon ?? true;

  const plugin: NoxionPlugin = {
    name: "noxion-plugin-reading-time",

    configSchema: {
      validate(opts: unknown) {
        const errors: string[] = [];
        if (typeof opts !== "object" || opts === null) {
          return { valid: false, errors: ["Options must be an object"] };
        }
        const o = opts as Record<string, unknown>;
        if ("wordsPerMinute" in o && typeof o.wordsPerMinute !== "number") {
          errors.push("wordsPerMinute must be a number");
        }
        if ("wordsPerMinute" in o && typeof o.wordsPerMinute === "number" && o.wordsPerMinute <= 0) {
          errors.push("wordsPerMinute must be positive");
        }
        if ("showIcon" in o && typeof o.showIcon !== "boolean") {
          errors.push("showIcon must be a boolean");
        }
        return { valid: errors.length === 0, errors };
      },
    },

    transformPosts({ posts }) {
      return posts.map((post) => {
        const contentText = post.description ?? post.title;
        const readingTime = estimateReadingTime(contentText, wpm);
        return {
          ...post,
          frontmatter: {
            ...post.frontmatter,
            readingTime,
          },
        };
      });
    },

    extendSlots(slots) {
      const prefix = showIcon ? "📖 " : "";
      return {
        ...slots,
        readingTimeDisplay: `${prefix}{{readingTime}}`,
      };
    },
  };

  return plugin;
};

export default createReadingTimePlugin;
