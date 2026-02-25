"use client";

import type { HeaderProps } from "@noxion/renderer";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ siteName, logo, navigation = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
          {logo || siteName}
        </a>

        {navigation.length > 0 && (
          <nav className="flex items-center gap-6">
            {navigation.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
