import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";

export function BookmarkBlock({ block }: NotionBlockProps) {
  const properties = block.properties as {
    link?: Decoration[];
    title?: Decoration[];
    description?: Decoration[];
    caption?: Decoration[];
  } | undefined;

  const format = block.format as {
    bookmark_icon?: string;
    bookmark_cover?: string;
    block_color?: string;
  } | undefined;

  const link = properties?.link?.map((s) => s[0]).join("") ?? "";
  const title = properties?.title?.map((s) => s[0]).join("") ?? link;
  const description = properties?.description?.map((s) => s[0]).join("") ?? "";
  const icon = format?.bookmark_icon;
  const cover = format?.bookmark_cover;
  const hasCaption = properties?.caption && properties.caption.length > 0;

  if (!link) return null;

  return (
    <figure className="noxion-bookmark">
      <a href={link} className="noxion-bookmark__link" target="_blank" rel="noopener noreferrer">
        <div className="noxion-bookmark__content">
          <div className="noxion-bookmark__title">{title}</div>
          {description && (
            <div className="noxion-bookmark__description">{description}</div>
          )}
          <div className="noxion-bookmark__url">
            {icon && <img src={icon} alt="" className="noxion-bookmark__icon" loading="lazy" />}
            <span className="noxion-bookmark__link-text">{link}</span>
          </div>
        </div>
        {cover && (
          <div className="noxion-bookmark__cover">
            <img src={cover} alt="" className="noxion-bookmark__cover-image" loading="lazy" />
          </div>
        )}
      </a>
      {hasCaption && (
        <figcaption className="noxion-bookmark__caption">
          <Text value={properties!.caption} />
        </figcaption>
      )}
    </figure>
  );
}
