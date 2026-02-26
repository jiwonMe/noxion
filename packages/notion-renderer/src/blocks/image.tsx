import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { useNotionRenderer } from "../context";
import { Text } from "../components/text";
import { cs } from "../utils";

export function ImageBlock({ block }: NotionBlockProps) {
  const { mapImageUrl, components } = useNotionRenderer();

  const properties = block.properties as {
    source?: string[][];
    caption?: Decoration[];
    alt_text?: Decoration[];
  } | undefined;

  const format = block.format as {
    block_width?: number;
    block_height?: number;
    display_source?: string;
    block_full_width?: boolean;
    block_page_width?: boolean;
    block_aspect_ratio?: number;
    block_alignment?: string;
  } | undefined;

  const source = format?.display_source ?? properties?.source?.[0]?.[0];
  if (!source) return null;

  const src = mapImageUrl(source, block);
  // Use caption as alt text if available, otherwise use alt_text property, fallback to "Image"
  const captionText = properties?.caption?.map((s) => s[0]).join("") ?? "";
  const altText = properties?.alt_text?.map((s) => s[0]).join("") ?? "";
  const alt = captionText || altText || "Image";
  
  const width = format?.block_width;
  const aspectRatio = format?.block_aspect_ratio;
  // Compute height from width + aspect_ratio when block_height is missing.
  // Notion stores aspect_ratio as height/width.
  const height = format?.block_height
    ?? (width && aspectRatio ? Math.round(width * aspectRatio) : undefined);
  const isFullWidth = format?.block_full_width ?? false;
  const isPageWidth = format?.block_page_width ?? false;
  const hasCaption = properties?.caption && properties.caption.length > 0;

  // CSS aspect-ratio value (width / height) for responsive layout shift prevention.
  // Works even when the image scales down from its intrinsic width.
  const cssAspectRatio = aspectRatio
    ? `${1 / aspectRatio}`
    : width && height
      ? `${width} / ${height}`
      : undefined;

  const imgStyle: React.CSSProperties | undefined = cssAspectRatio
    ? { aspectRatio: cssAspectRatio }
    : undefined;

  const ImageComponent = components.Image;

  const imgElement = ImageComponent ? (
    <ImageComponent
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="noxion-image__img"
    />
  ) : (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className="noxion-image__img"
      style={imgStyle}
    />
  );

  return (
    <figure
      className={cs(
        "noxion-image",
        isFullWidth && "noxion-image--full-width",
        isPageWidth && "noxion-image--page-width",
      )}
      style={width && !isFullWidth && !isPageWidth ? { maxWidth: `${width}px` } : undefined}
    >
      {imgElement}
      {hasCaption && (
        <figcaption className="noxion-image__caption">
          <Text value={properties!.caption} />
        </figcaption>
      )}
    </figure>
  );
}
