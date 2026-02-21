import type { NoxionLayoutProps } from "../theme/types";
import type { ComponentType } from "react";

function renderSlot(slot: ComponentType<any> | null | undefined): React.ReactNode {
  if (slot === null || slot === undefined) return null;
  const SlotComponent = slot;
  return <SlotComponent />;
}

export function MagazineLayout({ slots, children, className }: NoxionLayoutProps) {
  return (
    <div className={className ? `noxion-layout ${className}` : "noxion-layout"}>
      {slots.header !== null && (
        <div className="noxion-layout__header">{renderSlot(slots.header)}</div>
      )}

      {slots.hero !== null && slots.hero !== undefined && (
        <div className="noxion-layout__hero">{renderSlot(slots.hero)}</div>
      )}

      <div className="noxion-layout__content">
        {children}
      </div>

      {slots.footer !== null && (
        <div className="noxion-layout__footer">{renderSlot(slots.footer)}</div>
      )}
    </div>
  );
}
