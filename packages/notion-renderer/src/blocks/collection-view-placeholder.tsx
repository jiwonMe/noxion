import type { NotionBlockProps } from "../types";

export function CollectionViewPlaceholder(_props: NotionBlockProps) {
  return (
    <div className="noxion-collection-view-placeholder">
      <span className="noxion-collection-view-placeholder__label">
        Database view
      </span>
    </div>
  );
}
