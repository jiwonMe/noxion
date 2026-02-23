import type { DocsBreadcrumbProps } from "../theme/types";

export function DocsBreadcrumb({ items, className }: DocsBreadcrumbProps & { className?: string }) {
  if (items.length === 0) return null;

  return (
    <nav
      className={className ? `noxion-docs-breadcrumb ${className}` : "noxion-docs-breadcrumb"}
      aria-label="Breadcrumb"
    >
      <ol className="noxion-docs-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="noxion-docs-breadcrumb__item">
              {item.href && !isLast ? (
                <a href={item.href} className="noxion-docs-breadcrumb__link">
                  {item.label}
                </a>
              ) : (
                <span className="noxion-docs-breadcrumb__current" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="noxion-docs-breadcrumb__separator" aria-hidden="true">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
