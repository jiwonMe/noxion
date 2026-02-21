import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";

export function EmbedBlock({ block }: NotionBlockProps) {
  const properties = block.properties as {
    source?: string[][];
    caption?: Decoration[];
  } | undefined;

  const format = block.format as {
    display_source?: string;
    block_width?: number;
    block_height?: number;
    block_full_width?: boolean;
    block_page_width?: boolean;
    block_aspect_ratio?: number;
  } | undefined;

  const source = format?.display_source ?? properties?.source?.[0]?.[0];
  if (!source) return null;

  const hasCaption = properties?.caption && properties.caption.length > 0;
  const width = format?.block_width;
  const height = format?.block_height;
  const aspectRatio = format?.block_aspect_ratio;

  return (
    <figure className="noxion-embed">
      <div
        className="noxion-embed__wrapper"
        style={{
          ...(width ? { width: `${width}px` } : {}),
          ...(aspectRatio ? { aspectRatio: `${1 / aspectRatio}` } : height ? { height: `${height}px` } : {}),
        }}
      >
        <iframe
          src={source}
          title={`Embedded content: ${block.type}`}
          className="noxion-embed__iframe"
          sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-presentation"
          loading="lazy"
          allowFullScreen
        />
      </div>
      {hasCaption && (
        <figcaption className="noxion-embed__caption">
          <Text value={properties!.caption} />
        </figcaption>
      )}
    </figure>
  );
}
