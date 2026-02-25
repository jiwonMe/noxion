"use client";

import type { DocsBreadcrumbProps } from "@noxion/renderer";

export function DocsBreadcrumb({ items }: DocsBreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className="" aria-label="Breadcrumb">
      <ol className="">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="">
              {item.href && !isLast ? (
                <a href={item.href} className="">
                  {item.label}
                </a>
              ) : (
                <span
                  className={isLast ? "" : ""}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="" aria-hidden="true">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
