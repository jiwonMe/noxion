import type { TOCProps } from "@noxion/renderer";

export function TOC({ headings }: TOCProps) {
  if (headings.length === 0) return null;

  return (
    <nav className="" aria-label="Table of Contents">
      <p className="">On this page</p>
      <ul className="">
        {headings.map((heading) => (
          <li key={heading.id} className="">
            <a
              href={`#${heading.id}`}
              className={""}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
