"use client";

import React, { useState } from "react";
import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";
import { cs } from "../utils";
import { getToggleContentId, handleKeyboardActivation } from "../utils/a11y";

export function ToggleBlock({ block, blockId, children }: NotionBlockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const properties = block.properties as { title?: Decoration[] } | undefined;
  const blockColor = (block.format as { block_color?: string } | undefined)?.block_color;
  const contentId = getToggleContentId(blockId);

  return (
    <details
      open={isOpen}
      onToggle={(e: React.SyntheticEvent<HTMLDetailsElement>) =>
        setIsOpen((e.target as HTMLDetailsElement).open)
      }
      className={cs("noxion-toggle", blockColor && `noxion-color--${blockColor}`)}
    >
      <summary
        role="button"
        aria-expanded={isOpen ? "true" : "false"}
        aria-controls={contentId}
        onKeyDown={(e) => handleKeyboardActivation(e, () => setIsOpen(!isOpen))}
        tabIndex={0}
        className="noxion-toggle__summary"
      >
        <Text value={properties?.title} />
      </summary>
      {children && (
        <div id={contentId} className="noxion-toggle__content">
          {children}
        </div>
      )}
    </details>
  );
}
