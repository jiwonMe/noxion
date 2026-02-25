import type { ComponentType } from "react";
import type { NoxionLayoutProps } from "@noxion/renderer";

function renderSlot(slot: ComponentType<Record<string, never>> | null | undefined) {
  if (!slot) return null;
  const Slot = slot;
  return <Slot />;
}

export function BlogLayout({ slots, children, className }: NoxionLayoutProps) {
  const layoutClass = className || "min-h-screen flex flex-col bg-white dark:bg-neutral-950";

  return (
    <div className={layoutClass}>
      {slots.header !== null && (
        <div>{renderSlot(slots.header)}</div>
      )}

      {slots.hero && (
        <div className="max-w-7xl mx-auto w-full px-6 py-10">
          {renderSlot(slots.hero)}
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      {slots.footer !== null && (
        <div>{renderSlot(slots.footer)}</div>
      )}
    </div>
  );
}
