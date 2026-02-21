import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";
import { cs } from "../utils";

export function BulletedListBlock({ block, children }: NotionBlockProps) {
  const properties = block.properties as { title?: Decoration[] } | undefined;
  const blockColor = (block.format as { block_color?: string } | undefined)?.block_color;

  return (
    <li className={cs("noxion-list-item", "noxion-list-item--bulleted", blockColor && `noxion-color--${blockColor}`)}>
      <div className="noxion-list-item__content">
        <Text value={properties?.title} />
      </div>
      {children && (
        <ul className="noxion-list noxion-list--bulleted">
          {children}
        </ul>
      )}
    </li>
  );
}
