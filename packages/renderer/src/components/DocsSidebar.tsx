import type { DocsSidebarProps, DocsSidebarItem } from "../theme/types";

function SidebarItem({ item, currentSlug, depth = 0 }: { item: DocsSidebarItem; currentSlug?: string; depth?: number }) {
  const isActive = currentSlug === item.slug;
  const hasChildren = item.children && item.children.length > 0;
  const baseClass = isActive
    ? "noxion-docs-sidebar__link noxion-docs-sidebar__link--active"
    : "noxion-docs-sidebar__link";

  return (
    <li className="noxion-docs-sidebar__item">
      <a
        href={`/${item.slug}`}
        className={baseClass}
        style={{ paddingLeft: `${depth * 0.75 + 0.5}rem` }}
        aria-current={isActive ? "page" : undefined}
      >
        {item.title}
      </a>
      {hasChildren && (
        <ul className="noxion-docs-sidebar__list">
          {item.children!.map((child) => (
            <SidebarItem key={child.id} item={child} currentSlug={currentSlug} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function DocsSidebar({ items, currentSlug, className }: DocsSidebarProps & { className?: string }) {
  if (items.length === 0) return null;

  return (
    <nav
      className={className ? `noxion-docs-sidebar ${className}` : "noxion-docs-sidebar"}
      aria-label="Documentation navigation"
    >
      <ul className="noxion-docs-sidebar__list">
        {items.map((item) => (
          <SidebarItem key={item.id} item={item} currentSlug={currentSlug} />
        ))}
      </ul>
    </nav>
  );
}
