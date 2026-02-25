"use client";

import type { HeaderProps } from "@noxion/renderer";
import { ThemeToggle } from "./ThemeToggle";
import * as styles from "./Header.css";

export function Header({ siteName, logo, navigation = [] }: HeaderProps) {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.logo}>
        {logo || siteName}
      </a>

      {navigation.length > 0 && (
        <nav className={styles.nav}>
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>
      )}

      <div className={styles.actions}>
        <ThemeToggle />
      </div>
    </header>
  );
}
