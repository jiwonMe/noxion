import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";

export function FileBlock({ block }: NotionBlockProps) {
  const properties = block.properties as {
    title?: Decoration[];
    source?: string[][];
    size?: Decoration[];
    caption?: Decoration[];
  } | undefined;

  const source = properties?.source?.[0]?.[0];
  if (!source) return null;

  const filename = properties?.title?.map((s) => s[0]).join("") ?? "Download file";
  const size = properties?.size?.map((s) => s[0]).join("") ?? "";
  const hasCaption = properties?.caption && properties.caption.length > 0;

  return (
    <figure className="noxion-file">
      <a href={source} className="noxion-file__link" target="_blank" rel="noopener noreferrer">
        <span className="noxion-file__name">{filename}</span>
        {size && <span className="noxion-file__size">{size}</span>}
      </a>
      {hasCaption && (
        <figcaption className="noxion-file__caption">
          <Text value={properties!.caption} />
        </figcaption>
      )}
    </figure>
  );
}
