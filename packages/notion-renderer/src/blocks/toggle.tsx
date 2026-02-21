import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";
import { cs } from "../utils";

export function ToggleBlock({ block, children }: NotionBlockProps) {
  const properties = block.properties as { title?: Decoration[] } | undefined;
  const blockColor = (block.format as { block_color?: string } | undefined)?.block_color;

  return (
    <details className={cs("noxion-toggle", blockColor && `noxion-color--${blockColor}`)}>
      <summary className="noxion-toggle__summary">
        <Text value={properties?.title} />
      </summary>
      {children && (
        <div className="noxion-toggle__content">
          {children}
        </div>
      )}
    </details>
  );
}
