import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";
import { cs } from "../utils";

export function QuoteBlock({ block, children }: NotionBlockProps) {
  const properties = block.properties as { title?: Decoration[] } | undefined;
  const blockColor = (block.format as { block_color?: string } | undefined)?.block_color;

  return (
    <blockquote className={cs("noxion-quote", blockColor && `noxion-color--${blockColor}`)}>
      <div className="noxion-quote__content">
        <Text value={properties?.title} />
      </div>
      {children}
    </blockquote>
  );
}
