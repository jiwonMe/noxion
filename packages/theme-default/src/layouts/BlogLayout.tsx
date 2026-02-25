"use client";

import type { ComponentType } from "react";
import type { NoxionLayoutProps } from "@noxion/renderer";
import * as styles from "./BlogLayout.css";

function renderSlot(slot: ComponentType<Record<string, never>> | null | undefined) {
  if (!slot) return null;
  const Slot = slot;
  return <Slot />;
}

export function BlogLayout({ slots, children, className }: NoxionLayoutProps) {
  const layoutClass = className ? `${styles.layout} ${className}` : styles.layout;

  return (
    <div className={layoutClass}>
      {slots.header !== null && (
        <div className={styles.headerSlot}>{renderSlot(slots.header)}</div>
      )}

      <main className={styles.content}>
        {children}
      </main>

      {slots.footer !== null && (
        <div className={styles.footerSlot}>{renderSlot(slots.footer)}</div>
      )}
    </div>
  );
}
