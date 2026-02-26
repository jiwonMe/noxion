import React from "react";
import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";
import { cs } from "../utils";
import { getAriaLabel } from "../utils/a11y";

export const CalloutBlock = React.memo(function CalloutBlock({ block, children }: NotionBlockProps) {
  const properties = block.properties as { title?: Decoration[] } | undefined;
  const format = block.format as { page_icon?: string; block_color?: string } | undefined;
  const icon = format?.page_icon;
  const blockColor = format?.block_color;
  const ariaLabel = getAriaLabel(block);

  return (
    <div
      role="note"
      aria-label={ariaLabel}
      className={cs("noxion-callout", blockColor && `noxion-color--${blockColor}`)}
    >
      {icon && (
        <div className="noxion-callout__icon">
          <span role="img" aria-label="callout icon">{icon}</span>
        </div>
      )}
      <div className="noxion-callout__content">
        <Text value={properties?.title} />
        {children}
      </div>
    </div>
  );
});
