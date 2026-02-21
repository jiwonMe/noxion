import type { NotionBlockProps } from "../types";

export function ColumnBlock({ block, children }: NotionBlockProps) {
  const format = block.format as { column_ratio?: number } | undefined;
  const ratio = format?.column_ratio ?? 1;

  return (
    <div className="noxion-column" style={{ flex: ratio }}>
      {children}
    </div>
  );
}
