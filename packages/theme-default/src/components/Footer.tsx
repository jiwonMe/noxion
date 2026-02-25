"use client";

import type { FooterProps } from "@noxion/renderer";
import * as styles from "./Footer.css";

export function Footer({ siteName, author }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span className={styles.copyright}>
        &copy; {year} {author ?? siteName}
      </span>
      <a
        href="https://github.com/jiwonme/noxion"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.poweredBy}
      >
        Powered by Noxion
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </footer>
  );
}
