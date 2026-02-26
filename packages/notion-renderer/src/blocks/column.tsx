import React from "react";
import type { NotionBlockProps } from "../types";
export const ColumnBlock = React.memo(function ColumnBlock({ block, children }: NotionBlockProps) {
  const format = block.format as { column_ratio?: number } | undefined;
  const ratio = format?.column_ratio ?? 1;

  return (
    <div className="noxion-column" style={{ flex: ratio }}>
      {children}
    </div>
  );
});
