import type { NoxionLayoutProps } from "../theme/types";
import type { ComponentType } from "react";

function renderSlot(slot: ComponentType<any> | null | undefined): React.ReactNode {
  if (slot === null || slot === undefined) return null;
  const SlotComponent = slot;
  return <SlotComponent />;
}

export function DocsLayout({ slots, children, className }: NoxionLayoutProps) {
  return (
    <div className={className ? `noxion-layout noxion-layout--sidebar-left ${className}` : "noxion-layout noxion-layout--sidebar-left"}>
      {slots.header !== null && (
        <div className="noxion-layout__header">{renderSlot(slots.header)}</div>
      )}

      <div className="noxion-layout__main">
        {slots.sidebar !== null && slots.sidebar !== undefined && (
          <aside className="noxion-layout__sidebar">{renderSlot(slots.sidebar)}</aside>
        )}

        <div className="noxion-layout__content">
          {children}
        </div>
      </div>

      {slots.footer !== null && (
        <div className="noxion-layout__footer">{renderSlot(slots.footer)}</div>
      )}
    </div>
  );
}
