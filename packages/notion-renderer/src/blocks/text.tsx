import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";
import { cs } from "../utils";

export function TextBlock({ block, children }: NotionBlockProps) {
  const properties = block.properties as { title?: Decoration[] } | undefined;
  const blockColor = (block.format as { block_color?: string } | undefined)?.block_color;

  return (
    <div className={cs("noxion-text", blockColor && `noxion-color--${blockColor}`)}>
      <Text value={properties?.title} />
      {children}
    </div>
  );
}
