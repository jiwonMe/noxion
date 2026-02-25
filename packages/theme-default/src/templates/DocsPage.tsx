"use client";

import type { NoxionTemplateProps, DocsNavigationLink } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";
import * as styles from "./DocsPage.css";

export function DocsPage({ data }: NoxionTemplateProps) {
  const recordMap = data.recordMap;
  const rootPageId = data.rootPageId as string | undefined;
  const prev = data.prev as DocsNavigationLink | undefined;
  const next = data.next as DocsNavigationLink | undefined;

  if (!recordMap) {
    return <div className={styles.notFound}>Page not found.</div>;
  }

  return (
    <div className={styles.page}>
      <NotionPage recordMap={recordMap} rootPageId={rootPageId} />

      {(prev || next) && (
        <nav className={styles.docsNav} aria-label="Page navigation">
          <div>
            {prev && (
              <a href={`/${prev.slug}`} className={styles.navLink}>
                <span className={styles.navLabel}>← Previous</span>
                <span className={styles.navTitle}>{prev.title}</span>
              </a>
            )}
          </div>
          <div className={styles.navNext}>
            {next && (
              <a href={`/${next.slug}`} className={`${styles.navLink} ${styles.navNext}`}>
                <span className={styles.navLabel}>Next →</span>
                <span className={styles.navTitle}>{next.title}</span>
              </a>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
