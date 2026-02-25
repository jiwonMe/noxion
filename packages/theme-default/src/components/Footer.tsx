"use client";

import type { FooterProps } from "@noxion/renderer";

export function Footer({ siteName, author }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 pt-8 pb-12 border-t border-[#e6e6e6] bg-white dark:bg-[#0a0a0a] dark:border-gray-800">
      <div className="mx-auto max-w-[1200px] px-9 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#757575] dark:text-gray-500">
        <span>
          {author ?? siteName} &copy; {year}
        </span>
        <a
          href="https://github.com/jiwonme/noxion"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-black dark:hover:text-gray-100 transition-colors"
        >
          Powered by Noxion
        </a>
      </div>
    </footer>
  );
}
