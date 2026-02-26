import React from "react";
import type { NotionBlockProps } from "../types";
export const ColumnListBlock = React.memo(function ColumnListBlock({ children }: NotionBlockProps) {
  return (
    <div className="noxion-column-list">
      {children}
    </div>
  );
});
