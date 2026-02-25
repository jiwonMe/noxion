"use client";

import type { TOCProps } from "@noxion/renderer";

export function TOC({ headings }: TOCProps) {
  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 space-y-3" aria-label="Table of Contents">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">On this page</p>
      <ul className="space-y-2 border-l-2 border-gray-200 dark:border-gray-800">
        {headings.map((heading) => (
          <li key={heading.id} className="pl-4">
            <a
              href={`#${heading.id}`}
              className="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
