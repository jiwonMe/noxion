import type { DocsBreadcrumbProps } from "@noxion/renderer";

export function DocsBreadcrumb({ items }: DocsBreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <a href={item.href} className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                  {item.label}
                </a>
              ) : (
                <span
                  className={isLast ? "text-neutral-700 dark:text-neutral-300 font-medium" : ""}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-neutral-300 dark:text-neutral-600" aria-hidden="true">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
