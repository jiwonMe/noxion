import type { Decoration } from "notion-types";
import type { NotionBlockProps } from "../types";
import { cs } from "../utils";

export function EquationBlock({ block }: NotionBlockProps) {
  const properties = block.properties as { title?: Decoration[] } | undefined;
  const blockColor = (block.format as { block_color?: string } | undefined)?.block_color;

  const expression = properties?.title
    ?.map((segment) => segment[0])
    .join("") ?? "";

  try {
    const katex = require("katex");
    const html = katex.renderToString(expression, {
      displayMode: true,
      throwOnError: false,
    });

    return (
      <div
        className={cs("noxion-equation", "noxion-equation--block", blockColor && `noxion-color--${blockColor}`)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return (
      <div className={cs("noxion-equation", "noxion-equation--error", blockColor && `noxion-color--${blockColor}`)}>
        <code>{expression}</code>
      </div>
    );
  }
}
