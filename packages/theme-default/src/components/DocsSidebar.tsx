"use client";

import type { DocsSidebarProps, DocsSidebarItem } from "@noxion/renderer";

function SidebarItem({ item, currentSlug, depth }: { item: DocsSidebarItem; currentSlug?: string; depth: number }) {
  const isActive = currentSlug === item.slug;
  const paddingLeft = `${depth * 0.75}rem`;
  
  return (
    <li>
      <a
        href={`/${item.slug}`}
        className={
          isActive
            ? "block py-2 px-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-md dark:text-blue-400 dark:bg-blue-950"
            : "block py-2 px-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
        }
        style={{ paddingLeft }}
        aria-current={isActive ? "page" : undefined}
      >
        {item.title}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="mt-1 space-y-1">
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
    <nav className="sticky top-24 space-y-1" aria-label="Documentation navigation">
      <ul className="space-y-1">
        {items.map((item) => (
          <SidebarItem key={item.id} item={item} currentSlug={currentSlug} depth={0} />
        ))}
      </ul>
    </nav>
  );
}
