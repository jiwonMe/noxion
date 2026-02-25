import type { TOCProps } from "@noxion/renderer";

export function TOC({ headings }: TOCProps) {
  if (headings.length === 0) return null;

  return (
    <nav className="space-y-3" aria-label="Table of Contents">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">On this page</p>
      <ul className="space-y-1.5">
        {headings.map((heading) => (
          <li key={heading.id} className="">
            <a
              href={`#${heading.id}`}
              className={"block text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors truncate"}
              style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
