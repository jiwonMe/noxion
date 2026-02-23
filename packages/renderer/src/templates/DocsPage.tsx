import type { NoxionTemplateProps } from "../theme/types";
import type { DocsNavigationLink } from "../theme/types";
import { NotionPage } from "../components/NotionPage";
import type { ExtendedRecordMap } from "notion-types";

export function DocsPage({ data, className }: NoxionTemplateProps) {
  const recordMap = data.recordMap as ExtendedRecordMap | undefined;
  const rootPageId = data.rootPageId as string | undefined;
  const prev = data.prev as DocsNavigationLink | undefined;
  const next = data.next as DocsNavigationLink | undefined;

  if (!recordMap) {
    return (
      <div className="noxion-empty-state">
        <p className="noxion-empty-state__message">Page not found.</p>
      </div>
    );
  }

  return (
    <div className={className ? `noxion-template-docs ${className}` : "noxion-template-docs"}>
      <NotionPage recordMap={recordMap} rootPageId={rootPageId} />

      {(prev || next) && (
        <nav className="noxion-docs-nav" aria-label="Page navigation">
          <div className="noxion-docs-nav__prev">
            {prev && (
              <a href={`/${prev.slug}`} className="noxion-docs-nav__link">
                <span className="noxion-docs-nav__label">Previous</span>
                <span className="noxion-docs-nav__title">{prev.title}</span>
              </a>
            )}
          </div>
          <div className="noxion-docs-nav__next">
            {next && (
              <a href={`/${next.slug}`} className="noxion-docs-nav__link">
                <span className="noxion-docs-nav__label">Next</span>
                <span className="noxion-docs-nav__title">{next.title}</span>
              </a>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
