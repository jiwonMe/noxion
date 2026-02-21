import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";

export function AudioBlock({ block }: NotionBlockProps) {
  const properties = block.properties as {
    source?: string[][];
    caption?: Decoration[];
  } | undefined;

  const format = block.format as {
    display_source?: string;
  } | undefined;

  const source = format?.display_source ?? properties?.source?.[0]?.[0];
  if (!source) return null;

  const hasCaption = properties?.caption && properties.caption.length > 0;

  return (
    <figure className="noxion-audio">
      <audio src={source} controls preload="metadata" className="noxion-audio__player" />
      {hasCaption && (
        <figcaption className="noxion-audio__caption">
          <Text value={properties!.caption} />
        </figcaption>
      )}
    </figure>
  );
}
