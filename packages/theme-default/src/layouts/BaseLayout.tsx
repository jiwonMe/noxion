"use client";

import type { ComponentType } from "react";
import type { NoxionLayoutProps } from "@noxion/renderer";

function renderSlot(slot: ComponentType<Record<string, never>> | null | undefined) {
  if (!slot) return null;
  const Slot = slot;
  return <Slot />;
}

export function BaseLayout({ slots, children, className }: NoxionLayoutProps) {
  const layoutClass = className || "min-h-screen flex flex-col bg-white dark:bg-gray-950";

  return (
    <div className={layoutClass}>
      {slots.header !== null && (
        <div>{renderSlot(slots.header)}</div>
      )}

      {slots.hero && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {renderSlot(slots.hero)}
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {slots.footer !== null && (
        <div>{renderSlot(slots.footer)}</div>
      )}
    </div>
  );
}
