import React from "react";
import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";
import { cs } from "../utils";

export const NumberedListBlock = React.memo(function NumberedListBlock({ block, children }: NotionBlockProps) {
  const properties = block.properties as { title?: Decoration[] } | undefined;
  const format = block.format as { block_color?: string; list_start_index?: number } | undefined;
  const blockColor = format?.block_color;

  return (
    <li className={cs("noxion-list-item", "noxion-list-item--numbered", blockColor && `noxion-color--${blockColor}`)}>
      <div className="noxion-list-item__content">
        <Text value={properties?.title} />
      </div>
      {children && (
        <ol className="noxion-list noxion-list--numbered">
          {children}
        </ol>
      )}
    </li>
  );
});
