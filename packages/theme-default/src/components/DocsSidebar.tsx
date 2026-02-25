"use client";

import type { DocsSidebarProps, DocsSidebarItem } from "@noxion/renderer";

function SidebarItem({ item, currentSlug, depth }: { item: DocsSidebarItem; currentSlug?: string; depth: number }) {
  const isActive = currentSlug === item.slug;
  const clampedDepth = Math.min(depth, 5);
  const linkClass = ["", "", isActive ? "" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <li className="">
      <a
        href={`/${item.slug}`}
        className={linkClass}
        aria-current={isActive ? "page" : undefined}
      >
        {item.title}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="">
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
    <nav className="" aria-label="Documentation navigation">
      <ul className="">
        {items.map((item) => (
          <SidebarItem key={item.id} item={item} currentSlug={currentSlug} depth={0} />
        ))}
      </ul>
    </nav>
  );
}
