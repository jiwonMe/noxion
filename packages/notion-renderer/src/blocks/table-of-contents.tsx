import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { useNotionRenderer } from "../context";
import { cs } from "../utils";

const HEADING_TYPES = new Set(["header", "sub_header", "sub_sub_header"]);

export function TableOfContentsBlock({ block }: NotionBlockProps) {
  const { recordMap } = useNotionRenderer();
  const blockColor = (block.format as { block_color?: string } | undefined)?.block_color;

  const headings: { id: string; text: string; level: number }[] = [];

  for (const [id, blockRecord] of Object.entries(recordMap.block)) {
    const val = blockRecord?.value;
    const resolved = (val && typeof val === "object" && "role" in val && "value" in val)
      ? (val as { value: { type?: string; properties?: { title?: Decoration[] }; alive?: boolean } }).value
      : val as { type?: string; properties?: { title?: Decoration[] }; alive?: boolean } | undefined;

    if (!resolved?.alive) continue;
    if (!resolved.type || !HEADING_TYPES.has(resolved.type)) continue;

    const text = resolved.properties?.title?.map((s: Decoration) => s[0]).join("") ?? "";
    if (!text) continue;

    const level = resolved.type === "header" ? 1 : resolved.type === "sub_header" ? 2 : 3;
    headings.push({ id, text, level });
  }

  if (!headings.length) return null;

  return (
    <nav className={cs("noxion-table-of-contents", blockColor && `noxion-color--${blockColor}`)}>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={`noxion-table-of-contents__item noxion-table-of-contents__item--level-${heading.level}`}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
