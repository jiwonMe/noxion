"use client";

import type { DocsBreadcrumbProps } from "@noxion/renderer";
import * as styles from "./DocsBreadcrumb.css";

export function DocsBreadcrumb({ items }: DocsBreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className={styles.item}>
              {item.href && !isLast ? (
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              ) : (
                <span
                  className={isLast ? styles.current : styles.link}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className={styles.separator} aria-hidden="true">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
