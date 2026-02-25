import type { FooterProps } from "@noxion/renderer";
import * as styles from "./Footer.css";

export function Footer({ siteName, author }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          &copy; {year} {author ?? siteName}
        </span>

        <a
          href="https://github.com/jiwonme/noxion"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Powered by Noxion
        </a>
      </div>
    </footer>
  );
}
