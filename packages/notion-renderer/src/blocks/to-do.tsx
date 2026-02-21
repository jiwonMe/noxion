import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { Text } from "../components/text";
import { cs } from "../utils";

export function ToDoBlock({ block, blockId, children }: NotionBlockProps) {
  const properties = block.properties as {
    title?: Decoration[];
    checked?: (["Yes"] | ["No"])[];
  } | undefined;
  const blockColor = (block.format as { block_color?: string } | undefined)?.block_color;

  const isChecked = properties?.checked?.[0]?.[0] === "Yes";

  return (
    <div className={cs("noxion-to-do", isChecked && "noxion-to-do--checked", blockColor && `noxion-color--${blockColor}`)}>
      <div className="noxion-to-do__checkbox">
        <input
          type="checkbox"
          checked={isChecked}
          readOnly
          aria-label="To-do checkbox"
          id={`todo-${blockId}`}
        />
      </div>
      <div className="noxion-to-do__content">
        <Text value={properties?.title} />
      </div>
      {children}
    </div>
  );
}
