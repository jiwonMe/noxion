import type { DocsSidebarProps, DocsSidebarItem } from "@noxion/renderer";
import * as styles from "./DocsSidebar.css";

function SidebarItem({ item, currentSlug, depth }: { item: DocsSidebarItem; currentSlug?: string; depth: number }) {
  const isActive = currentSlug === item.slug;
  const clampedDepth = Math.min(depth, 5);
  const linkClass = [styles.link, styles.depthIndent[clampedDepth], isActive ? styles.linkActive : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={styles.item}>
      <a
        href={`/${item.slug}`}
        className={linkClass}
        aria-current={isActive ? "page" : undefined}
      >
        {item.title}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className={styles.list}>
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
    <nav className={styles.nav} aria-label="Documentation navigation">
      <ul className={styles.list}>
        {items.map((item) => (
          <SidebarItem key={item.id} item={item} currentSlug={currentSlug} depth={0} />
        ))}
      </ul>
    </nav>
  );
}
