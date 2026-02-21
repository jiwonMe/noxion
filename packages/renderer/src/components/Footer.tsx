import type { FooterProps } from "../theme/types";

export function Footer({ siteName, author }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="noxion-footer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.5rem",
        borderTop: "1px solid var(--noxion-border, #e5e5e5)",
        fontSize: "0.875rem",
        color: "var(--noxion-mutedForeground, #737373)",
      }}
    >
      <span>
        &copy; {year} {author ?? siteName}
      </span>
      <a
        href="https://github.com/jiwonme/noxion"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "var(--noxion-mutedForeground, #737373)", textDecoration: "none" }}
      >
        Powered by Noxion
      </a>
    </footer>
  );
}
