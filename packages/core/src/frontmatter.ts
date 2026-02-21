import type { ExtendedRecordMap, Block } from "notion-types";
import { getTextContent } from "notion-utils";
import type { BlogPost } from "./types";

type BlockBox = { role: string; value: Block };

function unwrapBlock(box: unknown): Block | undefined {
  const b = box as BlockBox | undefined;
  if (!b?.value) return undefined;
  return b.value;
}

export function parseFrontmatter(
  recordMap: ExtendedRecordMap,
  pageId: string
): Record<string, string> | null {
  const pageBox = recordMap.block[pageId];
  const pageBlock = unwrapBlock(pageBox);
  if (!pageBlock) return null;

  const childIds = (pageBlock as { content?: string[] }).content;
  if (!childIds || childIds.length === 0) return null;

  const firstChildId = childIds[0];
  const firstBlock = unwrapBlock(recordMap.block[firstChildId]);
  if (!firstBlock || firstBlock.type !== "code") return null;

  const properties = firstBlock.properties as Record<string, unknown[][]> | undefined;
  if (!properties?.title) return null;

  const codeText = getTextContent(properties.title as never);
  if (!codeText.trim()) return null;

  return parseKeyValuePairs(codeText);
}

export function parseKeyValuePairs(text: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes(":")) continue;

    const colonIndex = trimmed.indexOf(":");
    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();

    if (!key) continue;

    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

export function applyFrontmatter(
  post: BlogPost,
  frontmatter: Record<string, string>
): BlogPost {
  const updated = { ...post, frontmatter };

  if (frontmatter.title) {
    updated.title = frontmatter.title;
  }

  if (frontmatter.description) {
    updated.description = frontmatter.description;
  }

  if (frontmatter.cleanUrl) {
    updated.slug = frontmatter.cleanUrl.replace(/^\//, "");
  }

  if (frontmatter.slug) {
    updated.slug = frontmatter.slug.replace(/^\//, "");
  }

  if (frontmatter.date) {
    updated.date = frontmatter.date;
  }

  if (frontmatter.category) {
    updated.category = frontmatter.category;
  }

  if (frontmatter.tags) {
    updated.tags = frontmatter.tags.split(",").map((t) => t.trim()).filter(Boolean);
  }

  if (frontmatter.coverImage || frontmatter.cover) {
    updated.coverImage = frontmatter.coverImage ?? frontmatter.cover;
  }

  return updated;
}
