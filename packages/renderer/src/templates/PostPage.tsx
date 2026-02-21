import type { NoxionTemplateProps } from "../theme/types";
import { NotionPage } from "../components/NotionPage";
import type { ExtendedRecordMap } from "notion-types";

export function PostPage({ data, className }: NoxionTemplateProps) {
  const recordMap = data.recordMap as ExtendedRecordMap | undefined;
  const rootPageId = data.rootPageId as string | undefined;

  if (!recordMap) {
    return (
      <div className="noxion-empty-state">
        <p className="noxion-empty-state__message">Post not found.</p>
      </div>
    );
  }

  return (
    <div className={className ? `noxion-template-post ${className}` : "noxion-template-post"}>
      <NotionPage recordMap={recordMap} rootPageId={rootPageId} />
    </div>
  );
}
