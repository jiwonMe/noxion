"use client";

import type { HeaderProps } from "@noxion/renderer";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ siteName, logo, navigation = [] }: HeaderProps) {
  return (
    <header className="">
      <a href="/" className="">
        {logo || siteName}
      </a>

      {navigation.length > 0 && (
        <nav className="">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="">
              {item.label}
            </a>
          ))}
        </nav>
      )}

      <div className="">
        <ThemeToggle />
      </div>
    </header>
  );
}
