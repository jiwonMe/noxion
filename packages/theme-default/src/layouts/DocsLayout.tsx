"use client";

import type { ComponentType } from "react";
import type { NoxionLayoutProps } from "@noxion/renderer";

function renderSlot(slot: ComponentType<Record<string, never>> | null | undefined) {
  if (!slot) return null;
  const Slot = slot;
  return <Slot />;
}

export function DocsLayout({ slots, children, className }: NoxionLayoutProps) {
  const layoutClass = className ? "" : "";

  return (
    <div className={layoutClass}>
      {slots.header !== null && (
        <div className="">{renderSlot(slots.header)}</div>
      )}

      <div className="">
        {slots.sidebar && (
          <aside className="">{renderSlot(slots.sidebar)}</aside>
        )}

        <main className="">
          {children}
        </main>
      </div>

      {slots.footer !== null && (
        <div className="">{renderSlot(slots.footer)}</div>
      )}
    </div>
  );
}
