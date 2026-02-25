"use client";

import type { ComponentType } from "react";
import type { NoxionLayoutProps } from "@noxion/renderer";

function renderSlot(slot: ComponentType<Record<string, never>> | null | undefined) {
  if (!slot) return null;
  const Slot = slot;
  return <Slot />;
}

export function BaseLayout({ slots, children, className }: NoxionLayoutProps) {
  const layoutClass = className || "min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]";

  return (
    <div className={layoutClass}>
      {slots.header !== null && (
        <div>{renderSlot(slots.header)}</div>
      )}

      {slots.hero && (
        <div className="mx-auto w-full px-9 py-12 max-w-[1200px]">
          {renderSlot(slots.hero)}
        </div>
      )}

      <main className="flex-1 mx-auto w-full px-9 py-12 max-w-[1200px]">
        {children}
      </main>

      {slots.footer !== null && (
        <div>{renderSlot(slots.footer)}</div>
      )}
    </div>
  );
}
