"use client";

import type { NoxionTemplateProps, DocsNavigationLink } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";

export function DocsPage({ data }: NoxionTemplateProps) {
  const recordMap = data.recordMap;
  const rootPageId = data.rootPageId as string | undefined;
  const prev = data.prev as DocsNavigationLink | undefined;
  const next = data.next as DocsNavigationLink | undefined;

  if (!recordMap) {
    return <div className="">Page not found.</div>;
  }

  return (
    <div className="">
      <NotionPage recordMap={recordMap} rootPageId={rootPageId} />

      {(prev || next) && (
        <nav className="" aria-label="Page navigation">
          <div>
            {prev && (
              <a href={`/${prev.slug}`} className="">
                <span className="">← Previous</span>
                <span className="">{prev.title}</span>
              </a>
            )}
          </div>
          <div className="">
            {next && (
              <a href={`/${next.slug}`} className={""}>
                <span className="">Next →</span>
                <span className="">{next.title}</span>
              </a>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
