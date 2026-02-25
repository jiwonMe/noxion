import type { DocsSidebarProps, DocsSidebarItem } from "@noxion/renderer";

function SidebarItem({ item, currentSlug, depth }: { item: DocsSidebarItem; currentSlug?: string; depth: number }) {
  const isActive = currentSlug === item.slug;
  const clampedDepth = Math.min(depth, 5);
  const linkClass = [
    "block py-1 text-sm transition-colors",
    isActive
      ? "font-medium text-neutral-900 dark:text-neutral-100"
      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
  ].join(" ");

  return (
    <li className="space-y-0.5">
      <a
        href={`/${item.slug}`}
        className={linkClass}
        style={{ paddingLeft: `${clampedDepth * 0.75}rem` }}
        aria-current={isActive ? "page" : undefined}
      >
        {item.title}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="space-y-0.5">
          {item.children.map((child) => (
            <SidebarItem key={child.id} item={child} currentSlug={currentSlug} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function DocsSidebar({ items, currentSlug }: DocsSidebarProps) {
  if (items.length === 0) return null;

  return (
    <nav className="w-56 shrink-0" aria-label="Documentation navigation">
      <ul className="space-y-0.5">
        {items.map((item) => (
          <SidebarItem key={item.id} item={item} currentSlug={currentSlug} depth={0} />
        ))}
      </ul>
    </nav>
  );
}
