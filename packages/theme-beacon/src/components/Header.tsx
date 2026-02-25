"use client";

import type { HeaderProps } from "@noxion/renderer";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ siteName, logo, navigation = [] }: HeaderProps) {
  return (
    <header className="w-full border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="max-w-[1320px] mx-auto flex h-14 items-center justify-between px-6">
        <a href="/" className="text-lg font-bold tracking-tight text-neutral-900 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-400 transition-colors">
          {logo || siteName}
        </a>

        <div className="flex items-center gap-6">
          {navigation.length > 0 && (
            <nav className="hidden sm:flex items-center gap-5">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
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
