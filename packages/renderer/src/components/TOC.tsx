import type { TOCProps } from "../theme/types";

export function TOC({ headings }: TOCProps) {
  if (headings.length === 0) return null;

  return (
    <nav
      className="noxion-toc"
      aria-label="Table of Contents"
      style={{
        padding: "1rem 0",
        fontSize: "0.875rem",
      }}
    >
      <h4
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--noxion-mutedForeground, #737373)",
          marginBottom: "0.75rem",
        }}
      >
        On this page
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{
              paddingLeft: `${(heading.level - 1) * 0.75}rem`,
              marginBottom: "0.375rem",
            }}
          >
            <a
              href={`#${heading.id}`}
              style={{
                color: "var(--noxion-mutedForeground, #737373)",
                textDecoration: "none",
                lineHeight: 1.5,
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
