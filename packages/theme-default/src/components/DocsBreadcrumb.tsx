"use client";

import type { DocsBreadcrumbProps } from "@noxion/renderer";

export function DocsBreadcrumb({ items }: DocsBreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <a 
                  href={item.href} 
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={isLast ? "font-medium text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-gray-400 dark:text-gray-600" aria-hidden="true">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
