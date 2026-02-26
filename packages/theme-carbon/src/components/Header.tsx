"use client";

import { useState } from "react";
import type { HeaderProps } from "@noxion/renderer";
import { ThemeToggle } from "./ThemeToggle";
import { SearchIcon, MenuIcon, CloseIcon } from "./Icons";

export function Header({ siteName, logo, navigation = [] }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex h-12 max-w-[var(--width-content)] items-center justify-between px-0">
        {/* Left: hamburger + logo */}
        <div className="flex items-center">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-12 w-12 items-center justify-center text-[var(--color-foreground)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-hover)] lg:hidden"
          >
            {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>

          <a
            href="/"
            className="flex h-12 items-center px-4 text-sm font-semibold tracking-tight text-[var(--color-foreground)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:text-[var(--color-primary)]"
          >
            {logo || siteName}
          </a>
        </div>

        {/* Center: desktop nav */}
        {navigation.length > 0 && (
          <nav className="hidden items-center lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative flex h-12 items-center px-4 text-sm text-[var(--color-muted-foreground)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-hover)] hover:text-[var(--color-foreground)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Right: search + theme toggle */}
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-12 w-12 items-center justify-center text-[var(--color-foreground)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-hover)]"
          >
            <SearchIcon size={20} />
          </button>
          <ThemeToggle className="inline-flex h-12 w-12 items-center justify-center text-[var(--color-muted-foreground)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-hover)] hover:text-[var(--color-foreground)]" />
        </div>
      </div>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <nav className="border-t border-[var(--color-border)] bg-[var(--color-background)] lg:hidden">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block border-b border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-foreground)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-hover)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
