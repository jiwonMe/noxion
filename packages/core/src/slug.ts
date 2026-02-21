import type { BlogPost } from "./types";

export function generateSlug(title: string): string {
  if (!title) return "";

  return (
    title
      .toLowerCase()
      // keep alphanumerics, CJK characters, hyphens, spaces
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

export function parseNotionPageId(input: string): string {
  let raw = input;
  const urlMatch = raw.match(/([a-f0-9]{32})$/i);
  if (urlMatch) {
    raw = urlMatch[1];
  }

  const hex = raw.replace(/-/g, "");

  if (hex.length !== 32) return input;

  // Format as UUID: 8-4-4-4-12
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function buildPageUrl(slug: string): string {
  if (slug.startsWith("/")) return slug;
  return `/${slug}`;
}

export function resolveSlug(post: BlogPost): string {
  if (post.slug) return post.slug;
  return generateSlug(post.title);
}
