import type { NoxionPlugin, HeadTag } from "../plugin";
import type { BlogPost, NoxionConfig } from "../types";

export interface RSSPluginOptions {
  feedPath?: string;
  limit?: number;
  fullContent?: boolean;
}

export function createRSSPlugin(options: RSSPluginOptions): NoxionPlugin {
  const feedPath = options.feedPath ?? "/feed.xml";

  return {
    name: "noxion-plugin-rss",
    injectHead: () => generateRSSHeadTags(feedPath),
  };
}

function generateRSSHeadTags(feedPath: string): HeadTag[] {
  return [
    {
      tagName: "link",
      attributes: {
        rel: "alternate",
        type: "application/rss+xml",
        title: "RSS Feed",
        href: feedPath,
      },
    },
  ];
}

export function generateRSSXml(
  posts: BlogPost[],
  config: NoxionConfig,
  options?: Pick<RSSPluginOptions, "limit">
): string {
  const baseUrl = `https://${config.domain}`;
  const limit = options?.limit ?? 20;
  const limited = posts.slice(0, limit);

  const items = limited
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(config.author)}</dc:creator>
${post.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(config.description)}</description>
    <language>${config.language}</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
