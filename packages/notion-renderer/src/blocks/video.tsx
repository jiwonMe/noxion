import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/v\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match?.[1] ?? null;
}

export function VideoBlock({ block }: NotionBlockProps) {
  const properties = block.properties as {
    source?: string[][];
    caption?: Decoration[];
  } | undefined;

  const format = block.format as {
    display_source?: string;
    block_width?: number;
    block_height?: number;
    block_aspect_ratio?: number;
  } | undefined;

  const source = format?.display_source ?? properties?.source?.[0]?.[0];
  if (!source) return null;

  const hasCaption = properties?.caption && properties.caption.length > 0;
  const aspectRatio = format?.block_aspect_ratio;

  const youtubeId = getYouTubeId(source);
  if (youtubeId) {
    return (
      <figure className="noxion-video">
        <div
          className="noxion-video__wrapper"
          style={aspectRatio ? { aspectRatio: `${1 / aspectRatio}` } : { aspectRatio: "16/9" }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="noxion-video__iframe"
          />
        </div>
        {hasCaption && (
          <figcaption className="noxion-video__caption">
            <Text value={properties!.caption} />
          </figcaption>
        )}
      </figure>
    );
  }

  const vimeoId = getVimeoId(source);
  if (vimeoId) {
    return (
      <figure className="noxion-video">
        <div
          className="noxion-video__wrapper"
          style={aspectRatio ? { aspectRatio: `${1 / aspectRatio}` } : { aspectRatio: "16/9" }}
        >
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title="Vimeo video"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="noxion-video__iframe"
          />
        </div>
        {hasCaption && (
          <figcaption className="noxion-video__caption">
            <Text value={properties!.caption} />
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="noxion-video">
      <video
        src={source}
        controls
        preload="metadata"
        className="noxion-video__player"
        style={format?.block_width ? { width: `${format.block_width}px` } : undefined}
      />
      {hasCaption && (
        <figcaption className="noxion-video__caption">
          <Text value={properties!.caption} />
        </figcaption>
      )}
    </figure>
  );
}
