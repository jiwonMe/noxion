import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";
import { cs } from "../utils";

export function HeadingBlock({ block, blockId, children }: NotionBlockProps) {
  const properties = block.properties as { title?: Decoration[] } | undefined;
  const format = block.format as { block_color?: string; toggleable?: boolean } | undefined;
  const blockColor = format?.block_color;
  const isToggleable = format?.toggleable ?? false;

  const headingLevel =
    block.type === "header" ? 1 :
    block.type === "sub_header" ? 2 :
    3;

  const Tag = `h${headingLevel}` as const;
  const id = blockId;

  const heading = (
    <Tag
      className={cs(
        "noxion-heading",
        `noxion-heading--h${headingLevel}`,
        blockColor && `noxion-color--${blockColor}`,
      )}
      id={id}
    >
      <Text value={properties?.title} />
    </Tag>
  );

  if (isToggleable && children) {
    return (
      <details className="noxion-toggle noxion-toggle--heading">
        <summary>{heading}</summary>
        <div className="noxion-toggle__content">{children}</div>
      </details>
    );
  }

  return (
    <>
      {heading}
      {children}
    </>
  );
}
