import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";

export function PdfBlock({ block }: NotionBlockProps) {
  const properties = block.properties as {
    source?: string[][];
    caption?: Decoration[];
  } | undefined;

  const format = block.format as {
    display_source?: string;
    block_width?: number;
    block_height?: number;
  } | undefined;

  const source = format?.display_source ?? properties?.source?.[0]?.[0];
  if (!source) return null;

  const hasCaption = properties?.caption && properties.caption.length > 0;

  return (
    <figure className="noxion-pdf">
      <iframe
        src={source}
        title="PDF document"
        className="noxion-pdf__viewer"
        style={{
          width: format?.block_width ? `${format.block_width}px` : "100%",
          height: format?.block_height ? `${format.block_height}px` : "600px",
        }}
      />
      {hasCaption && (
        <figcaption className="noxion-pdf__caption">
          <Text value={properties!.caption} />
        </figcaption>
      )}
    </figure>
  );
}
