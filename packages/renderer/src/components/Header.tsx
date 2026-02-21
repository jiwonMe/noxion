import type { HeaderProps } from "../theme/types";

export function Header({ siteName, navigation = [] }: HeaderProps) {
  return (
    <header
      className="noxion-header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--noxion-border, #e5e5e5)",
        backgroundColor: "var(--noxion-background, #fff)",
      }}
    >
      <a
        href="/"
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--noxion-foreground, #000)",
          textDecoration: "none",
        }}
      >
        {siteName}
      </a>

      {navigation.length > 0 && (
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                fontSize: "0.875rem",
                color: "var(--noxion-mutedForeground, #737373)",
                textDecoration: "none",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
