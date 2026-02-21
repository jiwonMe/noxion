import type { NotionBlockProps } from "../types";

export function ColumnListBlock({ children }: NotionBlockProps) {
  return (
    <div className="noxion-column-list">
      {children}
    </div>
  );
}
