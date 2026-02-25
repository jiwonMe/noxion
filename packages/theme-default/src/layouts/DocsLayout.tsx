"use client";

import type { ComponentType } from "react";
import type { NoxionLayoutProps } from "@noxion/renderer";

function renderSlot(slot: ComponentType<Record<string, never>> | null | undefined) {
  if (!slot) return null;
  const Slot = slot;
  return <Slot />;
}

export function DocsLayout({ slots, children, className }: NoxionLayoutProps) {
  const layoutClass = className || "min-h-screen flex flex-col bg-white dark:bg-gray-950";

  return (
    <div className={layoutClass}>
      {slots.header !== null && (
        <div>{renderSlot(slots.header)}</div>
      )}

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          {slots.sidebar && (
            <aside className="w-64 flex-shrink-0">
              {renderSlot(slots.sidebar)}
            </aside>
          )}

          <main className="flex-1 min-w-0 max-w-3xl">
            {children}
          </main>
        </div>
      </div>

      {slots.footer !== null && (
        <div>{renderSlot(slots.footer)}</div>
      )}
    </div>
  );
}
