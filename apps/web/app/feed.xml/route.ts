import { getAllPosts } from "../../lib/notion";
import { siteConfig } from "../../lib/config";

export const revalidate = 3600;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getAllPosts();
  const baseUrl = `https://${siteConfig.domain}`;

  const items = posts.slice(0, 50).map((post) => {
    const { date, author, category, tags } = post.metadata;
    const pubDate = date ? new Date(date).toUTCString() : new Date(post.lastEditedTime).toUTCString();
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description ?? post.title)}</description>
      ${author ? `<dc:creator>${escapeXml(author)}</dc:creator>` : ""}
      ${category ? `<category>${escapeXml(category)}</category>` : ""}
      ${(tags ?? []).map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
