import type { HeaderProps } from "../theme/types";

export function Header({ siteName, navigation = [], className }: HeaderProps & { className?: string }) {
  return (
    <header className={className ? `noxion-header ${className}` : "noxion-header"}>
      <a href="/" className="noxion-header__logo">
        {siteName}
      </a>

      {navigation.length > 0 && (
        <nav className="noxion-header__nav">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="noxion-header__nav-link">
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
