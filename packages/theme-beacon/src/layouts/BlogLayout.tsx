import type { ComponentType } from "react";
import type { NoxionLayoutProps } from "@noxion/renderer";

function renderSlot(slot: ComponentType<Record<string, never>> | null | undefined) {
  if (!slot) return null;
  const Slot = slot;
  return <Slot />;
}

export function BlogLayout({ slots, children, className }: NoxionLayoutProps) {
  const layoutClass = className ? "" : "";

  return (
    <div className={layoutClass}>
      {slots.header !== null && (
        <div className="">{renderSlot(slots.header)}</div>
      )}

      <main className="">
        {children}
      </main>

      {slots.footer !== null && (
        <div className="">{renderSlot(slots.footer)}</div>
      )}
    </div>
  );
}
