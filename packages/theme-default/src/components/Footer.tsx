"use client";

import type { FooterProps } from "@noxion/renderer";

export function Footer({ siteName, author }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-8 px-4 sm:px-6 lg:px-8 text-sm text-gray-600 dark:text-gray-400">
        <span>
          &copy; {year} {author ?? siteName}
        </span>
        <a
          href="https://github.com/jiwonme/noxion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Powered by Noxion
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
