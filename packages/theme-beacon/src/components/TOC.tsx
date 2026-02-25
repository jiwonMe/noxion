import type { TOCProps } from "@noxion/renderer";
import * as styles from "./TOC.css";

export function TOC({ headings }: TOCProps) {
  if (headings.length === 0) return null;

  return (
    <nav className={styles.toc} aria-label="Table of Contents">
      <p className={styles.heading}>On this page</p>
      <ul className={styles.list}>
        {headings.map((heading) => (
          <li key={heading.id} className={styles.item}>
            <a
              href={`#${heading.id}`}
              className={`${styles.link} ${styles.depthIndent[heading.level] ?? styles.depthIndent[1]}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
