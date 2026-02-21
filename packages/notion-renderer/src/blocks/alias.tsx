import type { NotionBlockProps } from "../types";
import { useNotionRenderer, useNotionBlock } from "../context";
import { getBlockTitle } from "../utils";

export function AliasBlock({ block }: NotionBlockProps) {
  const { mapPageUrl, components } = useNotionRenderer();

  const format = block.format as { alias_pointer?: { id: string } } | undefined;
  const targetId = format?.alias_pointer?.id;
  if (!targetId) return null;

  const targetBlock = useNotionBlock(targetId);
  if (!targetBlock) return null;

  const href = mapPageUrl(targetId);
  const title = getBlockTitle(targetBlock);
  const icon = (targetBlock.format as { page_icon?: string } | undefined)?.page_icon;

  const PageLinkComponent = components.PageLink;

  if (PageLinkComponent) {
    return (
      <PageLinkComponent href={href} className="noxion-page-link">
        {icon && <span className="noxion-page-link__icon">{icon}</span>}
        <span className="noxion-page-link__title">{title}</span>
      </PageLinkComponent>
    );
  }

  return (
    <a href={href} className="noxion-page-link">
      {icon && <span className="noxion-page-link__icon">{icon}</span>}
      <span className="noxion-page-link__title">{title}</span>
    </a>
  );
}
