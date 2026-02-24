"use client";

import type { HeaderProps } from "../theme/types";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ siteName, logo, navigation = [], className }: HeaderProps & { className?: string }) {
  return (
    <header className={className ? `noxion-header ${className}` : "noxion-header"}>
      <a href="/" className="noxion-header__logo">
        {logo || siteName}
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

      <div className="noxion-header__actions">
        <ThemeToggle />
      </div>
    </header>
  );
}
