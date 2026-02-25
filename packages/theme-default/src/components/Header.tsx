"use client";

import type { HeaderProps } from "@noxion/renderer";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ siteName, logo, navigation = [] }: HeaderProps) {
  return (
    <header className="w-full bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto flex items-center justify-between px-9 py-12 max-w-[1200px]">
        <a href="/" className="text-2xl font-semibold tracking-tight text-black hover:opacity-70 transition-opacity dark:text-gray-100">
          {logo || siteName}
        </a>

        <div className="flex items-center gap-8">
          {navigation.length > 0 && (
            <nav className="hidden sm:flex items-center gap-6">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-xs font-medium text-black/80 hover:text-black transition-colors dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
