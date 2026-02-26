import type { ComponentType } from "react";
import type { NoxionLayoutProps } from "@noxion/renderer";

function renderSlot(slot: ComponentType<Record<string, never>> | null | undefined) {
  if (!slot) return null;
  const Slot = slot;
  return <Slot />;
}

export function BlogLayout({ slots, children, className }: NoxionLayoutProps) {
  const layoutClass =
    className ||
    "min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] font-[var(--font-sans)]";

  return (
    <div className={layoutClass}>
      {slots.header !== null && <div>{renderSlot(slots.header)}</div>}

      {slots.hero && (
        <div className="mx-auto w-full max-w-[var(--width-content)]">
          {renderSlot(slots.hero)}
        </div>
      )}

      <main className="mx-auto w-full max-w-[var(--width-content)] flex-1 px-0 py-0">
        {children}
      </main>

      {slots.footer !== null && <div>{renderSlot(slots.footer)}</div>}
    </div>
  );
}
