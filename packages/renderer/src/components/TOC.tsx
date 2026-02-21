import type { TOCProps } from "../theme/types";

export function TOC({ headings, className }: TOCProps & { className?: string }) {
  if (headings.length === 0) return null;

  return (
    <nav
      className={className ? `noxion-toc ${className}` : "noxion-toc"}
      aria-label="Table of Contents"
    >
      <h4 className="noxion-toc__heading">On this page</h4>
      <ul className="noxion-toc__list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className="noxion-toc__item"
            style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
          >
            <a href={`#${heading.id}`} className="noxion-toc__link">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
