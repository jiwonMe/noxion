"use client";

import type { ComponentType } from "react";
import type { NoxionLayoutProps } from "@noxion/renderer";
import * as styles from "./DocsLayout.css";

function renderSlot(slot: ComponentType<Record<string, never>> | null | undefined) {
  if (!slot) return null;
  const Slot = slot;
  return <Slot />;
}

export function DocsLayout({ slots, children, className }: NoxionLayoutProps) {
  const layoutClass = className ? `${styles.layout} ${className}` : styles.layout;

  return (
    <div className={layoutClass}>
      {slots.header !== null && (
        <div className={styles.headerSlot}>{renderSlot(slots.header)}</div>
      )}

      <div className={styles.main}>
        {slots.sidebar && (
          <aside className={styles.sidebar}>{renderSlot(slots.sidebar)}</aside>
        )}

        <main className={styles.content}>
          {children}
        </main>
      </div>

      {slots.footer !== null && (
        <div className={styles.footerSlot}>{renderSlot(slots.footer)}</div>
      )}
    </div>
  );
}
