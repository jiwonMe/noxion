import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { useNotionRenderer } from "../context";
import { Text } from "../components/text";
import { cs } from "../utils";

export function PageBlock({ block, blockId, level, children }: NotionBlockProps) {
  const {
    fullPage,
    mapPageUrl,
    mapImageUrl,
    components,
    defaultPageIcon,
    defaultPageCover,
    defaultPageCoverPosition,
  } = useNotionRenderer();

  const properties = block.properties as { title?: Decoration[] } | undefined;
  const format = block.format as {
    page_full_width?: boolean;
    page_small_text?: boolean;
    page_cover_position?: number;
    page_cover?: string;
    page_icon?: string;
    block_color?: string;
  } | undefined;

  if (level > 0) {
    const href = mapPageUrl(blockId);
    const PageLinkComponent = components.PageLink;

    const link = PageLinkComponent ? (
      <PageLinkComponent href={href} className="noxion-page-link">
        {format?.page_icon && (
          <span className="noxion-page-link__icon">{format.page_icon}</span>
        )}
        <span className="noxion-page-link__title">
          <Text value={properties?.title} />
        </span>
      </PageLinkComponent>
    ) : (
      <a href={href} className="noxion-page-link">
        {format?.page_icon && (
          <span className="noxion-page-link__icon">{format.page_icon}</span>
        )}
        <span className="noxion-page-link__title">
          <Text value={properties?.title} />
        </span>
      </a>
    );

    return link;
  }

  if (!fullPage) {
    return (
      <div className="noxion-page noxion-page--inline">
        {children}
      </div>
    );
  }

  const coverUrl = format?.page_cover || defaultPageCover;
  const coverPosition = format?.page_cover_position ?? defaultPageCoverPosition ?? 0.5;
  const icon = format?.page_icon || defaultPageIcon;
  const isFullWidth = format?.page_full_width ?? false;
  const isSmallText = format?.page_small_text ?? false;

  return (
    <div
      className={cs(
        "noxion-page",
        isFullWidth && "noxion-page--full-width",
        isSmallText && "noxion-page--small-text",
      )}
    >
      {coverUrl && (
        <div className="noxion-page__cover">
          <img
            src={mapImageUrl(coverUrl, block)}
            alt="Page cover"
            style={{ objectPosition: `center ${coverPosition * 100}%` }}
            className="noxion-page__cover-image"
          />
        </div>
      )}

      <main className="noxion-page__main">
        {icon && (
          <div className="noxion-page__icon">
            <span role="img" aria-label="page icon">{icon}</span>
          </div>
        )}

        <h1 className="noxion-page__title">
          <Text value={properties?.title} />
        </h1>

        <div className="noxion-page__content">
          {children}
        </div>
      </main>
    </div>
  );
}
